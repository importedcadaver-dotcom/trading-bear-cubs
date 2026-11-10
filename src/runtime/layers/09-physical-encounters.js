/* v5.3 — Autonomous physical encounters. Actual transfers and social results
   resolve only after both bears walk into the same scene and meet in person.
   In-progress intentions and pathing are part of the ordinary saved state. */
function v54Blocked(loc,x,y){
 if(x<32||x>738||y<133||y>411)return true;
 if(loc==='den'&&x>399&&x<522&&y>267&&y<311)return true;
 if(loc==='post'&&x>124&&x<276&&y>282&&y<348)return true;
 return false;
}
function v54ClearSegment(loc,from,to){
 const dx=to[0]-from[0],dy=to[1]-from[1],distance=Math.hypot(dx,dy);
 for(let i=0,n=Math.max(1,Math.ceil(distance/7));i<=n;i++){
   const t=i/n;
   if(v54Blocked(loc,from[0]+dx*t,from[1]+dy*t))return false;
 }
 return true;
}
function v54GridPath(loc,from,target){
 const gap=14,x0=35,y0=137,maxX=50,maxY=19;
 const cell=p=>[Math.max(0,Math.min(maxX,Math.round((p[0]-x0)/gap))),
                 Math.max(0,Math.min(maxY,Math.round((p[1]-y0)/gap)))];
 const point=(x,y)=>[x0+x*gap,y0+y*gap];
 const key=(x,y)=>x+','+y;
 const [sx,sy]=cell(from),[tx,ty]=cell(target),source=key(sx,sy);
 const queue=[[sx,sy]],parents=new Map(),seen=new Set([source]);
 let found=null;
 for(let i=0;i<queue.length&&i<1100;i++){
   const [x,y]=queue[i],k=key(x,y),pt=point(x,y);
   if(Math.abs(x-tx)+Math.abs(y-ty)<2&&!v54Blocked(loc,...pt)){found=k;break;}
   for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){
     const a=x+dx,b=y+dy,z=key(a,b);
     if(a<0||b<0||a>maxX||b>maxY||seen.has(z)||v54Blocked(loc,...point(a,b)))continue;
     seen.add(z);parents.set(z,k);queue.push([a,b]);
   }
 }
 if(!found)return null;
 const path=[];
 for(let k=found;k!==source;k=parents.get(k)){
   if(!k||path.length>1100)return null;
   const [x,y]=k.split(',').map(Number);
   path.push(point(x,y));
 }
 path.reverse();
 const simplified=[],points=[from,...path];
 let i=0;
 while(i<points.length-1){
   let end=points.length-1;
   while(end>i+1&&!v54ClearSegment(loc,points[i],points[end]))end--;
   simplified.push(points[end]);i=end;
 }
 if(!v54Blocked(loc,...target)&&v54ClearSegment(loc,simplified.at(-1)||from,target)){
   simplified.push(target.slice());
 }
 return simplified;
}
const v54SimpleAdvance=v53AdvanceToward;
v53AdvanceToward=function(n,target,dT,speed=83){
 if(!n?.worldPos||!Array.isArray(target))return false;
 const loc=n.location;
 const goalChanged=!n.navGoal||n.navGoal.loc!==loc||
   Math.hypot(n.navGoal.xy[0]-target[0],n.navGoal.xy[1]-target[1])>10;
 if(goalChanged){n.navGoal={loc,xy:target.slice()};n.navSteps=[];}
 if(v54ClearSegment(loc,n.worldPos,target)&&!n.navSteps?.length){
   return v54SimpleAdvance(n,target,dT,speed);
 }
 if(!n.navSteps?.length){
   const steps=v54GridPath(loc,n.worldPos,target);
   if(!steps)return false;
   n.navSteps=steps;
 }
 while(n.navSteps.length&&Math.hypot(n.navSteps[0][0]-n.worldPos[0],n.navSteps[0][1]-n.worldPos[1])<3){
   n.navSteps.shift();
 }
 if(!n.navSteps.length)return Math.hypot(n.worldPos[0]-target[0],n.worldPos[1]-target[1])<16;
 const finished=v54SimpleAdvance(n,n.navSteps[0],dT,speed);
 if(finished)n.navSteps.shift();
 return n.navSteps.length===0 &&
  (Math.hypot(n.worldPos[0]-target[0],n.worldPos[1]-target[1])<16 ||
   v54Blocked(loc,...target));
};
function v54Positions(a,b){
 const center=[(a.worldPos[0]+b.worldPos[0])/2,
               (a.worldPos[1]+b.worldPos[1])/2];
 const options=[center,[center[0],center[1]+54],[center[0],center[1]-54],
   [center[0]-60,center[1]],[center[0]+60,center[1]]];
 for(const p of options){
  const left=[clamp(p[0]-21,60,700),clamp(p[1],180,386)];
  const right=[clamp(p[0]+21,60,700),clamp(p[1],180,386)];
  if(!v54Blocked(a.location,...left)&&!v54Blocked(a.location,...right))return [left,right];
 }
 return null;
}
function v54StartMeeting(a,b,kind,data={}){
 if(!a||!b||a.id===b.id||a.location!==b.location||a.travelPlan||b.travelPlan||
    a.meetPlan||b.meetPlan)return false;
 const spots=v54Positions(a,b);if(!spots)return false;
 const common={kind,site:a.location,startedDay:state.day,stage:'approach',elapsed:0,
   give:data.give||null,take:data.take||null};
 a.meetPlan={...common,partner:b.id,role:'lead',target:spots[0]};
 b.meetPlan={...common,partner:a.id,role:'partner',target:spots[1]};
 a.physicalIntent=null;b.physicalIntent=null;
 a.activity=b.activity='walk';
 return true;
}
function v54CancelMeeting(a,b,why='interrupted'){
 const kind=a?.meetPlan?.kind||b?.meetPlan?.kind||'activity';
 if(a){a.meetPlan=null;if(!a.travelPlan)a.activity='browsing';}
 if(b){b.meetPlan=null;if(!b.travelPlan)b.activity='browsing';}
 if(a&&b)log(a.name+' and '+b.name+' had their '+kind+' '+why+' before finishing.');
}
function v54FinishMeeting(a,b,plan){
 if(plan.kind==='trade'){
   const x=plan.give,y=plan.take;
   if(!items[x]||!items[y]||x===y||!quantity(a.inv,x)||!quantity(b.inv,y)||
     a.reservedInv?.[x]||b.reservedInv?.[y]){
     v54CancelMeeting(a,b,'postponed when goods changed');return;
   }
   if(a.location==='post'&&(!entry(a)||!entry(b))){
     v54CancelMeeting(a,b,'blocked by trading-post permissions');return;
   }
   add(a.inv,x,-1);add(b.inv,y,-1);add(a.inv,y,1);add(b.inv,x,1);
   a.deals++;b.deals++;
   v51Flight(x,a.worldPos,b.worldPos,950);
   v51Flight(y,b.worldPos,a.worldPos,1080);
   log(a.name+' exchanged '+items[x].name+' with '+b.name+' for '+items[y].name+
       ' face-to-face at '+WORLD[a.location].name+'.');
 }else{
   const kind=plan.kind,delta=kind==='argue'?-1:1;
   a.relTo[b.id]=clamp((a.relTo[b.id]||0)+delta,-6,10);
   b.relTo[a.id]=clamp((b.relTo[a.id]||0)+delta,-6,10);
   if(kind==='share'){
     const gift=Object.keys(a.inv).find(id=>quantity(a.inv,id)>0);
     if(gift){add(a.inv,gift,-1);add(b.inv,gift,1);v51Flight(gift,a.worldPos,b.worldPos,1000);}
   }else if(kind==='gather'&&count(a.inv)<12){
     const id=randomOf(['berry','stick','leaf','twig']);add(a.inv,id,1);
   }
   const energetic=kind==='nap'?6:(kind==='wrestle'?-8:-2);
   a.energy=clamp((a.energy||75)+energetic);
   b.energy=clamp((b.energy||75)+energetic);
   log(a.name+' and '+b.name+' finished '+kind+' together in '+WORLD[a.location].name+'.');
 }
 for(const [n,other] of [[a,b],[b,a]]){
   n.memory=Array.isArray(n.memory)?n.memory:[];
   n.memory.unshift('D'+state.day+': Finished '+plan.kind+' face-to-face with '+other.name);
   n.memory=n.memory.slice(0,16);
   n.meetPlan=null;n.activity='browsing';n.navSteps=[];n.navGoal=null;
 }
}
function v54FrameMeetings(dT){
 const processed=new Set();
 for(const a of state.npcs){
  const plan=a.meetPlan;
  if(!plan||processed.has(a.id))continue;
  const b=state.npcs.find(n=>n.id===plan.partner);
  processed.add(a.id);if(b)processed.add(b.id);
  if(!b||!b.meetPlan||b.meetPlan.partner!==a.id||
     a.location!==b.location||a.location!==plan.site||a.travelPlan||b.travelPlan){
    v54CancelMeeting(a,b);continue;
  }
  if(plan.role!=='lead')continue;
  if(plan.stage==='approach'){
    const aa=v53AdvanceToward(a,plan.target,dT,73);
    const bb=v53AdvanceToward(b,b.meetPlan.target,dT,73);
    a.worldTarget=plan.target.slice();b.worldTarget=b.meetPlan.target.slice();
    if(aa&&bb){plan.stage='perform';b.meetPlan.stage='perform';plan.elapsed=0;
       a.activity=b.activity=plan.kind;}
  }else if(plan.stage==='perform'){
    plan.elapsed+=dT;b.meetPlan.elapsed=plan.elapsed;
    if(plan.elapsed>=(plan.kind==='wrestle'?2.5:1.5))v54FinishMeeting(a,b,plan);
  }
 }
}
const v54PrevFrame=v53NpcFrame;
v53NpcFrame=function(dT){
 if(!state?.npcs)return;
 v54FrameMeetings(dT);
 // A cub in an encounter cannot independently start using furniture until
 // the interaction resolves. The legacy amenities loop sees activity=walk.
 v54PrevFrame(dT);
};
bumpSocial=function(){
 const pairs=[];
 for(const a of state.npcs)for(const b of state.npcs){
   if(a.id<b.id&&a.location===b.location&&!a.travelPlan&&!b.travelPlan&&
      !a.meetPlan&&!b.meetPlan)pairs.push([a,b]);
 }
 if(!pairs.length)return false;
 const [a,b]=randomOf(pairs);
 const kind=phase()===3?'nap':a.temper==='competitive'&&rng()<.4?'argue':
   randomOf(['wrestle','chat','play','share','gather']);
 return v54StartMeeting(a,b,kind);
};
npcTrade=function(){
 const choices=[];
 for(const a of state.npcs)for(const b of state.npcs){
   if(a.id>=b.id||a.location!==b.location||a.travelPlan||b.travelPlan||
     a.meetPlan||b.meetPlan)continue;
   for(const x of Object.keys(a.inv).filter(id=>quantity(a.inv,id)>0&&!a.reservedInv?.[id])){
     for(const y of Object.keys(b.inv).filter(id=>quantity(b.inv,id)>0&&!b.reservedInv?.[id]&&id!==x)){
       const gainA=itemVal(a,y)-itemVal(a,x);
       const gainB=itemVal(b,x)-itemVal(b,y);
       if(gainA>=-1&&gainB>=-1&&gainA+gainB>=2){
         choices.push({a,b,x,y,score:gainA+gainB});
       }
     }
   }
 }
 if(!choices.length)return false;
 choices.sort((p,q)=>q.score-p.score);
 const selected=choices[Math.floor(rng()*Math.min(5,choices.length))];
 if(selected.a.location==='post'&&(!entry(selected.a)||!entry(selected.b)))return false;
 return v54StartMeeting(selected.a,selected.b,'trade',
   {give:selected.x,take:selected.y});
};
// Supplement real actor sprites with distinct physical activity cues.
// The actual bear moves to the encounter location before any effect appears.
const v54PrevDraw=drawScene;
drawScene=function(){
 v54PrevDraw();
 if(!state||mapOpen)return;
 for(const a of state.npcs){
   const p=a.meetPlan;if(!p||p.stage!=='perform'||a.location!==state.location)continue;
   if(p.role!=='lead')continue;
   const b=state.npcs.find(n=>n.id===p.partner);
   if(!b||b.location!==state.location)continue;
   const x=(a.worldPos[0]+b.worldPos[0])/2,
         y=Math.min(a.worldPos[1],b.worldPos[1])-38;
   ctx.save();ctx.textAlign='center';ctx.font='bold 12px monospace';
   ctx.fillStyle=p.kind==='argue'?'#e69586':'#ffe9b9';
   const symbol={wrestle:'✦ RUMBLE!',play:'✦ PLAY!',chat:'♥ CHAT',share:'♡ SHARE',
      gather:'✦ GATHER',nap:'Z z z',argue:'! ARGUE',trade:'↔ TRADE'}[p.kind]||'✦';
   ctx.fillText(symbol,x,y+Math.sin(animationTime*8)*3);
   if(p.kind==='wrestle'||p.kind==='play'){
     ctx.strokeStyle='#f2ce8b';ctx.lineWidth=2;
     ctx.beginPath();ctx.arc(x,y+21,23+Math.sin(animationTime*5)*3,0,Math.PI*1.6);ctx.stroke();
   }
   ctx.restore();
 }
};
// Every debug hook is gated; production players never receive direct controls
// for manipulating other animals' relationships, inventories or schedules.
window.LittleTradingPost={...window.LittleTradingPost,
 npcTestMeeting:(aId,bId,kind,give=null,take=null)=>{
  if(!window.__LTP_TEST__)return false;
  const a=state.npcs.find(n=>n.id===aId),b=state.npcs.find(n=>n.id===bId);
  if(!['trade','wrestle','chat','play','share','gather','nap','argue'].includes(kind))return false;
  return v54StartMeeting(a,b,kind,{give,take});
 },
 npcTestBlocked:(loc,x,y)=>window.__LTP_TEST__?v54Blocked(loc,x,y):null
};
