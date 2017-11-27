const node = new Ipfs({
  repo: 'ipfs-uploader-client-' + Math.random(),
  config: {
    Addresses: {
      Swarm: [
        '/dns4/wrtc-star.discovery.libp2p.io/wss/p2p-webrtc-star',
        '/dns4/ws-star.discovery.libp2p.io/wss/p2p-websocket-star'
      ]
    }
  }
})

var xhttp = new XMLHttpRequest()

node.once('ready', () => {
  console.log('Online status: ', node.isOnline() ? 'online' : 'offline')
  document.getElementById('status').innerHTML = 'Node status: ' + (node.isOnline() ? 'online' : 'offline')

  setInterval(function () {
    node.swarm.peers(function (err, peers) {
      if (err) {
        console.log('peers failed: ' + err)
      } else {
        peers.map(function (peer) {
          console.log('peer: ' + peer.addr)
        })
      }
    })
  }, 10000)

  node.files.add(new node.types.Buffer('Hello world!'), (err, filesAdded) => {
    if (err) {
      return console.error('Error - ipfs files add', err)
    } else {
      filesAdded.forEach((file) => {
        console.log('successfully stored', file.hash)
        node.id(function (err, identity) {
          if (err) {
            console.log(err)
          } else {
            console.log(identity)
            identity.addresses.forEach(function (adress) {
              let request = {
                clientAddress: adress,
                ipfsPath: 'QmQzCQn4puG4qu8PVysxZmscmQ5vT1ZXpqo7f58Uh9QfyY'
              }
              console.log('sending request' + JSON.stringify(request))
              xhttp.open('POST', 'https://ipfs-uploader.herokuapp.com/upload', true)
              xhttp.setRequestHeader('Content-Type', 'application/json')
              xhttp.send(JSON.stringify(request))
              console.log('waiting for response')
              setTimeout(function () {
                console.log(xhttp.response)
                console.log('done waiting')
              }, 20000)
            })
          }
        })
      })
    }
  })
})
