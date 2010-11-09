'use strict'

var path = module.filename || module.path
,   seperator = 0 <= path.indexOf('/') ? '/' : '\\'

// Not using path module to avoid dependencies on any engine.
exports.testDir = path.substr(0, path.lastIndexOf(seperator))
exports.fixturesDir = exports.testDir + seperator + 'fixtures'
exports.tempDir = exports.fixturesDir + seperator + 'temp'
