'use strict';
const fs = require('fs');
const path = require('path');
const uniqueString = require('unique-string');
const tempDir = require('temp-dir');

const getPath = prefix => path.join(tempDir, (prefix || '') + uniqueString());

module.exports.file = options => {
	options = {
		extension: '',
		...options
	};

	if (options.name) {
		if (options.extension) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		return path.join(module.exports.directory(), options.name);
	}

	return getPath() + '.' + options.extension.replace(/^\./, '');
};

module.exports.directory = ({prefix = ''} = {}) => {
	const directory = getPath(prefix);
	fs.mkdirSync(directory);
	return directory;
};

Object.defineProperty(module.exports, 'root', {
	get() {
		return tempDir;
	}
});
