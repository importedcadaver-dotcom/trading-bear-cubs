/* The Little Trading Post v3: additive world-and-agency expansion.
   Runs within the existing game's closure, before load(); all v1/v2 state and barter logic remain. */
const WORLD={
 post:{name:'Whisperwood Clearing',short:'Trading post',x:360,y:235,color:'#89aa7d',links:['den','playground','rival','woods'],cost:1,objects:[['Your stall',178,252,'stall'],['Notice board',338,145,'notice'],['Market gate',676,320,'gate']]},
 den:{name:"Mama's Den",short:'Family den',x:240,y:320,color:'#b39575',links:['post','pebble','river'],cost:1,objects:[['Family food pile',217,273,'food'],['Soft sleeping nest',458,303,'nest'],['Secret nook',630,275,'hide'],['Den exit',712,193,'exit']]},
 pebble:{name:"Pebble's Secret Hollow",short:"Pebble's spot",x:137,y:190,color:'#739b81',links:['den','river','woods'],cost:1,objects:[['Root hideout',195,258,'hide'],['Very important rock',474,223,'treasure'],['Hollow exit',715,302,'exit']]},
 river:{name:'Silverfin Riverside',short:'Riverside',x:325,y:122,color:'#72aeb6',links:['den','pebble','woods','trail'],cost:2,objects:[['Clear water',411,326,'drink'],['Fishing shallows',590,285,'fish'],['River stones',178,287,'gather']]},
 woods:{name:'Deep Woodland',short:'Woodland',x:450,y:96,color:'#658e72',links:['post','pebble','river','trail','playground'],cost:2,objects:[['Fallen old log',535,282,'logs'],['Berry bushes',205,286,'grove'],['Hollow stump',352,192,'hide']]},
 playground:{name:'Cubs’ Playground',short:'Playground',x:538,y:270,color:'#aec38f',links:['post','woods','rival'],cost:1,objects:[['Wrestling patch',403,301,'play'],['Swinging branch',598,230,'play'],['Resting bench',169,290,'rest']]},
 rival:{name:"Moss's Rival Market",short:'Rival market',x:649,y:320,color:'#b79c71',links:['post','playground','trail'],cost:1,objects:[['Moss’s sales table',279,265,'rival'],['Rumor sign',566,214,'notice'],['Public meeting spot',497,332,'play']]},
 trail:{name:'Forgotten Human Trail',short:'Human trail',x:635,y:110,color:'#a6a18a',links:['woods','river','rival'],cost:2,objects:[['Littered picnic spot',290,290,'trail'],['Old signpost',567,230,'notice'],['Bramble hiding place',465,355,'hide']]}
};
const TIERS=[['common',50],['uncommon',27],['rare',14],['epic',6],['legendary',2.5],['mythic',.5]];
const raritySets={uncommon:['feather','shell','button','fish','freshfish','wood','rope','clay','driedfish','water','apple','basket','ball','boat','cup','pinecone','wovenmat'],rare:['stone','quartz','marble','thimble','bell','jam','meal','dice','crown','drum','necklace','paintedstone','lantern','shovel','fishingrod','map','kite','birdhouse'],epic:['amber','compass','key','postcard','sticker','ticket'],legendary:['fishstone']};
for(const [id,obj]of Object.entries(items))obj.rarity=Object.entries(raritySets).find(([,ids])=>ids.includes(id))?.[0]||(id==='vape'?'mythic':'common');
const MYTHIC_VARIANTS={
 vape_berry:['Wildberry-labelled vape','#bc618d','Discarded human device marked “Wildberry”. The sweet label does not make nicotine safe.'],
 vape_frost:['Frost-labelled vape','#79b4cb','Discarded human device marked “Frost”. A dangerous nicotine object, not a toy.'],
 vape_citrus:['Citrus-labelled vape','#e1aa54','Discarded human device marked “Citrus”. An unsafe human artifact.']
};
for(const [id,[name,color,desc]]of Object.entries(MYTHIC_VARIANTS)){items[id]={name,short:name.toLowerCase(),plural:name+'s',color,desc,category:'Human',usage:'artifact',rarity:'mythic'};base[id]=39;}
const VAPES=new Set(['vape',...Object.keys(MYTHIC_VARIANTS)]);
const rareItems=Object.keys(items).filter(id=>['rare','epic','legendary','mythic'].includes(items[id].rarity));
const origin={post:[193,346],den:[348,326],pebble:[344,322],river:[310,243],woods:[385,330],playground:[360,325],rival:[363,315],trail:[320,344]};
const scenesDefault={fern:'den',pebble:'den',waffle:'post',juniper:'woods',sprout:'playground',moss:'rival'};
let mapOpen=false,worldHotspots=[],lastTalk='',dialogueBubble=null,moveSteps=[],playerMoving=false,pendingInteraction=null,activeSearch='all',lastRarityResult='';
function ensureV3(s){
 if(!s)return s;if(s.v3===3){s.hiddenAt=s.hiddenAt||{};s.hiddenAt.post=s.hidden;return s;}
 s.v3=3;s.location=s.location||'post';s.playerPos=origin[s.location].slice();s.knownSecrets=s.knownSecrets||{};s.familyPromises=s.familyPromises||{pebble:0,fern:0};s.jealousy=s.jealousy||{};
 s.hiddenAt=s.hiddenAt||{};for(const id of Object.keys(WORLD))s.hiddenAt[id]=s.hiddenAt[id]||{};s.hiddenAt.post=s.hidden;s.dead=false;s.hardMode=true;s.cheats=s.cheats||{on:false,god:false,infinite:false};s.history=Array.isArray(s.history)?s.history:[];s.mapVisits=s.mapVisits||{post:1};s.dialogueHistory=s.dialogueHistory||[];s.mamaAware=false;s.rescueCheckDay=0;
 s.npcs.forEach(n=>{n.hiddenInv=n.hiddenInv||{};n.cacheLocByItem=n.cacheLocByItem||{};n.reservedInv=n.reservedInv||{};n.knowledge=n.knowledge||{};n.secretKnown=false;n.enviousOf=n.enviousOf||null;n.rarityFinds=n.rarityFinds||0;n.location=scenesDefault[n.id];n.worldPos=origin[n.location].map((v,i)=>v+(i?0:(n.id==='pebble'?90:n.id==='fern'?-80:n.id==='sprout'?-65:55)));n.worldTarget=n.worldPos.slice();});
 s.history.unshift({day:s.day,phase:phaseNames[s.phase||0],loc:'post',cat:'system',text:'v3 world unlocked: eight real scenes, maps, secrets and deeper family life.'});return s;
}
const priorFreshV3=fresh,priorLoadV3=load;
fresh=function(){return ensureV3(priorFreshV3())};
load=function(){priorLoadV3();ensureV3(state);sanitize();};
const priorLogV3=log;
log=function(message){priorLogV3(message);if(state&&Array.isArray(state.history))state.history.push({day:state.day,phase:phaseNames[state.phase||0],loc:state.location||'post',cat:classifyEvent(message),text:String(message),stamp:state.tick||0});};
function classifyEvent(m){m=m.toLowerCase();return /mama|den|sibling|littermate|pebble.*brother/.test(m)?'family':/traded|trade|offer|fee|market|deal|stall/.test(m)?'trading':/found|explored|discovered|forag|rare|myth/.test(m)?'discoveries':/wrestl|chase|friend|argu|play|jealous|threat|snitch/.test(m)?'social':/built|craft|constructed/.test(m)?'building':/said|told|asked|whispered|“|”/.test(m)?'dialogue':'world'}
function say(who,text){lastTalk=`${who==='you'?'You':who==='mama'?'Mama':state.npcs.find(n=>n.id===who)?.name||who}: ${text}`;dialogueBubble={who,text,until:Date.now()+4200};log(`“${text}” — ${who==='you'?'You':who==='mama'?'Mama':state.npcs.find(n=>n.id===who)?.name||who}`);if($('storyCaption'))$('storyCaption').textContent=lastTalk;}
function rollTier(){let r=rng()*100;for(const [name,w]of TIERS){r-=w;if(r<0)return name}return 'common'}
function selectedRarityLoot(area){const pool=area==='trail'?['stick','acorn','leaf','twig','button','ribbon','key','marble','thimble','compass','postcard','sticker','ticket','fishstone',...VAPES]:area==='stream'?['stick','leaf','mossmat','water','freshfish','clay','shell','quartz','stone','fishstone','amber']:area==='logs'?['stick','twig','wood','mossmat','rope','leaf','pinecone','quartz','amber']:area==='grove'?['berry','apple','honey','leaf','mushroom','pinecone','roots','stone','amber']:Object.keys(items).filter(x=>!VAPES.has(x));const tier=rollTier();const possible=pool.filter(x=>items[x]&&items[x].rarity===tier);const id=randomOf(possible.length?possible:pool.filter(x=>items[x]&&items[x].rarity==='common').length?pool.filter(x=>items[x].rarity==='common'):pool);lastRarityResult=tier;return id;}
function route(from,to){const q=[[from]];const done=new Set([from]);while(q.length){const p=q.shift(),here=p[p.length-1];if(here===to)return p;for(const k of WORLD[here].links)if(!done.has(k)){done.add(k);q.push([...p,k])}}return null}
function travel(to,cheat=false){if(!WORLD[to])return false;if(state.dead)return notify('Your story has ended. Use the developer menu or reset to start anew.');if(state.location===to){mapOpen=false;render();return true;}
 const path=route(state.location,to);if(!path)return false;
 const cost=path.slice(1).reduce((n,k)=>n+WORLD[k].cost*3,0);if(!cheat&&!state.cheats?.god&&state.needs.energy<cost){say('you','Too tired for the journey. I need food or rest.');return notify('You need '+cost+' energy to make that trip.');}
 const from=WORLD[state.location].name;pendingInteraction=null;if(!cheat){state.needs.energy=clamp(state.needs.energy-cost);updateNeeds(Math.max(1,path.length-1));}
 state.location=to;state.mapVisits[to]=(state.mapVisits[to]||0)+1;state.playerPos=origin[to].slice();moveSteps=[];mapOpen=false;
 if(!cheat)for(let i=1;i<path.length;i++){state.tick++;state.phaseActs++;if(state.phaseActs>=phaseCosts[phase()])progressPhase();npcWorldAction();}
 log(`You followed ${path.length-1} woodland path${path.length>2?'s':''} from ${from} to ${WORLD[to].name}. Travel cost: ${cheat?'cheat':cost+' energy'}.`);
 say('you',to==='den'?"Mama, I'm home!":`Made it to ${WORLD[to].short}!`);
 document.querySelector('.worldLabel').textContent='✿ '+WORLD[to].name.toUpperCase();save();render();return true;}
