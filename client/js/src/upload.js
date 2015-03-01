'use strict'

const body = document.body
const dragDrop = require('drag-drop')
const {h1, span, input, form, label, textarea, div} = require('domla')
const xhr = require('xhr')

function makeArray(arr){
  return Array.prototype.slice.call(arr, 0)
}

function uploadFiles( files ) {

  let form = document.getElementById('upload-form')
  let inputs = makeArray(form.getElementsByTagName('input'))
  let formData = new FormData()

  for (let i = 0, file; file = files[i]; ++i) {
    formData.append(file.name, file);
  }

  inputs.forEach(function(el){
    formData.append(el.name, el.value);
  })

  xhr({
    url: '/api/files.json',
    body: formData,
    method: 'POST',
    headers: {
      Authorize: localStorage.getItem('auth_token') // this is temp
    }
  },function(err, resp){
    if(err) {
      return console.log(err)
    }
    window.location = resp.url
  })
}

module.exports = function() {
  dragDrop('body', uploadFiles)
  body.appendChild(
    div( {className: 'upload--form'},
      form({id: 'upload-form'},
        label({for: 'title'}, 'Title:'),
        input({name: 'title', type:'text', placeholder: 'Files title'}),
        label({for: 'description'}, 'Description:'),
        input({type: 'text', name: 'description', placeholder: 'Let us know what your selling'}),
        label({for: 'price'}, 'Price:'),
        input({type: 'text', name: 'price', placeholder: '$1'})
      ),
      h1('drop your files anywhere')
    )
  )
}
