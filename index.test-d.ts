import process from 'node:process';
import {Buffer} from 'node:buffer';
import {expectType, expectError} from 'tsd';
import {
	temporaryFile,
	temporaryFileTask,
	temporaryDirectory,
	temporaryDirectoryTask,
	temporaryWrite,
	temporaryWriteTask,
	temporaryWriteSync,
	rootTemporaryDirectory,
	FileOptions,
} from './index.js';

const options: FileOptions = {}; // eslint-disable-line @typescript-eslint/no-unused-vars
expectType<string>(temporaryDirectory());
expectType<string>(temporaryDirectory({prefix: 'name_'}));
expectType<string>(temporaryFile());
expectType<Promise<void>>(temporaryFileTask(temporaryFile => {
	expectType<string>(temporaryFile);
}));
expectType<Promise<void>>(temporaryDirectoryTask(temporaryDirectory => {
	expectType<string>(temporaryDirectory);
}));
expectType<string>(temporaryFile({extension: 'png'}));
expectType<string>(temporaryFile({name: 'afile.txt'}));
expectError(temporaryFile({extension: 'png', name: 'afile.txt'}));
expectType<string>(rootTemporaryDirectory);

expectType<Promise<string>>(temporaryWrite('unicorn'));
expectType<Promise<string>>(temporaryWrite('unicorn', {name: 'pony.png'}));
expectType<Promise<string>>(temporaryWrite(process.stdin, {name: 'pony.png'}));
expectType<Promise<string>>(temporaryWrite(Buffer.from('pony'), {name: 'pony.png'}));
expectType<Promise<void>>(temporaryWriteTask('', temporaryFile => {
	expectType<string>(temporaryFile);
}));

expectType<string>(temporaryWriteSync('unicorn'));
expectType<string>(temporaryWriteSync(Buffer.from('unicorn')));
expectType<string>(temporaryWriteSync('unicorn', {name: 'pony.png'}));
