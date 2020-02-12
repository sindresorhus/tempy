import path from 'path';
import {tmpdir} from 'os';
import test from 'ava';
import tempy from '.';

test('.file()', t => {
	t.true(tempy.file().includes(tmpdir()));
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

test('.directory()', t => {
	t.true(tempy.directory().includes(tmpdir()));
});

test('.root', t => {
	t.true(tempy.root.length > 0);
	t.true(path.isAbsolute(tempy.root));
	t.throws(() => {
		tempy.root = 'foo';
	});
});
