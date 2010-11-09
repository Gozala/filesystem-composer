'use strict'

var q = require('q'), when = q.when

exports.create = function create(fs) {
  return (
  { 'test list `fs.workingDirectory`': function(assert, done) {
      var entries = fs.list(fs.workingDirectory())
      when
      ( entries
      , function(list) {
          assert.ok(Array.isArray(list), 'resolves to an array of entries:' + list.length)
          done()
        }
      , assert.fail.bind(assert)
      )
    }
  , 'test list `fs.workingDirectoryPath`': function(assert, done) {
      var entries = fs.workingDirectoryPath().list()
      when
      ( entries
      , function(list) {
          assert.ok(Array.isArray(list), 'resolves to an array of entries:' + list.length)
          done()
        }
      , assert.fail.bind(assert)
      )
    }
  , 'test list file': function(assert, done) {
      var entries = fs.list(module.filename)
      when
      ( entries
      , function(list) {
          assert.fail('file cant be listed')
          done()
        }
      , function(e) {
          assert.pass('file can not be listed:' + e)
          done()
        }
      )
    }
  })
}
