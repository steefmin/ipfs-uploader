'use strict'
let port = process.env.PORT || 5000
let express = require('express')
let logger = require('morgan');
let path = require('path');
let bodyParser = require('body-parser')
let app = express();
let IPFS = require('ipfs')
let wrtc = require('electron-webrtc') // or require('electron-webrtc')()
let WStar = require('libp2p-webrtc-star')
let wstar = new WStar({ wrtc: wrtc })

let node = new IPFS({
  repo: 'ipfs-uploader-heroku-1',
  config: {
    Addresses: {
      Swarm: [
        "/ip4/0.0.0.0/tcp/4002",
        "/ip4/0.0.0.0/tcp/4003/ws",
        "/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star"
      ]
    }
  },
  libp2p: {
    modules: {
      transport: [wstar],
      discovery: [wstar.discovery]
    }
  }
})

app.use(logger('dev'))

app.use(express.static(path.join(__dirname, 'src')))

app.use(bodyParser.json({
  type: 'application/json'
}))

app.post('/upload', function (req, res) {
  console.log('trying to connect to: ' + req.body.clientAddress)
  node.swarm.connect(req.body.clientAddress, function (err, data) {
    if (err) {
      console.log('Failed connect')
      console.log(err)
    } else {
      console.log('trying to get: ' + req.body.ipfsPath)
      node.files.get(req.body.ipfsPath, function (err, files){
        if (err) {
          console.log('Failed cat')
          console.log(err)
        } else {
          console.log('getting file')
          files.forEach((file) => {
            console.log(file.path)
            console.log(file.content.toString('utf8'))
          })
          res.send('getting file')
        }
      })
    }
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
