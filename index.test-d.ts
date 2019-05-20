import {expectType, expectError} from 'tsd';
import tempy = require('.');

const options: tempy.Options = {};
expectType<string>(tempy.directory());
expectType<string>(tempy.file());
expectType<string>(tempy.file({extension: 'png'}));
expectType<string>(tempy.file({name: 'afile.txt'}));
expectType<string>(tempy.root);
expectType<string[]>(tempy.clean());

expectType<Promise<unknown>>(tempy.job(() => {}));
expectType<Promise<unknown>>(tempy.job(() => true));
expectType<Promise<unknown>>(tempy.job(async () => 'done!'));
expectType<Promise<unknown>>(tempy.job(directory => directory));
expectType<Promise<unknown>>(tempy.job(async directory => directory));

expectError(tempy.file({extension: 'png', name: 'afile.txt'}));
expectError(tempy.job('string'));
