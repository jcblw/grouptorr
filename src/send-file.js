'use strict'

const fs = require('fs')
const path = require('path')

module.exports = function (file) {
  let res = this
  let readStream = fs.createReadStream( path.resolve(__dirname + file))

  readStream.on('error', function (err) {
    res.json(err, 500)
  })

  return readStream.pipe(res)
}
