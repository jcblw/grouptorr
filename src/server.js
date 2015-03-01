'use strict'

const fs = require('fs')
const path = require('path')
const async = require('async')
const formidable = require('formidable')
const mkdirp = require('mkdirp')
const sendFile = require('./send-file')
const sendJSON = require( './send-json')
const uploadFiles = require('./upload-files')('/../tmp/uploads/')
const braintree = require('./braintree')
const redirectURL = require('./redirect')
const checkout = require('./checkout')
const users = require('./users')
const filesEntry = require('./files')

function respondWithFile (file) {
  let res = this
  let readStream = fs.createReadStream( path.resolve(__dirname + file))

  readStream.on('error', function (err) {
    res.json(err, 500)
  })

  return readStream.pipe(res)
}

function uploadReqFiles (req, callback) {
  let form = new formidable.IncomingForm();

  form.parse(req, function(err, fields, files){
    if (err) {
      return callback(err)
    }
    if (files) {
      var _files = []
      for(let key in files) {
        files[key].name = key;
        _files.push(files[key])
      }
      return uploadFiles(_files, {}, function(err, _files){
        callback(err, _files, fields)
      })
    }
    return callback(new Error('You need to send files to the upload endpoint files to upload'))
  })
}

function processCheckout (req, callback) {
  let form = new formidable.IncomingForm()

  form.parse(req, function(err, fields, files){
    if (err) {
      return callback(err)
    }
    fields.amount = '1.00' // temp
    checkout( fields, function(err, resp){
      if (err) {
        return callback(err)
      }
      return callback(null, resp)
    })
  })
}

module.exports = function (req, res) {

  let end = res.end
  // just for logging
  res.end = function( ) {
    var ua = req.headers['user-agent']
    process.stdout.write(`\n\r${res.statusCode} ${req.method} ${req.url} ${ua}`)
    end.apply(res, arguments)
  }

  res.send = sendFile
  res.json = sendJSON
  res.redirect = redirectURL

  if (
    req.url === '/' ||
    req.url === '/thanks' ||
    req.url === '/payment' ||
    req.url.match(/^\/files\/(.*)/)
  ) {
    return res.send('/../client/index.html')
  }

  if (req.url === '/favicon.ico') {
    return res.send('/../client/assets/favicon.ico')
  }

  if (req.url === '/checkout') {
    // redirect after pull variables out of post
    return processCheckout(req, function (err){
      if (err) {
        return res.redirect('/payment') // need to send an error message
      }
      return res.redirect('/thanks', 302)
    })
  }

  if (req.url === '/bundle.js') {
    return res.send('/../client/js/bundle.js')
  }

// api routes
// -------------------------------------------------------------------

  if (req.method === 'POST' && req.url === '/api/files.json') {
    return users.authorizeUser( {
      token: req.headers.authorize
    }, function(err, user) {
      if (err) {
          return res.json(err, 400)
      }
      uploadReqFiles(req, function (err, files, feilds = {}) {
        if(err){
          return res.json(err, 500)
        }
        filesEntry.createFiles({
          title: feilds.title,
          description: feilds.description,
          price: feilds.price,
          files: files,
          user: user.id
        }, function(err, files) {
          if(err){
            return res.json(err, 500)
          }
          res.json({url:'/files/' + files.id})
        })
      })
    } )
  }

  if (req.method === 'GET' && req.url === '/api/token.json') {
    return braintree.getClientKey(function (err, resp) {
      if(err){
        return res.json(err, 500)
      }
      res.json({
        token: resp.clientToken
      })
    })
  }


  if (req.method === 'GET' && req.url.match(/^\/api\/files\/(.*)\.json/) ) {
    let match = req.url.match(/^\/api\/files\/(.*)\.json/)
    return filesEntry.getFiles(match[1], function (err, files) {
      if(err){
        return res.json(err, 400)
      }
      delete files.files
      res.json(files)
    })
  }

  if (req.url.match(/^\/api\//)) {
    return res.json(new Error(`Endpoint ${req.url} does not exsist`), 404)
  }
  // make a wildcard url for projects
  res.redirect('/')
}
