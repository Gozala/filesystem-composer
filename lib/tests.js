'use strict'

var Trait = require('light-traits').Trait
var Q = require('q'), when = Q.when, asap = Q.asap, defer = Q.defer

exports.FSTestsTrait = Trait({
  _exists: Trait.required,
  _isFile: Trait.required,
  _same: Trait.required,
  _sameFilesystem: Trait.required,
  _isLink: Trait.required,
  // returns whether a path exists and that it could be opened for
  // reading at the time of the call using `openRaw` for files or 
  // `list` for directories.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
  exists: function exists(path) {
    this._exists.apply(this, arguments)
  },
  // Checks if path is a file
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
  isFile: function isFile(path) {
    this._isFile.apply(this, arguments)
  },
  // Checks if path is a Directory
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
  isDirectory: function isDirectory(path) {
    if ('_isDirectory' in this) return this._isDirectory.apply(this, arguments)
    else return when(this.isFile(path), function(isFile) { return !isFile })
  },
  // Checks if path is a symbolic / hard link
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
  isLink: function isLink(path) {
    this._isLink.apply(this, arguments)
  },
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
  isReadable: function isReadable(path) {
    throw new Error('`isReadable` is not implemented yet')
  },
  // If a path exists, returns whether a file may be opened for 
  // writing, or entries added or removed from an existing directory.
  // If the path does not exist, returns whether entries for files, 
  // directories, or links can be created at its location.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
  isWritable: function isWritable(path) {
    throw new Error('`isWritable` is not implemented yet')
  },
  // returns whether two paths refer to the same storage (file or
  // directory), either by virtue of symbolic or hard links, such that
  // modifying one would modify the other. In the case where either
  // some or all paths do not exist, we return `false`. If we are
  // unable to verify if the storage is the same (such as by having
  // insufficient permissions), an exception is thrown.
  /**
   * @param {String(Promise|String|Path)} source
   * @param {String(Promise|String|Path)} target
   * @returns {Promise << Boolean}
   */
  same: function same(source, target) {
    this._same.apply(this, arguments)
  },
  // returns whether two paths refer to an entity on the same
  // filesystem. An exception will be thrown if it is not possible
  // to determine this.
  /**
   * @param {String(Promise|String|Path)} source
   * @param {String(Promise|String|Path)} target
   * @returns {Promise << Boolean}
   */
  sameFilesystem: function sameFilesystem(source, target) {
    this._sameFilesystem.apply(this, arguments)
  }
})
