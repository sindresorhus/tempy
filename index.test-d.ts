import {expectType, expectError} from 'tsd';
import tempy = require('.');

(async () => {
    const options: tempy.Options = {};
    expectType<string>(tempy.directory());
    expectType<string>(tempy.file());
    expectType<string>(tempy.file({extension: 'png'}));
    expectType<string>(tempy.file({name: 'afile.txt'}));
    expectError(tempy.file({extension: 'png', name: 'afile.txt'}));
    expectError(tempy.file({name: 'file.txt', filePath: '/blah/blah/blah/file.txt'}));
    expectType<string>(tempy.root);
    expectType<string>(tempy.writeSync('hi there'));
    expectType<string>(await tempy.write('hi there'));
})
