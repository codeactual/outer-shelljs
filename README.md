# outer-shelljs

ShellJS extensions

* `findByRegex()`
* `_(method, ...)` proxy that emits `cmd` and `cmd:<method>` events.

[![Build Status](https://travis-ci.org/codeactual/outer-shelljs.png)](https://travis-ci.org/codeactual/outer-shelljs)

## Example

```js
var shelljs = new OuterShelljs(require('shelljs'));
var exists = shelljs._('test', '-e', '/path/to/file');
var files = shelljs.findByRegex('/path/to/dir', /\.js$/);
```

## Installation

### [Component](https://github.com/component/component)

Install to `components/`:

    $ component install codeactual/outer-shelljs

Build standalone file in `build/`:

    $ grunt dist

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

    npm install --devDependencies
    npm test

## Change Log

### 0.1.0

* Initial API: `_()`, `findByRegex()`
