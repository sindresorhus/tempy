'use strict';
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const uniqueString = require('unique-string');
const tempDir = require('temp-dir');
const isStream = require('is-stream');
const makeDir = require('make-dir');

const getPath = _path => path.join(tempDir, _path || uniqueString());

module.exports.file = (filePath, options) => {
	if (typeof filePath === 'object') {
		options = filePath;
		filePath = undefined;
	}

	options = {
		extension: '',
		...options
	};

	if (options.name) {
		if (options.extension) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		return path.join(module.exports.directory(filePath), options.name);
	}

	if (options.extension) {
		options.extension = '.' + options.extension.replace(/^\./, '');
	}

	if (filePath) {
		const splittedPath = filePath.split('/');
		const fileName = splittedPath.pop();
		return path.join(module.exports.directory(fileName ? path.dirname(filePath) : filePath), (fileName || uniqueString()) + options.extension);
	}

	return getPath().replace(/$\\/, '') + options.extension;
};

module.exports.directory = directoryPath => {
	const directory = getPath(directoryPath);
	makeDir.sync(directory);
	return directory;
};

module.exports.write = async (fileContent, filePath, options) => {
	const writeFileP = promisify(fs.writeFile);

	const writeStream = async (filePath, fileContent) =>
		new Promise((resolve, reject) => {
			const writable = fs.createWriteStream(filePath);

			fileContent
				.on('error', error => {
					// Be careful to reject before writable.end(), otherwise the writable's
					// 'finish' event will fire first and we will resolve the promise
					// before we reject it.
					reject(error);
					fileContent.unpipe(writable);
					writable.end();
				})
				.pipe(writable)
				.on('error', reject)
				.on('finish', resolve);
		});

	const tempFile = module.exports.file(filePath, options);
	const write = isStream(fileContent) ? writeStream : writeFileP;

	await write(tempFile, fileContent);

	return tempFile;
};

module.exports.writeSync = (fileContent, filePath, options) => {
	const tempFile = module.exports.file(filePath, options);
	fs.writeFileSync(tempFile, fileContent);
	return tempFile;
};

Object.defineProperty(module.exports, 'root', {
	get() {
		return tempDir;
	}
});
