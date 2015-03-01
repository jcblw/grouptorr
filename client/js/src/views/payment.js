'use strict'

const {form, input, div} = require('domla')
const body = document.body
const xhr = require('xhr')

function makeArray(arrLike) {
  return Array.prototype.slice.call(arrLike, 0)
}

function setBrainTree (token) {
  if (window.braintree) {
    return window.braintree.setup(
      token,
      'dropin', {
        container: 'dropin'
      }
    )
  }
  setTimeout(setBrainTree.bind(null, token), 500)
}

function getToken() {
  let data = {}
  xhr({
    uri: '/api/token.json',
    json: true
  }, function (err, resp, body = {}) {
    if(err){
      return body.appendChild(div('We are having a error setting up our payment method'))
    }
    setBrainTree(body.token)
  })
}

function mapValues(el) {
  return el.value;
}

module.exports = function() {
  var el = (
    form({method: 'post', action: '/checkout'},
      div({id: 'dropin'}),
      input({type: 'submit', value: 'pay $1'})
    )
  )
  body.appendChild(el)
  getToken()
}
