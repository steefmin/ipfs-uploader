const node = new Ipfs(
  { repo: 'ipfs-' + Math.random() }
)
var xhttp = new XMLHttpRequest()

node.once('ready', () => {
  console.log('Online status: ', node.isOnline() ? 'online' : 'offline')
  document.getElementById('status').innerHTML = 'Node status: ' + (node.isOnline() ? 'online' : 'offline')

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
            let request = {
              clientAddress: identity.addresses[0],
              ipfsPath: 'QmQzCQn4puG4qu8PVysxZmscmQ5vT1ZXpqo7f58Uh9QfyY'
            }
            console.log('sending request' + JSON.stringify(request))
            xhttp.open('POST', 'https://ipfs-uploader.herokuapp.com/upload', true)
            xhttp.setRequestHeader('Content-Type', 'application/json')
            xhttp.send(JSON.stringify(request))
            setTimeout(console.log(xhttp.response), 10000)
          }
        })
      })
    }
  })
})
