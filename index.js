'use strict';
const fs = require('fs');
const path = require('path');
const uniqueString = require('unique-string');
const tempDir = require('temp-dir');

const getPath = () => path.join(tempDir, uniqueString());

module.exports.file = options => {
	options = {
		...options
	};

	if (options.name) {
		if (options.extension !== undefined && options.extension !== null) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		return path.join(module.exports.directory(), options.name);
	}

	return getPath() + (options.extension === undefined || options.extension === null ? '' : '.' + options.extension.replace(/^\./, ''));
};

module.exports.directory = () => {
	const directory = getPath();
	fs.mkdirSync(directory);
	return directory;
};

Object.defineProperty(module.exports, 'root', {
	get() {
		return tempDir;
	}
});
