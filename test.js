import {Buffer} from 'node:buffer';
import path from 'node:path';
import fs from 'node:fs';
import stream from 'node:stream';
import tempDir from 'temp-dir';
import {pathExists} from 'path-exists';
import touch from 'touch';
import test from 'ava';
import {tempyFile, tempyFileTask, tempyDirectory, tempyDirectoryTask, tempyWrite, tempyWriteTask, tempyWriteSync, tempyRoot} from './index.js';

test('.file()', t => {
	t.true(tempyFile().includes(tempDir));
	t.false(tempyFile().endsWith('.'));
	t.false(tempyFile({extension: undefined}).endsWith('.'));
	t.false(tempyFile({extension: null}).endsWith('.'));
	t.true(tempyFile({extension: 'png'}).endsWith('.png'));
	t.true(tempyFile({extension: '.png'}).endsWith('.png'));
	t.false(tempyFile({extension: '.png'}).endsWith('..png'));
	t.true(tempyFile({name: 'custom-name.md'}).endsWith('custom-name.md'));

	t.throws(() => {
		tempyFile({name: 'custom-name.md', extension: '.ext'});
	});

	t.throws(() => {
		tempyFile({name: 'custom-name.md', extension: ''});
	});

	t.notThrows(() => {
		tempyFile({name: 'custom-name.md', extension: undefined});
	});

	t.notThrows(() => {
		tempyFile({name: 'custom-name.md', extension: null});
	});
});

test('.file.task()', async t => {
	let temporaryFilePath;
	t.is(await tempyFileTask(async temporaryFile => {
		await touch(temporaryFile);
		temporaryFilePath = temporaryFile;
		return temporaryFile;
	}), temporaryFilePath);
	t.false(await pathExists(temporaryFilePath));
});

test('.task() - cleans up even if callback throws', async t => {
	let temporaryDirectoryPath;
	await t.throwsAsync(tempyDirectoryTask(async temporaryDirectory => {
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

	t.true(tempyDirectory().includes(tempDir));
	t.true(path.basename(tempyDirectory({prefix})).startsWith(prefix));
});

test('.directory.task()', async t => {
	let temporaryDirectoryPath;
	t.is(await tempyDirectoryTask(async temporaryDirectory => {
		temporaryDirectoryPath = temporaryDirectory;
		return temporaryDirectory;
	}), temporaryDirectoryPath);
	t.false(await pathExists(temporaryDirectoryPath));
});

test('.write(string)', async t => {
	const filePath = await tempyWrite('unicorn', {name: 'test.png'});
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
	t.is(path.basename(filePath), 'test.png');
});

test('.write.task(string)', async t => {
	let temporaryFilePath;
	t.is(await tempyWriteTask('', async temporaryFile => {
		temporaryFilePath = temporaryFile;
		return temporaryFile;
	}), temporaryFilePath);
	t.false(await pathExists(temporaryFilePath));
});

test('.write(buffer)', async t => {
	const filePath = await tempyWrite(Buffer.from('unicorn'));
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
});

test('.write(stream)', async t => {
	const readable = new stream.Readable({
		read() {},
	});
	readable.push('unicorn');
	readable.push(null); // eslint-disable-line unicorn/no-array-push-push

	const filePath = await tempyWrite(readable);
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

	await t.throwsAsync(tempyWrite(readable), {
		instanceOf: Error,
		message: 'Catch me if you can!',
	});
});

test('.writeSync()', t => {
	t.is(fs.readFileSync(tempyWriteSync('unicorn'), 'utf8'), 'unicorn');
});

test('.root', t => {
	t.true(tempyRoot.length > 0);
	t.true(path.isAbsolute(tempyRoot));
});
