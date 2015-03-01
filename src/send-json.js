module.exports = function (json = {}, statusCode = 200) {

  if (json instanceof Error) {
    json = {
      message: json.message,
      stack: process.env.NODE_ENV === 'production' ? null : json.stack
    }
  }
  let res = this
  res.writeHead(statusCode, {
    'Content-Type': 'application/json'
  })
  res.end(JSON.stringify(json))
}
