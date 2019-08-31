import {existsSync, rmdirSync} from 'fs';
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
	t.throws(
		() => tempy.file({name: 'fiat', extension: 'lux'}),
		/The `name` and `extension` options are mutually exclusive/,
		'expect error message match on mutually exclusive opts'
	);
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

test('.contextSync()', t => {
	t.plan(2);
	const directory = tempy.contextSync();
	t.true(existsSync(directory));

	rmdirSync(directory);
	t.false(existsSync(directory), 'expected test cleanup');
});

test('.contextSync((opts, (directory) => ...))', t => {
	t.plan(2);
	let tmp;
	tempy.contextSync({keepDir: false}, directory => {
		// Do something with tmp directory
		tmp = directory;
		t.true(existsSync(tmp));
	});
	t.false(existsSync(tmp));
});

test('.contextSync((directory) => ...)', t => {
	t.plan(2);
	let tmp;
	tempy.contextSync(directory => {
		// Do something with tmp directory
		tmp = directory;
		t.true(existsSync(tmp));
	});
	t.false(existsSync(tmp));
});

test('.contextSync(({ keepDir = "true" }, (directory) => ...))', t => {
	t.plan(3);
	let tmp;
	tempy.contextSync({keepDir: true}, directory => {
		// Do something with tmp directory
		tmp = directory;
		t.true(existsSync(tmp));
	});
	t.true(existsSync(tmp));

	rmdirSync(tmp);
	t.false(existsSync(tmp), 'expected test cleanup');
});

test('.context().then((dir, done) => ...)', async t => {
	t.plan(3);
	const [dir, done] = await tempy.context();
	t.true(existsSync(dir));
	const deleted = await done();
	t.false(existsSync(dir));
	t.deepEqual(dir, deleted[0]);
});

test('.context({}).then((dir, done) => ...)', async t => {
	t.plan(3);
	const [dir, done] = await tempy.context({});
	t.true(existsSync(dir));
	const deleted = await done();
	t.false(existsSync(dir));
	t.deepEqual(dir, deleted[0]);
});

test('.context({ keepDir: "true" }).then((dir, done) => ...', async t => {
	t.plan(4);
	const [dir, done] = await tempy.context({keepDir: true});
	t.true(existsSync(dir));
	const deleted = await done();
	t.true(existsSync(dir));
	t.deepEqual(deleted, []);

	rmdirSync(dir);
	t.false(existsSync(dir), 'expected test cleanup');
});
