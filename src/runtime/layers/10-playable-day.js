/* In-world conversation choices and the day adventure. */
const cubChoices=document.createElement('div');
cubChoices.id='cubChoices';
cubChoices.hidden=true;
cubChoices.innerHTML='<button type="button">Talk</button><button type="button">Trade</button>';
world.parentElement.append(cubChoices);
let choiceCub=null,tradeSession=null;
const dayStyle=document.createElement('style');
dayStyle.textContent=`
 #cubChoices{position:absolute;z-index:20;transform:translate(-50%,-100%);display:flex;gap:4px}
 #cubChoices[hidden]{display:none}
 #cubChoices button{background:#fff1c9;border:2px solid #654a35;color:#3f3426;padding:6px 12px;box-shadow:2px 3px #493627;font: bold 15px Georgia,serif}
 #modalBackdrop.woodland-talk{align-items:end;background:#150e0824;padding:0 12px 24px}
 #modalBackdrop.woodland-talk #modal{background:#fff1cc;border:4px double #805630;max-width:650px;font:17px Georgia,serif;box-shadow:5px 6px #3d2a20}
 #modalBackdrop.woodland-talk #modalTitle{font-family:Georgia,serif;color:#573921}
 #modalBackdrop.woodland-talk .v4OptionStack{display:flex;flex-wrap:wrap;gap:6px}
 body.woodland-barter #tab-trade{background:#f4e7c4;border:2px solid #816242;padding:10px}
 body.woodland-barter .rightColumn .tabs,body.woodland-barter #cubStrip,
 body.woodland-barter #npcQuote,body.woodland-barter #tradeHint,
 body.woodland-barter #tradeMeter,body.woodland-barter .bluffWrap{display:none}
 #woodlandTradeStatus{padding:8px;background:#223f35;color:#fff4cf;font:15px Georgia,serif}
 #tab-history{background:#f4e8c9;color:#483a29;border-left:5px double #a58b52;padding:12px}
 #tab-history .sectionHead{font-family:Georgia,serif}
 #toast{top:auto;bottom:15px;border:1px solid #e1c58a;background:#223f35;font:15px Georgia,serif}
 body:has(#modalBackdrop.woodland-talk.open) #toast{bottom:auto;top:12px;max-width:min(340px,85vw)}
 #modalBackdrop.woodland-talk .v4OptionStack[hidden]{display:none}
`;
document.head.append(dayStyle);

function clearCubChoices(){
 choiceCub=null;
 cubChoices.hidden=true;
}
function showCubChoices(id){
 const n=state.npcs.find(c=>c.id===id);
 if(!v5NearCub(n)||n.travelPlan?.stage==='between'){
  clearCubChoices();
  return notify('That cub moved away. Walk closer to try again.');
 }
 clearCubChoices();
 choiceCub=id;
 positionCubChoices();
}
function positionCubChoices(){
 if(!choiceCub)return;
 const n=state.npcs.find(c=>c.id===choiceCub);
 if(!v5NearCub(n)||mapOpen||paused||v4MenuIsOpen||$('modalBackdrop').classList.contains('open')){
  clearCubChoices();return;
 }
 const rect=world.getBoundingClientRect(),frame=world.parentElement.getBoundingClientRect();
 const scale=Math.min(rect.width/768,rect.height/434);
 cubChoices.style.left=clamp(rect.left-frame.left+(rect.width-768*scale)/2+n.worldPos[0]*scale,70,frame.width-70)+'px';
 cubChoices.style.top=Math.max(45,rect.top-frame.top+(rect.height-434*scale)/2+(n.worldPos[1]-58)*scale)+'px';
 cubChoices.hidden=false;
}
function drawDayInteractions(){
 positionCubChoices();
 if(!mapOpen&&state){
  for(const n of state.npcs){
   if(n.location!==state.location||n.travelPlan?.stage==='between'||n.lastUseDay!==state.day||n.mood!=='UNWELL')continue;
   const [x,y]=n.worldPos;
   ctx.save();ctx.fillStyle='#efe4b7';ctx.font='bold 11px Georgia,serif';
   ctx.fillText('Unwell',x+19,y-23);ctx.restore();
  }
 }
 if(v4AutoPoint&&!mapOpen&&!paused){
  const [x,y]=v4AutoPoint;
  ctx.save();ctx.strokeStyle='#ffe3a0';ctx.lineWidth=2;
  ctx.beginPath();ctx.ellipse(x,y,9,4,0,0,Math.PI*2);ctx.stroke();ctx.restore();
 }
 if(state?.location==='trail'&&!mapOpen){
  rect(ctx,612,371,60,19,'#5a4344');
  rect(ctx,622,359,38,15,'#73565a');
  rect(ctx,630,362,23,9,'#a5b8a8');
  rect(ctx,620,387,10,7,'#332d31');rect(ctx,654,387,10,7,'#332d31');
  textTag(ctx,'PARKED CAR',640,349);
 }
};
world.addEventListener('pointerdown',clearCubChoices);
cubChoices.children[0].onclick=()=>{
 const id=choiceCub;clearCubChoices();
 if(!id)return;
 selectNPC(id);
 const options=$('modalBody').querySelector('.v4OptionStack');
 if(!options)return;
 options.hidden=true;
 const next=document.createElement('button');
 next.type='button';next.className='v5Choice';next.id='continueCubDialogue';next.textContent='Continue';
 options.before(next);
 next.onclick=()=>{
  options.hidden=false;options.querySelector('button')?.focus();next.remove();
 };
 next.focus();
};
cubChoices.children[1].onclick=()=>{
 const id=choiceCub;clearCubChoices();
 if(!id)return;
 state.chosen=id;openWoodlandTrade();
};

