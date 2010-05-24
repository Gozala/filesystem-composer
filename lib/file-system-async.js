'use strict';

var Q = require('./commonjs/q'), when = Q.when, Deferred = Q.Deferred, 
    Promise = Q.Promise
var PATH = require('./path')

// Array shortcuts
var _join = Array.prototype.join
var _slice = Array.prototype.slice

function promise(task) {
    task = task || NI
    return function() {
        var result = Deferred()
        var rest = _slice.call(arguments)
        rest.push(result.resolve)
        rest.push(result.reject)
        task.apply(null, rest)
        return result.promise
    }
}
function NI() { 
    arguments[--arguments.length](
        'Not implemented by provided FileSystem core'
    )
}

var nonPathed = [
    'copy',                 'copyTree',             'discardAttribute',
    'exists',               'extension',            'getAttribute',
    'getAttributes',        'isDirectory',          'isFile',
    'isLink',               'isReadable',           'isWritable',
//  'iterate',              'iterateDirectoryTree', 'iterateTree',
    'lastModified',         'link',                 'linkExists',
    'makeDirectory',        'makeTree',             'move',
    'open',                 'read',                 'remove',
    'removeAttribute',      'removeDirectory',      'removeTree',
    'removeTree',           'rename',               'setAttribute',
    'size',                 'split',                'symbolicLink',
    'touch',                'write'
], pathIterated = [
    'list',                 'listTree',             'listDirectoryTree'
]

