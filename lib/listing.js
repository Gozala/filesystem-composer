'use strict'

var Trait = require('light-traits').Trait
,   Promised = require('promised-utils').Promised
,   Q = require('q'), when = Q.when, asap = Q.asap, defer = Q.defer

exports.FSListTrait = Trait(
{ _list: Trait.required
  // returns the names of all the files in a directory, in lexically
  // sorted order. Throws an exception if the directory cannot be
  // traversed (or path is not a directory).  
  // Note: this means that `list("x")` of a directory containing `"a"`
  // and `"b"` would return `["a", "b"]`, not `["x/a", "x/b"]`.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << String[]}
   */
, list: Promised(function list(path) {
    this._list.apply(this, arguments)
  })
  // returns an Array that starts with the given path, and all of the
  // paths relative to the given path, discovered by a depth first
  // traversal of every directory in any visited directory, reporting
  // but not traversing symbolic links to directories, in lexically
  // sorted order within directories. The first path is always "", the
  // path relative to itself.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << String[]}
   */
, listTree: function listTree(path, callback) {
    throw new Error('`listTree` is not implemented yet')
  }
  // returns an Array that starts with the given directory, and all the
  // directories relative to the given path, discovered by a depth
  // first traversal of every directory in any visited directory, not
  // traversing symbolic links to directories, in lexically sorted
  // order within directories. 
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << String[]}
   */
, listDirectoryTree: function listDirectoryTree(path) {
    throw new Error('`listDirectoryTree` is not implemented yet')
  }
})

