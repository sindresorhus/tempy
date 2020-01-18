import {expectType, expectError} from 'tsd';
import tempy = require('.');

const options: tempy.FileOptions = {};
expectType<string>(tempy.directory());
expectType<string>(tempy.directory({prefix: 'name_'}));
expectType<string>(tempy.file());
expectType<string>(tempy.file({extension: 'png'}));
expectType<string>(tempy.file({name: 'afile.txt'}));
expectError(tempy.file({extension: 'png', name: 'afile.txt'}));
expectType<string>(tempy.root);
