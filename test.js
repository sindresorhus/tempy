import path from 'path';
import {tmpdir} from 'os';
import test from 'ava';
import pathExists from 'path-exists';
import tempy from '.';

test('.file()', t => {
	t.true(tempy.file().includes(tmpdir()));
	t.true(tempy.file({extension: 'png'}).endsWith('.png'));
	t.true(tempy.file({extension: '.png'}).endsWith('.png'));
	t.false(tempy.file({extension: '.png'}).endsWith('..png'));
	t.true(tempy.file({name: 'custom-name.md'}).endsWith('custom-name.md'));
});

test('.directory()', t => {
	t.true(tempy.directory().includes(tmpdir()));
});

test('.clean()', t => {
	const deleleDirectories = tempy.clean();
	t.true(deleleDirectories.length > 0);
	deleleDirectories.forEach(directory => {
		t.false(pathExists.sync(directory));
	});
});

test('.job()', async t => {
	t.true(await tempy.job(async directory => pathExists(directory)));
	t.true(await tempy.job(directory => pathExists.sync(directory)));

	const deleleDirectory = await tempy.job(directory => directory);
	t.false(await pathExists(deleleDirectory));
});

test('.root', t => {
	t.true(tempy.root.length > 0);
	t.true(path.isAbsolute(tempy.root));
	t.throws(() => {
		tempy.root = 'foo';
	});
});
