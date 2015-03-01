'use strict'

const {BT_MERCHANTID, BT_PUBLICKEY, BT_PRIVATKEY} = process.env
const braintree = require('braintree')
const gateway = braintree.connect({
  environment: braintree.Environment.Sandbox,
  merchantId: BT_MERCHANTID,
  publicKey: BT_PUBLICKEY,
  privateKey: BT_PRIVATKEY
})

module.exports.addCustomer = function (customer, callback) {
  gateway.customer.create(customer, callback)
}

module.exports.getClientKey = function (callback) {
  gateway.clientToken.generate({}, callback)
}

module.exports.addTransaction = function(transaction = {amount: '1.00'}, callback) {
  //payment_method_nonce
  gateway.transaction.sale({
    paymentMethodNonce: transaction.payment_method_nonce,
    amount: transaction.amount
  }, callback)
}
