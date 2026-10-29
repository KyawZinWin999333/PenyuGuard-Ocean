import {test} from 'node:test';
import assert from 'node:assert/strict';
class Mem{constructor(){this.d={}}getItem(k){return this.d[k]??null}setItem(k,v){this.d[k]=String(v)}removeItem(k){delete this.d[k]}}
globalThis.localStorage=new Mem();globalThis.sessionStorage=new Mem();
const app={innerHTML:''};globalThis.document={querySelector:s=>s==='#app'?app:null, title:'',addEventListener(){},body:{appendChild(){}}};
globalThis.window=new EventTarget();globalThis.location={origin:'http://localhost:5173',hash:'#/',pathname:'/',search:''};globalThis.history={replaceState(){}};
await import('../js/app.js');
const domain=await import('../js/domain.js');
function renderRoute(route,role='reporter'){domain.setRole(role);location.hash='#'+route;window.dispatchEvent(new Event('pg:change'));return app.innerHTML;}
test('renders all major pages without exceptions',()=>{
 const routes=['/','/report','/track','/review','/response','/insights','/demo','/passport/PG-2026-0001','/report/success/PG-2026-0001','/print/PG-2026-0001'];
 for(const route of routes){const html=renderRoute(route,route==='/review'?'reviewer':route==='/response'?'coordinator':'reporter');assert.ok(html.includes('PenyuGuard'),`No layout for ${route}`);assert.ok(html.length>1000,`Unexpectedly short output for ${route}`);}
});
test('public passport omits private location and internal reviewer notes',()=>{
 const c=domain.createReport({category:'entanglement',publicZone:domain.ZONES[2],observedAt:new Date().toISOString(),description:'Fictional public report with safe details and no coordinates.',privateLocationNote:'TOP SECRET PRIVATE LOCATION',observedConditions:[],ack:true});
 domain.transitionCase(c.id,'start_review',{},'reviewer');domain.transitionCase(c.id,'verify',{note:'INTERNAL ONLY RATIONALE is a private note.'},'reviewer');
 const publicHTML=renderRoute('/passport/'+c.id,'reporter');assert.ok(!publicHTML.includes('TOP SECRET PRIVATE LOCATION'));assert.ok(!publicHTML.includes('INTERNAL ONLY RATIONALE'));
 const reviewerHTML=renderRoute('/passport/'+c.id,'reviewer');assert.ok(reviewerHTML.includes('TOP SECRET PRIVATE LOCATION'));assert.ok(reviewerHTML.includes('INTERNAL ONLY RATIONALE'));
 const printHTML=renderRoute('/print/'+c.id,'reviewer');assert.ok(!printHTML.includes('TOP SECRET PRIVATE LOCATION'));assert.ok(!printHTML.includes('INTERNAL ONLY RATIONALE'));
});
test('zero-dependency render contains core interactive controls',()=>{
 const html=renderRoute('/demo','reporter');assert.match(html,/Load Demo Scenario/);assert.match(html,/Reset all local demo data/);
 const form=renderRoute('/report','reporter');assert.match(form,/data-action="select-category"/);assert.match(form,/data-action="report-next"/);
 const insights=renderRoute('/insights','reporter');assert.match(insights,/Observation categories/);assert.match(insights,/Illustrative prototype data/);
});
