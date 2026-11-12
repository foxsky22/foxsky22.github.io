'use strict';
const iconPaths = {
 home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-8H9v8H4a1 1 0 0 1-1-1z"/>',
 about: '<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
 projects: '<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V3h8v4M3 12a21 21 0 0 0 18 0M10 13h4"/>',
 skills: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9z"/>',
 location: '<path d="M20 10c0 6-8 11-8 11S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
 mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>'
};
function icon(name) {
 const span = document.createElement('span');
 span.className = 'icon';
 span.setAttribute('aria-hidden','true');
 span.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" focusable="false">${iconPaths[name]}</svg>`;
 return span;
}
iconPaths.services = iconPaths.projects;
iconPaths.experience = iconPaths.about;
iconPaths.contact = iconPaths.mail;
const sections = [['services','Services'],['projects','Work samples'],['experience','Experience'],['skills','Skills & Tools'],['about','About'],['contact','Contact']];
const track = document.querySelector('#track');
const content = document.querySelector('#content');
const v2SavedView = (()=>{try{return localStorage.getItem('portfolio-v2-view') === 'scroll'}catch{return false}})();
let v2ScrollMode = false;
// Add local image paths, captions, and meaningful alt text here when ready.
const sampleImages = {
 'email-layout': {src:'assets/demo-workflow.svg', title:'Email Layout Revision — demo placeholder', alt:'Illustrative workflow placeholder showing review, update, testing, and handover.', caption:'Placeholder only. The matching fictional practice sample has not been created yet.'},
 'email-qa': {src:'assets/demo-workflow.svg', title:'Email QA Checklist — demo placeholder', alt:'Illustrative workflow placeholder showing review, update, testing, and handover.', caption:'Placeholder only. The matching fictional practice sample has not been created yet.'},
 'website-update': {src:'assets/demo-workflow.svg', title:'Website Content Update — demo placeholder', alt:'Illustrative workflow placeholder showing review, update, testing, and handover.', caption:'Placeholder only. The matching fictional practice sample has not been created yet.'},
 'troubleshooting': {src:'assets/demo-workflow.svg', title:'Wi-Fi Troubleshooting Guide — demo placeholder', alt:'Illustrative workflow placeholder showing review, update, testing, and handover.', caption:'Placeholder only. The matching fictional practice sample has not been created yet.'},
 'document-formatting': {src:'assets/demo-workflow.svg', title:'Document Formatting Example — demo placeholder', alt:'Illustrative workflow placeholder showing review, update, testing, and handover.', caption:'Placeholder only. The matching fictional practice sample has not been created yet.'},
 'graphic-layout': {src:'assets/demo-workflow.svg', title:'Event Print Layout Revision — demo placeholder', alt:'Illustrative workflow placeholder showing review, update, testing, and handover.', caption:'Placeholder only. The matching fictional practice sample has not been created yet.'}
};
let selected = 'home';
const panel = document.querySelector('.right-panel');
const nav = document.querySelector('#categories');
const navHeader = document.querySelector('.panel-nav');
const homeButton = document.querySelector('#home-button');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let typingTimer, hasTyped = false;
function typeMotto() {
 const target = document.querySelector('#typing-text');
 if (!target || hasTyped || reducedMotion.matches) return;
 hasTyped = true;
 const text = target.textContent;
 let count = 0;
 target.textContent = '';
 typingTimer = setInterval(() => {
   target.textContent = text.slice(0,++count);
   if (count >= text.length) clearInterval(typingTimer);
 }, 27);
}
sections.forEach(([id,label]) => {
 const button = document.createElement('button');
 button.type = 'button'; button.className = 'category';
 button.dataset.section = id; button.setAttribute('aria-controls','content');
 button.append(icon(id),document.createTextNode(label)); track.append(button);
});
function select(id, moveFocus = false) {
  if(v2ScrollMode){v2Jump(id,moveFocus);return;}
  if (id !== 'home' && !sections.some(section => section[0] === id)) id = 'home';
  const before = new Map([...track.children].map(button => [button, button.getBoundingClientRect()]));
  clearInterval(typingTimer);
  // Preserve the same navigation nodes before replacing the previous view.
  navHeader.append(nav);
  selected = id;
  panel.classList.toggle('is-home', id === 'home');
  homeButton.hidden = id === 'home';
  content.replaceChildren(document.getElementById(id).content.cloneNode(true));
  if(id === 'home') {
    content.querySelector('#intro-nav-slot').append(nav);
    typeMotto();
  }
  if(!reducedMotion.matches) {
    track.querySelectorAll('button').forEach(button => {
      const old = before.get(button), now = button.getBoundingClientRect();
      if(old && old.width && now.width) button.animate([
       {transform:`translate(${old.left-now.left}px, ${old.top-now.top}px) scale(${old.width/now.width}, ${old.height/now.height})`},
       {transform:'none'}
      ], {duration:280,easing:'ease-out'});
    });
  }
  if(id === 'experience') showEmployer('vxi');
  if(id === 'skills') decorateTools();
  if(id === 'projects') prepareSampleButtons();
  content.scrollTop = 0;
  track.querySelectorAll('button').forEach(button => {
    if(button.dataset.section === id) button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  });
  if(moveFocus) content.focus({preventScroll:true});
}
function loadHash() {select(location.hash.slice(1) || 'home');}
track.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  const id = button.dataset.section;
  history.replaceState(null,'',`#${id}`);
  select(id, event.detail === 0);
});
homeButton.addEventListener('click', () => {
 history.replaceState(null,'','#home'); select('home',true);
});
window.addEventListener('hashchange',loadHash);
loadHash();
document.querySelector('.location').prepend(icon('location'));
document.querySelector('.profile-contact .mini-icon')?.setAttribute('aria-hidden','true');

