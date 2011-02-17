'use strict'

var Trait = require('light-traits').Trait
// Array shortcuts
var _join = Array.prototype.join, _slice = Array.prototype.slice

exports.FSPathHelpersTrait = Trait({
  split: Trait.required,
  /**
   * Returns true if path is a windows drive, which has `c:` like form.
   * @param {String} path      top slice from path
   * @returns {Boolean}
   */
  _isDrive: function _isDrive(path) {
    return path.indexOf(':') === --path.length
  },
  /**
   * Returns true if path is absolute.
   * For absolute paths on any operating system,
   * the first path component always determines whether it is relative or
   * absolute.
   * @example
   *        // on Unix, it is empty
   *        ['', 'foo'].join('/') == '/foo'
   *        '/foo'.split('/') == ['', 'foo']
   *        // while on windows it is has form of drive
   *        ['c:', 'foo'].join('\\') == 'c:\\foo'
   *        'c:\\foo'.split('\\') == ['c:', 'foo']
   *        // '' is not absolute.
   *        split('') == []
   *        // '/' is absolute.
   *        split('/') == ['', '']
   * @param {String()}
   * @returns {Boolean}
   */
  _isAbsolute: function _isAbsolute(path) {
    var parts = this.split(path), head = parts[0]
    return (parts.length == 0) ? false : '' === head || this._isDrive(head)
  }
})

exports.FSPathCoreTrait = Trait({
  _separator: Trait.required,
  _isAbsolute: Trait.required,
  _isDrive: Trait.required,
  split: Trait.required,
 /**
  * Current working directory. Analog to `pwd`.
  * @returns {String}
  */
  workingDirectory: Trait.required,
 /**
  * Changes working directory, analog to `cd`.
  * @param {String()} path
  * @returns {String|Promise}
   */
  changeWorkingDirectory: Trait.required,
  /**
   * Takes a variadic list of path Strings, joins them on the file system's
   * path separator, and normalizes the result.
   * [details](http://wiki.commonjs.org/wiki/Filesystem/Join)
   * @params {String()}
   * @returns {String()}
    */
  join: function join() {
    // special case for root, helps glob [""] -> "/"
    if (1 === arguments.length && '' === arguments[0]) return this._separator
    // ["", ""] -> "/",
    // ["", "a"] -> "/a"
    // ["a"] -> "a"
    return this.normal(_join.call(arguments, this._separator)) || '.'
  },
  /**
   * function like `join` except that it treats each argument as as either
   * an absolute or relative path and, as is the convention with URL's,
   * treats everything up to the final directory separator as a location,
   * and everything afterward as an entry in that directory, even if the
   * entry refers to a directory in the underlying storage. Resolve starts
   * at the location `""` and walks to the locations referenced by each
   * path, and returns the path of the last file. Thus, `resolve(file, "")`
   * idempotently refers to the location containing a file or directory
   * entry, and `resolve(file, neighbor)` always gives the path of a file
   * in the same directory. `resolve` is useful for finding paths in the
   * `neighborhood` of a given file, while gracefully accepting both
   * absolute and relative paths at each stage.
   * [unit tests](http://github.com/kriskowal/narwhal-test/blob/master/src/test/file/resolve.js).
   * @params {String()} path
   * @return {String[]}
   */
  resolve: function resolve() {
    var root = "", leaf = "", parents = [], children = [], 
        _separator = this._separator

    for (var i = 0, ii = arguments.length; i < ii; i++) {
      var path = String(arguments[i])
      if ('' === path) continue
      var parts = path.split(_separator)
      if (this._isAbsolute(path)) {
        root = parts.shift() + _separator
        parents = []
        children = []
      }
      leaf = parts.pop()
      if ('.' === leaf || '..' === leaf) {
        parts.push(leaf)
        leaf = ''
      }
      for (var j = 0, jj = parts.length; j < jj; j++) {
        var part = parts[j]
        if ('..' === part) {
          if (0 !== children.length) children.pop()
          else if (!root) parents.push('..')
        } else if ('.' !== part && '' !== part) children.push(part)
      }
    }
    path = parents.concat(children).join(_separator)
    if (path) leaf = _separator + leaf
    return root + path + leaf
  },
  /**
   * removes `'.'` path components and simplifies `'..'` paths, if
   * possible, for a given path.
   */
  normal: function() { return this.resolve.apply(this, arguments) },
  /**
   * returns the path of a file's containing directory, albeit the parent
   * directory if the file is a directory. A terminal directory separator
   * is ignored.
   */
  directory: function directory(path) {
    var parts = this.split(path)
    if ('' === parts.pop()) if ('' === parts.pop()) parts.push('')
    if (0 !== parts.length) parts.push('')
    return this.join.apply(this, parts) || '.'
  },
  /**
   * returns the absolute path, starting with the root of this file
   * system object, for the given path, resolved from the current
   * working directory. If the file system supports home directory
   * aliases, absolute resolves those from the root of the file system.
   * The resulting path is in normal form. On most systems, this is
   * equivalent to expanding any user directory alias, joining the path
   * to the current working directory, and normalizing the result.
   * "absolute" can be implemented in terms of "workingDirectory",
   * "join", and "normal".
   * @param {String()} path
   * @returns {String}
   */
  absolute: function absolute(path) {
    return this.resolve(this.join(this.workingDirectory(), ''), path)
  },
  /*
   * returns the canonical path to a given abstract path. Canonical paths
   * are both absolute and intrinsic, such that all paths that refer to a
   * given file (whether it exists or not) have the same corresponding
   * canonical path. This function is equivalent to joining the given path
   * to the current working directory (if the path is relative), joining
   * all symbolic links along the path, and normalizing the result to
   * remove relative path (. or ..) references.
   * When the underlying implementation is built on a Unicode-aware file
   * system, Unicode normalization must also be performed on the path using
   * the same normal form as the underlying file system.
   * * It is not required that paths whose directories do not exist have a
   * canonical representation. Such paths will be canonicalized as
   * "undefined". Note: this point has caused some argument, and the exact
   * behaviour in this case needs to be determined.
   * @path {String()} path
   * @returns {String}
   */
  canonical: function canonical(path) {
    var paths = [this.workingDirectory(), path], outs = [], prev

    for (var i = 0, ii = paths.length; i < ii; i++) {
      var path = paths[i], ins = this.split(path)
      if (this._isDrive(ins[0])) outs = [ins.shift()]
      while (ins.length) {
        var leaf = ins.shift()
        , consider = this.join.apply(this, outs.concat([leaf]))
        // cycle breaker; does not throw an error since every
        // invalid path must also have an intrinsic canonical
        // name.
        if (consider == prev) {
          ins.unshift.apply(ins, split(link))
          break
        }
        prev = consider
        try {
          var link = basename.readlink(consider)
        } catch (e) { link = undefined }
        if (undefined !== link) ins.unshift.apply(ins, split(link))
        else outs.push(leaf)
      }
    }
    return this.join.apply(this, outs)
  },
  /**
   * returns the relative path from one path to another using only ".." to
   * traverse up to the two paths' common ancestor. If the target is
   * omitted, returns the path to the source from the current working
   * directory
   * @param {String()} source
   * @param {String()} target
   * @returns {String}
   */
  relative: function relative(source, target) {
    var _separator = this._separator
    if (!target) {
      target = source
      source = this.workingDirectory() + _separator
    }
    source = this.absolute(source)
    target = this.absolute(target)
    source = this.split(source)
    target = this.split(target)
    source.pop()
    while (
      0 !== source.length &&
      0 !== target.length &&
      target[0] === source[0]
    ) {
      source.shift()
      target.shift()
    }
    while (0 !== source.length) {
      source.shift()
      target.unshift('..')
    }
    return target.join(_separator)
  }
})

