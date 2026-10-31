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
