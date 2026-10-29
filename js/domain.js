/* PenyuGuard — single-device academic demo domain and persistence. No live service. */
export const VERSION=3;
export const CATEGORIES={boat_collision:'Suspected boat collision',entanglement:'Fishing line / net entanglement',stranding:'Stranded turtle',suspected_injury:'Visible injury / unusual behavior',marine_debris:'Marine debris concern',nesting_disturbance:'Nesting-area disturbance',other_unknown:'Other / Unsure'};
export const CATEGORY_ICONS={boat_collision:'ship',entanglement:'waves',stranding:'alert',suspected_injury:'heart',marine_debris:'leaf',nesting_disturbance:'shield',other_unknown:'help'};
export const ZONES=['Perhentian Kecil — General Coast','Perhentian Besar — General Coast','General Snorkeling Area','Offshore Waters','Unknown / Prefer not to say'];
export const STATUS={submitted:'Awaiting Review',under_review:'Under Review',needs_information:'Needs Information',verified:'Verified for Follow-up',assigned:'Assigned',in_progress:'Response in Progress',follow_up_recorded:'Follow-up Recorded',closed:'Closed'};
export const DISPOSITIONS={response_completed:'Response Completed (Demo)',referred_to_authority:'Referred to Authority (Demo)',unable_to_locate:'Unable to Locate',duplicate:'Duplicate Report',unsubstantiated:'Unsubstantiated Observation',other_documented_outcome:'Other Documented Outcome'};
export const TEAMS=[{id:'team-shore',name:'Coastal Observation Team (Fictional)'},{id:'team-field',name:'Marine Field Review Team (Fictional)'},{id:'team-liaison',name:'Authority Liaison Team (Fictional)'}];
const KEY='penyuguard:v3'; const ROLE='penyuguard:demo-role';
const ago=(days,hours=0)=>new Date(Date.now()-(days*24+hours)*3600000).toISOString();
const newId=()=>globalThis.crypto?.randomUUID?.()||`id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
function makeEvent(id,time,type,role,title,summary,internalNote=''){return {id:newId(),caseId:id,occurredAt:time,type,actorRole:role,title,publicSummary:summary,internalNote};}
const records=[
 ['entanglement','General Snorkeling Area','Fishing line seen near a turtle’s rear flipper. Observation from a distance; condition unverified.','closed',14,'referred_to_authority'],
 ['boat_collision','Offshore Waters','A turtle was observed swimming unusually near passing boats. No collision was directly witnessed.','submitted',1],
 ['marine_debris','Perhentian Kecil — General Coast','Floating discarded fishing material near the shoreline; no animal interaction confirmed.','under_review',2],
 ['stranding','Perhentian Besar — General Coast','An animal appeared stationary in very shallow water during the observation.','verified',3],
 ['nesting_disturbance','Perhentian Besar — General Coast','Visitor activity near a generalized shoreline area; nesting not confirmed.','needs_information',4],
 ['suspected_injury','General Snorkeling Area','Possible scarring visible from a distance. No independent health assessment.','assigned',5],
 ['entanglement','Offshore Waters','Loose line in the water near a moving turtle; possible contact uncertain.','in_progress',6],
 ['other_unknown','Unknown / Prefer not to say','Brief observation; insufficient information to determine the concern.','closed',8,'unsubstantiated'],
 ['marine_debris','Perhentian Kecil — General Coast','Plastic packaging and rope fragments reported in surface water.','follow_up_recorded',7],
 ['stranding','General Snorkeling Area','A motionless turtle was observed briefly, but subsequent location could not be established.','closed',11,'unable_to_locate']
];
function seed(){const cases=records.map((r,i)=>{const id=`PG-2026-${String(i+1).padStart(4,'0')}`,time=ago(r[4]),cat=r[0],status=r[3],events=[makeEvent(id,time,'submitted','reporter','Observation submitted','Community observation received; awaiting human review.')];const c={id,createdAt:time,observedAt:time,category:cat,status,publicZone:r[1],privateLocationNote:'',observedConditions:['Observed from a safe distance'],description:r[2],evidenceData:'',reviewDecision:'',reviewedAt:'',duplicateOfCaseId:'',assignedTaskIds:[],events,disposition:r[5]||'',isSeed:true};
 if(!['submitted'].includes(status)){let t=new Date(Date.parse(time)+2*3600000).toISOString();c.events.push(makeEvent(id,t,'review_start','reviewer','Review started','A fictional conservation reviewer began assessing the observation.'));if(status==='needs_information'){c.reviewDecision='needs_information';c.reviewedAt=t;c.informationRequest={id:newId(),question:'What did you observe from a safe distance? Do not provide exact nesting locations.',askedAt:t,answeredAt:''};c.events.push(makeEvent(id,new Date(Date.parse(t)+900000).toISOString(),'request_info','reviewer','More information requested','Further observation details are needed before verification.'));}else if(status==='under_review'){}else if(status==='closed'&&r[5]==='unsubstantiated'){c.reviewDecision='unsubstantiated';c.reviewedAt=t;c.events.push(makeEvent(id,new Date(Date.parse(t)+900000).toISOString(),'closed','reviewer','Case closed','Observation could not be substantiated.'));}else {c.reviewDecision='verified';c.reviewedAt=t;c.events.push(makeEvent(id,new Date(Date.parse(t)+900000).toISOString(),'verified','reviewer','Verified for follow-up','Human review determined that further documentation or referral is appropriate.'));}}
 if(['assigned','in_progress','follow_up_recorded','closed'].includes(status)&&r[5]!=='unsubstantiated'){const t=new Date(Date.parse(time)+4*3600000).toISOString();const taskId=`TASK-${String(i+1).padStart(4,'0')}`;c.assignedTaskIds.push(taskId);c.events.push(makeEvent(id,t,'assigned','coordinator','Response task assigned','A fictional follow-up task was assigned.'));if(['in_progress','follow_up_recorded','closed'].includes(status)){c.events.push(makeEvent(id,new Date(Date.parse(t)+3600000).toISOString(),'task_started','coordinator','Follow-up started','Fictional field follow-up was initiated.'));}if(['follow_up_recorded','closed'].includes(status)){c.events.push(makeEvent(id,new Date(Date.parse(t)+7200000).toISOString(),'follow_up','coordinator','Follow-up recorded','A simulated observation / referral note was documented.'));}if(status==='closed'){c.events.push(makeEvent(id,new Date(Date.parse(t)+10800000).toISOString(),'closed','coordinator','Case closed',`Documented disposition: ${DISPOSITIONS[r[5]]||'Other outcome'}.`));}}
 return c;});const tasks=cases.flatMap(c=>c.assignedTaskIds.map(id=>({id,caseId:c.id,assignedTeamId:'team-field',actionType:'Document observation / referral',status:c.status==='assigned'?'assigned':c.status==='in_progress'?'in_progress':c.status==='follow_up_recorded'?'follow_up_recorded':'completed',createdAt:c.events.find(x=>x.type==='assigned')?.occurredAt||c.createdAt,outcomeNote:c.status==='closed'?'Simulated field documentation recorded.':'',completedAt:c.status==='closed'?c.events.at(-1).occurredAt:''})));return {version:VERSION,cases,tasks,nextSequence:11,demoCaseId:null,createdAt:new Date().toISOString()};}
let state, persistedRaw=null, storageWarning='', corruptStorage=false;
function validState(value){
 if(!value||value.version!==VERSION||!Array.isArray(value.cases)||!Array.isArray(value.tasks)||!Number.isSafeInteger(value.nextSequence)||value.nextSequence<1)return false;
 const ids=new Set();
 for(const c of value.cases){
  if(!c||typeof c.id!=='string'||!/^PG-\d{4}-\d+$/.test(c.id)||ids.has(c.id)||!Object.hasOwn(CATEGORIES,c.category)||!Object.hasOwn(STATUS,c.status)||!ZONES.includes(c.publicZone)||typeof c.description!=='string'||!Number.isFinite(Date.parse(c.createdAt))||!Number.isFinite(Date.parse(c.observedAt))||!Array.isArray(c.events)||!Array.isArray(c.observedConditions)||!Array.isArray(c.assignedTaskIds))return false;
  ids.add(c.id);
  if(!c.events.every(e=>e&&typeof e.title==='string'&&typeof e.publicSummary==='string'&&typeof e.type==='string'&&typeof e.actorRole==='string'&&e.caseId===c.id&&Number.isFinite(Date.parse(e.occurredAt))))return false;
 }
 return value.tasks.every(t=>t&&typeof t.id==='string'&&ids.has(t.caseId)&&typeof t.status==='string');
}
function decode(raw){const parsed=JSON.parse(raw);if(!validState(parsed))throw Error('Invalid stored cases');for(const c of parsed.cases){if(c.status==='needs_information'&&!c.informationRequest){const request=c.events.filter(e=>e.type==='request_info').at(-1);c.informationRequest={id:newId(),question:'Please add any further observation details you already have, without approaching wildlife or sharing exact locations.',askedAt:request?.occurredAt||c.createdAt,answeredAt:''};}}return parsed;}
function load(){
 try{
  persistedRaw=localStorage.getItem(KEY);
  if(persistedRaw!==null)return decode(persistedRaw);
  const initial=seed(),raw=JSON.stringify(initial);localStorage.setItem(KEY,raw);persistedRaw=raw;return initial;
 }catch{
  corruptStorage=persistedRaw!==null;
  storageWarning=corruptStorage?'Stored demo data could not be read. The original data is preserved; use Reset Demo to recover.':'Browser storage is unavailable. Reports cannot be saved.';
  return seed();
 }
}
state=load();
function commit(next,{recover=false}={}){
 if(corruptStorage&&!recover)throw Error('Stored demo data could not be read. The original data is preserved; use Reset Demo to recover.');
 let current;
 try{current=localStorage.getItem(KEY);}catch{throw Error('Browser storage is unavailable. Reports cannot be saved.');}
 if(current!==persistedRaw){
  try{state=current===null?seed():decode(current);persistedRaw=current;}catch{corruptStorage=true;}
  throw Error('Another tab changed this case data. Review the latest record and try again. Your typed notes have been kept.');
 }
 const raw=JSON.stringify(next);
 try{
  if(recover&&corruptStorage&&current!==null)localStorage.setItem(KEY+':recovery-backup',current);
  localStorage.setItem(KEY,raw);
 }catch{
  storageWarning='Save failed: browser storage is unavailable or full. No case changes were applied. Your typed notes have been kept.';
  throw Error(storageWarning);
 }
 state=next;persistedRaw=raw;corruptStorage=false;storageWarning='';window.dispatchEvent(new CustomEvent('pg:change'));
}
// All app mutations take this origin-wide lock on browsers supporting Web Locks.
// The synchronous APIs also reject stale snapshots. No cross-device/backend locking is claimed.
export async function withStorageLock(operation){
 if(globalThis.navigator?.locks?.request)return navigator.locks.request('penyuguard:v3:write',operation);
 return operation();
}
window.addEventListener('storage',event=>{
 if(event.key!==KEY&&event.key!==null)return;
 try{const raw=localStorage.getItem(KEY);if(raw===persistedRaw)return;const next=raw===null?seed():decode(raw);state=next;persistedRaw=raw;corruptStorage=false;storageWarning='';window.dispatchEvent(new CustomEvent('pg:change'));}
 catch{storageWarning='Stored demo data could not be read. The original data is preserved; use Reset Demo to recover.';}
});
export function getStorageWarning(){return storageWarning;}
export function getState(){return state;}
export function getCase(id){return state.cases.find(x=>x.id===id)||null;}
export function getTaskForCase(id){return state.tasks.find(x=>x.caseId===id)||null;}
export function getRole(){try{return sessionStorage.getItem(ROLE)||'reporter';}catch{return 'reporter';}}
export function setRole(role){if(!['reporter','reviewer','coordinator'].includes(role))return;try{sessionStorage.setItem(ROLE,role);}catch{}window.dispatchEvent(new CustomEvent('pg:change'));}
export function reset(){commit(seed(),{recover:true});setRole('reporter');try{sessionStorage.removeItem('pg:demo-draft');}catch{}}
export function setDemoCaseId(id){commit({...state,demoCaseId:id});}
export function saveDraft(d){try{sessionStorage.setItem('pg:demo-draft',JSON.stringify(d));}catch{}}
export function loadDraft(){try{return JSON.parse(sessionStorage.getItem('pg:demo-draft')||'null');}catch{return null;}}
export function clearDraft(){try{sessionStorage.removeItem('pg:demo-draft');}catch{}}
export function createReport(input){if(!Object.hasOwn(CATEGORIES,input.category))throw Error('Select a valid incident type.');if(!ZONES.includes(input.publicZone))throw Error('Select a reporting zone.');if(!input.description||input.description.trim().length<15)throw Error('Please provide at least 15 characters of observation details.');if(input.evidenceData&&(!/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(input.evidenceData)||input.evidenceData.length>550000))throw Error('Invalid or oversized observation photograph.');const sequence=Math.max(11,Number(state.nextSequence)||11,...state.cases.map(c=>Number(c.id.split('-').at(-1))+1).filter(Number.isFinite));const id=`PG-${new Date().getFullYear()}-${String(sequence).padStart(4,'0')}`;const now=new Date().toISOString();const observedAt=input.observedAt||now;const observedMs=Date.parse(observedAt);if(!Number.isFinite(observedMs)||observedMs>Date.now()+120000)throw Error('Enter a valid observation time that is not in the future.');if(!input.ack)throw Error('Acknowledge wildlife safety guidance before submission.');const c={id,createdAt:now,observedAt:observedAt,category:input.category,status:'submitted',publicZone:input.publicZone,privateLocationNote:(input.privateLocationNote||'').trim().slice(0,200),observedConditions:input.observedConditions||[],description:input.description.trim().slice(0,1200),evidenceData:input.evidenceData||'',reviewDecision:'',reviewedAt:'',duplicateOfCaseId:'',assignedTaskIds:[],events:[makeEvent(id,now,'submitted','reporter','Observation submitted','A community observation was submitted and is awaiting human review.')],disposition:'',isSeed:false};commit({...state,cases:[c,...state.cases],nextSequence:sequence+1,demoCaseId:input.fromDemo?id:state.demoCaseId});clearDraft();return c;}
function assert(cond,message){if(!cond)throw Error(message);}
export function transitionCase(id,action,payload={},actor=getRole()){
 const c=getCase(id);assert(c,'Case not found.');const next=structuredClone(state);const x=next.cases.find(a=>a.id===id);const now=new Date().toISOString();let title='',summary='',note=(payload.note||'').trim().slice(0,500),type=action;
 const isReviewer=actor==='reviewer',isCoordinator=actor==='coordinator';
 assert(['reporter','reviewer','coordinator'].includes(actor),'Unknown demonstration role.');
 switch(action){
 case 'start_review':assert(isReviewer,'Switch to Reviewer demo role.');assert(['submitted','needs_information'].includes(x.status),'This case is not awaiting review.');if(x.status==='needs_information')assert(x.informationRequest?.answeredAt,'A reporter clarification is needed before resuming review.');x.status='under_review';title='Review started';summary='A reviewer began evaluating the observation.';break;
 case 'verify':assert(isReviewer,'Switch to Reviewer demo role.');assert(x.status==='under_review','Begin review before making a decision.');assert(note.length>=8,'Enter a short verification rationale (at least 8 characters).');x.status='verified';x.reviewDecision='verified';x.reviewedAt=now;title='Verified for follow-up';summary='Human review determined that follow-up is appropriate; the observation is not a medical diagnosis.';break;
 case 'request_info':assert(isReviewer,'Switch to Reviewer demo role.');assert(x.status==='under_review','Begin review first.');assert(note.length>=8,'Add the details you need.');{const question=(payload.question||'').trim();assert(question.length>=10&&question.length<=1000,'Enter a public-safe clarification question (10–1000 characters).');x.informationRequest={id:newId(),question,askedAt:now,answeredAt:''};}x.status='needs_information';x.reviewDecision='needs_information';x.reviewedAt=now;title='More information requested';summary='Additional information is needed before a verification decision.';break;
 case 'reporter_reply':assert(actor==='reporter','Switch to Reporter demo role.');assert(x.status==='needs_information'&&x.informationRequest&&!x.informationRequest.answeredAt,'There is no unanswered clarification request.');{const reply=(payload.reply||'').trim();assert(reply.length>=10&&reply.length<=2000,'Enter a clarification reply (10–2000 characters).');x.informationRequest.answeredAt=now;title='Reporter clarification received';summary=reply;note='';}break;
 case 'close_unsubstantiated':case 'close_duplicate':assert(isReviewer,'Switch to Reviewer demo role.');assert(x.status==='under_review','Begin review first.');assert(note.length>=8,'Enter a rationale for this closure.');if(action==='close_duplicate'){assert(payload.duplicateOfCaseId&&getCase(payload.duplicateOfCaseId)&&payload.duplicateOfCaseId!==id,'Choose an existing different case reference.');let target=getCase(payload.duplicateOfCaseId);const seen=new Set([id]);while(target){assert(!seen.has(target.id),'Duplicate references cannot form a cycle.');seen.add(target.id);target=target.duplicateOfCaseId?getCase(target.duplicateOfCaseId):null;}x.duplicateOfCaseId=payload.duplicateOfCaseId;}x.status='closed';x.reviewDecision=action==='close_duplicate'?'duplicate':'unsubstantiated';x.disposition=action==='close_duplicate'?'duplicate':'unsubstantiated';x.reviewedAt=now;title=action==='close_duplicate'?'Closed as possible duplicate (reviewer confirmed)':'Closed as unsubstantiated';summary=action==='close_duplicate'?`Reviewer documented this report as a duplicate of ${x.duplicateOfCaseId}.`:'The submitted observation could not be substantiated.';break;
 case 'assign_task':assert(isCoordinator||isReviewer,'Switch to Reviewer or Coordinator demo role.');assert(x.status==='verified','Only verified cases can be assigned.');assert(TEAMS.some(t=>t.id===payload.teamId),'Select a fictional response team.');{const tid=`TASK-${newId().replace(/[^a-z0-9]/gi,'').slice(-12).toUpperCase()}`;next.tasks.push({id:tid,caseId:id,assignedTeamId:payload.teamId,actionType:payload.actionType||'Observation follow-up',status:'assigned',createdAt:now,outcomeNote:'',completedAt:''});x.assignedTaskIds.push(tid);}x.status='assigned';title='Response task assigned';summary='A fictional authorized response team was assigned a follow-up task.';break;
 case 'start_task':assert(isCoordinator,'Switch to Coordinator demo role.');assert(x.status==='assigned','A task must be assigned before it can begin.');{const t=next.tasks.find(t=>t.caseId===id&&t.status==='assigned');assert(t,'Assigned task not found.');t.status='in_progress';}x.status='in_progress';title='Task in progress';summary='A simulated field follow-up was started.';break;
 case 'add_follow_up':assert(isCoordinator,'Switch to Coordinator demo role.');assert(x.status==='in_progress','Start the task before adding follow-up.');assert(note.length>=8,'Describe the fictional follow-up (at least 8 characters).');assert(!payload.evidenceData||(/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(payload.evidenceData)&&payload.evidenceData.length<=550000),'Invalid or oversized follow-up evidence.');{const t=next.tasks.find(t=>t.caseId===id&&t.status==='in_progress');assert(t,'In-progress task not found.');t.status='follow_up_recorded';t.outcomeNote=note;}x.status='follow_up_recorded';title='Follow-up recorded';summary='A simulated follow-up was documented for review.';break;
 case 'close_case':assert(isCoordinator,'Switch to Coordinator demo role.');assert(x.status==='follow_up_recorded','Record a follow-up before closing this case.');assert(['response_completed','referred_to_authority','unable_to_locate','other_documented_outcome'].includes(payload.disposition),'Select a valid documented outcome.');assert(note.length>=8,'Enter a closure rationale (at least 8 characters).');{const t=next.tasks.find(t=>t.caseId===id&&t.status==='follow_up_recorded');assert(t,'Follow-up task not found.');t.status='completed';t.completedAt=now;}x.status='closed';x.disposition=payload.disposition;title='Case closed';summary=`Documented fictional outcome: ${DISPOSITIONS[x.disposition]}.`;break;
 default:throw Error('Unsupported case action.');
 }
 x.events.push(makeEvent(id,now,type,actor,title,summary,note));if(action==='add_follow_up'&&payload.evidenceData)x.events.at(-1).evidenceData=payload.evidenceData;commit(next);return x;
}
export function completeness(c){const missing=[];if(c.description.trim().length<45)missing.push('More detailed observation notes');if(c.publicZone.startsWith('Unknown'))missing.push('General area, if known');if(!c.evidenceData)missing.push('Optional supporting photograph');if(!c.observedConditions?.length)missing.push('Observed animal condition');return {score:Math.round((4-missing.length)/4*100),missing};}
export function triage(c){const urgent=['entanglement','boat_collision','stranding','suspected_injury'].includes(c.category);const missing=completeness(c).missing;return {priority:urgent?'Prompt review suggested':missing.length>=3?'Information incomplete':'Routine review',reason:urgent?`Because the observer selected ${CATEGORIES[c.category].toLowerCase()}. This is not an emergency diagnosis.`:missing.length>=3?'Some recommended observation details are missing.':'Review according to normal workflow.',missing};}
export function possibleDuplicates(c){const time=Date.parse(c.observedAt);return state.cases.filter(q=>q.id!==c.id&&q.category===c.category&&q.publicZone===c.publicZone&&Math.abs(Date.parse(q.observedAt)-time)<=6*3600000).slice(0,3);}
export function metrics(){const cs=state.cases;const tasks=state.tasks;const reviewed=cs.filter(c=>!!c.reviewedAt);const active=tasks.filter(t=>t.status!=='completed');const deltas=reviewed.map(c=>Date.parse(c.events.find(e=>['request_info','verified','verify','close_unsubstantiated','close_duplicate'].includes(e.type))?.occurredAt||c.reviewedAt)-Date.parse(c.createdAt)).filter(x=>x>=0).sort((a,b)=>a-b);const middle=deltas.length?(deltas.length%2?deltas[(deltas.length-1)/2]:(deltas[deltas.length/2-1]+deltas[deltas.length/2])/2)/3600000:null;return {total:cs.length,awaiting:cs.filter(c=>c.status==='submitted'||c.status==='under_review').length,needsInfo:cs.filter(c=>c.status==='needs_information').length,verified:cs.filter(c=>c.reviewDecision==='verified').length,closed:cs.filter(c=>c.status==='closed').length,activeTasks:active.length,medianHours:middle,reviewed:reviewed.length};}
export function publicCase(c){if(!c)return null;return {id:c.id,createdAt:c.createdAt,observedAt:c.observedAt,category:c.category,status:c.status,publicZone:c.publicZone,observedConditions:c.observedConditions,description:c.description,evidenceData:c.evidenceData,reviewDecision:c.reviewDecision,disposition:c.disposition,informationRequest:c.informationRequest?{question:c.informationRequest.question,askedAt:c.informationRequest.askedAt,answeredAt:c.informationRequest.answeredAt}:null,events:c.events.map(e=>({occurredAt:e.occurredAt,actorRole:e.actorRole,title:e.title,publicSummary:e.publicSummary,type:e.type}))};}
