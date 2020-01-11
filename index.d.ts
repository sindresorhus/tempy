import {MergeExclusive} from 'type-fest';
import { exists } from 'fs';

declare namespace tempy {
	type Options = MergeExclusive<
		{
			/**
			Path of the temprary file. Mutually exclusive with the `extension` or `name` option.
			Mutually exclusive with both `name` and `extension` option.
			*/
			readonly filePath?: string;
		},
		MergeExclusive<
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
		>
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

	tempy.file({filePath: 'fol/ders/unicorn.png'});
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/f7f62bfd4e2a05f1589947647ed3f9ec/fol/dersunicorn.png'
	```
	*/
	file(options?: tempy.Options): string;

	/**
	Get a temporary directory path. The directory is created for you.

	@param directoryPath - Path of the temporary directory.
	@param options - Options for the temporary directory
	@example
	```
	import tempy = require('tempy');

	tempy.directory();
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'
	```
	*/
	directory(directoryPath?: string, options?: {makeCwd: boolean}): string;

	/**
	Write string/buffer/stream to a random temp file.

	@param fileContent - Data to write to the temp file.
	@param options - Options to be passed to tempy.file().
	@returns The file path of the temp file.

	@example
	```
	import tempy = require('tempy');

	let tempPath = await tempy.write('unicorn');
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'

	fs.readFileSync(tempPath).toString();
	//=> 'unicorn'
	```
	*/
	write(fileContent: string | Buffer | NodeJS.ReadableStream, options?: tempy.Options): Promise<string>;

	/**
	Synchronously write string/buffer/stream to a random temp file.
	
	@param fileContent - Data to write to the temp file.
	@param options - Options to be passed to tempy.file().
	@returns The file path of the temp file.
	@example
	```
	import tempy = require('tempy');

	tempy.writeSync('unicorn', {filePath: 'rainbow/cake/pony'});
	//=> '/var/folders/_1/tk89k8215ts0rg0kmb096nj80000gn/T/4049f192-43e7-43b2-98d9-094e6760861b/rainbow/cake/pony'
	```
	*/
	writeSync(fileContent: string | Buffer | NodeJS.ReadableStream, options?: tempy.Options): string

	
	/**
	Check whether a path exists inside the root temporary directory.
	
	@param tempPath - Path whose existence is to be checked for.
	@returns `true` or `false` based on the existence of the temporary path.
	@example
	```
	import tempy = require('tempy');

	tempy.exists('unicorn/and/pegasus');
	//=> false
	```
	*/
	exists(tempPath: string): boolean

	/**
	Get the root temporary directory path. For example: `/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T`.
	*/
	readonly root: string;
};

export = tempy;
