'use strict'

var when = require('q').when
,   fixturesDir = require('./fixtures').fixturesDir

exports.create = function create(fs) {
  return (
  { 'test read non exsisting file': function(assert, done) {
      var path = fs.join(fixturesDir, 'does_not_exist.txt')
      var content = fs.read(path, 'raw')
      when
      ( content
      , function(content) {
          assert.fail('read data for non existing file: ' + content)
          done()
        }
      , function(reason) {
          assert.ok(0 <= reason.message.indexOf('No such file'), 'could not read data for non existing file')
          done()
        }
      )
    }
  })
}
