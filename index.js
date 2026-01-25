import fs from 'node:fs';
import fsPromises from 'node:fs/promises';
import path from 'node:path';
import stream from 'node:stream';
import {promisify} from 'node:util';
import uniqueString from 'unique-string';
import tempDir from 'temp-dir';
import {isStream} from 'is-stream';

const pipeline = promisify(stream.pipeline); // TODO: Use `node:stream/promises` when targeting Node.js 16.

// TODO: Use `is-safe-filename` when targeting Node.js 20.
function assertSafePathComponent(pathComponent) {
	if (typeof pathComponent !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof pathComponent}`);
	}

	const trimmed = pathComponent.trim();

	const isSafe = trimmed !== ''
		&& trimmed !== '.'
		&& trimmed !== '..'
		&& !pathComponent.includes('/')
		&& !pathComponent.includes('\\')
		&& !pathComponent.includes('\0');

	if (!isSafe) {
		throw new Error(`Unsafe path component: ${JSON.stringify(pathComponent)}`);
	}
}

const getPath = (prefix = '') => {
	if (prefix) {
		assertSafePathComponent(prefix);
	}

	return path.join(tempDir, prefix + uniqueString());
};

const writeStream = async (filePath, data) => pipeline(data, fs.createWriteStream(filePath));

async function runTask(temporaryPath, callback) {
	try {
		return await callback(temporaryPath);
	} finally {
		await fsPromises.rm(temporaryPath, {recursive: true, force: true, maxRetries: 2});
	}
}

export function temporaryFile({name, extension} = {}) {
	if (name !== undefined && name !== null) {
		if (extension !== undefined && extension !== null) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		assertSafePathComponent(name);

		return path.join(temporaryDirectory(), name);
	}

	if (extension !== undefined && extension !== null) {
		assertSafePathComponent(extension);
	}

	return getPath() + (extension === undefined || extension === null ? '' : '.' + extension.replace(/^\./, ''));
}

export const temporaryFileTask = async (callback, options) => runTask(temporaryFile(options), callback);

export function temporaryDirectory({prefix = ''} = {}) {
	const directory = getPath(prefix);
	fs.mkdirSync(directory);
	return directory;
}

export const temporaryDirectoryTask = async (callback, options) => runTask(temporaryDirectory(options), callback);

export async function temporaryWrite(fileContent, options) {
	const filename = temporaryFile(options);
	const write = isStream(fileContent) ? writeStream : fsPromises.writeFile;
	await write(filename, fileContent);
	return filename;
}

export const temporaryWriteTask = async (fileContent, callback, options) => runTask(await temporaryWrite(fileContent, options), callback);

export function temporaryWriteSync(fileContent, options) {
	const filename = temporaryFile(options);
	fs.writeFileSync(filename, fileContent);
	return filename;
}

export {default as rootTemporaryDirectory} from 'temp-dir';
