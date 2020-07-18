import {expectType, expectError} from 'tsd';
import tempy = require('.');

const options: tempy.FileOptions = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
expectType<string>(tempy.directory());
expectType<string>(tempy.directory({prefix: 'name_'}));
expectType<string>(tempy.file());
expectType<string>(tempy.file({extension: 'png'}));
expectType<string>(tempy.file({name: 'afile.txt'}));
expectError(tempy.file({extension: 'png', name: 'afile.txt'}));
expectType<string>(tempy.root);

expectType<Promise<string>>(tempy.write('unicorn'));
expectType<Promise<string>>(tempy.write('unicorn', {name: 'pony.png'}));
expectType<Promise<string>>(tempy.write(process.stdin, {name: 'pony.png'}));
expectType<Promise<string>>(tempy.write(Buffer.from('pony'), {name: 'pony.png'}));

expectType<string>(tempy.writeSync('unicorn'));
expectType<string>(tempy.writeSync(Buffer.from('unicorn')));
expectType<string>(tempy.writeSync('unicorn', {name: 'pony.png'}));
