# tempy [![Build Status](https://travis-ci.org/sindresorhus/tempy.svg?branch=master)](https://travis-ci.org/sindresorhus/tempy)

> Get a random temporary file or directory path


## Install

```
$ npm install tempy
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

##### filePath

Type: `string`

Path of the temporary file.

Use it when you need the temporary file to have a specific path and name inside the root temporary directory.
For instance when you want to copy a directory to temporary directory maintaining the exact structure.

Mutually exclusive with both `name` and `extension` option.

##### extension

Type: `string`

File extension.

##### name

Type: `string`

Filename. Mutually exclusive with the `extension` option.

### tempy.directory([directoryPath])

Get a temporary directory path. The directory is created for you.

#### directoryPath

Type: `String`

Path of the temporary directory.

### tempy.write(fileContent[[, options]](#options))

Write string/buffer/stream to a random temp file.

#### fileContent

Contents of the temporary file.

### tempy.writeSync(fileContent[[, options]](#options))

Same as tempy.write but synchronous.

### tempy.root

Get the root temporary directory path. For example: `/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T`


## FAQ

### Why doesn't it have a cleanup method?

Temp files will be periodically cleaned up on macOS. Most Linux distros will clean up on reboot. If you're generating a lot of temp files, it's recommended to use a complementary module like [`rimraf`](https://github.com/isaacs/rimraf) for cleanup.


## Related

- [temp-write](https://github.com/sindresorhus/temp-write) - Write string/buffer/stream to a random temp file


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
