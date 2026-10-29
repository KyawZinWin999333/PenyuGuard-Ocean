import {translateText} from './i18n.js';
import {photo} from './visuals.js';

/** Carefully scoped storytelling motion. Application domain state is never modified here. */
export const HERO_STORIES = [
  {key:'gallery2',eyebrow:'01 / A LIFE BENEATH THE SURFACE',title:'A world worth protecting.',short:'A world worth protecting',description:'A turtle sighting is more than a moment. It can become the first step in a clear, traceable conservation record.',imagePosition:'center 46%'},
  {key:'gallery3',eyebrow:'02 / OCEAN HABITATS',title:'The ocean is part of the story.',short:'The ocean is part of the story',description:'Marine habitats deserve responsible observation, safe reporting, and respect for sensitive environments.',imagePosition:'center 58%'},
  {key:'gallery5',eyebrow:'03 / THE TURTLE RESCUE PASSPORT',title:'Every observation has a journey.',short:'Every observation has a journey',description:'One unique case. Every human review, task, follow-up and outcome connected in a single meaningful record.',imagePosition:'center 55%'},
  {key:'gallery4',eyebrow:'04 / CONSERVATION, CONNECTED',title:'From concern to clarity.',short:'From concern to clarity',description:'Turn community observations into careful evidence and transparent conservation coordination.',imagePosition:'center 50%'},
  {key:'gallery1',eyebrow:'05 / A BETTER WAY TO RESPOND',title:'Care begins with attention.',short:'Care begins with attention',description:'Not automatic diagnosis. Not pretend rescue. Just thoughtful reporting and accountable human-led follow-through.',imagePosition:'center 46%'}
];

export function cinematicHero(sampleId='PG-2026-0001'){
  const imageCards=HERO_STORIES.map((item,index)=>{
    const pos=index===0?'0':index===1?'1':index===2?'2':index===3?'-2':'-1';
    return `<button class="cinema-card" type="button" data-cinema-card="${index}" data-pos="${pos}" aria-label="Show image ${index+1}: ${item.short}" ${index===0?'aria-current="true"':''} style="--image-position:${item.imagePosition}">
      ${photo(item.key,'cinema-card-image',index===0)}
      <span class="cinema-card-gradient" aria-hidden="true"></span>
      <span class="cinema-photo-number">0${index+1} <span> / 05</span></span>
      <span class="cinema-card-copy"><span class="cinema-card-kicker">${item.eyebrow}</span><strong>${item.title}</strong><span class="cinema-card-small">EXPLORE THIS STORY ↗</span></span>
    </button>`;
  }).join('');
  return `<section class="cinema-hero" aria-label="PenyuGuard wildlife stories">
  <div class="cinema-ambient" aria-hidden="true">${photo('reef','cinema-ambient-image',true)}<div class="cinema-ambient-overlay"></div></div>
  <div class="cinema-orb orb-one" aria-hidden="true"></div><div class="cinema-orb orb-two" aria-hidden="true"></div>
  <div class="container cinema-head">
    <div class="cinema-heading"><div class="cinema-eyebrow"><span class="tiny-line"></span> FIELD NOTES / PULAU PERHENTIAN · MALAYSIA</div><h1><span class="cinema-head-line">THE OCEAN</span><span class="cinema-head-line"><em>HAS A STORY.</em></span></h1></div>
    <div class="cinema-head-aside"><span class="cinema-symbol" aria-hidden="true">✳</span><p>Every observation matters.<br>Every response deserves a record.</p><a href="#/report" class="cinema-text-link">Begin a safe report <span aria-hidden="true">↗</span></a></div>
  </div>
  <div class="ocean-film-hero" aria-hidden="true">
    <video class="ocean-film-background" muted autoplay loop playsinline preload="metadata" poster="assets/video/ocean-film-poster.jpg"><source src="assets/video/sea-turtle-original-qhd.mp4" type="video/mp4"></video>
    <div class="ocean-film-shade"></div>
  </div>
  <div class="cinema-stage" data-cinema-stage role="region" aria-roledescription="carousel" aria-label="Wildlife photography and PenyuGuard stories">
    <div class="cinema-depth-floor" aria-hidden="true"></div>
    <div class="cinema-card-stack">${imageCards}</div>
    <span class="cinema-stage-side-label cinema-left-side" aria-hidden="true">CONSERVATION THROUGH CONNECTION</span>
    <span class="cinema-stage-side-label cinema-right-side" aria-hidden="true">A PROJECT FOR WHAT MATTERS</span>
  </div>
  <div class="container cinema-footer-row">
   <div class="cinema-story-caption" aria-live="polite" aria-atomic="true"><span id="cinema-current-eyebrow">${HERO_STORIES[0].eyebrow}</span><p id="cinema-current-desc">${HERO_STORIES[0].description}</p></div>
   <div class="cinema-controls"><button type="button" class="cinema-arrow" data-cinema-previous aria-label="Previous photograph">←</button><div class="cinema-pagination" role="group" aria-label="Choose a story">${HERO_STORIES.map((_,i)=>`<button type="button" data-cinema-dot="${i}" class="cinema-dot ${i===0?'is-active':''}" aria-label="Show story ${i+1}" ${i===0?'aria-current="true"':''}><span></span></button>`).join('')}</div><button type="button" class="cinema-arrow" data-cinema-next aria-label="Next photograph">→</button><button type="button" class="cinema-pause" data-cinema-pause aria-label="Pause slideshow" aria-pressed="false">Ⅱ</button></div>
   <a class="cinema-explore" href="#/passport/${sampleId}"><span>EXPLORE THE INNOVATION</span><strong>Turtle Rescue Passport <span aria-hidden="true">↗</span></strong></a>
  </div>
  <div class="cinema-corner-note"><span>CURATED USER-PROVIDED OCEAN IMAGES</span><span>FICTIONAL ACADEMIC DEMONSTRATION</span></div>
  </section>`;
}

