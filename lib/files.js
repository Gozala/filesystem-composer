'use strict'

var Trait = require('light-traits').Trait

exports.FSFilesTrait = Trait({
  _remove: Trait.required,
  _touch: Trait.required,
  _openRaw: Trait.required,
  _read: Trait.required,
  _write: Trait.required,
  // function returns promise for an `IO` stream that supports an appropriate
  // interface for the given options and mode, which include reading, writing,
  // updating, byte, character, unbuffered, buffered, and line buffered streams.
  /**
   *  @param {String()} path
   *      any value coercible to a String, including a Path, that can be
   *      interpreted as a fully-qualified path, or a path relative to
   *      the current working directory.
   *  @param {String} mode
   *      any subtring of "rwa+bxc" meaning "read", "write", "append", 
   *      "update", "binary", and "exclusive" flags respectively, in any
   *      order.
   *  @param {Object} mode
   *  @param {String} mode.mode
   *      conforming to the above mentioned mode string pattern
   *  @param {String} mode.charset
   *      an IANA, case insensitive, charset name. open must throw a 
   *      #TODO error if the charset is not supported. The ascii and
   *      utf-8 charsets must be supported.
   *  @param {Boolean} mode.read
   *      open for reading, do not create, set position to beginning of
   *      the file, throw an error if the file does not exist.
   *  @param {Boolean} mode.write
   *      open for writing, create or truncate, set position to the 
   *      beginning of the file.
   *  @param {Boolean} mode.append
   *      open for appending, create if it doesn't exist, do not
   *      truncate, set position to end of the file.
   *  @param {Boolean} mode.update
   *      open for updating, create if it doesn't exist, do not 
   *      truncate, set position to the beginning of the file.
   *  @param {Boolean} mode.binary
   *      return a raw stream instead of a buffered, charset encoded,
   *      text
   *  @param {Boolean} mode.exclusive
   *      open for write only if it does not already exist, otherwise
   *      throw an error.
   *  @returns {Promise}
   *  @resolves {Object}
   */
  openRaw: function openRaw(path, options) {
    this._openRaw.apply(this, arguments)
  },
  // Removes the file at the given path. Throws an exception if the 
  // path corresponds to anything that is not a file or a symbolic 
  // link. If `path` refers to a symbolic link, removes the symbolic
  // link.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise}
   */
  remove: function remove(path) {
    this._remove.apply(this, arguments)
  },
  // returns the names of all the files in a directory, in lexically
  // sorted order. Throws an exception if the directory cannot be
  // traversed (or path is not a directory).  
  // Note: this means that `list("x")` of a directory containing `"a"`
  // and `"b"` would return `["a", "b"]`, not `["x/a", "x/b"]`.
  /**
   * @param {String(Promise|Path)|String} path
   * @param {Permissions(Promise(Object|String)|String|Object)} options
   * @returns {Promise << String}
   */
  read: function read(path, options) {
    this._read.apply(this, arguments)
  },
  // Opens, writes, flushes, and closes a file with the given content.
  // If the content is a ByteArray or ByteString, the binary mode is
  // implied. Equivalent to 
  // `open(source, mode + "w" + (content instanceof Binary ? "b" : ""))
  //     .write(content).flush()`
  // for mode Strings.
  /**
   * @param {String(Promise|Path)|String} path
   * @param {String(Promise|String)} content
   * @param {Permissions(Promise(Object|String)|String|Object)} options
   * @returns {Promise << String}
   */
  write: function write(path, data, options) {
    this._write.apply(this, arguments)
  },
  // reads one file and writes another in byte mode. Equivalent to 
  // `open(source, "b").copy(target, "b")`
  /**
   * @param {String(Promise|String|Path)} source
   * @param {String(Promise|String|Path)} target
   * @returns {Promise}
   */
  copy: function copy(source, target) {
    Array.prototype.splice.call(arguments, 1, 1, this.read(source))
    this.write(target, arguments)
  },
  // Changes the name of a file at a given path. This differs from move
  // in that the target is relative to the source instead of the
  // current working directory. This method in particular should be
  // implemented by the native `fs-base` module overriding any pure
  // JavaScript implementation, if possible.
  /**
   * @param {String(Promise|String|Path)} source
   * @param {String(Promise|String|Path)} name
   * @returns {Promise}
   */
  rename: function rename(source, name) {
    var target = this.join(this.directory(source), name)
    Array.prototype.splice.call(argument, 1, 1, target)
    this._move.apply(this, arguments)
  },
  // Moves a directory from one path to another on the same file system.
  // Does not copy the directory under any circumstances. A conforming
  // implementation must move the directory using the operating 
  // system's file-system-atomic move or rename call. If it cannot be
  // moved for any reason an exception must be thrown. An exception
  // must be thrown if `target` specifies an existing directory.
  // *Note*: this is the same method used to move files. The behaviour
  // differs depending on whether source is a file or directory.
  /**
   * @param {String(Promise|String|Path)} source
   * @param {String(Promise|String|Path)} target
   * @returns {Promise}
   */
  move: function move(source, target) {
    this._move.apply(arguments)
  },
  // Sets the modification time of a file or directory at a given path
  // to a specified time, or the current time. Creates an empty file at
  // the given path if no file (special or otherwise) or directory
  // exists, using the default permissions (as though openRaw were
  // called with no permissions argument). If the underlying file
  // system does not support milliseconds, the time is truncated (not
  // rounded) to the nearest supported unit. On file systems that
  // support last-accessed time, this must be set to match the
  // modification time. Where possible, the underlying implementation
  // should insure that file creation and time stamp modification are
  // transactionally related to the same file, rather than the same
  // directory entry.
  /**
   * @param {String(Promise|Path)|String} path
   * @param {Date(Promise)|Date} date
   * @returns {Promise}
   */
  touch: function touch(path, date) {
    throw new Error('`touch` is not implemented yet')
  }
})
