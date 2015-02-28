'use strict'

const fs = require('fs')
const path = require('path')

function respondWithFile( file, res ) {
    let readStream = fs.createReadStream( path.resolve(__dirname + file))

    readStream.on('error', function (err) {
      res.writeHead(500, {
        'Content-Type': 'application/json'
      })
      res.end(JSON.stringify(err))
    })

    return readStream.pipe(res)
}

module.exports = function (req, res) {

  // add logging
  process.stdout.write(`\n\r ${req.url}`)

  if (req.url === '/') {
    return respondWithFile('/../client/index.html', res)
  }

  if (req.url === '/upload') {
    return respondWithFile('/../client/upload.html', res)
  }

  if (req.url === '/bundle.js') {
    return respondWithFile('/../client/js/bundle.js', res)
  }

  if (req.url === '/api/upload.json') {
    return respondWithFile('/../client/js/bundle.js', res)
  }


  // need a stylesheet url

  respondWithFile('/../client/404.html', res)
}
