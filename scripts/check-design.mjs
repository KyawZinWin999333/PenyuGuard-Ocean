import './restore-video.mjs';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const baseline=JSON.parse(await readFile('design-baseline.json','utf8'));
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
for(const [file,expected] of Object.entries(baseline.files))if(sha(await readFile(file))!==expected)throw Error('Original visual file changed: '+file);
const source=await readFile('js/app.js','utf8');
for(const [name,next] of [['header','footer'],['footer','introLine'],['landing','report']]){const from=source.indexOf('function '+name+'('),to=source.indexOf('function '+next+'(',from);if(sha(source.slice(from,to))!==baseline.sections[name])throw Error('Original visual composition changed: '+name);}
console.log(`Design preserved: ${Object.keys(baseline.files).length} exact visual files, original header, footer and landing composition.`);
