'use strict';
const path = require('path');
const uniqueString = require('unique-string');
const tempDir = require('temp-dir');
const del = require('del');
const makeDir = require('make-dir');
const exitHook = require('exit-hook');

let cacheDirectories = [];

const getPath = () => {
	const directory = path.join(tempDir, uniqueString());
	makeDir.sync(directory);
	cacheDirectories.push(directory);
	return directory;
};

const getPathAsync = async () => {
	const directory = path.join(tempDir, uniqueString());
	await makeDir(directory);
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

module.exports.fileAsync = async options => {
	options = {
		extension: '',
		...options
	};

	if (options.name) {
		if (options.extension) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		const directory = await getPathAsync();
		return path.join(directory, options.name);
	}

	const directory = await getPathAsync();
	return directory + '.' + options.extension.replace(/^\./, '');
};

module.exports.directory = getPath;

module.exports.directoryAsync = getPathAsync;

module.exports.clean = () => {
	const deletedDirectories = del.sync(cacheDirectories, {force: true});
	cacheDirectories = [];
	return deletedDirectories;
};

module.exports.cleanAsync = async () => {
	const deletedDirectories = await del(cacheDirectories, {force: true});
	cacheDirectories = [];
	return deletedDirectories;
};

module.exports.job = fn => {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	const directory = getPath();
	const output = fn(directory);
	del.sync(directory, {force: true});
	return output;
};

module.exports.jobAsync = async fn => {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	const directory = getPath();
	const output = await fn(directory);
	await del(directory, {force: true});
	return output;
};

Object.defineProperty(module.exports, 'root', {
	get() {
		return tempDir;
	}
});

module.exports.disableAutoClean = exitHook(module.exports.clean);
