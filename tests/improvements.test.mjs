import {test} from 'node:test';
import assert from 'node:assert/strict';
import {caseAccountability,monthlyCounts,canonicalJSON,createReceipt,verifyReceipt} from '../js/accountability.js';
class MemoryStore{data=new Map();fail=false;getItem(k){return this.data.get(k)??null;}setItem(k,v){if(this.fail)throw Error('Quota exceeded');this.data.set(k,String(v));}removeItem(k){this.data.delete(k);}}
globalThis.localStorage=new MemoryStore();globalThis.sessionStorage=new MemoryStore();globalThis.window=new EventTarget();
const d=await import('../js/domain.js');
const input={category:'entanglement',publicZone:d.ZONES[2],observedAt:new Date().toISOString(),description:'Fictional observation made from a safe distance without contact.',privateLocationNote:'PRIVATE LOCATION',observedConditions:[],ack:true};
const create=()=>d.createReport({...input});
test('failed saves do not change memory or persisted records',()=>{
 const before=structuredClone(d.getState()),stored=localStorage.getItem('penyuguard:v3');localStorage.fail=true;
 assert.throws(create,/Save failed/);assert.deepEqual(d.getState(),before);assert.equal(localStorage.getItem('penyuguard:v3'),stored);localStorage.fail=false;
});
test('stale second tab cannot erase a newer case',async()=>{
 const tab2=await import('../js/domain.js?stale');const first=create();
 assert.throws(()=>tab2.createReport({...input}),/Another tab/);assert.ok(d.getCase(first.id));assert.ok(tab2.getCase(first.id));
 const second=tab2.createReport({...input});assert.notEqual(second.id,first.id);
 assert.throws(create,/Another tab/);assert.ok(d.getCase(second.id));
});
test('malformed stored data is preserved until explicit reset, with backup',async()=>{
 const valid=localStorage.getItem('penyuguard:v3');const broken='{"version":3,"cases":[null]}';localStorage.setItem('penyuguard:v3',broken);
 const damaged=await import('../js/domain.js?broken');assert.match(damaged.getStorageWarning(),/could not be read/);
 assert.throws(()=>damaged.createReport({...input}),/could not be read/);assert.equal(localStorage.getItem('penyuguard:v3'),broken);
 damaged.reset();assert.equal(localStorage.getItem('penyuguard:v3:recovery-backup'),broken);assert.equal(damaged.getState().cases.length,10);
 localStorage.setItem('penyuguard:v3',valid);window.dispatchEvent(Object.assign(new Event('storage'),{key:'penyuguard:v3'}));
});
test('clarification loop keeps private rationale separate and requires a reporter reply',()=>{
 const c=create();d.transitionCase(c.id,'start_review',{},'reviewer');
 assert.throws(()=>d.transitionCase(c.id,'request_info',{note:'PRIVATE RATIONALE'},'reviewer'),/public-safe/);
 d.transitionCase(c.id,'request_info',{note:'PRIVATE RATIONALE',question:'What was observed safely without approaching?'},'reviewer');
 assert.throws(()=>d.transitionCase(c.id,'start_review',{},'reviewer'),/reporter clarification/);
 assert.throws(()=>d.transitionCase(c.id,'reporter_reply',{reply:'Detailed fictional reply.'},'reviewer'),/Reporter/);
 d.transitionCase(c.id,'reporter_reply',{reply:'Fictional fishing material was nearby; contact remained uncertain.'},'reporter');
 assert.equal(d.getCase(c.id).status,'needs_information');
 const safe=JSON.stringify(d.publicCase(d.getCase(c.id)));assert.ok(!safe.includes('PRIVATE RATIONALE'));assert.ok(!safe.includes('PRIVATE LOCATION'));assert.ok(safe.includes('contact remained uncertain'));
 assert.throws(()=>d.transitionCase(c.id,'reporter_reply',{reply:'Another reply should be rejected.'},'reporter'),/no unanswered/);
 assert.equal(caseAccountability(d.getCase(c.id)).owner,'reviewer');
 d.transitionCase(c.id,'start_review',{},'reviewer');assert.equal(d.getCase(c.id).status,'under_review');
});
test('closed unsubstantiated cases do not claim verification, assignment or follow-up',()=>{
 const c=d.getCase('PG-2026-0008'),audit=caseAccountability(c);assert.equal(audit.recordedStages.closed,true);assert.equal(audit.recordedStages.verified,false);assert.equal(audit.recordedStages.assigned,false);assert.equal(audit.recordedStages.followUp,false);assert.equal(audit.consistency.passed,true);assert.equal(audit.waitingHours,0);
});
test('accountability identifies a missing handover and negative waits never appear',()=>{
 const c={createdAt:'2026-11-01T10:00:00Z',status:'assigned',events:[{type:'assign_task',occurredAt:'2026-11-01T12:00:00Z'}]};const audit=caseAccountability(c,Date.parse('2026-11-01T11:00:00Z'));assert.equal(audit.waitingHours,0);assert.equal(audit.consistency.passed,false);assert.match(audit.consistency.issues[0],/verification/);
});
test('monthly charts sort numerically across years and Malay month names',()=>{
 const cases=['2026-11-01T01:00:00Z','2026-09-15T01:00:00Z','2027-01-01T01:00:00Z','2026-10-31T18:00:00Z','invalid'].map(createdAt=>({createdAt}));
 for(const locale of ['en','ms']){const months=monthlyCounts(cases,locale);assert.deepEqual(months.map(x=>x.key),['2026-09','2026-11','2027-01']);assert.deepEqual(months.map(x=>x.count),[1,2,1]);}
});
test('receipt checksum detects modifications, survives key reordering and omits private fields',async()=>{
 const c=create(),safe=d.publicCase(c),receipt=await createReceipt(safe,'Fictional demo',Date.parse('2026-11-05T03:00:00Z'));
 assert.equal(await verifyReceipt(receipt),true);assert.equal(receipt.integrity.digest.length,64);assert.ok(!JSON.stringify(receipt).includes('PRIVATE LOCATION'));
 const reordered=Object.fromEntries(Object.entries(receipt).reverse());assert.equal(await verifyReceipt(reordered),true);
 const tampered=structuredClone(receipt);tampered.status='closed';assert.equal(await verifyReceipt(tampered),false);
 const changed=structuredClone(receipt);changed.events[0].publicSummary='Altered summary';assert.equal(await verifyReceipt(changed),false);
 assert.equal(canonicalJSON({b:2,a:[3,1]}),'{"a":[3,1],"b":2}');
});
test('duplicate closures cannot create circular references',()=>{
 const a=create(),b=create();d.transitionCase(a.id,'start_review',{},'reviewer');d.transitionCase(a.id,'close_duplicate',{note:'Same fictional observation.',duplicateOfCaseId:b.id},'reviewer');d.transitionCase(b.id,'start_review',{},'reviewer');assert.throws(()=>d.transitionCase(b.id,'close_duplicate',{note:'This would make a cycle.',duplicateOfCaseId:a.id},'reviewer'),/cycle/);
});
test('legacy needs-information cases get a generic question without copying private notes',async()=>{
 const raw=JSON.parse(localStorage.getItem('penyuguard:v3'));const c=raw.cases.find(c=>c.status==='needs_information');delete c.informationRequest;c.events.at(-1).internalNote='LEGACY PRIVATE REVIEW NOTE';localStorage.setItem('penyuguard:v3',JSON.stringify(raw));
 const legacy=await import('../js/domain.js?legacy');const loaded=legacy.getCase(c.id);assert.match(loaded.informationRequest.question,/further observation/);assert.ok(!JSON.stringify(legacy.publicCase(loaded)).includes('LEGACY PRIVATE'));window.dispatchEvent(Object.assign(new Event('storage'),{key:'penyuguard:v3'}));
});
test('UI mutation wrapper uses the browser-wide exclusive write lock when available',async()=>{
 const prior=Object.getOwnPropertyDescriptor(globalThis,'navigator');let lockName='';Object.defineProperty(globalThis,'navigator',{configurable:true,value:{locks:{request:async(name,fn)=>{lockName=name;return fn();}}}});
 try{assert.equal(await d.withStorageLock(()=>42),42);assert.equal(lockName,'penyuguard:v3:write');}finally{if(prior)Object.defineProperty(globalThis,'navigator',prior);else delete globalThis.navigator;}
});
