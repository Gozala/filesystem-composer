'use strict'

var Trait = require('light-traits').Trait
,   FSPathsTrait = require('./paths').FSPathsTrait
,   FSBaseTrait = require('./fs-base').FSBaseTrait
// Array shortcuts
,   _join = Array.prototype.join
,   _slice = Array.prototype.slice

,   PathTypeBase = {}
,   PathType = {}

Object.keys(FSBaseTrait).forEach(function(key) {
  PathTypeBase[key] = { value: function() {
    var params = _slice(arguments)
    params.unshift(this.toString() + '')
    console.log(params)
    return this._fs[key].apply(this._fs, params)
  }}
})
Object.keys(FSPathsTrait).forEach(function(key) {
  PathType[key] = { value: function() {
    var params = _slice(arguments)
    params.unshift(this.toString())
    return this.constructor(this._fs[key].apply(this._fs, params))
  }}
})

var PathTypeTrait = Trait
( PathTypeBase
, PathType
, Trait(
  { _fs: Trait.required
  , toString: Trait.required
  , constructor: Trait.required
  , valueOf: function valueOf() {
    return this.toString()
  }
, to: function to(target) {
    return this.constructor(this._fs.relative(this.toString(), target))
  }
, from: function from(target) {
    return this.constructor(this._fs.relative(target, this.toString()))
  }
  })
)

function Path(paths/*, ...*/) {
  var path = ('string' === typeof paths) ? paths
    : (1 === paths.length && '' === paths[0]) ? ''
    : this.join.apply(this, paths) || '.'

  return PathTypeTrait.create(
  Object.create(String.prototype,
    { _fs: { value: this }
    , toString: { value: function toString() { return path } }
    , constructor: { value: this.Path }
    })
  )
}

exports.FSPathTypeTrait = Trait(
{ _Path: null
, Path: function PathType() {
    return (this._Path || (this._Path = Path.bind(this))).apply(this, arguments)
  }
, path: function PathType() {
    return this.Path.apply(arguments)
  }
, workingDirectoryPath: function workingDirectoryPath() {
    return this.Path(this.workingDirectory())
  }
})

