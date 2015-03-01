'use strict'

const path = location.pathname;

if (path === '/') {
  require('./src/views/root')()
}

if (path === '/payment') {
  require('./src/views/payment')()
}

if (path === '/thanks') {
  require('./src/views/thanks')()
}
