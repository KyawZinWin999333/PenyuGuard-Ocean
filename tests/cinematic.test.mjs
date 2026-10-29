import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {HERO_STORIES,cinematicHero} from '../js/cinematic.js';
test('cinematic scene markup includes exactly five linked real-photo stories and accessible controls',()=>{
 assert.equal(HERO_STORIES.length,5);
 const html=cinematicHero('PG-2026-0001');
 assert.equal((html.match(/data-cinema-card="/g)||[]).length,5);
 assert.equal((html.match(/data-cinema-dot="/g)||[]).length,5);
 assert.match(html,/data-cinema-next/);
 assert.match(html,/data-cinema-previous/);
 assert.match(html,/aria-label="Pause slideshow"/);
 assert.match(html,/#\/passport\/PG-2026-0001/);
 assert.match(html,/Academic|FICTIONAL ACADEMIC DEMONSTRATION/);
});
test('cinematic CSS includes mobile and reduced-motion modes',async()=>{
 const css=await readFile(new URL('../cinematic.css',import.meta.url),'utf8');
 for(const fragment of ['.cinema-card[data-pos="0"]','@media(max-width:590px)','@media(prefers-reduced-motion:reduce)','body.motion-ready'])assert.ok(css.includes(fragment),`Missing ${fragment}`);
});
test('scripts remain dependency-free and still provide Windows launcher',async()=>{
 const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
 assert.equal(pkg.scripts.dev,'node serve.mjs');
 assert.equal(pkg.scripts.build,'node build.mjs');
 const script=await readFile(new URL('../START_HERE_WINDOWS.bat',import.meta.url),'utf8');
 assert.match(script,/node serve\.mjs/);
});