exports.compose = function compose(FS) {
    FS = PATH.compose(FS)
// http://wiki.commonjs.org/wiki/Filesystem/A/0
    // Files
    /**
        returns an IO stream that supports an appropriate interface for
        the given options and mode, which include reading, writing,
        updating, byte, character, unbuffered, buffered, and line buffered
        streams.
        @param {String()} path
            any value coercible to a String, including a Path, that can be
            interpreted as a fully-qualified path, or a path relative to
            the current working directory.
        @param {String} mode
            any subtring of "rwa+bxc" meaning "read", "write", "append", 
            "update", "binary", and "exclusive" flags respectively, in any
            order.
        @param {Object} mode
        @param {String} mode.mode
            conforming to the above mentioned mode string pattern
        @param {String} mode.charset
            an IANA, case insensitive, charset name. open must throw a 
            #TODO error if the charset is not supported. The ascii and
            utf-8 charsets must be supported.
        @param {Boolean} mode.read
            open for reading, do not create, set position to beginning of
            the file, throw an error if the file does not exist.
        @param {Boolean} mode.write
            open for writing, create or truncate, set position to the 
            beginning of the file.
        @param {Boolean} mode.append
            open for appending, create if it doesn't exist, do not
            truncate, set position to end of the file.
        @param {Boolean} mode.update
            open for updating, create if it doesn't exist, do not 
            truncate, set position to the beginning of the file.
        @param {Boolean} mode.binary
            return a raw stream instead of a buffered, charset encoded,
            text
        @param {Boolean} mode.exclusive
            open for write only if it does not already exist, otherwise
            throw an error.
    @returns {Deferred}
    @resolves {Object}
    */
    var _open = FS.open, open = FS.open = promise(_open)
    /**
        Moves a directory from one path to another on the same file system.
        Does not copy the directory under any circumstances. A conforming
        implementation must move the directory using the operating 
        system's file-system-atomic move or rename call. If it cannot be
        moved for any reason an exception must be thrown. An exception
        must be thrown if `target` specifies an existing directory.
        *Note*: this is the same method used to move files. The behaviour
        differs depending on whether source is a file or directory.
        @param {String()} source
        @param {String()} target
        @returns {Promise}
    */
    var move = FS.move = promise(FS.move)
    /**
        Removes the file at the given path. Throws an exception if the 
        path corresponds to anything that is not a file or a symbolic 
        link. If `path` refers to a symbolic link, removes the symbolic
        link.
        @param {String()} path
        @returns {Promise}
    */
    var remove = FS.remove = promise(FS.remove)
    /**
        Sets the modification time of a file or directory at a given path
        to a specified time, or the current time. Creates an empty file at
        the given path if no file (special or otherwise) or directory
        exists, using the default permissions (as though openRaw were
        called with no permissions argument). If the underlying file
        system does not support milliseconds, the time is truncated (not
        rounded) to the nearest supported unit. On file systems that
        support last-accessed time, this must be set to match the
        modification time. Where possible, the underlying implementation
        should insure that file creation and time stamp modification are
        transactionally related to the same file, rather than the same
        directory entry.
        @param {String()} path
        @param {Date} time
        @returns {Promise}
    */
    var touch = FS.touch = promise(FS.touch)
// Directories
    /**
        Create a single directory specified by path. If the directory
        cannot be created for any reason an exception must be thrown. This
        includes if the parent directories of `path` are not present. The
        permissions object passed to this method is used as the argument
        to the Permissions constructor. The resultant Permissions instance
        is applied to the given path during directory creation.
    */
    var makeDirectory = FS.makeDirectory = promise(FS.makeDirectory)
    /**
        Removes a directory if it is empty. If path is not empty, not a
        directory, or cannot be removed for another reason an exception
        must be thrown. If path is a link and refers canonically to a
        directory, the link must be removed.
        @param {String()} path
        @returns {Promise}
    */
    var removeDirectory = FS.removeDirectory = promise(FS.removeDirectory)
// Tests
    /**
        Checks path for existance
        @param {String()} path
        @returns {Promise}
        @resolves {Boolean}
    */
    var exists = FS.exists = promise(FS.exists)
    
    var _isFile = FS.isFile, _isDir = FS.isDirectory
    /**
        Checks if path is a file
        @param {String()} path
        @returns {Promise}
        @resolves {Boolean}
    */
    var isFile = FS.isFile = promise(
        _isFile ? _isFile : !_isDir ? NI : function(path, resolve, reject) {
            _isDir(path, function(value) { resolve(!value) }, reject)
        }
    )
    /**
        Checks if path is a Directory
        @param {String()} path
        @returns {Promise}
        @resolves {Boolean}
    */
    var isDirectory = FS.isDirectory = promise(
        _isDir ? _isDir : !_isFile ? NI : function(path, resolve, reject) {
            _isFile(path, function(value) { resolve(!value) }, reject)
        }
    )
    /**
        Checks if path is a symbolic / hard link
        @param {String()} path
        @returns {Promise}
        @resolves {Boolean}
    */
    var isLink = FS.isLink = promise(FS.isLink)
    /**
        returns whether a path exists and that it could be opened for
        reading at the time of the call using `openRaw` for files or 
        `list` for directories.
        @param {String()} path
        @returns {Promise}
        @resolves {Boolean}
    */
    var isReadable = FS.isReadable = promise(FS.isReadable)
    /**
        If a path exists, returns whether a file may be opened for 
        writing, or entries added or removed from an existing directory.
        If the path does not exist, returns whether entries for files, 
        directories, or links can be created at its location.
    */
    var isWriteable = FS.isWriteable = promise(FS.isWriteable)
    /**
        returns whether two paths refer to the same storage (file or
        directory), either by virtue of symbolic or hard links, such that
        modifying one would modify the other. In the case where either
        some or all paths do not exist, we return `false`. If we are
        unable to verify if the storage is the same (such as by having
        insufficient permissions), an exception is thrown.
        @param {String()} pathA
        @param {String()} pathB
        @returns {Promise}
        @resolves {Boolean}
    */
    var same = FS.same = promise(FS.same)
    /**
        returns whether two paths refer to an entity on the same
        filesystem. An exception will be thrown if it is not possible
        to determine this.
        @param {String()} pathA
        @param {String()} pathB
        @returns {Promise}
        @resolves {Boolean}
    */
    var sameFilesystem = FS.sameFilesystem = promise(
        FS.sameFilesystem || function(a, b, resolve) { resolve(true) }
    )
// Attributes
    /**
        returns the size of a file in bytes, or throws an exception if the
        path does not correspond to an accessible path, or is not a
        regular file or a link. If path is a link, returns the size of the
        final link target, rather than the link itself.  
        Care should be taken that this number returned is suitably large
        (i.e. that we can get useful figures for files over 1GB
        (30bits+sign bit). If the size of a file cannot be represented by
        a JavaScript number, "size" must throw a RangeError.
        @param {String()} path
        @returns {Promise}
        @resolves {Number}
    */
    var size = FS.size = promise(FS.size)
    /**
        returns the time that a file was last modified as a Date object.
    */
    var lastModified = FS.lastModified = promise(FS.lastModified)
// Listing
    /**
        returns the names of all the files in a directory, in lexically
        sorted order. Throws an exception if the directory cannot be
        traversed (or path is not a directory).  
        Note: this means that `list("x")` of a directory containing `"a"`
        and `"b"` would return `["a", "b"]`, not `["x/a", "x/b"]`.
        @param {String()} path
        @returns {Promise}
        @resolves {String[]}
    */
    var list = FS.list = promise(FS.list)
    // not sure this makes any sense
    var iterator = FS.iterator = promise(FS.iterator || function() {
        throw new Error('Not implemented yet')
    })
// http://wiki.commonjs.org/wiki/Filesystem/A
// Files
    /**
        opens, reads, and closes a file, returning its content.
        Equivalent to `open(source, mode).read()`
        @param {String()} path
        @param {String|Object} mode     see in `FileSource.prototype.open`
        @returns {Promise}
        @resolves {String}
    */
    var read = FS.read = promise(FS.read ||
        (!_open ? NI : function(path, mode, resolve, reject) {
            _open(path, mode, function(io) { 
                io.read(resolve, reject) 
            }, reject)
        })
    )
    /**
        Opens, writes, flushes, and closes a file with the given content.
        If the content is a ByteArray or ByteString, the binary mode is
        implied. Equivalent to 
        `open(source, mode + "w" + (content instanceof Binary ? "b" : ""))
            .write(content).flush()`
        for mode Strings.
        @param {String()} path
        @param {String()} content
        @param {String|Object} mode     see in `FileSource.prototype.open`
        @returns {Promise}
    */
    var write = FS.write = promise(FS.write ||
        (!_open ? NI : function(path, content, mode, resolve, reject) {
            _open(path, mode + "w", function(io) { 
                io.write(content, resolve, reject)
            }, reject)
        })
    )
    /**
        reads one file and writes another in byte mode. Equivalent to 
        `open(source, "b").copy(target, "b")`
        @param {String()} source
        @param {String()} target
        @returns {Promise}
    */
    var _copy = FS.copy, copy = FS.copy = _copy ? promise(_copy) 
        : function copy(source, target) {
            return when(read(source), function(content) {
                return write(target, content)
            })
        }
    /**
        Changes the name of a file at a given path. This differs from move
        in that the target is relative to the source instead of the
        current working directory. This method in particular should be
        implemented by the native `fs-base` module overriding any pure
        JavaScript implementation, if possible.
        @param {String()} path
        @path {String()} name
        @returns {Promise}
    */
    var _rename = FS.rename, rename = FS.rename = _rename ? promise(_rename)
        : function rename(path, name) {
            return move(path, FS.join(FS.directory(path), name))
        }
    /**
        Creates the directory specified by `path` including any missing
        parent directories.
        @param {String()} path
        @returns {Promise}
    */
    var _makeTree = FS._makeTree, makeTree = FS.makeTree = _makeTree 
        ? promise(_makeTree) : function makeTree(path) {
            return when(exists(path), function(exists) {
                return exists || when(makeTree(FS.directory(path)), 
                    function() {
                        return FS.makeDirectory(path)
                    }
                )
            })
        }
    /**
        Removes whatever exists at the given path, regardless of whether
        it is a file, direcotory, or otherwise. If the path refers to a
        directory, but not a symbolic link to a directory, calls 
        `removeTree` on each member of the directory.
        @param {String()} path
        @returns {Promise}
    */
    var _removeTree = FS.removeTree, removeTree = FS.removeTree = _removeTree
        ? promise(_removeTree) : function removeTree(path) {
            return when(listTree(path), function (paths) {
                // sort and delete
                throw new Error('Not implemented yet')
            })
        }
    /**
        copies files from a source path to a target path, copying the 
        files of the source tree to the corresponding locations relative
        to the target, copying but not traversing into symbolic links to
        directories.
        @param {String()} source
        @param {String()} target
        @returns {Promise}
    */
    var _copyTree = FS.copyTree, copyTree = FS.copyTree = _copyTree
        ? promise(_copyTree) : function copyTree(source, target) {
            return when(listTree(source), function (paths) {
                // sort and create folders & copy files
                throw new Error('Not implemented yet')
            })
        }
// Listing
    /**
        returns an Array that starts with the given path, and all of the
        paths relative to the given path, discovered by a depth first
        traversal of every directory in any visited directory, reporting
        but not traversing symbolic links to directories, in lexically
        sorted order within directories. The first path is always "", the
        path relative to itself.
        @param {String()} path
        @returns {Promise}
        @resolves {String[]}
    */
    var _listTree = FS.listTree, listTree = FS.listTree = _listTree
        ? promise(_listTree) : function listTree(path) {
            // list recursively and resolve promise when ready
            throw new Error('Not implemented yet')
        }
    /**
        returns an Array that starts with the given directory, and all the
        directories relative to the given path, discovered by a depth
        first traversal of every directory in any visited directory, not
        traversing symbolic links to directories, in lexically sorted
        order within directories. 
        @param {String()} path
        @returns {Promise}
        @resolves {String[]}
    */
    var _listDirectoryTree = FS.listDirectoryTree, 
        listDirectoryTree = FS.listDirectoryTree = _listDirectoryTree
        ? promise(_listDirectoryTree) : function listDirectoryTree(path) {
            // list recursively and resolve promise when ready
            throw new Error('Not implemented yet')
        }

    // extending with filesystem methods
    var Path = FS.Path
    var PathProto = Path.prototype
    nonPathed.forEach(function(name) {
        PathProto[name] = function() {
            var rest = _slice.call(arguments)
            rest.unshift(this.toString())
            return when(FS[name].apply(this, rest), function(value) {
                return 'string' === typeof value 
                    ? new PathProto.constructor(value) : value
            })
        }
    })
    pathIterated.forEach(function(name) {
        PathProto[name] = function() {
            var rest = _slice.call(arguments)
            rest.unshift(this.toString())
            return when(fs[name].apply(this, rest), function(list) {
                return list.map(function (path) {
                    return new PathProto.constructor(path)
                })
            })
        }
    })
    return FS
}
