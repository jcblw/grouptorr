'use strict'

const fs = require('fs')
const async = require('async')
const mkdirp = require('mkdirp')
const path = require('path')
let location

function writeFiles (files = [], options = {}, callback = function(){}) {
  let uploadDir = __dirname + location
  mkdirp(uploadDir, function(err){
    if(err){
      return callback(err)
    }
    let filesLocations = []
    // upload each file
    async.each(files, function(file, callback){
      let fileLocation = path.normalize(uploadDir + '/' + file.name)
      let readStream = fs.createReadStream(file.path)
      let writeStream = fs.createWriteStream(fileLocation)
      readStream
        .on('error', function(err){
          callback(err)
        })
        .pipe(writeStream)
        .on('finish',function(){
          filesLocations.push(fileLocation)
          callback()
        })
    }, function(err){
      if (err) {
        return callback(err)
      }
      callback(null, filesLocations)
    })
  })
}

module.exports = function (uploadLocation = '') {
  location = uploadLocation
  return writeFiles
}
