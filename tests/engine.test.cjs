const test=require('node:test'),assert=require('node:assert/strict');
const E=require('../src/engine.js'),levels=require('../src/levels.js');
const key=s=>JSON.stringify([s.cars,s.waiting,s.stop]);
const work=s=>s.cars.reduce((n,c)=>n+E.cargo(c),0)+2*s.waiting.reduce((a,b)=>a+b,0);
test('Unload before boarding: mixed four-seat minibus makes room, then retains new riders',()=>{
 const before={cars:[[2,2]],waiting:[2,0],stop:0,delivered:0,trips:0};
 const original=E.copy(before),r=E.step(before,0);
 assert.deepEqual(before,original);assert.equal(r.ok,true);assert.deepEqual(r.state.cars,[[0,4]]);
 assert.deepEqual(r.state.waiting,[0,0]);assert.equal(r.state.delivered,2);assert.equal(r.state.stop,1);
 const next=E.step(r.state,0);assert.equal(next.event.out,4);assert.equal(next.state.delivered,6);assert.equal(E.won(next.state),true);
});
test('Partial boarding never exceeds four seats and leaves extra people waiting',()=>{
 const s={cars:[[1,3]],waiting:[7,0],stop:0,delivered:0,trips:0};const r=E.step(s,0);
 assert.equal(r.event.on,1);assert.equal(r.state.waiting[0],6);assert.deepEqual(r.state.cars[0],[0,4]);
});
test('Full wrong-destination car and invalid indices do not spend trips or mutate state',()=>{
 const s={cars:[[0,4]],waiting:[2,0],stop:0,delivered:0,trips:0},before=JSON.stringify(s);
 for(const id of [0,-1,2,NaN,0.5])assert.equal(E.step(s,id).ok,false);
 assert.equal(JSON.stringify(s),before);
});
test('Empty stops are skipped without charging a trip',()=>{
 const s={cars:[[0,2],[0,1]],waiting:[0,0],stop:1,delivered:0,trips:0};const r=E.step(s,0);
 assert.equal(r.state.trips,1);assert.equal(r.state.stop,1);assert.equal(r.state.delivered,2);
});
test('Undo snapshot restores cargo, queue, stop and delivered count exactly',()=>{
 const s=E.initial(levels[1]),history=[E.copy(s)];let next=E.step(s,0).state;next=E.step(next,1).state;
 next=history.pop();assert.deepEqual(next,s);assert.equal(next.trips,0);
});
test('Invalid fleet definitions are rejected',()=>{
 assert.ok(E.validate({cars:[[5,0]],waiting:[0,0]}).length);
 assert.ok(E.validate({cars:[[2,-1]],waiting:[0,0]}).length);
 assert.ok(E.validate({cars:[[2,0]],waiting:[0,-1]}).length);
});
for(const l of levels)test('Level '+l.id+': every reachable state conserves passengers, respects capacity and permits progress',()=>{
 assert.deepEqual(E.validate(l),[]);const queue=[E.initial(l)],seen=new Set([key(queue[0])]);let head=0,completeCount=0;
 while(head<queue.length){
  const s=queue[head++];assert.equal(s.delivered+s.waiting.reduce((a,b)=>a+b,0)+s.cars.reduce((n,c)=>n+E.cargo(c),0),E.total(l));
  for(const c of s.cars){assert.ok(E.cargo(c)<=4);assert.ok(c.every(n=>Number.isInteger(n)&&n>=0));}
  if(E.won(s)){completeCount++;continue;}
  let legal=0;
  for(let id=0;id<s.cars.length;id++){
   const r=E.step(s,id);if(!r.ok)continue;legal++;
   assert.ok(work(r.state)<work(s),'Every legal trip reduces unfinished transport work');
   assert.equal(r.state.trips,s.trips+1);
   const k=key(r.state);if(!seen.has(k)){seen.add(k);queue.push(r.state);}
  }
  assert.ok(legal>0,'No unwinnable terminal states');assert.ok(queue.length<100000);
 }
 assert.ok(completeCount>0);
 // Independent, unsymmetrized BFS traversal above retains shortest trip counts.
 const shortest=Math.min(...queue.filter(E.won).map(s=>s.trips));
 const solution=E.solve(E.initial(l));assert.equal(solution.path.length,shortest);
 let s=E.initial(l);for(const id of solution.path){const r=E.step(s,id);assert.equal(r.ok,true);s=r.state;}
 assert.equal(E.won(s),true);
});
