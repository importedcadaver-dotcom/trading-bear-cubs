/* v5.1 GAMEPLAY RELIABILITY: coordinate correctness and obstacle-aware navigation. */
function v51CanvasPoint(el,e){
 const r=el.getBoundingClientRect(),w=el.width,h=el.height;
 const scale=Math.min(r.width/w,r.height/h);
 const drawnW=w*scale,drawnH=h*scale;
 const offsetX=(r.width-drawnW)/2,offsetY=(r.height-drawnH)/2;
 const x=(e.clientX-r.left-offsetX)/scale,y=(e.clientY-r.top-offsetY)/scale;
 if(x<0||x>w||y<0||y>h)return null;
 return {x,y};
}
let v51Waypoints=[];
const v51Step=14,v51CX=35,v51CY=137;
function v51Cell(x,y){return [Math.round((x-v51CX)/v51Step),Math.round((y-v51CY)/v51Step)]}
function v51Coord(a,b){return [v51CX+a*v51Step,v51CY+b*v51Step]}
function v51RouteTo(dest){
 if(!dest)return false;
 const from=state.playerPos;
 const [sx,sy]=v51Cell(...from);
 const source=sx+','+sy;
 const maxX=Math.floor((733-v51CX)/v51Step),maxY=Math.floor((404-v51CY)/v51Step);
 const targetIsBlocked=v4Blocked(dest[0],dest[1]);
 const starts=targetIsBlocked?[]:[dest.slice(0,2)];
 if(targetIsBlocked)for(const rad of [16,32,48,64]){
   for(let i=0;i<12;i++){const t=i*Math.PI/6;starts.push([dest[0]+Math.cos(t)*rad,dest[1]+Math.sin(t)*rad])}
 }
 const targets=new Map();
 for(const xy of starts){
   const [a,b]=v51Cell(...xy),p=v51Coord(a,b);
   if(a>=0&&a<=maxX&&b>=0&&b<=maxY&&!v4Blocked(...p))targets.set(a+','+b,p);
 }
 const queue=[[sx,sy]],seen=new Set([source]),parents=new Map();
 let found=null;
 for(let idx=0;idx<queue.length&&idx<3000;idx++){
   const [x,y]=queue[idx],key=x+','+y;
   if(targets.has(key)){found=key;break;}
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
     const a=x+dx,b=y+dy,k=a+','+b,p=v51Coord(a,b);
     if(a<0||b<0||a>maxX||b>maxY||seen.has(k)||v4Blocked(...p))continue;
     seen.add(k);parents.set(k,key);queue.push([a,b]);
   }
 }
 if(!found)return false;
 if(targetIsBlocked){const spot=targets.get(found);dest[0]=spot[0];dest[1]=spot[1];}
 const path=[];
 for(let key=found;key!==source;key=parents.get(key)){
   const [a,b]=key.split(',').map(Number);
   path.push(v51Coord(a,b));
   if(path.length>3000)return false;
 }
 path.reverse();
 // Collapse straight grid segments while keeping turns outside colliders.
 const reduced=[];
 for(let i=0;i<path.length;i++){
   const prev=i?path[i-1]:from,next=path[i+1];
   if(!next||(next[0]-path[i][0])*(path[i][1]-prev[1])!==(next[1]-path[i][1])*(path[i][0]-prev[0]))reduced.push(path[i]);
 }
 v51Waypoints=reduced;
 if(!v4Blocked(dest[0],dest[1])&&Math.hypot(found.split(',')[0]*v51Step+v51CX-dest[0],found.split(',')[1]*v51Step+v51CY-dest[1])<19) v51Waypoints.push(dest.slice(0,2));
 return true;
}
// Continuous movement with per-frame clamping and simple large-obstacle collision.
function v4Blocked(x,y){if(x<32||x>738||y<133||y>411)return true;if(state.location==='den'&&x>399&&x<522&&y>267&&y<311)return true;if(state.location==='post'&&x>125&&x<272&&y>285&&y<347)return true;return false;}
function v4MotionFrame(ms){if(!state||v4MenuIsOpen||v4CreatorIsOpen||paused||state.dead||mapOpen||$('modalBackdrop').classList.contains('open'))return;if(!v4LastFrame)v4LastFrame=ms;const dT=Math.min(.06,(ms-v4LastFrame)/1000||.016);v4LastFrame=ms;
 let dx=(v4Keys.has('d')||v4Keys.has('arrowright')?1:0)-(v4Keys.has('a')||v4Keys.has('arrowleft')?1:0),dy=(v4Keys.has('s')||v4Keys.has('arrowdown')?1:0)-(v4Keys.has('w')||v4Keys.has('arrowup')?1:0);
 if(v4AutoPoint&&(dx||dy)){v4AutoPoint=null;v51Waypoints=[];}
 if(v4AutoPoint&&!dx&&!dy){
 const wp=v51Waypoints.length?v51Waypoints[0]:v4AutoPoint;
 const vx=wp[0]-state.playerPos[0],vy=wp[1]-state.playerPos[1],len=Math.hypot(vx,vy);
 if(len<8){if(v51Waypoints.length)v51Waypoints.shift();
   else {const callback=v4AutoPoint[2];v4AutoPoint=null;if(callback)callback();}
 }else{dx=vx/len;dy=vy/len;}
}
 if(dx||dy){const length=Math.hypot(dx,dy)||1,spd=(v4Keys.has('shift')?142:98)*dT;dx=dx/length*spd;dy=dy/length*spd;const x=state.playerPos[0],y=state.playerPos[1];if(!v4Blocked(x+dx,y))state.playerPos[0]=clamp(x+dx,32,738);if(!v4Blocked(state.playerPos[0],y+dy))state.playerPos[1]=clamp(y+dy,133,410);playerMoving=true;state.pose='walk';v4MoveEffort+=spd;if(v4MoveEffort>80){v4MoveEffort=0;state.needs.energy=clamp(state.needs.energy-.24);state.phaseActs+=.025;}}else playerMoving=false;
 const nearest=v4Nearest(120);v4PromptTarget=nearest;const hud=$('v4Interact');if(state.options?.help&&nearest){hud.innerHTML=`<strong>[E] ${h(nearest.label)}</strong> · ${Math.round(nearest.d)}px away`;}else hud.innerHTML='<strong>WASD</strong> Walk · <strong>E</strong> Interact · <strong>M</strong> Map';
 if(state.location==='trail')v4UpdateCars(dT);if(state.location==='river')v4CheckWater(dT);
 v4CheckOrphanNeeds(dT);v53NpcFrame(dT);v51Camera();
}
function v4Nearest(maxDist=130){const ps=state.playerPos,loc=state.location;const entries=[...WORLD[loc].objects.map(o=>({kind:'object',x:o[1],y:o[2],label:o[0],obj:o,id:o[3]})),...state.npcs.filter(n=>n.location===loc&&n.travelPlan?.stage!=='between').map(n=>({kind:'npc',x:n.worldPos?.[0]||0,y:n.worldPos?.[1]||0,id:n.id,label:'Talk to '+n.name}))];if(loc==='den')entries.push({kind:'mama',x:563,y:242,label:'Talk to Mama'});if(loc==='trail'&&v4TraderHere())entries.push({kind:'trader',x:592,y:308,label:'Speak with wandering trader'});if(loc==='trail'&&state.orphan.status==='found')entries.push({kind:'orphan',x:405,y:320,label:'Help the abandoned newborn'});
 return entries.map(o=>({...o,d:Math.hypot(ps[0]-o.x,ps[1]-o.y)})).filter(o=>o.d<maxDist).sort((a,b)=>a.d-b.d)[0]||null;}
