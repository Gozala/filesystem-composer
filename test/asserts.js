'use strict'

var when = require('q').when
,   AssertBase = require('test/assert').Assert
,   pu = require('promised-utils'), Promised = pu.Promised, all = pu.all

exports.create = function create(fs) {
  var AssertDescriptor =
  { done: { value: function done(asserts, callback) {
      return when(all(asserts), callback, callback)
    }},
    directory: { value: Promised(function directory(promise, path, message) {
      var assert = this
      return when
      ( fs.isDirectory(path)
      , function (isDirectory) {
          if (isDirectory) assert.pass(message)
          else assert.fail({ message: message, opertator: 'isDirectory' })
          return when
          ( when(fs.exists(path), function(exists) {
              return isDirectory ? fs.removeDirectory(path) : fs.remove(path)
            })
          , function resolved() {
              return true
            }
          , function(reason) {
              assert.error(Object.create(Error.prototype,
              { message: { value: 'failed to cleanup' }
              , path: { value: path, enumerable: true }
              , reason: { value: reason, enumerable: true }
              }))
              return false
            }
          )
        }
      , function(reason) {
          assert.error(Object.create(Error.prototype,
          { message: { value: 'failed to assert' }
          , path: { value: path, enumerable: true }
          , reason: { value: reason, enumerable: true }
          }))
          return false
        }
      )
    })}
  , file: { value: function file(path, message) {
      var assert = this
      return when
      ( fs.isFile(path)
      , function (isFile) {
          if (isFile) assert.pass(message)
          else assert.fail({ message: message, opertator: 'isFile' })
          return when
          ( when(fs.exists(path), function(exists) {
              return isFile ? fs.remove(path) : fs.removeDirectory(path)
            })
          , function resolved() {
              return true
            }
          , function(reason) {
              assert.error(Object.create(Error.prototype,
              { message: { value: 'failed to cleanup' }
              , path: { value: path, enumerable: true }
              , reason: { value: reason, enumerable: true }
              }))
              return false
            }
          )
        }
      , function(reason) {
          assert.error(Object.create(Error.prototype,
          { message: { value: 'failed to assert' }
          , path: { value: path, enumerable: true }
          , reason: { value: reason, enumerable: true }
          }))
          return false
        }
      )
    }}
  }

  return (
  { Assert: function Assert() {
      return Object.create(AssertBase.apply(null, arguments), AssertDescriptor)
    }
  })
}
