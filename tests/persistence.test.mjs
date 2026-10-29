import {test} from 'node:test';
import assert from 'node:assert/strict';
class MemoryStore{constructor(){this.data=new Map()}getItem(k){return this.data.has(k)?this.data.get(k):null}setItem(k,v){this.data.set(k,String(v))}removeItem(k){this.data.delete(k)}}
globalThis.localStorage=new MemoryStore();globalThis.sessionStorage=new MemoryStore();globalThis.window=new EventTarget();
test('saved reports and reviewer decisions are rehydrated by a fresh domain module',async()=>{
 const d1=await import('../js/domain.js?first');
 const c=d1.createReport({category:'entanglement',publicZone:d1.ZONES[2],observedAt:new Date().toISOString(),description:'Fictional data that must survive domain module recreation.',observedConditions:[],ack:true});
 d1.transitionCase(c.id,'start_review',{},'reviewer');
 d1.transitionCase(c.id,'verify',{note:'Reviewer confirmed sufficient fictional data.'},'reviewer');
 const d2=await import('../js/domain.js?reload');
 assert.equal(d2.getCase(c.id).status,'verified');
 assert.equal(d2.getCase(c.id).events.at(-1).title,'Verified for follow-up');
 assert.equal(d2.metrics().total,11);
});
