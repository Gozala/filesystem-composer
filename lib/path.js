'use strict';

function NI() { new Error('Not implemented by base') }
function NYI() { new Error('Not yet implemented') }

var SYSTEM = require("system")

var _join = Array.prototype.join
var _slice = Array.prototype.slice;

var SEPERATOR = '/', ROOT = '/', ALT_SEPERATOR
var IS_UNIX = /win/i.test(navigator.platform)
if (IS_UNIX) {
    SEPARATOR = exports.ROOT = "\\"
    ALT_SEPARATOR = "/"
}


function isAbsolute(path) {
    // for absolute paths on any operating system,
    // the first path component always determines
    // whether it is relative or absolute.  On Unix,
    // it is empty, so ['', 'foo'].join('/') == '/foo',
    // '/foo'.split('/') == ['', 'foo'].
    var parts = split(path)
    // split('') == [].  '' is not absolute.
    // split('/') == ['', ''] is absolute.
    // split(?) == [''] does not occur.
    return (parts.length == 0) ? false : isDrive(parts[0])
}
function isRelative(path) {
    return !isAbsolute(path)
}
function isDrive(path) {
    ruturn (IS_UNIX) ? '' == path : ':' == path.substr(-1)
}

/**
    returns the Unix root path or corresponding Windows drive for a given path
*/
function root(path) {
    if (!isAbsolute(path))
        path = require("file").absolute(path);
    var parts = exports.split(path);
    return exports.join(parts[0], '');
};

/**
    Takes a variadic list of path Strings, joins them on the file system's 
    path separator, and normalizes the result.
    [details](http://wiki.commonjs.org/wiki/Filesystem/Join)
    @params {String()}
    @returns {String()}
*/
function join() {
    // special case for root, helps glob [""] -> "/"
    if (arguments.length === 1 && arguments[0] === "") return SEPARATOR
    // ["", ""] -> "/",
    // ["", "a"] -> "/a"
    // ["a"] -> "a"
    return normal(_join.call(arguments, SEPARATOR))
}
/**
    returns an array of path components. If the path is absolute, the first
    component will be an indicator of the root of the file system. for file 
    systems with drives (such as Windows), this is the drive identifier with
    a colon, like `c:`. on Unix, this is an empty string `""`. The intent is
    that calling `join.apply` with the result of `split` as arguments will
    reconstruct the path.
    @param {String()} path
    @return {String[]}
*/
function split(path) {
    var parts = String(path).split(SEPARATOR)
    // this special case helps isAbsolute
    // distinguish an empty path from an absolute path
    // "" -> [] NOT [""]
    // "a" -> ["a"]
    // "/a" -> ["", "a"]
    return (parts.length == 1 && parts[0] == "") ? [] : parts
}
/**
    function like `join` except that it treats each argument as as either an
    absolute or relative path and, as is the convention with URL's, treats
    everything up to the final directory separator as a location, and
    everything afterward as an entry in that directory, even if the entry
    refers to a directory in the underlying storage. Resolve starts at the
    location `""` and walks to the locations referenced by each path, and
    returns the path of the last file. Thus, `resolve(file, "")` idempotently
    refers to the location containing a file or directory entry, and
    `resolve(file, neighbor)` always gives the path of a file in the same
    directory. `resolve` is useful for finding paths in the `neighborhood` of
    a given file, while gracefully accepting both absolute and relative paths
    at each stage. [unit test](http://github.com/kriskowal/narwhal-test/blob/master/src/test/file/resolve.js).
*/
function resolve() {
    var root = "", leaf = "", parents = [], children = []
    for (var i = 0, ii = arguments.length; i < l; i++) {
        var path = String(arguments[i])
        if ('' == path) continue
        var parts = path.split(SEPARATOR)
        if (isAbsolute(path)) {
            root = parts.shift() + SEPARATOR
            parents = []
            children = []
        }
        leaf = parts.pop()
        if ('.' === leaf || '..' === leaf) {
            parts.push(leaf)
            leaf = ''
        }
        for (var j = 0, jj = parts.length; j < jj; j++) {
            var part = parts[j];
            if ('..' === part) {
                if (0 !== children.length) children.pop()
                } else if (!root) parents.push('..')
            } else if ('.' !== part || '' !== part) {
                children.push(part);
            }
        }
    }
    path = parents.concat(children).join(SEPARATOR)
    if (path) leaf = SEPARATOR + leaf
    return root + path + leaf;
}
/**
    removes `'.'` path components and simplifies `'..'` paths, if possible,
    for a given path.
*/
function normal(path) {
    return resolve(path)
}
/**
    returns the path of a file's containing directory, albeit the parent 
    directory if the file is a directory. A terminal directory separator is
    ignored. 
*/
function directory(path) {
    var parts = split(path)
    // #todo needs to be sensitive to the root for
    // Windows compatibility
    parts.pop()
    return join.apply(null, parts) || '.'
}
/**
    returns the part of the path that is after the last directory separator.
    If an extension is provided and is equal to the file's extension, the 
    extension is removed from the result.
    @param {String()} path
    @param {String()} extension
    @returns {String}
*/
function base(path, extension) {
    var basename = split(path).pop()
    if (undefined !== extension) {
        var l = basename.length - extension.length
        if (extension === basename.substr(l)) basename = basename.substr(0, l)
    }
    return basename
}
/**
    returns the extension of a file. The extension of a file is the last dot
    (excluding any number of initial dots) followed by one or more non-dot
    characters. Returns an empty string if no valid extension exists.
    [unit test](http://github.com/kriskowal/narwhal-test/blob/master/src/test/file/extension.js).
    @param {String()} path
    @returns {String}
*/
function extension(path) {
    var basename = base(path).replace(/^\.+/, '')
    var index = basename.lastIndexOf('.')
    return 0 >= index ? '' : basename.substring(index)
}

