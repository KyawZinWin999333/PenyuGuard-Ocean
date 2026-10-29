from playwright.sync_api import sync_playwright
from pathlib import Path
import re,base64,json
root=Path(__file__).resolve().parent.parent
exports={
 'domain':['VERSION','CATEGORIES','CATEGORY_ICONS','ZONES','STATUS','DISPOSITIONS','TEAMS','getState','getCase','getTaskForCase','getRole','setRole','reset','setDemoCaseId','saveDraft','loadDraft','clearDraft','createReport','transitionCase','completeness','triage','possibleDuplicates','metrics','publicCase','getStorageWarning'],
 'i18n':['getLocale','setLocale','translateText','translateSubtree','translateMessage','translations'], 'icons':['icon'], 'visuals':['PHOTOS','photo'], 'cinematic':['HERO_STORIES','cinematicHero','startCinematicExperience']}
js='window.__pgModules = {};\n'
for name in ['i18n','domain','icons','visuals','cinematic','app']:
 code=(root/'js'/f'{name}.js').read_text()
 code=re.sub(r'^import .*?;\s*','',code,flags=re.M)
 code=re.sub(r'\bexport (?=(?:const|function|let|class)\b)','',code)
 code=code.replace('location.origin','"http://localhost"')
 deps={'cinematic':"const {photo}=window.__pgModules.visuals;const {translateText}=window.__pgModules.i18n;\n",'app':"const {"+','.join(exports['domain'])+"}=window.__pgModules.domain;const {icon}=window.__pgModules.icons;const {photo}=window.__pgModules.visuals;const {cinematicHero,startCinematicExperience}=window.__pgModules.cinematic;const {getLocale,setLocale,translateText,translateSubtree}=window.__pgModules.i18n;\n"}.get(name,'')
 trailer=(f"window.__pgModules.{name}={{"+','.join(exports[name])+"};") if name!='app' else ''
 js+=f'\n//-- {name}\n(function(){{{deps}\n{code}\n{trailer}\n}})();\n'
# avoid background video broken media locally by replacing src, but keep original poster image
js=js.replace('assets/video/sea-turtle-original-qhd.mp4','data:video/mp4;base64,')
for f in sorted((root/'assets/photos').glob('*.jpg')):
 js=js.replace('assets/photos/'+f.name,'data:image/jpeg;base64,'+base64.b64encode(f.read_bytes()).decode())
poster=root/'assets/video/ocean-film-poster.jpg'
js=js.replace('assets/video/ocean-film-poster.jpg','data:image/jpeg;base64,'+base64.b64encode(poster.read_bytes()).decode())
# Generated only in-memory; do not write bundled source in the project
css='\n'.join((root/f).read_text() for f in ['styles.css','premium.css','cinematic.css'])
# replace photo references with real user-video frames encoded in test-only in-memory rendering
for f in sorted((root/'assets/photos').glob('*.jpg')):
 css+=f'\n/* {f.name} screenshot asset */\n'
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage'])
 page=browser.new_page(viewport={'width':1440,'height':900})
 page.set_content('<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="app"></div></body></html>')
 page.evaluate("""() => {const db={}; Object.defineProperty(window,'localStorage',{value:{getItem:k=>db[k]??null,setItem:(k,v)=>db[k]=String(v),removeItem:k=>delete db[k]}}); const ss={};Object.defineProperty(window,'sessionStorage',{value:{getItem:k=>ss[k]??null,setItem:(k,v)=>ss[k]=String(v),removeItem:k=>delete ss[k]}});location.hash='#/';}""")
 page.add_style_tag(content=css)
 page.add_script_tag(content=js)
 page.wait_for_timeout(100)
 def texts():
  return page.evaluate("""() => {let w=document.createTreeWalker(document.querySelector('#app'),NodeFilter.SHOW_TEXT);let a=[];while(w.nextNode()){let n=w.currentNode;if(n.parentElement.closest('script,style,textarea'))continue;let s=n.nodeValue.trim().replace(/\s+/g,' ');if(s)a.push(s)}return a;}""")
 def go(route):
  page.evaluate('r=>location.hash="#"+r',route);page.wait_for_timeout(80)
 missing={}
 for role,route in [('reporter','/'),('reporter','/report'),('reporter','/track'),('reporter','/passport/PG-2026-0001'),('reporter','/insights'),('reporter','/demo'),('reviewer','/review?case=PG-2026-0002'),('reviewer','/passport/PG-2026-0001'),('coordinator','/response?case=PG-2026-0004'),('reporter','/print/PG-2026-0001')]:
  page.evaluate('r=>window.__pgModules.domain.setRole(r)',role)
  page.evaluate("window.__pgModules.i18n.setLocale('en')")
  go(route)
  en=texts()
  page.evaluate("window.__pgModules.i18n.setLocale('ms')")
  ms=texts()
  unchanged=[v for v,b in zip(en,ms) if v==b and len(v)>3 and any(ch.isalpha() for ch in v)]
  missing[route]=unchanged
 print('AUDIT UNCHANGED',flush=True)
 for route,items in missing.items():
  print('ROUTE',route,'\n', '\n'.join(' - '+v for v in items[:90]),'\nCOUNT',len(items),flush=True)
 browser.close()
