import path from 'path';
import {tmpdir} from 'os';
import test from 'ava';
import pathExists from 'path-exists';
import tempy from '.';

test('.file()', t => {
	t.true(tempy.file().includes(tmpdir()));
	t.true(tempy.file({extension: 'png'}).endsWith('.png'));
	t.true(tempy.file({extension: '.png'}).endsWith('.png'));
	t.true(tempy.file({name: 'custom-name.md'}).endsWith('custom-name.md'));
	t.false(tempy.file({extension: '.png'}).endsWith('..png'));
});

test('.fileAsync()', async t => {
	t.true((await tempy.fileAsync()).includes(tmpdir()));
	t.true((await tempy.fileAsync({extension: 'png'})).endsWith('.png'));
	t.true((await tempy.fileAsync({extension: '.png'})).endsWith('.png'));
	t.true((await tempy.fileAsync({name: 'custom-name.md'})).endsWith('custom-name.md'));
	t.false((await tempy.fileAsync({extension: '.png'})).endsWith('..png'));
});

test('.directory()', t => {
	t.true(tempy.directory().includes(tmpdir()));
});

test('.directoryAsync()', async t => {
	t.true((await tempy.directoryAsync()).includes(tmpdir()));
});

test('.clean()', t => {
	tempy.directory();
	const deleleDirectories = tempy.clean();
	t.true(deleleDirectories.length > 0);
	deleleDirectories.forEach(directory => {
		t.false(pathExists.sync(directory));
	});
});

test('.cleanAsync()', async t => {
	await tempy.directoryAsync();
	const deleleDirectories = await tempy.cleanAsync();
	t.true(deleleDirectories.length > 0);
	deleleDirectories.forEach(directory => {
		t.false(pathExists.sync(directory));
	});
});

test('.jobDirectory()', t => {
	t.true(tempy.jobDirectory(directory => pathExists.sync(directory)));

	const deleleDirectory = tempy.jobDirectory(directory => directory);
	t.false(pathExists.sync(deleleDirectory));
});

test('.jobDirectoryAsync()', async t => {
	t.true(await tempy.jobDirectory(async directory => pathExists(directory)));
	t.true(await tempy.jobDirectory(directory => pathExists.sync(directory)));

	const deleleDirectory = await tempy.jobDirectory(directory => directory);
	t.false(await pathExists(deleleDirectory));
});

test('.jobFile()', t => {
	t.true(tempy.jobFile(file => file.endsWith('custom-name.md'), {name: 'custom-name.md'}));

	const deleleDirectory = tempy.jobFile(file => path.dirname(file), {name: 'custom-name.md'});
	t.false(pathExists.sync(deleleDirectory));
});

test('.jobFileAsync()', async t => {
	t.true(await tempy.jobFile(async file => file.endsWith('custom-name.md'), {name: 'custom-name.md'}));
	t.true(await tempy.jobFile(file => file.endsWith('custom-name.md'), {name: 'custom-name.md'}));

	const deleleDirectory = await tempy.jobFile(file => path.dirname(file), {name: 'custom-name.md'});
	t.false(await pathExists(deleleDirectory));
});

test('.root', t => {
	t.true(tempy.root.length > 0);
	t.true(path.isAbsolute(tempy.root));
	t.throws(() => {
		tempy.root = 'foo';
	});
});

// TODO Add test auto clean and disable auto clean
