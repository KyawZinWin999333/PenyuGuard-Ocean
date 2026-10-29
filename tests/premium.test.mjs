import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {PHOTOS,photo} from '../js/visuals.js';
test('all photographic sources have local imagery and safe fallback',()=>{
 assert.ok(Object.keys(PHOTOS).length>=5);
 for(const key of Object.keys(PHOTOS)){
  const p=PHOTOS[key];
  assert.match(p.url,/^(https:\/\/(upload\.wikimedia\.org|www\.fws\.gov)\/|assets\/ocean-turtle\.svg$)/);
  assert.match(p.local,/^assets\/photos\/.+\.jpg$/);
  const markup=photo(key,'example',true);
  assert.match(markup,/onerror=/);
  assert.match(markup,/assets\/ocean-turtle\.svg/);
 }
});
test('premium stylesheet and image attribution documents are present',async()=>{
 const root=new URL('../',import.meta.url);
 const css=await readFile(new URL('premium.css',root),'utf8');
 const html=await readFile(new URL('index.html',root),'utf8');
 const credits=await readFile(new URL('IMAGE_CREDITS.md',root),'utf8');
 assert.match(css,/\.editorial-hero/);
 assert.match(html,/premium\.css/);
 assert.match(credits,/user-supplied source video/);
 assert.match(credits,/not been independently established/);
});
