// Six deliberately structured lots. Queue chunks fit at most two occupied bays;
// every lot also has a checked wrong choice that fills all three bays.
const fs=require('node:fs'),E=require('../src/engine.js');
const C=(id,x,y,dir,color,capacity=4)=>({id,x,y,w:'EW'.includes(dir)?(capacity===6?3:2):1,h:'NS'.includes(dir)?(capacity===6?3:2):1,dir,color,capacity});
const palette=[1,0,2,2,1,0,1,2,0,2,0,1];
function columns(mixed=false){const cars=[];for(let col=0;col<3;col++)for(let row=0;row<3;row++){const id=col*3+row;cars.push(C(id,col*3,[0,2,mixed?5:4][row],'N',palette[id],mixed&&row===1?6:4));}for(let i=0;i<3;i++)cars.push(C(9+i,1,[0,3,6][i],'E',palette[9+i]));return cars;}
function compass(){const cars=[];for(let j=0;j<3;j++){cars.push(C(j,1,2*j,'N',palette[j]));cars.push(C(3+j,6-2*j,1,'E',palette[3+j]));cars.push(C(6+j,6,6-2*j,'S',palette[6+j]));cars.push(C(9+j,2*j,6,'W',palette[9+j]));}return cars.sort((a,b)=>a.id-b.id);}
function rotate(cars){return cars.map(c=>({...c,x:8-c.y-c.h,y:c.x,w:c.h,h:c.w,dir:{N:'E',E:'S',S:'W',W:'N'}[c.dir]}));}
const specs=[
 ['Tek koridor','mahalle','Öndeki aracı çıkar, arkasındaki zinciri aç.',columns(),[0,1,3,4,6,7,9,2,5,8,10,11],'blocks'],
 ['Dört çıkış','sahil','Dört yöne bak; doğru zincirden başla.',compass(),[0,1,3,4,6,7,9,10,2,5,8,11],'pairs'],
 ['Koltuk hesabı','pazar','Dört ve altı koltuğu, sıranın devamıyla birlikte düşün.',columns(true),[0,1,3,4,6,7,9,2,5,8,10,11],'pairs'],
 ['Sahil molası','sahil','Renk gruplarını takip et; rahat bir tur at.',rotate(compass()),[0,1,3,4,6,7,9,10,2,5,8,11],'blocks'],
 ['Bir yer ayır','festival','Açık her aracı gönderme; sıradakine peron bırak.',rotate(columns()),[0,1,3,4,6,7,9,2,5,8,10,11],'weave'],
 ['Son bağlantı','havalimani','Uzun araçlar ve kesişen çıkışları birlikte planla.',rotate(columns(true)),[0,1,3,4,6,7,9,2,5,8,10,11],'weave']
];
let seed=61006;const rnd=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
const routes=specs.map(([title,district,focus,cars,solution,pattern],i)=>{
 const queue=[];for(let n=0;n<solution.length;n+=2){const a=cars.find(c=>c.id===solution[n]),b=cars.find(c=>c.id===solution[n+1]),aa=Array(a.capacity).fill(a.color),bb=Array(b.capacity).fill(b.color);if(n===0||pattern==='blocks')queue.push(...bb,...aa);else if(pattern==='pairs'){while(aa.length||bb.length){if(bb.length)queue.push(...bb.splice(0,2));if(aa.length)queue.push(...aa.splice(0,2));}}else while(aa.length||bb.length){if(bb.length)queue.push(bb.pop());if(aa.length)queue.push(aa.pop());}}
 const l={id:19+i,title,district,focus,tip:focus,width:8,height:8,cars,queue,solution,trap:[0,3,6],sampleWins:0,sampleRuns:160};
 if(E.validate(l).length)throw Error(title+': '+E.validate(l));let s=E.initial(l);for(const id of solution){const r=E.step(l,s,id);if(!r.ok)throw Error(title+': bad move '+id+' '+r.reason);s=r.state;}if(!E.won(l,s))throw Error(title+': not won');s=E.initial(l);for(const id of l.trap)s=E.step(l,s,id).state;if(!E.deadlocked(l,s))throw Error(title+': no trap');
 for(let run=0;run<l.sampleRuns;run++){s=E.initial(l);for(let turn=0;turn<cars.length;turn++){const ids=E.legal(l,s);if(!ids.length)break;s=E.step(l,s,ids[Math.floor(rnd()*ids.length)]).state;}if(E.won(l,s))l.sampleWins++;}
 return l;
});
fs.writeFileSync('src/routes.js',"(function(root){const routes="+JSON.stringify(routes,null,2)+";if(typeof module!=='undefined'&&module.exports)module.exports=routes;else root.PARKING_LEVELS.push(...routes);})(typeof window!=='undefined'?window:globalThis);\n");console.log(routes.map(l=>({id:l.id,title:l.title,passengers:l.queue.length,sampleWins:l.sampleWins})));
