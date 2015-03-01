'use strict'

const WebTorrent = require('webtorrent')
const client = new WebTorrent()
const dom = require('domla')
const body = document.body

module.exports = function() {

  let form = (
    dom.form( {},
      dom.input({ type: 'url' })
    )
  )

  form.addEventListener('submit',function(e){
    e.preventDefault()
    let el = form.getElementsByTagName('input')[0]
    let value = el.value

    if (value) {
      // need to see if value is valid
      client.add(value, function (torrent) {
        // Got torrent metadata!
        console.log('Torrent info hash:', torrent.infoHash)

        form.remove()

        torrent.files.forEach(function (file) {
          // Get a url for each file
          file.getBlobURL(function (err, url) {
            if (err) throw err

            // Add a link to the page
            var a = document.createElement('a')
            a.download = file.name
            a.href = url
            a.textContent = 'Download ' + file.name
            document.body.appendChild(a)
          })
        })
      })

    }
  })

  body.appendChild(form)

}
