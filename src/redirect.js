module.exports = function (url, statusCode = 307) {
  let res = this
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'location': url
  })
  res.end('')
}
