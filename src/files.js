const levelup = require('levelup')
const uuid = require('node-uuid')

function batchFiles (files) {
  return function (key) {
    if ( !files[key] ) {
      return null;
    }
    return {
      type: 'put',
      key: key,
      value: files[key]
    }
  }
}

function filterNull (n) {
  return n;
}

function mergeKeys (obj, keyVal) {
  obj[keyVal.key] = keyVal.value
  return obj
}

module.exports.createFiles = function (files, callback) {
  let id = uuid.v4()
  let db = levelup('./.dbs/files:' + id)
  let keys = Object.keys(files)
  let batch = keys.map(batchFiles(files)).filter(filterNull)

  db.batch(batch, function(err) {
    if (err) {
      return callback(err)
    }
    files.id = id
    callback(null, files)
    db.close()
  })
}

module.exports.getFiles = function (id, callback) {
  levelup('./.dbs/files:' + id, {createIfMissing: false}, function(err, db) {
    if (err) {
      return callback(err)
    }
    let filesKeys = []
    db.createReadStream()
      .on('error', function(err){
        callback(err)
      })
      .on('data', function(data){
        filesKeys.push(data)
      })
      .on('end', function(){
        callback(null, filesKeys.reduce(mergeKeys, {}))
        db.close()
      })
  })

}

