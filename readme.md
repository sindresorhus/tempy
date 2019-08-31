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

##### extension

Type: `string`

File extension.

##### name

Type: `string`

Filename. Mutually exclusive with the `extension` option.

### tempy.directory()

Get a temporary directory path. The directory is created for you.

### tempy.root

Get the root temporary directory path. For example: `/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T`

### tempy.contextSync(cb)

Get the sync context

```js
tempy.contextSync((directoryPath) => {
  // do something with temp directory
})
// directory is then deleted here
```

you can also preserve the dir after the context by explicitly setting `keepDir` to `true`:
```js
const directory = tempy.contextSync({ keepDir: true })
// it's basically equivalent to // tempy.directory()

// or 

tempy.contextSync({ keepDir: true }, directory => {
  // directory is preserved here
})
// AND also here

```

Context: Promise version

```js
let myDir
let onDone

tempy.context()
  .then(([tempDirectory, done]) => {
    // assign to local vars, we need it for later
    myDir = tempDirectory
    onDone = done
  })
  .then(() => {
    // a long task using myDir...
  })
  .then(() => {
    // another long task using myDir...
  })
  .then(() => {
    // call done when you are done with it!
    onDone()
  })
  .then(() => {
    // myDir is deleted now
  })
```

Context: Using async/await api

```js

const [tempDir, cleanUp] = await tempy.context()
// do something with tempDir here
await cleanUp()
// call cleanUp and tempDir is gone forever

```


Note: deletion is made with [del](https://github.com/sindresorhus/del)


## Related

- [temp-write](https://github.com/sindresorhus/temp-write) - Write string/buffer/stream to a random temp file


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
