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

test('.file() with parentDirectory', t => {
	const filePath = temporaryFile({parentDirectory: 'my-app'});
	t.true(filePath.includes(path.join(tempDir, 'my-app')));
});

test('.file() with parentDirectory and extension', t => {
	const filePath = temporaryFile({parentDirectory: 'my-app', extension: 'png'});
	t.true(filePath.includes(path.join(tempDir, 'my-app')));
	t.true(filePath.endsWith('.png'));
});

test('.file() with parentDirectory and name', t => {
	const filePath = temporaryFile({parentDirectory: 'my-app', name: 'unicorn.png'});
	t.true(filePath.includes(path.join(tempDir, 'my-app')));
	t.is(path.basename(filePath), 'unicorn.png');
});

test('.directory() with parentDirectory', t => {
	const directory = temporaryDirectory({parentDirectory: 'my-app'});
	t.true(directory.includes(path.join(tempDir, 'my-app')));
	t.true(fs.statSync(directory).isDirectory());
});

test('.directory() with parentDirectory and prefix', t => {
	const directory = temporaryDirectory({parentDirectory: 'my-app', prefix: 'name_'});
	t.true(directory.includes(path.join(tempDir, 'my-app')));
	t.true(path.basename(directory).startsWith('name_'));
});

test('.file() with parentDirectory - auto-creates the directory', t => {
	const parentDirectory = `auto-create-name-${Date.now()}`;
	const filePath = temporaryFile({parentDirectory, name: 'test.txt'});
	t.true(fs.existsSync(path.dirname(filePath)));
});

test('.file() with parentDirectory and extension - auto-creates the directory', t => {
	const parentDirectory = `auto-create-ext-${Date.now()}`;
	const filePath = temporaryFile({parentDirectory, extension: 'png'});
	t.true(fs.existsSync(path.dirname(filePath)));
	t.true(filePath.endsWith('.png'));
});

test('.write() with parentDirectory', async t => {
	const parentDirectory = `auto-create-write-${Date.now()}`;
	const filePath = await temporaryWrite('unicorn', {parentDirectory});
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
	t.true(filePath.includes(path.join(tempDir, parentDirectory)));
});

test('.file() with parentDirectory - rejects unsafe values', t => {
	for (const fixture of ['..', '../foo', 'foo/bar', 'foo\\bar', 'foo\0bar']) {
		t.throws(() => temporaryFile({parentDirectory: fixture}), {message: /Unsafe path component/});
	}
});

test('.file() with rootDirectory', t => {
	const rootDirectory = path.join(tempDir, `root-test-${Date.now()}`);
	const filePath = temporaryFile({rootDirectory});
	t.true(filePath.startsWith(rootDirectory));
	t.true(fs.existsSync(rootDirectory));
});

test('.file() with rootDirectory and parentDirectory', t => {
	const rootDirectory = path.join(tempDir, `root-parent-test-${Date.now()}`);
	const filePath = temporaryFile({rootDirectory, parentDirectory: 'my-app'});
	t.true(filePath.startsWith(path.join(rootDirectory, 'my-app')));
});

test('.file() with rootDirectory and extension', t => {
	const rootDirectory = path.join(tempDir, `root-ext-test-${Date.now()}`);
	const filePath = temporaryFile({rootDirectory, extension: 'png'});
	t.true(filePath.startsWith(rootDirectory));
	t.true(filePath.endsWith('.png'));
});

test('.file() with rootDirectory and name', t => {
	const rootDirectory = path.join(tempDir, `root-name-test-${Date.now()}`);
	const filePath = temporaryFile({rootDirectory, name: 'unicorn.png'});
	t.true(filePath.startsWith(rootDirectory));
	t.is(path.basename(filePath), 'unicorn.png');
});

test('.directory() with rootDirectory', t => {
	const rootDirectory = path.join(tempDir, `root-dir-test-${Date.now()}`);
	const directory = temporaryDirectory({rootDirectory});
	t.true(directory.startsWith(rootDirectory));
	t.true(fs.statSync(directory).isDirectory());
});

test('.file() with rootDirectory - rejects relative paths', t => {
	t.throws(() => temporaryFile({rootDirectory: 'relative/path'}), {
		message: /must be an absolute path/,
	});
});

test('.write() with rootDirectory', async t => {
	const rootDirectory = path.join(tempDir, `root-write-test-${Date.now()}`);
	const filePath = await temporaryWrite('unicorn', {rootDirectory});
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
	t.true(filePath.startsWith(rootDirectory));
});

test('.writeSync() with rootDirectory', t => {
	const rootDirectory = path.join(tempDir, `root-write-sync-test-${Date.now()}`);
	const filePath = temporaryWriteSync('unicorn', {rootDirectory});
	t.is(fs.readFileSync(filePath, 'utf8'), 'unicorn');
	t.true(filePath.startsWith(rootDirectory));
});

test('.directory.task() with rootDirectory cleans up', async t => {
	const rootDirectory = path.join(tempDir, `root-task-test-${Date.now()}`);
	let temporaryDirectoryPath;
	await temporaryDirectoryTask(async temporaryDirectory => {
		temporaryDirectoryPath = temporaryDirectory;
		t.true(temporaryDirectory.startsWith(rootDirectory));
	}, {rootDirectory});
	t.false(await pathExists(temporaryDirectoryPath));
});

// TODO: Use `unsafeFilenameFixtures` from `is-safe-filename` when targeting Node.js 20.
const unsafeFilenameFixtures = [
	'',
	'   ',
	'.',
	'..',
	' .',
	'. ',
	' ..',
	'.. ',
	'../',
	'../foo',
	'foo/../bar',
	'foo/bar',
	'foo\\bar',
	'foo\0bar',
];

test('rejects unsafe path components', t => {
	for (const fixture of unsafeFilenameFixtures) {
		t.throws(() => temporaryFile({name: fixture}), {message: /Unsafe path component/});
		t.throws(() => temporaryFile({extension: fixture}), {message: /Unsafe path component/});

		// Empty string is valid for prefix (it's the default)
		if (fixture !== '') {
			t.throws(() => temporaryDirectory({prefix: fixture}), {message: /Unsafe path component/});
		}
	}
});
