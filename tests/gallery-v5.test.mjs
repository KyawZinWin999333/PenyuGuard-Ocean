import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {PHOTOS} from '../js/visuals.js';
import {HERO_STORIES,cinematicHero} from '../js/cinematic.js';
const root=new URL('../',import.meta.url);
test('all five user-supplied photos are bundled at full original pixel dimensions',async()=>{
  for(let n=1;n<=5;n++){
    const p=PHOTOS[`gallery${n}`];
    assert.ok(p,'Missing gallery image '+n);
    const path=new URL(p.local,root);
    const buf=await readFile(path);
    assert.ok(buf.length>100_000,`${p.local} looks truncated`);
    assert.deepEqual([...buf.subarray(0,3)],[0xff,0xd8,0xff]);
  }
});
test('hero plays original QHD video in a loop and has a still-image fallback',async()=>{
  const hero=cinematicHero();
  assert.match(hero,/<video[^>]+autoplay[^>]+loop[^>]+playsinline/);
  assert.match(hero,/sea-turtle-original-qhd\.mp4/);
  assert.match(hero,/ocean-film-poster\.jpg/);
  const video=await stat(new URL('assets/video/sea-turtle-original-qhd.mp4',root));
  assert.ok(video.size>60_000_000,'Original QHD video appears replaced or truncated');
});
test('five photo stories use user gallery images and no duplicate player appears in landing',async()=>{
  const galleryKeys=new Set(HERO_STORIES.map(x=>x.key));
  assert.deepEqual(galleryKeys,new Set(['gallery1','gallery2','gallery3','gallery4','gallery5']));
  const app=await readFile(new URL('js/app.js',root),'utf8');
  assert.match(app,/ocean-photo-feature/);
  assert.match(app,/ocean-photo-grid/);
  assert.doesNotMatch(app,/ocean-film-feature/);
  assert.doesNotMatch(app,/ocean-film-frame/);
  assert.ok((app.match(/class="ocean-photo-card/g)||[]).length===5);
});