let cleanupPrevious=()=>{};
export function startCinematicExperience(){
  cleanupPrevious();
  // Minimal DOM test harnesses do not implement matchMedia; motion is enhancement only.
  if(typeof window.matchMedia!=='function')return;
  const abort=new AbortController();
  const {signal}=abort;
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const prefersReduced=()=>media.matches;
  const observers=[];
  let timer=0,scrollRAF=0,active=0,paused=false,hovering=false;
  const hero=document.querySelector('.cinema-hero');
  const stack=hero?.querySelector('.cinema-card-stack');
  const cards=[...(stack?.querySelectorAll('[data-cinema-card]')||[])];
  const dots=[...(hero?.querySelectorAll('[data-cinema-dot]')||[])];
  const stage=hero?.querySelector('[data-cinema-stage]');
  const ambientVideo=hero?.querySelector('.ocean-film-background');

  function syncAmbientVideo(){
    if(!ambientVideo)return;
    // Native loop keeps the original 30-second file cycling indefinitely while visible.
    ambientVideo.loop=true;
    ambientVideo.muted=true;
    ambientVideo.defaultMuted=true;
    if(prefersReduced()||document.hidden){ambientVideo.pause();return;}
    const play=ambientVideo.play();if(play?.catch)play.catch(()=>{ /* Keep the poster fallback. */ });
  }
  // Defensive restart for browsers that fail to honor the loop attribute.
  ambientVideo?.addEventListener('ended',()=>{
    if(prefersReduced()||document.hidden)return;
    ambientVideo.currentTime=0;
    syncAmbientVideo();
  },{signal});
  ambientVideo?.addEventListener('canplay',()=>{
    if(!ambientVideo.paused || prefersReduced() || document.hidden)return;
    syncAmbientVideo();
  },{signal});
  syncAmbientVideo();
  document.addEventListener('visibilitychange',syncAmbientVideo,{signal});
  media.addEventListener?.('change',syncAmbientVideo,{signal});
  function setStory(next){
    if(!cards.length)return;
    active=(next+cards.length)%cards.length;
    cards.forEach((card,i)=>{
      let distance=(i-active+cards.length)%cards.length;
      if(distance>Math.floor(cards.length/2))distance-=cards.length;
      // The five positions remain constant: this moves photo cards rather than replacing content.
      card.dataset.pos=String(distance);
      if(i===active)card.setAttribute('aria-current','true');else card.removeAttribute('aria-current');
      card.tabIndex=i===active||Math.abs(distance)===1?0:-1;
    });
    dots.forEach((dot,i)=>{dot.classList.toggle('is-active',i===active);if(i===active)dot.setAttribute('aria-current','true');else dot.removeAttribute('aria-current');});
    const e=hero.querySelector('#cinema-current-eyebrow'),d=hero.querySelector('#cinema-current-desc');
    if(e)e.textContent=translateText(HERO_STORIES[active].eyebrow);
    if(d)d.textContent=translateText(HERO_STORIES[active].description);
    hero.style.setProperty('--cinema-index',String(active));
  }
  function stopAuto(){window.clearInterval(timer);timer=0;}
  function auto(){stopAuto();if(!hero||paused||hovering||prefersReduced()||document.hidden)return;timer=window.setInterval(()=>setStory(active+1),6500);}
  if(hero){
    setStory(0);
    stage?.addEventListener('pointerenter',()=>{hovering=true;stopAuto();},{signal});
    stage?.addEventListener('pointerleave',()=>{hovering=false;auto();},{signal});
    hero.addEventListener('focusin',()=>{hovering=true;stopAuto();},{signal});
    hero.addEventListener('focusout',event=>{if(!hero.contains(event.relatedTarget)){hovering=false;auto();}},{signal});
    hero.querySelector('[data-cinema-next]')?.addEventListener('click',()=>{setStory(active+1);auto();},{signal});
    hero.querySelector('[data-cinema-previous]')?.addEventListener('click',()=>{setStory(active-1);auto();},{signal});
    const pause=hero.querySelector('[data-cinema-pause]');
    pause?.addEventListener('click',()=>{paused=!paused;pause.setAttribute('aria-pressed',String(paused));pause.textContent=paused?'▶':'Ⅱ';pause.setAttribute('aria-label',translateText(paused?'Resume slideshow':'Pause slideshow'));auto();},{signal});
    dots.forEach(dot=>dot.addEventListener('click',()=>{setStory(Number(dot.dataset.cinemaDot));auto();},{signal}));
    cards.forEach(card=>card.addEventListener('click',()=>{setStory(Number(card.dataset.cinemaCard));auto();},{signal}));
    stage?.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();setStory(active+(event.key==='ArrowRight'?1:-1));auto();}},{signal});
    let touchX=null;
    stage?.addEventListener('touchstart',event=>{touchX=event.changedTouches[0]?.screenX??null;},{signal,passive:true});
    stage?.addEventListener('touchend',event=>{if(touchX===null)return;const diff=(event.changedTouches[0]?.screenX??touchX)-touchX;if(Math.abs(diff)>45){setStory(active+(diff<0?1:-1));auto();}touchX=null;},{signal,passive:true});
    document.addEventListener('visibilitychange',auto,{signal});
    media.addEventListener?.('change',auto,{signal});
    if(!prefersReduced()){
      // Tiny optical parallax only; no scroll-jacking or changing natural page scroll.
      hero.addEventListener('pointermove',event=>{
        if(event.pointerType==='touch')return;
        const x=(event.clientX/window.innerWidth-.5)*11;
        hero.style.setProperty('--pointer-x',`${x.toFixed(2)}px`);
      },{signal,passive:true});
      window.addEventListener('scroll',()=>{
        if(scrollRAF)return;
        scrollRAF=window.requestAnimationFrame(()=>{
          scrollRAF=0;
          const rect=hero.getBoundingClientRect();
          if(rect.bottom>0&&rect.top<window.innerHeight)hero.style.setProperty('--hero-scroll',`${Math.min(18,Math.max(-18,rect.top*-.045)).toFixed(1)}px`);
        });
      },{signal,passive:true});
    }
    auto();
  }
  const selectors=['.story-copy','.story-photo-wrap','.section-intro-row','.journey-card','.passport-feature-image','.passport-feature-copy','.passport-feature-facts > div','.audience-card','.conservation-band-content','.cinema-gallery-card','.ocean-photo-card','.page-head','.kpi','.panel','.timeline-item','.demo-photo-strip'];
  const animated=[...document.querySelectorAll(selectors.join(','))];
  if(!prefersReduced() && 'IntersectionObserver' in window){
    animated.forEach((el,i)=>{el.dataset.reveal='';el.style.setProperty('--reveal-delay',`${Math.min(i%4,3)*65}ms`);});
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});
    },{threshold:.08,rootMargin:'0px 0px -25px 0px'});
    observers.push(observer);animated.forEach(el=>observer.observe(el));
    document.body.classList.add('motion-ready');
  }else document.body.classList.remove('motion-ready');
  cleanupPrevious=()=>{ambientVideo?.pause();abort.abort();stopAuto();if(scrollRAF)window.cancelAnimationFrame(scrollRAF);observers.forEach(o=>o.disconnect());document.body.classList.remove('motion-ready');};
}
