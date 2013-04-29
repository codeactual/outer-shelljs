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
  create: function() { return new OuterShelljs(); },
  mixin: function(ext) { extend(OuterShelljs.prototype, ext); }
};

var shelljs = require('shelljs');

var requireComponent = require('../component/require');
var extend = requireComponent('extend');
var emitter = requireComponent('emitter');

function OuterShelljs() {
}

emitter(OuterShelljs.prototype);

/**
 * Recursively find all files that match the given regex.
 *
 * @param {string} parent Root dir of search scope.
 * @param {object} regex RegExp instance.
 * @return {array} Matching shelljs.find() results.
 */
OuterShelljs.prototype.findByRegex = function(parent, regex) {
  return this._('find', parent).filter(function(file) {
    return file.match(regex);
  });
};

/**
 * `grep()` alternative that allows any wildcards/flags supported by the
 * selected `grep` variant.
 *
 * @param {string} [flags=['-l']]
 * @param {string} textPat
 * @param {string} filePat
 * @param {string} [variant='grep']
 * @return {array|object}
 * - {array} Matching files, if variant exited cleanly.
 * - {object} `output` and `code`, otherwise.
 */
OuterShelljs.prototype.grep = function() {
  var args = [].slice.call(arguments);
  var flags;
  var textPat;
  var filePat;
  var variant = 'grep';

  if (/^-/.test(args[0])) {
    flags = args[0] + 'l';
    textPat = args[1];
    filePat = args[2];
    variant = args[3] || variant;
  } else {
    flags = '-l';
    textPat = args[0];
    filePat = args[1];
    variant = args[2] || variant;
  }

  var res = this._('exec', [variant, flags, textPat, filePat].join(' '));

  if (res.code) { return res;}
  return res.output ? res.output.split('\n') : [];
};

/**
 * Invoke a native shelljs method.
 *
 * @param {string} method
 * @param {mixed} arg* All other arguments are passed to 'method'.
 */
OuterShelljs.prototype._ = function(method) {
  var args = [].slice.call(arguments, 1);
  var res = shelljs[method].apply(shelljs, args);

  var eventArgs = ['cmd', method, args, res];
  this.emit.apply(this, eventArgs);

  eventArgs = ['cmd:' + method, args, res];
  this.emit.apply(this, eventArgs);
  return res;
};
