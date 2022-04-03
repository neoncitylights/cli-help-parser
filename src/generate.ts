import fs from 'fs';
import { parseAllOptions } from './index';

const readFilePath = './options.txt';
const writeFilePath = './options.json';

console.time('gen-options-json');
fs.readFile(readFilePath, 'utf8', (err, data) => {
	if(err) {
		console.error(err);
		return;
	}

	const options: Fig.Option[] = parseAllOptions(data);
	const jsonString: string =  JSON.stringify(options, null, '\t');
	fs.writeFile(writeFilePath, jsonString, { flag: 'w+' }, err => {
		console.error(err);
		return;
	});

	console.timeEnd('gen-options-json');
	console.log(`Successfully read ${options.length} options from \`${readFilePath}\` and wrote to \`${writeFilePath}\``);
});