const dayOpenConversation=v5OpenConversation;
function tellDayAdventure(id){
 const adventure=state.dayAdventure;
 const n=state.npcs.find(cub=>cub.id===id);
 const lines={
  mama:'I’m glad you came back to tell me. Tomorrow, tell me where you’re going before you leave.',
  fern:'I want to see where you went someday. Will you take me?',
  pebble:'Next time, tell me where you’re going. I worried when you were gone.'
 };
 if(!adventure.told){
  adventure.told=id;
  if(n)n.rel=clamp(n.rel+1,-6,10);
  else state.mama.memories.unshift('D'+state.day+': You told Mama about '+adventure.subject+'.');
  log((n?.name||'Mama')+' remembered your story about '+adventure.subject+'.');
  save();
 }
 const found=items[adventure.find];
 $('modalBody').textContent=lines[id]+(found?' And let me see that '+found.name.toLowerCase()+' you found.':'');
}
function resolveTrailCapture(waited){
 closeModal();
 state.trailCapture=null;
 travel('den',true);
 state.needs.energy=clamp(state.needs.energy-(waited?24:16));
 state.mama.memories.unshift('D'+state.day+': '+(waited?'Found the cub waiting quietly.':'Followed the cub’s call.'));
 notify('Mama brought you home · you can move again');
 save();render();
}
function showTrailCapture(){
 const heard=state.trailCapture==='heard';
 openModal('Taken from the trail',heard?
  '<p>Mama answers from the trees. You can see her through the brush.</p>':
  '<p>A human carried you away from the road. You can hear Mama calling beyond the trees.</p>',
  heard?[
   {text:'Go to Mama',action:()=>resolveTrailCapture(false)},
   {text:'Wait for Mama',secondary:true,action:()=>resolveTrailCapture(true)}
  ]:[
   {text:'Call to Mama',action:()=>{state.trailCapture='heard';save();showTrailCapture();}},
   {text:'Stay quiet',secondary:true,action:()=>resolveTrailCapture(true)}
  ]);
 $('modalBackdrop').classList.add('woodland-talk');
}
function trailTracks(){
 if(state.humanTracksDay===state.day)return notify('The footsteps have faded for today.');
 openModal('Boot prints by the sign','<p>Fresh tracks cross the trail. Someone moves behind the trees.</p>',[
  {text:'Back away',secondary:true,action:()=>{
   closeModal();state.humanTracksDay=state.day;recordDayAdventure('the fresh boot prints');
   notify('Human Trail · you backed away from the tracks');save();
  }},
  {text:'Look closer',action:()=>{
   closeModal();
   state.humanTracksDay=state.day;
   const roll=rng();
   if(roll<.22){
    recordDayAdventure('a shot in the woods');
    state.needs.health=clamp(state.needs.health-55);
    if(state.needs.health===0)return finishCubRun('poacher','A poacher shot your cub near the Human Trail.');
    travel('den',true);
    state.mama.memories.unshift('D'+state.day+': Mama found the cub hurt and brought them back to the den.');
    notify('A shot rang out · Mama brought you home injured');
    save();render();return;
   }
   if(roll<.48){
    recordDayAdventure('the human who took you');
    state.trailCapture='taken';save();showTrailCapture();
    return;
   }
   recordDayAdventure('the hiker crossing the trail');
   say('you','They walked right past me. I don’t think they saw me.');
   notify('Human Trail · the hiker kept walking');save();
  }}
 ]);
 $('modalBackdrop').classList.add('woodland-talk');
}
const dayMamaConversation=v5MamaConversation;
v5MamaConversation=function(){
 dayMamaConversation();
 if(!$('modalBackdrop').classList.contains('open'))return;
 $('modalBackdrop').classList.add('woodland-talk');
 const adventure=state.dayAdventure;
 if(adventure?.day===state.day-1&&adventure.told==='mama'){
  const recall=document.createElement('button');
  recall.className='v5Choice';recall.textContent='Talk about yesterday';
  $('modalBody').querySelector('.v4OptionStack')?.append(recall);
  recall.onclick=()=>{
   $('modalBody').textContent='I’m still thinking about '+adventure.subject+'. Tell me before you head out again.';
   if(!adventure.recalled){adventure.recalled=true;state.mama.trust=clamp(state.mama.trust+1);save();}
  };
 }
 if(adventure?.day!==state.day)return;
 const tell=document.createElement('button');
 tell.className='v5Choice';tell.textContent='Tell Mama what happened today';
 $('modalBody').querySelector('.v4OptionStack')?.append(tell);
 tell.onclick=()=>tellDayAdventure('mama');
};
v5OpenConversation=function(n){
 dayOpenConversation(n);
 if(!$('modalBackdrop').classList.contains('open'))return;
 dialogueBubble=null;
 $('modalBackdrop').classList.add('woodland-talk');
 document.querySelector('#modalBody .v5DealReason p')?.remove();
 if(n.mood==='UNWELL'&&n.lastUseDay===state.day){
  const words=$('modalBody').querySelector('.v5DealReason p');
  if(words)words.textContent='“I don’t feel right. I think I need to go home.”';
 }
 if(['fern','pebble'].includes(n.id)){
  const clue=document.createElement('button');
  clue.className='v5Choice';clue.textContent='Ask about the Human Trail';
  $('v5AskItem')?.after(clue);
  clue.onclick=()=>{
   state.trailClue=true;
   const line='The people come back to the picnic spot. I saw something with a shiny mouthpiece by the litter.';
   log(n.name+' told you to check the Human Trail picnic litter for a shiny relic.');
   $('modalBody').textContent=line;
   save();
  };
  if(state.dayAdventure?.day===state.day&&state.location==='den'){
   const tell=document.createElement('button');
   tell.className='v5Choice';tell.textContent='Tell '+n.name+' what happened today';
   clue.after(tell);
   tell.onclick=()=>tellDayAdventure(n.id);
  }
 }
 if($('v5BarterOption'))$('v5BarterOption').onclick=()=>{closeModal();openWoodlandTrade();};
};
const tradeStatus=document.createElement('p');
tradeStatus.id='woodlandTradeStatus';
$('tradeBtn').before(tradeStatus);
tradeStatus.hidden=true;
const counterButton=document.createElement('button');
counterButton.type='button';counterButton.className='v5Choice';counterButton.hidden=true;
$('tradeResult').after(counterButton);

