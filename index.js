'use strict';
const fs = require('fs');
const path = require('path');
const uniqueString = require('unique-string');
const tempDir = require('temp-dir');
const isStream = require('is-stream');
const pify = require('pify');
const writeFile = pify(fs.writeFile);

const getPath = () => path.join(tempDir, uniqueString());

const writeStream = async (filePath, fileContent) => new Promise((resolve, reject) => {
	const writable = fs.createWriteStream(filePath);

	fileContent
		.on('error', error => {
			reject(error);
			fileContent.unpipe(writable);
			writable.end();
		})
		.pipe(writable)
		.on('error', reject)
		.on('finish', resolve);
});

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

module.exports.write = async (fileContent, options) => {
	const filename = module.exports.file(options);

	const write = isStream(fileContent) ? writeStream : writeFile;

	await write(filename, fileContent);

	return filename;
};

module.exports.writeSync = (fileContent, options) => {
	const filename = module.exports.file(options);

	fs.writeFileSync(filename, fileContent);

	return filename;
};

Object.defineProperty(module.exports, 'root', {
	get() {
		return tempDir;
	}
});
