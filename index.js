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
  res.send('request received')

  // connect(req.body.clientAddress)

  cat(req.body.ipfsPath)
  cat('/ipfs/QmQzCQn4puG4qu8PVysxZmscmQ5vT1ZXpqo7f58Uh9QfyY')
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

function cat (path) {
  console.log('trying to cat: ' + path)
  node.files.cat(path, function (err, file) {
    if (err) {
      console.log(err)
    } else {
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
}

function connect (addr) {
  console.log('trying to connect to: ' + addr)
  node.swarm.connect(node.types.multiaddr(addr), function (err) {
    if (err) {
      console.log('Failed connect')
      console.log(err)
    }
  })
}

function logPeers () {
  node.swarm.peers(function (err, peers) {
    if (err) {
      console.log('failed loading peers: ' + err)
    } else {
      peers.map(function (peer) {
        console.log(peer.addr.toString())
      })
    }
  })
}
