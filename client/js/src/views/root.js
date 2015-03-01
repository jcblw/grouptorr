'use strict'

const {button, div} = require('domla')
const body = document.body

module.exports = function() {

  let upload = button('upload')
  let download = button('download')
  let buttons = div({ className: 'buttons-group' }, upload, download)
  let addUpload = require('../upload')
  let addDownload = require('../download')

  // When user drops files on the browser, create a new torrent and start seeding it!
  upload.addEventListener('click', addUpload)
  download.addEventListener('click', addDownload)
  body.appendChild(buttons);
}

