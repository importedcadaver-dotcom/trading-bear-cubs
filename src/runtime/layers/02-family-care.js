/* LITTLE TRADING POST v2: additive expansion of the original game's engine.
   Original barter, ownership of state, scene layout and save key are preserved. */
const EXTRA_ITEMS = {
  freshfish:['Fresh fish','Food','A real edible fish from the river.',7,'#8ba8c1','food'],
  driedfish:['Dried fish','Food','Preserved fish for journeys and gifts.',9,'#c69a6c','food'],
  fishstone:['Fish-shaped stone','Treasure','A rock that looks remarkably like a fish.',8,'#778ca0','treasure'],
  honey:['Honey comb','Food','Sticky, sweet and valuable.',8,'#e8b551','food'],
  water:['Water flask','Drink','A filled bark flask for drinking.',4,'#81bfd0','drink'],
  apple:['Forest apple','Food','A crisp little windfall.',4,'#c56c53','food'],
  mushroom:['Edible mushroom','Food','A mushroom Mama identified as safe.',3,'#b58c75','food'],
  roots:['Sweet roots','Food','Earthy roots for a hearty snack.',3,'#9f855d','food'],
  jam:['Berry jam','Food','A sticky homemade treat.',8,'#a94c6f','food'],
  meal:['Fish supper','Food','A carefully cooked and filling supper.',13,'#c3935b','food'],
  leaf:['Big leaf','Material','Rainproof wrapping and playtime hats.',2,'#70a46b','material'],
  twig:['Bundle of twigs','Material','Short twigs for little constructions.',3,'#a17b57','material'],
  wood:['Wood plank','Material','Sturdy wood cut to size.',5,'#ae8358','material'],
  rope:['Braided rope','Material','Twisted natural fibers for building.',6,'#ceb786','material'],
  clay:['River clay','Material','Soft, moldable riverbank clay.',4,'#ba8e79','material'],
  mossmat:['Soft moss','Material','Fresh moss for lining a nest.',3,'#7e9d67','material'],
  pinecone:['Pine cone','Treasure','A spiky little forest treasure.',3,'#846545','treasure'],
  quartz:['White quartz','Treasure','A bright quartz chip that sparkles.',8,'#c5cee0','treasure'],
  amber:['Amber bead','Treasure','A rare warm-colored bead.',13,'#df9b53','treasure'],
  marble:['Glass marble','Human','A mysterious glass orb found near a trail.',14,'#8dc5c8','human'],
  thimble:['Silver thimble','Human','Human sewing equipment; makes a silly helmet.',13,'#aebcc7','human'],
  bell:['Brass bell','Human','A tiny bell that rings when shaken.',12,'#cbb36a','human'],
  compass:['Broken compass','Human','Its needle is stuck, but the case is beautiful.',18,'#ae9f84','human'],
  postcard:['Lost postcard','Human','A faded paper picture of a mountain.',11,'#c9b5a0','human'],
  dice:['Wooden die','Toy','A tiny numbered cube to roll in games.',7,'#e1c993','toy'],
  ball:['Cloth ball','Toy','A stuffed ball for chasing and wrestling games.',8,'#c97e72','toy'],
  boat:['Leaf boat','Toy','A floating handmade toy.',6,'#70a990','toy'],
  kite:['Tiny kite','Toy','A feather-decorated kite.',12,'#e8a77c','toy'],
  crown:['Acorn crown','Toy','A very royal tiny hat.',9,'#d3b270','toy'],
  drum:['Hollow-log drum','Toy','A drum to play with friends.',12,'#a87751','toy'],
  basket:['Woven basket','Tool','Carries extra items on gathering trips.',12,'#be9562','tool'],
  shovel:['Wooden shovel','Tool','Helps dig for clay and hidden treasures.',12,'#9b7952','tool'],
  fishingrod:['Fishing pole','Tool','A long stick with a braided line.',12,'#b5936e','tool'],
  lantern:['Firefly lantern','Tool','A glowing jar with careful air holes.',16,'#c5ad6d','tool'],
  map:['Forest map','Tool','Hand-drawn paths to little secret locations.',11,'#dfcba7','tool'],
  acorncookies:['Acorn biscuits','Food','A small baked batch made with Mama.',9,'#bd9260','food'],
  paintedstone:['Painted stone','Craft','A stone with a handmade design.',7,'#b1a0bf','craft'],
  necklace:['Shell necklace','Craft','A necklace strung together with rope.',11,'#e6baa9','craft'],
  wovenmat:['Woven mat','Craft','A soft mat for sitting comfortably.',10,'#8eac83','craft'],
  birdhouse:['Mini birdhouse','Craft','A miniature house for imaginary birds.',14,'#a47c64','craft'],
  cup:['Clay cup','Craft','Holds water, acorns, or very small flowers.',8,'#b88a6c','craft'],
  sticker:['Star sticker','Human','A shiny little sticker from an old notebook.',10,'#e7cf80','human'],
  ticket:['Train ticket','Human','An old ticket with fascinating numbers.',9,'#d7bd9a','human']
};
for(const [id,[name,category,desc,value,color,usage]] of Object.entries(EXTRA_ITEMS)){
 items[id]={name,short:name.toLowerCase(),plural:name+'s',color,desc,category,usage};base[id]=value;
}
Object.assign(base,{vape:39});
Object.assign(items.berry,{category:'Food',usage:'food'});
Object.assign(items.stick,{category:'Material',usage:'material'});
for (const id of ['feather','stone','shell','acorn']) items[id].category='Treasure';
for (const id of ['mouse','fish']) items[id].category='Toy';
for (const id of ['ribbon','button','key','vape']) items[id].category='Human';
items.fish.name='Carved wooden fish';items.fish.desc='A wooden toy fish, NOT an edible fish.';
items.vape.name='Mythical vape';items.vape.desc='An unsafe human nicotine device. Usable, risky, and closely watched by Mama.';
items.vape.category='Human';
const extraRecipes=[
 ['wood','Split wooden planks',{stick:2},{wood:2},'Sturdy building material.'],
 ['rope','Braid a rope',{twig:1,leaf:2},{rope:1},'A knotty little cord.'],
 ['fish','Carve a wooden fish',{stick:2},{fish:1},'An ornate non-edible toy.'],
 ['driedfish','Dry fresh fish',{freshfish:1},{driedfish:1},'Preserve food for later.'],
 ['jam','Mash berry jam',{berry:3,cup:1},{jam:1},'Concentrate berries into a special treat.'],
 ['meal','Cook fish supper',{freshfish:1,roots:1},{meal:1},'A hearty meal.'],
 ['basket','Weave a carrying basket',{twig:2,leaf:2},{basket:1},'A practical carrying tool.'],
 ['shovel','Make a wooden shovel',{stick:1,wood:1},{shovel:1},'Better digging opportunities.'],
 ['fishingrod','Tie a fishing pole',{stick:1,rope:1},{fishingrod:1},'Find fish at the stream.'],
 ['cup','Shape a clay cup',{clay:2},{cup:1},'A useful little container.'],
 ['paintedstone','Paint a stone',{stone:1,berry:1},{paintedstone:1},'Artistic value to collectors.'],
 ['necklace','Make shell necklace',{shell:2,rope:1},{necklace:1},'A special gift for a friend.'],
 ['boat','Make a leaf boat',{leaf:2,stick:1},{boat:1},'Float it down the creek.'],
 ['crown','Craft acorn crown',{acorn:2,leaf:1},{crown:1},'A regal tiny hat.'],
 ['ball','Stitch a cloth ball',{ribbon:1,mossmat:2},{ball:1},'Great for a chase game.'],
 ['kite','Make a feather kite',{feather:2,stick:1,rope:1},{kite:1},'Great in a windy clearing.'],
 ['wovenmat','Weave soft sleeping mat',{mossmat:2,leaf:2},{wovenmat:1},'Take a rest anywhere.'],
 ['birdhouse','Construct miniature birdhouse',{wood:2,twig:2},{birdhouse:1},'A delightful display item.'],
 ['lantern','Create firefly lantern',{cup:1,leaf:1},{lantern:1},'Improves your nighttime exploration.']
].map(([id,title,cost,gives,desc])=>({id,title,cost,gives,desc}));
recipes.push(...extraRecipes.filter(r=>!recipes.some(o=>o.id===r.id)));
const extraUpgrades=[
 ['bench','Cub-sized benches',{wood:2,rope:1},'Friends linger, sit and chat.'],
 ['table','Community trade tables',{wood:3},'Host extra traders and negotiate comfortably.'],
 ['storage','Lockable storage chest',{wood:2,button:1},'Store 16 extra items, safe from rain.'],
 ['display','Prize display case',{wood:2,shell:1},'Display up to four prized treasures.'],
 ['waterstation','Cool water trough',{wood:2,cup:1},'Free refills; guests can drink.'],
 ['playground','Cub wrestling circle',{twig:2,leaf:2,rope:1},'A friendly play and wrestling space.'],
 ['workbench','Proper crafting workbench',{wood:3,stone:1},'A tidy place for complicated crafts.'],
 ['firepit','Safe cooking nook',{stone:2,wood:1},'Prep meals with adult-approved supervision.'],
 ['sign','Fancy wooden sign',{wood:1,paintedstone:1},'Makes the post feel like a real business.'],
 ['lanterns','Twinkly path lanterns',{cup:1,rope:1},'Makes night visits more inviting.'],
 ['nest','Soft rest nook',{mossmat:3,leaf:1},'Take a restorative nap at the trading post.'],
 ['fence','Low willow fence',{stick:3,rope:1},'A clear property boundary for stall rules.'],
 ['bridge','Little stream bridge',{wood:4,rope:1},'Better access to the creek.'],
 ['shelter','Night shelter',{wood:3,mossmat:2},'Safeguard goods during rough nights.']
].map(([id,title,cost,desc])=>({id,title,cost,desc,bonus:desc}));
upgrades.push(...extraUpgrades);
const extraNpcs={
 fern:{age:11,family:'Your littermate! You, Fern and Pebble are all 11 months old.',sibling:'pebble',temper:'gentle',skill:2},
 pebble:{age:11,family:'Your littermate! You, Fern and Pebble are all 11 months old.',sibling:'fern',temper:'ambitious',skill:3},
 waffle:{age:14,family:'Older cub; lives with aunt Hazel',sibling:null,temper:'playful',skill:4},
 juniper:{age:16,family:'Older cub; big sister to Sprout',sibling:'sprout',temper:'inventor',skill:5},
 sprout:{age:7,family:'Youngest; little sister to Juniper',sibling:'juniper',temper:'easily distracted',skill:1},
 moss:{age:15,family:'Only cub in his litter',sibling:null,temper:'competitive',skill:5}
};
NPCS.forEach(n=>Object.assign(n,extraNpcs[n.id]));
const phaseNames=['MORNING','AFTERNOON','EVENING','NIGHT'];
const phaseCosts=[3,4,3,2];
const maxV=100;
const clamp=(v,a=0,b=100)=>Math.min(b,Math.max(a,v));
const oldFresh=fresh,oldLoad=load,oldRender=render,oldRenderJournal=renderJournal,oldNpcTrade=npcTrade,
 oldDrawItem=drawItem,oldBear=bear,oldDrawStall=drawStall,oldDrawScene=drawScene,
 oldBuildCraft=buildCraft,oldNegotiate=negotiate,oldEvent=event;
