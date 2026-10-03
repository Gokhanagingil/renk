// Offline, seeded authoring aid. Checked-in levels never shuffle in play.
const fs=require('node:fs'),E=require('../src/engine.js');let seed=20261004;
function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
function shuffle(a){a=[...a];for(let i=a.length-1;i>0;i--){let j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
const C=(id,x,y,dir,color,capacity=2,length=2)=>({id,x,y,w:dir==='E'||dir==='W'?length:1,h:dir==='N'||dir==='S'?length:1,dir,color,capacity});
const levels=[
 {id:1,title:'Önce yolu aç',tip:'İlk yolcu kırmızı. Kırmızı aracın önündeki maviyi çıkar.',size:6,cars:[C(0,1,0,'N',1),C(1,1,3,'N',0),C(2,3,0,'N',2),C(3,5,3,'N',2)],queue:[0,0,1,1,2,2,2,2]},
 {id:2,title:'Üç yer, tek plan',tip:'Çıkabilen her aracı göndermek iyi fikir olmayabilir.',size:6,cars:[C(0,0,0,'N',1),C(1,0,3,'N',0),C(2,2,1,'E',2),C(3,4,0,'N',1),C(4,3,4,'W',0),C(5,2,2,'S',2)],queue:[0,0,2,2,1,1,0,0,2,2,1,1]}
];
const titles=['Yarım dolu','Dar sokak','İki hamle sonrası','Sabırlı kırmızı','Minibüs saati','Bir yer kalsın','Dördüncü renk','Düğümü çöz','Son çıkış','Park ustası'];
const tips=['Araç dolmadan ayrılmaz. Yolcu sırası önemli.','Yön oklarını izle; hangi araç hangisini engelliyor?','İhtiyacın olan aracın önünü, durakta yer bırakarak aç.','Sıranın tamamını göz düğmesinden görebilirsin.','Uzun aracın dört koltuğu var. Dolmasını planla.','Üç yeri birden yanlış renklerle doldurma.','Yeni renk: mor. Şekiller renkleri ayırt etmene yardım eder.','Öndeki aracı çıkarmak bazen iki yol birden açar.','Takılırsan geri al. Aynı düzen üzerinde yeni plan kur.','Süre sınırı yok. Parkın tamamını çöz.'];
for(let i=0;i<10;i++){
 const target=6+Math.floor(i/2),colorCount=i>=6?4:3;let selected=null;
 for(let attempt=0;attempt<8000&&!selected;attempt++){
  const cars=[],occupied=new Set();
  for(let t=0;t<300&&cars.length<target;t++){
   const dir=['N','E','S','W'][Math.floor(random()*4)],length=i>=4&&random()<.18?3:2;
   const w='EW'.includes(dir)?length:1,h='NS'.includes(dir)?length:1;
   const x=Math.floor(random()*(7-w)),y=Math.floor(random()*(7-h));let collision=false;
   for(let xx=x;xx<x+w;xx++)for(let yy=y;yy<y+h;yy++)if(occupied.has(xx+','+yy))collision=true;
   if(collision)continue;
   for(let xx=x;xx<x+w;xx++)for(let yy=y;yy<y+h;yy++)occupied.add(xx+','+yy);
   cars.push(C(cars.length,x,y,dir,cars.length%colorCount,length===3?4:(i>=2&&random()<.18?3:2),length));
  }
  if(cars.length!==target)continue;
  const level={id:i+3,title:titles[i],tip:tips[i],size:6,cars,queue:[]};let s=E.initial(level),order=[];
  if(cars.filter(c=>E.blockers(level,s,c.id).length).length<Math.ceil(target*.4))continue;
  while(s.parked.length){const free=E.legal(level,s);if(!free.length)break;const id=free[Math.floor(random()*free.length)];order.push(id);s.parked=s.parked.filter(n=>n!==id);}
  if(order.length!==target)continue;
  for(let p=0;p<order.length;p+=2){const group=order.slice(p,p+2).flatMap(id=>Array(cars[id].capacity).fill(cars[id].color));level.queue.push(...(random()<.72?shuffle(group):group));}
  if(E.validate(level).length||!E.solve(level).path)continue;
  if(i<5&&cars.filter(c=>c.color===level.queue[0]).some(c=>!E.blockers(level,E.initial(level),c.id).length))continue;
  let a;try{a=E.analyze(level,35000);}catch(_){continue;}
  if(!a.trap||a.randomWin>(i<2?.55:i<6?.35:.22)||a.randomWin<.008)continue;
  if(i===4&&!cars.some(c=>c.capacity===4))continue;selected=level;
 }
 if(!selected)throw Error('Could not author level '+(i+3));levels.push(selected);
}
fs.writeFileSync('src/levels.js',"(function(root){const levels="+JSON.stringify(levels,null,2)+";if(typeof module!=='undefined'&&module.exports)module.exports=levels;else root.PARKING_LEVELS=levels;})(typeof window!=='undefined'?window:globalThis);\n");
console.log(levels.map(l=>{const a=E.analyze(l);return{id:l.id,cars:l.cars.length,blocked:l.cars.filter(c=>E.blockers(l,E.initial(l),c.id).length).length,randomWin:Number(a.randomWin.toFixed(3)),trap:a.trap};}));