function openWoodlandTrade(){
 const n=npc();
 if(!v5NearCub(n)||n.travelPlan?.stage==='between')return notify('That cub is out of reach.');
 tradeSession={cub:n.id,proposal:null,wasPaused:paused};
 paused=true;offered={};wanted={};dialogueBubble=null;$('bluffCheck').checked=false;
 document.body.classList.add('woodland-barter');
 tradeStatus.hidden=false;
 counterButton.hidden=true;
 $('tradeBtn').textContent='Propose trade';
 tradeStatus.textContent='Your offer · pending / '+n.name+'’s offer · pending';
 tradeResult('Choose something to offer and something to ask for.',false);
 v5OpenPanel('trade');render();
}
const dayClosePanel=v5ClosePanel;
v5ClosePanel=function(){
 const endedTrade=!!tradeSession;
 if(tradeSession){
  paused=tradeSession.wasPaused;tradeSession=null;
  tradeStatus.hidden=true;
  counterButton.hidden=true;
  $('tradeBtn').textContent='Shake paws ↗';
  document.body.classList.remove('woodland-barter');
 }
 dayClosePanel();
 if(endedTrade)render();
};
document.querySelector('.v5PanelClose').onclick=()=>v5ClosePanel();
window.addEventListener('keydown',event=>{
 if(state?.trailCapture&&event.key==='Escape'&&$('modalBackdrop').classList.contains('open')){
  event.preventDefault();event.stopImmediatePropagation();resolveTrailCapture(true);return;
 }
 if(!tradeSession)return;
 if(event.key==='Escape'){
  event.preventDefault();event.stopImmediatePropagation();v5ClosePanel();
 }else if(['w','a','s','d','e','i','m','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(event.key)){
  event.preventDefault();event.stopImmediatePropagation();
 }
},true);
function reviseWoodlandTrade(){
 if(!tradeSession)return;
 tradeSession.proposal=null;
 counterButton.hidden=true;
 tradeStatus.textContent='Your offer · pending / '+npc().name+'’s offer · pending';
 $('tradeBtn').textContent='Propose trade';
}
const dayToggleItem=toggleItem,dayClearTrade=clearTrade;
toggleItem=function(side,id){reviseWoodlandTrade();dayToggleItem(side,id);};
clearTrade=function(){reviseWoodlandTrade();dayClearTrade();};
$('clearBtn').onclick=clearTrade;
$('tradeBtn').addEventListener('click',event=>{
 if(!tradeSession)return;
 event.stopImmediatePropagation();
 const n=npc();
 if(n.id!==tradeSession.cub||!v5NearCub(n)||!canPay(state.inv,offered)||!canPay(n.inv,wanted)){
  clearTrade();return tradeResult('Those goods are no longer available.',false);
 }
 if(!count(offered)||!count(wanted))return tradeResult('Choose goods on both sides.',false);
 if(wanted.fernMouse||SharedBarterRules.isNullBarter(offered,wanted)){
  negotiate();reviseWoodlandTrade();return;
 }
 if(count(state.inv)-count(offered)+count(wanted)>capacity()){
  reviseWoodlandTrade();
  tradeResult('Your bag is full. Make room before accepting this offer.',false);
  return notify('Your backpack is full. Make room before attempting the deal.');
 }
 const reserved=Object.keys(wanted).find(id=>n.reservedInv?.[id]);
 if(reserved)return tradeResult(n.name+': “I’m keeping '+items[reserved].name.toLowerCase()+'. It matters to me.”',false);
 const opinion=tradeMood();
 if(opinion.score< -1){
  const extra=Object.keys(state.inv).filter(id=>quantity(state.inv,id)>quantity(offered,id))
    .find(id=>itemVal(n,id)+opinion.score>=-1);
  if(extra&&['fern','pebble'].includes(n.id)){
   const item=items[extra].name.toLowerCase();
   tradeResult(n.name+': “Add one '+item+' and we have a deal.”',false);
   counterButton.textContent='Add one '+item+' to your offer';
   counterButton.hidden=false;
   counterButton.onclick=()=>toggleItem('offer',extra);
  }else{
   tradeResult(n.name+': “I could use a '+items[n.love].name.toLowerCase()+'. What else have you got?”',false);
  }
  return;
 }
 const proposal=JSON.stringify([offered,wanted]);
 if(tradeSession.proposal!==proposal){
  tradeSession.proposal=proposal;
  tradeStatus.textContent=n.name+' accepts · Your confirmation is pending';
  $('tradeBtn').textContent='Accept and trade';
  return;
 }
 reviseWoodlandTrade();
 const before=state.trades;
 negotiate();
 if(state.trades>before)tradeStatus.textContent='Both bears accepted · Goods exchanged';
},true);

function recordDayAdventure(subject){
 if(state.dayAdventure?.day===state.day)return;
 state.dayAdventure={day:state.day,subject};
 log('Today’s adventure: '+subject+'.');
}
function offerBedtimeAdventure(){
 if(state.dayAdventure?.day===state.day)return false;
 openModal('A noise at the den','<p>A branch cracks outside. Pebble sits up and looks at you.</p>',[
  {text:'Check with Mama',action:()=>{
   closeModal();recordDayAdventure('the fallen branch at the den');
   state.mama.memories.unshift('D'+state.day+': We checked the fallen branch together.');
   v5Sleep();
  }},
  {text:'Stay close to Pebble',action:()=>{
   closeModal();recordDayAdventure('the noise that frightened Pebble');
   const pebble=state.npcs.find(n=>n.id==='pebble');
   pebble.rel=clamp(pebble.rel+1,-6,10);
   v5Sleep();
  }}
 ]);
 $('modalBackdrop').classList.add('woodland-talk');
 return true;
}
const dayOldLoot=selectedRarityLoot;
selectedRarityLoot=function(area,playerSearch=false){
 if(playerSearch&&area==='trail'&&state.trailClue&&!quantity(state.inv,'vape')&&rng()<.045)return 'vape';
 return dayOldLoot(area);
};
const dayPreviousObject=interactObject;
const dayContinue=v4Continue;
v4Continue=function(){
 dayContinue();
 drawPortrait($('logoBear'),cubAppearance(state.avatar));
 if(state.trailCapture)showTrailCapture();
 if(state.dead&&['road','river','poacher'].includes(state.deathCause)){
  paused=true;
  const message={river:'Silverfin’s current pulled your cub under.',road:'A passing car struck your cub at the Human Trail.',poacher:'A poacher shot your cub near the Human Trail.'};
  showCubRunEnd(message[state.deathCause]);
 }
};
items.trailSweets={name:'Abandoned edibles',short:'packet',color:'#bd8c58',rarity:'rare',category:'Curiosity',desc:'A torn human packet with strange sweets inside.'};
items.glassPipe={name:'Glass bong',short:'glass',color:'#85b2ac',rarity:'rare',category:'Curiosity',desc:'A strange glass object caught in the brambles.'};
const trailDiscoveries=[
 {subject:'fresh footprints beside the picnic spot',line:'Wet footprints cross the path. Whoever made them was here recently.'},
 {subject:'a torn bag of abandoned edibles',item:'trailSweets',line:'A torn packet of human sweets is caught on a twig. Some of the cubs whisper about what was inside.'},
 {subject:'a glass bong caught in the brambles',item:'glassPipe',line:'A glass pipe catches the light in the brambles. Someone dropped it in a hurry.'}
];
interactObject=function(action,spot){
 if(action==='humanTracks')return trailTracks();
 if(action==='parkedCar'){
  openModal('Voices behind the glass','<p>Two teenagers are kissing in the parked car. They haven’t seen you.</p>',[
   {text:'Let them see you',action:()=>{
    closeModal();recordDayAdventure('the parked car');
    say('you','They saw me! They both jumped!');
    log('Two teenagers in a parked car scrambled apart when they spotted a cub outside.');
    notify('Two startled humans · you backed away before they got out');
    save();
   }},
   {text:'Slip away',secondary:true,action:()=>{
    closeModal();recordDayAdventure('the voices in the parked car');save();
   }}
  ]);
  $('modalBackdrop').classList.add('woodland-talk');
  return;
 }
 if(action==='trail'&&state.dayAdventure?.day!==state.day){
  const find=randomOf(trailDiscoveries);
  recordDayAdventure(find.subject);say('you',find.line);
  if(find.item&&count(state.inv)<capacity()){
   add(state.inv,find.item,1);
   log('You brought '+items[find.item].name.toLowerCase()+' back from the picnic spot.');
  }
  save();
 }
 if(action==='logs'&&state.location==='woods'&&state.dayAdventure?.day!==state.day&&rng()<.12){
  recordDayAdventure('a body hidden behind the fallen log');
  say('you','There’s someone behind the log. They aren’t moving. I need to tell Mama.');
  notify('Deep Woodland · you backed away from the fallen log');
  state.mama.memories.unshift('D'+state.day+': The cub was frightened by what they saw behind the fallen log.');
  save();return;
 }
 if(action==='trail'){
  const before={...state.inv};
  const result=dayPreviousObject(action,spot);
  const found=Object.keys(state.inv).find(id=>quantity(state.inv,id)>quantity(before,id));
  if(found&&state.dayAdventure?.day===state.day){
   state.dayAdventure.find=found;
   save();
  }
  return result;
 }
 return dayPreviousObject(action,spot);
};

function npcWorldAction(){
 runWoodlandSchedule();
 v5NPCDependenceSim();
 v5MaybeSocialEvent();
}
function drawScene(){
 worldDrawV3();
 drawMovementScenery();
 drawPlacedAmenities();
 drawFamilyAndHazards();
 drawActionEffects();
 drawTransferEffects();
 drawAmenityActivity();
 drawPhysicalEncounters();
 drawDayInteractions();
}

function render(){
 renderTradingCore();
 renderCare();
 renderLocation();
 renderDayDetails();
 renderNearbyHelp();
 renderNeeds();
 renderSceneAccessibility();
}

$('v3Dev').onclick=()=>showDev();
$('v3Backpack').onclick=()=>openBackpack();
$('tradeBtn').onclick=negotiate;
load();drawPortrait($('logoBear'),cubAppearance(state.avatar));render();requestAnimationFrame(animate);v5ShowMenu();
})();
