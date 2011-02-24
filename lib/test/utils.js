'use strict'

var q = require('q'), when = q.when

exports.create = function(fs) {
  return (
  { cleanup: function cleanup(assert, path, callback) {
      when
      ( fs.isDirectory(path)
      , function (isDirectory) {
          if (isDirectory)
            when
            ( fs.removeDirectory(path)
            , callback
            , function(reason) {
                assert.error(Object.create(Error.prototype,
                { message: { value: 'failed to cleanup' }
                , path: { value: path, enumerable: true }
                , reason: { value: reason, enumerable: true }
                }))
                callback(reason)
              }
            )
          else
            when
            ( fs.remove(path)
            , callback
            , function(reason) {
                assert.error(Object.create(Error.prototype,
                { message: { value: 'failed to cleanup' }
                , path: { value: path, enumerable: true }
                , reason: { value: reason, enumerable: true }
                }))
                callback(reason)
              }
            )
        }
      , function (reason) {
          assert.error(reason)
          callback()
        }
      )
    }
  })
}
