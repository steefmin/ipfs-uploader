'use strict'
let express = require('express')
let logger = require('morgan');
let path = require('path');
let bodyParser = require('body-parser')
let app = express();
let Ipfs = require('ipfs')

let port = process.env.PORT || 5000

let node = new Ipfs({repo: 'ipfs-uploader-heroku-1'})

app.use(logger('dev'))

app.use(express.static(path.join(__dirname, 'src')))

app.use(bodyParser.json({
  type: 'application/json',
}))

app.post('/upload', function (req, res) {
  node.swarm.connect(req.body.clientAddress, function (err, data) {
    if (err) {
      console.log('Failed connect')
      console.log(err)
    }
    node.files.cat(req.body.ipfsPath, function (err, data){
      if (err) {
        console.log('Failed cat')
        console.log(err)
      }
    })
  })
})

node.on('ready', function (err, data) {
  if (err) {
    console.log('Failed ready')
    console.log(err)
  }
  app.listen(port)
  console.log('listening on port: ' + port)
})
