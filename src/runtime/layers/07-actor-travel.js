/* v5.2 physical NPC travel and action foundations. All movement has persistent
   state and leaves the current scene through the visible border. */
function v53AdvanceToward(n,target,dT,speed=83){
 const p=n.worldPos;const dx=target[0]-p[0],dy=target[1]-p[1],dist=Math.hypot(dx,dy);
 if(dist<3){p[0]=target[0];p[1]=target[1];return true;}
 const step=Math.min(dist,speed*dT);
 p[0]+=dx/dist*step;p[1]+=dy/dist*step;
 return step>=dist-0.01;
}
function v53TransitStep(n,dT){
 const p=n.travelPlan;
 if(!p)return;
 if(p.stage==='leaving'){
   const waypoint=p.waypoints[0];
   if(!waypoint){p.stage='between';p.elapsed=0;return;}
   n.activity='walk';
   if(v53AdvanceToward(n,waypoint,dT)){p.waypoints.shift();if(p.waypoints.length)n.worldTarget=p.waypoints[0].slice();}
 }else if(p.stage==='between'){
   p.elapsed+=dT;
   // Connected scene graph travel uses real time, even when the cub is off-screen.
   const hops=Math.max(1,p.path.length-1);
   if(p.elapsed>=hops*1.6){
     n.location=p.to;
     n.worldPos=[719,382];
     const delta={fern:-96,pebble:90,waffle:-95,juniper:95,sprout:-50,moss:135}[n.id]||0;
     const goal=origin[p.to]||[345,330];
     p.waypoints=[[clamp(goal[0]+delta,70,690),clamp(goal[1],190,379)]];
     p.stage='arriving';
     n.worldTarget=p.waypoints[0].slice();
   }
 }else if(p.stage==='arriving'){
   n.activity='walk';
   if(v53AdvanceToward(n,p.waypoints[0],dT)){
     n.worldTarget=n.worldPos.slice();
     n.activity='browsing';
     n.memory.unshift('D'+state.day+': Walked from '+WORLD[p.from].short+' to '+WORLD[p.to].short);
     n.memory=n.memory.slice(0,16);
     n.travelPlan=null;
   }
 }
}
function v53Amenity(n){
 if(n.location==='den'&&phase()===3)return {kind:'sleep',target:[clamp((n.worldPos?.[0]||350),120,380),350]};
 const pref=n.activity||'browsing';
 const mapping={sit:'bench',chat:'bench',comfort:'bench',eat:'firepit',drink:'waterstation',play:'playground',wrestle:'playground',chase:'playground',craft:'workbench',sleep:'nest'};
 const id=mapping[pref];
 if(!id)return null;
 let place=(state.v5Builds||[]).find(a=>a.id===id&&n.location==='post');
 if(place)return {kind:pref,target:[place.x||place.pos?.[0]||425,place.y||place.pos?.[1]||350]};
 const o=WORLD[n.location]?.objects?.find(a=>a[3]===id);
 if(o)return {kind:pref,target:[o[1],o[2]+26]};
 return null;
}
function v53NpcFrame(dT){
 if(!state?.npcs)return;
 for(const n of state.npcs){
   if(!n.worldPos||!WORLD[n.location])continue;
   if(n.travelPlan){v53TransitStep(n,dT);continue;}
   const want=v53Amenity(n);
   if(!want){if(n.physicalIntent)n.physicalIntent=null;continue;}
   if(!n.physicalIntent||n.physicalIntent.kind!==want.kind||
      Math.hypot(n.physicalIntent.target[0]-want.target[0],n.physicalIntent.target[1]-want.target[1])>8){
     n.physicalIntent={kind:want.kind,target:want.target,stage:'approach',once:false};
   }
   const intent=n.physicalIntent;
   if(intent.stage==='approach'){
     n.worldTarget=intent.target.slice();
     if(v53AdvanceToward(n,intent.target,dT,67))intent.stage='using';
   }else if(!intent.once){
     intent.once=true;
     if(intent.kind==='sleep')n.energy=clamp((n.energy||70)+7);
     if(intent.kind==='drink')n.energy=clamp((n.energy||70)+2);
     if(['play','wrestle','chase'].includes(intent.kind))n.energy=clamp((n.energy||70)-2);
     // Effects are tied to reaching the object, not clicking a text-only button.
     n.memory.unshift('D'+state.day+': '+intent.kind+' at '+WORLD[n.location].short);
     n.memory=n.memory.slice(0,16);
   }
 }
}
const v53PreviousDraw=drawScene;
drawScene=function(){
 v53PreviousDraw();
 if(!state||mapOpen)return;
 for(const n of state.npcs){
   if(n.location!==state.location||n.travelPlan?.stage==='between')continue;
   const intent=n.physicalIntent;if(!intent||intent.stage!=='using')continue;
   const [x,y]=n.worldPos;
   ctx.save();ctx.textAlign='center';ctx.font='bold 10px monospace';
   if(intent.kind==='eat'||intent.kind==='drink'){
     ctx.fillStyle='#f3dbac';ctx.fillRect(x+16,y-4,10,8);ctx.fillStyle='#8c5e3b';ctx.fillRect(x+19,y-5,4,4);
   }else if(intent.kind==='sit'||intent.kind==='chat'){
     ctx.fillStyle='#ae7b4a';ctx.fillRect(x-24,y+26,48,5);ctx.fillRect(x-18,y+26,5,12);
   }else if(intent.kind==='sleep'){
     ctx.fillStyle='#fff4d1';ctx.fillText('z z',x+21,y-28);
   }else if(['play','wrestle','chase'].includes(intent.kind)){
     ctx.fillStyle='#fbd28b';ctx.fillText('♥',x+24,y-28);
   }
   ctx.restore();
 }
};


