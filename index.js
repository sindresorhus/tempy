'use strict';
const fs = require('fs');
const path = require('path');
const uniqueString = require('unique-string');
const tempDir = require('temp-dir');
const del = require('del');

let cacheDirectories = [];

const getPath = () => {
	const directory = path.join(tempDir, uniqueString());
	fs.mkdirSync(directory);
	cacheDirectories.push(directory);
	return directory;
};

module.exports.file = options => {
	options = {
		extension: '',
		...options
	};

	if (options.name) {
		if (options.extension) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		return path.join(getPath(), options.name);
	}

	return getPath() + '.' + options.extension.replace(/^\./, '');
};

module.exports.directory = getPath;

module.exports.clean = () => {
	const deletedDirectories = del.sync(cacheDirectories.map(directory => directory + '/**'), {force: true});
	cacheDirectories = [];
	return deletedDirectories;
};

module.exports.job = async fn => {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	const directory = getPath();
	const output = await fn(directory);
	await del(directory + '/**', {force: true});
	return output;
};

Object.defineProperty(module.exports, 'root', {
	get() {
		return tempDir;
	}
});

process.on('exit', module.exports.clean);
