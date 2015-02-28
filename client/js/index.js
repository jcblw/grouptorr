var dragDrop = require('drag-drop/buffer')
var WebTorrent = require('webtorrent')
var dom = require('domla')
var body = document.body
var upload = dom.button('upload')
var download = dom.button('download')
var buttons = dom.div({ className: 'buttons-group' }, upload, download)

var client = new WebTorrent()

// When user drops files on the browser, create a new torrent and start seeding it!
function addUpload() {
  buttons.remove()
  body.appendChild(dom.h1('drop your files anywhere'))
  dragDrop('body', function (files) {
    client.seed(files, function onTorrent (torrent) {
      // Client is seeding the file!
      var el = dom.span(torrent.magnetURI)
      body.appendChild(el);
    })
  })
}

function addDownload() {
  buttons.remove()

  var form = (
    dom.form( {},
      dom.input({ type: 'url' })
    )
  )

  form.addEventListener('submit',function(e){
    e.preventDefault()
    var el = form.getElementsByTagName('input')[0]
    var value = el.value

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


upload.addEventListener('click', addUpload)
download.addEventListener('click', addDownload)

body.appendChild(buttons);
