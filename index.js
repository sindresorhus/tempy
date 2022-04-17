import fs, {promises as fsPromises} from 'node:fs';
import path from 'node:path';
import stream from 'node:stream';
import {promisify} from 'node:util';
import uniqueString from 'unique-string';
import tempDir from 'temp-dir';
import {isStream} from 'is-stream';

const pipeline = promisify(stream.pipeline); // TODO: Use `node:stream/promises` when targeting Node.js 16.

const getPath = (prefix = '') => path.join(tempDir, prefix + uniqueString());

const writeStream = async (filePath, data) => pipeline(data, fs.createWriteStream(filePath));

async function runTask(temporaryPath, callback) {
	try {
		return await callback(temporaryPath);
	} finally {
		await fsPromises.rm(temporaryPath, {recursive: true, force: true});
	}
}

export function tempyFile({name, extension} = {}) {
	if (name) {
		if (extension !== undefined && extension !== null) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		return path.join(tempyDirectory(), name);
	}

	return getPath() + (extension === undefined || extension === null ? '' : '.' + extension.replace(/^\./, ''));
}

export const tempyFileTask = async (callback, options) => runTask(tempyFile(options), callback);

export function tempyDirectory({prefix = ''} = {}) {
	const directory = getPath(prefix);
	fs.mkdirSync(directory);
	return directory;
}

export const tempyDirectoryTask = async (callback, options) => runTask(tempyDirectory(options), callback);

export async function tempyWrite(fileContent, options) {
	const filename = tempyFile(options);
	const write = isStream(fileContent) ? writeStream : fsPromises.writeFile;
	await write(filename, fileContent);
	return filename;
}

export const tempyWriteTask = async (fileContent, callback, options) => runTask(await tempyWrite(fileContent, options), callback);

export function tempyWriteSync(fileContent, options) {
	const filename = tempyFile(options);
	fs.writeFileSync(filename, fileContent);
	return filename;
}

export {default as tempyRoot} from 'temp-dir';
