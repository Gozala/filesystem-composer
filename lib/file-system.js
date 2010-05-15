'use strict';

var Q = require('commonjs/q'), when = Q.when, Deferred = Q.Deferred, 
    Promise = Q.Promise
var PATH = require('./path'), join = PATH.join, split = PATH.split,
    directory = PATH.directory
function NI() { new Error('Not implemented by FileSource') }


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
], pathed = [
    'relative',             'canonical'             'absolute'
]

exports.FileSystem = function FileSource(fileSource) {
    var fs = Object.create(FileSystem.prototype, {
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
        open: { value: fileSource.open || NI },
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
        move: { value: fileSource.move || NI },
        /**
            Removes the file at the given path. Throws an exception if the 
            path corresponds to anything that is not a file or a symbolic 
            link. If `path` refers to a symbolic link, removes the symbolic
            link.
            @param {String()} path
            @returns {Promise}
        */
        remove: { value: fileSource.open || NI },
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
        touch: { value: fileSource.touch || NI },
    // Directories
        /**
            Create a single directory specified by path. If the directory
            cannot be created for any reason an exception must be thrown. This
            includes if the parent directories of `path` are not present. The
            permissions object passed to this method is used as the argument
            to the Permissions constructor. The resultant Permissions instance
            is applied to the given path during directory creation.
        */
        makeDirectory: { value: fileSource.makeDirectory || NI },
        /**
            Removes a directory if it is empty. If path is not empty, not a
            directory, or cannot be removed for another reason an exception
            must be thrown. If path is a link and refers canonically to a
            directory, the link must be removed.
            @param {String()} path
            @returns {Promise}
        */
        removeDirectory: { value: fileSource.removeDirectory || NI },
    // Tests
        /**
            Checks path for existance
            @param {String()} path
            @returns {Promise}
            @resolves {Boolean}
        */
        exists: { value: fileSource.exists || NI },
        /**
            Checks if path is a file
            @param {String()}
            @returns {Promise}
            @resolves {Boolean}
        */
        isFile: {
            value: (fileSource.isFile ? fileSource.isFile :
                fileSource.isDirectory ? function isFile(path) {
                    return !fileSource.isDirectory(path)
                } : NI)
        },
        /**
            Checks if path is a Directory
            @param {String()} path
            @returns {Promise}
            @resolves {Boolean}
        */
        isDirectory: {
            value: (fileSource.isDirectory ? fileSource.isDirectory :
                fileSource.isFile ? function isDirectory(path) {
                    return !fileSource.isFile(path)
                } : NI)
        },
        /**
            Checks if path is a symbolic / hard link
            @param {String()} path
            @returns {Promise}
            @resolves {Boolean}
        */
        isLink: { value: fileSource.isLink || NI },
        /**
            returns whether a path exists and that it could be opened for
            reading at the time of the call using `openRaw` for files or 
            `list` for directories.
            @param {String()} path
            @returns {Promise}
            @resolves {Boolean}
        */
        isReadable: { value: fileSource.isReadable || NI },
        /**
            If a path exists, returns whether a file may be opened for 
            writing, or entries added or removed from an existing directory.
            If the path does not exist, returns whether entries for files, 
            directories, or links can be created at its location.
        */
        isWriteable: { value: fileSource.isWriteable || NI },
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
        same: { value: fileSource.same || NI },
        /**
            returns whether two paths refer to an entity on the same
            filesystem. An exception will be thrown if it is not possible
            to determine this.
            @param {String()} pathA
            @param {String()} pathB
            @returns {Promise}
            @resolves {Boolean}
        */
        sameFilesystem: { value: fileSource.sameFilesystem || NI },
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
        size: { value: fileSource.size || NI },
        /**
            returns the time that a file was last modified as a Date object.
        */
        lastModified: { value: fileSource.lastModified || NI },
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
        list: { value fileSource.list || NI },
        // not sure this makes any sense
        iterator: { value: NI },
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
        read: {
            value: fileSource.read || function read(path, mode) {
                fs.open.read(path, mode)
            }
        },
        /**
            Opens, writes, flushes, and closes a file with the given content.
            If the content is a ByteArray or ByteString, the binary mode is
            implied. Equivalent to 
            `open(source, mode + "w" + (content instanceof Binary ? "b" : ""))
                .write(content).flush()`
            for mode Strings.
            @param {String()} path
            @param {String|Promise} content
            @param {String|Object} mode     see in `FileSource.prototype.open`
            @returns {Promise}
        */
        write: {
            value: fileSource.write || function write(path, content, mode) {
                return fs.open(path, mode + "w").write(content).flush()
            }
        },
        /**
            reads one file and writes another in byte mode. Equivalent to 
            `open(source, "b").copy(target, "b")`
            @param {String()} source
            @param {String()} target
            @returns {Promise}
        */
        copy: {
            value: fileSource.copy || function copy(source, target) {
                return when(fs.read(source), function(content) {
                    return fs.write(path, content)
                })
            }
        },
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
        rename: {
            value: fileSource.rename || function rename(path, name) {
                return fs.move(path, join(directory(path), name))
            }
        },
        /**
            Creates the directory specified by `path` including any missing
            parent directories.
            @param {String()} path
            @returns {Promise}
        */
        makeTree: {
            value: fileSource.makeTree || function makeTree(path) {
                return when(fs.exists(path), function(exists) {
                    return exists ||
                        when(fs.makeTree(directory(path)), function() {
                            return fs.makeDirectory(path)
                        })
                })
            }
        },
        /**
            Removes whatever exists at the given path, regardless of whether
            it is a file, direcotory, or otherwise. If the path refers to a
            directory, but not a symbolic link to a directory, calls 
            `removeTree` on each member of the directory.
            @param {String()} path
            @returns {Promise}
        */
        removeTree: {
            value: fileSource.removeTree || function removeTree(path) {
                
            }
        },
        /**
            copies files from a source path to a target path, copying the 
            files of the source tree to the corresponding locations relative
            to the target, copying but not traversing into symbolic links to
            directories.
            @param {String()} source
            @param {String()} target
            @returns {Promise}
        */
        copyTree: {
            value: fileSource.copyTree || function copyTree(source, target) {
                
            }
        },
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
        listTree: {
            value: fileSource.listTree || function listTree(path) {
                NI();
            }
        },
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
        listDirectoryTree: {
            value: fileSource.listDirectoryTree ||
            function listDirectoryTree(path) {
                NI();
            }
        },
    // Path
        /**
            Current working directory. Analog to `cwd`.
            @returns {Promise}
            @resolves {String}
        */
        workingDirectory: { value: fileSource.workingDirectory || NI },
        /**
            Changes working directory. Analog to `cd`.
            @param {String()} path
            @returns {Promise}
        */
        changeWorkingDirectory: { 
            value: fileSource.changeWorkingDirectory || NI 
        },
        /**
            returns the absolute path, starting with the root of this file
            system object, for the given path, resolved from the current
            working directory. If the file system supports home directory
            aliases, absolute resolves those from the root of the file system.
            The resulting path is in normal form. On most systems, this is
            equivalent to expanding any user directory alias, joining the path
            to the current working directory, and normalizing the result.
            "absolute" can be implemented in terms of "workingDirectory",
            "join", and "normal".
            @param {String()} path
            @returns {String}
        */
        absolute: {
            value: function absolute(path) {
                return fs.resolve(join(fs.workingDirectory(), ''), path)
            }
        },
        /*
        returns the canonical path to a given abstract path. Canonical paths
        are both absolute and intrinsic, such that all paths that refer to a
        given file (whether it exists or not) have the same corresponding
        canonical path. This function is equivalent to joining the given path
        to the current working directory (if the path is relative), joining
        all symbolic links along the path, and normalizing the result to
        remove relative path (. or ..) references.
        * When the underlying implementation is built on a Unicode-aware file
        system, Unicode normalization must also be performed on the path using
        the same normal form as the underlying file system. 
        * It is not required that paths whose directories do not exist have a
        canonical representation. Such paths will be canonicalized as
        "undefined". Note: this point has caused some argument, and the exact
        behaviour in this case needs to be determined.
        @path {String()} path
        @returns {String}
        */
        canonical: {
            value: function canonical(path) {
                // an implementation in terms of readlink, cwd, and the pure-js
                // methods provided by Narwhal's file-bootstrap, join, split,
                // and isDrive, which depends on system.os to distinguish
                // windows and unix drives
                var paths = [fs.workingDirectory(), path], outs = [], prev
                for (var i = 0, ii = paths.length; i < ii; i++) {
                    var path = paths[i]
                    var ins = split(path)
                    if (exports.isDrive(ins[0])) outs = [ins.shift()]
                    while (ins.length) {
                        var leaf = ins.shift()
                        var consider = join.apply(undefined, outs.concat([leaf]))
                        // cycle breaker; does not throw an error since every
                        // invalid path must also have an intrinsic canonical
                        // name.
                        if (consider == prev) {
                            ins.unshift.apply(ins, exports.split(link))
                            break
                        }
                        prev = consider
                        try {
                            var link = fs.readlink(consider)
                        } catch (e) { link = undefined }
                        if (undefined !== link) ins.unshift.apply(ins, split(link))
                        else outs.push(leaf)
                    }
                }
                return exports.join.apply(undefined, outs);
            }
        },
        /**
            returns the relative path from one path to another using only ".." to
            traverse up to the two paths' common ancestor. If the target is omitted,
            returns the path to the source from the current working directory
            @param {String()} source
            @param {String()} target
            @returns {String}
        */
        relative: {
            value: function relative(source, target) {
                if (!target) {
                    target = source
                    source = fs.workingDirectory()
                }
                source = fs.absolute(source)
                target = fs.absolute(target)
                source = split(source)
                target = split(target)
                source.pop()
                while (
                    source.length &&
                    target.length &&
                    target[0] === source[0]
                ) {
                    source.shift()
                    target.shift()
                }
                while (source.length) {
                    source.shift()
                    target.unshift('..')
                }
                return join.apply(null, target)
            }
        },
        path: {
            value: function path(/*path*/) {
                var Path = fs.Path
                return (1 === arguments.length && '' === arguments[0]) ? 
                    Path('') :
                    Path(join.apply(null, arguments))
        },
        Path: function Path(path) {
            if (!(this instanceof Path)) return new Path(path)
            this.toString = function toString() { return path }
        }
    })
    // coping path methods
    for (var method in PATH) fs[method] = PATH[method]
    // extending with filesystem methods
    var PathProto = fs.Path.prototype = Object.create(PATH.Path.prototype)
    nonPathed.forEach(function(name) {
        PathProto[name] = function() {
            return fs[name].apply(this, 
                [this.toString()].concat(_slice.call(arguments))
            )
        }
    })
    pathIterated.forEach(function(name) {
        PathProto[name] = function() {
            return when(fs[name].apply(this, 
                [this.toString()].concat(_slice.call(arguments))
            ), function(list) {
                return list.map(function (path) {
                    return new this.constructor(path)
                })
            })
        }        
    })
    pathed.forEach(function(name) {
        PathProto[name] = function() {
            return fs[name].apply(this, 
                [this.toString()].concat(_slice.call(arguments))
            )
        }
    })
    return fs
}