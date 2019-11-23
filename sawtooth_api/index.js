const child_process = require('child_process');
const ENV = process.env
const cors = require('cors');
const express = require('express');
const app = express()
const port = ENV.PORT || 2999;
const cbor = require('cbor');

app.use(cors())
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
    console.log(sizespot, dataspot)
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
    var obj = {}
    var data = stdout.split('\n')[0]
    var raw = data.split('"')[1]
    obj[data.split(':')[0]] = {
      raw
    }
    switch (address.substr(0, 6)) { //decode different namespace per cponventions
      case '1cf126': //intkey decode
        //var buf = new Buffer.from(obj[data.split(':')[0]].raw.split("'"), 'base64')

        //var str = buf.toString('ascii')
        //console.log(str)
        //var bufs = obj[data.split(':')[0]].raw.split("'")[1].split("\\x")
        cbor.decodeFirst(bufs[1], (err, o) => {
          if (err) {
            console.log(err)
          } else {
            obj[data.split(':')[0]].decoded = o
          }
          console.log(o)
          res.send(JSON.stringify(obj, null, 3))
        })
        break;
      case '000000': //settings transaction family

        break;
      default:
        res.send(JSON.stringify(obj, null, 3))
    }
  });
});

app.listen(port, () => console.log(`SHP API listening on port ${port}!`))
