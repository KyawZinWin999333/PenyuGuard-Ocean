import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {dirname,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const destination=resolve(root,'assets/video/sea-turtle-original-qhd.mp4');
const hash=data=>createHash('sha256').update(data).digest('hex');
const baseline=JSON.parse(await readFile(resolve(root,'design-baseline.json'),'utf8'));
const expected=baseline.files['assets/video/sea-turtle-original-qhd.mp4'];
let existing;try{existing=await readFile(destination);}catch{}
if(!existing||hash(existing)!==expected){
 const manifest=JSON.parse(await readFile(resolve(root,'media-source/manifest.json'),'utf8'));
 const chunks=await Promise.all(manifest.parts.map(name=>readFile(resolve(root,'media-source',name))));
 const restored=Buffer.concat(chunks);
 if(restored.length!==manifest.size||hash(restored)!==expected||manifest.sha256!==expected)throw Error('Original video restoration failed integrity check');
 await mkdir(dirname(destination),{recursive:true});await writeFile(destination,restored);console.log('Original QHD video restored exactly from source parts.');
}
