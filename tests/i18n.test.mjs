import {test} from 'node:test';
import assert from 'node:assert/strict';
class Mem{constructor(){this.data={}}getItem(k){return this.data[k]??null}setItem(k,v){this.data[k]=String(v)}}
globalThis.localStorage=new Mem();
globalThis.document={documentElement:{setAttribute(k,v){this[k]=v}}};
globalThis.window=new EventTarget();
const i18n=await import('../js/i18n.js');

test('English is the default language and Malay is persisted',()=>{
 assert.equal(i18n.getLocale(),'en');
 i18n.setLocale('ms');
 assert.equal(i18n.getLocale(),'ms');
 assert.equal(localStorage.getItem('penyuguard:language'),'ms');
 assert.equal(document.documentElement.lang,'ms');
});

test('Malay translates navigation, safety guidance and domain status',()=>{
 assert.equal(i18n.translateText('Home'),'Laman Utama');
 assert.equal(i18n.translateText('Report a turtle concern'),'Laporkan kebimbangan tentang penyu');
 assert.equal(i18n.translateText('Awaiting Review'),'Menunggu Semakan');
 assert.match(i18n.translateText('Please acknowledge the wildlife safety guidance.'),/Sila akui/);
});

test('Dynamic mixed identifiers do not modify canonical case IDs',()=>{
 assert.equal(i18n.translateText('Documented case outcome: Referred to Authority (Demo)'), 'Hasil kes direkodkan: Dirujuk kepada Pihak Berkuasa (Demo)');
 assert.equal(i18n.translateText('PG-2026-0001'),'PG-2026-0001');
 assert.equal(i18n.translateText('Some newly written case notes that did not come from the interface.'),'Some newly written case notes that did not come from the interface.');
});

test('Switch back to English restores original interface strings',()=>{
 i18n.setLocale('en');
 assert.equal(i18n.translateText('Home'),'Home');
 assert.equal(i18n.translateText('Under Review'),'Under Review');
 assert.equal(localStorage.getItem('penyuguard:language'),'en');
});
