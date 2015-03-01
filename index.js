'use strict'

require('dotenv').load() // load .env variables

const http = require('http')
const server = http.createServer(require('./src/server'))
const port = process.env.PORT || 3000

server.listen(port)
process.stdout.write(`\n\r listening on port ${port}`)
