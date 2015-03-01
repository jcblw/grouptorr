'use strict'

const {div, h1} = require('domla')
const body = document.body

module.exports = function() {

  let el = (
    div( { className: 'thanks--page' }, // this is required
      h1('Thanks for the payment!')
    )
  )

  body.appendChild(el)

}
