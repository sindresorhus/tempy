# tempy [![Build Status](https://travis-ci.org/sindresorhus/tempy.svg?branch=master)](https://travis-ci.org/sindresorhus/tempy)

> Get a random temporary file or directory path


## Install

```
$ npm install tempy
```


## Usage

```js
const tempy = require('tempy');
const download = require('download');
const wallpaper = require('wallpaper');
const pathExists = require('path-exists');

tempy.file();
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/4f504b9edb5ba0e89451617bf9f971dd'

tempy.file({extension: 'png'});
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/a9fb0decd08179eb6cf4691568aa2018.png'

tempy.file({name: 'unicorn.png'});
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/f7f62bfd4e2a05f1589947647ed3f9ec/unicorn.png'

tempy.directory();
//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'

tempy.clean();
//=> ['/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/4f504b9edb5ba0e89451617bf9f971dd', ...]

(async () => {
	console.log(await tempy.job(directory => pathExists(directory)));
	//=> true

	console.log(await tempy.jobDirectoryAsync(async directory => {
		await download('http://unicorn.com/foo.jpg', directory, {filename: 'unicorn.jpg'});
		await wallpaper.set(path.join(directory, 'unicorn.jpg'));
		return 'done!';
	}));
	//=> 'done!'
})();
```

**Note:** Cleaning of temporary directories runs automatically when the process exits.

## API

### tempy.file([options])

Get a temporary file path you can write to.

### tempy.fileAsync([options])

Returns a `Promise` with a temporary file path you can write to.

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

Returns a `Promise` with a temporary directory path. The directory is created for you.

### tempy.clean()

Get a list of deleted temporary directories and clears them. This is useful for when auto cleanup is disabled or when there are lots of temp files.

### tempy.cleanAsync()

Returns a `Promise` with a list of deleted temporary directories and clears them. This is useful for when auto cleanup is disabled or when there are lots of temp files.

### tempy.jobFile(task, [options])

Returns the value obtained in `task`.

### tempy.jobFileAsync(task, [options])

Returns a `Promise` for value obtained in `task`.

#### task

Type: `Function`

A function that will be called with a temporary file path. The file is created and deleted when `Function` is finished.

#### options

Type: `Object`

*You usually won't need either the `extension` or `name` option. Specify them only when actually needed.*

##### extension

Type: `string`

File extension.

##### name

Type: `string`

Filename. Mutually exclusive with the `extension` option.

### tempy.jobDirectory(task)

Returns the value obtained in `task`.

### tempy.jobDirectoryAsync(task)

Returns a `Promise` for value obtained in `task`.

#### task

Type: `Function`

A function that will be called with a temporary directory path. The directory is created and deleted when `Function` is finished.

### tempy.disableAutoClean()

Disable auto cleaning directories

### tempy.root

Get the root temporary directory path. For example: `/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T`

## FAQ

### Why doesn't it have a cleanup method?

Temp files will be periodically cleaned up on macOS. Most Linux distros will clean up on reboot. If you're generating a lot of temp files, it's recommended to use a complementary module like [`rimraf`](https://github.com/isaacs/rimraf) for cleanup.


## Related

- [temp-write](https://github.com/sindresorhus/temp-write) - Write string/buffer/stream to a random temp file


## License

MIT © [Sindre Sorhus](https://sindresorhus.com)