function ensureV2(s){
 if(s.v2===2)return s;
 s.v2=2;s.phase=0;s.phaseActs=0;s.needs={food:84,water:83,energy:86,comfort:72,health:100};
 s.mama={trust:65,suspicion:2,lastFood:0,memories:['She knows you opened a little shop.'],proud:0,discipline:0};
 s.hidden={};s.stored={};s.displayed={};s.social=[];
 s.policy='free';s.passes={};s.fees=0;s.denials=0;s.affinity={};s.age=11;s.pose='idle';s.poseUntil=0;
 s.pool={grove:7,stream:5,logs:6,trail:3};s.zoneTrips={grove:0,stream:0,logs:0,trail:0};
 s.dailyActions=0;s.nights=0;s.vapeUses=0;s.dependence=0;s.marketHistory={};s.closedUntil=0;s.rivalPressure=0;s.displayHistory={};s.dailyDeals={};s.troughDrinks=0;
 s.npcs.forEach((n,i)=>{Object.assign(n,extraNpcs[n.id]);n.relTo=n.relTo||{};n.activity='browsing';n.location='post';n.energy=75;n.backstory=typeof n.memory==='string'?n.memory:NPCS[i].memory;n.memory=Array.isArray(n.memory)?n.memory:[];n.visited=0;n.craving=n.love;
   if(n.id==='sprout') n.rel= Math.max(0,n.rel);});
 s.log.unshift({s:'NEW: Mama, food, friends, construction and day/night are now part of your story.',d:s.day});
 return s;
}
fresh=function(){return ensureV2(oldFresh())};
load=function(){oldLoad();ensureV2(state);sanitize();};
function sanitize(){
 for(const group of [state.inv,state.hidden,state.stored,state.displayed,...state.npcs.map(n=>n.inv)]){
   for(const [k,v] of Object.entries(group)){if(!items[k]||!Number.isSafeInteger(v)||v<0)delete group[k];}
 }
 state.needs=state.needs||{food:84,water:83,energy:85,comfort:70,health:100};
 for(const k of Object.keys(state.needs))state.needs[k]=clamp(state.needs[k]);
 state.phase=clamp(Math.floor(state.phase||0),0,3);state.phaseActs=Math.max(0,Math.floor(state.phaseActs||0));
 state.pool=state.pool||{grove:6,stream:4,logs:6,trail:3};state.zoneTrips=state.zoneTrips||{grove:0,stream:0,logs:0,trail:0};
 state.policy=['free','berry','treasure','friends'].includes(state.policy)?state.policy:'free';
}
// VISUAL & UI EXTENSION: preserve the existing interface and append functional panels.
const extStyle=document.createElement('style');extStyle.textContent=`
:root{--night:#132a37}
.masthead{border-bottom:2px solid #d3c6a3;padding-bottom:13px}
.tab{padding:12px 3px;font-size:10px;min-width:0}.tabs{flex-wrap:wrap}.tabs .tab{flex:1 1 24%;white-space:nowrap}
.vitals{background:#fef8e5;border:2px solid #b5c6a6;margin:12px 0;padding:11px 13px;box-shadow:3px 3px 0 #c9c4a9}
.vitalsHead{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:7px;font:900 12px 'Courier New',monospace;color:#355a42}
.vitalGrid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:6px}.vital{text-align:center;min-width:0}.vital b{font:900 10px 'Courier New',monospace;text-transform:uppercase;display:block}.vital .bar{height:8px;background:#d9d5c4;box-shadow:inset 0 1px 2px #abb3a5;margin:5px 0}.vital .bar div{height:100%;background:#7da178}.vital em{font:800 10px monospace;color:#53694e;font-style:normal}
.phaseRibbon{display:flex;gap:6px;align-items:center}.phaseDot{font-size:11px;letter-spacing:1px}.phaseDot.on{color:#db9758}
.itemActionHead{display:flex;align-items:center;gap:12px;padding:10px;background:#ecf0df;border:1px solid #c7cdb7}.itemActionHead canvas{width:52px;height:52px;image-rendering:pixelated}.itemActionHead b{display:block;font:900 14px 'Courier New',monospace}.itemActionHead small{font-size:11px;color:#6f806e}
.actionGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;margin-top:9px}.miniBtn{border:2px solid #73906d;background:#ecf0db;padding:9px 7px;text-align:left;font:800 11px 'Courier New',monospace;color:#3b6049;box-shadow:2px 2px 0 #d1cab1}.miniBtn.gold{background:#e8d09b}.miniBtn:disabled{opacity:.4}.miniBtn:active{transform:translate(1px,1px)}
.bagItem{cursor:pointer}.bagItem.selected{background:#eed4a9;border:2px solid #b97a50}
.statusTag{display:inline-block;background:#e4eacb;border:1px solid #b9c79d;padding:4px 6px;font:700 10px 'Courier New',monospace;margin:3px 5px 3px 0}
.marketOptions{display:grid;grid-template-columns:repeat(2,1fr);gap:6px}.policyOption{border:2px solid #d0c4a5;background:#f4eed8;padding:9px 6px;text-align:left;font-size:11px;color:#4b634a}.policyOption b{display:block;font:900 12px 'Courier New',monospace}.policyOption.active{border-color:#537f5f;background:#d6e6cb}
.peopleCards{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.personCard{padding:8px;border:1px solid #d1c5ac;background:#f9f0dd}.personCard b{font:900 12px 'Courier New',monospace;color:#2e533e}.personCard small{display:block;color:#77866d;margin-top:3px}.personCard button{margin-top:6px;width:100%}
.tinyNote{font:11px/1.5 'Trebuchet MS',sans-serif;color:#657a62}.upgradeTiles{display:grid;grid-template-columns:1fr 1fr;gap:7px}.upgradeTiles .recipe{margin:0;min-height:95px}
#inventoryActions{margin-top:10px}#inventoryActions.empty{display:none}
#tab-life,#tab-mama,#tab-post{max-height:780px;overflow:auto}
.phaseWorldNote{background:#284e3e;color:#fff0c7;padding:7px 12px;font-size:12px;font-weight:bold}
.worldFrame.night canvas{filter:brightness(.68) saturate(.75)}.worldFrame.evening canvas{filter:sepia(.15) brightness(.91)}
.worldFrame.night .worldStamp{background:#152c3ecb;color:#f7e4b4;border-color:#7994ab}
#noticeLine{font:11px/1.5 monospace;color:#93724e;margin-top:6px}
@media(max-width:650px){.vitalGrid{grid-template-columns:repeat(5,minmax(0,1fr));gap:3px}.vital b{font-size:9px}.actionGrid{grid-template-columns:repeat(2,1fr)}.peopleCards{grid-template-columns:1fr}.tabs .tab{flex:1 1 32%}.marketOptions{grid-template-columns:1fr 1fr}}
`;document.head.appendChild(extStyle);
const tabBar=document.querySelector('.tabs');
for(const [id,title] of [['life','♡ CUB LIFE'],['mama','♥ MAMA'],['post','⌂ MY POST']]){
 const b=document.createElement('button');b.className='tab';b.dataset.tab=id;b.setAttribute('role','tab');b.textContent=title;tabBar.appendChild(b);
 const v=document.createElement('div');v.className='tabView';v.id='tab-'+id;v.setAttribute('role','tabpanel');document.querySelector('.panel').appendChild(v);
 b.onclick=()=>switchTab(id);
}
const vit=document.createElement('section');vit.className='vitals';vit.id='vitals';
const mainGrid=document.querySelector('.mainGrid');document.querySelector('.leftColumn').insertBefore(vit,document.querySelector('.sceneInfo'));
const invActions=document.createElement('div');invActions.id='inventoryActions';invActions.className='empty';document.querySelector('.inventoryPanel').appendChild(invActions);
let selectedItem='',specialParticles=[],lastSocial='';
const amount=(id)=>quantity(state.inv,id);
const baseCapacity=capacity;capacity=function(){return baseCapacity()+(amount('basket')?6:0)+(state.upgrades.includes('cart')?4:0)};
function phase(){return state.phase||0}
function visibleShop(){return phase()===1||phase()===2}
function setPose(p,secs=1800){state.pose=p;state.poseUntil=Date.now()+secs}
function callAction(text,fn){try{fn()}catch(e){log('Action could not finish: '+e.message);console.error(e);notify('That action was interrupted.')}}
function actionCost(energy=4,comfort=0){state.needs.energy=clamp(state.needs.energy-energy);state.needs.comfort=clamp(state.needs.comfort+comfort)}
function bumpSocial(){
 const a=randomOf(state.npcs),b=randomOf(state.npcs.filter(n=>n.id!==a.id));const pair=(a.relTo[b.id]||0);
 let kind;
 if(phase()===3)kind='sleep';else if(a.temper==='competitive'&&rng()<.45)kind='argue';else kind=randomOf(['wrestle','share','play','chat','gather']);
 a.activity=kind;b.activity=kind;a.memory.unshift(`D${state.day}: ${kind} with ${b.name}`);b.memory.unshift(`D${state.day}: ${kind} with ${a.name}`);
 a.memory=a.memory.slice(0,8);b.memory=b.memory.slice(0,8);
 a.relTo[b.id]=clamp(pair+(kind==='argue'?-1:1),-6,10);b.relTo[a.id]=a.relTo[b.id];
 a.energy=clamp(a.energy-(kind==='wrestle'?8:3));b.energy=clamp(b.energy-3);
 if(kind==='gather'&&count(a.inv)<9){add(a.inv,randomOf(['berry','twig','acorn','leaf']),1);log(`${a.name} picked up materials on a walk with ${b.name}.`)}
 else if(kind==='argue'){log(`${a.name} and ${b.name} bickered about who owns the best market stall.`)}
 else if(kind==='wrestle'){log(`${a.name} and ${b.name} wrestled in the grass. ${a.age}m vs ${b.age}m: ${a.age>b.age?a.name+' held back a bit.':'a playful tumble!'}`)}
 else if(kind==='share'){let good=Object.keys(a.inv).find(id=>items[id]&&items[id].category==='Food'&&quantity(a.inv,id)>0);
  if(good){add(a.inv,good,-1);add(b.inv,good,1);log(`${a.name} shared ${items[good].name.toLowerCase()} with ${b.name}. Their friendship grew.`)}
  else log(`${a.name} shared a secret with ${b.name}. Their friendship grew.`)}
 else if(kind==='play'){log(`${a.name} and ${b.name} chased a leaf across the clearing.`)}
 else if(kind==='sleep'){log(`${a.name} and ${b.name} settled down for the night.`)}
 return kind;
}
function entry(n){
 if(state.passes[n.id]===state.day)return true;
 const policy=state.policy;
 if(policy==='free'||(policy==='friends'&&(n.rel>=2||n.sibling===state.chosen))){state.passes[n.id]=state.day;return true;}
 if(policy==='friends'){state.denials++;n.rel=clamp(n.rel-1,-6,10);log(`${n.name} can't use your stalls: friends-only policy. ${n.name} went elsewhere.`);return false;}
 const choices=policy==='berry'?['berry','acorn']:['shell','button','stone','feather','ribbon'];
 const id=choices.find(id=>quantity(n.inv,id)>0);
 if(!id||count(state.inv)>=capacity()){
   state.denials++; if(rng()<.3)n.rel=clamp(n.rel-1,-6,10);
   log(`${n.name} couldn't pay your ${policy==='berry'?'snack fee':'treasure fee'} and went to trade by the trail.`);return false;
 }
 add(n.inv,id,-1);add(state.inv,id,1);state.passes[n.id]=state.day;state.fees++;
 log(`${n.name} paid ${items[id].name.toLowerCase()} to use YOUR market. The fee belongs to you.`);return true;
}
// NPC trade must respect post rights, while off-site trades remain possible.
npcTrade=function(){
 const candidates=[];for(const a of state.npcs){for(const b of state.npcs){if(a.id>=b.id)continue;
 for(const x of Object.keys(a.inv).filter(k=>quantity(a.inv,k)>0))for(const y of Object.keys(b.inv).filter(k=>quantity(b.inv,k)>0&&x!==k)){
  const scoreA=itemVal(a,y)-itemVal(a,x),scoreB=itemVal(b,x)-itemVal(b,y);
  if(scoreA>=-1&&scoreB>=-1&&scoreA+scoreB>=2)candidates.push({a,b,x,y,s:scoreA+scoreB});
 }}}
 if(!candidates.length)return false;
 candidates.sort((a,b)=>b.s-a.s);const t=candidates[Math.floor(rng()*Math.min(5,candidates.length))];
 const atPost=visibleShop()&&rng()<.8;
 let here=atPost;
 if(atPost){here=entry(t.a)&&entry(t.b);} // allowed to deal outside even when denied
 add(t.a.inv,t.x,-1);add(t.a.inv,t.y,1);add(t.b.inv,t.y,-1);add(t.b.inv,t.x,1);
 t.a.deals++;t.b.deals++;t.a.activity=t.b.activity='trading';
 log(`${t.a.name} traded ${items[t.x].name.toLowerCase()} for ${t.b.name}'s ${items[t.y].name.toLowerCase()} ${here?'at your market.':'off-site.'}`);
 return true;
};
function npcWorldAction(){
 const phaseNow=phase();state.npcs.forEach(n=>{n.location=phaseNow===3?'den':phaseNow===0?'home':phaseNow===2?'home':n.activity==='gather'?'woods':'post';
  n.energy=clamp(n.energy+(phaseNow===3?3:-.3));});
 if(rng()<.45)bumpSocial();
 if(rng()<(state.upgrades.includes('table')?.72:.56)&&phaseNow!==3)npcTrade();
 if(phaseNow===1&&rng()<.23){const maker=randomOf(state.npcs);if(quantity(maker.inv,'stick')>=2){add(maker.inv,'stick',-2);add(maker.inv,'fish',1);maker.activity='craft';log(`${maker.name} carved a wooden fish without your help.`)}}
 if(state.policy==='treasure'&&phaseNow===1&&rng()<.14){state.rivalPressure=clamp(state.rivalPressure+1,0,100);log(`Moss advertised free tables outside your expensive market. Some visitors went there instead.`)}
 if(phaseNow===1&&rng()<.2){const n=randomOf(state.npcs);const choices=['berry','stick','leaf','twig','clay','acorn'];if(count(n.inv)<11){const id=randomOf(choices);add(n.inv,id,1);log(`${n.name} independently foraged ${items[id].name.toLowerCase()}.`)}}
}
function updateNeeds(cost=1){
 state.needs.food=clamp(state.needs.food-2*cost);state.needs.water=clamp(state.needs.water-2.3*cost);
 if(state.needs.food<24||state.needs.water<20){state.needs.energy=clamp(state.needs.energy-3*cost);state.needs.comfort=clamp(state.needs.comfort-1*cost);}
 if(state.needs.food===0||state.needs.water===0){state.needs.health=clamp(state.needs.health-3*cost);if(state.day%2===0&&state.phaseActs===0)log('You feel weak. Mama would want you to eat and drink.');}
 if(state.needs.health<25){state.mama.suspicion=clamp(state.mama.suspicion+2);}
}
function checkMother(){
 if(phase()===3&&rng()<.25+state.mama.suspicion/300){
  state.mama.memories.unshift(`D${state.day}: Mama checked your little hiding spots.`);
  const hiddenIds=Object.keys(state.hidden).filter(k=>quantity(state.hidden,k)>0);
  if(hiddenIds.length&&rng()<(state.upgrades.includes('storage')?.12:state.upgrades.includes('fence')?.19:.3)+state.mama.suspicion/250){
    const id=randomOf(hiddenIds);add(state.hidden,id,-1);add(state.stored,id,1);
    state.mama.suspicion=clamp(state.mama.suspicion+12);
    const dangerous=id==='vape';state.mama.trust=clamp(state.mama.trust-(dangerous?12:3));
    state.mama.discipline++;log(`Mama discovered your hidden ${items[id].name.toLowerCase()}! ${dangerous?'She confiscated it and gave you a serious talking-to.':'She wants to know why you hid it.'}`);
    if(dangerous){add(state.stored,id,-1);}
  } else log('Mama peeked into the trading post and saw nothing suspicious.');
 }
}
function progressPhase(){
 state.phaseActs=0;
 if(state.phase<3){state.phase++;const n=phaseNames[state.phase];log(`${n[0]+n.slice(1).toLowerCase()} arrives. Cub schedules and opportunities change.`);
   if(state.phase===3)checkMother();}
 else bedtime();
}
function bedtime(){
 state.nights++;state.day++;state.phase=0;state.phaseActs=0;state.foraged=0;state.gossip=0;state.visits++;
 const rain=state.weather==='rainy';
 for(const id of Object.keys(state.pool))state.pool[id]=Math.min({grove:9,stream:7,logs:8,trail:4}[id],state.pool[id]+(rain?2:1)+(rng()<.35?1:0)+(id==='stream'&&state.upgrades.includes('bridge')?1:0));
 state.zoneTrips={grove:0,stream:0,logs:0,trail:0};state.passes={};state.dailyDeals={};state.troughDrinks=0;
 state.needs.energy=clamp(state.needs.energy+56+(state.upgrades.includes('nest')?15:0));
 state.needs.comfort=clamp(state.needs.comfort+12);state.needs.food=clamp(state.needs.food-9);state.needs.water=clamp(state.needs.water-8);
 if(state.needs.food<15||state.needs.water<15)state.needs.health=clamp(state.needs.health-5);
 else state.needs.health=clamp(state.needs.health+4);
 state.mama.suspicion=clamp(state.mama.suspicion-1);
 state.dependence=clamp(state.dependence-0.8);
 if(state.dependence>10&&state.day%2===0){state.needs.comfort=clamp(state.needs.comfort-8);log('An uncomfortable craving makes the morning harder.');}
 if(state.day%3===0){const n=randomOf(state.npcs);add(n.inv,randomOf(['berry','twig','leaf']),1);log(`${n.name} found materials while you slept.`);
  n.craving=randomOf(['marble','mouse','boat','necklace','stone','fish','acorn','basket','ball','sticker']);log(`${n.name} is suddenly interested in ${items[n.craving].name.toLowerCase()}. Tastes change!`)}
 if(state.needs.health<20&&(!state.v3||(state.mama.trust>=28&&(state.location==='den'||state.mamaAware)))){state.needs.health=37;state.needs.water=Math.max(state.needs.water,40);state.needs.food=Math.max(state.needs.food,45);
   state.closedUntil=state.day;state.rep=Math.max(0,state.rep-2);state.mama.trust=clamp(state.mama.trust-2);
   state.mama.memories.unshift(`D${state.day}: Mama took care of you and ordered your stall closed for a morning.`);
   log('You were too unwell to trade. Mama fed you, fetched water, and closed the post for recovery. Reputation −2; market access suspended this morning.');}

 if(state.day%2===0)oldEvent();
 if(state.needs.food<16&&state.mama.lastFood!==state.day){state.needs.food=clamp(state.needs.food+18);state.mama.memories.unshift(`D${state.day}: Mama helped when you were hungry.`);log('Mama left a little breakfast outside the den so you would not go hungry.');}
 log('A new morning. The forest has recovered a LITTLE, and your cub needs breakfast.');setPose('sleep',1300);
 save();render();
}
newDay=function(manual=true){
 if(!manual){bedtime();return;}
 if(state.phase<3){state.needs.energy=clamp(state.needs.energy-4);updateNeeds(3);log('You waited instead of acting. Time passed and you became hungrier and thirstier.');progressPhase();}
 else{checkMother();bedtime()}
 save();render();
};
tick=function(steps=1){
 for(let i=0;i<steps;i++){
  state.tick++;state.dailyActions++;state.phaseActs++;
  updateNeeds(1);npcWorldAction();
  if(state.tick%7===0)oldEvent();
  if(state.phaseActs>=phaseCosts[phase()])progressPhase();
 }
 save();render();
};
function canAct(energy=4){if(state.needs.energy<energy){notify('Your paws are tired. Rest or ask Mama for help.');return false;}return true;}
const zones={
 grove:{name:'Berry thicket',emoji:'🍓',cost:5,desc:'Berries, leaves, mushrooms; abundant but easily picked clean.',loot:['berry','berry','berry','apple','leaf','mushroom','honey','pinecone']},
 stream:{name:'Pebble stream',emoji:'💧',cost:7,desc:'Water, clay, shells, fish and sparkling stones.',loot:['water','water','freshfish','clay','clay','shell','fishstone','quartz','stone']},
 logs:{name:'Fallen log',emoji:'🌿',cost:5,desc:'Wood, sticks, moss, twigs and hiding places.',loot:['stick','stick','twig','twig','wood','leaf','mossmat','acorn','pinecone']},
 trail:{name:'Human trail',emoji:'🗝',cost:9,desc:'Rare artifacts and rumors. Mama may disapprove.',loot:['button','ticket','postcard','key','marble','sticker','bell','thimble','compass','vape']}
};
function forageZone(id){
 if(state.day<=state.closedUntil)return notify('Mama ordered a recovery morning. Rest and spend time at the den.');
 if(!zones[id]||state.phase===3&&!amount('lantern')&&!state.upgrades.includes('lanterns'))return notify('Too dark to explore without a lantern.');
 if(state.foraged>=3+(state.upgrades.includes('cart')?1:0))return notify('You have used your exploration time today.');
 if(state.pool[id]<=0)return notify('This spot is picked clean; let nature recover.');
 if(!canAct(zones[id].cost))return;
 if(count(state.inv)>=capacity())return notify('Your backpack is full.');
 state.foraged++;state.zoneTrips[id]++;state.pool[id]--;state.totalFound++;
 let idItem=state.v3?selectedRarityLoot(id):randomOf(zones[id].loot);
 if(!state.v3&&id==='trail'&&idItem==='vape'&&!(state.day>=6&&state.rep>=8&&rng()<.06))idItem=randomOf(zones[id].loot.filter(t=>t!=='vape'));
 if(id==='stream'&&idItem==='freshfish'&&!amount('fishingrod')&&!state.upgrades.includes('bridge')&&rng()<.5)idItem='clay';
 if(id==='logs'&&amount('shovel')&&rng()<.2)idItem='quartz';
 // Market saturation: each repeatedly gathered commodity is less useful to NPCs.
 add(state.inv,idItem,1);state.marketHistory[idItem]=(state.marketHistory[idItem]||0)+1;
 actionCost(zones[id].cost);setPose('carry');
 if(idItem==='vape'){
    state.mama.suspicion=clamp(state.mama.suspicion+9);
    log('MYTH DISCOVERED: a discarded human vape. The cubs are curious, but Mama would be alarmed.');
 }else log(`You explored ${zones[id].name.toLowerCase()} and found ${items[idItem].name.toLowerCase()}. (${state.pool[id]} finds remain here)`);
 notify('Found: '+items[idItem].name+'!');sound(510);tick();
}
function openForage(){
 const z=Object.entries(zones).map(([id,o])=>`<p><b>${o.emoji} ${o.name}</b> — ${o.desc}<br><small>Finds left: ${state.pool[id]} · ${o.cost} energy</small></p>`).join('');
 openModal('Where will your paws go?',`<p>Each trip takes time, energy and resources from the forest. Streams and logs grow back gradually, not instantly.</p>${z}`,
 [...Object.entries(zones).map(([id,o])=>({text:o.name+(state.pool[id]?' ('+state.pool[id]+')':' · empty'),secondary:!state.pool[id],action:()=>{closeModal();forageZone(id)}})),{text:'CANCEL',secondary:true,action:closeModal}]);
}
forage=function(){openForage()};
listen=function(){
 const n=npc();if(state.gossip>=2)return notify('Your cub has heard enough gossip today.');
 if(!canAct(3))return;
 state.gossip++;n.discovered=true;actionCost(3,2);
 const msg=`${n.name} confided: ${n.backstory} (${n.age} months old · ${n.family})`;
 log(msg);tradeResult(msg,true);notify('You learned a little secret about '+n.name);setPose('chat');tick();
};
itemVal=function(n,id){
 let v=base[id]||3;v+=quantity(n.inv,id)>0?-Math.min(2,quantity(n.inv,id)):1;
 if(id===n.love)v+=8;if(id===n.other)v+=3;if(id===n.craving&&id!==n.love)v+=4;
 if(id==='vape')v-=9; // it is rare but not a profitable health strategy
 if(['mouse','ball','boat','fish','crown'].includes(id)&&n.age<10)v+=3;
 if(['wood','rope','stick','basket'].includes(id)&&n.age>13)v+=3;
 const saturation=state.marketHistory[id]||0;v-=Math.min(5,Math.floor(saturation/5));
 if(state.event==='Toy parade'&&['mouse','fish','ball'].includes(id))v+=3;
 if(state.event==='Rain clouds'&&['stick','ribbon','wood'].includes(id))v+=3;
 if(state.event==='Blue moon'&&['stone','feather','quartz'].includes(id))v+=3;
 return Math.max(1,v);
};
// The player must own rights to their own stall; solo trades are possible, but at the clearing fee applies to visitors.
const baseNegotiate=negotiate;
negotiate=function(){
 if(phase()===3)return notify('It is night. The trading table is closed.');
 if(state.day<=state.closedUntil)return notify('Mama closed the stall for your recovery this morning.');
 if(!entry(npc())){notify(npc().name+' will only trade off-site right now. Adjust your market policy.');render();return;}
 if(!canAct(3))return;
 const before=state.trades,beforeRep=state.rep,name=npc().id,dealCount=state.dailyDeals[name]||0;
 baseNegotiate();if(state.trades>before){
  state.dailyDeals[name]=dealCount+1;
  if(dealCount>=2){state.rep=beforeRep;log('Repeat trades with the same cub are still useful, but no longer earn daily reputation.');}
  actionCost(3);setPose('chat');save();render();}
};
const baseBuild=buildCraft;
buildCraft=function(recipe,isUpgrade){
 if(phase()===3)return notify('It is too dark for careful construction.');
 if(recipe.id==='meal'&&!state.upgrades.includes('firepit'))return notify('A proper fish supper needs the safe cooking nook.');
 if(!canAct(4))return;
 const was=isUpgrade?state.upgrades.includes(recipe.id):quantity(state.inv,Object.keys(recipe.gives||{})[0]);
 baseBuild(recipe,isUpgrade);
 if(isUpgrade?(!was&&state.upgrades.includes(recipe.id)):(quantity(state.inv,Object.keys(recipe.gives)[0])!==was)){
  actionCost(state.upgrades.includes('workbench')?3:4);setPose('carry');
 }
};
// Prevent premature automatic "victory" for merely the original three upgrades; retain the early milestone as a celebration.
checkVictory=function(){
 if(!state.victory&&state.rep>=25&&state.trades>=12&&state.upgrades.length>=6){state.victory=true;
 log('Your trading post is a real woodland landmark! Life, friendships and construction can still continue.');
 notify('WOODLAND LANDMARK! Keep building your story.');sound(880)}save();
};
function foodUse(id){
 const food={berry:[12,3],freshfish:[23,2],driedfish:[18,3],honey:[16,6],apple:[16,3],mushroom:[12,0],roots:[13,0],jam:[23,3],meal:[38,8],acorncookies:[21,4]};
 if(id==='water'){state.needs.water=clamp(state.needs.water+42);state.needs.comfort=clamp(state.needs.comfort+2);}
 else{const [n,c]=food[id]||[8,0];state.needs.food=clamp(state.needs.food+n);state.needs.comfort=clamp(state.needs.comfort+c)}
 add(state.inv,id,-1);setPose('eat');log(`You ${id==='water'?'drank':'ate'} ${items[id].name.toLowerCase()}. You feel better.`);notify('Yum! Your needs improved.');tick();
}
function itemAction(id,what){
 if(!amount(id))return notify('You no longer have that item.');
 const dangerous=id==='vape';
 if(what==='examine'){openModal('Inspect: '+items[id].name,`<p>${h(items[id].desc)}</p><p><b>Category:</b> ${h(items[id].category||'Treasure')}<br><b>In your bag:</b> ${amount(id)}<br><b>Your stall value:</b> varies by the cub who wants it.</p>`,[{text:'CLOSE',action:closeModal}]);return;}
 if(what==='eat'){foodUse(id);return;}
 if(what==='hide'){
   if(count(state.hidden)>=4+(state.upgrades.includes('storage')?6:0))return notify('Your hiding space is full. Build better storage.');
   add(state.inv,id,-1);add(state.hidden,id,1);state.mama.suspicion=clamp(state.mama.suspicion+3);
   log(`You secretly hid ${items[id].name.toLowerCase()} behind the trading counter.`);notify('Hidden. Mama might still discover it.');tick();return;
 }
 if(what==='store'){
   if(count(state.stored)>=4+(state.upgrades.includes('storage')?16:0))return notify('Storage is full. Build a chest.');
   add(state.inv,id,-1);add(state.stored,id,1);log(`You stored ${items[id].name.toLowerCase()} in your post.`);notify('Safely stored.');tick();return;
 }
 if(what==='display'){
   if(count(state.displayed)>=1+(state.upgrades.includes('display')?3:0))return notify('No space left. Build a display case.');
   add(state.inv,id,-1);add(state.displayed,id,1);state.displayHistory=state.displayHistory||{};
   const first=!state.displayHistory[id];state.displayHistory[id]=true;if(first)state.rep++;
   log(`You proudly displayed ${items[id].name.toLowerCase()}. A cub stopped to admire it!${first?' New treasure! +1 reputation.':' This treasure has already impressed visitors.'}`);
   notify(first?'On display! +1 reputation ✦':'On display again.');setPose('proud');tick();return;
 }
 if(what==='gift'){
  const n=npc();add(state.inv,id,-1);add(n.inv,id,1);const gain=id===n.love?3:id===n.other?2:1;
  n.rel=clamp(n.rel+gain,-6,10);n.mood='GRATEFUL';n.memory.unshift(`D${state.day}: received ${items[id].name} from you`);
  log(`You gave ${n.name} ${items[id].name.toLowerCase()}. Friendship +${gain}.`);notify(n.name+' loved being remembered.');setPose('chat');tick();return;
 }
 if(what==='mama'){
  state.mama.memories.unshift(`D${state.day}: You showed Mama ${items[id].name}.`);
  const risky=dangerous||['thimble','key','compass'].includes(id);
  if(risky){state.mama.suspicion=clamp(state.mama.suspicion+15);state.mama.trust=clamp(state.mama.trust-4);
    log(`Mama frowned at ${items[id].name.toLowerCase()}. “Where did you get that?”`);}
  else{state.mama.proud++;state.mama.trust=clamp(state.mama.trust+3);state.needs.comfort=clamp(state.needs.comfort+6);log(`Mama admired your ${items[id].name.toLowerCase()} and praised your clever paws.`);}
  notify(risky?'Mama is worried.':'Mama is proud of your treasure!');setPose('proud');tick();return;
 }
 if(what==='play'){
  actionCost(4,8);const n=npc();n.rel=clamp(n.rel+1,-6,10);setPose('play');
  log(`You and ${n.name} played with ${items[id].name.toLowerCase()}. It was a lovely afternoon.`);notify('Playtime with '+n.name+'!');tick();return;
 }
 if(what==='vape'){
  // Fictional audiovisual interaction: no real-world technique or inhalation directions.
  state.vapeUses++;state.dependence=clamp(state.dependence+5);state.needs.health=clamp(state.needs.health-12);
  state.needs.energy=clamp(state.needs.energy-9);state.needs.comfort=clamp(state.needs.comfort-8);
  state.mama.suspicion=clamp(state.mama.suspicion+22);
  setPose('vape',3000);specialParticles=Array.from({length:20},(_,i)=>({x:197+(i%4)*3,y:255-Math.floor(i/4)*4,age:i*2}));
  log('You experimented with the dangerous human vape. A visible vapor cloud rises; you cough, feel dizzy, and worry what Mama will say. Health −12, energy −9.');
  if(rng()<.35){const n=randomOf(state.npcs);n.memory.unshift(`D${state.day}: saw your dangerous human vape`);n.rel=clamp(n.rel-2,-6,10);log(`${n.name} saw what happened and may tell Mama.`)}
  notify('Cough! That was a bad idea. Mama may find out.');sound(145);tick();return;
 }
 if(what==='equip'){state.carrying=id;setPose('carry');log('You picked up '+items[id].name.toLowerCase()+'.');notify('Carrying '+items[id].name);tick();return;}
 if(what==='trade'){selectNPC(state.chosen);offered={[id]:1};renderTrade();return;}
 if(what==='craft'||what==='build'){switchTab('craft');notify(what==='craft'?'Choose what to make using your materials.':'Choose a physical structure to build.');return;}
}
function retrieveItem(where,id){if(quantity(state[where],id)<1)return; if(count(state.inv)>=capacity())return notify('Your backpack is full.');
 add(state[where],id,-1);add(state.inv,id,1);log(`You retrieved ${items[id].name.toLowerCase()} from ${where}.`);notify('Retrieved '+items[id].name);tick();}