function scheduleV3(){
 for(const n of state.npcs){let desired=scenesDefault[n.id];const day=state.day,ph=phase();
 if(n.id==='pebble')desired=ph===3||ph===0?'den':day%3===0?'river':ph===1?'pebble':'post';
 if(n.id==='fern')desired=ph===3||ph===0?'den':ph===1?'post':'playground';
 if(n.id==='moss')desired=ph===3?'rival':day%4===0&&ph===1?'trail':day%2===0&&ph===1?'post':'rival';
 if(n.id==='waffle')desired=ph===3?'playground':ph<=1?'post':'playground';
 if(n.id==='sprout')desired=ph===3?'playground':ph===1&&day%2===0?'post':'playground';
 if(n.id==='juniper')desired=ph===3?'woods':ph===1&&day%9===0?'trail':ph===1&&day%2===0?'post':'woods';
 if(n.location!==desired){n.location=desired;n.worldPos=origin[desired].slice();n.worldTarget=n.worldPos.slice();n.worldPos[0]+=({fern:-96,pebble:90,waffle:-95,juniper:95,sprout:-50,moss:135}[n.id]||0);n.worldTarget[0]=n.worldPos[0];}
 }}
// A social action cannot take place between characters in different physical locations.
bumpSocial=function(){const pairs=[];for(const a of state.npcs)for(const b of state.npcs)if(a.id<b.id&&a.location===b.location&&WORLD[a.location])pairs.push([a,b]);if(!pairs.length)return false;
 const [a,b]=randomOf(pairs),kind=phase()===3?'nap':a.temper==='competitive'&&rng()<.4?'argue':randomOf(['wrestle','chat','play','share','gather']);a.activity=b.activity=kind;
 const delta=kind==='argue'?-1:1;a.relTo[b.id]=clamp((a.relTo[b.id]||0)+delta,-6,10);b.relTo[a.id]=a.relTo[b.id];a.energy=clamp(a.energy-(kind==='wrestle'?8:2));b.energy=clamp(b.energy-(kind==='wrestle'?8:2));
 if(kind==='share'){const id=Object.keys(a.inv).find(k=>quantity(a.inv,k)>0);if(id){add(a.inv,id,-1);add(b.inv,id,1);log(`${a.name} shared ${items[id].name} with ${b.name} at ${WORLD[a.location].name}.`);}}
 else if(kind==='gather'&&count(a.inv)<12){const id=randomOf(['berry','stick','leaf','twig']);add(a.inv,id,1);log(`${a.name} gathered ${items[id].name} while exploring with ${b.name} at ${WORLD[a.location].name}.`);}
 else log(`${a.name} and ${b.name} ${kind==='argue'?'argued':kind==='nap'?'napped':kind+'d'} together at ${WORLD[a.location].name}.`);
 a.memory.unshift(`D${state.day}: ${kind} with ${b.name} at ${WORLD[a.location].short}`);b.memory.unshift(`D${state.day}: ${kind} with ${a.name}`);a.memory=a.memory.slice(0,16);b.memory=b.memory.slice(0,16);return true;};
const previousNpcWorldActionV3=npcWorldAction;
npcWorldAction=function(){scheduleV3();if(rng()<.28)bumpSocial();if(rng()<.47)npcTrade();if(rng()<.24)npcDiscover();if(rng()<.21){const n=randomOf(state.npcs);if(count(n.hiddenInv)<3&&Object.keys(n.inv).length){const picks=Object.keys(n.inv).filter(k=>quantity(n.inv,k)>0&&['rare','epic','legendary','mythic'].includes(items[k].rarity));if(picks.length){const id=randomOf(picks);add(n.inv,id,-1);add(n.hiddenInv,id,1);n.cacheLocByItem[id]=n.location;log(`${n.name} hid a valuable treasure in a secret cache at ${WORLD[n.location].name}.`);}}}};
function npcDiscover(forceId){const n=forceId?state.npcs.find(n=>n.id===forceId):randomOf(state.npcs);if(!n||count(n.inv)+count(n.hiddenInv)>18)return false;
 const place=n.location==='river'?'stream':n.location==='trail'?'trail':n.location==='woods'||n.location==='pebble'?'logs':n.location==='post'?'grove':'grove';
 const id=selectedRarityLoot(place);if(!items[id])return false;
 if(['epic','legendary','mythic'].includes(items[id].rarity)||rng()<.8){const hide=['legendary','mythic'].includes(items[id].rarity)||rng()<.14;add(hide?n.hiddenInv:n.inv,id,1);if(hide)n.cacheLocByItem[id]=n.location;n.rarityFinds++;n.craving=id;if(['epic','legendary','mythic'].includes(items[id].rarity)&&!hide)n.reservedInv[id]=true;n.enviousOf=null;for(const other of state.npcs.filter(x=>x.id!==n.id&&x.location===n.location))if(['rare','epic','legendary','mythic'].includes(items[id].rarity)&&rng()<.43){other.enviousOf=n.id;state.jealousy[other.id]=(state.jealousy[other.id]||0)+1;log(`${other.name} grew envious of ${n.name}'s ${items[id].name}.`);}
 log(`${n.name} independently discovered ${items[id].rarity.toUpperCase()} ${items[id].name} at ${WORLD[n.location].short}${hide?' and secretly put it away':''}.`);if(state.location===n.location&&!hide)say(n.id,`Look what I found! ${items[id].name}!`);return id;}return false;}
const previousNpcTradeV3=npcTrade;
npcTrade=function(){const pairs=[];for(const a of state.npcs)for(const b of state.npcs)if(a.id<b.id&&a.location===b.location&&WORLD[a.location])for(const x of Object.keys(a.inv).filter(k=>quantity(a.inv,k)>0&&!a.reservedInv[k]))for(const y of Object.keys(b.inv).filter(k=>quantity(b.inv,k)>0&&!b.reservedInv[k]&&x!==k)){const sa=itemVal(a,y)-itemVal(a,x),sb=itemVal(b,x)-itemVal(b,y);if(sa>=-1&&sb>=-1&&sa+sb>=2)pairs.push({a,b,x,y,score:sa+sb})}
 if(!pairs.length)return false;pairs.sort((a,b)=>b.score-a.score);const d=pairs[Math.floor(rng()*Math.min(5,pairs.length))];const here=d.a.location==='post';if(here&&(!entry(d.a)||!entry(d.b))){log(`${d.a.name} and ${d.b.name} were denied access to your post and postponed their deal.`);return false;}
 add(d.a.inv,d.x,-1);add(d.b.inv,d.y,-1);add(d.a.inv,d.y,1);add(d.b.inv,d.x,1);d.a.deals++;d.b.deals++;log(`${d.a.name} and ${d.b.name} traded ${items[d.x].name} for ${items[d.y].name} at ${WORLD[d.a.location].name}.`);if(d.a.location===state.location)say(d.a.id,`Trade accepted, ${d.b.name}!`);return true;};
const origNeogotiateV3=negotiate;
negotiate=function(){const n=npc();if(Object.keys(wanted).some(k=>n.reservedInv[k])){say(n.id,`I'm keeping that treasure. It's not for sale.`);clearSelectionsOnly();render();return;}if(state.location!==n.location)return notify(`${n.name} is at ${WORLD[n.location].short}. Travel to meet them first.`);if(state.location!=='post'){
 const a=count(offered),b=count(wanted);if(!a||!b)return notify('Pick items from both sides.');if(!canPay(state.inv,offered)||!canPay(n.inv,wanted))return notify('An item has moved. Refresh your trade.');if(count(state.inv)-a+b>capacity())return notify('Your bag is full.');const score=offerScore(n,offered,wanted)+n.rel*.85;
 if(score>=-1){spend(state.inv,offered);spend(n.inv,wanted);Object.entries(offered).forEach(([k,v])=>add(n.inv,k,v));Object.entries(wanted).forEach(([k,v])=>add(state.inv,k,v));n.rel=clamp(n.rel+1,-6,10);state.trades++;state.rep++;log(`Off-site barter with ${n.name} succeeded at ${WORLD[state.location].name}.`);say(n.id,'That seems fair to me!');}else{n.rel=clamp(n.rel-1,-6,10);say(n.id,"I won't accept that deal.");}clearSelectionsOnly();tick();return;
 }origNeogotiateV3();};
