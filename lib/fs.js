'use strict';

var pwd = ''
var FS = require('./path').compose({
    SEPARATOR: '/',
    workingDirectory: function() {
        return pwd
    },
    changeWorkingDirectory: function(path) {
        return pwd = FS.aboslute(path)
    }
})

for (var key in FS) exports[key] = FS[key]  