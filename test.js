import path from 'path';
import {tmpdir} from 'os';
import test from 'ava';
import tempy from '.';

test('.file()', t => {
	t.true(tempy.file().includes(tmpdir()));
	t.true(tempy.file({extension: 'png'}).endsWith('.png'));
	t.true(tempy.file({extension: '.png'}).endsWith('.png'));
	t.false(tempy.file({extension: '.png'}).endsWith('..png'));
	t.true(tempy.file({name: 'custom-name.md'}).endsWith('custom-name.md'));
});

test('.directory()', t => {
	const prefix = 'name_';

	t.true(tempy.directory().includes(tmpdir()));
	t.true(tempy.directory({prefix}).startsWith(prefix));
});

test('.root', t => {
	t.true(tempy.root.length > 0);
	t.true(path.isAbsolute(tempy.root));
	t.throws(() => {
		tempy.root = 'foo';
	});
});
