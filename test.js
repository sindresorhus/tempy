import path from 'path';
import {tmpdir} from 'os';
import test from 'ava';
import uniqueString from 'unique-string';
import tempy from '.';

test('.file()', t => {
	t.true(tempy.file().includes(tmpdir()));
	t.true(tempy.file({extension: 'png'}).endsWith('.png'));
	t.true(tempy.file({extension: '.png'}).endsWith('.png'));
	t.false(tempy.file({extension: '.png'}).endsWith('..png'));
	t.true(tempy.file({name: 'custom-name.md'}).endsWith('custom-name.md'));
});

test('.directory()', t => {
	const subDir = uniqueString();

	t.true(tempy.directory().includes(tmpdir()));
	t.true(tempy.directory({prefix: 'custom'}).includes('custom'));
	t.true(tempy.directory({prefix: subDir + '\\'}).includes(subDir));
});

test('.root', t => {
	t.true(tempy.root.length > 0);
	t.true(path.isAbsolute(tempy.root));
	t.throws(() => {
		tempy.root = 'foo';
	});
});
