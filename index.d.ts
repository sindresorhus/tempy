import {MergeExclusive} from 'type-fest';

declare namespace tempy {
	type Options = MergeExclusive<
		{
			/**
			_You usually won't need this option. Specify it only when actually needed._

			File extension. Mutually exclusive with the `name` option.
			*/
			readonly extension?: string;
		},
		{
			/**
			_You usually won't need this option. Specify it only when actually needed._

			Filename. Mutually exclusive with the `extension` option.
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
	job(task: (directory: string) => unknown): unknown;

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
		console.log(await tempy.jobAsync(async directory => {
			await download('http://unicorn.com/foo.jpg', directory, {filename: 'unicorn.jpg'});
			await wallpaper.set(path.join(directory, 'unicorn.jpg'));
			return 'done!';
		}));
		//=> 'done!'
	})();
	```
	*/
	jobAsync(task: (directory: string) => unknown): Promise<unknown>;

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

	@example
	```
	import tempy = require('tempy');

	tempy.root;
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T'
	```
	*/
	readonly root: string;
};

export = tempy;
