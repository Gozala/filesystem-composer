'use strict';

var pwd = '/home/'
var FS = require('./path').compose({
    SEPARATOR: '/',
    workingDirectory: function() {
        return pwd
    },
    changeWorkingDirectory: function(path) {
        return pwd = FS.absolute(path)
    }
})

for (var key in FS) exports[key] = FS[key]  