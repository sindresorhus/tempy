import {expectType, expectError} from 'tsd';
import tempy = require('.');

const options: tempy.Options = {};
expectType<string>(tempy.directory());
expectType<string>(tempy.file());
expectType<string>(tempy.file({extension: 'png'}));
expectType<string>(tempy.file({name: 'afile.txt'}));
expectError(tempy.file({extension: 'png', name: 'afile.txt'}));
expectType<string>(tempy.root);

expectType<string>(tempy.contextSync());
expectType<void>(tempy.contextSync((dir: string) => {
  expectType<string>(dir);
}));
expectType<void>(tempy.contextSync({}, (dir: string) => {
  expectType<string>(dir);
}));

expectType<Promise<[string, Function]>>(tempy.context());
expectType<Promise<[string, Function]>>(tempy.context({ keepDir: true }));