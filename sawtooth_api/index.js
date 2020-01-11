const child_process = require('child_process');
const ENV = process.env
const cors = require('cors');
const express = require('express');
const app = express()
const port = ENV.PORT || 2999;
const cbor = require('cbor');
const request = require('request');
const crypto = require('crypto');

const { createHash } = require('crypto');
const { protobuf } = require('sawtooth-sdk');


const { createContext, CryptoFactory } = require('sawtooth-sdk/signing');

const context = createContext('secp256k1');
const privateKey = context.newRandomPrivateKey(); //anonymous keys while in dev... need identity for a key management solution
console.log(privateKey) // for recall? 

// Supported Proxied Addresses
const INT_KEY_FAMILY = 'intkey'
const INT_KEY_NAMESPACE = _hash(INT_KEY_FAMILY).substring(0, 6)

const EMISSIONS_KEY_FAMILY = 'emre'
const EMISSIONS_KEY_NAMESPACE = _hash(EMISSIONS_KEY_FAMILY).substring(0, 6)




// Express Server & Proxied Events & RPC

app.use(cors())
app.get('/adv-build', (req, res, next) => { //way to build payloads for processing, should be key controled in future 
  let payload,
    payloadBytes,
    inputs = [],
    outputs = []

  switch (req.query.family) {
    case 'emre':
      payload = {
        [req.query.vt || 'name']: req.query.verb || '0002019CO28642',
        [req.query.nt || 'action']: req.query.action || 'create',
        [req.query.at || 'desc']: req.query.desc || '0123'
        /*cbor.encode(req.query.desc || {
          gas_type: 'CO2', //standardize these
          sector: 'TEST',
          last_reported_year: '2019', //4 digit
          last_reported_mmtco2e: '8642', //nearest mmton
          country: '000', //3 digit ISO 
          data_source: 'Test',
          data_reporter_public_key: 'TestKey',
          identity: 'QmTEST',
        })
        */
      }
      inputs.push(EMISSIONS_KEY_NAMESPACE + _hash(payload.name).slice(-64)) //test for allowed names?
      outputs.push(EMISSIONS_KEY_NAMESPACE + _hash(payload.name).slice(-64))
      payloadBytes = cbor.encode(payload)
      break;
    case 'intkey'://intkey
    default: //intkey
      var payload = {
        [req.query.vt || 'Verb']: req.query.verb || 'inc',
        [req.query.nt || 'Name']: req.query.action || 'tes',
        [req.query.at || 'Value']: req.query.desc || parseInt(req.query.num) || 1
      }
      if (req.query.addr || req.query.rt) {
        payload[req.query.rt || 'addr'] = req.query.addr || null
      }
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
          res.send(JSON.stringify({ payload, data: body.data, link }, null, 3))
        })
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify({ payload, body: JSON.parse(response.body) }, null, 3))
      }
    }
  })
})

app.get('/state', (req, res, next) => {
  console.log('stateReq')
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
