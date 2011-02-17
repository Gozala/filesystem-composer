'use strict'

var Trait = require('light-traits').Trait
var when = require('q').when
var all = require('promised-utils').all

function normalizedDirectoryPath(fs, path) {
  return path.charAt(path.length - 1) === fs._separator ?
         path : path + fs._separator
}

function tree(path, relative, fs, directories, files) {
  var value = []
  return when(fs.list(path), function onList(entries) {
    var tasks = entries.reduce(function (tasks, entry) {
      // Making a list entry path.
      var entryPath = fs.join(path, entry)
      // Creating promise for the list tree of entry path.
      var task = when(tree(entryPath, relative, fs, directories, files),
      function onTree(subTree) {
        // Adding an entry path if listing directories
        if (directories) value.push(normalizedDirectoryPath(fs, entryPath))
        value.push.apply(value, subTree)
      },
      function notDirectory() {
        if (files) value.push(entryPath)
      })

      tasks.push(task)
      return tasks
    }, [])

    return when(all(tasks), function() {
      return value.map(function (subpath) {
        return subpath.replace(relative, '.' + fs._separator)
      })
    })
  })
}

exports.FSListTrait = Trait({
  _list: Trait.required,
  // returns the names of all the files in a directory, in lexically
  // sorted order. Throws an exception if the directory cannot be
  // traversed (or path is not a directory).  
  // Note: this means that `list("x")` of a directory containing `"a"`
  // and `"b"` would return `["a", "b"]`, not `["x/a", "x/b"]`.
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << String[]}
   */
  list: function list(path) {
    this._list.apply(this, arguments)
  },
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
  listTree: function listTree(path, callback) {
    path = normalizedDirectoryPath(this, path)
    return tree(path, path, this, true, true)
  },
  // returns an Array that starts with the given directory, and all the
  // directories relative to the given path, discovered by a depth
  // first traversal of every directory in any visited directory, not
  // traversing symbolic links to directories, in lexically sorted
  // order within directories. 
  /**
   * @param {String(Promise|Path)|String} path
   * @returns {Promise << String[]}
   */
  listDirectoryTree: function listDirectoryTree(path) {
    path = normalizedDirectoryPath(this, path)
    return tree(path, path, this, true, false)
  }
})
