'use strict'

var Trait = require('light-traits').Trait

exports.FSTrait = Trait.compose(
  require('./fs-base').FSBaseTrait,
  require('./paths').FSPathsTrait,
  require('./permissions').FSPermissionsTrait,
  require('./path-type').FSPathTypeTrait
)