// Same extremely rare chance as v2 trail relic, but discovered specimens can have different fictional labels.
const oldForageZoneV3=forageZone;
forageZone=function(zone){const allowed={grove:['woods'],logs:['woods','pebble'],stream:['river'],trail:['trail']};if(!allowed[zone]?.includes(state.location))return notify(`To gather here, travel to ${WORLD[allowed[zone]?.[0]||'woods'].name} first.`);return oldForageZoneV3(zone);};
const originalUseV3=itemAction;
itemAction=function(id,action){if(state.dead)return notify('This cub cannot act after the story has ended.');if(VAPES.has(id)&&id!=='vape'&&action==='vape'){state.vapeUses++;state.dependence=clamp(state.dependence+5);state.needs.health=clamp(state.needs.health-12);state.needs.energy=clamp(state.needs.energy-9);state.mama.suspicion=clamp(state.mama.suspicion+15);setPose('vape',3400);specialParticles=Array.from({length:20},(_,i)=>({x:state.playerPos[0]+i%5*3,y:state.playerPos[1]-40,age:i*3}));log(`The cub used the dangerous ${items[id].name} device. A brief vapor animation, coughing and dizziness follow; health −12, energy −9.`);if(state.location==='den'){state.mama.trust=clamp(state.mama.trust-9);log('Mama witnessed the unsafe device and took disciplinary action.');}say('you','Cough! That was a terrible idea.');tick();return;}
 if(action==='mama'&&state.location!=='den')return notify('You must visit Mama in her den to show her an item.');
 if(action==='hide'){const local=state.location==='post'?state.hidden:state.hiddenAt[state.location];if(count(local)>=4+(state.upgrades.includes('storage')?6:0))return notify('This hiding place is full.');add(state.inv,id,-1);add(local,id,1);state.mama.suspicion=clamp(state.mama.suspicion+(state.location==='den'?5:2));log(`You hid ${items[id].name} in a persistent cache at ${WORLD[state.location].name}.`);setPose('sneak',1700);say('you','Nobody will notice my little hiding spot...');tick();return;}
 if(action==='store'&&state.location!=='post')return notify('Your lockable storage is at your own trading post. Hide this here or travel back.');
 return originalUseV3(id,action);};
function talkAction(what){if(state.dead)return notify('This cub cannot act.');const n=npc();if(n.location!==state.location){say('you',`${n.name} isn't here. The map shows where to go.`);return;}
 const sib=['pebble','fern'].includes(n.id),secret=Object.keys(n.hiddenInv).find(k=>n.hiddenInv[k]>0),visible=Object.keys(n.inv).find(k=>n.inv[k]>0),courage={sprout:2,fern:3,pebble:6,waffle:4,juniper:7,moss:8}[n.id];let response='';
 if(what==='chat'){response=sib?`We're littermates, you know! ${n.id==='pebble'?'You still owe me a wrestling rematch.':'Remember when Mama kept us warm?'}`:`I was ${n.activity} earlier. This forest is busy!`;n.rel=clamp(n.rel+0.25,-6,10);}
 if(what==='ask'){response=secret?(n.rel>7&&rng()<.35?`I secretly found ${items[secret].name}. Please keep it quiet!`:"I don't have any special treasures. Promise."):(visible?`I have ${items[visible].name}, yes. But it's mine.`:'I have nothing worth showing.');if(secret&&response.includes(items[secret].name))state.knownSecrets[n.id]=secret;}
 if(what==='persuade'){const chance=0.36+n.rel*.035+(sib?.13:0);if(rng()<chance&&visible){const good=visible;const cost=quantity(state.inv,'berry')>0?'berry':null;if(cost&&count(state.inv)<capacity()){add(state.inv,cost,-1);add(n.inv,cost,1);add(n.inv,good,-1);add(state.inv,good,1);response=`Okay. I'll exchange ${items[good].name} for a berry. Don't tell everyone!`;n.rel=clamp(n.rel+1,-6,10);}else response='Bring something to offer. Even siblings should trade fairly.';}else response="No, I really don't want to. Please respect that.";}
 if(what==='threaten'){const comply=rng()<Math.max(.07,.53-courage*.05+n.rel*.01);n.rel=clamp(n.rel-3,-6,10);state.mama.suspicion=clamp(state.mama.suspicion+8);if(comply&&visible){add(n.inv,visible,-1);add(state.inv,visible,1);response=`Fine! Take ${items[visible].name}! But I'm telling someone.`;n.memory.unshift(`D${state.day}: threatened by you`);state.mamaAware=true;}else{response=courage>5?"No! I won't let you bully me. I'm telling Mama!":"Stop! I'm going to get help!";state.mamaAware=true;state.mama.suspicion=clamp(state.mama.suspicion+12);}log(`You intimidated ${n.name}. Response: ${response}`);}
 if(what==='blackmail'){if(!state.knownSecrets[n.id])return notify('Blackmail requires real evidence of a secret. Ask questions or investigate first.');n.rel=clamp(n.rel-4,-6,10);n.memory.unshift(`D${state.day}: You threatened to expose a secret.`);response=rng()<.3&&visible?`I'll give you something, but I won't forget this.`:`Then tell everyone. I'm not letting you control me.`;if(response.startsWith("I'll")&&visible){add(n.inv,visible,-1);add(state.inv,visible,1);}else{state.mamaAware=true;state.mama.suspicion=clamp(state.mama.suspicion+8);}log(`You used knowledge of ${n.name}'s hidden ${items[state.knownSecrets[n.id]].name} in a coercive confrontation.`);}
 if(what==='accuse'){if(secret&&state.knownSecrets[n.id]===secret){response=`How did you know about my ${items[secret].name}? It's private!`;n.rel=clamp(n.rel-1,-6,10);}else{response='You have no proof. Please stop accusing me.';n.rel=clamp(n.rel-.7,-6,10);}}
 if(what==='apologize'){response=n.rel<0?"I still remember, but maybe we can start again.":"It's okay. We can play later.";n.rel=clamp(n.rel+1,-6,10);}
 if(what==='sibling'){if(!sib)return notify('This is a littermate-only conversation.');const score=n.rel+(state.familyPromises[n.id]||0);response=score>=3?"I'll help you keep your secret. We're family.":"You only remember we're siblings when you want something!";state.familyPromises[n.id]=(state.familyPromises[n.id]||0)+1;n.rel=clamp(n.rel+1,-6,10);n.memory.unshift(`D${state.day}: made a sibling promise with you`);}
 if(what==='wrestle'){actionCost(7,8);n.rel=clamp(n.rel+(n.age<=11?1:.5),-6,10);response=sib?"Ha! I know all your moves, littermate!":"I'll get you next time!";setPose('wrestle',2300);n.activity='wrestle';}
 if(!response)return;say(n.id,response);log(`You chose ${what} with ${n.name} (${n.age} months, ${sib?'littermate':'community cub'}). Trust is now ${n.rel.toFixed(1)}.`);n.memory.unshift(`D${state.day}: ${what} with you`);n.memory=n.memory.slice(0,30);if(what!=='ask')tick(1);else{save();render();}
 // Keep the direct conversation visible even if background NPC chatter happened on the same tick.
 dialogueBubble={who:n.id,text:response,until:Date.now()+4300};
 lastTalk=`${n.name}: ${response}`;if($('storyCaption'))$('storyCaption').textContent=lastTalk;
 }
function talkMama(type){if(state.location!=='den'){notify("Mama is in her den. Go there to talk to her.");return;}
 if(type==='sibling'){const p=state.npcs.find(n=>n.id==='pebble');state.mama.memories.unshift(`D${state.day}: You and Pebble needed a family talk.`);p.rel=clamp(p.rel+1,-6,10);state.mama.trust=clamp(state.mama.trust+2);say('mama','You two are littermates. Be kind to one another.');tick();return;}
 mamaAction(type);say('mama',type==='food'?"Here, cub. Eat something before you go out.":type==='hug'?"Come here, little one.":"I'm keeping an eye on you, cub.");}
