(function(){
'use strict';
const E=window.ParkingEngine,levels=window.PARKING_LEVELS,$=id=>document.getElementById(id);
const KEY='renk-parking-v03',names=['Kırmızı','Mavi','Sarı','Mor'],colors=['#df695b','#509db4','#e6b34e','#9474b3'];
const directions={N:'yukarı',E:'sağa',S:'aşağı',W:'sola'},angles={N:0,E:90,S:180,W:270};
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches,testMode=new URLSearchParams(location.search).has('test');
let index=0,state,trace=[],completed=[],seen=false,speed=1,sound=false,busy=false,focused=null,audioContext;
const clone=E.copy,level=()=>levels[index],duration=n=>testMode||reduced?1:n/speed;
function shape(color,fill='#fff6e6'){
 const shapes=[`<circle cx="12" cy="12" r="7" fill="${fill}"/>`,`<path d="m12 3 9 9-9 9-9-9Z" fill="${fill}"/>`,`<path d="m12 3 10 18H2Z" fill="${fill}"/>`,`<path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7Z" fill="${fill}"/>`];
 return `<svg viewBox="0 0 24 24" aria-hidden="true">${shapes[color]}</svg>`;
}
function person(color){return `<span class="person" aria-label="${names[color]} yolcu"><svg viewBox="0 0 28 40" aria-hidden="true"><ellipse cx="14" cy="37" rx="9" ry="2" fill="#45593b1c"/><path d="M10 28v8m8-8v8" stroke="#3e5549" stroke-width="4" stroke-linecap="round"/><path d="M7 18v10h14V18q0-4-7-4t-7 4" fill="${colors[color]}"/><path d="M7 18 4 27m17-9 3 9" stroke="${colors[color]}" stroke-width="4" stroke-linecap="round"/><circle cx="14" cy="9" r="6" fill="#e8bd95"/><path d="M8 8q0-7 6-7 6 0 6 7" fill="#465746"/><circle cx="12" cy="9" r=".7" fill="#365143"/><circle cx="16" cy="9" r=".7" fill="#365143"/><svg x="9" y="18" width="10" height="10" viewBox="0 0 24 24">${shape(color).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg></svg></span>`;}
function carSvg(c,dir=c.dir){
 const length=Math.max(c.w,c.h)===3?138:94,w=48,h=length,angle=angles[dir],horizontal=dir==='E'||dir==='W',vw=horizontal?h:w,vh=horizontal?w:h;
 return `<svg viewBox="0 0 ${vw} ${vh}" aria-hidden="true"><g transform="translate(${vw/2} ${vh/2}) rotate(${angle}) translate(-24 ${-h/2})"><rect x="0" y="21" width="8" height="18" rx="3" fill="#2d4842"/><rect x="40" y="21" width="8" height="18" rx="3" fill="#2d4842"/><rect x="0" y="${h-39}" width="8" height="18" rx="3" fill="#2d4842"/><rect x="40" y="${h-39}" width="8" height="18" rx="3" fill="#2d4842"/><rect x="4" y="3" width="40" height="${h-6}" rx="12" fill="${colors[c.color]}"/><path d="M10 17v${h-31}" stroke="#ffffff30" stroke-width="3" stroke-linecap="round"/><rect x="10" y="5" width="7" height="4" rx="2" fill="#fff3c9"/><rect x="31" y="5" width="7" height="4" rx="2" fill="#fff3c9"/><path d="M17 20 24 13l7 7m-7-7v14" fill="none" stroke="#fffbed" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 30h26l-2 10H13Z" fill="#326060"/><path d="M14 32h18" stroke="#9abdc3" stroke-width="2"/><rect x="11" y="${h-24}" width="26" height="10" rx="3" fill="#386365"/><path d="M12 ${h-8}h6m12 0h6" stroke="#ab6354" stroke-width="3" stroke-linecap="round"/><g transform="rotate(${-angle} 24 ${h/2+3})"><rect x="15" y="${h/2-6}" width="18" height="18" rx="7" fill="#284947" stroke="#fff9e799" stroke-width="1"/><text x="24" y="${h/2+7}" font-family="sans-serif" font-weight="800" font-size="12" text-anchor="middle" fill="#fff7df">${c.capacity}</text></g><svg x="18" y="${h/2+15}" width="12" height="12" viewBox="0 0 24 24">${shape(c.color).replace(/^<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg></g></svg>`;
}
function message(text,notice=false){$('message').textContent=text;$('message').classList.toggle('notice',notice);}
function replay(ids){let s=E.initial(level());for(const id of ids){const r=E.step(level(),s,id);if(!r.ok)throw Error('Invalid saved move');s=r.state;}return s;}
function save(){try{localStorage.setItem(KEY,JSON.stringify({version:3,index,trace,completed,seen,speed,sound}));}catch(_){}}
function load(){
 try{const d=JSON.parse(localStorage.getItem(KEY)||'null');if(!d||d.version!==3)return;
  if(Number.isInteger(d.index)&&d.index>=0&&d.index<levels.length)index=d.index;
  if(Array.isArray(d.trace)&&d.trace.length<=level().cars.length&&d.trace.every(Number.isInteger)){try{state=replay(d.trace);trace=[...d.trace];}catch(_){trace=[];state=E.initial(level());}}
  completed=Array.from({length:levels.length},(_,i)=>Array.isArray(d.completed)&&d.completed[i]===true);seen=d.seen===true;speed=d.speed===2?2:1;sound=d.sound===true;
 }catch(_){}
}
function render(view=state){
 const l=level(),remaining=l.queue.slice(view.head),free=view.bays.filter(b=>!b).length,jam=!busy&&E.deadlocked(l,view);
 $('level-number').textContent=String(l.id).padStart(2,'0');$('level-title').textContent=l.title;$('departed').textContent=view.departed.length+' / '+l.cars.length;
 $('queue').innerHTML=remaining.length?remaining.slice(0,8).map(person).join(''):'<span class="empty-queue">Herkes bindi ✓</span>';
 $('queue-count').textContent=remaining.length>8?'+'+(remaining.length-8):remaining.length?remaining.length+' kişi':'';
 $('queue-progress').style.width=(100*view.head/l.queue.length)+'%';$('free-slots').textContent=free?free+' yer boş':'Durak dolu';
 $('bays').innerHTML=view.bays.map((b,i)=>`<div class="bay" data-slot="${i}" ${b?`role="img" aria-label="${names[E.car(l,b.id).color]} araç, ${b.filled}/${E.car(l,b.id).capacity} dolu"`:`aria-label="Boş durak yeri ${i+1}"`}>${b?`<div class="bay-car" data-bay-car="${b.id}">${carSvg(E.car(l,b.id),'N')}</div><span class="fill-label">${b.filled} / ${E.car(l,b.id).capacity}</span>`:`<span class="slot-number">${i+1}</span>`}</div>`).join('');
 $('parking').innerHTML=view.parked.map(id=>{const c=E.car(l,id),blocked=E.blockers(l,view,id).length;return `<button class="car" data-car="${id}" style="left:${c.x/6*100}%;top:${c.y/6*100}%;width:${c.w/6*100}%;height:${c.h/6*100}%" aria-label="${names[c.color]} araç ${id+1}, ${c.capacity} koltuk, ${directions[c.dir]}, önü ${blocked?'kapalı':'açık'}" ${busy?'disabled':''}>${carSvg(c)}</button>`;}).join('');
 $('app').classList.toggle('jammed',jam);document.body.classList.toggle('busy',busy);
 $('undo').disabled=busy||trace.length===0;$('hint').disabled=busy||E.won(l,view);$('restart').disabled=busy;$('help').disabled=busy;$('level-menu').disabled=busy;$('queue-info').disabled=busy;
 $('speed').querySelector('span').textContent=speed+'×';$('sound').querySelector('i').hidden=sound;$('sound').setAttribute('aria-label',sound?'Ses kapat':'Ses aç');
}
function showStatus(){if(E.deadlocked(level(),state))message('Durak kilitlendi. Sıradaki '+names[level().queue[state.head]].toLocaleLowerCase('tr')+' yolcuya yer yok. Geri al.',true);else message(level().tip);}
const pause=n=>new Promise(resolve=>setTimeout(resolve,duration(n)));
async function animate(el,frames,n){if(!el.animate)return pause(n);try{await el.animate(frames,{duration:duration(n),easing:'cubic-bezier(.25,.7,.25,1)',fill:'forwards'}).finished;}catch(_){}}
function center(el){const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2};}
function tone(frequency=520,length=.08){if(!sound)return;try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;audioContext=audioContext||new A();if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});const o=audioContext.createOscillator(),g=audioContext.createGain();o.type='sine';o.frequency.value=frequency;g.gain.setValueAtTime(.045,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+length);o.connect(g);g.connect(audioContext.destination);o.start();o.stop(audioContext.currentTime+length);}catch(_){}}
function ghost(c,start,width,height){const el=document.createElement('div');el.className='ghost-car';el.style.left=(start.x-width/2)+'px';el.style.top=(start.y-height/2)+'px';el.style.width=width+'px';el.style.height=height+'px';el.innerHTML=carSvg(c,'N');document.body.append(el);return el;}
async function driveToBay(c,from,slot,view){
 const board=$('parking').getBoundingClientRect(),cell=$('parking').clientWidth/6,w=cell*.78,h=cell*Math.max(c.w,c.h)*.87;
 const target=center(document.querySelector(`[data-slot="${slot}"]`)),roadY=center(document.querySelector('.road')).y;
 const g=ghost(c,from,w,h);let points;
 if(c.dir==='N')points=[from,{x:from.x,y:board.top-h/2-8},{x:target.x,y:roadY},target];
 else if(c.dir==='E')points=[from,{x:board.right+h/2+8,y:from.y},{x:board.right+h/2+8,y:roadY},{x:target.x,y:roadY},target];
 else if(c.dir==='W')points=[from,{x:board.left-h/2-8,y:from.y},{x:board.left-h/2-8,y:roadY},{x:target.x,y:roadY},target];
 else points=[from,{x:from.x,y:board.bottom+h/2+8},{x:board.right+h/2+8,y:board.bottom+h/2+8},{x:board.right+h/2+8,y:roadY},{x:target.x,y:roadY},target];
 view.parked=view.parked.filter(id=>id!==c.id);render(view);
 await animate(g,points.map((p,i)=>({transform:`translate(${p.x-from.x}px,${p.y-from.y}px) rotate(${i<2?angles[c.dir]:0}deg) scale(${i===points.length-1?Math.min(32/w,66/h):1})`})),630);
 g.remove();view.bays[slot]={id:c.id,filled:0};view.moves++;render(view);tone(410);
}
async function boardPerson(event,view){
 const from=center($('queue').querySelector('.person')||$('queue')),to=center(document.querySelector(`[data-slot="${event.slot}"]`));
 if(!reduced&&!testMode){const el=document.createElement('div');el.className='fly-person';el.style.left=(from.x-12)+'px';el.style.top=(from.y-18)+'px';el.innerHTML=person(event.color);document.body.append(el);await animate(el,[{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${to.x-from.x}px,${to.y-from.y}px) scale(.5)`,opacity:.25}],210);el.remove();}
 view.head=event.index+1;view.bays[event.slot].filled=event.filled;render(view);tone(600+event.filled*75);await pause(90);
}
async function depart(event,view){
 const c=E.car(level(),event.id),from=center(document.querySelector(`[data-slot="${event.slot}"]`));
 const g=ghost(c,from,32,66),roadY=center(document.querySelector('.road')).y;
 const el=document.querySelector(`[data-bay-car="${event.id}"]`);if(el)el.style.opacity='0';
 await animate(g,[{transform:'translate(0,0) rotate(0)'},{transform:`translate(0,${roadY-from.y}px) rotate(90deg)`},{transform:`translate(${innerWidth-from.x+65}px,${roadY-from.y}px) rotate(90deg)`}],400);
 g.remove();view.bays[event.slot]=null;view.departed.push(event.id);render(view);tone(840,.1);
}
function indicateBlock(id,blocked){
 const selected=document.querySelector(`[data-car="${id}"]`),target=document.querySelector(`[data-car="${blocked[0]}"]`);if(selected)selected.classList.add('bump');if(target)target.classList.add('obstacle');
 const a=E.car(level(),id),b=E.car(level(),blocked[0]);
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 600 600');svg.style.cssText='position:absolute;inset:0;width:100%;height:100%;z-index:1;pointer-events:none';
 svg.innerHTML=`<line x1="${(a.x+a.w/2)*100}" y1="${(a.y+a.h/2)*100}" x2="${(b.x+b.w/2)*100}" y2="${(b.y+b.h/2)*100}" stroke="#c57750" stroke-width="7" stroke-dasharray="10 8"/>`;$('parking').append(svg);
 setTimeout(()=>{selected?.classList.remove('bump');target?.classList.remove('obstacle');svg.remove();},1350);
 message('Yolu kapalı. Önündeki '+names[b.color].toLocaleLowerCase('tr')+' aracı önce çıkarmalısın.',true);tone(180);
}
async function dispatch(id){
 if(busy||!$('overlay').hidden)return;
 const result=E.step(level(),state,id);
 if(!result.ok){if(result.reason==='blocked')indicateBlock(id,result.blockedBy);else if(result.reason==='full')showStatus();return;}
 const from=center(document.querySelector(`[data-car="${id}"]`)),view=clone(state);busy=true;render(view);message(names[E.car(level(),id).color]+' araç durağa geliyor…');
 await driveToBay(E.car(level(),id),from,result.events[0].slot,view);
 for(const event of result.events.slice(1)){if(event.type==='board')await boardPerson(event,view);else if(event.type==='depart')await depart(event,view);}
 state=result.state;trace.push(id);busy=false;save();render();
 if(E.won(level(),state)){complete();return;}
 if(E.deadlocked(level(),state)){showStatus();tone(200,.15);return;}
 const left=state.bays.find(b=>b&&b.id===id);
 if(left)message(names[E.car(level(),id).color]+' araç bekliyor: '+left.filled+'/'+E.car(level(),id).capacity+' dolu. Sırayı ve boş yerleri düşün.');
 else{const count=result.events.filter(e=>e.type==='depart').length;message(count>1?count+' araç peş peşe ayrıldı! Bir sonraki yolu aç.':'Araç doldu ve ayrıldı. Durakta yer açıldı.');}
}
function openModal(html){focused=document.activeElement;$('modal-content').innerHTML=html;$('overlay').hidden=false;$('app').inert=true;($('modal-content').querySelector('button')||$('close-modal')).focus();}
function closeModal(){if($('overlay').hidden)return;$('overlay').hidden=true;$('app').inert=false;(focused&&focused.isConnected?focused:$('level-menu')).focus();}
function help(first=false){
 const red={w:1,h:2,dir:'N',color:0,capacity:2},blue={...red,color:1};
 openModal(`<div class="eyebrow">PARKI ÇÖZ · DOĞRU ARACI GÖNDER</div><h2 id="modal-title">Önce yolu aç.<br>Sonra sırayı düşün.</h2><div class="intro-demo"><div class="demo-car" style="left:20px">${carSvg(blue)}</div><div class="demo-car" style="left:64px">${carSvg(red)}</div><span class="demo-arrow">→</span><span class="demo-person">${person(0)}${person(0)}</span></div><div class="rule"><b>1</b><span>Araca dokun. <strong>Önü açıksa</strong> ok yönünde çıkar.</span></div><div class="rule"><b>2</b><span>Durakta <strong>yalnızca üç yer</strong> var. Her açık aracı hemen gönderme.</span></div><div class="rule"><b>3</b><span>Sıranın başındaki aynı renk yolcular biner. <strong>Dolan araç ayrılır.</strong></span></div><div class="chips"><span class="chip">Yanlış sıra kilitler</span><span class="chip">Geri almak ücretsiz</span><span class="chip">Süre sınırı yok</span></div><button class="primary" data-action="start">${first?'Parkı çözmeye başla →':'Oyuna dön →'}</button>`);
}
function queueDetails(){openModal(`<div class="eyebrow">ÖNDEN ARKAYA · SOLDAN SAĞA</div><h2 id="modal-title">Sırada kim var?</h2><p>Çerçevedeki yolcu ilk sırada. Onun rengine uygun araç yoksa arkadakiler bekler.</p><div class="queue-list">${level().queue.slice(state.head).map(person).join('')||'Bütün yolcular bindi.'}</div><div class="legend">${names.map((name,i)=>`<span>${shape(i,colors[i])}${name}</span>`).join('')}</div><button class="primary" data-action="close">Parkı incele →</button>`);}
function levelMenu(){openModal(`<div class="eyebrow">12 SABİT BULMACA</div><h2 id="modal-title">Hangi otopark?</h2><p>Yeniden denediğinde araçlar ve yolcu sırası değişmez. Yeni bir plan kurabilirsin.</p><div class="levels-grid">${levels.map((l,i)=>`<button data-level="${i}" class="${completed[i]?'done ':''}${i===index?'current':''}" aria-label="Bölüm ${l.id}, ${l.title}${completed[i]?', tamamlandı':''}">${String(l.id).padStart(2,'0')}<small>${completed[i]?'✓':'·'}</small></button>`).join('')}</div><p class="mini-note">Deneme için bütün bölümler açık. İlk iki bölüm temel kuralları öğretir.</p>`);}
function reset(i){index=i;trace=[];state=E.initial(level());busy=false;save();render();showStatus();}
function complete(){completed[index]=true;save();openModal(`<div class="eyebrow">${index===levels.length-1?'BÜTÜN PARKLAR AÇILDI':'BİR DÜĞÜM DAHA ÇÖZÜLDÜ'}</div><div class="win-icon">✦</div><h2 id="modal-title">Park açıldı!</h2><p>Yolları açtın, araçları doğru sırayla gönderdin. Bütün yolcular bindi.</p><div class="stats"><div><b>${level().cars.length}</b><small>ARAÇ YOLA ÇIKTI</small></div><div><b>${level().queue.length}</b><small>YOLCU BİNDİ</small></div></div><button class="primary" data-action="${index<levels.length-1?'next':'levels'}">${index<levels.length-1?'Sonraki otopark →':'Bölümlere dön →'}</button><button class="secondary" data-action="retry">Bu bölümü tekrar çöz</button>`);tone(950,.2);if(!reduced&&!testMode)for(let i=0;i<22;i++){const p=document.createElement('i');p.className='confetti';p.style.background=colors[i%4];p.style.left=innerWidth/2+'px';p.style.top=innerHeight*.35+'px';document.body.append(p);animate(p,[{transform:'translate(0,0)',opacity:1},{transform:`translate(${Math.sin(i*4.1)*160}px,${140+i*7}px) rotate(${i*41}deg)`,opacity:0}],950+i*15).then(()=>p.remove());}}
$('parking').addEventListener('click',event=>{const el=event.target.closest('[data-car]');if(el)dispatch(Number(el.dataset.car));});
$('undo').addEventListener('click',()=>{if(busy||!trace.length)return;trace.pop();state=replay(trace);save();render();message('Son araç geri alındı. Durak yerlerini koruyarak yeni bir sıra dene.');});
$('hint').addEventListener('click',()=>{if(busy)return;const plan=E.solve(level(),state);if(!plan.path){message(plan.exhausted?'İpucu hesaplanamadı. Son hamleni geri alıp yeniden dene.':'Bu konumdan çözüm kalmadı. Son hamleni geri al.',true);return;}if(!plan.path.length)return;const id=plan.path[0],c=E.car(level(),id);document.querySelector(`[data-car="${id}"]`).classList.add('hinted');const next=level().queue[state.head],opens=level().cars.some(v=>v.color===next&&E.blockers(level(),state,v.id).includes(id));message(names[c.color]+' aracı çıkar.'+(opens?' Sıradaki yolcunun aracına yol açacak.':' Çözüm için güvenli bir sonraki hamle.'),true);});
$('restart').addEventListener('click',()=>{if(busy)return;if(!trace.length){reset(index);return;}openModal(`<div class="eyebrow">AYNI PARK, YENİ PLAN</div><h2 id="modal-title">Baştan deneyelim mi?</h2><p>Araçlar ve yolcu sırası aynı kalır. Bu bölümdeki hamlelerin sıfırlanır.</p><button class="primary" data-action="retry">Bölümü yeniden başlat</button><button class="secondary" data-action="close">Oyuna dön</button>`);});
$('speed').addEventListener('click',()=>{speed=speed===1?2:1;save();$('speed').querySelector('span').textContent=speed+'×';});
$('sound').addEventListener('click',()=>{sound=!sound;save();$('sound').querySelector('i').hidden=sound;$('sound').setAttribute('aria-label',sound?'Ses kapat':'Ses aç');if(sound)tone(650);});
$('help').addEventListener('click',()=>help());$('queue-info').addEventListener('click',queueDetails);$('level-menu').addEventListener('click',levelMenu);$('close-modal').addEventListener('click',()=>{seen=true;save();closeModal();});
$('modal-content').addEventListener('click',event=>{const b=event.target.closest('button');if(!b)return;if(b.dataset.level!==undefined){const i=Number(b.dataset.level);if(Number.isInteger(i)&&i>=0&&i<levels.length){closeModal();reset(i);}return;}switch(b.dataset.action){case'start':seen=true;save();closeModal();break;case'close':closeModal();break;case'next':closeModal();reset(Math.min(index+1,levels.length-1));break;case'retry':closeModal();reset(index);break;case'levels':levelMenu();break;}});
document.addEventListener('keydown',event=>{if($('overlay').hidden)return;if(event.key==='Escape'){event.preventDefault();seen=true;save();closeModal();}if(event.key==='Tab'){const buttons=[...$('overlay').querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
load();state=state||E.initial(level());render();showStatus();if(!seen)help(true);else if(E.won(level(),state))complete();
if(testMode)window.ParkingTest={E,levels,get:()=>({index,state:clone(state),trace:[...trace],busy}),load:i=>{closeModal();reset(i);},dispatch,close:closeModal,solve:()=>E.solve(level(),state),storageKey:KEY};
})();
