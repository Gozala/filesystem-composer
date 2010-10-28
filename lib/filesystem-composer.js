'use strict'

var Trait = require('light-traits').Trait
,   PromisedTrait = require('promised-traits').PromisedTrait
,   FSTrait = require('./fs').Trait

exports.FSTrait = FSTrait
exports.compose = function compose(engine) {
  return Trait
    ( require('./paths').FSPathsTrait
    , require('./permissions').FSPermissionsTrait
    , require('./path-type').FSPathTypeTrait
    , PromisedTrait({}, require('./fs-base').FSBaseTrait)
    , PromisedTrait(engine).resolve({ _umask: null })
    , Trait({ _umask: engine._umask })
    ).create()
}
