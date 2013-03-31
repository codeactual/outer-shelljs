/**
 * ShellJS extensions
 *
 * Licensed under MIT.
 * Copyright (c) 2013 David Smith <https://github.com/codeactual/>
 */

/*jshint node:true*/
'use strict';

module.exports = {
  OuterShelljs: OuterShelljs,
  require: require // Allow tests to use component-land require.
};

var emitter = require('emitter');

function OuterShelljs(shelljs) {
  this.shelljs = shelljs;
}

emitter(OuterShelljs.prototype);

/**
 * Recursively find all files that match the given regex.
 *
 * @param {string} parent Root dir of search scope.
 * @param {object} filter RegExp instance.
 * @return {array} Matching shelljs.find() results.
 */
OuterShelljs.prototype.findByRegex = function(parent, filter) {
  return this._('find', parent).filter(function(file) {
    return file.match(filter);
  });
};

/**
 * Invoke a native shelljs method.
 *
 * @param {string} method
 * @param {mixed} arg* All other arguments are passed to 'method'.
 */
OuterShelljs.prototype._ = function(method) {
  var args = [].slice.call(arguments, 1);
  var res = this.shelljs[method].apply(this.shelljs, args);

  var eventArgs = ['cmd', method, args, res];
  this.emit.apply(this, eventArgs);

  eventArgs = ['cmd:' + method, args, res];
  this.emit.apply(this, eventArgs);
  return res;
};
