/* Validate and migrate a portable save without touching browser storage or live state. */
const isRecord=x=>x!==null&&typeof x==='object'&&!Array.isArray(x);
function checkInventory(inv,label,items){
  if(!isRecord(inv))throw Error(label+' is not an inventory.');
  for(const [id,q] of Object.entries(inv)){
    if(!Object.prototype.hasOwnProperty.call(items,id))throw Error(label+' contains an unknown item.');
    if(!Number.isSafeInteger(q)||q<0||q>100000)throw Error(label+' has invalid item quantities.');
  }
}
export function prepareImportedSave(data, rules){
  const {items, locations: WORLD, origins: origin, cubs: NPCS, migrateV2: ensureV2,
    migrateV3: ensureV3, migrateV4: ensureV4, migrateV5: v5Ensure}=rules;
  const input=structuredClone(data);
  if(!isRecord(input)||input.version!==1)throw Error('Unsupported save format.');
  if(!Array.isArray(input.npcs)||input.npcs.length!==NPCS.length)throw Error('Save must include all six cubs.');
  if(!Number.isSafeInteger(input.day)||input.day<1||input.day>1000000)throw Error('Invalid forest day.');
  if(!isRecord(input.inv))throw Error('Player inventory is missing.');
  checkInventory(input.inv,'Your bag',items);
  for(const name of ['hidden','stored','displayed']){
    if(input[name]!==undefined)checkInventory(input[name],name,items);
  }
  if(input.hiddenAt!==undefined){
    if(!isRecord(input.hiddenAt))throw Error('Invalid hidden locations.');
    for(const [loc,inv] of Object.entries(input.hiddenAt)){
      if(!Object.prototype.hasOwnProperty.call(WORLD,loc))throw Error('Unknown hiding location.');
      checkInventory(inv,'Hidden '+loc,items);
    }
  }
  if(input.location!==undefined&&!Object.prototype.hasOwnProperty.call(WORLD,input.location))throw Error('Unknown world location.');
  for(let i=0;i<NPCS.length;i++){
    const n=input.npcs[i];
    if(!isRecord(n)||n.id!==NPCS[i].id)throw Error('Missing or reordered cub identity.');
    checkInventory(n.inv,'Cub '+NPCS[i].name,items);
    if(n.hiddenInv!==undefined)checkInventory(n.hiddenInv,NPCS[i].name+' hidden inventory',items);
    if(n.reservedInv!==undefined){
      if(!isRecord(n.reservedInv))throw Error('Invalid cub reservations.');
      for(const [id,reserved] of Object.entries(n.reservedInv)){
        if(typeof reserved==='boolean')n.reservedInv[id]=Number(reserved);
      }
      checkInventory(n.reservedInv,NPCS[i].name+' reservations',items);
    }
    if(n.rel!==undefined&&!Number.isFinite(n.rel))throw Error('Invalid cub friendship.');
  }
  if(input.needs!==undefined){
    if(!isRecord(input.needs))throw Error('Invalid needs.');
    for(const value of Object.values(input.needs))if(!Number.isFinite(value))throw Error('Invalid needs value.');
  }
  if(input.trader?.stock!==undefined)checkInventory(input.trader.stock,'Trader stock',items);
  if(input.mama?.confiscated!==undefined)checkInventory(input.mama.confiscated,'Mama inventory',items);
  if(input.playerPos!==undefined&&(!Array.isArray(input.playerPos)||input.playerPos.length!==2||input.playerPos.some(x=>!Number.isFinite(x))))throw Error('Invalid cub position.');
  for(const field of ['rep','trades','tick']){
    if(input[field]!==undefined&&(!Number.isSafeInteger(input[field])||input[field]<0||input[field]>100000000))throw Error('Invalid '+field+'.');
  }
  // JSON.parse can carry arbitrary public-facing strings. Restore canonical NPC
  // names/titles and escape dynamic values at HTML boundaries.
  for(let i=0;i<NPCS.length;i++){
    const n=input.npcs[i];n.name=NPCS[i].name;n.title=NPCS[i].title;
    n.quote=NPCS[i].quote;n.family=typeof n.family==='string'?n.family.slice(0,300):n.family;
    if(!Array.isArray(n.memory)&&typeof n.memory!=='string')n.memory=[];
  }
  // Old standalone saves may not have the later extension fields.
  if(input.v2!==2)ensureV2(input);
  input.hidden=input.hidden||{};input.stored=input.stored||{};input.displayed=input.displayed||{};
  if(input.v3!==3)ensureV3(input);
  input.hiddenAt=input.hiddenAt||{};for(const loc of Object.keys(WORLD))input.hiddenAt[loc]=input.hiddenAt[loc]||{};
  input.hiddenAt.post=input.hidden;
  input.history=Array.isArray(input.history)?input.history:[];
  input.location=input.location||'post';
  input.playerPos=input.playerPos||origin[input.location].slice();
  if(input.v4!==4)ensureV4(input);
  input.avatar=input.avatar||{name:'Little Cub',gender:'Male',pronouns:'he/him',coat:'#aa774b'};
  if(typeof input.avatar.name!=='string'||input.avatar.name.length>32||/[<>]/.test(input.avatar.name))throw Error('Invalid cub name.');
  input.tutorial=input.tutorial||{enabled:false,step:0,completed:false};
  input.tracker=input.tracker||{fishing:0,swimming:0,fishCaught:0,roadAccidents:0,discovered:[],lessons:0};
  input.orphan=input.orphan||{status:'not-found',foundDay:null,warmth:60,food:72,name:'Foundling',seenByMama:false};
  input.options=input.options||{reducedMotion:false,help:true};
  v5Ensure(input);
  input.v5ContrabandLog=Array.isArray(input.v5ContrabandLog)?input.v5ContrabandLog:[];
  input.v5DrugHistory=input.v5DrugHistory||{};
  input.v5Builds=input.v5Builds||[];
  input.v5Events=input.v5Events||[];
  input.v5NPCMoves=input.v5NPCMoves||[];
  input.knownSecrets=input.knownSecrets||{};
  input.cheats=input.cheats||{on:false,god:false,infinite:false};
  input.mapVisits=input.mapVisits||{[input.location]:1};
  input.log=Array.isArray(input.log)?input.log:[];
  input.npcs.forEach(n=>{
    n.hiddenInv=n.hiddenInv||{};n.reservedInv=n.reservedInv||{};
    n.location=Object.prototype.hasOwnProperty.call(WORLD,n.location)?n.location:'post';
    n.worldPos=Array.isArray(n.worldPos)&&n.worldPos.length===2&&n.worldPos.every(Number.isFinite)?n.worldPos:origin[n.location].slice();
    n.worldTarget=Array.isArray(n.worldTarget)&&n.worldTarget.length===2&&n.worldTarget.every(Number.isFinite)?n.worldTarget:n.worldPos.slice();
    n.relTo=n.relTo||{};n.dependency=n.dependency||{nic:0,cannabis:0,alcohol:0,stimulant:0,opioid:0};
    n.knowledge=n.knowledge||{};n.memory=Array.isArray(n.memory)?n.memory:[];
  });
  return input;
}