function showEmployer(id){
 const detail = content.querySelector('#employer-detail');
 const source = document.getElementById('job-'+id);
 if(!detail || !source) return;
 detail.replaceChildren(source.content.cloneNode(true));
 content.querySelectorAll('[data-employer]').forEach(button => button.setAttribute('aria-pressed',String(button.dataset.employer === id)));
}
content.addEventListener('click',event => {
 const button = event.target.closest('[data-employer]');
 if(button) showEmployer(button.dataset.employer);
});

function decorateTools(){
 const paths={
  document:'<path d="M6 3h9l4 4v14H6zM14 3v5h5M9 12h7M9 16h7"/>',
  code:'<path d="m8 7-5 5 5 5m8-10 5 5-5 5m-3-13-2 20"/>',
  storage:'<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 4 16 4 16 0V5M4 12c0 4 16 4 16 0"/>',
  crm:'<rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M5 17c0-5 8-5 8 0m2-9h3m-3 4h3"/>',
  desktop:'<rect x="3" y="3" width="18" height="13" rx="2"/><path d="M12 16v5M7 21h10"/>',
  design:'<path d="m4 16 11-11 4 4L8 20H4zM13 7l4 4"/>',
  workspace:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
 };
 content.querySelectorAll('[data-tool-icon]').forEach(label=>{
  const glyph=document.createElement('span'); glyph.className='tool-icon';glyph.setAttribute('aria-hidden','true');
  glyph.innerHTML=`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${paths[label.dataset.toolIcon]}</svg>`;
  label.prepend(glyph);
 });
}

