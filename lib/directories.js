'use strict'

var Trait = require('light-traits').Trait

exports.FSDirectoriesTrait = Trait(
{ _makeDirectory: Trait.required
, _removeDirectory: Trait.required
  // Create a single directory specified by path. If the directory
  // cannot be created for any reason an exception must be thrown. This
  // includes if the parent directories of `path` are not present. The
  // permissions object passed to this method is used as the argument
  // to the Permissions constructor. The resultant Permissions instance
  // is applied to the given path during directory creation.
  /**
   * @param {String(Promise|Path)|String} path
   * @param {Permissions(Promise(Object|String)|String|Object)} options
   * @returns {Promise}
   */
, makeDirectory: function makeDirectory(path, options, callback) {
    if (undefined == callback) {
      callback = options
      options = this.Permissions(0777)
    } else {
      options = this.Permissions(options)
    }
    this._makeDirectory(path, options, callback)
  }
  // Removes a directory if it is empty. If path is not empty, not a
  // directory, or cannot be removed for another reason an exception
  // must be thrown. If path is a link and refers canonically to a
  // directory, the link must be removed.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << }
   */
, removeDirectory: function removeDirectory(path) {
    this._removeDirectory.apply(this, arguments)
  }
  // Creates the directory specified by `path` including any missing
  // parent directories.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise}
   */
, makeTree: function makeTree(path) {
    throw new Error('`makeTree` is not implemented yet')
  }
  // Removes whatever exists at the given path, regardless of whether
  // it is a file, direcotory, or otherwise. If the path refers to a
  // directory, but not a symbolic link to a directory, calls 
  // `removeTree` on each member of the directory.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise}
   */
, removeTree: function removeTree(path) {
    throw new Error('`removeTree` is not implemented yet')
  }
  // copies files from a source path to a target path, copying the 
  // files of the source tree to the corresponding locations relative
  // to the target, copying but not traversing into symbolic links to
  // directories.
  /**
   * @param {String(Promise|String|Path)} source
   * @param {String(Promise|String|Path)} target
   * @returns {Promise}
   */
, copyTree: function copyTree(source, targe) {
    throw new Error('`copyTree` is not implemented yet')
  }
})
