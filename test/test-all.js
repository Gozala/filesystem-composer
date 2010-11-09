'use strict'

exports.path = require('./path')
exports.workingDirectory = require('./working-directory')
exports.listing = require('./listing')
exports['read write'] = require('./read-write')
exports.directory = require('./directory')

exports.create = function create(fs) {
  var tests = {}
  Object.keys(exports).forEach(function(key) {
    if ('create' == key) return
    tests['test ' + key] = exports[key].create(fs)
  })
  return tests
}