// Visual-first layout: make the game canvas the hero and keep a clickable item hotbar above the fold.
const v3Style=document.createElement('style');v3Style.textContent=`
.site{max-width:1760px;padding:10px 14px 40px}.masthead{margin-bottom:7px;padding:4px 6px 8px}.brandmark{width:50px;height:50px}.brandmark canvas{width:38px;height:38px}.brand h1{font-size:clamp(18px,2vw,27px);line-height:.94}.brand p{font-size:11px}.eyebrow{font-size:9px}.stat{min-width:80px;padding:5px}.stat b{font-size:16px}
.mainGrid{grid-template-columns:minmax(0,1fr) minmax(320px,380px);gap:12px}.leftColumn,.rightColumn{min-width:0}.worldFrame canvas{max-height:none;width:100%;aspect-ratio:768/434}.worldFrame{border-width:4px}.panel{max-height:calc(100vh - 101px);overflow:auto}.tab{font-size:10px}.tabs .tab{flex-basis:30%}
.worldHelp{padding:6px 12px}.ribbon{min-height:35px;padding:5px 10px}.sceneInfo{padding:9px;margin-top:9px}.leftColumn .sceneInfo{display:none}.leftColumn .inventoryPanel{display:none}.vitals{margin:6px 0;padding:7px 11px}.vital .bar{margin:3px 0}.vitalsHead{margin-bottom:3px}
.v3Nav{display:flex;gap:5px;align-items:center;overflow:auto;max-width:100%;width:100%;min-width:0;padding:6px 3px;background:#dce7cc;border:2px solid #68866b;border-top:0}.v3Nav button,.v3Tools button{border:1px solid #6d896d;background:#fff6dc;color:#284e38;padding:7px 9px;font:800 11px 'Trebuchet MS',sans-serif;white-space:nowrap;min-height:32px}.v3Nav button.active{background:#c6d9ad;border-color:#3d664e}.v3Nav button:hover{background:#f3d6a2}
.v3Hotbar{margin-top:7px;padding:6px 8px;background:#f7edd1;border:2px solid #7f9874;box-shadow:3px 3px 0 #c6c2a4;display:flex;align-items:center;gap:7px;min-height:72px}.v3Hotbar>strong{font:800 11px monospace;min-width:63px;color:#355745}.hotItems{display:flex;gap:5px;overflow:auto;min-width:0;flex:1}.hotItem{flex:0 0 57px;min-height:57px;background:#fffaf0;border:2px solid #d1c6a8;position:relative;padding:2px;cursor:pointer}.hotItem canvas{image-rendering:pixelated;width:32px;height:32px;display:block;margin:auto}.hotItem small{font-size:9px;display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;max-width:52px}.hotItem i{position:absolute;right:1px;top:1px;font:900 9px monospace;background:#537656;color:#fff;padding:1px 3px}.hotItem.chosen{border-color:#b97047;background:#f2d79f}
.v3Tools{display:flex;gap:6px;margin-top:7px;flex-wrap:wrap;align-items:center}.v3Tools button{background:#e7f0de}.v3Tools #storyCaption{flex:1;font-size:12px;color:#456448;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:60ch}.worldFrame .worldLabel{top:9px;left:10px}.worldFrame .worldStamp{bottom:9px;right:9px}
#mapPanel{position:absolute;inset:0;background:#13271a50;z-index:4;display:none;align-items:center;justify-content:center}#mapPanel.show{display:flex}#mapPanel .mapCard{width:min(96%,640px);max-height:94%;overflow:auto;background:#f5edcf;border:4px solid #244735;padding:10px;box-shadow:7px 7px 0 #0a1d1c99}#mapPanel h3{font:900 18px 'Courier New',monospace;margin:0 0 8px;color:#264f3c}#mapPanel .mapEntries{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}.mapEntries button{border:2px solid #bdad85;background:#fff8e5;text-align:left;padding:8px;font:800 12px 'Trebuchet MS',sans-serif;color:#2b523c}.mapEntries button.active{border-color:#527d56;background:#d6e9cb}.mapEntries small{display:block;color:#6b836e;font:10px monospace;margin-top:4px}
.v3ModalGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.v3ModalGrid button{border:2px solid #9aac87;background:#edf2df;padding:9px;text-align:left;font-size:12px;color:#294936}.v3ModalGrid button b{display:block}.v3ModalGrid button small{display:block;font-size:10px;color:#789074}
#tab-dialogue .v3Dialog{background:#edf2de;padding:12px;border:1px solid #bacbaf;margin:7px 0}#tab-dialogue .talkGrid{display:grid;grid-template-columns:repeat(2,1fr);gap:7px}#tab-dialogue .talkGrid button{background:#eee7ca;border:2px solid #abb79c;padding:9px;font-size:12px;color:#35543d;text-align:left}#tab-dialogue .talkGrid button:hover{background:#d7e9cf}
#tab-history .logEntry{border-bottom:1px dashed #c8cdb6;padding:7px 5px;font-size:11px;line-height:1.4}#tab-history .logEntry b{color:#436c51}#tab-history .logFilters{display:flex;gap:4px;overflow:auto;margin:8px 0}#tab-history .logFilters button{font-size:10px;border:1px solid #bdc9a9;background:#eef3df;padding:6px}#tab-history .logFilters button.on{background:#e6b976}
@media(max-width:1100px){.mainGrid{grid-template-columns:minmax(0,1fr) minmax(300px,350px)}.site{padding:9px}.rightColumn .panel{max-height:none}}
@media(max-width:850px){.mainGrid{display:flex;flex-direction:column}.leftColumn{display:contents}.leftColumn .ribbon{order:0}.leftColumn .v3Nav{order:1}.leftColumn .worldFrame{order:2}.leftColumn .worldHelp{order:3}.leftColumn .v3Hotbar{order:4}.leftColumn .v3Tools{order:5}.leftColumn .vitals{order:6}.rightColumn{order:7!important}.rightColumn .panel{max-height:none}.leftColumn .inventoryPanel,.leftColumn .sceneInfo{display:none}.site{padding:6px}}
@media(max-width:540px){.masthead{margin-bottom:4px}.brandmark{width:42px;height:42px}.brand h1{font-size:21px}.mastRight{gap:4px}.stat{min-width:0}.worldFrame{border-width:2px}.v3Nav button{font-size:10px}.v3Hotbar>strong{font-size:10px;min-width:42px}.hotItem{flex-basis:49px}.hotItem small{max-width:44px}.mapEntries button{padding:5px;font-size:10px}.v3Tools #storyCaption{width:100%;flex-basis:100%}}
`;document.head.appendChild(v3Style);
const sceneContainer=document.querySelector('.worldFrame');const mapLayer=document.createElement('div');mapLayer.id='mapPanel';sceneContainer.appendChild(mapLayer);
const nav=document.createElement('nav');nav.className='v3Nav';nav.id='travelNav';nav.setAttribute('aria-label','Locations and travel');document.querySelector('.ribbon').after(nav);
const hotbar=document.createElement('div');hotbar.className='v3Hotbar';hotbar.id='v3Hotbar';document.querySelector('.worldHelp').after(hotbar);
const toolsBar=document.createElement('div');toolsBar.className='v3Tools';toolsBar.innerHTML='<button id="v3Map">🗺 WORLD MAP <kbd>M</kbd></button><button id="v3Backpack">🎒 BACKPACK <kbd>I</kbd></button><button id="v3Dev">⚙ CHEATS & DEBUG</button><button id="v3History">☷ COMPLETE LOG</button><span id="storyCaption" aria-live="polite">Walk the forest • click objects or cubs • choose a destination.</span>';hotbar.after(toolsBar);
for(const [id,title] of [['dialogue','◈ TALK'],['history','☷ HISTORY']]){const b=document.createElement('button');b.className='tab';b.dataset.tab=id;b.setAttribute('role','tab');b.textContent=title;document.querySelector('.tabs').appendChild(b);const v=document.createElement('div');v.className='tabView';v.id='tab-'+id;v.setAttribute('role','tabpanel');document.querySelector('.panel').appendChild(v);}
function drawSceneBackground(c,location,t){const pal={den:['#544437','#907454','#c6a883'],pebble:['#41725d','#85a47b','#9eae7a'],river:['#458e94','#7aaf9c','#a5bb91'],woods:['#275c48','#679970','#83ac79'],playground:['#41795c','#95b980','#d0ba8a'],rival:['#5a775b','#9bb58d','#d0ba8a'],trail:['#4d655b','#9da58c','#b8ae92']}[location];
 const [dark,light,ground]=pal;rect(c,0,0,768,434,ground);rect(c,0,0,768,160,dark);rect(c,0,130,768,24,light);
 // A genuinely different floor, lighting and interactable environment for each scene.
 if(location==='den'){
  rect(c,0,0,768,434,'#594638');for(let i=0;i<13;i++){rect(c,i*65,0,43,120,i%2?'#695541':'#504035');rect(c,i*65+8,95,65,7,'#8c7155')}
  rect(c,0,128,768,306,'#947858');for(let i=0;i<19;i++){rect(c,i*47,333+i%3*4,31,7,'#9f8662');rect(c,i*45,405,32,5,'#7d684f')}
  pxEllipse(c,378,126,228,89,'#44392f',4);pxEllipse(c,375,148,203,85,'#76604a',5);rect(c,0,355,768,79,'#a38763');
  // Mama's large nest, cub-sized nests, roots and food pile.
  pxEllipse(c,474,304,105,40,'#5b4a32',4);pxEllipse(c,474,296,96,29,'#b6a473',4);for(let i=0;i<13;i++)rect(c,403+i*12,287+i%3*6,29,3,'#e2c994');
  pxEllipse(c,199,347,73,25,'#6d5940',3);pxEllipse(c,199,338,65,18,'#bdad79',3);
  rect(c,166,249,98,24,'#644b33');for(let i=0;i<4;i++){rect(c,175+i*18,236-i%2*5,16,16,['#b65262','#dd9b49','#a5a45a','#a35d50'][i])}
  rect(c,589,211,102,70,'#3e332b');rect(c,597,217,87,58,'#6e543d');rect(c,624,231,26,9,'#332b27');
  rect(c,695,155,72,104,'#34483c');rect(c,705,167,53,83,'#496851');
 }else{
  // Landscapes share a pixel grammar but not a single recycled scene.
  for(let i=0;i<12;i++){const x=(i*113+24)%800;const y=(i*57+187)%430;rect(c,x,y,4+(i%3)*3,3,i%2?'#c1c699':'#9ab68c')}
  if(location==='river'){
   for(let y=170;y<434;y+=8){const shift=Math.sin(y/35)*22;rect(c,0,y,768,7,(y%24===0)?'#7ec3cc':'#5fa8b5');for(let x=40;x<768;x+=95)rect(c,x+shift,y+2,28,2,'#c5e7da')}
   rect(c,0,0,200,434,ground);rect(c,617,0,151,434,ground);for(let y=0;y<400;y+=35){rect(c,180+Math.sin(y/55)*16,y,21,14,'#c8bd93');rect(c,596+Math.sin(y/45)*10,y,22,15,'#c3bb93')}
   drawTree(c,108,127,1.55);drawTree(c,688,118,1.3);
  }else if(location==='woods'){
   for(let i=0;i<10;i++)drawTree(c,24+i*86,120+(i%3)*9,i%2?1.04:1.22);drawBush(c,196,299);drawBush(c,630,304);rect(c,492,277,130,26,'#785a40');rect(c,499,278,116,6,'#a48057');rect(c,310,190,78,72,'#675442');rect(c,304,178,90,14,'#8e7753');
  }else if(location==='pebble'){
   drawTree(c,107,93,1.7);drawTree(c,682,93,1.5);rect(c,135,255,139,77,'#564732');rect(c,143,262,124,61,'#92734f');rect(c,159,272,96,49,'#3f362c');pxEllipse(c,484,231,66,38,'#61645a',4);pxEllipse(c,484,221,52,26,'#a2a79a',4);
  }else if(location==='playground'){
   drawTree(c,114,120,1.5);drawTree(c,657,113,1.4);rect(c,294,320,235,34,'#b9a979');rect(c,310,303,214,13,'#d3be8a');rect(c,544,175,22,160,'#71533f');rect(c,563,178,77,8,'#937045');rect(c,612,182,5,72,'#d3b986');rect(c,635,182,5,72,'#d3b986');rect(c,600,259,54,11,'#b88759');
  }else if(location==='rival'){
   drawTree(c,78,91,1.2);drawTree(c,690,100,1.3);rect(c,128,193,304,18,'#b99e7c');rect(c,155,202,18,120,'#6e503a');rect(c,390,202,18,120,'#6e503a');rect(c,135,189,285,15,'#b5c18c');for(let i=0;i<7;i++)rect(c,135+i*40,193,40,20,i%2?'#bf9e69':'#8b9b70');rect(c,190,289,221,22,'#7c563c');rect(c,198,311,18,32,'#654731');rect(c,393,311,17,32,'#654731');
  }else if(location==='trail'){
   drawTree(c,77,105,1.5);drawTree(c,702,94,1.4);for(let i=0;i<8;i++){rect(c,255+i*14,145+i*31,244-i*15,29,i%2?'#b7ac89':'#cab899')}
   rect(c,560,162,14,120,'#745b40');rect(c,514,172,112,50,'#dfcba1');rect(c,524,179,95,30,'#6d765b');rect(c,333,271,64,18,'#b9a78d');rect(c,340,265,41,10,'#b89a72');
  }
 }
 for(let i=0;i<18;i++){const x=((i*53+29)%768),y=225+(i*97%174);if(location!=='den'&&location!=='river')drawFlower(c,x,y,i%2?'#e8d9a2':'#daaabc')}
 if(phase()===3){rect(c,0,0,768,434,'#10283d65');for(let i=0;i<16;i++)rect(c,(i*59+38)%768,(i*31+7)%157,2,2,'#e1deaf')}
 else if(phase()===2)rect(c,0,0,768,434,'#edbd8230');
 if(state.weather==='rainy'&&location!=='den'){for(let i=0;i<38;i++)rect(c,(i*91+t*2)%768,(i*51+t*6)%434,2,9,'#c3e2d4');}
}
function drawObject(c,obj){const [name,x,y,action]=obj;switch(action){
 case 'food':rect(c,x-46,y-20,92,32,'#765338');for(let i=0;i<6;i++)rect(c,x-35+i*12,y-27,14,15,i%2?'#be5a63':'#e1a55c');break;
 case 'nest':pxEllipse(c,x,y,68,24,'#695440',4);pxEllipse(c,x,y-7,59,20,'#c4ae75',4);break;
 case 'drink':case 'fish':rect(c,x-50,y-12,100,13,'#b7d7d1');rect(c,x-42,y-8,84,6,'#6ba8b9');break;
 case 'logs':case 'gather':rect(c,x-51,y-10,102,21,'#796044');rect(c,x-40,y-12,85,7,'#b58c55');break;
 case 'hide':rect(c,x-38,y-24,76,47,'#5f5848');rect(c,x-30,y-18,60,34,'#3d4133');break;
 case 'play':rect(c,x-55,y-13,110,28,'#d1bd91');rect(c,x-34,y-4,69,8,'#c2a56e');break;
 case 'rest':rect(c,x-42,y-9,84,13,'#a88153');rect(c,x-38,y+3,8,26,'#775f41');rect(c,x+33,y+3,8,26,'#775f41');break;
 case 'rival':rect(c,x-68,y-32,136,36,'#926746');rect(c,x-52,y-22,104,22,'#d8bd82');break;
 case 'gate':rect(c,x-42,y-30,84,8,'#92704e');rect(c,x-42,y-27,9,54,'#6f563d');rect(c,x+33,y-27,9,54,'#6f563d');break;
 case 'stall':break;
 case 'grove':drawBush(c,x-11,y);drawBush(c,x+21,y+5);break;
 case 'trail':rect(c,x-26,y-18,48,20,'#b49c7c');rect(c,x-13,y-12,12,9,'#be977d');break;
 case 'treasure':rect(c,x-37,y-20,74,36,'#838d80');rect(c,x-22,y-21,29,7,'#d1d2a0');break;
 default:rect(c,x-18,y-31,7,52,'#7b6046');rect(c,x-37,y-35,75,31,'#d4be8c');rect(c,x-31,y-29,61,20,'#ab9364');}
}
function textTag(c,text,x,y,selected=false){c.save();c.font='bold 10px monospace';const width=Math.min(186,Math.max(54,c.measureText(text).width+13));x=clamp(x,width/2+5,768-width/2-5);y=clamp(y,12,419);rect(c,x-width/2,y-10,width,16,selected?'#fff1bc':'#fff8dd');rect(c,x-width/2,y+5,width,2,selected?'#bb925d':'#789477');c.textAlign='center';c.fillStyle='#35533e';c.fillText(text,x,y+1);c.restore();}
function drawSpeechBubble(c,who,message,x,anchorY){
 // Pixel-scaled word-wrapped dialogue; position *above* the sprite/nameplate, not across faces.
 const words=String(message).split(/\s+/), lines=[];let line='';
 for(const word of words){const next=line?line+' '+word:word;
  if(next.length>27&&line){lines.push(line);line=word;}else line=next;
 }
 if(line)lines.push(line);
 let display=lines.slice(0,3);
 if(lines.length>3)display[2]=display[2].slice(0,24)+'…';
 const width=216,height=21+display.length*15,center=clamp(x,width/2+7,768-width/2-7);
 const bottom=clamp(anchorY-137,height+8,407),top=bottom-height;
 rect(c,center-width/2-2,top-2,width+4,height+4,'#294a38');
 rect(c,center-width/2,top,width,height,'#fff4d4');
 rect(c,center-5,bottom+2,11,6,'#294a38');rect(c,center-3,bottom,7,5,'#fff4d4');
 c.save();c.textAlign='center';c.fillStyle='#456a50';c.font='bold 10px monospace';
 c.fillText(who.toUpperCase(),center,top+11);
 c.fillStyle='#263f34';c.font='10px monospace';
 display.forEach((str,i)=>c.fillText(str,center,top+25+i*15));c.restore();
}
function drawMapCanvas(c){rect(c,0,0,768,434,'#e4d8b4');for(let i=0;i<10;i++)drawTree(c,(i*97)%768,52+(i%4)*20,.35);c.textAlign='center';c.fillStyle='#375540';c.font='bold 23px monospace';c.fillText('THE WHISPERWOOD PATHS',384,45);worldHotspots=[];
 for(const [id,where]of Object.entries(WORLD))for(const other of where.links)if(id<other){const b=WORLD[other];c.strokeStyle='#ad9167';c.lineWidth=12;c.beginPath();c.moveTo(where.x,where.y);c.lineTo(b.x,b.y);c.stroke();c.strokeStyle='#ead7a9';c.lineWidth=5;c.stroke();}
 for(const [id,w]of Object.entries(WORLD)){pxEllipse(c,w.x,w.y,37,21,'#365844',3);pxEllipse(c,w.x,w.y-3,32,17,id===state.location?'#f0ca7c':w.color,2);textTag(c,w.short,w.x,w.y-34,id===state.location);worldHotspots.push({id,x:w.x,y:w.y,r:39,kind:'location'})}
}
function worldDrawV3(){const c=ctx,t=animationTime,loc=state.location;if(!state)return;
 if(mapOpen){drawMapCanvas(c);return;}
 worldHotspots=[];
 if(loc==='post'){drawTerrain(c,t);drawStall(c);const structures=upgrades.filter(u=>state.upgrades.includes(u.id)&&extraUpgrades.some(e=>e.id===u.id));structures.forEach(u=>{const index=extraUpgrades.findIndex(e=>e.id===u.id);if(amenityPositions[index])drawAmenity(c,u.id,...amenityPositions[index]);});}
 else drawSceneBackground(c,loc,t);
 for(const o of WORLD[loc].objects){if(loc!=='post'||o[3]!=='stall')drawObject(c,o);if(o[3]!=='stall')textTag(c,o[0],o[1],o[2]-45);worldHotspots.push({id:o[3],x:o[1],y:o[2],r:42,kind:'object'});}
 const found=state.npcs.filter(n=>n.location===loc);for(const n of found){if(!n.worldPos)n.worldPos=[n.x||350,n.y||310];if(!n.worldTarget)n.worldTarget=n.worldPos.slice();const goal=n.worldTarget;if(Math.hypot(goal[0]-n.worldPos[0],goal[1]-n.worldPos[1])<4&&Math.sin(t/29+n.age)>.97){const p=[clamp(n.worldPos[0]+Math.sin(t+n.age)*50,74,699),clamp(n.worldPos[1]+Math.cos(t+n.age)*22,205,370)];n.worldTarget=p;}
 n.worldPos[0]+=(goal[0]-n.worldPos[0])*.09;n.worldPos[1]+=(goal[1]-n.worldPos[1])*.09;
 const x=n.worldPos[0],y=n.worldPos[1];if(n.id===state.chosen){rect(c,x-24,y+29,48,4,'#f0cf75');}bear(c,x,y,1.1,n,t);textTag(c,n.name.toUpperCase(),x,y-40,n.id===state.chosen);worldHotspots.push({id:n.id,x,y,r:38,kind:'npc'});
 }
 if(loc==='den'){bear(c,563,242,1.8,{skin:'#80573d',ear:'#523b2e',scarf:'#cda66d',age:36,activity:'watching'},t);textTag(c,'MAMA',563,185);worldHotspots.push({id:'mama',x:563,y:243,r:61,kind:'mama'});}
 const p=state.playerPos,px=p[0],py=p[1];if(moveSteps.length){const to=moveSteps[0];const dx=to[0]-px,dy=to[1]-py,d=Math.hypot(dx,dy);if(d<7){state.playerPos=to;moveSteps.shift();playerMoving=false;if(!moveSteps.length&&pendingInteraction){const pending=pendingInteraction;pendingInteraction=null;queueMicrotask(()=>interactObject(pending.id,pending.spot));}}else{const speed=3.5;state.playerPos=[px+dx/d*speed,py+dy/d*speed];playerMoving=true;}}
 if(!state.dead)bear(c,px,py,1.13,{skin:state.avatar?.coat||'#a9764c',ear:state.avatar?.ears||'#714734',scarf:state.avatar?.accessory==='none'?(state.avatar?.coat||'#a9764c'):state.avatar?.accessory==='red ribbon'?'#bc6c62':state.avatar?.accessory==='blue bandana'?'#6e9cb6':'#d4af66',age:11,activity:playerMoving?'walk':state.pose},t);
 // The label is ABOVE the shop canopy, never on the cub's face.
 if(loc==='post')textTag(c,'★ YOUR POST ★',183,128,true);else textTag(c,'YOU',px,py-43,true);
 worldHotspots.push({id:'you',x:px,y:py,r:30,kind:'player'});
 if(dialogueBubble&&Date.now()<dialogueBubble.until){
 const speaker=dialogueBubble.who==='mama'?'Mama':dialogueBubble.who==='you'?'You':state.npcs.find(n=>n.id===dialogueBubble.who)?.name||'Cub';
 const pos=dialogueBubble.who==='mama'&&loc==='den'?[563,242]:dialogueBubble.who==='you'?[px,py]:state.npcs.find(n=>n.id===dialogueBubble.who&&n.location===loc)?.worldPos;
 if(pos)drawSpeechBubble(c,speaker,dialogueBubble.text,pos[0],pos[1]);} 
 if(state.pose==='vape'&&Date.now()<state.poseUntil){for(let i=0;i<10;i++){const dx=Math.sin((t+i*7)/9)*10,dy=36+((t*3+i*13)%55);rect(c,px+dx+8,py-dy,5+i%3,4,'#dfe3dc');}}
 if(phase()===3){rect(c,0,0,768,434,'#13263838');for(let i=0;i<15;i++)rect(c,(i*83+27)%768,(i*39+19)%185,2,2,'#e9e3b9');}
 if(state.dead){rect(c,0,0,768,434,'#192b2bab');textTag(c,'THE LITTLE CUB DID NOT SURVIVE',375,211,true);}
}
drawScene=worldDrawV3;
const oldSelectNPCV3=selectNPC;
selectNPC=function(id){oldSelectNPCV3(id);if(state.npcs.find(n=>n.id===id)?.location===state.location){switchTab('dialogue');say(id,`Hi! What do you want to talk about?`);}else notify(`${npc().name} is away at ${WORLD[npc().location]?.short||'somewhere in the woods'}.`);};
world.removeEventListener('click',pointerSelect);
world.addEventListener('click',e=>{const r=world.getBoundingClientRect(),x=(e.clientX-r.left)/r.width*768,y=(e.clientY-r.top)/r.height*434;const near=[...worldHotspots].map(o=>({...o,dist:Math.hypot(x-o.x,y-o.y)})).filter(o=>o.dist<o.r*1.18).sort((a,b)=>a.dist-b.dist)[0];
 if(mapOpen){if(near&&near.kind==='location')travel(near.id);else mapOpen=false;render();return;}
 if(!near){pendingInteraction=null;moveSteps=[[clamp(x,50,718),clamp(y,175,390)]];return;}
 if(near.kind==='npc'){state.chosen=near.id;selectNPC(near.id);return;}
 if(near.kind==='mama'){switchTab('mama');say('mama','Have you eaten? Come closer, little cub.');return;}
 if(near.kind==='object'){moveSteps=[[clamp(near.x,50,718),clamp(near.y+20,175,390)]];pendingInteraction={id:near.id,spot:near};return;}
 if(near.kind==='player'){notify('You are an eleven-month-old brown bear cub. Your paws are very busy.');return;}
});
function interactObject(action,spot){const loc=state.location;switch(action){
 case 'food':if(state.needs.food>=98){say('you','I am full right now.');break;}state.needs.food=clamp(state.needs.food+20);state.mama.memories.unshift(`D${state.day}: Ate from our family food pile.`);log('You ate a portion of Mama’s family food reserves.');say('mama',"Eat up, cub. You need your strength.");tick();break;
 case 'nest':state.needs.energy=clamp(state.needs.energy+25);state.needs.comfort=clamp(state.needs.comfort+16);say('you','My nest smells like home.');tick();break;
 case 'drink':state.needs.water=clamp(state.needs.water+32);say('you','Cold clean river water!');tick();break;
 case 'hide':{const yourCache=state.hiddenAt[loc]||{};const first=Object.keys(yourCache).find(k=>yourCache[k]>0);if(first){openModal('Hidden at '+WORLD[loc].name,`<p>You have <b>${count(yourCache)} hidden things</b> here. Retrieve one or leave them safely concealed.</p><div class="v3ModalGrid">${Object.keys(yourCache).filter(k=>yourCache[k]>0).map(id=>`<button data-pickcache="${id}">Retrieve ${h(items[id].name)} ×${yourCache[id]}</button>`).join('')}</div>`,[{text:'CLOSE',action:closeModal}]);document.querySelectorAll('[data-pickcache]').forEach(b=>b.onclick=()=>{if(count(state.inv)>=capacity())return notify('Backpack full');const id=b.dataset.pickcache;add(yourCache,id,-1);add(state.inv,id,1);log(`Retrieved hidden ${items[id].name} from ${WORLD[loc].name}.`);closeModal();render();save()});return;}const owner=loc==='pebble'?state.npcs.find(n=>n.id==='pebble'):loc==='den'?state.npcs.find(n=>n.id==='fern'):null;const secret=owner&&Object.keys(owner.hiddenInv||{}).find(k=>owner.hiddenInv[k]>0&&(!owner.cacheLocByItem[k]||owner.cacheLocByItem[k]===loc));if(secret&&rng()<.65){state.knownSecrets[owner.id]=secret;log(`You examined a hiding place at ${WORLD[loc].name} and discovered evidence of ${owner.name}'s hidden ${items[secret].name}.`);say('you',`So that's where ${owner.name} hid ${items[secret].name}!`);}else if(secret){say('you',`I know someone's been hiding something here, but I can't see what.`);}else{say('you','A good place to hide a treasure. Choose HIDE from your backpack.');}break;}
 case 'fish':forageZone('stream');break;
 case 'logs':forageZone('logs');break;
 case 'grove':forageZone('grove');break;
 case 'trail':forageZone('trail');break;
 case 'play':setPose('wrestle',2400);state.needs.comfort=clamp(state.needs.comfort+5);say('you','Wheeee! A good place to play.');tick();break;
 case 'rest':state.needs.energy=clamp(state.needs.energy+11);say('you','A comfortable little bench!');tick();break;
 case 'treasure':say('you','Pebble would be furious if I took his favorite rock without asking.');break;
 case 'rival':say('moss',"My prices are better than yours. Probably.");state.chosen='moss';switchTab('trade');break;
 case 'gate':case 'exit':mapOpen=true;showWorldMap();break;
 case 'notice':showWorldMap();break;
 case 'stall':switchTab('post');say('you','My post. My rules.');break;
 default:say('you','I wonder what this does.');}
}
const oldRenderV3=render;
render=function(){oldRenderV3();if(!state.v3)return;const loc=WORLD[state.location];document.querySelector('.worldLabel').textContent='✿ '+loc.name.toUpperCase();$('activeCubs').textContent=state.npcs.filter(n=>n.location===state.location).length;document.querySelector('.worldHelp').innerHTML=`<span>☞ <strong>${h(loc.name)}</strong> · Click the ground to walk, objects to use, or cubs to talk.</span><span><strong id="activeCubs">${state.npcs.filter(n=>n.location===state.location).length}</strong> cubs here · M: map · I: bag</span>`;
 $('forageBtn').disabled=state.location==='den'||state.dead;$('gossipBtn').disabled=state.dead;$('tradeBtn').disabled=state.dead||npc().location!==state.location;if(npc().location!==state.location){$('tradeHint').textContent=`${npc().name} is currently at ${WORLD[npc().location].name}. Travel there to trade or talk.`;$('tradeResult').textContent=`This cub is not physically at your location. Use the map to find them.`;}
 renderHotbar();renderTravelNav();if(activeTab==='dialogue')renderDialogue();if(activeTab==='history')renderFullHistory();
};
function renderHotbar(){hotbar.innerHTML='<strong>🎒 YOUR BAG</strong><div id="hotItems" class="hotItems"></div><button class="miniBtn" id="showBag" title="Open full inventory">ALL ▤</button>';const div=$('hotItems');for(const id of Object.keys(state.inv).filter(k=>quantity(state.inv,k)>0).slice(0,20)){const b=document.createElement('button');b.className='hotItem'+(selectedItem===id?' chosen':'');b.title=items[id].name+': '+items[id].desc;b.setAttribute('aria-label',items[id].name+' x'+state.inv[id]);const canv=document.createElement('canvas');canv.width=24;canv.height=24;drawItem(canv,id);const n=document.createElement('small');n.textContent=items[id].name;const q=document.createElement('i');q.textContent=state.inv[id];b.append(canv,n,q);b.onclick=()=>{selectedItem=id;showItemActions(id);openBackpack();};div.appendChild(b)}$('showBag').onclick=openBackpack;}
function renderTravelNav(){nav.innerHTML='';for(const id of ['post','den','pebble','river','woods','playground','rival','trail']){const el=document.createElement('button');el.className=id===state.location?'active':'';el.textContent=(id===state.location?'◆ ':'')+WORLD[id].short;el.title='Travel to '+WORLD[id].name;el.onclick=()=>travel(id);nav.appendChild(el)}}
function mapSvg(){let segments='';for(const [id,w]of Object.entries(WORLD))for(const dest of w.links)if(id<dest){const b=WORLD[dest];segments+=`<line x1="${w.x}" y1="${w.y}" x2="${b.x}" y2="${b.y}" stroke="#a28d63" stroke-width="13"/><line x1="${w.x}" y1="${w.y}" x2="${b.x}" y2="${b.y}" stroke="#f5e8c7" stroke-dasharray="7 8" stroke-width="5"/>`;}
 let nodes=Object.entries(WORLD).map(([id,w])=>`<g data-mapnode="${id}" tabindex="0" role="button"><circle cx="${w.x}" cy="${w.y}" r="26" fill="${id===state.location?'#eebc72':'#447660'}" stroke="#274938" stroke-width="5"/><circle cx="${w.x-6}" cy="${w.y-6}" r="6" fill="#c8d9a6"/><text x="${w.x}" y="${w.y-35}" font-size="19" font-weight="900" fill="#243e32" text-anchor="middle" style="paint-order:stroke;stroke:#edf5dd;stroke-width:7px">${h(w.short)}</text></g>`).join('');return `<svg viewBox="0 0 768 434" aria-label="Map of eight connected locations with paths" style="display:block;width:100%;height:210px;background:#d5e4c1;border:2px solid #7b9b70;image-rendering:pixelated"><rect width="768" height="434" fill="#d2dfb7"/>${segments}${nodes}</svg>`;}
