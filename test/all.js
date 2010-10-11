'use strict'

exports['test path'] = require('./path')

if (module == require.main) require('test').run(exports)
