# outer-shelljs

ShellJS extensions

* `findByRegex()`
* `_(method, ...)` proxy that emits `cmd` and `cmd:<method>` events.

[![Build Status](https://travis-ci.org/codeactual/outer-shelljs.png)](https://travis-ci.org/codeactual/outer-shelljs)

## Example

```js
var shelljs = OuterShelljs.create(require('shelljs'));
var exists = shelljs._('test', '-e', '/path/to/file');
var files = shelljs.findByRegex('/path/to/dir', /\.js$/);
```

## Installation

### [NPM](https://npmjs.org/package/outer-shelljs)

    npm install outer-shelljs

### API [component](https://github.com/component/component) only

    $ component install codeactual/outer-shelljs

## API

### #findByRegex(parent, regex)

> Recursively find all files that match the given regex.

### #_(method, ...)

> Invoke a native shelljs method.

Emitted events:

* `cmd`: On all commands.
 * Callback receives: `(method, argArray, returnVal)`
* `cmd:method`: On `method` command.
 * Callback receives: `(argArray, returnVal)`

## License

  MIT

## Tests

    npm test
