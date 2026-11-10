/* v5.2 — accessible mobile navigation and full-size save management. */
const v52HudCss=document.createElement('style');
v52HudCss.textContent=`
#v52Touch{display:none;position:absolute;inset:auto 0 5px 0;z-index:25;pointer-events:none;justify-content:space-between;padding:0 14px}
.v52Pad{display:grid;grid-template-columns:repeat(3,48px);grid-template-rows:repeat(3,48px);gap:3px}
.v52TouchBtn{touch-action:none;pointer-events:auto;min-width:48px;min-height:48px;border:2px solid #e9dca6;background:#234939dc;color:#fff4d2;border-radius:7px;font:bold 21px sans-serif;box-shadow:0 3px 0 #13291e}
.v52TouchBtn:focus-visible{outline:3px solid #ffd96b;outline-offset:2px}
.v52TouchBtn[data-direction="up"]{grid-column:2;grid-row:1}
.v52TouchBtn[data-direction="left"]{grid-column:1;grid-row:2}
.v52TouchBtn[data-direction="right"]{grid-column:3;grid-row:2}
.v52TouchBtn[data-direction="down"]{grid-column:2;grid-row:3}
.v52TapButtons{display:flex;flex-direction:column;align-items:end;gap:8px;justify-content:end}
.v52TapButtons button{font-size:14px;min-width:62px}
@media(max-width:760px){#v52Touch{display:flex} .v51TutorialBeacon{right:10px;top:8px;left:auto;max-width:59%;font-size:10px}.v4Interact{bottom:164px!important;max-width:62%}}
@media(prefers-reduced-motion:reduce){#world,.worldFrame canvas{transition:none!important}}
`;
document.head.appendChild(v52HudCss);
const v52Controls=document.createElement('div');
v52Controls.id='v52Touch';v52Controls.setAttribute('aria-label','Touch navigation controls');
v52Controls.innerHTML=`<div class="v52Pad" aria-label="Movement pad">
<button class="v52TouchBtn" data-direction="up" aria-label="Walk up">▲</button>
<button class="v52TouchBtn" data-direction="left" aria-label="Walk left">◀</button>
<button class="v52TouchBtn" data-direction="right" aria-label="Walk right">▶</button>
<button class="v52TouchBtn" data-direction="down" aria-label="Walk down">▼</button>
</div><div class="v52TapButtons">
<button class="v52TouchBtn" id="v52Interact" aria-label="Interact with nearest bear or object">E</button>
<button class="v52TouchBtn" id="v52Map" aria-label="Open world map">MAP</button>
</div>`;
document.querySelector('.worldFrame').appendChild(v52Controls);
const v52Arrows={up:'w',left:'a',down:'s',right:'d'};
for(const b of v52Controls.querySelectorAll('[data-direction]')){
 const key=v52Arrows[b.dataset.direction];
 const start=e=>{e.preventDefault();v4Keys.add(key);try{b.setPointerCapture(e.pointerId)}catch(_){}};
 const stop=e=>{v4Keys.delete(key);};
 b.addEventListener('pointerdown',start);
 for(const type of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(type,stop);
 b.addEventListener('blur',stop);
}
$('v52Interact').onclick=()=>v4InteractNearest();
$('v52Map').onclick=()=>mapOpen?closeMap():showWorldMap();
// Export and Import are normal Settings actions, not developer cheats.
function v52DownloadSave(){
 const filename='little-trading-post-day-'+state.day+'.json';
 const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);
 const link=document.createElement('a');link.href=url;link.download=filename;
 document.body.appendChild(link);link.click();link.remove();
 setTimeout(()=>URL.revokeObjectURL(url),3000);
 notify('Your woodland save is downloaded. Keep it somewhere safe.');
}
function v52PickSave(){
 const file=document.createElement('input');file.type='file';file.accept='.json,application/json';
 file.onchange=async()=>{
  try{
   const chosen=file.files?.[0];if(!chosen)return;
   if(chosen.size>4*1024*1024)throw Error('The selected file is too large.');
   const imported=JSON.parse(await chosen.text());
   v512ImportSave(imported);
   v4ShowMenu();
   notify('Save imported. Your previous progress is backed up.');
  }catch(e){notify('Cannot import save: '+e.message);}
 };
 file.click();
}
const v52PreviousSettings=v4MenuSettings;
v4MenuSettings=function(){
 v52PreviousSettings();
 const card=v4Screen.querySelector('.v4MenuCard');
 if(!card)return;
 const box=document.createElement('section');
 box.className='v52SaveControls';
 box.setAttribute('aria-label','Save management');
 box.style.cssText='margin-top:16px;padding:12px;border:2px solid #8ba789;background:#e7eddc;color:#284636';
 box.innerHTML='<h2 style="margin:0 0 8px;font:bold 18px Georgia,serif">SAVE YOUR CUB’S ADVENTURE</h2><p style="font:13px Trebuchet MS,Arial,sans-serif">Offline files and the online website store progress separately. Export a JSON save to move your progress between them.</p><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="v4Primary" id="v52Export" style="min-height:48px">⬇ EXPORT SAVE</button><button class="v4Primary" id="v52Import" style="min-height:48px">⬆ IMPORT SAVE</button></div>';
 card.appendChild(box);
 $('v52Export').onclick=v52DownloadSave;
 $('v52Import').onclick=v52PickSave;
 const backup=localStorage.getItem(V512_BACKUP);
 if(backup){const btn=document.createElement('button');btn.className='v4Primary';btn.textContent='↶ RESTORE PRE-IMPORT BACKUP';btn.style.cssText='min-height:48px;margin-top:8px';btn.onclick=()=>openModal('RESTORE PREVIOUS SAVE?','<p>Restore the most recent pre-import save? Your current game will be backed up before it is replaced.</p>',[{text:'CANCEL',action:()=>v4MenuSettings()},{text:'RESTORE',action:()=>{if(v512RestorePreImportBackup())v4ShowMenu();}}]);box.appendChild(btn);}
};

