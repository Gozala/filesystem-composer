'use strict'

var Trait = require('light-traits').Trait
var PromisedTrait = require('promised-traits').PromisedTrait
var FSTrait = require('./fs').FSTrait

exports.FSTrait = FSTrait
exports.compose = function compose(engine) {
  return Trait.compose(
    require('./paths').FSPathsTrait,
    require('./permissions').FSPermissionsTrait,
    require('./path-type').FSPathTypeTrait,
    require('./fs-base').FSBaseTrait,
    PromisedTrait(engine).resolve({ _umask: null }),
    Trait({ _umask: engine._umask })
  ).create()
}