function showWorldMap(){mapOpen=true;mapLayer.classList.add('show');mapLayer.innerHTML=`<div class="mapCard"><h3>✧ Whisperwood World Map</h3><p class="tinyNote">Travel follows the connected woodland paths. Longer routes use more energy and advance the day. You can also press M to close this map.</p>${mapSvg()}<div class="mapEntries">${Object.entries(WORLD).map(([id,w])=>`<button data-route="${id}" class="${id===state.location?'active':''}"><b>${id===state.location?'◆ HERE — ':''}${h(w.name)}</b><small>${route(state.location,id).length-1} paths · ${route(state.location,id).slice(1).reduce((n,k)=>n+WORLD[k].cost*3,0)} energy · ${state.mapVisits[id]||0} visits</small></button>`).join('')}</div><div class="modalBtns"><button class="bigBtn secondary" id="closeMap">CLOSE MAP</button></div></div>`;
 mapLayer.querySelectorAll('[data-mapnode]').forEach(g=>{g.addEventListener('click',()=>{mapLayer.classList.remove('show');travel(g.dataset.mapnode)});g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();mapLayer.classList.remove('show');travel(g.dataset.mapnode)}})});mapLayer.querySelectorAll('[data-route]').forEach(b=>b.onclick=()=>{mapLayer.classList.remove('show');travel(b.dataset.route)});$('closeMap').onclick=()=>{mapOpen=false;mapLayer.classList.remove('show');render()};drawScene();}
