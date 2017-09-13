# tempy [![Build Status](https://travis-ci.org/sindresorhus/tempy.svg?branch=master)](https://travis-ci.org/sindresorhus/tempy)

> Get a random temporary file or directory path


## Install

```
$ npm install --save tempy
```


## Usage

```js
const tempy = require('tempy');

tempy.file();
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/4f504b9edb5ba0e89451617bf9f971dd'

tempy.file({extension: 'png'});
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/a9fb0decd08179eb6cf4691568aa2018.png'

tempy.file({name: 'unicorn.png'});
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/f7f62bfd4e2a05f1589947647ed3f9ec/unicorn.png'

tempy.directory();
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'
```


## API

### tempy.file([options])

Get a temporary file path you can write to.

#### options

Type: `Object`

*You usually won't need either the `extension` or `name` option. Specify them only when actually needed.*

##### extension

Type: `string`

File extension.

##### name

Type: `string`

Filename. Mutually exclusive with the `extension` option.

### tempy.directory()

Get a temporary directory path. The directory is created for you.

### tempy.directoryAsync()

Get a `Promise` for a temporary directory path.

**You most likely don't need this.** This is only useful if you use it in a highly concurrent server where even the tiniest blocking operation is a problem. For everything else, use `tempy.directory()`, which will be faster in most cases.

### tempy.root

The root temporary directory path. For example: `/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T`


## FAQ

### Why doesn't it have a cleanup method?

The operating system will clean up when needed. No point in us wasting resources and adding complexity.


## Related

- [temp-write](https://github.com/sindresorhus/temp-write) - Write string/buffer/stream to a random temp file


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
