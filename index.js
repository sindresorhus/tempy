'use strict';
const fs = require('fs');
const path = require('path');
const stream = require('stream');
const {promisify} = require('util');
const uniqueString = require('unique-string');
const tempDir = require('temp-dir');
const del = require('del');
const makeDir = require('make-dir');
const exitHook = require('exit-hook');
const isStream = require('is-stream');

const pipeline = promisify(stream.pipeline);
const {writeFile} = fs.promises;

const cacheDirectories = [];

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

const removeCacheDirectories = directoryToRemove => {
	directoryToRemove.forEach(directory => {
		const index = cacheDirectories.indexOf(directory);
		if (index > -1) {
			cacheDirectories.splice(index, 1);
		}
	});
};

const writeStream = async (filePath, data) => pipeline(data, fs.createWriteStream(filePath));

const getFile = (directory, options) => {
	options = {
		...options
	};

	if (options.name) {
		if (options.extension !== undefined && options.extension !== null) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		return path.join(directory, options.name);
	}

	return path.join(directory, uniqueString() + (options.extension === undefined || options.extension === null ? '' : '.' + options.extension.replace(/^\./, '')));
};

module.exports.file = options => getFile(getPath(), options);

module.exports.fileAsync = async options => getFile(await getPathAsync(), options);

module.exports.directory = getPath;

module.exports.directoryAsync = getPathAsync;

module.exports.clean = () => {
	const deletedDirectories = del.sync(cacheDirectories, {force: true});
	removeCacheDirectories(deletedDirectories);
	return deletedDirectories;
};

module.exports.cleanAsync = async () => {
	const deletedDirectories = await del(cacheDirectories, {force: true});
	removeCacheDirectories(deletedDirectories);
	return deletedDirectories;
};

module.exports.jobDirectory = fn => {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	const directory = getPath();
	const output = fn(directory);
	del.sync(directory, {force: true});
	return output;
};

module.exports.jobDirectoryAsync = async fn => {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	const directory = await getPathAsync();
	const output = await fn(directory);
	await del(directory, {force: true});
	return output;
};

module.exports.jobFile = (fn, options) => {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	const directory = getPath();
	const file = getFile(directory, options);
	const output = fn(file);
	del.sync(directory, {force: true});
	return output;
};

module.exports.jobFileAsync = async (fn, options) => {
	if (typeof fn !== 'function') {
		throw new TypeError('Expected a function');
	}

	const directory = await getPathAsync();
	const file = getFile(directory, options);
	const output = await fn(file);
	await del(directory, {force: true});
	return output;
};

module.exports.write = async (data, options) => {
	const filename = module.exports.file(options);
	const write = isStream(data) ? writeStream : writeFile;
	await write(filename, data);
	return filename;
};

module.exports.writeSync = (data, options) => {
	const filename = module.exports.file(options);
	fs.writeFileSync(filename, data);
	return filename;
};

Object.defineProperty(module.exports, 'root', {
	get() {
		return tempDir;
	}
});

module.exports.disableAutoClean = exitHook(module.exports.clean);