function showItemActions(id){
 selectedItem=id;const a=items[id];if(!a||!amount(id)){selectedItem='';renderItemActions();return}
 renderItemActions();
}
function renderItemActions(){const pane=$('inventoryActions');if(!selectedItem||!amount(selectedItem)){pane.className='empty';pane.innerHTML='';return;}
 const id=selectedItem,a=items[id];pane.className='';pane.innerHTML='';
 const head=document.createElement('div');head.className='itemActionHead';const cv=document.createElement('canvas');cv.width=cv.height=24;drawItem(cv,id);
 const bl=document.createElement('div');bl.innerHTML=`<b>${h(a.name)} ×${amount(id)}</b><small>${h(a.desc)}</small>`;head.append(cv,bl);pane.appendChild(head);
 const list=[['examine','Inspect'],['trade','Offer in trade'],['gift','Gift to selected cub'],['mama','Show to Mama'],['store','Store safely'],['hide','Hide from Mama'],['display','Display proudly'],['equip','Carry']];
 if(id==='water'||a.usage==='food')list.unshift(['eat',id==='water'?'Drink':'Eat']);
 if(a.category==='Toy'||['stick','ball','boat','crown','fish','drum','dice','mouse'].includes(id))list.push(['play','Play with cub']);
 if(['Material','Tool'].includes(a.category))list.push(['craft','Craft with this']);
 if(['Material','Tool'].includes(a.category))list.push(['build','Build at your post']);
 if(id==='vape')list.push(['vape','Use vape (unsafe)']);
 const grid=document.createElement('div');grid.className='actionGrid';
 for(const [action,label] of list){const b=document.createElement('button');b.className='miniBtn'+(action==='eat'?' gold':'');b.textContent=label;b.onclick=()=>{itemAction(id,action);render();};grid.appendChild(b)}pane.appendChild(grid);
}
function reactToSocial(type){
 const n=npc();if(phase()===3&&type!=='comfort')return notify(n.name+' is sleeping. Meet again in the day.');
 if(!canAct(4))return;
 const effects={wrestle:[-8,8,2],chase:[-6,5,1],play:[-4,7,2],secret:[-1,4,2],apologize:[-1,1,3],comfort:[-1,7,4],argue:[-2,-5,-3],help:[-5,5,3],share:[-2,6,3]};
 const [energy,comfort,rel]=effects[type]||[-3,2,1];
 state.needs.energy=clamp(state.needs.energy+energy);state.needs.comfort=clamp(state.needs.comfort+comfort);
 const ageFactor=type==='wrestle'&&n.age<9?1:0;
 if(state.upgrades.includes('playground')&&['wrestle','play','chase'].includes(type))state.needs.comfort=clamp(state.needs.comfort+5);
 n.rel=clamp(n.rel+rel-ageFactor+(state.upgrades.includes('bench')&&['secret','comfort'].includes(type)?1:0),-6,10);n.activity=type;n.memory.unshift(`D${state.day}: you ${type} together`);n.memory=n.memory.slice(0,8);
 n.mood=rel>0?'HAPPY':'UPSET';setPose(type==='wrestle'?'wrestle':type==='chase'?'walk':'play',2000);
 log(`You and ${n.name} ${type==='wrestle'?'had a gentle wrestling match':type==='secret'?'shared a secret':type==='apologize'?'made up':type==='comfort'?'shared a reassuring hug':type==='share'?'shared a little snack':type==='argue'?'had a quarrel':type==='help'?'worked on a project together':type==='chase'?'chased each other':'played together'}. Friendship ${rel>=0?'+':''}${rel-ageFactor}.`);
 notify(type.toUpperCase()+' with '+n.name);tick();
}
function mamaAction(type){
 const m=state.mama;if(!canAct(type==='rest'?0:2))return;
 if(type==='hug'){m.trust=clamp(m.trust+2);state.needs.comfort=clamp(state.needs.comfort+22);state.needs.energy=clamp(state.needs.energy+3);setPose('hug');log('Mama wrapped you in a giant bear hug. You feel safe.');}
 if(type==='food'){
   if(m.lastFood===state.day){notify('Mama already packed a snack for you today.');return;}
   m.lastFood=state.day;const gift=state.needs.food<40?'meal':'berry';
   if(count(state.inv)>=capacity())state.needs.food=clamp(state.needs.food+22);else add(state.inv,gift,1);
   m.trust=clamp(m.trust+1);m.memories.unshift(`D${state.day}: Mama made a meal for you.`);
   log(`Mama made sure you had ${gift==='meal'?'a proper meal':'a few berries'}. “Eat before working, little trader.”`);
 }
 if(type==='water'){state.needs.water=clamp(state.needs.water+45);log('Mama brought you clean drinking water.');}
 if(type==='play'){state.needs.comfort=clamp(state.needs.comfort+15);m.trust=clamp(m.trust+2);setPose('wrestle');log('Mama gently wrestled with you on the soft den rug.');}
 if(type==='explain'){
  m.trust=clamp(m.trust+2);m.suspicion=clamp(m.suspicion-8);m.memories.unshift(`D${state.day}: You told Mama the truth about your trading post.`);
  log('You told Mama about your little business. She listened carefully and asked you to be safe.');
 }
 if(type==='rest'){state.needs.energy=clamp(state.needs.energy+22);state.needs.comfort=clamp(state.needs.comfort+5);setPose('sleep');log('You rested near Mama. The trading post can wait a little.');}
 if(type==='check'){checkMother();log('Mama helped tidy up your den. Hidden things might have been noticed.');}
 if(type==='confess'){m.suspicion=clamp(m.suspicion-14);m.trust=clamp(m.trust+1);m.memories.unshift(`D${state.day}: You chose to be honest.`);log('You told Mama something you had been keeping secret. She appreciated your honesty.');}
 m.memories=m.memories.slice(0,12);state.needs.energy=clamp(state.needs.energy-(type==='rest'?0:2));tick();
}
function switchPolicy(p){state.policy=p;log(`New trading-post rule: ${p==='free'?'free access':p==='berry'?'every cub pays a berry or acorn':p==='treasure'?'every cub pays a valuable little treasure':'friends-only access'}.`);notify('Your market rules have changed.');tick();}
function renderV2(){
 const n=state.needs,m=state.mama;
 $('vitals').innerHTML=`<div class="vitalsHead"><span>♡ YOUR LITTLE BEAR · 11 MONTHS OLD</span><span class="phaseRibbon">${phaseNames.map((p,i)=>`<span class="phaseDot${i===phase()?' on':''}">${i===phase()?'◆':'◇'} ${p.slice(0,3)}</span>`).join('')}</span></div><div class="vitalGrid">${[['food','Hunger'],['water','Water'],['energy','Energy'],['comfort','Cuddles'],['health','Health']].map(([id,name])=>`<div class="vital"><b>${name}</b><div class="bar"><div style="width:${n[id]}%;background:${n[id]<25?'#bb7259':id==='health'?'#a7b47a':'#7ca67e'}"></div></div><em>${Math.round(n[id])}</em></div>`).join('')}</div><div id="noticeLine">${state.phaseActs}/${phaseCosts[phase()]} activities this phase · Forest weather: ${state.weather} · ${phase()===3?'Night discoveries and Mama check-ins':'Other cubs live on their own schedules'}</div>`;
 $('nextBtn').querySelector('b').textContent=phase()===3?'☾ SLEEP UNTIL MORNING':'⏭ WAIT FOR '+phaseNames[phase()+1];
 $('nextBtn').querySelector('small').textContent='Skipping time still costs food and water';
 $('forageCount').textContent=Math.max(0,3+(state.upgrades.includes('cart')?1:0)-state.foraged)+' TRIPS · LIMITED FINDS';
 $('forageBtn').disabled=state.foraged>=3+(state.upgrades.includes('cart')?1:0)||count(state.inv)>=capacity()||(phase()===3&&!amount('lantern')&&!state.upgrades.includes('lanterns'));
 $('weatherStamp').textContent=phase()===3?'☾ QUIET WOODLAND NIGHT':phase()===2?'✦ GOLDEN EVENING':phase()===0?'☀ DEWY MORNING':'☀ BUSTLING AFTERNOON';
 $('timeStamp').textContent=phaseNames[phase()]+' · '+state.event.toUpperCase();
 const worldFrame=document.querySelector('.worldFrame');worldFrame.classList.toggle('night',phase()===3);worldFrame.classList.toggle('evening',phase()===2);
 $('marketStatus').textContent=paused?'PAUSED • CUB LIFE IS STILL':'LIVE • '+(phase()===3?'THE CUBS ARE ASLEEP':phase()===0?'MORNING PREPARATIONS':'YOUR MARKET IS IN BUSINESS');
 $('activeCubs').textContent=phase()===3?'0':state.npcs.filter(p=>p.location==='post').length;
 $('currentWish').innerHTML=`<b>Your rules:</b> ${h(state.policy.toUpperCase())} · <b>Stall fees collected:</b> ${state.fees} · <b>Forest:</b> ${Object.values(state.pool).reduce((a,b)=>a+b,0)} finds available across four areas.`;
 $('upgradeCount').textContent=state.upgrades.length+'/'+upgrades.length+' structures';
 $('goalNum').textContent=state.rep+' STARS';
 $('progressFill').style.width=Math.min(100,state.rep/25*100)+'%';
 $('progressMessage').textContent=state.victory?'The little market is a woodland landmark!':'Become a landmark: 25 reputation · 12 trades · 6 structures.';
 $('npcTitle').textContent=npc().title+' · '+npc().age+' months';
 $('npcQuote').textContent='“'+npc().quote+'”  '+npc().family+'.';
 $('tableLevel').textContent=state.upgrades.length+' structures · YOUR PROPERTY';
 $('forageBtn').querySelector('small').textContent='Pick a real gathering location';
 const slots=$('bagGrid').querySelectorAll('.bagItem');slots.forEach(el=>{
    const name=el.title.split(' ×')[0];const id=Object.keys(items).find(k=>items[k].name===name);
    if(!id)return;el.classList.toggle('selected',selectedItem===id);el.onclick=()=>showItemActions(id);
    el.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showItemActions(id)}};
 });renderItemActions();
 $('tab-life').innerHTML=`<div class="sectionHead"><h2>♡ Your woodland friends</h2><span class="micro">SIX REAL CUBS</span></div><p class="tinyNote">Pick a cub above, then play with them here. Siblings, sizes, ages and grudges affect how each behaves.</p><div class="traderHero" style="margin-top:8px"><div><b>${h(npc().name)}</b> · ${npc().age} months old<br><small>${h(npc().family)} · ${h(npc().temper)}<br>Friendship: ${npc().rel}/10 · Activity: ${h(npc().activity)}</small></div></div><div class="actionGrid" id="socialButtons"></div><h3 class="subhead">Family tree and friendships</h3><div class="peopleCards">${state.npcs.map(o=>`<div class="personCard"><b>${h(o.name)} · ${o.age} months</b><small>${h(o.family)}<br>Likes ${h(items[o.love].name.toLowerCase())} · ${h(o.activity)} · friendship ${o.rel}/10</small><button class="miniBtn" data-talk="${o.id}">VISIT ${h(o.name.toUpperCase())}</button></div>`).join('')}</div>`;
 const social=[['play','Play'],['wrestle','Wrestle'],['chase','Chase'],['secret','Share secret'],['share','Share snack'],['comfort','Comfort'],['help','Help with task'],['apologize','Apologize'],['argue','Argue']];
 for(const [action,label]of social){const b=document.createElement('button');b.className='miniBtn';b.textContent=label;b.onclick=()=>reactToSocial(action);$('socialButtons').appendChild(b)}
 document.querySelectorAll('[data-talk]').forEach(b=>b.onclick=()=>selectNPC(b.dataset.talk));
 $('tab-mama').innerHTML=`<div class="sectionHead"><h2>♥ Mama's den</h2><span class="micro">YOUR FAMILY</span></div><div class="traderHero"><canvas id="mamaPortrait" width="64" height="64" class="portrait"></canvas><div><b>Mama Brown Bear</b><br><small>Trust ${m.trust}/100 · Suspicion ${m.suspicion}/100<br>She is proud ${m.proud} times · Discipline ${m.discipline}</small></div></div><p class="tinyNote">Mama cares about your safety and remembers your choices. Nighttime sneaking and suspicious artifacts may invite an inspection.</p><div class="actionGrid" id="mamaBtns"></div><h3 class="subhead">Things Mama remembers</h3>${m.memories.slice(0,7).map(x=>`<div class="journalEntry">✿ ${h(x)}</div>`).join('')}`;
 drawPortrait($('mamaPortrait'),{skin:'#8b573b',ear:'#61402e',scarf:'#d9ad69',age:30,x:0});
 for(const [action,label] of [['hug','Cuddle Mama'],['food','Ask for food'],['water','Drink clean water'],['play','Wrestle with Mama'],['explain','Tell Mama about the shop'],['rest','Rest in the den'],['check','Tidy hiding places'],['confess','Tell her the truth']]){const b=document.createElement('button');b.className='miniBtn';b.textContent=label;b.onclick=()=>mamaAction(action);$('mamaBtns').appendChild(b)}
 $('tab-post').innerHTML=`<div class="sectionHead"><h2>⌂ This post is YOURS</h2><span class="micro">PROPERTY RULES</span></div><p class="tinyNote">Other cubs may trade freely elsewhere, but nobody is entitled to your stall, shelter, tables or shop facilities. Set a rule below and collect real goods from visitors.</p><div class="marketOptions" id="policies">${[['free','Welcome everyone','No fee; more visitors, more friendships'],['berry','Berry or acorn fee','A snack paid once per cub per day'],['treasure','Treasure entrance fee','A shell, button, feather or similar'],['friends','Friends only','Access for cubs with trust 2+']].map(([id,title,desc])=>`<button class="policyOption ${state.policy===id?'active':''}" data-policy="${id}"><b>${title}</b><small>${desc}</small></button>`).join('')}</div><p class="tinyNote">${state.fees} fees collected · ${state.denials} attempted visits redirected · ${Object.values(state.passes).filter(d=>d===state.day).length} passes issued today.</p><h3 class="subhead">Your collection and secret spaces</h3><div id="postUtility"></div><div id="postStorage"></div><h3 class="subhead">Built amenities (${state.upgrades.length}/${upgrades.length})</h3><div id="buildOverview" class="peopleCards"></div>`;
 document.querySelectorAll('[data-policy]').forEach(b=>b.onclick=()=>switchPolicy(b.dataset.policy));
 if(state.upgrades.includes('waterstation')){
  const b=document.createElement('button');b.className='miniBtn gold';b.textContent='Drink from your water trough ('+Math.max(0,2-state.troughDrinks)+' refills today)';
  b.disabled=state.troughDrinks>=2;b.onclick=()=>{if(!canAct(1))return;state.troughDrinks++;state.needs.water=clamp(state.needs.water+30);log('You took a refreshing drink at the trading-post water trough.');tick()};
  $('postUtility').appendChild(b);
 }
 let storageHtml='';for(const [key,title] of [['stored','Safe storage'],['hidden','Hidden from Mama'],['displayed','Your trophy display']]){
 const objs=Object.entries(state[key]).filter(([id,n])=>n>0);
 storageHtml+=`<b style="font:900 12px monospace">${title} (${count(state[key])})</b><div class="peopleCards" style="margin-bottom:8px">${objs.length?objs.map(([id,n])=>`<div class="personCard">${h(items[id].name)} ×${n}<button class="miniBtn" data-retrieve="${key}:${id}">RETRIEVE</button></div>`).join(''):'<div class="tinyNote">Nothing here yet.</div>'}</div>`;
 }
 $('postStorage').innerHTML=storageHtml;document.querySelectorAll('[data-retrieve]').forEach(b=>b.onclick=()=>{const [where,id]=b.dataset.retrieve.split(':');retrieveItem(where,id)});
 $('buildOverview').innerHTML=upgrades.map(u=>`<div class="personCard"><b>${state.upgrades.includes(u.id)?'✓ ':'◻ '}${h(u.title)}</b><small>${h(u.desc)}</small></div>`).join('');
}
// The palette/generation strategy uses one internal pixel grid and round brown-bear silhouettes.
function pxEllipse(c,cx,cy,rx,ry,col,unit=2){
 for(let y=-ry;y<=ry;y+=unit){const w=Math.round(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));rect(c,cx-w,cy+y,w*2,unit,col)}
}
function newBear(c,x,y,scale,n,t=0){
 const pose=n===state?state.pose:n.activity||'idle';const age=n.age||11;
 const s=scale*(age<9?.83:age>=16?1.07:age>=14?1.02:1);
 const bob=Math.sin(t/9+(n.x||0))*(pose==='walk'||pose==='chase'?2.5:0.4);
 c.save();c.translate(Math.round(x),Math.round(y+bob));c.scale(s,s);
 if(pose==='sleep')c.rotate(-.22);
 if(pose==='wrestle')c.rotate(Math.sin(t/4)*.12);
 const fur=n.skin||'#a9764c',dark=n.ear||'#6c4939';
 // WIDE BODY, plantigrade paws, chunky neck; short low muzzle and truly circular ears.
 pxEllipse(c,0,11,16,17,dark,2);pxEllipse(c,0,9,14,17,fur,2);
 pxEllipse(c,-14,16,8,9,dark,2);pxEllipse(c,14,16,8,9,dark,2);
 pxEllipse(c,-10,24,9,6,dark,2);pxEllipse(c,10,24,9,6,dark,2);
 for(const d of [-17,-13,-9,5,9,13]){rect(c,d,26,2,2,'#4b3b31')}
 // Ear placement is round and high/sideways, not long pointy canine ears.
 pxEllipse(c,-13,-18,8,8,dark,2);pxEllipse(c,13,-18,8,8,dark,2);
 pxEllipse(c,-13,-18,4,4,'#ba8e74',2);pxEllipse(c,13,-18,4,4,'#ba8e74',2);
 pxEllipse(c,0,-5,21,19,dark,2);pxEllipse(c,0,-6,19,18,fur,2);
 // Tiny eyebrow highlights and round inset eyes.
 rect(c,-11,-12,6,2,'#c9966f');rect(c,5,-12,6,2,'#c9966f');
 pxEllipse(c,-8,-8,3,4,'#282927',1);pxEllipse(c,8,-8,3,4,'#282927',1);
 rect(c,-9,-10,1,2,'#f9e6c7');rect(c,7,-10,1,2,'#f9e6c7');
 // Very short bear muzzle, NOT elongated or projecting dog snout.
 pxEllipse(c,0,2,11,7,'#d5ae82',2);pxEllipse(c,0,0,5,3,'#493a33',1);
 rect(c,-1,3,2,3,'#60443b');rect(c,-3,6,6,2,'#60443b');
 if(pose==='eat'){rect(c,-3,4,7,4,'#3b302c');rect(c,2,3,4,3,'#bb6072')}
 if(pose==='vape'){rect(c,-2,7,5,4,'#3d332d');rect(c,11,7,4,13,'#83979f');rect(c,12,8,2,3,'#d5d4cf')}
 // Shoulder fur patches and tiny scarfs.
 rect(c,-12,11,24,3,n.scarf||'#e0b66f');rect(c,6,14,4,7,n.scarf||'#e0b66f');
 if(pose==='proud'){rect(c,-4,-30,8,4,'#edbf77');rect(c,-2,-35,4,5,'#edbf77')}
 if(pose==='play'||pose==='wrestle') {pxEllipse(c,-17,7,7,7,fur,2);pxEllipse(c,17,8,7,7,fur,2)}
 c.restore();
}
bear=function(c,x,y,scale,n,t=0){newBear(c,x,y,scale,n,t)};
// Generic small icons share a consistent pixel grid and 4-tone palette with baseline art.
drawItem=function(canvas,id){if(!EXTRA_ITEMS[id])return oldDrawItem(canvas,id);
 const c=canvas.getContext('2d');c.clearRect(0,0,24,24);c.imageSmoothingEnabled=false;
 const color=items[id].color,dark='#46584e',light='#eee5b6';
 if(['freshfish','driedfish','fishstone'].includes(id)){
  const body=id==='freshfish'?'#8da8b5':id==='driedfish'?'#b89a6d':'#8092a7';
  rect(c,4,8,3,8,body);rect(c,7,7,3,10,body);rect(c,10,6,7,11,body);rect(c,17,8,3,6,body);
  rect(c,6,9,3,5,dark);rect(c,13,8,3,2,'#eee6cf');rect(c,18,10,2,2,'#394b4b');
  if(id==='freshfish'){rect(c,10,6,3,2,'#e1eced');rect(c,12,17,3,2,'#6c879b');}
  if(id==='driedfish'){rect(c,7,12,11,2,'#e1bd8d');rect(c,10,15,5,2,'#795f42');}
  if(id==='fishstone'){rect(c,7,6,5,3,'#aab9c9');rect(c,11,16,6,3,'#4f6478');}
  return;
 }
 rect(c,4,19,16,2,'#9eac9266');
 const cat=items[id].category;
 if(cat==='Food'){pxEllipse(c,12,12,9,8,color,2);rect(c,8,7,6,3,light);rect(c,11,4,2,4,dark)}
 else if(cat==='Drink'){rect(c,7,4,11,16,dark);rect(c,9,6,7,11,color);rect(c,11,3,3,3,light)}
 else if(cat==='Material'){rect(c,6,6,12,12,color);rect(c,6,6,12,2,light);rect(c,6,18,12,3,dark)}
 else if(cat==='Toy'){pxEllipse(c,12,12,9,8,color,2);rect(c,4,10,5,4,dark);rect(c,16,10,4,4,light);rect(c,12,7,3,3,dark)}
 else if(cat==='Tool'){rect(c,11,2,4,18,dark);rect(c,5,6,15,6,color);rect(c,9,7,6,3,light)}
 else if(cat==='Human'){rect(c,6,4,12,16,dark);rect(c,8,6,8,13,color);rect(c,9,7,4,3,light)}
 else if(cat==='Craft'){rect(c,6,6,12,13,dark);rect(c,8,8,9,9,color);rect(c,9,9,4,3,light)}
 else {pxEllipse(c,12,12,10,8,dark,2);pxEllipse(c,12,10,8,6,color,2);rect(c,8,7,4,2,light)}
};
// Physical construction placed in the original clearing with real, visually distinct objects.
function drawAmenity(c,id,x,y){
 const w=58,wood='#72513c',hi='#bf955d';
 if(['bench','table','workbench','display','storage'].includes(id)){
  rect(c,x,y,w,9,hi);rect(c,x+3,y+8,8,25,wood);rect(c,x+45,y+8,8,25,wood);
  if(id==='bench')rect(c,x+2,y-12,52,9,'#bf995f');
  if(id==='display') {rect(c,x+3,y-25,52,24,'#a6c9b8');rect(c,x+7,y-20,13,11,'#e9c78f')}
  if(id==='storage')rect(c,x+4,y-25,50,23,wood);
 }
 if(['waterstation','firepit','nest','playground'].includes(id)){
  rect(c,x,y,55,20,id==='waterstation'?'#87b7b8':id==='firepit'?'#866d5e':'#85a177');
  if(id==='waterstation')rect(c,x+9,y+5,35,10,'#b5e3df');
  if(id==='firepit'){rect(c,x+14,y-9,23,11,'#d6a260');rect(c,x+24,y-17,6,10,'#f2cd82')}
  if(id==='playground')rect(c,x+8,y-6,38,5,'#d6c292');
 }
 if(['sign','fence','lanterns','bridge','shelter'].includes(id)){
  rect(c,x+18,y-13,8,33,wood);rect(c,x+1,y-24,52,17,hi);
  if(id==='lanterns')rect(c,x+13,y-29,15,10,'#f3d18d');
  if(id==='bridge')rect(c,x,y+4,55,7,'#cfac74');
 }
}
const amenityPositions=[[349,167],[461,181],[546,198],[626,270],[340,278],[550,312],[396,301],[662,348],[68,215],[692,247],[356,379],[34,325],[584,377],[444,120]];
const baseDrawScene=drawScene;
drawScene=function(){baseDrawScene();const c=ctx;
 const construction=upgrades.filter(u=>state.upgrades.includes(u.id)&&extraUpgrades.some(e=>e.id===u.id));
 construction.forEach((u,i)=>{if((state.v5Builds||[]).some(b=>b.id===u.id))return;let idx=extraUpgrades.findIndex(e=>e.id===u.id),[x,y]=amenityPositions[idx];drawAmenity(c,u.id,x,y);
  // Visual buildings have no floating word labels, keeping the crowded forest legible.
 });
 // Proud displayed stock, drawn as actual objects behind the counter.
 let offset=0;for(const id of Object.keys(state.displayed).filter(k=>state.displayed[k]>0)){
  const cv=document.createElement('canvas');cv.width=cv.height=24;drawItem(cv,id);c.drawImage(cv,110+offset*32,230,27,27);offset++;
 }
 // Mama is physically present near the path at evening/night and never vanishes from the story.
 if(phase()===0||phase()>=2){bear(c,715,291,1.45,{skin:'#7f513a',ear:'#553b31',scarf:'#d1ab70',age:32,activity:'watching'},animationTime);
  rect(c,673,226,87,16,'#ffefc8');c.font='bold 11px monospace';c.textAlign='center';c.fillStyle='#394735';c.fillText('MAMA BEAR',718,237);
 }
 // Show vapor as a visible short-lived cloud only when the unsafe artifact was used.
 if(state.pose==='vape'&&Date.now()<state.poseUntil){
  for(const p of specialParticles){p.age+=.8;const dy=p.age*.7;const xx=p.x+Math.sin(p.age/8)*7;
    if(p.age<70){c.fillStyle=p.age%3>1?'#e0dacf':'#c0d2c9';c.fillRect(xx,p.y-dy,5+Math.floor(p.age/11),3+Math.floor(p.age/15));}}
 }
 if(state.pose&&Date.now()>state.poseUntil)state.pose='idle';
 // Distinguish day phases visually in the canvas itself; not CSS only.
 if(phase()===3){c.fillStyle='#12284452';c.fillRect(0,0,768,434);
   c.fillStyle='#f4dc91';c.fillRect(686,20,12,12);for(let i=0;i<15;i++){let x=(i*97+37)%768,y=(i*43+21)%150;c.fillStyle='#f3dca5';c.fillRect(x,y,2,2)}}
 else if(phase()===2){c.fillStyle='#d99d5e25';c.fillRect(0,0,768,434)}
};
// Decoration and player actor pose: original base sprite receives the richer bear drawing.
render=function(){oldRender();renderV2()};
renderJournal=function(){oldRenderJournal();const hint=$('tab-journal').querySelector('.quest');if(hint){hint.querySelector('b').textContent='✦ GROW A WOODLAND LANDMARK';$('questText').textContent=`${state.rep}/25 reputation · ${state.trades}/12 trades · ${state.upgrades.length}/6 structures${state.victory?' · MILESTONE COMPLETE':''}`;}
 const paras=$('tab-journal').querySelectorAll('p');for(const p of paras){if(p.textContent.includes('sealed human vape'))p.innerHTML='Some cubs whisper of the <b>mythical human vape</b>. It can be found on the trail very rarely, examined, hidden, displayed or used. Using it triggers visible vapor, coughing, declining health, dependence risk and Mama’s concern; it is never a health or economic power-up.';}
 const countEl=$('discoveryCount');countEl.textContent=state.npcs.filter(n=>n.discovered).length+'/6 SECRETS';
  document.querySelectorAll('#journalNotes .noteCard p').forEach((el,i)=>{const n=state.npcs[i];if(n.discovered)el.textContent=n.backstory||'A very personal treasure.';});
};
// User click / keyboard transitions.
$('forageBtn').onclick=openForage;
$('nextBtn').onclick=()=>newDay(true);
$('gossipBtn').onclick=listen;
$('tradeBtn').onclick=negotiate;
$('helpBtn').onclick=()=>openModal('Your cub, your trading post',`<p><b>Morning:</b> eat, see Mama, gather. <b>Afternoon:</b> trade, construct, play. <b>Evening:</b> close up and show Mama treasures. <b>Night:</b> hide items, sleep or explore safely with lighting.</p><p><b>Inventory:</b> click an item for real actions (eat, hide, display, gift, play). <b>Cub Life:</b> socialize and discover sibling relationships. <b>Mama:</b> ask for food, cuddle, confess or rest. <b>My Post:</b> choose stall-access fees, inspect storage and buildings. <b>Make & Build:</b> craft and expand your clearing.</p><p><b>Economy:</b> every cub has preferences, inventories, age, memories and relationships. The forest has limited goods that regrow gradually. Skipping time consumes food and water.</p><p><b>Artifact warning:</b> the mythical human vape is usable but unsafe and has lasting consequences, not benefits.</p>`,[{text:'BACK TO MY POST',action:closeModal}]);
// Rebind UI after the original handler assignment runs (the injection is placed immediately before load();).
// Help event gets replaced by the immediately following original assignment; use microtask after init.
queueMicrotask(()=>{
 $('forageBtn').onclick=openForage;$('nextBtn').onclick=()=>newDay(true);$('gossipBtn').onclick=listen;$('tradeBtn').onclick=negotiate;
 document.querySelectorAll('.tab').forEach(b=>b.onclick=()=>switchTab(b.dataset.tab));
});
// The player is the third member of Fern and Pebble's biological litter (all 11 months old).
for(const n of NPCS.filter(n=>['fern','pebble'].includes(n.id)))n.family='Your littermate! You, Fern and Pebble are all 11 months old.';
opening=function(){try{if(localStorage.getItem('little_trading_post_seen_v2'))return}catch(e){}
 openModal('WELCOME BACK, LITTLE TRADER!',`<p>You are an <b>11-month-old baby brown bear</b> with <b>3 berries</b>, <b>1 very nice stick</b>, two littermates, and a trading post of your own.</p><ul><li><b>Click an item</b> in your backpack to EAT, HIDE, GIFT, DISPLAY or USE it.</li><li><b>Four times of day</b> — morning, afternoon, evening and night — contain a small number of meaningful activities.</li><li><b>Explore</b> four gathering areas that gradually run out of finds and replenish overnight.</li><li><b>Cub Life</b> lets you wrestle and socialize; <b>Mama</b> can feed, cuddle and check on you.</li><li><b>My Post</b> gives YOU control of stall fees, access policies, storage and amenities.</li><li><b>Make & Build</b> includes a growing range of useful objects and structures.</li></ul><p>Fern and Pebble are your littermates. Fern has a carved wooden fish; Pebble wants one. Their deal won't wait forever.</p>`,[{text:'OPEN MY REAL TRADING POST',action:()=>{try{localStorage.setItem('little_trading_post_seen_v2','yes')}catch(e){}closeModal()}}]);};

