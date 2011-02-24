'use strict'

var Trait = require('light-traits').Trait
var PromisedTrait = require('promised-traits').PromisedTrait

exports.FSAttributesTrait = require('./attributes').FSAttributesTrait
exports.FSDirectoriesTrait = require('./directories').FSDirectoriesTrait
exports.FSFilesTrait = require('./files').FSFilesTrait
exports.FSBaseTrait = require('./fs-base').FSBaseTrait
exports.FSTrait = require('./fs').FSTrait
exports.FSLinksTrait = require('./links').FSLinksTrait
exports.FSListTrait = require('./listing').FSListTrait
exports.FSPathTypeTrait = require('./path-type').FSPathTypeTrait
exports.FSPathsTrait = require('./paths').FSPathsTrait
exports.FSPermissionsTrait = require('./permissions').FSPermissionsTrait
exports.FSTestsTrait = require('./tests').FSTestsTrait

exports.compose = function compose(engine) {
  return exports.FSTrait.compose(
    exports.FSPathsTrait,
    exports.FSPermissionsTrait,
    exports.FSPathTypeTrait,
    exports.FSBaseTrait,
    PromisedTrait(engine).resolve({ _umask: null }),
    Trait({ _umask: engine._umask })
  ).create()
}
