'use strict'

var Trait = require('light-traits').Trait
,   Promised = require('promised-utils').Promised
,   Q = require('q'), when = Q.when, asap = Q.asap, defer = Q.defer

exports.FSTestsTrait = Trait(
{ _exists: Trait.required
, _isFile: Trait.required
  // Checks if the path is directory
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
, exists: Promised(function exists(path) {
    this._exists.apply(this, arguments)
  })
  // Checks if path is a file
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
, isFile: function isFile(path) {
    this._isFile.apply(this, arguments)
  }
  // Checks if path is a Directory
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
, isDirectory: function isDirectory(path, callback) {
    return when(this._isFile, function(isFile) { return !isFile })
  }
  // Checks if path is a symbolic / hard link
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
, isLink: function isLink(path) {
  }
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
, isReadable: function isReadable(path) {
  }
  // If a path exists, returns whether a file may be opened for 
  // writing, or entries added or removed from an existing directory.
  // If the path does not exist, returns whether entries for files, 
  // directories, or links can be created at its location.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << Boolean}
   */
, isWritable: function isWritable(path) {
  }
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
, same: function same(source, target) {
  }
  // returns whether two paths refer to an entity on the same
  // filesystem. An exception will be thrown if it is not possible
  // to determine this.
  /**
   * @param {String(Promise|String|Path)} source
   * @param {String(Promise|String|Path)} target
   * @returns {Promise << Boolean}
   */
, sameFilesystem: function sameFilesystem(source, target) {
  }
})
