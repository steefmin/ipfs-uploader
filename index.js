'use strict'
let port = process.env.PORT || 5000
let express = require('express')
let logger = require('morgan')
let path = require('path')
let bodyParser = require('body-parser')
let app = express()
let bl = require('bl')
let IPFS = require('ipfs')

let node = new IPFS({
  repo: 'ipfs-uploader-heroku-1',
  config: {
    Addresses: {
      Swarm: [
        '/ip4/0.0.0.0/tcp/4002',
        '/ip4/0.0.0.0/tcp/4003/ws',
        '/dns4/ws-star.discovery.libp2p.io/wss/p2p-websocket-star',
        '/dns4/ws-star.discovery.libp2p.io/ws/p2p-websocket-star'
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
  res.send('request received')

  console.log('trying to connect to: ' + req.body.clientAddress)
  node.swarm.connect(node.types.multiaddr(req.body.clientAddress), function (err) {
    if (err) {
      console.log('Failed connect')
      console.log(err)
    }
  })

  console.log('trying to cat: ' + req.body.ipfsPath)
  node.files.cat(req.body.ipfsPath, function (err, file) {
    if (err) {
      console.log(err)
    } else {
      console.log('obj?')
      console.log(file)
      console.log('first try:')
      console.log(file.toString())
      file.pipe(bl(function (err, data) {
        if (err) {
          console.log(err)
        } else {
          console.log('second try:')
          console.log(data.toString())
        }
      }))
    }
  })
})

node.on('ready', function (err, data) {
  if (err) {
    console.log('Failed ready')
    console.log(err)
  } else {
    app.listen(port)
    console.log('listening on port: ' + port)
    setInterval(logPeers, 60000)
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