function v4InteractNearest(){if(state.dead||v4MenuIsOpen||mapOpen)return;const n=v4Nearest(105);if(!n){notify('Nothing within reach. Walk closer to an object or cub.');return;}if(n.kind==='object'){interactObject(n.id,{x:n.x,y:n.y,id:n.label});return;}if(n.kind==='npc'){selectNPC(n.id);return;}if(n.kind==='mama'){talkMama('hug');switchTab('mama');return;}if(n.kind==='trader'){v4ShowTrader();return;}if(n.kind==='orphan'){v4OrphanDialogue();return;}}
// Instead of stepping instantly on click, move toward the clicked point and use spatial actions on arrival.
world.addEventListener('click',e=>{if(mapOpen||v4MenuIsOpen||v4CreatorIsOpen||state.dead)return;const point=v51CanvasPoint(world,e);if(!point)return;const {x,y}=point;const hotspot=worldHotspots.map(o=>({...o,d:Math.hypot(x-o.x,y-o.y)})).filter(o=>o.d<(o.r||38)).sort((a,b)=>a.d-b.d)[0];moveSteps=[];pendingInteraction=null;if(hotspot?.kind==='object'){v4AutoPoint=[clamp(hotspot.x+17,35,733),clamp(hotspot.y+27,135,407),()=>interactObject(hotspot.id,hotspot)];}else if(hotspot?.kind==='npc'){v4AutoPoint=[hotspot.x,clamp(hotspot.y+35,135,407),()=>selectNPC(hotspot.id)];}else if(hotspot?.kind==='mama'){v4AutoPoint=[510,260,()=>{v4CompleteStep('mama');v5MamaConversation();}];}else if(hotspot?.kind==='orphan'){v4AutoPoint=[405,355,()=>v4OrphanDialogue()];}else if(hotspot?.kind==='trader'){v4AutoPoint=[590,357,()=>v4ShowTrader()];}else v4AutoPoint=[clamp(x,35,733),clamp(y,135,407)];
 if(!v51RouteTo(v4AutoPoint)){v4AutoPoint=null;notify('No safe path to that spot. Try moving nearer or around the obstacle.');}
 e.stopImmediatePropagation();},true);
