const child_process = require('child_process');
const ENV = process.env
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser')
//const passport = require('passport')
const session = require('express-session');
const app = express()
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
//app.use(passport.initialize());
//app.use(passport.session());
const port = ENV.PORT || 2999;
const cbor = require('cbor');
const request = require('request')
const crypto = require('crypto')
const { createHash } = require('crypto')
const { protobuf } = require('sawtooth-sdk')


const { createContext, CryptoFactory } = require('sawtooth-sdk/signing')

const context = createContext('secp256k1')
const privateKey = context.newRandomPrivateKey() //replace with private key from fs
const signer = new CryptoFactory(context).newSigner(privateKey)
//console.log({ privateKey, signer })
// email agent signing
const jwt = require('jsonwebtoken')
const sessionSecretKey = crypto.randomBytes(256).toString('base64') //attempts to break a jwt upon restarts incase of malicious code injection
//console.log(sessionSecretKey) session 

app.use(session({ secret: sessionSecretKey }));
const jwtOptions = {
  algorithm: 'HS256',
  expiresIn: '5m',
}

const generateLoginJWT = (user) => {
  return new Promise((resolve, reject) => {
    return jwt.sign(
      { sub: user },
      sessionSecretKey,
      jwtOptions,
      (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      },
    )
  })
}

function authed(user) {
  var auth = false
  try {
    if (user && localUsers[jwt.verify(user.token, sessionSecretKey).sub] != null) {
      auth = true    //If session exists, proceed to page
    }
  } catch (e) { }
  return auth
}
/*
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const jwtOpts = {
  secretOrKey: sessionSecretKey, //the same one we used for token generation
  algorithm: 'HS256', //the same one we used for token generation
  jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'), //how we want to extract token from the request
}
*/
// dirty db for dev ...
var localUsers = {
  uuid: {}
} //store in fs, or announce distributed encrypted if signer is networked
/*
passport.use('jwt', new JwtStrategy(jwtOpts, (token, done) => {
  console.log(token)
  const uuid = token.sub
  if (localUsers[uuid] == null) {
    console.log('huge fail', uuid)
    done(null, false)
  } else {
    console.log({ uuid })
    done(null, uuid)
  }
})
)
*/
app.get('/login', (req, res, next) => {
  const { token } = req.query
  if (token) {
    const uuid = jwt.verify(token, sessionSecretKey).sub
    if (localUsers[uuid] == null) {
      console.log('huge fail', uuid)
      res.redirect('/login')
    } else {
      req.session.user = { token, uuid }
      res.setHeader('Content-Type', 'text/html');
      res.send(`<html><head><title>Success</title></head><body><h1>${uuid} Logged in.</h1><a href="/adv-build">build and sign intkey transaction</a>
</body></html>`)
    }
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.send(` <html><head><title>Login</title></head><body><form action="/login" method="post">
  Email:<br>
  <input type="text" id="email" name="email"><br>
  Submit:<br>
  <input type="submit" name="Send it!">
</form></body></html>`)
  }
});

app.get('/login-check-email', (req, res, next) => {
  res.send(`<html><head><title>Login</title></head><body><h1>Check Email</h1></body></html>`)
});

