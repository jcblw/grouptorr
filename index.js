'use strict'

const http = require('http')
const server = http.createServer(require('./src/server'))

server.listen(process.env.PORT || 3000)
