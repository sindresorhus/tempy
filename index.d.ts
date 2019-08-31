import {MergeExclusive, Merge} from 'type-fest';
import {Options as DelOptions} from 'del';

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
	type ContextOptions = Merge<
		/**
		ContextOptions
		*/ 
	  {
			/**
				keep temp directory after leaving context
				@default false
		  */ 
			keepDir?: boolean;
		},
	  {
			/**
			 * context call will pass `delOptions` opts key to del package when called
			 * like this: 
			 * "tempy.context({ delOptions: { force: false, dryrun: true ... } }, directory => { ... })
			 * @default "{ force: true }"
			 * default will force del to delete tempy context unless you pass different opts to it
			 */
			readonly delOptions?: DelOptions;
		}
	>
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

	tempy.directory();
	//=> '/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T/2f3d094aec2cb1b93bb0f4cffce5ebd6'
	```
	*/
	file(options?: tempy.Options): string;

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
	 * 
	 * @param options
	 * @returns tempy context dirname 
	 */

	contextSync(options?: tempy.ContextOptions): string;
	/**
	 * 
	 * @param options 
	 * @param callback
	 */

	contextSync(options?: tempy.ContextOptions, callback?: Function): void;
	/**
	 * 
	 * @param callback 
	 */

	contextSync(callback?: Function): void;


	/**
	 * 
	 * @param options
	 * @see tempy.ContextOptions
	 * @returns a temp dir location and a function to call when you need to clean it up
	 */

	context(options?: tempy.ContextOptions): Promise<[string, Function]>;
	/**
	 * 
	 * @param options 
	 * @returns a temp dir location and a function to call when you need to clean it up
	 */

	context(): Promise<[string, Function]>;

  /**
	Get the root temporary directory path. For example: `/private/var/folders/3x/jf5977fn79jbglr7rk0tq4d00000gn/T`.
	*/
	readonly root: string;
};

export = tempy;
