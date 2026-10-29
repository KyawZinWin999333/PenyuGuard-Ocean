import {test} from 'node:test';
import assert from 'node:assert/strict';
class MockStorage {#data=new Map();getItem(k){return this.#data.get(k)??null;}setItem(k,v){this.#data.set(k,String(v));}removeItem(k){this.#data.delete(k);}clear(){this.#data.clear();}}
globalThis.localStorage=new MockStorage();globalThis.sessionStorage=new MockStorage();globalThis.window=new EventTarget();
const d=await import('../js/domain.js');
const create=(overrides={})=>d.createReport({category:'entanglement',publicZone:d.ZONES[2],observedAt:new Date().toISOString(),description:'Fictional observation of fishing material nearby, no animal contact confirmed.',observedConditions:['Fishing material nearby'],evidenceData:'',ack:true,...overrides});
test('ten seeded fictional cases with coherent events',()=>{assert.equal(d.getState().cases.length,10);for(const c of d.getState().cases){assert.ok(c.id.startsWith('PG-2026-'));assert.equal(c.events[0].type,'submitted');assert.ok(c.events.every(e=>Date.parse(e.occurredAt)>=Date.parse(c.createdAt)));}});
test('validates report categories and short descriptions',()=>{assert.throws(()=>create({category:'invalid'}));assert.throws(()=>create({description:'too short'}));});
test('report IDs are unique and public projection hides internal data',()=>{const a=create({privateLocationNote:'Private fictional note'}),b=create();assert.notEqual(a.id,b.id);assert.equal(d.getCase(a.id).privateLocationNote,'Private fictional note');const exported=d.publicCase(d.getCase(a.id));assert.ok(!Object.keys(exported).includes('privateLocationNote'));assert.ok(!Object.keys(exported).includes('events')||exported.events.every(e=>!Object.keys(e).includes('internalNote')));});
test('rejects invalid transitions and enforces reviewer/coordinator demo roles',()=>{const c=create();assert.throws(()=>d.transitionCase(c.id,'verify',{note:'Some rationale'},'reviewer'));assert.throws(()=>d.transitionCase(c.id,'start_review',{},'reporter'));assert.equal(d.transitionCase(c.id,'start_review',{},'reviewer').status,'under_review');assert.throws(()=>d.transitionCase(c.id,'verify',{note:'short'},'reviewer'));assert.equal(d.transitionCase(c.id,'verify',{note:'Fictional evidence supports a documented follow-up.'},'reviewer').status,'verified');assert.throws(()=>d.transitionCase(c.id,'start_task',{},'coordinator'));assert.equal(d.transitionCase(c.id,'assign_task',{teamId:d.TEAMS[0].id},'coordinator').status,'assigned');assert.equal(d.transitionCase(c.id,'start_task',{},'coordinator').status,'in_progress');assert.equal(d.transitionCase(c.id,'add_follow_up',{note:'Fictional observation and referral was documented.'},'coordinator').status,'follow_up_recorded');assert.equal(d.transitionCase(c.id,'close_case',{note:'Fictional referral outcome noted.',disposition:'referred_to_authority'},'coordinator').status,'closed');assert.equal(d.getTaskForCase(c.id).status,'completed');assert.equal(d.getCase(c.id).events.length,7);});
test('reviewer can request more information and later resume',()=>{const c=create();d.transitionCase(c.id,'start_review',{},'reviewer');d.transitionCase(c.id,'request_info',{note:'More observations are needed.',question:'What was observed from a safe distance?'},'reviewer');d.transitionCase(c.id,'reporter_reply',{reply:'Fictional observation remained uncertain from a safe distance.'},'reporter');assert.equal(d.transitionCase(c.id,'start_review',{},'reviewer').status,'under_review');});
test('duplicate detection is only a suggestion, no automatic merging',()=>{const timestamp=new Date().toISOString(),a=create({observedAt:timestamp}),b=create({observedAt:timestamp});assert.ok(d.possibleDuplicates(b).some(x=>x.id===a.id));assert.equal(d.getCase(b.id).status,'submitted');});
test('metrics derive from case and task records and reset clears user entries',()=>{const before=d.metrics();assert.equal(before.total,d.getState().cases.length);assert.ok(before.closed>=1);d.reset();assert.equal(d.metrics().total,10);assert.equal(d.getState().nextSequence,11);});

test('submission requires wildlife safety acknowledgment and valid observation date',()=>{
 assert.throws(()=>create({ack:false}),/Acknowledge/);
 assert.throws(()=>create({observedAt:'not-a-date'}),/valid observation time/);
 assert.throws(()=>create({observedAt:new Date(Date.now()+86400000).toISOString()}),/future/);
});
test('optional follow-up evidence appears in case history and public-safe projection',()=>{
 const c=create();d.transitionCase(c.id,'start_review',{},'reviewer');d.transitionCase(c.id,'verify',{note:'Sufficient fictional evidence to verify.'},'reviewer');d.transitionCase(c.id,'assign_task',{teamId:d.TEAMS[1].id},'coordinator');d.transitionCase(c.id,'start_task',{},'coordinator');
 const image='data:image/jpeg;base64,/9j/AA==';
 assert.throws(()=>d.transitionCase(c.id,'add_follow_up',{note:'Fictional follow-up was recorded.',evidenceData:'javascript:alert(1)'},'coordinator'),/Invalid or oversized/);
 const next=d.transitionCase(c.id,'add_follow_up',{note:'Fictional follow-up was recorded.',evidenceData:image},'coordinator');
 assert.equal(next.events.at(-1).evidenceData,image);
 assert.ok(!Object.hasOwn(d.publicCase(next).events.at(-1),'evidenceData')); // Follow-up evidence is internal by default.
});
