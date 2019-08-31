'use strict';
const fs = require('fs');
const path = require('path');
const uniqueString = require('unique-string');
const tempDir = require('temp-dir');
const del = require('del');
const once = require('once');

const getPath = () => path.join(tempDir, uniqueString());

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

module.exports.directory = () => {
	const directory = getPath();
	fs.mkdirSync(directory);
	return directory;
};

module.exports.contextSync = (opts, callback) => {
	const defaultDelOpts = {force: true};
	let _cb = callback;
	let _opts = opts;

	if (typeof opts === 'function') {
		_cb = opts;
		_opts = {keepDir: false, delOpts: defaultDelOpts};
	}

	const directory = module.exports.directory();
	if (!_cb) {
		return directory;
	}

	_cb(directory);

	if (_opts.keepDir !== true) {
		del.sync(directory, _opts.delOpts || defaultDelOpts);
	}
};

module.exports.context = async (opts = {keepDir: false, delOpts: {force: true}}) => {
	const directory = module.exports.directory();
	return [directory, once(done)];

	function done() {
		if (opts.keepDir !== true) {
			return del(directory, opts.delOpts || {force: true});
		}

		return Promise.resolve([]);
	}
};

Object.defineProperty(module.exports, 'root', {
	get() {
		return tempDir;
	}
});
