'use strict'

exports.Callback = function Callback(deferred) {
  return function callback(e, value) {
    if (e) deferred.reject(e)
    else deferred.resolve(value)
  }
}
