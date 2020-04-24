/// <reference types="node"/>
import {MergeExclusive, TypedArray} from 'type-fest';

declare namespace tempy {
	type Options = MergeExclusive<
		{
			/**
			File extension.
			Mutually exclusive with the `name` option.
			_You usually won't need this option. Specify it only when actually needed._
			*/
			readonly extension?: string;
		},
		{
			/**
			Filename.
			Mutually exclusive with the `extension` option.
			_You usually won't need this option. Specify it only when actually needed._
			*/
			readonly name?: string;
		}
	>;
}

declare const tempy: {
	/**
	Get a temporary file path you can write to.

	@example
	```
	import tempy = require('tempy');

	tempy.file();
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/4f504b9edb5ba0e89451617bf9f971dd'

	tempy.file({extension: 'png'});
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/a9fb0decd08179eb6cf4691568aa2018.png'

	tempy.file({name: 'unicorn.png'});
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/f7f62bfd4e2a05f1589947647ed3f9ec/unicorn.png'
	```
	*/
	file(options?: tempy.Options): string;

	/**
	Returns a `Promise` with a temporary file path you can write to.

	@example
	```
	import tempy = require('tempy');

	(async () => {
		await tempy.fileAsync();
		//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/4f504b9edb5ba0e89451617bf9f971dd'

		await tempy.fileAsync({extension: 'png'});
		//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/a9fb0decd08179eb6cf4691568aa2018.png'
		
		await tempy.fileAsync({name: 'unicorn.png'});
		//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/f7f62bfd4e2a05f1589947647ed3f9ec/unicorn.png'
	})();
	```
	*/
	fileAsync(options?: tempy.Options): Promise<string>;

	/**
	Get a temporary directory path. The directory is created for you.
	@example
	```
	import tempy = require('tempy');
	tempy.directory();
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'
	```
	*/
	directory(): string;

	/**
	Returns a `Promise` with a temporary directory path. The directory is created for you.
	@example
	```
	import tempy = require('tempy');
	(async () => {
		await tempy.directoryAsync();
		//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'
	})();
	```
	*/
	directoryAsync(): Promise<string>;

	/**
	Write data to a random temp file.
	@example
	```
	import tempy = require('tempy');
	await tempy.write('🦄');
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'
	```
	*/
	write(fileContent: string | Buffer | TypedArray | DataView | NodeJS.ReadableStream, options?: tempy.Options): Promise<string>;

	/**
	Synchronously write data to a random temp file.
	@example
	```
	import tempy = require('tempy');
	tempy.writeSync('🦄');
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'
	```
	*/
	writeSync(fileContent: string | Buffer | TypedArray | DataView, options?: tempy.Options): string;

	/**
	Get a list of deleted temporary directories and clears them. This is useful for when auto cleanup is disabled or when there are lots of temp files.
	@returns An array of deleted paths.
	@example
	```
	import tempy = require('tempy');
	tempy.clean();
	//=> ['/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/4f504b9edb5ba0e89451617bf9f971dd', ...]
	```
	*/
	clean(): string[];

	/**
	Returns a `Promise` with a list of deleted temporary directories and clears them. This is useful for when auto cleanup is disabled or when there are lots of temp files.
	@returns An array of deleted paths.
	@example
	```
	import tempy = require('tempy');
	(async () => {
		await empy.cleanAsync();
		//=> ['/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/4f504b9edb5ba0e89451617bf9f971dd', ...]
	})();
	```
	*/
	cleanAsync(): Promise<string[]>;

	/**
	Returns the value obtained in `task`.
	@param task - A function that will be called with a temporary directory path. The directory is created and deleted when `Function` is finished.
	@returns Task output
	*/
	jobDirectory(task: (directory: string) => unknown): unknown;

	/**
	Returns a `Promise` for value obtained in `task`.
	@param task - A function that will be called with a temporary directory path. The directory is created and deleted when `Promise` is resolved.
	@returns Task output
	@example
	```
	import  path = require('path');
	import tempy = require('tempy');
	import  download = require('download');
	import  wallpaper = require('wallpaper');
	(async () => {
		console.log(await tempy.jobDirectoryAsync(async directory => {
			await download('http://unicorn.com/foo.jpg', directory, {filename: 'unicorn.jpg'});
			await wallpaper.set(path.join(directory, 'unicorn.jpg'));
			return 'done!';
		}));
		//=> 'done!'
	})();
	```
	*/
	jobDirectoryAsnc(task: (directory: string) => unknown): Promise<unknown>;

	/**
	Returns the value obtained in `task`.
	@param task - A function that will be called with a temporary file path. The file is created and deleted when `Function` is finished.
	@returns Task output
	*/
	jobFile(task: (file: string) => unknown, options?: tempy.Options): unknown;

	/**
	Returns a `Promise` for value obtained in `task`.
	@param task - A function that will be called with a temporary file path. The file is created and deleted when `Promise` is resolved.
	@returns Task output
	*/
	jobFileAsync(task: (direcfiletory: string) => unknown, options?: tempy.Options): Promise<unknown>;

	/**
	Disable auto cleaning directories
	@example
	```
	import tempy = require('tempy');
	tempy.disableAutoClean()
	```
	*/
	disableAutoClean(): void;

	/**
	Get the root temporary directory path.
	For example: `/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T`.
	*/
	readonly root: string;
};

export = tempy;