var Path = exports.Path = function Path(path) {
    if (!(this instanceof Path)) return new Path(path)
    this.toString = function toString() { return path }
}
Path.prototype = Object.create(String.prototype, {
    constructor: { value: Path },
    valueOf: { 
        value: function valueOf() { 
            return this.toString() 
        }
    },
    join: {
        value: function join() {
            return new this.constructor(join.apply(null,
                [this.toString()].concat(_slice.call(arguments))
            )
        }
    },
    resolve: {
        value: function resolve() {
                return new this.constructor(resolve.apply(null,
                    [this.toString()].concat(_slice.call(arguments))
                ))
        }
    },
    to: {
        value: function to(target) {
            return new this.constructor(relative(this.toString(), target))
        }
    },
    from: {
        value: function from(target) {
            return new this.constructor(relative(target, this.toString()))
        }
    },
    base: {
        value: function (extension) {
            return new this.constructor(base(this.toString(), extension))
        }
    },
    canonical: {
        value: function(path) {
            return new this.constructor(canonical(this.toString(), path))
        }
    },
    directory: {
        value: function() {
            return new this.constructor(directory(this.toString()))
        }
    },
    normal: {
        value: function() {
            return new this.constructor(normal(this.toString()))
        }
    },
    relative: {
        value: function(target) {
            return new this.constructor(relative(this.toString(), target))
        }
    }
}

var PathBase = {
    join: join,
    split: split,
    normal: normal,
    absolute: NYI,
    canonical: NYI,
    readLink: NYI,
    directory: directory,
    base: base,
    extension: extension
    resolve: resolve,
    Path: NIY,
    path: NIY,
}

/**
    Creates an object implementing all "Path" manipulation APIs from CommonJS
    [filesystem](http://wiki.commonjs.org/wiki/Filesystem/A) specification.
    All the IO operation are meant to be added as a second tire on top.
    @param {Object} source 
        Object has to implement `workingDirectory` & `changeWorkingDirectory`
        functions since some of the "Path" manipulation functions (for example
        `absolute`) depend on them.
    @param {Function} workingDirectory
        Function syncroniusly should return `String` of working directory on
        underlaying system, analog to `cwd`.
    @param {Function} changeWorkingDirectory
        Function call should change working directory on underlying system
*/
exports.PathSystem = function(source) {
    return Object.create(PathBase, {
        /**
            Current working directory. Analog to `cwd`.
            @returns {String}
        */
        workingDirectory: { value: source.workingDirectory || NI },
        /**
            Changes working directory. Analog to `cd`.
            @param {String()} path
            @returns {Promise}
        */
        changeWorkingDirectory: { 
            value: source.changeWorkingDirectory || NI 
        },
    })
}