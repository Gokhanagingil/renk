/* Renk Durağı v0.2 — two stops, one fleet, four visible seats. */
(function(root) {
  'use strict';
  const CAPACITY=4;
  const copy=v=>JSON.parse(JSON.stringify(v));
  const cargo=c=>c[0]+c[1];
  function possible(s,i) {return s.cars[i][s.stop]>0 || (s.waiting[s.stop]>0 && cargo(s.cars[i])<CAPACITY);}
  function won(s) {return s.waiting.every(n=>n===0) && s.cars.every(c=>cargo(c)===0);}
  function normalize(s) {
    // An empty stop never costs a move. There is always progress elsewhere.
    if(!won(s) && !s.cars.some((c,i)=>possible(s,i)))s.stop=1-s.stop;
    return s;
  }
  function initial(l) {return normalize({cars:copy(l.cars),waiting:[...l.waiting],stop:l.stop||0,delivered:0,trips:0});}
  function step(previous,id) {
    if(!Number.isInteger(id)||id<0||id>=previous.cars.length)return {ok:false,reason:'missing'};
    if(won(previous))return {ok:false,reason:'won'};
    if(!possible(previous,id))return {ok:false,reason:'no-progress'};
    const s=copy(previous),stop=s.stop,c=s.cars[id];
    const out=c[stop];c[stop]=0;s.delivered+=out;
    const on=Math.min(CAPACITY-cargo(c),s.waiting[stop]);
    c[1-stop]+=on;s.waiting[stop]-=on;s.trips++;
    s.stop=1-stop;normalize(s);
    return {ok:true,state:s,event:{id,stop,out,on,next:s.stop,capacity:CAPACITY,after:[...c]}};
  }
  function key(s) {return s.stop+'|'+s.waiting.join(',')+'|'+s.cars.map(c=>c.join(',')).sort().join(';');}
  function solve(start,budget=150000) {
    // Breadth-first search yields a minimum-trip plan. Symmetric vehicles
    // share a key; each retained plan still uses concrete vehicle indices.
    const states=[{s:copy(start),parent:-1,id:-1}],seen=new Set([key(start)]);
    let head=0;
    while(head<states.length && head<budget) {
      const current=head++,entry=states[current];
      if(won(entry.s)) {
        const path=[];let e=entry;
        while(e.parent>=0){path.push(e.id);e=states[e.parent];}
        return {path:path.reverse(),visited:head,exhausted:false};
      }
      for(let id=0;id<entry.s.cars.length;id++) {
        const r=step(entry.s,id);if(!r.ok)continue;
        const k=key(r.state);if(seen.has(k))continue;
        seen.add(k);states.push({s:r.state,parent:current,id});
      }
    }
    return {path:null,visited:head,exhausted:head>=budget};
  }
  function validate(l) {
    const errors=[];
    if(!Array.isArray(l.cars)||l.cars.length<1||l.cars.length>4)errors.push('fleet');
    for(const c of l.cars||[])if(!Array.isArray(c)||c.length!==2||c.some(n=>!Number.isInteger(n)||n<0)||cargo(c)>CAPACITY)errors.push('cargo');
    if(!Array.isArray(l.waiting)||l.waiting.length!==2||l.waiting.some(n=>!Number.isInteger(n)||n<0))errors.push('waiting');
    if(l.stop!==undefined && ![0,1].includes(l.stop))errors.push('stop');
    return errors;
  }
  function total(l){return l.waiting[0]+l.waiting[1]+l.cars.reduce((n,c)=>n+cargo(c),0);}
  function rating(l,s){return s.trips<=l.par?3:s.trips<=l.par+2?2:1;}
  const API={CAPACITY,copy,cargo,possible,won,normalize,initial,step,solve,validate,total,rating};
  if(typeof module!=='undefined'&&module.exports)module.exports=API;else root.RenkEngine=API;
})(typeof window!=='undefined'?window:globalThis);
