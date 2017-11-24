'use strict'
let express = require('express')
let logger = require('morgan');
let path = require('path');
let app = express();
let Ipfs = require('ipfs')

//let node = new Ipfs()

app.use(logger('dev'))

app.use(express.static(path.join(__dirname, 'src')))

let port = process.env.port || 5000

app.listen(port)
console.log('listening on port: ' + port)
