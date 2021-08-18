import process from 'node:process';
import {Buffer} from 'node:buffer';
import {expectType, expectError} from 'tsd';
import tempy, {FileOptions} from './index.js';

const options: FileOptions = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
expectType<string>(tempy.directory());
expectType<string>(tempy.directory({prefix: 'name_'}));
expectType<string>(tempy.file());
expectType<Promise<void>>(tempy.file.task(temporaryFile => {
	expectType<string>(temporaryFile);
}));
expectType<Promise<void>>(tempy.directory.task(temporaryDirectory => {
	expectType<string>(temporaryDirectory);
}));
expectType<string>(tempy.file({extension: 'png'}));
expectType<string>(tempy.file({name: 'afile.txt'}));
expectError(tempy.file({extension: 'png', name: 'afile.txt'}));
expectType<string>(tempy.root);

expectType<Promise<string>>(tempy.write('unicorn'));
expectType<Promise<string>>(tempy.write('unicorn', {name: 'pony.png'}));
expectType<Promise<string>>(tempy.write(process.stdin, {name: 'pony.png'})); // eslint-disable-line @typescript-eslint/no-unsafe-member-access
expectType<Promise<string>>(tempy.write(Buffer.from('pony'), {name: 'pony.png'}));
expectType<Promise<void>>(tempy.write.task('', temporaryFile => {
	expectType<string>(temporaryFile);
}));

expectType<string>(tempy.writeSync('unicorn'));
expectType<string>(tempy.writeSync(Buffer.from('unicorn')));
expectType<string>(tempy.writeSync('unicorn', {name: 'pony.png'}));
