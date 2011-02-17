// 'use strict' Octal literals are not allowed in strict mode

var Trait = require('light-traits').Trait
var q = require('q'), when = q.when, reject = q.reject
var pu = require('promised-utils'), all = pu.all, Promised = pu.Promised

exports.FSDirectoriesTrait = Trait({
  _makeDirectory: Trait.required,
  _removeDirectory: Trait.required,
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
  makeDirectory: function makeDirectory(path, options, callback) {
    if (undefined == callback) {
      callback = options
      options = this.Permissions(0777)
    } else {
      options = this.Permissions(options)
    }
    this._makeDirectory(path, options, callback)
  },
  // Removes a directory if it is empty. If path is not empty, not a
  // directory, or cannot be removed for another reason an exception
  // must be thrown. If path is a link and refers canonically to a
  // directory, the link must be removed.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << }
   */
  removeDirectory: function removeDirectory(path) {
    this._removeDirectory.apply(this, arguments)
  },
  // Creates the directory specified by `path` including any missing
  // parent directories.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise}
   */
  makeTree: function makeTree(path) {
    var parts = this.split(path)
    return parts.reduce(Promised(function reduced(path, entry) {
      path = this.join(path, entry)
      return when(this.makeDirectory(path), function created() {
        return path
      }, function cantCreate(reason) {
          return when(this.isDirectory(path), function(isDirectory) {
            if (isDirectory) return path
            return reject(reason)
          })
      }.bind(this))
    }).bind(this), parts.shift())
  },
  // Removes whatever exists at the given path, regardless of whether
  // it is a file, direcotory, or otherwise. If the path refers to a
  // directory, but not a symbolic link to a directory, calls 
  // `removeTree` on each member of the directory.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise}
   */
  removeTree: function removeTree(path) {
    return when(this.list(path), function(entries) {
      // Returning promise for all the file / dir removes.
      var removeEntries = all(entries.map(function(entry) {
        var entryPath = this.join(path, entry)
        // Map a promise for entry remove.
        return when(this.remove(entryPath), function removed() {
          return true 
        },
          // If remove was rejected then promise was not a file so
          // trying to remove tree in that case.
        function notFile() {
          return this.removeTree(entryPath)
        }.bind(this))
      }, this))
      // When all the entries are removed removeing directory itself.
      return when(removeEntries, function entriesRemoved() {
        return this.removeDirectory(path)
      }.bind(this))
    }.bind(this))
  },
  // copies files from a source path to a target path, copying the 
  // files of the source tree to the corresponding locations relative
  // to the target, copying but not traversing into symbolic links to
  // directories.
  /**
   * @param {String(Promise|String|Path)} source
   * @param {String(Promise|String|Path)} target
   * @returns {Promise}
   */
  copyTree: function copyTree(source, targe) {
    throw new Error('`copyTree` is not implemented yet')
  }
})
