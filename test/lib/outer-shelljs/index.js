var sinon = require('sinon');
var chai = require('chai');
var shelljs = require('shelljs');
var fs = require('fs');

var should = chai.should();
chai.Assertion.includeStack = true;
chai.use(require('sinon-chai'));

var outerShelljs = require('../../..');

require('sinon-doublist')(sinon, 'mocha');
var sinonDoublistFs = require('sinon-doublist-fs');

describe('OuterShelljs', function() {
  beforeEach(function() {
    this.os = outerShelljs.create();
    sinonDoublistFs(this);

    this.rootDir = '/root';
    this.stubFile(this.rootDir).readdir([
      this.stubFile(this.rootDir + '/a').readdir([
        this.stubFile(this.rootDir + '/a/1.js'),
        this.stubFile(this.rootDir + '/a/2.css'),
        this.stubFile(this.rootDir + '/a/3.js')
      ]),
      this.stubFile(this.rootDir + '/b.js'),
      this.stubFile(this.rootDir + '/c.png'),
      this.stubFile(this.rootDir + '/d.js')
    ]).make();

    this.jsRe = /\.js$/;
    this.jsFiles = [
      this.rootDir + '/a/1.js',
      this.rootDir + '/a/3.js',
      this.rootDir + '/b.js',
      this.rootDir + '/d.js'
    ];

    this.silent = {silent: true};
  });

  afterEach(function() {
    this.sandbox.restore();
  });

  describe('#findByRegex()', function() {
    it('should do filter by regex', function() {
      this.os.findByRegex(this.rootDir, this.jsRe).should.deep.equal(this.jsFiles);
    });
  });

  describe('#grep()', function() {
    beforeEach(function() {
      this.textPat = 'needle';
      this.filePat = '/path/to/haystack';
      this.defFlagsFinal = '-l';
      this.optFlags = '-r';
      this.optFlagsFinal = '-rl';
      this.optVariant = 'egrep';
      this.defVariant = 'grep';
      this.optVariant = 'egrep';

      this.matches = ['foo', 'bar'];
      this.res = {code: 0, output: this.matches.join('\n')};
      this.execStub = this.stub(shelljs, 'exec');
      this.execStub.returns(this.res);
    });

    it('should use default args', function() {
      this.os.grep(this.textPat, this.filePat);
      this.execStub.should.have.been.calledWithExactly(
        [this.defVariant, this.defFlagsFinal, this.textPat, this.filePat].join(' '),
        this.silent
      );
    });

    it('should detect custom flag', function() {
      this.os.grep(this.optFlags, this.textPat, this.filePat);
      this.execStub.should.have.been.calledWithExactly(
        [this.defVariant, this.optFlagsFinal, this.textPat, this.filePat].join(' '),
        this.silent
      );
    });

    it('should detect custom variant', function() {
      this.os.grep(this.textPat, this.filePat, this.optVariant);
      this.execStub.should.have.been.calledWithExactly(
        [this.optVariant, this.defFlagsFinal, this.textPat, this.filePat].join(' '),
        this.silent
      );
    });

    it('should detect custom flag and variant', function() {
      this.os.grep(this.optFlags, this.textPat, this.filePat, this.optVariant);
      this.execStub.should.have.been.calledWithExactly(
        [this.optVariant, this.optFlagsFinal, this.textPat, this.filePat].join(' '),
        this.silent
      );
    });

    it('should detect variant zero exit code', function() {
      this.os.grep(this.textPat, this.filePat).should.deep.equal(this.matches);
    });

    it('should detect variant non-zero exit code', function() {
      this.res.code = 1;
      this.os.grep(this.textPat, this.filePat).should.deep.equal(this.res);
    });

    it('should detect variant empty output', function() {
      this.res.output = '';
      this.os.grep(this.textPat, this.filePat).should.deep.equal([]);
    });
  });

  describe('#_()', function() {
    beforeEach(function() {
      this.allCmdCb = this.spy();
      this.findCmdCb = this.spy();
      this.testCmdCb = this.spy();

      this.os = outerShelljs.create();
      this.os.on('cmd', this.allCmdCb);
      this.os.on('cmd:find', this.findCmdCb);
      this.os.on('cmd:test', this.testCmdCb);

      this.file = this.rootDir + '/a/1.js';
    });

    function testFileExists() {
      this.os._('test', '-e', this.file);
    }

    it('should return result', function() {
      var payload = {res: 1, output: 'world ended'};
      this.stub(shelljs, 'exec').returns(payload);
      this.os._('exec').should.deep.equal(payload);
    });

    it('should pass-through all args to native method', function() {
      var execStub = this.stub(shelljs, 'exec');
      this.os._('exec', 1, 2, 3, 4);
      execStub.should.have.been.calledWithExactly(1, 2, 3, 4);
    });

    it('should emit event all-command event', function() {
      testFileExists.call(this);
      this.allCmdCb.should.have.been.calledWithExactly('test', ['-e', this.file], true);
    });

    it('should emit event specific-command event', function() {
      testFileExists.call(this);
      this.testCmdCb.should.have.been.called;
      this.findCmdCb.should.not.have.been.called;
    });
  });
});
