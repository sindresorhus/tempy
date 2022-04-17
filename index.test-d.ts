import process from 'node:process';
import {Buffer} from 'node:buffer';
import {expectType, expectError} from 'tsd';
import {tempyFile, tempyFileTask, tempyDirectory, tempyDirectoryTask, tempyWrite, tempyWriteTask, tempyWriteSync, tempyRoot, FileOptions} from './index.js';

const options: FileOptions = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
expectType<string>(tempyDirectory());
expectType<string>(tempyDirectory({prefix: 'name_'}));
expectType<string>(tempyFile());
expectType<Promise<void>>(tempyFileTask(temporaryFile => {
	expectType<string>(temporaryFile);
}));
expectType<Promise<void>>(tempyDirectoryTask(temporaryDirectory => {
	expectType<string>(temporaryDirectory);
}));
expectType<string>(tempyFile({extension: 'png'}));
expectType<string>(tempyFile({name: 'afile.txt'}));
expectError(tempyFile({extension: 'png', name: 'afile.txt'}));
expectType<string>(tempyRoot);

expectType<Promise<string>>(tempyWrite('unicorn'));
expectType<Promise<string>>(tempyWrite('unicorn', {name: 'pony.png'}));
expectType<Promise<string>>(tempyWrite(process.stdin, {name: 'pony.png'}));
expectType<Promise<string>>(tempyWrite(Buffer.from('pony'), {name: 'pony.png'}));
expectType<Promise<void>>(tempyWriteTask('', temporaryFile => {
	expectType<string>(temporaryFile);
}));

expectType<string>(tempyWriteSync('unicorn'));
expectType<string>(tempyWriteSync(Buffer.from('unicorn')));
expectType<string>(tempyWriteSync('unicorn', {name: 'pony.png'}));
