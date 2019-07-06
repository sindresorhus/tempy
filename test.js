import path from 'path';
import fs from 'fs';
import {tmpdir} from 'os';
import test from 'ava';
import tempy from '.';

test('.file()', t => {
	t.true(tempy.file().includes(tmpdir()));
	t.true(tempy.file({extension: 'png'}).endsWith('.png'));
	t.true(tempy.file({extension: '.png'}).endsWith('.png'));
	t.false(tempy.file({extension: '.png'}).endsWith('..png'));
	t.true(tempy.file({name: 'custom-name.md'}).endsWith('custom-name.md'));
	t.true(tempy.file({filePath: '/rainbow/unicorns'}).endsWith('/rainbow/unicorns'));
	t.true(tempy.file({filePath: '/directo/ries/text'}).endsWith('ries/text'));
});

test('.directory()', t => {
	t.true(tempy.directory().includes(tmpdir()));
	t.true(tempy.directory('/rainbow').endsWith('rainbow'));
});

test('.write()', async t => {
	const tempPath = await tempy.write('rainbow');
	t.deepEqual(fs.readFileSync(tempPath).toString(), 'rainbow');
});

test('.writeSync()', t => {
	const tempPath = tempy.writeSync('rainbow', {filePath: '/directo/ries/custom-name.txt'});
	t.deepEqual(fs.readFileSync(tempPath).toString(), 'rainbow');
	t.true(tempPath.endsWith('custom-name.txt'));
	t.true(tempPath.includes('/directo/ries'));
});

test('.root', t => {
	t.true(tempy.root.length > 0);
	t.true(path.isAbsolute(tempy.root));
	t.throws(() => {
		tempy.root = 'foo';
	});
});
