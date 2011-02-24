'use strict'

var fixtures = require('./fixtures')

exports.create = function create(fs) {
  var cwd = fs.workingDirectory()

  return (
  { 'test changeing working directory': function(assert) {
      var otherDir = fs.directory(fs.workingDirectory())
      // workaround for node
      if (otherDir.substr(-1) == '/' || otherDir.substr(-1) == '\\')
        otherDir = otherDir.substr(0, otherDir.length - 1)
      fs.changeWorkingDirectory(otherDir)
      assert.equal(fs.workingDirectory(), otherDir, '`workingDirectory` updated correctly')
      assert.equal(fs.workingDirectoryPath().toString(), otherDir, '`workingDirectoryPath updated correct')
    }
  })
}
