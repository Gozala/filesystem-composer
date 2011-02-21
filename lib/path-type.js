'use strict'

var Trait = require('light-traits').Trait
var FSBaseTrait = require('./fs-base').FSBaseTrait
var FSPath = require('./paths'),
      FSPathCoreTrait = FSPath.FSPathCoreTrait,
      FSPathUtilsTrait = FSPath.FSPathUtilsTrait
// Array shortcuts
var _join = Array.prototype.join, _slice = Array.prototype.slice

var PathTypeBase = {}, PathType = {}

Object.keys(FSBaseTrait).forEach(function(key) {
  if (FSBaseTrait[key].required) return
  PathTypeBase[key] = { value: function() {
    var params = _slice.call(arguments)
    params.unshift(String(this))
    return this._fs[key].apply(this._fs, params)
  }}
})
Object.keys(FSPathCoreTrait).forEach(function(key) {
  PathType[key] = { value: function() {
    var params = _slice.call(arguments)
    params.unshift(String(this))
    return this.constructor(this._fs[key].apply(this._fs, params))
  }}
})
Object.keys(FSPathUtilsTrait).forEach(function(key) {
  if (FSPathUtilsTrait[key].required) return
  PathType[key] = { value: function() {
    var params = _slice.call(arguments)
    params.unshift(String(this))
    return this._fs[key].apply(this._fs, params)
  }}
})

var PathTypeTrait = Trait.compose(PathTypeBase, PathType, Trait({
  _fs: Trait.required,
  toString: Trait.required,
  constructor: Trait.required,
  valueOf: function valueOf() {
    return this.toString()
  },
  to: function to(target) {
    return this.constructor(this._fs.relative(this.toString(), target))
  },
  from: function from(target) {
    return this.constructor(this._fs.relative(target, this.toString()))
  }
}))

function Path(paths/*, ...*/) {
  var path = ('string' === typeof paths) ? paths
    : (1 === paths.length && '' === paths[0]) ? ''
    : this.join.apply(this, paths) || '.'

  return PathTypeTrait.create(Object.create(String.prototype,{
    _fs: { value: this },
    toString: { value: function toString() { return path } },
    valueOf: { value: function valueOf() { return path } },
    constructor: { value: this._Path }
  }))
}

exports.FSPathTypeTrait = Trait({
  _Path: null,
  Path: function PathType() {
    return (this._Path || (this._Path = Path.bind(this))).apply(this, arguments)
  },
  path: function PathType() {
    return this.Path.apply(this, arguments)
  },
  workingDirectoryPath: function workingDirectoryPath() {
    return this.Path(this.workingDirectory())
  }
})