app.post('/login', (req, res, next) => {
  const email = req.body.email
  if (localUsers[email] == null
    //&& validEmail(email) 
  ) {
    const ct = createContext('secp256k1')
    const pKey = ct.newRandomPrivateKey()
    localUsers[email] = {
      aKey: pKey //agent key
    }
    generateLoginJWT(email).then(loginToken => {
      //sendWelcomeEmail(email, loginToken, pKey) //remove the token shortcut below
      res.redirect(`/login?token=${loginToken}`) //change to login-check redirect
    })
  } else //if(validEmail(email))
  {
    generateLoginJWT(email).then(loginToken => {
      //sendAuthenticationEmail(email, loginToken)
      res.redirect('/login-check-email')
    })
  }
})
app.get('/adv-build', (req, res, next) => {
  var auth = false
  if (req.session) auth = authed(req.session.user)
  if (!auth) {
    delete req.session
    res.redirect('/login')
  } else {
    var payload = {
      [req.query.vt || 'Verb']: req.query.verb || 'inc',
      [req.query.nt || 'Name']: req.query.action || 'tes',
      [req.query.at || 'Value']: req.query.desc || parseInt(req.query.num) || 1
    }
    if (req.query.addr || req.query.rt) {
      payload[req.query.rt || 'addr'] = req.query.addr || null
    }
    if (req.query.family === 'emre') {
      payload = `${
        req.query.verb || '0002019CO2T8642'},${
        req.query.action || 'create'},${
        req.query.desc || '000_2019_CO2_T_8642_test_Qmtest'}`
      /*cbor.encode(req.query.desc || {
        gas_type: 'CO2', //standardize these
        sector: 'TOTAL',
        last_reported_year: '2019', //4 digit
        last_reported_mmtco2e: '8642', //nearest mmton
        country: '000', //3 digit ISO 
        data_source: 'Test',
        data_reporter_public_key: 'TestKey',
        identity: 'QmTEST',
      })
      */
    }
    let payloadBytes
    var inputs = [],
      outputs = []
    const _hash = (x) =>
      crypto.createHash('sha512').update(x).digest('hex').toLowerCase()
    const _hash64 = (x) =>
      crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)
    const INT_KEY_FAMILY = 'intkey'
    const INT_KEY_NAMESPACE = _hash(INT_KEY_FAMILY).substring(0, 6)

    const EMSSIONS_KEY_FAMILY = 'emre'
    const EMSSIONS_KEY_NAMESPACE = _hash(EMSSIONS_KEY_FAMILY).substring(0, 6)
    switch (req.query.family) {
      case 'emre':
        inputs.push(EMSSIONS_KEY_NAMESPACE + _hash64(payload.split(',')[0])) //test for allowed names?
        outputs.push(EMSSIONS_KEY_NAMESPACE + _hash64(payload.split(',')[0]))
        payloadBytes = Buffer.from(payload, 'utf-8')
        break;
      case 'intkey'://intkey
      default: //intkey
        inputs.push(INT_KEY_NAMESPACE + _hash(payload.Name).slice(-64))
        outputs.push(INT_KEY_NAMESPACE + _hash(payload.Name).slice(-64))
        payloadBytes = cbor.encode(payload)
    }

    const transactionHeaderBytes = protobuf.TransactionHeader.encode({
      familyName: req.query.family || 'intkey',
      familyVersion: req.query.version || '1.0',
      inputs: inputs,
      outputs: outputs,
      signerPublicKey: signer.getPublicKey().asHex(),
      batcherPublicKey: signer.getPublicKey().asHex(),
      dependencies: [],
      payloadSha512: createHash('sha512').update(payloadBytes).digest('hex')
    }).finish()
    const signature = signer.sign(transactionHeaderBytes)

    const transaction = protobuf.Transaction.create({
      header: transactionHeaderBytes,
      headerSignature: signature,
      payload: payloadBytes
    })
    const transactions = [transaction]
    console.log('This far')
    const batchHeaderBytes = protobuf.BatchHeader.encode({
      signerPublicKey: signer.getPublicKey().asHex(),
      transactionIds: transactions.map((txn) => txn.headerSignature),
    }).finish()

    const bsignature = signer.sign(batchHeaderBytes)

    const batch = protobuf.Batch.create({
      header: batchHeaderBytes,
      headerSignature: bsignature,
      transactions: transactions
    })

    const batchListBytes = protobuf.BatchList.encode({
      batches: [batch]
    }).finish()
    request.post({
      url: 'http://127.0.0.1:8008/batches',
      body: batchListBytes,
      headers: { 'Content-Type': 'application/octet-stream' }
    }, (err, response) => {
      var link = JSON.parse(response.body).link
      if (err) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ payload, err, res: response.body }, null, 3))
        console.log(err)
      } else {
        if (link) {
          console.log('Followed: ' + link)
          request.get({
            url: link
          }, (e, r) => {
            if (e) return console.log(e)
            res.setHeader('Content-Type', 'application/json');
            var body = JSON.parse(r.body)
            var link = body.link.replace(/127.0.0.1:8008/g, req.headers.host)
            res.send(JSON.stringify({ payload, inputs, outputs, data: body.data, link }, null, 3))
          })
        } else {
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ payload, inputs, outputs, body: JSON.parse(response.body) }, null, 3))
        }
      }
    })
  }
})

app.get('/state', (req, res, next) => {
  //let address = re
  child_process.exec('sawtooth state list', (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }
    var data = stdout.split('\n')
    var sizespot = data[0].search('SIZE')
    var dataspot = data[0].search('DATA')
    var obj = {
      HEAD_BLOCK: data[data.length - 2].split('"')[1],
      addresses: []
    }
    for (i = 1; i < (data.length - 2); i++) {
      j = {
        ADDRESS: data[i].split(' ')[0],
        LINK: `http://${req.headers.host}/state/${data[i].split(' ')[0]}`,
        SIZE: data[i].substring(sizespot, dataspot).trim(),
        DATA: data[i].substring(dataspot).trim()
      }
      obj.addresses.push(j)
    }
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(obj, null, 3))
  });
  //  res.setHeader('Content-Type', 'application/json');
  // res.send(JSON.stringify(rep, null, 3))
});

app.get('/state/:id', (req, res, next) => {
  var address = req.params.id
  child_process.exec(`sawtooth state show ${address}`, (err, stdout, stderr) => {
    if (err) {
      console.error(err);
      return;
    }

    res.setHeader('Content-Type', 'application/json');
    switch (address.substr(0, 6)) { //decode different namespace per cponventions
      case 'd5b434': //emre decode
        let data = stdout.split("'")[1]
        let darr = data.split(',')[3].split('_')
        let op = {
          namespace: '"d5b434" | "emre" | Emission Record',
          country_code: darr[0],
          year: darr[1],
          ghg: darr[2],
          type: darr[3],
          amount: darr[4],
          string: darr[5],
          IPFS: darr[6]
        }
        res.send(JSON.stringify(op, null, 3))
        break;
      /*

      case '1cf126': //intkey decode
        console.log(stdout)
        cbor.decodeFirst("b'\xa1cbar\x18\x8f'", (err, obj) => (err ? console.log(err) : console.log(obj)))
        cbor.decodeFirst(JSON.stringify(stdout), (err, obj) => (err ? console.log(err) : res.send(JSON.stringify(obj), null, 3)))
        break;
        */
      case '000000': //settings transaction family

        break;
      default:
        res.send(JSON.stringify(stdout, null, 3))
    }
  });
});

app.get('/batch_statuses', (req, res, next) => {
  var id = req.query.id
  request.get({
    url: `http://127.0.0.1:8008/batch_statuses?id=${id}`
  }, (e, r) => {
    if (e) return console.log(e)
    res.setHeader('Content-Type', 'application/json'); //sanitize this link
    var body = JSON.parse(r.body)
    var link = body.link.replace(/127.0.0.1:8008/g, req.headers.host)
    console.log(link)
    body.link = link
    res.send(JSON.stringify(body, null, 3))
  })
});

app.listen(port, () => console.log(`SHP API listening on port ${port}!`))