// Deterministic QA entry points do not run unless a developer explicitly
// enables the existing __LTP_TEST__ test flag in the browser.
function v53TestChangePhase(next){
 if(!window.__LTP_TEST__||!Number.isInteger(next)||next<0||next>3)return false;
 state.phase=next;scheduleV3();save();render();return true;
}
function v53TestAdvance(seconds){
 if(!window.__LTP_TEST__||!Number.isFinite(seconds)||seconds<0||seconds>180)return false;
 const steps=Math.ceil(seconds/.05);
 for(let j=0;j<steps;j++)v53NpcFrame(seconds/steps);
 save();render();return true;
}
function v53TestAct(npcId,action){
 if(!window.__LTP_TEST__)return false;
 const n=state.npcs.find(a=>a.id===npcId);
 if(!n||n.travelPlan)return false;
 n.activity=action;n.physicalIntent=null;save();return true;
}
window.LittleTradingPost={...window.LittleTradingPost,
 npcTestPhase:v53TestChangePhase,npcTestAdvance:v53TestAdvance,npcTestAct:v53TestAct,
 downloadSave:v52DownloadSave};

function v512RestorePreImportBackup(){
  let data;
  try{
    data=localStorage.getItem(V512_BACKUP);
    if(!data)throw Error('No pre-import backup exists in this browser.');
    const parsed=JSON.parse(data);
    v512ImportSave(parsed);
    notify('Previous save restored. Your replaced save has been backed up.');
    return true;
  }catch(e){notify('Could not restore backup: '+e.message);return false;}
}
// Keep restore visible only when an actual backup exists; it cannot silently
// rewrite progression without confirmation from the cub's player.
const v512PreviousShowDev=showDev;
showDev=function(){
  v512PreviousShowDev();
  let hasBackup=false;
  try{hasBackup=!!localStorage.getItem(V512_BACKUP);}catch(e){}
  const grid=$('modalBody')?.querySelector('.v3ModalGrid');
  if(grid&&hasBackup){
    const btn=document.createElement('button');btn.textContent='↶ Restore pre-import save';
    btn.onclick=()=>openModal('RESTORE BACKED-UP SAVE?',
      '<p>This replaces your current game with the save preserved before your most recent import. Your current game will be backed up first.</p>',
      [{text:'CANCEL',secondary:true,action:showDev},
       {text:'RESTORE PREVIOUS SAVE',action:()=>{closeModal();if(v512RestorePreImportBackup())render();}}]);
    grid.appendChild(btn);
  }
};
window.LittleTradingPost={...window.LittleTradingPost,importSave:v512ImportSave,validateSave:v512ValidateSave,
  exportSave:()=>JSON.stringify(state),restoreBackup:v512RestorePreImportBackup,backupSaveKey:V512_BACKUP};

/* v5.2.2: Accessible scene controls and modal keyboard focus. */
world.tabIndex=0;
world.setAttribute('role','img');
world.setAttribute('aria-label','Playable woodland scene. Use W A S D or arrow keys to move; E to interact, M for map, I for inventory.');
world.setAttribute('aria-keyshortcuts','W A S D E M I');
const v522OriginalOpenModal=openModal;
const v522OriginalCloseModal=closeModal;
let v522LastFocus=null;
openModal=function(...args){
 const wasOpen=$('modalBackdrop').classList.contains('open');
 if(!wasOpen)v522LastFocus=document.activeElement;
 v522OriginalOpenModal(...args);
 const modal=$('modal');
 modal.setAttribute('aria-modal','true');
 modal.setAttribute('role','dialog');
 queueMicrotask(()=>{
  if(!$('modalBackdrop').classList.contains('open'))return;
  const first=modal.querySelector('input:not([type=hidden]),select,textarea,button:not([disabled])');
  (first||modal).focus();
 });
};
closeModal=function(){
 v522OriginalCloseModal();
 if(v522LastFocus?.isConnected&&typeof v522LastFocus.focus==='function')v522LastFocus.focus();
 v522LastFocus=null;
};
$('modal').tabIndex=-1;
document.addEventListener('keydown',e=>{
 if(e.key!=='Tab'||!$('modalBackdrop').classList.contains('open'))return;
 const options=[...$('modal').querySelectorAll('button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),a[href],[tabindex]:not([tabindex="-1"])')].filter(x=>x.getClientRects().length);
 if(!options.length){e.preventDefault();$('modal').focus();return;}
 const first=options[0],last=options.at(-1);
 if(e.shiftKey&&(document.activeElement===first||!$('modal').contains(document.activeElement))){
  e.preventDefault();last.focus();
 }else if(!e.shiftKey&&(document.activeElement===last||!$('modal').contains(document.activeElement))){
  e.preventDefault();first.focus();
 }
});
const v522PreviousRender=render;
render=function(){
 v522PreviousRender();
 if(state?.location&&WORLD[state.location])world.setAttribute('aria-label',
   'Woodland scene: '+WORLD[state.location].name+'. Use W A S D to move, E to interact, M to open the map, and I for inventory.');
};

window.LittleTradingPost={...window.LittleTradingPost,
 tutorialTestStep:step=>{
  if(!window.__LTP_TEST__||!Number.isInteger(step)||step<0||step>7)return false;
  state.tutorial={enabled:true,step,completed:false};render();save();return true;
 }};
load();drawPortrait($('logoBear'),{skin:'#a9764c',ear:'#734b36',scarf:'#c77d58'});render();requestAnimationFrame(animate);opening();
})();