exports.FSPathUtilsTrait = Trait({
  _separator: Trait.required,
  /**
   * returns an array of path components. If the path is absolute, the
   * first component will be an indicator of the root of the file system.
   * for file systems with drives (such as Windows), this is the drive
   * identifier with a colon, like `c:`. on Unix, this is an empty string
   * `""`. The intent is that calling `join.apply` with the result of
   * `split` as arguments will reconstruct the path.
   * @param {String()} path
   * @return {String[]}
   */
  split: function split(path) {
    path = String(path)
    // this special case helps isAbsolute
    // distinguish an empty path from an absolute path
    // "" -> [] NOT [""]
    // "a" -> ["a"]
    // "/a" -> ["", "a"]
    return '' === path ? [] : path.split(this._separator)
  },
  /**
   * returns the extension of a file. The extension of a file is the last
   * dot (excluding any number of initial dots) followed by one or more
   * non-dot characters. Returns an empty string if no valid extension
   * exists.
   * [unit test](http://github.com/kriskowal/narwhal-test/blob/master/src/test/file/extension.js).
   * @param {String()} path
   * @returns {String}
   */
  extension: function extension(path) {
    var basename = this.base(path).replace(/^\.+/, '')
    var index = basename.lastIndexOf('.')
    return 0 >= index ? '' : basename.substring(index)
  },
  /**
   * returns the part of the path that is after the last directory
   * separator. If an extension is provided and is equal to the file's
   * extension, the extension is removed from the result.
   * @param {String()} path
   * @param {String()} extension
   * @returns {String}
   */
  base: function base(path, extension) {
    var basename = this.split(path).pop() || ''
    if (undefined !== extension) {
      var l = basename.length - extension.length
      if (extension === basename.substr(l)) basename = basename.substr(0, l)
    }
    return basename
  }
})

/**
 * Creates an object implementing all "Path" manipulation APIs from CommonJS
 * [filesystem](http://wiki.commonjs.org/wiki/Filesystem/A) specification.
 * All the IO operation are meant to be added as a second tire on top.
 * @param {Object} source
 *    Object has to implement `workingDirectory` & `changeWorkingDirectory`
 *    functions since some of the "Path" manipulation functions (for example
 *    `absolute`) depend on them.
 * @param {Function} workingDirectory
 *    Function syncroniusly should return `String` of working directory on
 *    underlaying system, analog to `cwd`.
 * @param {Function} changeWorkingDirectory
 *    Function call should change working directory on underlying system
 */
exports.FSPathsTrait = Trait.compose(exports.FSPathHelpersTrait,
                                     exports.FSPathCoreTrait,
                                     exports.FSPathUtilsTrait)