function closeMap(){mapOpen=false;mapLayer.classList.remove('show');render()}
function openBackpack(){const body=`<p>Choose a possession to inspect and use. It stays accessible from the hotbar in every location.</p><div class="v3ModalGrid">${Object.entries(state.inv).filter(([k,v])=>v>0).map(([id,n])=>`<button data-bag="${id}"><b>${h(items[id].name)} ×${n}</b><small>${items[id].rarity.toUpperCase()} · ${h(items[id].category||'Treasure')}</small></button>`).join('')}</div><p class="tinyNote">Held ${count(state.inv)}/${capacity()} · Stored ${count(state.stored)} · Hidden ${count(state.hidden)} · Displayed ${count(state.displayed)}</p><div id="bagActions"></div>`;
 openModal('🎒 Your cub’s backpack',body,[{text:'CLOSE',action:closeModal}]);document.querySelectorAll('[data-bag]').forEach(b=>b.onclick=()=>{const id=b.dataset.bag;selectedItem=id;const actions=[['examine','Examine'],['eat','Eat / drink'],['hide','Hide'],['store','Store'],['display','Display'],['gift','Gift to selected cub'],['mama','Show Mama'],['play','Play'],['equip','Carry'],['vape','Use (unsafe)']].filter(([a])=>a==='examine'||a==='hide'||a==='store'||a==='display'||a==='gift'||a==='mama'||a==='equip'||(a==='eat'&&['food','drink'].includes(items[id].usage))||(a==='vape'&&VAPES.has(id))||(a==='play'&&items[id].category==='Toy'));
 $('bagActions').innerHTML=`<h3 class="subhead">${h(items[id].name)} — ${items[id].rarity.toUpperCase()}</h3><div class="v3ModalGrid">${actions.map(([a,label])=>`<button data-bagaction="${a}">${h(label)}</button>`).join('')}</div>`;document.querySelectorAll('[data-bagaction]').forEach(btn=>btn.onclick=()=>{closeModal();itemAction(id,btn.dataset.bagaction)});});}
