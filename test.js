import path from 'path';
import tempDir from 'temp-dir';
import pathExists from 'path-exists';
import touch from 'touch';
import fs from 'fs';
import stream from 'stream';
import test from 'ava';
import tempy from '.';

test('.file()', t => {
	t.true(tempy.file().includes(tempDir));
	t.false(tempy.file().endsWith('.'));
	t.false(tempy.file({extension: undefined}).endsWith('.'));
	t.false(tempy.file({extension: null}).endsWith('.'));
	t.true(tempy.file({extension: 'png'}).endsWith('.png'));
	t.true(tempy.file({extension: '.png'}).endsWith('.png'));
	t.false(tempy.file({extension: '.png'}).endsWith('..png'));
	t.true(tempy.file({name: 'custom-name.md'}).endsWith('custom-name.md'));

	t.throws(() => {
		tempy.file({name: 'custom-name.md', extension: '.ext'});
	});

	t.throws(() => {
		tempy.file({name: 'custom-name.md', extension: ''});
	});

	t.notThrows(() => {
		tempy.file({name: 'custom-name.md', extension: undefined});
	});

	t.notThrows(() => {
		tempy.file({name: 'custom-name.md', extension: null});
	});
});

test('.file.task()', async t => {
	let temporaryFilePath;
	await tempy.file.task(async temporaryFile => {
		await touch(temporaryFile);
		temporaryFilePath = temporaryFile;
	});
	t.false(await pathExists(temporaryFilePath));
});

test('.directory()', t => {
	const prefix = 'name_';

	t.true(tempy.directory().includes(tempDir));
	t.true(path.basename(tempy.directory({prefix})).startsWith(prefix));
});

test('.directory.task()', async t => {
	let temporaryDirectoryPath;
	await tempy.directory.task(async temporaryDirectory => {
		temporaryDirectoryPath = temporaryDirectory;
	});
	t.false(await pathExists(temporaryDirectoryPath));
});

test('.write(string)', async t => {
	const filePath = await tempy.write('unicorn', {name: 'test.png'});
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
	t.is(path.basename(filePath), 'test.png');
});

test('.write.task(string)', async t => {
	let temporaryFilePath;
	await tempy.write.task('', async temporaryFile => {
		temporaryFilePath = temporaryFile;
	});
	t.false(await pathExists(temporaryFilePath));
});

test('.write(buffer)', async t => {
	const filePath = await tempy.write(Buffer.from('unicorn'));
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
});

test('.write(stream)', async t => {
	const readable = new stream.Readable({
		read() {}
	});
	readable.push('unicorn');
	readable.push(null);
	const filePath = await tempy.write(readable);
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
});

test('.write(stream) failing stream', async t => {
	const readable = new stream.Readable({
		read() {}
	});
	readable.push('unicorn');
	setImmediate(() => {
		readable.emit('error', new Error('Catch me if you can!'));
		readable.push(null);
	});
	await t.throwsAsync(() => tempy.write(readable), {
		instanceOf: Error,
		message: 'Catch me if you can!'
	});
});

test('.writeSync()', t => {
	t.is(fs.readFileSync(tempy.writeSync('unicorn'), 'utf8'), 'unicorn');
});

test('.root', t => {
	t.true(tempy.root.length > 0);
	t.true(path.isAbsolute(tempy.root));

	t.throws(() => {
		tempy.root = 'foo';
	});
});
