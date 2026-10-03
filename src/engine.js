/* Parking prototype v0.3. No shuttle rules. No randomness at runtime. */
(function(root){
'use strict';
const copy=value=>JSON.parse(JSON.stringify(value));
function initial(level){return {parked:level.cars.map(c=>c.id),bays:[null,null,null],head:0,departed:[],moves:0};}
function car(level,id){return level.cars.find(c=>c.id===id);}
function blockers(level,state,id){
 const a=car(level,id);if(!a||!state.parked.includes(id))return [];
 return state.parked.filter(other=>{
  if(other===id)return false;const b=car(level,other);
  if(a.dir==='N')return b.x<a.x+a.w&&b.x+b.w>a.x&&b.y+b.h<=a.y;
  if(a.dir==='S')return b.x<a.x+a.w&&b.x+b.w>a.x&&b.y>=a.y+a.h;
  if(a.dir==='W')return b.y<a.y+a.h&&b.y+b.h>a.y&&b.x+b.w<=a.x;
  return b.y<a.y+a.h&&b.y+b.h>a.y&&b.x>=a.x+a.w;
 }).sort((i,j)=>{const b=car(level,i),c=car(level,j);return a.dir==='N'?c.y-b.y:a.dir==='S'?b.y-c.y:a.dir==='W'?c.x-b.x:b.x-c.x;});
}
function settle(level,state,events=[]){
 while(state.head<level.queue.length){
  const color=level.queue[state.head],slot=state.bays.findIndex(b=>b&&car(level,b.id).color===color);
  if(slot<0)break;
  const b=state.bays[slot],v=car(level,b.id);b.filled++;
  events.push({type:'board',id:b.id,slot,color,index:state.head++,filled:b.filled});
  if(b.filled===v.capacity){state.bays[slot]=null;state.departed.push(v.id);events.push({type:'depart',id:v.id,slot});}
 }
 return events;
}
function step(level,previous,id){
 if(!Number.isInteger(id)||!previous.parked.includes(id))return {ok:false,reason:'missing'};
 const blockedBy=blockers(level,previous,id);if(blockedBy.length)return {ok:false,reason:'blocked',blockedBy};
 const slot=previous.bays.indexOf(null);if(slot<0)return {ok:false,reason:'full'};
 const state=copy(previous);state.parked=state.parked.filter(v=>v!==id);state.bays[slot]={id,filled:0};state.moves++;
 const events=[{type:'move',id,slot}];settle(level,state,events);return {ok:true,state,events};
}
function won(level,state){return state.head===level.queue.length&&state.parked.length===0&&state.bays.every(b=>b===null);}
function legal(level,state){return state.bays.includes(null)?state.parked.filter(id=>!blockers(level,state,id).length):[];}
function deadlocked(level,state){return !won(level,state)&&legal(level,state).length===0;}
function key(s){return s.parked.join(',')+'|'+s.bays.map(b=>b?b.id+':'+b.filled:'-').join(',')+'|'+s.head;}
function solve(level,start=initial(level),budget=150000){
 let visited=0,exhausted=false;const seen=new Set();
 function visit(state){
  if(won(level,state))return [];
  const k=key(state);if(seen.has(k))return null;seen.add(k);
  if(++visited>budget){exhausted=true;return null;}
  const candidates=legal(level,state).map(id=>({id,r:step(level,state,id)}));candidates.sort((a,b)=>b.r.state.head-a.r.state.head);
  for(const {id,r} of candidates){if(exhausted)break;const rest=visit(r.state);if(rest)return [id,...rest];}
  return null;
 }
 const path=visit(copy(start));return {path,visited,exhausted};
}
function analyze(level,budget=200000){
 // Exact probability for uniform random legal moves, not human difficulty.
 const memo=new Map();let states=0,deadEnds=0,firstTrap=null;
 function visit(s,path){
  if(won(level,s))return 1;const k=key(s);if(memo.has(k))return memo.get(k);
  if(++states>budget)throw Error('Analysis budget exceeded');
  const options=legal(level,s);if(!options.length){deadEnds++;if(!firstTrap)firstTrap=path;memo.set(k,0);return 0;}
  const probability=options.reduce((n,id)=>n+visit(step(level,s,id).state,[...path,id]),0)/options.length;
  memo.set(k,probability);return probability;
 }
 const randomWin=visit(initial(level),[]);return {randomWin,states,deadEnds,trap:firstTrap};
}
function validate(level){
 const errors=[],cells=new Set(),ids=new Set(),seats={},people={};
 if(level.size!==6)errors.push('size');
 if(!Array.isArray(level.cars)||level.cars.length<1||level.cars.length>12)return ['cars'];
 for(const c of level.cars){
  if(!Number.isInteger(c.id)||ids.has(c.id))errors.push('id');ids.add(c.id);
  if(!['N','S','E','W'].includes(c.dir))errors.push('direction');
  if(!Number.isInteger(c.color)||c.color<0||c.color>3)errors.push('color');
  if(!Number.isInteger(c.capacity)||c.capacity<2||c.capacity>4)errors.push('capacity');
  if(![c.x,c.y,c.w,c.h].every(Number.isInteger)||c.w<1||c.h<1)errors.push('geometry');
  if((c.dir==='N'||c.dir==='S')?(c.w!==1||![2,3].includes(c.h)):(c.h!==1||![2,3].includes(c.w)))errors.push('orientation');
  for(let x=c.x;x<c.x+c.w;x++)for(let y=c.y;y<c.y+c.h;y++){
   if(x<0||y<0||x>=6||y>=6)errors.push('bounds');const k=x+','+y;if(cells.has(k))errors.push('overlap');cells.add(k);
  }
  seats[c.color]=(seats[c.color]||0)+c.capacity;
 }
 if(!Array.isArray(level.queue))return [...errors,'queue'];
 for(const color of level.queue)people[color]=(people[color]||0)+1;
 for(const color of new Set([...Object.keys(seats),...Object.keys(people)]))if(seats[color]!==people[color])errors.push('passenger balance');
 return errors;
}
const API={copy,initial,car,blockers,settle,step,won,legal,deadlocked,solve,analyze,validate,key};
if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.ParkingEngine=API;
})(typeof window!=='undefined'?window:globalThis);
