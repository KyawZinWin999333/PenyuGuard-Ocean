import {sha256Hex} from './checksum.js';
/* Explainable, browser-local accountability. No AI diagnosis, real dispatch or signed identity. */
const stageOwners={submitted:['reviewer','Reviewer'],under_review:['reviewer','Reviewer'],needs_information:['reporter','Reporter'],verified:['coordinator','Coordinator'],assigned:['coordinator','Coordinator'],in_progress:['coordinator','Coordinator'],follow_up_recorded:['coordinator','Coordinator'],closed:['none','No pending action']};
export function caseAccountability(c,now=Date.now()){
 let [owner,ownerLabel]=stageOwners[c.status]||['reviewer','Reviewer'];
 if(c.status==='needs_information'&&c.informationRequest?.answeredAt){owner='reviewer';ownerLabel='Reviewer';}
 const latest=c.events.at(-1)?.occurredAt||c.createdAt;
 const waitingHours=c.status==='closed'?0:Math.max(0,(Number(now)-Date.parse(latest))/3600000);
 const types=new Set(c.events.map(e=>e.type));
 const stages={submitted:types.has('submitted'),reviewed:types.has('review_start')||types.has('start_review'),verified:types.has('verified')||types.has('verify'),assigned:types.has('assigned')||types.has('assign_task'),followUp:types.has('follow_up')||types.has('add_follow_up'),closed:c.status==='closed'};
 const issues=[];
 if(stages.assigned&&!stages.verified)issues.push('Assignment has no recorded verification.');
 if(stages.followUp&&!stages.assigned)issues.push('Follow-up has no recorded assignment.');
 const earlyClosure=['unsubstantiated','duplicate'].includes(c.disposition);
 if(stages.closed&&!earlyClosure&&!stages.followUp)issues.push('Operational closure has no recorded follow-up.');
 if(c.events.some((e,i)=>i>0&&Date.parse(e.occurredAt)<Date.parse(c.events[i-1].occurredAt)))issues.push('Event chronology is out of order.');
 return {owner,ownerLabel,waitingSince:c.status==='closed'?null:latest,waitingHours:Number(waitingHours.toFixed(2)),recordedStages:stages,consistency:{passed:issues.length===0,issues},scope:'Fictional local case workflow; waiting age is not an emergency priority or service promise.'};
}
export function monthlyCounts(cases,locale='en'){
 const counts=new Map();
 const parts=new Intl.DateTimeFormat('en-US',{year:'numeric',month:'2-digit',timeZone:'Asia/Kuala_Lumpur'});
 for(const c of cases){const d=new Date(c.createdAt);if(!Number.isFinite(d.getTime()))continue;const fields=Object.fromEntries(parts.formatToParts(d).map(x=>[x.type,x.value]));const key=`${fields.year}-${fields.month}`;counts.set(key,(counts.get(key)||0)+1);}
 return [...counts].sort(([a],[b])=>a.localeCompare(b)).map(([key,count])=>({key,count,label:new Intl.DateTimeFormat(locale==='ms'?'ms-MY':'en-MY',{month:'short',year:'numeric',timeZone:'Asia/Kuala_Lumpur'}).format(new Date(key+'-01T04:00:00Z'))}));
}
export function canonicalJSON(value){
 if(value===null||typeof value!=='object')return JSON.stringify(value);
 if(Array.isArray(value))return '['+value.map(canonicalJSON).join(',')+']';
 return '{'+Object.keys(value).sort().filter(key=>value[key]!==undefined).map(key=>JSON.stringify(key)+':'+canonicalJSON(value[key])).join(',')+'}';
}
export async function receiptDigest(payload){
 const bytes=new TextEncoder().encode(canonicalJSON(payload));
 if(!globalThis.crypto?.subtle)return sha256Hex(bytes);
 const digest=await globalThis.crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(digest)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
export async function createReceipt(publicRecord,disclaimer,now=Date.now()){
 const payload={...publicRecord,accountability:caseAccountability(publicRecord,now),disclaimer,exportedAt:new Date(now).toISOString()};
 return {...payload,integrity:{algorithm:'SHA-256',canonicalization:'Recursive sorted object keys; JSON values; arrays preserve order',digest:await receiptDigest(payload),scope:'All top-level fields except integrity',note:'Detects accidental changes when the original digest is retained. This is not a digital signature, proof of identity, proof of rescue, or protection against an attacker recomputing the digest.'}};
}
export async function verifyReceipt(receipt){const {integrity,...payload}=receipt;return integrity?.algorithm==='SHA-256'&&integrity.digest===await receiptDigest(payload);}