function renderDialogue(){const panel=$('tab-dialogue'),n=npc(),present=n.location===state.location;
 panel.innerHTML=`<div class="sectionHead"><h2>◈ Conversations & secrets</h2><span class="micro">${present?'IN THIS SCENE':'AWAY'}</span></div><div class="v3Dialog"><b>${h(n.name)} · ${n.age} months</b>${['pebble','fern'].includes(n.id)?' · YOUR LITTERMATE':''}<p>${h(n.title)} · ${h(n.temper)}<br>Current location: ${h(WORLD[n.location].name)}<br>Trust ${n.rel.toFixed(1)} · Mood ${h(n.mood)} · Carried items ${count(n.inv)} · Hidden items: unknown</p><p><i>${h(lastTalk||'Click a visible cub in the scene or choose a social action.')}</i></p></div><div class="talkGrid" id="talkButtons"></div><p class="tinyNote">Lying, threats and favors are remembered. Hidden goods are not visible in normal trade inventory. Accusations without evidence harm relationships.</p>`;
 for(const [id,label]of [['chat','♡ Chat'],['ask','? Ask about treasures'],['persuade','✦ Persuade'],['accuse','⚑ Accuse of lying'],['threaten','! Threaten'],['blackmail','☷ Blackmail'],['apologize','♡ Apologize'],['wrestle','♣ Wrestle'],['sibling','★ Sibling promise']]){const b=document.createElement('button');b.textContent=label;b.disabled=!present;b.onclick=()=>talkAction(id);$('talkButtons').appendChild(b)}
}
function renderFullHistory(){const host=$('tab-history');if(!host)return;const categories=['all','family','social','trading','discoveries','dialogue','building','world'];const events=(state.history||[]).filter(e=>activeSearch==='all'||e.cat===activeSearch).slice(-170).reverse();host.innerHTML=`<div class="sectionHead"><h2>☷ Woodland chronicles</h2><span class="micro">${state.history.length} EVENTS</span></div><p class="tinyNote">The full session history is retained in your save. The feed here shows the 170 latest matching records. Export to view everything.</p><div class="logFilters">${categories.map(k=>`<button data-filter="${k}" class="${activeSearch===k?'on':''}">${k.toUpperCase()}</button>`).join('')}</div><button class="miniBtn" id="exportHistory">⬇ EXPORT LOG</button><div>${events.map(e=>`<div class="logEntry"><b>DAY ${e.day} · ${h(e.phase||'?')} · ${h(WORLD[e.loc]?.short||e.loc||'forest')} · ${h(e.cat||'world')}</b><div>${h(e.text||'')}</div></div>`).join('')||'<p>No matching events yet.</p>'}</div>`;host.querySelectorAll('[data-filter]').forEach(b=>b.onclick=()=>{activeSearch=b.dataset.filter;renderFullHistory()});$('exportHistory').onclick=()=>downloadText('little-trading-post-history.json',JSON.stringify(state.history,null,2));}
function downloadText(name,data){const blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000)}
function showDev(){let menu=`<p><b>Developer sandbox.</b> Cheats deliberately bypass survival and economy constraints; their use is recorded in the log.</p><div class="v3ModalGrid"><button data-cheat="needs">❤️ Restore all needs</button><button data-cheat="god">🛡 Invulnerability ${state.cheats.god?'ON':'OFF'}</button><button data-cheat="infinite">🎒 Unlimited bag ${state.cheats.infinite?'ON':'OFF'}</button><button data-cheat="rep">✦ +20 reputation</button><button data-cheat="item">🎁 Spawn item</button><button data-cheat="npc">★ Give NPC a rare item</button><button data-cheat="secret">🔎 Reveal NPC secret</button><button data-cheat="time">☀ Advance phase</button><button data-cheat="build">🔨 Unlock all buildings</button><button data-cheat="rarity">🎲 Test rarity roll</button><button data-cheat="mama">🐻 Trigger Mama search</button><button data-cheat="inspect">📋 Inspect state</button><button data-cheat="save">⬇ Export save</button><button data-cheat="import">⬆ Import save</button><button data-cheat="revive">♡ Revive cub</button><button data-cheat="reset">↻ Reset new game</button></div><p class="tinyNote">Select a cub in the trading panel before applying NPC cheats.</p>`;
 openModal('⚙ Developer & cheat menu',menu,[{text:'CLOSE',action:closeModal}]);document.querySelectorAll('[data-cheat]').forEach(b=>b.onclick=()=>{const id=b.dataset.cheat;closeModal();devAction(id)});}
