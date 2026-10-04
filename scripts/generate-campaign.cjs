// Offline seeded authoring. Every generated lot has a winning witness, a losing
// witness, and a geometry distinct even under rotation/reflection.
const fs=require('node:fs'),crypto=require('node:crypto'),E=require('../src/engine.js');
const base=[...require('../src/levels.js'),...require('../src/routes.js')],catalog=require('../src/catalog.js'),newCount=500-base.filter(catalog.allowed).length,lastId=24+newCount;
const themes=['mahalle','sahil','pazar','festival','havalimani'];
const labels=['Arka sokaklar','Kıyı turu','Pazar yolları','Festival rotası','Terminal bağlantıları'];
const styles=[['akış','Yolun ritmi'],['koridor','Dar koridor'],['kapasite','Koltuk hesabı'],['dört-yön','Dört çıkış'],['mola','Sakin bir tur'],['koridor','Birbirine bağlı'],['kapasite','Minibüs sırası'],['akış','Peronda bir yer'],['dört-yön','Yollar kesişiyor'],['düğüm','Son düğüm']];
function canonical(l){let cars=l.cars.map(c=>({...c})),w=l.width,h=l.height,variants=[];for(let n=0;n<4;n++){for(const flip of [false,true])variants.push(cars.map(c=>[flip?w-c.x-c.w:c.x,c.y,c.w,c.h,flip?({E:'W',W:'E',N:'N',S:'S'}[c.dir]):c.dir,c.capacity].join(',')).sort().join(';')+'|'+w+','+h);cars=cars.map(c=>({...c,x:h-c.y-c.h,y:c.x,w:c.h,h:c.w,dir:{N:'E',E:'S',S:'W',W:'N'}[c.dir]}));[w,h]=[h,w];}return variants.sort()[0];}
let seed;const random=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const geometries=new Set(base.map(canonical)),campaign=[],report=[];
for(let id=25;id<=lastId;id++){
 seed=(20261004+id*104729)>>>0;const pos=id-25,tier=Math.min(5,Math.floor(pos/80)),[kind,label]=styles[pos%styles.length],relaxed=kind==='mola',hard=kind==='düğüm';
 const count=Math.max(12,Math.min(28,14+tier*2+(hard?2:relaxed?-2:0)+(Math.floor(pos/10)%2)*2));const width=8+Math.floor(tier/2),height=8+Math.floor(tier/2)+(count>26?1:0),colorCount=tier<2?3:4;
 let accepted;
 for(let attempt=0;attempt<8000&&!accepted;attempt++){
  const cars=[],cells=new Set();for(let tries=0;tries<700&&cars.length<count;tries++){
   let dir=['N','S','E','W'][Math.floor(random()*4)];if(kind==='koridor'&&random()<.65)dir=random()<.5?'N':'S';
   const capacity=pos>=56&&cars.filter(c=>c.capacity===6).length<Math.min(6,Math.ceil(count/5))&&random()<(kind==='kapasite'?.3:tier>=2?.18:.1)?6:4,w='EW'.includes(dir)?capacity===6?3:2:1,h='NS'.includes(dir)?capacity===6?3:2:1,x=Math.floor(random()*(width-w+1)),y=Math.floor(random()*(height-h+1));
   let overlaps=false;for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++)if(cells.has(a+','+b))overlaps=true;if(overlaps)continue;
   const c={id:cars.length,x,y,w,h,dir,color:cars.length%colorCount,capacity};cars.push(c);for(let a=x;a<x+w;a++)for(let b=y;b<y+h;b++)cells.add(a+','+b);
  }if(cars.length!==count||cars.reduce((n,c)=>n+c.capacity,0)>120)continue;
  const l={id,title:label+' '+(Math.floor(pos/10)+1),tip:relaxed?'Renk gruplarını izleyerek sakin bir tur at.':kind==='kapasite'?'Dört ve altı koltuğu, sıranın devamıyla birlikte düşün.':kind==='koridor'?'Öndeki aracı çıkararak arkadaki koridoru aç.':'Açık her aracı gönderme. Sıradaki yolcu için peronda yer bırak.',district:themes[Math.floor(pos/20)%5],chapter:Math.floor(pos/20)+1,kind,difficulty:relaxed?'Mola':hard?'Zorlu':'Planlı',width,height,cars,queue:[],solution:[]};
  let state=E.initial(l);const blocked=cars.filter(c=>E.blockers(l,state,c.id).length).length;if(blocked/count<(relaxed?.3:.45))continue;
  const depth=new Map();while(state.parked.length){const ids=E.legal(l,state);if(!ids.length)break;const n=ids[Math.floor(random()*ids.length)];depth.set(n,1+Math.max(0,...E.blockers(l,E.initial(l),n).map(j=>depth.get(j)||0)));l.solution.push(n);state.parked=state.parked.filter(i=>i!==n);}
  if(l.solution.length!==count||(Math.max(...depth.values())<(relaxed?2:3)||Math.max(...depth.values())>5))continue;
  const geometry=canonical(l);if(geometries.has(geometry))continue;
  // Two-vehicle groups leave a third bay free along the winning witness.
  for(let p=0;p<l.solution.length;){const size=2,group=l.solution.slice(p,p+size);p+=size;const people=group.slice().reverse().flatMap(i=>Array(cars[i].capacity).fill(cars[i].color));l.queue.push(...(relaxed?people:shuffle(people)));}
  if(E.validate(l).length)continue;state=E.initial(l);let valid=true;for(const n of l.solution){const r=E.step(l,state,n);if(!r.ok){valid=false;break;}state=r.state;}if(!valid||!E.won(l,state))continue;
  let trap=null,wins=0;for(let run=0;run<40;run++){state=E.initial(l);const moves=[];while(!E.won(l,state)){const ids=E.legal(l,state);if(!ids.length)break;const n=ids[Math.floor(random()*ids.length)];moves.push(n);state=E.step(l,state,n).state;}if(E.won(l,state))wins++;else if(!trap)trap=moves;}
  if(!trap||wins>(relaxed?32:24))continue;l.trap=trap;l.sampleWins=wins;l.sampleRuns=40;l.authoring={seed:20261004+id*104729,version:1,blocked,chainDepth:Math.max(...depth.values()),geometrySha256:crypto.createHash('sha256').update(geometry).digest('hex')};
  geometries.add(geometry);accepted=l;
 }
 if(!accepted)throw Error('Could not author level '+id);campaign.push(accepted);report.push({id,kind,tier,cars:count,passengers:accepted.queue.length,depth:accepted.authoring.chainDepth});if(id%50===0)console.log('Verified through level',id);
}
fs.writeFileSync('src/campaign.js',"(function(root){const campaign="+JSON.stringify(campaign)+";if(typeof module!=='undefined'&&module.exports)module.exports=campaign;else root.PARKING_LEVELS.push(...campaign);})(typeof window!=='undefined'?window:globalThis);\n");
fs.writeFileSync('qa/campaign-summary.json',JSON.stringify({totalLevels:500,newLevels:newCount,authoringVersion:1,uniqueGeneratedGeometries:newCount,rotationReflectionDeduplicated:true,relaxationLevels:report.filter(l=>l.kind==='mola').length,challengeLevels:report.filter(l=>l.kind==='düğüm').length,range:{cars:[Math.min(...report.map(l=>l.cars)),Math.max(...report.map(l=>l.cars))],passengers:[Math.min(...report.map(l=>l.passengers)),Math.max(...report.map(l=>l.passengers))]},levels:report},null,2)+'\n');
console.log('Wrote',campaign.length,'new solved lots with distinct geometry.');
