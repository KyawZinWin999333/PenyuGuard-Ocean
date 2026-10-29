/** Optional offline static preview generator (browser test is separate). */
import {readFile,writeFile} from 'node:fs/promises';
class Mem{constructor(){this.d={}}getItem(k){return this.d[k]??null}setItem(k,v){this.d[k]=String(v)}removeItem(k){delete this.d[k]}}
globalThis.localStorage=new Mem();globalThis.sessionStorage=new Mem();
const app={innerHTML:''};globalThis.document={querySelector:s=>s==='#app'?app:null,title:'',addEventListener(){},body:{appendChild(){}}};
globalThis.window=new EventTarget();globalThis.location={origin:'http://localhost:5173',hash:'#/',pathname:'/',search:''};globalThis.history={replaceState(){}};
await import('../js/app.js');
const css=(await Promise.all(['styles.css','premium.css','cinematic.css'].map(x=>readFile(new URL('../'+x,import.meta.url),'utf8')))).join('\n');
const svg=await readFile(new URL('../assets/ocean-turtle.svg',import.meta.url),'utf8');
const uri='data:image/svg+xml;base64,'+Buffer.from(svg).toString('base64');
const html=app.innerHTML.replace(/<img\b([^>]*?)>/g,(str,attrs)=>'<img '+attrs.replace(/src="[^"]+"/,`src="${uri}"`).replace(/onerror="[^"]+"/,'')+'>');
await writeFile(new URL('../preview-static.html',import.meta.url),`<!doctype html><html><head><meta charset="utf-8"><style>${css}</style></head><body>${html}</body></html>`);
