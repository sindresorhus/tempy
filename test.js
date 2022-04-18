import {Buffer} from 'node:buffer';
import path from 'node:path';
import fs from 'node:fs';
import stream from 'node:stream';
import tempDir from 'temp-dir';
import {pathExists} from 'path-exists';
import touch from 'touch';
import test from 'ava';
import {
	temporaryFile,
	temporaryFileTask,
	temporaryDirectory,
	temporaryDirectoryTask,
	temporaryWrite,
	temporaryWriteTask,
	temporaryWriteSync,
	rootTemporaryDirectory,
} from './index.js';

test('.file()', t => {
	t.true(temporaryFile().includes(tempDir));
	t.false(temporaryFile().endsWith('.'));
	t.false(temporaryFile({extension: undefined}).endsWith('.'));
	t.false(temporaryFile({extension: null}).endsWith('.'));
	t.true(temporaryFile({extension: 'png'}).endsWith('.png'));
	t.true(temporaryFile({extension: '.png'}).endsWith('.png'));
	t.false(temporaryFile({extension: '.png'}).endsWith('..png'));
	t.true(temporaryFile({name: 'custom-name.md'}).endsWith('custom-name.md'));

	t.throws(() => {
		temporaryFile({name: 'custom-name.md', extension: '.ext'});
	});

	t.throws(() => {
		temporaryFile({name: 'custom-name.md', extension: ''});
	});

	t.notThrows(() => {
		temporaryFile({name: 'custom-name.md', extension: undefined});
	});

	t.notThrows(() => {
		temporaryFile({name: 'custom-name.md', extension: null});
	});
});

test('.file.task()', async t => {
	let temporaryFilePath;
	t.is(await temporaryFileTask(async temporaryFile => {
		await touch(temporaryFile);
		temporaryFilePath = temporaryFile;
		return temporaryFile;
	}), temporaryFilePath);
	t.false(await pathExists(temporaryFilePath));
});

test('.task() - cleans up even if callback throws', async t => {
	let temporaryDirectoryPath;
	await t.throwsAsync(temporaryDirectoryTask(async temporaryDirectory => {
		temporaryDirectoryPath = temporaryDirectory;
		throw new Error('Catch me if you can!');
	}), {
		instanceOf: Error,
		message: 'Catch me if you can!',
	});

	t.false(await pathExists(temporaryDirectoryPath));
});

test('.directory()', t => {
	const prefix = 'name_';

	t.true(temporaryDirectory().includes(tempDir));
	t.true(path.basename(temporaryDirectory({prefix})).startsWith(prefix));
});

test('.directory.task()', async t => {
	let temporaryDirectoryPath;
	t.is(await temporaryDirectoryTask(async temporaryDirectory => {
		temporaryDirectoryPath = temporaryDirectory;
		return temporaryDirectory;
	}), temporaryDirectoryPath);
	t.false(await pathExists(temporaryDirectoryPath));
});

test('.write(string)', async t => {
	const filePath = await temporaryWrite('unicorn', {name: 'test.png'});
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
	t.is(path.basename(filePath), 'test.png');
});

test('.write.task(string)', async t => {
	let temporaryFilePath;
	t.is(await temporaryWriteTask('', async temporaryFile => {
		temporaryFilePath = temporaryFile;
		return temporaryFile;
	}), temporaryFilePath);
	t.false(await pathExists(temporaryFilePath));
});

test('.write(buffer)', async t => {
	const filePath = await temporaryWrite(Buffer.from('unicorn'));
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
});

test('.write(stream)', async t => {
	const readable = new stream.Readable({
		read() {},
	});
	readable.push('unicorn');
	readable.push(null); // eslint-disable-line unicorn/no-array-push-push

	const filePath = await temporaryWrite(readable);
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
});

test('.write(stream) failing stream', async t => {
	const readable = new stream.Readable({
		read() {},
	});

	readable.push('unicorn');

	setImmediate(() => {
		readable.emit('error', new Error('Catch me if you can!'));
		readable.push(null);
	});

	await t.throwsAsync(temporaryWrite(readable), {
		instanceOf: Error,
		message: 'Catch me if you can!',
	});
});

test('.writeSync()', t => {
	t.is(fs.readFileSync(temporaryWriteSync('unicorn'), 'utf8'), 'unicorn');
});

test('.root', t => {
	t.true(rootTemporaryDirectory.length > 0);
	t.true(path.isAbsolute(rootTemporaryDirectory));
});
