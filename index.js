'use strict'
let port = process.env.PORT || 5000
let express = require('express')
let logger = require('morgan')
let path = require('path')
let bodyParser = require('body-parser')
let app = express()
let IPFS = require('ipfs')

let node = new IPFS({
  repo: 'ipfs-uploader-heroku-1',
  config: {
    Addresses: {
      Swarm: [
        '/ip4/0.0.0.0/tcp/4002',
        '/ip4/0.0.0.0/tcp/4003/ws',
        '/dns4/ws-star.discovery.libp2p.io/wss/p2p-websocket-star'
      ]
    }
  }
})

console.log('starting server')

app.use(logger('dev'))

app.use(express.static(path.join(__dirname, 'src')))

app.use(bodyParser.json({
  type: 'application/json'
}))

app.post('/upload', function (req, res) {
  console.log('trying to connect to: ' + req.body.clientAddress)

/*
  node.swarm.connect(req.body.clientAddress, function (err, data) {
    if (err) {
      console.log('Failed connect')
      console.log(err)
      res.end()
    } else {
      console.log('trying to get: ' + req.body.ipfsPath)
*/
      node.files.get(req.body.ipfsPath, function (err, files) {
        if (err) {
          console.log('Failed get')
          console.log(err)
          res.end()
        } else {
          console.log('got file')

          files.forEach(function (file) {
            console.log(file.path)
            console.log(file.content.toString('utf8'))
          })

          res.send('getting file')
        }
      })
//    }
//  })
})

node.on('ready', function (err, data) {
  if (err) {
    console.log('Failed ready')
    console.log(err)
  } else {
    app.listen(port)
    console.log('listening on port: ' + port)
    setInterval(logPeers, 30000)
  }
})

function logPeers () {
  node.swarm.peers(function (err, peers) {
    if (err) {
      console.log('failed loading peers: ' + err)
    } else {
      peers.map(function (peer) {
        console.log(peer.addr)
      })
    }
  })
}