function devAction(id){state.cheats.on=true;log(`DEV MENU: ${id}`);if(id==='needs'){for(const k of Object.keys(state.needs))state.needs[k]=100;state.dead=false;}
 else if(id==='god'){state.cheats.god=!state.cheats.god;}
 else if(id==='infinite'){state.cheats.infinite=!state.cheats.infinite;}
 else if(id==='rep'){state.rep+=20;}
 else if(id==='item'){openModal('Spawn any item',`<select id="spawnSelect" style="width:100%;padding:9px">${Object.keys(items).map(k=>`<option value="${k}">${h(items[k].name)} — ${items[k].rarity}</option>`).join('')}</select>`,[{text:'SPAWN 1',action:()=>{const k=$('spawnSelect').value;add(state.inv,k,1);log('DEV spawned '+items[k].name);closeModal();render()}},{text:'CLOSE',secondary:true,action:closeModal}]);return;}
 else if(id==='npc'){const n=npc(),k='amber';add(n.hiddenInv,k,1);n.craving=k;log('DEV gave '+n.name+' a hidden epic amber bead.');}
 else if(id==='secret'){const n=npc(),k=Object.keys(n.hiddenInv)[0];if(k){state.knownSecrets[n.id]=k;notify('You discovered '+n.name+' secretly has '+items[k].name);}else notify(n.name+' has no hidden item.');}
 else if(id==='time'){newDay(true);}
 else if(id==='build'){state.upgrades=upgrades.map(u=>u.id);}
 else if(id==='rarity'){const k=selectedRarityLoot('trail');add(state.inv,k,1);notify('Tier '+items[k].rarity+' — '+items[k].name);}
 else if(id==='mama'){state.phase=3;checkMother();}
 else if(id==='revive'){state.dead=false;state.needs.health=70;state.needs.food=45;state.location='den';state.playerPos=origin.den.slice();}
 else if(id==='inspect'){openModal('State inspector',`<pre style="white-space:pre-wrap;max-height:55vh;overflow:auto;font-size:10px">${h(JSON.stringify({location:state.location,day:state.day,phase:state.phase,needs:state.needs,npcs:state.npcs.map(n=>({id:n.id,at:n.location,inv:n.inv,hidden:n.hiddenInv,rel:n.rel})),pools:state.pool,policy:state.policy,knowledge:state.knownSecrets},null,2))}</pre>`,[{text:'CLOSE',action:closeModal}]);return;}
 else if(id==='save'){downloadText('little-trading-post-save.json',JSON.stringify(state,null,2));}
 else if(id==='import'){const file=document.createElement('input');file.type='file';file.accept='.json';file.onchange=async()=>{try{const obj=JSON.parse(await file.files[0].text());if(!obj||!Array.isArray(obj.npcs)||obj.npcs.length!==6||!obj.inv)throw Error('Not a valid six-cub save');ensureV3(obj);state=obj;sanitize();save();render();notify('Imported six-cub save!')}catch(e){notify('Import failed: '+e.message)}};file.click();return;}
 else if(id==='reset'){openModal('Start a new game?',`<p>Reset erases your current local progress. Export your save first if you want a backup.</p>`,[{text:'CANCEL',secondary:true,action:closeModal},{text:'RESET',action:()=>{state=fresh();save();closeModal();render()}}]);return;}
 save();render();}
const oldCapacityV3=capacity;capacity=function(){return state?.cheats?.infinite?99999:oldCapacityV3()};
const oldCheckMotherV3=checkMother;
checkMother=function(){oldCheckMotherV3();if(phase()===3&&count(state.hiddenAt.den)>0&&rng()<.25+state.mama.suspicion/300){const id=Object.keys(state.hiddenAt.den).find(k=>state.hiddenAt.den[k]>0);if(id){add(state.hiddenAt.den,id,-1);if(!VAPES.has(id))add(state.stored,id,1);state.mama.trust=clamp(state.mama.trust-(VAPES.has(id)?9:3));log(`Mama checked the den and discovered your hidden ${items[id].name}. ${VAPES.has(id)?'She confiscated the unsafe device.':'She moved it to safe family storage.'}`);}}if(state.location==='den'&&state.needs.food<25){state.needs.food=clamp(state.needs.food+35);state.mama.memories.unshift(`D${state.day}: Mama noticed your hunger and fed you.`);log('Mama intervened in the den and fed a hungry cub.');say('mama','I will not let you skip supper.');}};
const prevUpdateNeedsV3=updateNeeds;
updateNeeds=function(cost=1){if(state.cheats?.god)return;prevUpdateNeedsV3(cost);if(state.needs.food<=0||state.needs.water<=0){if(state.needs.health<=0&&!state.dead){state.dead=true;log('The cub died after prolonged severe neglect; the woodland story ends here.');openModal('A little life ended',`<p>Your cub did not survive prolonged hunger or thirst. You can reset or revive in the developer menu.</p>`,[{text:'START NEW STORY',action:()=>{state=fresh();save();closeModal();render()}},{text:'DEVELOPER MENU',secondary:true,action:()=>{closeModal();showDev()}}]);}else if(state.needs.health<25)notify('CRITICAL: your cub needs food, water and help now.');}}
// Rewire no-op shortcuts and preserve original v2 buttons while making their location rules explicit.
queueMicrotask(()=>{
 $('v3Map').onclick=()=>mapOpen?closeMap():showWorldMap();$('v3Backpack').onclick=openBackpack;$('v3Dev').onclick=showDev;$('v3History').onclick=()=>switchTab('history');
 document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
 $('forageBtn').onclick=()=>{if(state.location==='den'||state.location==='post'||state.location==='playground'||state.location==='rival')return notify('Use the map to travel to a real gathering area first.');if(state.location==='river')return forageZone('stream');if(state.location==='woods')return openForage();if(state.location==='pebble')return forageZone('logs');if(state.location==='trail')return forageZone('trail');return openForage();};
 $('gossipBtn').onclick=()=>{const n=npc();if(n.location!==state.location)return notify(`${n.name} is at ${WORLD[n.location].short}; go there to listen.`);listen();};
 $('tradeBtn').onclick=negotiate;
 $('world').setAttribute('aria-label','Explorable pixel-art woodland scene. Click to walk, choose objects, interact with NPC cubs or press M for the world map.');
});
document.addEventListener('keydown',e=>{const key=e.key.toLowerCase();if(['input','textarea','select'].includes(document.activeElement.tagName.toLowerCase()))return;if(key==='m'){e.preventDefault();mapOpen?closeMap():showWorldMap()}if(key==='i'){e.preventDefault();openBackpack()}if(key==='escape'){if(mapOpen)closeMap();else closeModal()}if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key)&&!mapOpen){e.preventDefault();const dx=key==='arrowleft'||key==='a'?-27:key==='arrowright'||key==='d'?27:0,dy=key==='arrowup'||key==='w'?-27:key==='arrowdown'||key==='s'?27:0;moveSteps=[[clamp(state.playerPos[0]+dx,60,700),clamp(state.playerPos[1]+dy,177,389)]];}});
opening=function(){try{if(localStorage.getItem('little_trading_post_seen_v3'))return}catch(e){}openModal('WELCOME TO WHISPERWOOD v3',`<p>You're an 11-month-old brown bear cub with a tiny trading post, two littermates, three berries and a very nice stick.</p><p><b>NEW:</b> Eight distinct places. Use the location strip or WORLD MAP (M) to travel. Click the ground to move and objects to use them. Your backpack stays within reach under the game canvas (I). Talk directly to the cubs you meet; they hide possessions and have lives elsewhere.</p><p><b>Try first:</b> travel to Mama's Den, visit Pebble at his hollow later in the day, then explore the Riverside. Open CHEATS & DEBUG for experiments.</p>`,[{text:'OPEN MY WOODLAND',action:()=>{try{localStorage.setItem('little_trading_post_seen_v3','yes')}catch(e){}closeModal()}}]);};
// Test interface: assertions can inspect state without editing the actual game source.
window.LittleTradingPost={getState:()=>JSON.parse(JSON.stringify(state)),travel,world:WORLD,rollTier,spawn:(id)=>{if(!items[id])return false;add(state.inv,id,1);save();render();return true},devAction,npcDiscover,showMap:showWorldMap,closeMap,selectNPC,rarity:TIERS,items,route};
