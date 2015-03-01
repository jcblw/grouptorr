const levelup = require('levelup')
const uuid = require('node-uuid')

function batchUser (user) {
  return function (key) {
    return {
      type: 'put',
      key: key,
      value: user[key]
    }
  }
}

function mergeKeys (obj, keyVal) {
  obj[keyVal.key] = keyVal.value
  return obj
}

var createUser =
module.exports.createUser = function (user, callback) {
  let id = uuid.v4()
  let db = levelup('./.dbs/user:' + id)
  let keys = Object.keys(user)
  let batch = keys.map( batchUser(user) )

  db.batch(batch, function(err) {
    if (err) {
      return callback(err)
    }
    user.id = id
    callback(null, user)
    db.close()
  })
}

var getUser =
module.exports.getUser = function (id, callback) {
  levelup('./.dbs/user:' + id, {createIfMissing: false}, function(err, db) {
    if (err) {
      return callback(err)
    }
    let userKeys = []
    db.createReadStream()
      .on('error', function(err){
        callback(err)
      })
      .on('data', function(data){
        userKeys.push(data)
      })
      .on('end', function(){
        callback(null, userKeys.reduce(mergeKeys, {id: id}))
        db.close()
      })
  })

}

var createAuthKey =
module.exports.createAuthKey = function (user, authkey, callback) { // could possible have differnt permission keys with this format
  let db = levelup('./.dbs/auth:' + authkey)

  db.put('user', user.id, function(err) {
    if (err) {
      return callback(err)
    }
    callback(null)
    db.close()
  })
}

// this is a temp function should be updated to be more of a standard auth
module.exports.authorizeUser = function (options, callback) {
  levelup('./.dbs/auth:' + options.token, {createIfMissing: false}, function (err, db) {
    if (err) {
      return callback(err)
    }
    db.get('user', function(err, id){
      if (err) {
        return callback(err)
      }

      getUser(id, function(err, user){
        if (err) {
          return callback(err)
        }

        if ( user ) {
          callback( null, user )
        }
      })
    })
  })
}
