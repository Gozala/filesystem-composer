'use strict'

var q = require('q'), when = q.when
,   tempDir = require('./fixtures').tempDir

exports.create = function create(fs) {
  var cleanup = require('./utils').create(fs).cleanup

  return (
  { Assert: require('./asserts').create(fs).Assert
  , 'test create and remove directory': function(assert, done) {
      var path = fs.join(tempDir, 'test1')
      when
      ( fs.makeDirectory(path)
      , function() {
          when(fs.exists(path), function(exists) {
            assert.ok(exists, 'directory was created succesfuly')
            when
            ( fs.removeDirectory(path)
            , function() {
                done(assert.pass('directory was removed correctly'))
              }
            , function(reason) {
                assert.fail('failed to remove directory for reason: ' + reason)
                done(assert.error(
                { message: 'failed to cleanup: ' + path
                , path: path
                , reason: reason
                }))
              }
            )
          })
        }
      , function(reason) {
          done(assert.fail('makeDirectory was rejected with reason: ' + reason))
        }
      )
    }
  , 'test create existing directory': function(assert, done) {
      var path = fs.join(tempDir, 'test2')
      when
      ( fs.makeDirectory(path)
      , function() {
          when
          ( fs.makeDirectory(path)
          , function() {
              assert.fail('second call of makeDirectory did not failed')
              cleanup(assert, path, done)
            }
          , function(reason) {
              assert.ok(0 <= String(reason).indexOf('File exists'), 'rejected because directory exists')
              assert.equal(reason.path, path, 'rejection path is correct')
              cleanup(assert, path, done)
            }
          )
        }
      , function(reason) {
          done(assert.fail('makeDirectory was rejected with reason: ' + reason))
        }
      )
    }
  , 'test create directory with the name of existing file': function(assert, done) {
      var path = fs.join(tempDir, 'test3')
      when
      ( fs.write(path, '')
      , function() {
          when
          ( fs.makeDirectory(path)
          , function() {
              assert.fail('creating directory with a name of existdng file should fail')
              cleanup(assert, path, done)
            }
          , function(reason) {
              assert.ok(0 <= String(reason).indexOf('File exists'), 'rejected because directory exists')
              assert.equal(reason.path, path, 'rejection path is correct')
              cleanup(assert, path, done)
            }
          )
        }
      , function(reason) {
          done(assert.fail('was no able to create file: ' + reason))
        }
      )
    }
  , 'test makeTree': function(assert, done) {
      var path = fs.join(tempDir, 'test4', 'sub', 'tree')
      when
      ( fs.makeTree(path)
      , function() {
          when
          ( fs.isDirectory(path)
          , function(isDirectory) {
              assert.ok(isDirectory, 'directory tree is created')
              var path = fs.join(tempDir, 'test4')
              when
              ( fs.removeTree(path)
              , done
              , function(reason) {
                  done(assert.fail('failed to cleanup. Can not remove directory:' + path))
                }
              )
            }
          )
        }
      , function(reason) {
          done(assert.fail('failed to create tree: ' + reason))
        }
      )
    }
  })
}