function v4KeysHandler(e){if(e.key==='Tab'&&$('modalBackdrop').classList.contains('open'))return;if(['input','textarea','select'].includes(document.activeElement?.tagName?.toLowerCase()))return;if(v4MenuIsOpen||v4CreatorIsOpen)return;const key=e.key.toLowerCase();if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift','e','i','m','tab','escape',' '].includes(key)){e.preventDefault();e.stopImmediatePropagation();}if(['w','a','s','d','arrowup','arrowdown','arrowleft','arrowright','shift'].includes(key)){v4Keys.add(key);moveSteps=[];}if(e.repeat)return;
 if(key==='e')v4InteractNearest();if(key==='i')openBackpack();if(key==='m')mapOpen?closeMap():showWorldMap();if(key==='tab')v4ShowMore();if(key==='escape'){if(mapOpen)closeMap();else if($('modalBackdrop').classList.contains('open'))closeModal();else v4PauseMenu();}if(key===' '&&v4FishingActive)v4ReelFish();}
document.addEventListener('keydown',v4KeysHandler,true);document.addEventListener('keyup',e=>{v4Keys.delete(e.key.toLowerCase());},true);window.addEventListener('blur',()=>v4Keys.clear());
const v4OldDrawScene=drawScene;drawScene=function(){v4OldDrawScene();if(!state||mapOpen)return;const c=ctx,ms=performance.now();
 if(state.location==='trail')v4DrawCars(c,ms);if(state.location==='trail'&&v4TraderHere()){v5DrawPanda(c,592,308,animationTime);textTag(c,'WANDERING TRADER',592,236);worldHotspots.push({kind:'trader',x:592,y:308,r:55,id:'trader'});}if(state.location==='trail'&&state.orphan.status==='found'){v5DrawNewborn(c,405,321,1.2);textTag(c,'NEWBORN CUB!',405,275);worldHotspots.push({kind:'orphan',x:405,y:321,r:44,id:'orphan'});}
 if(state.orphan.status==='carried'){v5DrawNewborn(c,state.playerPos[0]+19,state.playerPos[1]+15,.65);}
 for(const pin of state.pins.filter(p=>p.loc===state.location)){rect(c,pin.x-18,pin.y-12,36,23,pin.id==='birdhouse'?'#976d47':'#c8b083');rect(c,pin.x-13,pin.y-8,26,7,pin.id==='birdhouse'?'#f0ca79':'#e8db9b');}
 const near=v4Nearest(110);if(near){v5OutlineInteractable(c,near);}
 v4SimEffects=v4SimEffects.filter(e=>e.until>ms);for(const f of v4SimEffects){const life=(f.until-ms)/1150;c.fillStyle='#fff2c8';c.font='bold 12px monospace';c.textAlign='center';c.fillText(f.text,f.x,Math.max(50,f.y-(1-life)*33));}
};
const v4OldBg=drawSceneBackground;drawSceneBackground=function(c,loc,t){v4OldBg(c,loc,t);if(loc==='trail'){rect(c,0,143,768,93,'#4b514d');rect(c,0,140,768,6,'#aaa486');rect(c,0,235,768,7,'#beb296');for(let x=0;x<768;x+=92)rect(c,x+14,184,49,4,'#ead3a7');rect(c,38,118,130,18,'#7f674f');rect(c,42,121,123,11,'#e6d3a5');c.fillStyle='#6a5842';c.font='bold 12px monospace';c.fillText('WATCH FOR CARS!',48,130);}};
function v4DrawCars(c,ms){for(const a of v4RoadCars){const x=a.x,y=a.y;rect(c,x-45,y-18,90,35,a.speed>0?'#ba715f':'#7795a6');rect(c,x-18,y-34,48,19,'#e3d5b4');rect(c,x-35,y+11,15,11,'#252e30');rect(c,x+19,y+11,15,11,'#252e30');rect(c,x-39,y-7,8,7,'#fae3ad');rect(c,x+30,y-7,8,7,'#ffe8c7');}}
function v4UpdateCars(dt){if(paused)return;for(const car of v4RoadCars){car.x+=car.speed*dt;if(car.speed>0&&car.x>830)car.x=-120;if(car.speed<0&&car.x< -120)car.x=830;const px=state.playerPos[0],py=state.playerPos[1];if(Math.abs(px-car.x)<43&&Math.abs(py-car.y)<27){v4RoadHit(car);break;}}}
function v4RoadHit(car){if(state.dead||state.cheats.god)return;state.traffic.hits++;state.needs.health=clamp(state.needs.health-57);state.needs.energy=clamp(state.needs.energy-38);state.playerPos=[clamp(car.x-70,55,700),278];log('A moving vehicle struck the cub at the Human Trail road. Mama may need to help.');say('you','Ow! I should never run into the road!');v4Flash('ROAD COLLISION!');if(state.needs.health<=0){state.dead=true;openModal('A little life ended','<p>Your cub died after being struck by a vehicle. This is a serious, non-graphic ending. Load a saved story or use the developer menu to revive.</p>',[{text:'MAIN MENU',action:()=>{closeModal();v4ShowMenu();}},{text:'REVIVE WITH CHEATS',action:()=>{closeModal();devAction('revive');}}]);}else{notify('Injured! Seek Mama in the den.');}save();render();}
// Swimming: visible danger tied to position, skill, energy and a current.
function v4CheckWater(dt){const x=state.playerPos[0],y=state.playerPos[1],isWater=x>204&&x<601&&y>183;if(!isWater)return;state.tracker.swimming+=(dt*1.5);state.needs.energy=clamp(state.needs.energy-dt*(3.8-state.tracker.lessons*.3));const current=(Math.sin(animationTime/19)+1)*dt*17;state.playerPos[1]=clamp(y+current,135,410);if(state.needs.energy<14&&Math.random()<dt*.65){state.needs.health=clamp(state.needs.health-11);log('The current swept the exhausted cub underwater.');say('you','Help! The current is too strong!');state.playerPos=[145,294];if(state.needs.health<=0){state.dead=true;openModal('The river took a little cub','<p>Your exhausted cub was swept away by the current. The story has ended. You can return to the menu or revive using cheats.</p>',[{text:'MAIN MENU',action:()=>{closeModal();v4ShowMenu()}},{text:'REVIVE',action:()=>{closeModal();devAction('revive')} }]);}else notify('The river swept you to the bank. Be careful!');save();}}
function v4OpenFishing(){if(state.location!=='river')return notify('Fishing happens at Silverfin Riverside.');if(state.dead)return;const pole=quantity(state.inv,'fishingrod')>0;v4FishingActive=true;v4FishingStart=performance.now();v4FishingPower=0;const hint=pole?'Your fishing pole gives you a better chance.':'You only have your paws; timing will be harder. Ask Mama for a lesson.';openModal('FISHING AT SILVERFIN',`<p>${hint}</p><div class="v4FishingMeter"><span id="v4FishingNeedle" class="v4FishingNeedle"></span></div><p class="v4Tiny">The marker moves back and forth. Press REEL when it reaches the green center. You can also press Space.</p><p id="v4FishingStatus">Watch the ripples for a good moment...</p>`,[{text:'REEL IN! (SPACE)',action:()=>v4ReelFish()},{text:'LET IT GO',secondary:true,action:()=>{v4FishingActive=false;closeModal();}}]);v4AnimateFishMeter();}
function v4AnimateFishMeter(){if(!v4FishingActive)return;const el=$('v4FishingNeedle');if(!el)return;v4FishingPower=(Math.sin((performance.now()-v4FishingStart)/460)+1)/2;el.style.left=(v4FishingPower*100)+'%';requestAnimationFrame(v4AnimateFishMeter);}
function v4ReelFish(){if(!v4FishingActive)return;v4FishingActive=false;const pole=quantity(state.inv,'fishingrod')>0;const accuracy=Math.abs(v4FishingPower-.5);const success=accuracy<(pole?.24:.13)+state.tracker.lessons*.02;const status=success?'You caught a fresh fish!':'The fish darted away. Try another cast.';state.needs.energy=clamp(state.needs.energy-5);state.tracker.fishing++;if(success){add(state.inv,'freshfish',1);state.tracker.fishCaught++;}setPose('play',1200);log(status);closeModal();say('you',status);notify(status);tick();}
function v4MamaFishingLesson(){if(state.location!=='den')return notify('Ask Mama at her den.');if(state.mama.trust<24)return notify('Mama needs to feel safe taking you to the river.');if(state.phase===3)return notify('Mama is sleeping. Ask in the morning.');if(state.tracker.lessons>=2)return notify('Mama says: “Practice what I taught you, little fisher!”');state.tracker.lessons++;state.mama.memories.unshift('D'+state.day+': Taught '+v4Name()+' to fish together at Silverfin Riverside.');if(state.needs.energy<9)return notify('Mama says: Rest first. We need energy for the river.');const travelled=travel('river',false);if(travelled){state.needs.energy=clamp(state.needs.energy-6);log('Mama escorted you to Silverfin and taught you how to watch the current and reel a fish.');say('mama','Watch the water, cub. Fishing takes patience and practice.');if(quantity(state.inv,'fishingrod')===0){add(state.inv,'fishingrod',1);log('Mama lent you a small fishing pole to practice.');}tick();notify('FISHING LESSON: timing is now easier!');}}
function v4PlayChoice(){const nearby=state.npcs.filter(n=>n.location===state.location);if(!nearby.length){say('you','Nobody is around for a wrestling match.');return;}state.chosen=nearby[0].id;reactToSocial('wrestle');}
function v4TraderHere(){return state.location==='trail'&&(state.day%3===0||state.cheats?.on&&state.storyFlags.forceTrader);}
function v4ShowTrader(){if(!v4TraderHere())return notify('The wandering trader is elsewhere today.');state.trader.met=true;const offers=Object.entries(state.trader.stock).filter(([,n])=>n>0);const body=`<p>An older bear watches the road. “This isn't a shop for little cubs. What do you have?” His goods are dangerous, often prohibited, and adults may investigate him.</p><p><b>Your human coins:</b> ${state.money} · <b>Trader's remaining coins:</b> ${state.trader.wallet}</p><h3 class="subhead">BUY CONTRABAND (DANGEROUS)</h3><div class="v4OptionStack">${offers.map(([id,n])=>`<button data-tradebuy="${id}">${h(items[id].name)} · ${v4TraderPrice(id,'buy')} coins · stock ${n}</button>`).join('')}</div><h3 class="subhead">SELL HUMAN FINDS</h3><div class="v4OptionStack">${Object.keys(state.inv).filter(id=>quantity(state.inv,id)>0&&(VAPES.has(id)||id==='key'||id==='postcard'||id==='ticket'||id==='compass')).map(id=>`<button data-tradesell="${id}">${h(items[id].name)} · ${v4TraderPrice(id,'sell')} coins</button>`).join('')||'<p>Nothing unusual to sell.</p>'}</div>`;openModal('THE WANDERING TRADER',body,[{text:'LEAVE',action:closeModal}]);document.querySelectorAll('[data-tradebuy]').forEach(b=>b.onclick=()=>v4TraderDeal('buy',b.dataset.tradebuy));document.querySelectorAll('[data-tradesell]').forEach(b=>b.onclick=()=>v4TraderDeal('sell',b.dataset.tradesell));}
function v4TraderPrice(id,type){const cost=Math.max(3,Math.round((base[id]||12)/3));return type==='buy'?cost*2+3:cost;}
function v4TraderDeal(type,id){if(!items[id])return;if(type==='buy'){const price=v4TraderPrice(id,'buy');if(!state.trader.stock[id]||state.money<price){notify('Not enough money, or the trader is out of stock.');return;}if(count(state.inv)>=capacity()){notify('Your backpack is full.');return;}state.money-=price;state.trader.wallet+=price;add(state.trader.stock,id,-1);add(state.inv,id,1);state.mama.suspicion=clamp(state.mama.suspicion+12);log(`The adult trader illegally sold ${items[id].name} to a cub for ${price} coins. This created risk of discovery.`);}
 else{const price=v4TraderPrice(id,'sell');if(quantity(state.inv,id)<1||state.trader.wallet<price){notify('The trader cannot pay or the item is unavailable.');return;}add(state.inv,id,-1);add(state.trader.stock,id,1);state.trader.wallet-=price;state.money+=price;state.mama.suspicion=clamp(state.mama.suspicion+6);log(`You sold ${items[id].name} to the wandering trader for ${price} coins.`);}
 save();render();v4ShowTrader();}
