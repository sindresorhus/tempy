'use strict';
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const uniqueString = require('unique-string');
const tempDir = require('temp-dir');
const isStream = require('is-stream');
const makeDir = require('make-dir');

const getPath = _path => path.join(tempDir, _path || uniqueString());

module.exports.file = options => {
	const {filePath, name, extension} = {...options};

	if (filePath) {
		if (name || extension) {
			throw new Error(`The \`filPath\` and ${options.name ? '`name`' : '`extension`'} options are mutually exclusive`);
		}

		const splittedPath = filePath.split('/');
		const fileName = splittedPath.pop();
		return path.join(module.exports.directory(fileName ? path.dirname(filePath) : filePath), (fileName || uniqueString()));
	}

	if (name) {
		if (extension) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		return path.join(module.exports.directory(filePath), name);
	}

	return getPath().replace(/$\\/, '') + (extension ? '.' + extension.replace(/^\./, '') : '');
};

module.exports.directory = directoryPath => {
	const directory = getPath(directoryPath);
	makeDir.sync(directory);
	return directory;
};

module.exports.write = async (fileContent, options) => {
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

	const tempFile = module.exports.file(options);
	const write = isStream(fileContent) ? writeStream : writeFileP;

	await write(tempFile, fileContent);

	return tempFile;
};

module.exports.writeSync = (fileContent, options) => {
	const tempFile = module.exports.file(options);
	fs.writeFileSync(tempFile, fileContent);
	return tempFile;
};

Object.defineProperty(module.exports, 'root', {
	get() {
		return tempDir;
	}
});
