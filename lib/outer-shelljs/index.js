/**
 * ShellJS extensions
 *
 * Licensed under MIT.
 * Copyright (c) 2013 David Smith <https://github.com/codeactual/>
 */

/*jshint node:true*/
'use strict';

/**
 * Reference to OuterShelljs.
 */
exports.OuterShelljs = OuterShelljs;

/**
 * Create a new OuterShelljs.
 *
 * @return {object}
 */
exports.create = function() { return new OuterShelljs(); };

/**
 * Extend OuterShelljs.prototype.
 *
 * @param {object} ext
 * @return {object} Merge result.
 */
exports.extend = function(ext) { return extend(OuterShelljs.prototype, ext); };

var util = require('util');
var events = require('events');

var requireComponent = require('../component/require');
var extend = requireComponent('extend');

/**
 * OuterShelljs constructor.
 *
 * Properties:
 *
 * - `{object} shelljs` Native ShellJS module
 *
 * Inherits:
 *
 * - `events.EventEmitter`
 */
function OuterShelljs() {
  this.shelljs = require('shelljs');

  events.EventEmitter.call(this);
}

util.inherits(OuterShelljs, events.EventEmitter);

/**
 * `find()` wrapper that filters results by `RegExp`.
 *
 * @param {string} parent Root dir of search scope
 * @param {regexp} regex
 * @return {array} Matching `shelljs.find()` results
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
 * - `{array}` Matching files, if variant exited cleanly
 * - `{object}` with properties `output` and `code`, if variant exited with code > 2
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

  args = [variant, flags].concat(ESC_SHELL(textPat), filePat).join(' ');
  var res = this._('exec', args, {silent: true});

  if (res.code > 1) { return res;} // Ex. no such directory
  return res.output ? res.output.trim().split('\n') : [];

};

/**
 * Invoke a native ShellJS method.
 *
 * @param {string} method
 * @param {mixed} arg* All other arguments are passed to `method`
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

/**
 * Escape shell argument.
 *
 * @param {string} arg
 * @return {string}
 * @author http://stackoverflow.com/users/983714/sylvain-zimmer
 * @api private
 */
function ESC_SHELL(arg) {
  return '"' + arg.replace(/([()"\s$`\\])/g,'\\$1') + '"';
}
