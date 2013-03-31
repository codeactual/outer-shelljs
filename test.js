var sinon = require('sinon');
var chai = require('chai');
var shelljs = require('shelljs');
var fs = require('fs');

var should = chai.should();
chai.Assertion.includeStack = true;
chai.use(require('sinon-chai'));

var outerShelljs = require('./dist/outer-shelljs');
var OuterShelljs = outerShelljs.OuterShelljs;
var requireComponent = outerShelljs.require;

requireComponent('sinon-doublist')(sinon, 'mocha');
requireComponent('sinon-doublist-fs')(fs, 'mocha');

describe('OuterShelljs', function() {
  beforeEach(function() {
    this.os = new OuterShelljs(shelljs);
  });

  describe('#findByRe()', function() {
    it('should do filter by regex', function() {
      this.stubFile('/root').readdir([
        this.stubFile('/root/a').readdir([
          this.stubFile('/root/a/1.js'),
          this.stubFile('/root/a/2.css'),
          this.stubFile('/root/a/3.js')
        ]),
        this.stubFile('/root/b.js'),
        this.stubFile('/root/c.png'),
        this.stubFile('/root/d.js')
      ]).make();
      this.os.findByRe('/root', /\.js$/).should.deep.equal([
        '/root/a/1.js',
        '/root/a/3.js',
        '/root/b.js',
        '/root/d.js'
      ]);
    });
  });

  describe('#_()', function() {
    it('should return result', function() {
      console.log('\x1B[33m<---------- INCOMPLETE');
    });

    it('should emit event all-command event', function() {
      console.log('\x1B[33m<---------- INCOMPLETE');
    });

    it('should emit event specific-command event', function() {
      console.log('\x1B[33m<---------- INCOMPLETE');
    });
  });
});
