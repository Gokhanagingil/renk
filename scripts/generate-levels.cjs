// Deterministic offline authoring: larger lots, guaranteed winning witnesses,
// tested failure paths. Nothing is shuffled while playing.
const fs=require('node:fs'),E=require('../src/engine.js');let seed=20261005;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const C=(id,x,y,dir,color,capacity=4)=>({id,x,y,w:'EW'.includes(dir)?(capacity===6?3:2):1,h:'NS'.includes(dir)?(capacity===6?3:2):1,dir,color,capacity});
const titles=['Sabah buluşması','İlk yoğunluk','Sahil otoparkı','Pazar kalabalığı','Bir yer ayır','Minibüs geliyor','İki sıra sonrası','Çıkışa doğru','Morun sırası','Akşamüstü','Uzun kuyruk','Yol arkadaşları','Dolu otopark','Biraz sabır','Düğüm çözülüyor','Şehir hareketli','Son birkaç hamle','Büyük buluşma'];
const tips=['İlk yolcu kırmızı. Önce kırmızının önündeki mavi aracı çıkar.','Üç durak yeri var. Sıradaki yolcu için bir yer ayır.','Parkın tamamı ekranda. Daha büyük görmek için Yakınlaştır’a dokun.','Araç dolmadan ayrılmaz. Sıranın devamına da bak.','Her açık yolu hemen kullanmak zorunda değilsin.','Uzun araçlarda altı koltuk var. Boş koltuklara dikkat.'];
const levels=[];
for(let index=0;index<18;index++){
 const count=12+2*Math.floor(index/2),width=8+Math.floor(index/12),height=8+Math.floor(index/6),colorCount=index>=8?4:3;
 let result;
 for(let attempt=0;attempt<6000&&!result;attempt++){
  const cars=index===0?[C(0,0,0,'N',1),C(1,0,2,'N',0),C(2,2,0,'N',2),C(3,4,0,'N',2)]:[],occupied=new Set();
  const mark=c=>{for(let x=c.x;x<c.x+c.w;x++)for(let y=c.y;y<c.y+c.h;y++)occupied.add(x+','+y);};cars.forEach(mark);
  for(let tries=0;tries<800&&cars.length<count;tries++){
   const dir=['N','S','E','W'][Math.floor(random()*4)],cap=index>=5&&random()<.25&&cars.filter(c=>c.capacity===6).length<Math.floor((120-count*4)/2)?6:4;
   const c=C(cars.length,0,0,dir,cars.length%colorCount,cap);c.x=Math.floor(random()*(width-c.w+1));const floor=index===0?4:0;c.y=floor+Math.floor(random()*(height-c.h-floor+1));
   let overlap=false;for(let x=c.x;x<c.x+c.w;x++)for(let y=c.y;y<c.y+c.h;y++)if(occupied.has(x+','+y))overlap=true;
   if(overlap)continue;cars.push(c);mark(c);
  }
  if(cars.length!==count)continue;
  const l={id:index+1,title:titles[index],tip:tips[index%tips.length],width,height,cars,queue:[],solution:[]};
  let s=E.initial(l),order=[];
  if(cars.filter(c=>E.blockers(l,s,c.id).length).length<count*.42)continue;
  if(index===0){order=[0,1,2,3];s.parked=s.parked.filter(id=>id>3);}
  while(s.parked.length){const ids=E.legal(l,s);if(!ids.length)break;const id=ids[Math.floor(random()*ids.length)];order.push(id);s.parked=s.parked.filter(n=>n!==id);}
  if(order.length!==count)continue;
  let offset=0;if(index===0){l.queue=[...Array(4).fill(0),...Array(4).fill(1),...Array(8).fill(2)];offset=4;}
  for(let p=offset;p<order.length;p+=2){const people=order.slice(p,p+2).flatMap(id=>Array(cars[id].capacity).fill(cars[id].color));l.queue.push(...shuffle(people));}
  l.solution=order;s=E.initial(l);for(const id of order){const r=E.step(l,s,id);if(!r.ok)break;s=r.state;}
  if(!E.won(l,s)||E.validate(l).length)continue;
  let trap=null,wins=0;
  for(let run=0;run<160;run++){s=E.initial(l);const moves=[];while(!E.won(l,s)){const ids=E.legal(l,s);if(!ids.length)break;const id=ids[Math.floor(random()*ids.length)];moves.push(id);s=E.step(l,s,id).state;}if(E.won(l,s))wins++;else if(!trap)trap=moves;}
  if(!trap||wins>100)continue;l.trap=index===0?[0,2,3]:trap;l.sampleWins=wins;l.sampleRuns=160;result=l;
 }
 if(!result)throw Error('Authoring failed '+index);levels.push(result);
}
fs.writeFileSync('src/levels.js',"(function(root){const levels="+JSON.stringify(levels,null,2)+";if(typeof module!=='undefined'&&module.exports)module.exports=levels;else root.PARKING_LEVELS=levels;})(typeof window!=='undefined'?window:globalThis);\n");
console.log(levels.map(l=>({level:l.id,cars:l.cars.length,people:l.queue.length,rows:l.height,sampleWins:l.sampleWins})));