function v4MaybeOrphan(){if(state.orphan.status!=='not-found'||state.day<4)return;const p=.014;if(rng()<p){state.orphan.status='found';state.orphan.foundDay=state.day;log('MYTHIC ENCOUNTER: an orphaned newborn brown bear cub lies beside the road near its deceased mother. The cub needs immediate help.');say('you','Oh no... that baby is all alone.');notify('RARE DISCOVERY: A newborn needs help at the road!');}}
function v4ForceOrphan(){if(state.orphan.status!=='not-found')return notify('This story encounter already happened.');state.orphan.status='found';state.orphan.foundDay=state.day;if(state.location!=='trail')travel('trail',true);log('DEV: force-spawned the rare orphan encounter.');save();render();}
function v4OrphanDialogue(){if(state.orphan.status!=='found')return;const body='<p>A tiny newborn brown bear lies near its mother, who has died. It is cold, hungry and far too young to survive alone. What will you do?</p><div class="v4OptionStack"><button data-orphan="carry">♡ Pick up and carry the newborn</button><button data-orphan="mama">🏠 Seek Mama’s help right away</button><button data-orphan="leave">Leave for now (the newborn remains in danger)</button></div>';openModal('AN ORPHANED NEWBORN',body,[{text:'CLOSE',action:closeModal}]);document.querySelectorAll('[data-orphan]').forEach(b=>b.onclick=()=>{const choice=b.dataset.orphan;closeModal();if(choice==='carry'){state.orphan.status='carried';state.orphan.warmth=clamp(state.orphan.warmth+12);log('You carefully picked up the newborn and are carrying it toward safety.');say('you','I have you, baby. We need Mama.');}if(choice==='mama'){state.orphan.status='carried';travel('den');v4AdoptOrphan();}if(choice==='leave')log('You left the newborn temporarily. The baby remains in danger by the road.');save();render();});}
function v4AdoptOrphan(){if(state.orphan.status!=='carried')return;state.orphan.status='mama';state.orphan.seenByMama=true;state.orphan.warmth=100;state.orphan.food=100;state.mama.memories.unshift('D'+state.day+': '+v4Name()+' brought an orphaned newborn home.');state.mama.trust=clamp(state.mama.trust+8);log('Mama accepted the orphaned newborn into her den and began feeding and warming the baby.');say('mama','Poor tiny one. I will look after you. You did the right thing bringing the baby here.');notify('NEW FAMILY MEMBER: The newborn is safe with Mama!');}
function v4CheckOrphanNeeds(dt){if(!state?.orphan||!['found','carried'].includes(state.orphan.status))return;const o=state.orphan;o.warmth=clamp(o.warmth-dt*(o.status==='carried'?.5:1.2));o.food=clamp(o.food-dt*.65);if(o.warmth<12||o.food<12){if(state.day>o.foundDay+2){o.status='lost';log('The vulnerable newborn did not survive without sufficient adult care.');notify('The orphaned baby has died.');}}}
const v4OldDev=devAction;devAction=function(id){if(id==='orphan')return v4ForceOrphan();if(id==='trader'){state.storyFlags.forceTrader=!state.storyFlags.forceTrader;state.cheats.on=true;log('DEV: wandering trader visibility toggled.');save();render();return;}if(id==='coins'){state.money+=25;state.cheats.on=true;save();render();return;}if(id==='fish'){state.location='river';state.playerPos=[150,300];openModal('Fishing test', '<p>At the river. Ready for a fishing test?</p>',[{text:'CAST',action:()=>{closeModal();v4OpenFishing();}}]);save();render();return;}return v4OldDev(id);};
const v4OldShowDev=showDev;showDev=function(){v4OldShowDev();const grid=$('modalBody').querySelector('.v3ModalGrid');if(grid){for(const [id,label] of [['orphan','✦ Force newborn encounter'],['trader','◈ Toggle wandering trader'],['coins','⛁ Give 25 coins'],['fish','♒ Test fishing minigame']]){const b=document.createElement('button');b.textContent=label;b.onclick=()=>{closeModal();devAction(id);};grid.appendChild(b);}}};
const v4OldRenderDialogue=renderDialogue;renderDialogue=function(){v4OldRenderDialogue();if(state.location==='den'&&$('tab-mama')){const panel=$('tab-mama');if(panel&&!panel.querySelector('#v4FishingLesson')){const b=document.createElement('button');b.className='miniBtn';b.id='v4FishingLesson';b.textContent='♡ Beg Mama to teach you fishing at the river';b.onclick=v4MamaFishingLesson;panel.prepend(b);}}};
const v4OldRenderV2=renderV2;renderV2=function(){v4OldRenderV2();if($('tab-mama')&&!$('v4FishingLesson')){const b=document.createElement('button');b.id='v4FishingLesson';b.className='miniBtn';b.textContent='♡ Ask Mama for a fishing lesson (travel together)';b.onclick=v4MamaFishingLesson;$('tab-mama').prepend(b);}};
// Rewire v4 top bar controls. Original v3 queueMicrotasks keep older offscreen hooks working.
queueMicrotask(()=>{$('v4MainBtn').onclick=v4ShowMenu;$('v4MoreBtn').onclick=v4ShowMore;$('v4ControlsBtn').onclick=v4Controls;$('v4HelpBtn').onclick=()=>{state.tutorial={enabled:true,step:0,completed:false};notify('Tutorial objective guidance restarted.');render();};$('v3Dev').onclick=showDev;$('v3Backpack').onclick=openBackpack;});
// Every animation frame moves the character and hazards; v3's rendering still runs separately.
function v4Raf(ms){if(ms-v4LastAutosave>3000&&state&&!v4MenuIsOpen){save();v4LastAutosave=ms;}if(!v4LastFrame)v4LastFrame=ms;v4MotionFrame(ms);if(v4MenuIsOpen||v4CreatorIsOpen)v4LastFrame=ms;requestAnimationFrame(v4Raf);}requestAnimationFrame(v4Raf);
// Extend public inspection API for automated regression scenarios and player QA.
const v4ExistingApi=window.LittleTradingPost;window.LittleTradingPost={...v4ExistingApi,devAction,travel,version:V4_VERSION,getState:()=>JSON.parse(JSON.stringify(state)),newGame:()=>{state=fresh();state.characterMade=true;state.avatar.name='Tester';state.location='den';state.playerPos=[345,327];save();render();},menu:v4ShowMenu,continue:v4Continue,creator:v4ShowCreator,interact:v4InteractNearest,backpack:openBackpack,fish:v4OpenFishing,fishReel:v4ReelFish,orphan:v4ForceOrphan,orphanTalk:v4OrphanDialogue,trader:v4ShowTrader,tradeDealer:v4TraderDeal,mamaLesson:v4MamaFishingLesson,setPosition:(x,y)=>{state.playerPos=[x,y];save();},press:(k)=>{v4Keys.add(k);},release:(k)=>{v4Keys.delete(k);},unique:v4UniqueAction,v4Ensure:ensureV4};
opening=function(){v4ShowMenu();};

