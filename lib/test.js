'use strict'

exports.path = require('./test/path')
exports.workingDirectory = require('./test/working-directory')
exports.listing = require('./test/listing')
exports['read write'] = require('./test/read-write')
exports.directory = require('./test/directory')

exports.create = function create(fs) {
  var tests = {}
  Object.keys(exports).forEach(function(key) {
    if ('create' == key) return
    tests['test ' + key] = exports[key].create(fs)
  })
  return tests
}
