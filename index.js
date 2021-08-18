import fs, {promises as fsPromises} from 'node:fs';
import path from 'node:path';
import stream from 'node:stream';
import {promisify} from 'node:util';
import uniqueString from 'unique-string';
import tempDir from 'temp-dir';
import {isStream} from 'is-stream';
import del from 'del'; // TODO: Replace this with `fs.rm` when targeting Node.js 14.

const pipeline = promisify(stream.pipeline); // TODO: Use `node:stream/promises` when targeting Node.js 16.

const getPath = (prefix = '') => path.join(tempDir, prefix + uniqueString());

const writeStream = async (filePath, data) => pipeline(data, fs.createWriteStream(filePath));

const createTask = (tempyFunction, {extraArguments = 0} = {}) => async (...arguments_) => {
	const [callback, options] = arguments_.slice(extraArguments);
	const result = await tempyFunction(...arguments_.slice(0, extraArguments), options);

	try {
		return await callback(result);
	} finally {
		await del(result, {force: true});
	}
};

const tempy = {};

tempy.file = options => {
	options = {
		...options,
	};

	if (options.name) {
		if (options.extension !== undefined && options.extension !== null) {
			throw new Error('The `name` and `extension` options are mutually exclusive');
		}

		return path.join(tempy.directory(), options.name);
	}

	return getPath() + (options.extension === undefined || options.extension === null ? '' : '.' + options.extension.replace(/^\./, ''));
};

tempy.file.task = createTask(tempy.file);

tempy.directory = ({prefix = ''} = {}) => {
	const directory = getPath(prefix);
	fs.mkdirSync(directory);
	return directory;
};

tempy.directory.task = createTask(tempy.directory);

tempy.write = async (data, options) => {
	const filename = tempy.file(options);
	const write = isStream(data) ? writeStream : fsPromises.writeFile;
	await write(filename, data);
	return filename;
};

tempy.write.task = createTask(tempy.write, {extraArguments: 1});

tempy.writeSync = (data, options) => {
	const filename = tempy.file(options);
	fs.writeFileSync(filename, data);
	return filename;
};

Object.defineProperty(tempy, 'root', {
	get() {
		return tempDir;
	},
});

export default tempy;
