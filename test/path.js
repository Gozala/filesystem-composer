var FS = require('../lib/fs')
var t = require("assert")

function _(string) {
    var params = Array.prototype.slice.call(arguments, 1),
        id = 0; // the current index for non-numerical replacements
    return string.replace(/%@([0-9]+)?/g, function(param, index) {
        param = params[((index) ? parseInt(index, 0) - 1 : id ++)];
        return ((param === null) ? '(null)' : ( param === undefined) ? '' : param).toString();
    });
}

var INFO = '%@3 actual: "%@1" expected: "%@2"'

// base
;[
    ['', '', 'Empty string yields empty response'],
    ['/', '', 'Root alone yields empty response'],
    ['/foo/', '', 'Directory references yields empty response'],
    ['/foo', 'foo'],
    ['/foo/bar.js', 'bar.js'],
    ['foo/bar.js', 'bar.js']
].forEach(function($) {
    this[_('test:FS.base("%@") === "%@"', $[0], $[1])] = function() {
        var actual = FS.base($[0])
        t.equal(actual, $[1], _(INFO, actual, $[1], $[2]))
    }
}, exports['test:base'] = {})

// directory
;[
    ['', '.'],
    ['.', '.'],
    ['foo', '.'],
    ['foo.txt', '.'],
    ['foo/', '.'],
    ['foo/bar/', 'foo/'],
    ['foo/bar/baz.txt', 'foo/bar/'],
    ['/', '/'],
    ['/foo.txt', '/'],
    ['/foo/', '/'],
    ['/foo/bar/', '/foo/'],
    ['/foo/bar/baz.txt', '/foo/bar/']
].forEach(function($) {
    this[_('test:FS.directory("%@") === "%@"', $[0], $[1])] = function() {
        var actual = FS.directory($[0])
        t.equal(actual, $[1], _(INFO, actual, $[1], $[2]))
    }
}, exports['test:directory'] = {})
// extension
;[
    ['', ''],
    ['.', ''],
    ['..', ''],
    ['.a', ''],
    ['..a', ''],
    ['.a.b', '.b'],
    ['a.b', '.b'],
    ['a.b.c', '.c'],
    ['/', ''],
    ['/.', ''],
    ['/..', ''],
    ['/..a', ''],
    ['/.a.b', '.b'],
    ['/a.b', '.b'],
    ['/a.b.c', '.c'],
    ['foo/', ''],
    ['foo/.', ''],
    ['foo/..', ''],
    ['foo/..a', ''],
    ['foo/.a.b', '.b'],
    ['foo/a.b', '.b'],
    ['foo/a.b.c', '.c'],
    ['/foo/', ''],
    ['/foo/.', ''],
    ['/foo/..', ''],
    ['/foo/..a', ''],
    ['/foo/.a.b', '.b'],
    ['/foo/a.b', '.b'],
    ['/foo/a.b.c', '.c']
].forEach(function($) {
    this[_('test:FS.extension("%@") === "%@"', $[0], $[1])] = function() {
        var actual = FS.extension($[0])
        t.equal(actual, $[1], _(INFO, actual, $[1], $[2]))
    }
}, exports['test:extension'] = {})
// normal
;[
    ['', ''],
    ['.', ''],
    ['./', ''],
    ['../', '../'],
    ['../a', '../a'],
    ['../a/', '../a/'],
    ['a/..', ''],
    ['a/../', ''],
    ['a/../b', 'b'],
    ['a/../b/', 'b/'],
    ['a/../../', '../'],
    ['a/../../b', '../b'],
    ['./../', '../']
].forEach(function($) {
    this[_('test:FS.normal("%@") === "%@"', $[0], $[1])] = function() {
        var actual = FS.normal($[0])
        t.equal(actual, $[1], _(INFO, actual, $[1], $[2]))
    }
}, exports['test:normal'] = {})
// relative
;[
    ['', '', ''],
    ['.', '', ''],
    ['', '.', ''],
    ['.', '.', ''],
    ['', '..', '../'],
    ['', '../', '../'],
    ['a', 'b', 'b'],
    ['../a', '../b', 'b'],
    ['../a/b', '../a/c', 'c'],
    ['a/b', '..', '../../'],
    ['a/b', 'c', '../c'],
    ['a/b', 'c/d', '../c/d'],
    ["a", "a/b/c", "a/b/c"],
    ["a/", "a/b/c", "b/c"]
].forEach(function($) {
    this[_('test:FS.relative("%@", "%@") === "%@"', $[0], $[1], $[2])] = function() {
        var actual = FS.relative($[0], $[1])
        t.equal(actual, $[2], _(INFO, actual, $[2], $[3]))
    }
}, exports['test:relative'] = {})
// resolve
;[
    [['/'], '/'],
    [['/a'], '/a'],
    [['/a/'], '/a/'], 
    [['/a', '/b'], '/b'], 
    [['/a', '/b/'], '/b/'], 
    [['/', 'a'], '/a'],
    [['/', 'a/'], '/a/'],
    [['/a', 'a'], '/a'],
    [['/a', 'a/'], '/a/'],
    [['/a/', 'a'], '/a/a'],
    [['/a/', 'a/'], '/a/a/'],
    [['..'], '../'],
    [['..', 'a'], '../a'],
    [['..', 'a/'], '../a/'],
    [['.'], ''],
    [['.', 'a'], 'a'],
    [['.', 'a/'], 'a/'],
    [['a', '.'], ''],
    [['a', '.', 'a'], 'a'],
    [['a', '.', 'a/'], 'a/'],
    [['a', '..'], '../'],
    [['a', '..', 'a'], '../a'],
    [['a', '..', 'a/'], '../a/'],
    [['a/', '..'], ''],
    [['a/', '..', 'a'], 'a'],
    [['a/', '..', 'a/'], 'a/'],
    [['a/b', ''], 'a/b'],
].forEach(function($) {
    this[_('test:FS.resolve.apply(null, "%@") === "%@"', $[0], $[1])] = function() {
        var actual = FS.resolve.apply(null, $[0])
        t.equal(actual, $[1], _(INFO, actual, $[1], $[2]))
    }
}, exports['test:resolve'] = {})
// path join
;[
    ['/', 'a', '/a'],
    ['.', 'a', 'a'],
    ['.', '..', '../'],
    ['.', '../', '../']
].forEach(function($) {
    this[_('test:FS.path("%@").join("%@") === "%@"', $[0], $[1], $[2])] = function() {
        var actual = FS.path($[0]).join($[1])
        t.equal(actual, $[2], _(INFO, actual, $[2], $[3]))
    }
}, exports['test:path'] = {})
// split
;[
    ['',[]],
    ['foo/bar/', ['foo','bar','']],
    ['foo/bar', ['foo','bar']],
    ['/', ['','']],
    ['/foo/bar', ['','foo','bar']],
    ['/foo/bar/', ['','foo','bar','']],
    ['/foo/bar.js', ['','foo','bar.js']]
].forEach(function($) {
    this[_('test:FS.split("%@") ~= [%@]', $[0], $[1])] = function() {
        var actual = FS.split($[0])
        t.deepEqual(actual, $[1], _(INFO, actual, $[1], $[2]))
    }
}, exports['test:split'] = {})

if (require.main == module) require('test/runner').run(exports)
