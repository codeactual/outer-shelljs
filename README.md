# outer-shelljs

ShellJS wrapper

* `findByRegex()`
* `grep()` that accepts any `grep` variant option
* `_(method, ...)` proxy that emits `cmd` and `cmd:<method>` events.

[![Build Status](https://travis-ci.org/codeactual/outer-shelljs.png)](https://travis-ci.org/codeactual/outer-shelljs)

## Example

```js
var shelljs = OuterShelljs.create();
var exists = shelljs._('test', '-e', '/path/to/file');
var files = shelljs.findByRegex('/path/to/dir', /\.js$/);
```

## Installation

### [NPM](https://npmjs.org/package/outer-shelljs)

    npm install outer-shelljs

## API Documentation

[OuterShelljs](docs/OuterShelljs.md)

## License

  MIT

## Tests

    npm test
