const test=require('node:test'),assert=require('node:assert/strict'),E=require('../src/engine.js'),levels=require('../src/levels.js');
function invariant(l,s){
 const located=[...s.parked,...s.departed,...s.bays.filter(Boolean).map(b=>b.id)];assert.equal(new Set(located).size,l.cars.length);assert.equal(located.length,l.cars.length);
 assert.ok(s.head>=0&&s.head<=l.queue.length);assert.equal(s.moves,l.cars.length-s.parked.length);
 const boarded=[0,0,0,0];for(const id of s.departed){const c=E.car(l,id);boarded[c.color]+=c.capacity;}
 for(const b of s.bays.filter(Boolean)){const c=E.car(l,b.id);assert.ok(b.filled>=0&&b.filled<c.capacity);boarded[c.color]+=b.filled;}
 assert.deepEqual(boarded,[0,1,2,3].map(color=>l.queue.slice(0,s.head).filter(v=>v===color).length));
}
function gridBlockers(l,s,id){
 const c=E.car(l,id),cells=new Map(),found=new Set(),delta={N:[0,-1],S:[0,1],E:[1,0],W:[-1,0]}[c.dir];
 for(const other of s.parked){if(other===id)continue;const v=E.car(l,other);for(let x=v.x;x<v.x+v.w;x++)for(let y=v.y;y<v.y+v.h;y++)cells.set(x+','+y,other);}
 for(let d=1;d<=6;d++)for(let x=c.x+delta[0]*d;x<c.x+delta[0]*d+c.w;x++)for(let y=c.y+delta[1]*d;y<c.y+delta[1]*d+c.h;y++)if(cells.has(x+','+y))found.add(cells.get(x+','+y));
 return [...found].sort((a,b)=>a-b);
}
test('First puzzle has a real blocker; blocked clicks never move a car',()=>{const l=levels[0],s=E.initial(l),before=JSON.stringify(s);assert.deepEqual(E.blockers(l,s,1),[0]);assert.equal(E.step(l,s,1).ok,false);assert.equal(JSON.stringify(s),before);const after=E.step(l,s,0).state;assert.deepEqual(E.blockers(l,after,1),[]);});
test('First puzzle can deadlock: blue, yellow, yellow consume the three bays',()=>{const l=levels[0];let s=E.initial(l);for(const id of [0,2,3])s=E.step(l,s,id).state;assert.equal(s.head,0);assert.equal(s.bays.filter(Boolean).length,3);assert.equal(E.deadlocked(l,s),true);assert.equal(E.step(l,s,1).reason,'full');assert.equal(E.solve(l,s).path,null);invariant(l,s);});
test('Exact random-policy success for first puzzle is 7/18, not guaranteed completion',()=>{assert.ok(Math.abs(E.analyze(levels[0]).randomWin-7/18)<1e-10);});
test('Correct order clears first puzzle without helpers',()=>{const l=levels[0];let s=E.initial(l);for(const id of [0,1,2,3]){const r=E.step(l,s,id);assert.equal(r.ok,true);s=r.state;}assert.equal(E.won(l,s),true);assert.equal(s.head,8);});
test('FIFO passengers wait; partially filled vehicle stays; one move can dispatch two cars',()=>{
 const l={size:6,cars:[{id:0,x:0,y:0,w:1,h:2,dir:'N',color:0,capacity:2},{id:1,x:2,y:0,w:1,h:2,dir:'N',color:1,capacity:2},{id:2,x:4,y:0,w:1,h:2,dir:'N',color:2,capacity:2}],queue:[0,1,1,0,2,2]};
 let r=E.step(l,E.initial(l),0);assert.equal(r.state.head,1);assert.deepEqual(r.state.bays[0],{id:0,filled:1});assert.equal(r.state.departed.length,0);
 r=E.step(l,r.state,1);assert.equal(r.state.head,4);assert.equal(r.events.filter(e=>e.type==='depart').length,2);assert.equal(r.state.bays.filter(Boolean).length,0);invariant(l,r.state);
});
test('Removing the last move restores the exact jam-free state',()=>{const l=levels[0],s=E.step(l,E.initial(l),0).state,before=JSON.stringify(s);let next=E.step(l,s,2).state;next=E.step(l,next,3).state;assert.equal(E.deadlocked(l,next),true);const restored=E.step(l,E.initial(l),0).state;assert.equal(JSON.stringify(restored),before);assert.ok(E.solve(l,restored).path);});
test('All four directions and every parked subset agree with independent swept-grid geometry',()=>{
 for(const l of levels)for(let mask=1;mask<(1<<l.cars.length);mask++){const s=E.initial(l);s.parked=s.parked.filter((id,i)=>(mask&(1<<i))!==0);for(const id of s.parked)assert.deepEqual(E.blockers(l,s,id).sort((a,b)=>a-b),gridBlockers(l,s,id));}
});
test('Malformed or overlapping levels fail validation',()=>{const l=E.copy(levels[0]);l.cars[1].x=l.cars[0].x;l.cars[1].y=l.cars[0].y;assert.ok(E.validate(l).includes('overlap'));l.queue.pop();assert.ok(E.validate(l).includes('passenger balance'));});
for(const l of levels)test('Level '+l.id+': valid solution, real failure path, conserved passengers in every reachable state',()=>{
 assert.deepEqual(E.validate(l),[]);const solved=E.solve(l);assert.ok(solved.path);let s=E.initial(l);for(const id of solved.path){const previous=JSON.stringify(s),r=E.step(l,s,id);assert.equal(JSON.stringify(s),previous);assert.equal(r.ok,true);s=r.state;invariant(l,s);}assert.equal(E.won(l,s),true);
 const a=E.analyze(l);assert.ok(a.randomWin<.56);assert.ok(a.trap);s=E.initial(l);for(const id of a.trap)s=E.step(l,s,id).state;assert.equal(E.deadlocked(l,s),true);assert.equal(E.solve(l,s).path,null);
 const queue=[E.initial(l)],seen=new Set();while(queue.length){const s=queue.pop(),k=E.key(s);if(seen.has(k))continue;seen.add(k);invariant(l,s);for(const id of E.legal(l,s)){const r=E.step(l,s,id);assert.equal(r.state.parked.length,s.parked.length-1);queue.push(r.state);}}
});
