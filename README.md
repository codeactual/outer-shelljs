# outer-shelljs

[ShellJS](https://github.com/arturadib/shelljs) wrapper

- `findByRegex()`
- `grep()` that accepts any `grep` variant option
- `_(method, ...)` proxy that emits [events](#events) after each call

[![Build Status](https://travis-ci.org/codeactual/outer-shelljs.png)](https://travis-ci.org/codeactual/outer-shelljs)

## Example

```js
var shelljs = require('outer-shelljs').create();
var exists = shelljs._('test', '-e', '/path/to/file');
var files = shelljs.findByRegex('/path/to/dir', /\.js$/);
```

## Installation

### [NPM](https://npmjs.org/package/outer-shelljs)

    npm install outer-shelljs

## API

[Documentation](docs/OuterShelljs.md)

## Events

### `cmd`

> Fires after any [_()](docs/OuterShelljs.md) call.

```js
shelljs.on('cmd', function(method, argArray, returnVal) {
  console.log(
    'called %s with %s and returned %s',
    method, JSON.stringify(argArray), JSON.stringify(returnVal)
  );
});
```

### `cmd:<method>`

> Fires after a [_()](docs/OuterShelljs.md) call for a specific `ShellJS` method, ex. `exec`.

```js
shelljs.on('cmd:exec', function(argArray, returnVal) {
  console.log(
    '`exec` was called with %s and returned %s',
    JSON.stringify(argArray), JSON.stringify(returnVal)
  );
});
```

## License

  MIT

## Tests

    npm test