function prepareSampleButtons(){
 content.querySelectorAll('[data-sample]').forEach(button=>{
  const sample=sampleImages[button.dataset.sample];
  button.disabled=!sample?.src;
  button.textContent=sample?.src ? '▧ View demo' : '▧ Sample coming soon';
 });
}
const viewer=document.querySelector('#sample-viewer');
const previewImage=document.querySelector('#sample-image');
const stage=document.querySelector('#image-stage');
let zoom=1,panX=0,panY=0,dragOrigin=null,lastPreviewButton=null;
function renderPreview(){
 previewImage.style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`;
 document.querySelector('#zoom-level').value=Math.round(zoom*100)+'%';
 document.querySelector('#zoom-out').disabled=zoom<=1;
 document.querySelector('#zoom-in').disabled=zoom>=4;
 stage.classList.toggle('can-pan',zoom>1);
}
function resetPreview(){zoom=1;panX=panY=0;renderPreview();}
function closePreview(){viewer.close();}
content.addEventListener('click',event=>{
 const button=event.target.closest('[data-sample]');
 if(!button || button.disabled) return;
 const sample=sampleImages[button.dataset.sample];
 if(!sample?.src) return;
 lastPreviewButton=button;
 previewImage.src=sample.src;previewImage.alt=sample.alt || sample.title;
 document.querySelector('#viewer-title').textContent=sample.title;
 document.querySelector('#viewer-caption').textContent=sample.caption;
 resetPreview();viewer.showModal();document.querySelector('#viewer-close').focus();
});
document.querySelector('#viewer-close').addEventListener('click',closePreview);
viewer.addEventListener('click',event=>{if(event.target===viewer) closePreview();});
viewer.addEventListener('close',()=>{dragOrigin=null;lastPreviewButton?.focus({preventScroll:true});});
document.querySelector('#zoom-in').addEventListener('click',()=>{zoom=Math.min(4,zoom+.25);renderPreview();});
document.querySelector('#zoom-out').addEventListener('click',()=>{zoom=Math.max(1,zoom-.25);if(zoom===1) panX=panY=0;renderPreview();});
document.querySelector('#zoom-reset').addEventListener('click',resetPreview);
stage.addEventListener('pointerdown',event=>{
 if(zoom<=1 || event.button!==0) return;
 dragOrigin={x:event.clientX-panX,y:event.clientY-panY};stage.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointermove',event=>{if(dragOrigin){panX=event.clientX-dragOrigin.x;panY=event.clientY-dragOrigin.y;renderPreview();}});
stage.addEventListener('pointerup',()=>{dragOrigin=null;});
stage.addEventListener('pointercancel',()=>{dragOrigin=null;});
previewImage.addEventListener('error',()=>{document.querySelector('#viewer-caption').textContent='This sample image could not be loaded. Please close the preview and try again later.';});


// Portfolio V2 enhancements: original layout remains the default unless saved otherwise.
const themeToggle = document.getElementById('theme-toggle');
const themeLabel = document.getElementById('theme-label');
const themeSymbol = document.getElementById('theme-symbol');
const systemDark = matchMedia('(prefers-color-scheme: dark)');
function storedPreference(key){try{return localStorage.getItem(key)}catch{return null}}
function savePreference(key,value){try{localStorage.setItem(key,value)}catch{}}
function applyTheme(value){
 document.documentElement.dataset.theme=value;
 themeToggle.setAttribute('aria-label',`Switch to ${value==='dark'?'light':'dark'} mode`);
 themeToggle.setAttribute('aria-pressed',String(value==='dark'));
 themeLabel.textContent=value==='dark'?'Dark mode':'Light mode';
 themeSymbol.textContent=value==='dark'?'☾':'☀';
}
applyTheme(storedPreference('portfolio-v2-theme') || (systemDark.matches?'dark':'light'));
themeToggle.addEventListener('click',()=>{
 const value=document.documentElement.dataset.theme==='dark'?'light':'dark';
 savePreference('portfolio-v2-theme',value);applyTheme(value);
});
systemDark.addEventListener?.('change',event=>{
 if(!storedPreference('portfolio-v2-theme'))applyTheme(event.matches?'dark':'light');
});

const contactToggle=document.getElementById('contact-toggle');
const contactMenu=document.getElementById('contact-menu');
function setContactOpen(open){contactMenu.hidden=!open;contactToggle.setAttribute('aria-expanded',String(open));}
contactToggle.addEventListener('click',()=>setContactOpen(contactMenu.hidden));
document.addEventListener('pointerdown',event=>{
 if(!event.target.closest('.contact-menu-wrap'))setContactOpen(false);
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&!contactMenu.hidden){setContactOpen(false);contactToggle.focus();}
});

const scrollToggle=document.getElementById('scroll-toggle');
const backToTop=document.getElementById('back-to-top');
const v2Ids=sections.map(item=>item[0]);
const pageScroll=matchMedia('(max-width:760px)');
let scrollFrame=null;
function v2Active(id){
 selected=id;
 track.querySelectorAll('button').forEach(button=>{
  if(button.dataset.section===id)button.setAttribute('aria-current','page');
  else button.removeAttribute('aria-current');
 });
}
function v2Jump(id,focus=false){
 if(id==='home'){
  if(pageScroll.matches)window.scrollTo({top:panel.getBoundingClientRect().top+window.scrollY-12,behavior:reducedMotion.matches?'instant':'smooth'});else content.scrollTo({top:0,behavior:reducedMotion.matches?'instant':'smooth'});
  v2Active('home');
 }else{
  const target=document.getElementById('v2-'+id);
  if(!target)return;
  target.scrollIntoView({block:'start',behavior:reducedMotion.matches?'instant':'smooth'});
  v2Active(id);
  if(focus)target.focus({preventScroll:true});
 }
}
function v2UpdateActive(){
 if(!v2ScrollMode)return;
 const onPhone=pageScroll.matches;
 backToTop.hidden=onPhone ? window.scrollY<260 : content.scrollTop<220;
 const anchors=[...content.querySelectorAll('.v2-scroll-section')];
 const threshold=onPhone ? 180 : content.getBoundingClientRect().top+Math.min(140,content.clientHeight*.3);
 let active='home';
 for(const anchor of anchors){if(anchor.getBoundingClientRect().top<=threshold)active=anchor.dataset.viewSection;}
 if(active!==selected)v2Active(active);
}
function scheduleScrollUpdate(){
 if(!v2ScrollMode || scrollFrame!==null)return;
 scrollFrame=requestAnimationFrame(()=>{
  scrollFrame=null;
  v2UpdateActive();
 });
}
function v2SetScrollMode(on,initial=false){
 if(on===v2ScrollMode && !initial)return;
 const keep=selected;
 v2ScrollMode=on;
 panel.classList.toggle('v2-scroll-mode',on);
 scrollToggle.setAttribute('aria-checked',String(on));
 scrollToggle.setAttribute('aria-label',on?'Disable scroll view':'Enable scroll view');
 if(on){
  clearInterval(typingTimer);
  navHeader.append(nav);
  panel.classList.remove('is-home');
  homeButton.hidden=false;
  content.replaceChildren();
  const intro=document.createElement('section');intro.className='v2-scroll-intro';intro.tabIndex=-1;intro.innerHTML='<p class="eyebrow">PORTFOLIO / JAYCE SARDO</p><h2>Technical Virtual Assistant</h2><p class="lead">Explore my services, practice work samples, experience, skills, and background.</p>';
  content.append(intro);
  for(const id of v2Ids){
   const wrapper=document.createElement('section');wrapper.className='v2-scroll-section';wrapper.id='v2-'+id;wrapper.dataset.viewSection=id;wrapper.tabIndex=-1;
   wrapper.append(document.getElementById(id).content.cloneNode(true));
   content.append(wrapper);
  }
  const employer=content.querySelector('#employer-detail');
  if(employer)showEmployer('vxi');
  decorateTools();prepareSampleButtons();
  requestAnimationFrame(()=>{if(keep!=='home')v2Jump(keep);else content.scrollTop=0;v2UpdateActive();});
 }else{
  backToTop.hidden=true;
  select(keep,false);
 }
 if(!initial)savePreference('portfolio-v2-view',on?'scroll':'click');
}
scrollToggle.addEventListener('click',()=>v2SetScrollMode(!v2ScrollMode));
backToTop.addEventListener('click',()=>{
 const behavior=reducedMotion.matches?'instant':'smooth';
 if(pageScroll.matches)window.scrollTo({top:0,behavior});
 else content.scrollTo({top:0,behavior});
 const focusTarget=pageScroll.matches ? document.querySelector('.profile h1') : content.querySelector('.v2-scroll-intro');
 focusTarget?.focus({preventScroll:true});
});
content.addEventListener('scroll',scheduleScrollUpdate,{passive:true});
window.addEventListener('scroll',scheduleScrollUpdate,{passive:true});
window.addEventListener('resize',scheduleScrollUpdate,{passive:true});
if(v2SavedView)v2SetScrollMode(true,true);
