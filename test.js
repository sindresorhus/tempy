import path from 'path';
import {tmpdir} from 'os';
import test from 'ava';
import m from '.';

test('.file()', t => {
	t.true(m.file().includes(tmpdir()));
	t.true(m.file({extension: 'png'}).endsWith('.png'));
});

test('.directory()', t => {
	t.true(m.directory().includes(tmpdir()));
});

test('.directoryAsync()', async t => {
	t.true((await m.directoryAsync()).includes(tmpdir()));
});

test('.root', t => {
	t.true(m.root.length > 0);
	t.true(path.isAbsolute(m.root));
});
