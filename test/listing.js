'use strict'

var q = require('q'), when = q.when
var tempDir = require('./fixtures').tempDir

function areElementsInArraysSame(source, target) {
  var value = true
  if (source.length !== target.length) value = false
  else value = !source.some(function (element) {
    return !~target.indexOf(element)
  })
  return value
}

exports.create = function create(fs) {
  var cleanup = require('./utils').create(fs).cleanup

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
  , 'test list tree': function(assert, done) {
      var path = fs.join(tempDir, 'test4', 'sub', 'tree', 'of', 'dirs')

      function cleanup() {
        var path = fs.join(tempDir, 'test4')
        when
        ( fs.removeTree(path)
        , done
        , function(reason) {
            done(assert.fail('failed to cleanup. Can not remove directory:' + path))
          }
        )
      }

      when
      ( fs.makeTree(path)
      , function() {
          when
          ( fs.write(fs.join(path, 'file.ext'), 'fixture')
          , function() {
              when(fs.listTree(fs.join(tempDir, 'test4')), function(entries) {
                assert.ok
                ( areElementsInArraysSame
                  ( entries
                  , [ './sub/'
                    , './sub/tree/'
                    , './sub/tree/of/'
                    , './sub/tree/of/dirs/'
                    , './sub/tree/of/dirs/file.ext'
                    ]
                  )
                  , 'correct list is returned'
                )
                cleanup()
              })
            }
          , function(reason) {
              assert.fail('failed to create file: ' + reason)
              cleanup()
            }
          )
        }
      , function(reason) {
          done(assert.fail('failed to create tree: ' + reason))
        }
      )
    }
    , 'test list directory tree': function(assert, done) {
      var path = fs.join(tempDir, 'test5', 'sub', 'tree', 'of', 'dirs')

      function cleanup() {
        var path = fs.join(tempDir, 'test5')
        when
        ( fs.removeTree(path)
        , done
        , function(reason) {
            done(assert.fail('failed to cleanup. Can not remove directory:' + path))
          }
        )
      }

      when
      ( fs.makeTree(path)
      , function() {
          when
          ( fs.write(fs.join(path, 'file.ext'), 'fixture')
          , function() {
              when(fs.listDirectoryTree(fs.join(tempDir, 'test5')), function(entries) {
                assert.ok
                ( areElementsInArraysSame
                  ( entries
                  , [ './sub/'
                    , './sub/tree/'
                    , './sub/tree/of/'
                    , './sub/tree/of/dirs/'
                    ]
                  )
                  , 'correct list is returned'
                )
                cleanup()
              })
            }
          , function(reason) {
              assert.fail('failed to create file: ' + reason)
              cleanup()
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
