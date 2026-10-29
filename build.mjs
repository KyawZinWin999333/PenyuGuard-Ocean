import './scripts/check-design.mjs';
import {mkdir,cp,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
const out=resolve('dist');await mkdir(out,{recursive:true});
for(const p of ['index.html','styles.css','premium.css','cinematic.css','assets','js'])await cp(resolve(p),resolve(out,p),{recursive:true,force:true});
await writeFile(resolve(out,'DEPLOYMENT.txt'),'Static website: upload the contents of dist/ to any static host. All routes use URL fragments (#/...). No backend or build tool dependencies. Do not enter real sensitive wildlife locations.\n');
console.log('Static deployable build created at dist/');
