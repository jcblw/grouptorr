var braintree = require('./braintree')

module.exports = function (options, callback) {
  // consider moving more into this method
  braintree.addTransaction(options, callback)
}
