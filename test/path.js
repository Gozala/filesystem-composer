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
/*
exports['test:directory'] = function() {
    var dir = FS.directory
    t.equal(dir(''), '.', 'container dir of "" is "."')
    t.equal(dir('.'), '.', 'container dir of "." is "."')
    t.equal(dir('foo'), '.', 'container dir of "foo" is "."')
    t.equal(dir('foo/'), '.', 'container dir of "foo/" is "."')
    t.equal(dir('foo.txt'), '.', 'container dir of "foo.txt" is "."')
    t.equal(dir('foo/bar/'), 'foo/', 'container dir of "." is "."')
    t.equal(dir('foo/bar/baz.txt'), 'foo/bar/', 'container dir of ' +
        '"foo/bar/baz.txt" is "foo/bar/"')    
    t.equal(dir('/'), '/', 'container dir of "/" is "/"')
    t.equal(dir('/foo.txt'), '/', 'container dir of "/foo.txt" is "/"')
    t.equal(dir('/foo/'), '/', 'container dir of "/foo/" is "/"')
    t.equal(dir('/foo/bar/'), '/foo/', 'container dir of "/foo/bar/" is ' +
        '"/foo/"')
    t.equal(dir('/foo/bar/baz.txt'), '/foo/bar/', 'directory of ' +
        '"/foo/bar/baz.txt" is "/foo/bar/"')
}

exports['test:split'] = function() {
    var splitext = path.split
    t.deepEqual(splitext(''), ['', '']);
    t.deepEqual(splitext('/'), ['/', '']);
    t.deepEqual(splitext('/foo/bar'), ['/foo/bar', '']);
    t.deepEqual(splitext('/foo/bar.js'), ['/foo/bar', 'js']);
};
*/
exports._testParentdir = function() {
    var parentdir = path.parentdir;
    t.equal(parentdir(''), '', 'Empty string is empty');
    t.equal(parentdir('/'), '', 'Root directory is empty (no parent)');
    t.equal(parentdir('/foo/'), '/', 'Directory under root has root as parent');
    t.equal(parentdir('/foo.txt'), '/', 'File under root has root as parent');
    t.equal(parentdir('/foo/bar/'), '/foo/', 'directory gets proper parent');
    t.equal(parentdir('/foo/bar/baz.txt'), '/foo/bar/', 'file gets proper parent');
};


if (require.main == module) require('test/runner').run(exports)