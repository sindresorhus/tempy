import {expectType, expectError} from 'tsd';
import tempy = require('.');

const options: tempy.Options = {};
expectType<string>(tempy.directory());
expectType<string>(tempy.file());
expectType<string>(tempy.file({extension: 'png'}));
expectType<string>(tempy.file({name: 'afile.txt'}));
expectType<string[]>(tempy.clean());
expectType<unknown>(tempy.jobDirectory(() => {}));
expectType<unknown>(tempy.jobFile(() => {}));
expectType<string>(tempy.writeSync('unicorn'));
expectType<string>(tempy.writeSync(Buffer.from('unicorn')));
expectType<string>(tempy.writeSync('unicorn', {name: 'pony.png'}));

expectType<Promise<string>>(tempy.directoryAsync());
expectType<Promise<string>>(tempy.fileAsync());
expectType<Promise<string>>(tempy.fileAsync({extension: 'png'}));
expectType<Promise<string>>(tempy.fileAsync({name: 'afile.txt'}));
expectType<Promise<string[]>>(tempy.cleanAsync());
expectType<Promise<unknown>>(tempy.jobDirectoryAsnc(async () => {}));
expectType<Promise<unknown>>(tempy.jobFileAsync(async () => {}));
expectType<Promise<string>>(tempy.write('unicorn'));
expectType<Promise<string>>(tempy.write('unicorn', {name: 'pony.png'}));
expectType<Promise<string>>(tempy.write(process.stdin, {name: 'pony.png'}));
expectType<Promise<string>>(tempy.write(Buffer.from('pony'), {name: 'pony.png'}));

expectType<void>(tempy.disableAutoClean());
expectType<string>(tempy.root);

expectError(tempy.file({extension: 'png', name: 'afile.txt'}));
expectError(tempy.job('string'));
