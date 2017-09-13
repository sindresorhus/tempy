import path from 'path';
import {tmpdir} from 'os';
import test from 'ava';
import m from '.';

test('.file()', t => {
	t.true(m.file().includes(tmpdir()));
	t.true(m.file({extension: 'png'}).endsWith('.png'));
	t.true(m.file({name: 'custom-name.md'}).endsWith('custom-name.md'));
});

test('.directory()', t => {
	t.true(m.directory().includes(tmpdir()));
});

test('.root', t => {
	t.true(m.root.length > 0);
	t.true(path.isAbsolute(m.root));
});
