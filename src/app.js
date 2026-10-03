(function(){
'use strict';
const E=window.RenkEngine,levels=window.RENK_LEVELS,$=id=>document.getElementById(id);
const KEY='renk-duragi-v02',names=['Sahil','Park'],colors=['#d99732','#237964'],letters=['A','B','C','D'];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const testMode=new URLSearchParams(location.search).has('test');
let index=0,state,history=[],busy=false,sound=false,speed=1,seen=false,best={},lastFocus=null,audioContext=null;
const metrics={blocked:0,undos:0,hints:0};
function icon(type,color=colors[type]) {
 return type===0 ? `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12a9 9 0 0 1 18 0H3Z" fill="${color}"/><path d="M12 3v17q0 3 3 1" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round"/><path d="M7 12q1-7 5-9 4 2 5 9" fill="none" stroke="#fff5" stroke-width="1"/></svg>` : `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 2 6 8h-3l6 8H3l6-8H6Z" fill="${color}"/><path d="M12 17v5" stroke="${color}" stroke-width="3" stroke-linecap="round"/></svg>`;
}
function smallIcon(type,x,y,size=13){return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="0 0 24 24">${icon(type).replace(/^.*?<svg[^>]*>/,'').replace(/<\/svg>$/,'')}</svg>`;}
function person(type) {
 return `<span class="person" aria-label="${names[type]} yolcusu"><svg viewBox="0 0 28 40" aria-hidden="true"><ellipse cx="14" cy="37" rx="9" ry="2" fill="#5d796225"/><path d="M10 28v8m8-8v8" stroke="#38534a" stroke-width="4" stroke-linecap="round"/><path d="M7 18v10h14V18q0-4-7-4t-7 4" fill="${colors[type]}"/><path d="M7 18 4 27m17-9 3 9" stroke="${colors[type]}" stroke-width="4" stroke-linecap="round"/><circle cx="14" cy="9" r="6" fill="#edc198"/><path d="M8 8q0-7 6-7 6 0 6 7" fill="#405249"/><circle cx="12" cy="9" r=".7" fill="#395247"/><circle cx="16" cy="9" r=".7" fill="#395247"/>${smallIcon(type,9,17,10)}</svg></span>`;
}
function van(c,id,large=false) {
 const seats=[...Array(c[0]).fill(0),...Array(c[1]).fill(1),...Array(4-E.cargo(c)).fill(-1)];
 const windows=seats.map((p,i)=>`<g data-seat="${i}"><rect x="${21+i*27}" y="20" width="23" height="26" rx="5" fill="${p<0?'#c7d9d1':'#fff9e9'}" stroke="#94ada0" stroke-width=".5"/>${p<0?`<path d="M${28+i*27} 29v9h9v-9" fill="none" stroke="#9eb9ab" stroke-width="2" stroke-linecap="round"/>`:smallIcon(p,24+i*27,24,17)}</g>`).join('');
 return `<svg class="${large?'':'van'}" viewBox="0 0 165 78" aria-hidden="true"><ellipse cx="82" cy="70" rx="69" ry="5" fill="#38554410"/><rect x="9" y="12" width="147" height="50" rx="15" fill="#e7ba67"/><path d="M10 42h145v13q0 10-14 10H23Q9 64 9 53Z" fill="#e5aa4e"/><path d="M23 12h115q9 0 12 7H18q0-6 5-7" fill="#f7d991"/>${windows}<path d="M135 22h9q7 0 7 7v16h-16Z" fill="#527e73"/><path d="m138 24 9 0v8h-9Z" fill="#92b9aa"/><rect x="10" y="46" width="6" height="8" rx="2" fill="#cf7866"/><rect x="149" y="47" width="7" height="7" rx="2" fill="#fff3cd"/><path d="M45 54h74" stroke="#c89546" stroke-width="2"/><rect x="74" y="50" width="17" height="12" rx="3" fill="#416151"/><text x="82.5" y="59" fill="#fffae6" font-size="9" text-anchor="middle" font-family="sans-serif" font-weight="800">${letters[id]}</text><circle cx="36" cy="64" r="10" fill="#324a42"/><circle cx="36" cy="64" r="4.7" fill="#b9c7b6"/><circle cx="132" cy="64" r="10" fill="#324a42"/><circle cx="132" cy="64" r="4.7" fill="#b9c7b6"/></svg>`;
}
function scenery(stop) {
 const beach=`<rect width="400" height="210" fill="#d8e9e4"/><circle cx="300" cy="40" r="22" fill="#f2d598"/><path d="M0 68Q70 58 155 77T400 68V125H0Z" fill="#9bc8bf"/><path d="M0 89Q80 78 155 92T400 84" fill="none" stroke="#e6f1e6" stroke-width="3"/><path d="M0 114q120-20 240-5t160-3v30H0Z" fill="#e7d4ac"/><path d="M332 94V58" stroke="#8e987c" stroke-width="3"/><path d="M308 62q24-34 48 0Z" fill="#e1a96d"/><path d="M309 62h45" stroke="#f1d0a0" stroke-width="3"/><path d="M275 113h51l-6-7h-42" fill="#c8b28d"/><path d="m353 115 17-39m-5 12-10-6m7 13 14-4" stroke="#789d81" stroke-width="5" stroke-linecap="round"/><path d="M26 99v-42h85v42" fill="#f2e8cb"/><path d="M17 57h102l-14-11H31Z" fill="#608d78"/><path d="M42 76h52v24H42Z" fill="#b5caba"/><rect x="48" y="81" width="17" height="19" fill="#759985"/><rect x="76" y="81" width="12" height="11" fill="#739885"/><path d="M18 118h95" stroke="#d8c497" stroke-width="5"/>`;
 const park=`<rect width="400" height="210" fill="#dce8d4"/><circle cx="305" cy="37" r="20" fill="#f1dfac"/><path d="M0 81q110-35 210 3t190-5v54H0Z" fill="#bbd0a9"/><path d="M0 108q100-20 230-5t170-3v34H0Z" fill="#cfdbb8"/><path d="m45 103 0-45m305 48V50m-49 55V62" stroke="#8c9c78" stroke-width="6"/><path d="m45 15-25 47h12L14 84h62L59 62h12ZM350 16l-23 46h11l-17 22h58l-16-22h10ZM301 35l-17 30h9l-14 17h44l-13-17h8Z" fill="#6d9b78"/><path d="M95 111v-7h60v7m-56 0v12m51-12v12" stroke="#9aa176" stroke-width="4" stroke-linecap="round"/><path d="M96 95h57v9H96Z" fill="#b9ad7b"/><path d="M200 133q-10-18 15-23 25-6 14-15" stroke="#ece5c6" stroke-width="12" fill="none"/>`;
 return `<svg viewBox="0 0 400 210" preserveAspectRatio="xMidYMid slice">${stop===0?beach:park}</svg>`;
}
function validState(s,l) {
 return s && [0,1].includes(s.stop) && Number.isInteger(s.trips)&&s.trips>=0&&s.trips<10000 && Number.isInteger(s.delivered)&&s.delivered>=0 && !E.validate({cars:s.cars,waiting:s.waiting,stop:s.stop}).length && s.cars.length===l.cars.length && s.waiting.every((n,i)=>n<=l.waiting[i]) && s.delivered+s.waiting[0]+s.waiting[1]+s.cars.reduce((n,c)=>n+E.cargo(c),0)===E.total(l);
}
function load() {
 try {
  const data=JSON.parse(localStorage.getItem(KEY)||'null');
  if(!data||data.version!==2)return;
  if(Number.isInteger(data.index)&&data.index>=0&&data.index<levels.length)index=data.index;
  if(validState(data.state,levels[index]))state=data.state;
  seen=data.seen===true;sound=data.sound===true;speed=data.speed===2?2:1;
  best={};for(const [k,v] of Object.entries(data.best||{}))if(/^\d+$/.test(k)&&+k>=1&&+k<=levels.length&&Number.isInteger(v)&&v>0&&v<1000)best[k]=v;
  if(state && Array.isArray(data.history))history=data.history.filter(s=>validState(s,levels[index])).slice(-100);
 } catch(_) { /* unavailable or malformed storage must not block play */ }
}
function save(){try{localStorage.setItem(KEY,JSON.stringify({version:2,index,state,history,seen,sound,speed,best}));}catch(_){}}
function message(text,notice=false){$('message').textContent=text;$('message').classList.toggle('notice',notice);}
function render() {
 const l=levels[index],waiting=state.waiting[state.stop],next=1-state.stop;
 $('app').classList.toggle('dense',state.cars.length>2);
 $('level-number').textContent=String(l.id).padStart(2,'0');$('level-title').textContent=l.title;$('level-subtitle').textContent=l.subtitle;$('trips').textContent=state.trips;
 for(let i=0;i<2;i++) {
  const el=$('route-'+i);el.className='stop-label '+(i===1?'park ':'')+(i===state.stop?'active':'');
  el.innerHTML=`<span class="stop-badge">${icon(i)}</span><span><small>${i===state.stop?'ŞİMDİ':'SONRA'}</small><b>${names[i]}</b></span>`;
 }
 document.querySelector('.route-line span').textContent=state.stop===0?'→':'←';
 $('scenery').innerHTML=scenery(state.stop);$('station-sign').textContent=names[state.stop].toLocaleUpperCase('tr')+' DURAĞI';
 $('service-bus').innerHTML='';$('service-bus').style.opacity='1';$('choose-prompt').hidden=false;
 $('scene-caption').textContent=E.won(state)?'Herkes yerine ulaştı.':'Burada '+names[state.stop]+' yolcuları iner.';
 $('delivered').textContent=state.delivered;
 $('waiting-title').textContent=waiting+' YOLCU BEKLİYOR';$('waiting-destination').innerHTML=icon(next)+names[next]+' yolcusu';
 $('queue').innerHTML=waiting?Array(Math.min(waiting,5)).fill(person(next)).join('')+(waiting>5?`<span class="more-people">+${waiting-5}</span>`:''):'<span class="empty-queue">Herkes bindi ✓</span>';
 $('progress-label').textContent=state.delivered+' / '+E.total(l)+' ulaştı';$('progress-bar').style.width=(100*state.delivered/E.total(l))+'%';$('target').textContent='★★★ '+l.par+' sefer';
 $('fleet').innerHTML=state.cars.map((c,id)=>{
   const r=E.step(state,id),out=c[state.stop],on=r.ok?r.event.on:0;
   return `<button class="vehicle${r.ok?'':' idle'}" data-car="${id}" aria-label="${letters[id]} minibüsü, ${c[0]} Sahil, ${c[1]} Park yolcusu, ${4-E.cargo(c)} boş koltuk. ${out} kişi iner, ${on} kişi biner."><span class="card-top"><span class="vehicle-id">${letters[id]}</span><span class="occupancy">${E.cargo(c)} / 4</span></span>${van(c,id)}<span class="card-bottom">${r.ok?`<span class="drop">${icon(state.stop)} ${out} iner</span><span class="take">+${on} biner</span>`:'<span>Bu durakta iş yok</span><span>—</span>'}</span></button>`;
 }).join('');
 $('undo').disabled=!history.length||busy;$('hint').disabled=busy||E.won(state);$('restart').disabled=busy;
 $('levels').disabled=busy;$('help').disabled=busy;$('queue-info').disabled=busy;
 $('speed').querySelector('span').textContent=speed+'×';$('sound').querySelector('i').hidden=sound;$('sound').setAttribute('aria-label',sound?'Ses kapat':'Ses aç');
 document.querySelectorAll('[data-car]').forEach(el=>{el.disabled=busy||E.won(state);});
 document.body.classList.toggle('busy',busy);
}
const duration=n=>testMode||reduced?1:n/speed;
const pause=n=>new Promise(resolve=>setTimeout(resolve,duration(n)));
async function animate(el,frames,n) {
 if(!el.animate)return pause(n);
 try{await el.animate(frames,{duration:duration(n),easing:'cubic-bezier(.2,.8,.3,1)',fill:'forwards'}).finished;}catch(_){}
}
function tone(frequency=500,length=.08) {
 if(!sound)return;
 try{const A=window.AudioContext||window.webkitAudioContext;if(!A)return;audioContext=audioContext||new A();if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
 const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.setValueAtTime(.055,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+length);oscillator.connect(gain);gain.connect(audioContext.destination);oscillator.start();oscillator.stop(audioContext.currentTime+length);
 }catch(_){}
}
async function fly(type,from,to) {
 if(reduced||testMode)return;
 const el=document.createElement('div');el.className='fly-person';el.innerHTML=person(type);el.style.left=(from.x-12)+'px';el.style.top=(from.y-19)+'px';document.body.append(el);
 await animate(el,[{transform:'translate(0,0) scale(.9)',opacity:1},{transform:`translate(${to.x-from.x}px,${to.y-from.y}px) scale(.55)`,opacity:.25}],260);el.remove();
}
function center(el){const r=el.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2};}
async function dispatch(id) {
 if(busy||!$('overlay').hidden)return;
 const result=E.step(state,id);
 if(!result.ok){metrics.blocked++;message('Bu minibüste burada inecek yolcu ya da binecekler için boş yer yok.',true);const card=document.querySelector(`[data-car="${id}"]`);if(card){card.classList.add('bump');setTimeout(()=>card.classList.remove('bump'),600);}tone(160);return;}
 history.push(E.copy(state));busy=true;render();message(letters[id]+' minibüsü durağa geliyor…');
 const event=result.event,bus=$('service-bus'),cargo=[...state.cars[id]],oldDelivered=state.delivered;
 $('choose-prompt').hidden=true;$('scene-caption').textContent='';bus.innerHTML=van(cargo,id,true);
 await animate(bus,[{transform:'translateX(-320px)'},{transform:'translateX(0)'}],480);tone(340);
 for(let i=0;i<event.out;i++) {
  $('scene-caption').textContent=(i+1)+' yolcu indi · koltuk açılıyor';
  await fly(event.stop,center(bus),center($('home-count')));
  cargo[event.stop]--;bus.innerHTML=van(cargo,id,true);$('delivered').textContent=oldDelivered+i+1;tone(520+i*55);await pause(110);
 }
 await pause(140);
 for(let i=0;i<event.on;i++) {
  $('scene-caption').textContent=(i+1)+' yeni yolcu bindi';
  await fly(1-event.stop,center($('queue')),center(bus));
  cargo[1-event.stop]++;bus.innerHTML=van(cargo,id,true);
  const left=state.waiting[event.stop]-i-1;
  $('waiting-title').textContent=left+' YOLCU BEKLİYOR';$('queue').innerHTML=left?Array(Math.min(left,5)).fill(person(1-event.stop)).join('')+(left>5?`<span class="more-people">+${left-5}</span>`:''):'<span class="empty-queue">Herkes bindi ✓</span>';
  tone(650+i*60);await pause(95);
 }
 if(event.out===4&&event.on===4){$('scene-caption').textContent='✦ Tam değişim!';await pause(380);}else await pause(130);
 await animate(bus,[{transform:'translateX(0)'},{transform:'translateX(350px)'}],450);
 for(const a of bus.getAnimations())a.cancel();
 state=result.state;busy=false;save();render();
 if(E.won(state)){complete();return;}
 let suffix=event.next===event.stop?'Diğer durakta iş yok; burada devam.':'Şimdi '+names[state.stop]+' durağı.';
 message(`${letters[id]}: ${event.out} indi, ${event.on} bindi. ${suffix}`);
}
function openModal(html) {
 lastFocus=document.activeElement;$('modal-content').innerHTML=html;$('overlay').hidden=false;$('app').inert=true;
 const focus=$('modal-content').querySelector('button')||$('close-modal');focus.focus();
}
function closeModal() {$('overlay').hidden=true;$('app').inert=false;const target=lastFocus&&lastFocus.isConnected?lastFocus:$('levels');target.focus();}
function help(first=false) {
 openModal(`<div class="eyebrow">İKİ DURAK · DÖRT KOLTUK</div><h2 id="modal-title">İndir.<br>Yer aç. Yola çık.</h2><div class="modal-van">${van([2,2],0,true)}</div><div class="rules"><b>1</b><span>Minibüsün camlarına bak.<br>${icon(0)} Sahil, ${icon(1)} Park yolcusu.</span></div><div class="rules"><b>2</b><span>Bir minibüse dokun.<br>O duraktaki yolcular iner; bekleyenler biner.</span></div><div class="rules"><b>3</b><span>Sıra diğer durağa geçer.<br>Aynı minibüsü yeni yolcularıyla tekrar seçebilirsin.</span></div><div class="chips"><span class="chip">Süre sınırı yok</span><span class="chip">Ücretsiz geri al</span><span class="chip">Az sefer, çok yıldız</span></div><button class="primary" data-action="start">${first?'İlk sefere çık →':'Devam et →'}</button><p class="modal-note">Bu denemede park engelleri yok. Önce indirme ve bindirme fikrini birlikte deneyelim.</p>`);
}
function levelMenu() {
 openModal(`<div class="eyebrow">KÜÇÜK KASABADA SEKİZ YOLCULUK</div><h2 id="modal-title">Hangi sefer?</h2><p>İstersen sırayla ilerle; istersen bir bölümü yeniden dene.</p><div class="levels-grid">${levels.map((l,i)=>{const stars=best[l.id]?E.rating(l,{trips:best[l.id]}):0;return `<button data-level="${i}" class="${i===index?'current':''}" aria-label="Bölüm ${l.id}, ${l.title}${stars?', '+stars+' yıldız':''}">${String(l.id).padStart(2,'0')}<small>${stars?'★'.repeat(stars)+'☆'.repeat(3-stars):'· · ·'}</small></button>`;}).join('')}</div><p class="modal-note">Yıldızlar en az sefer hedefine göre verilir. İpucu ve geri alma ücretsizdir.</p>`);
}
function queueDetails(){openModal(`<div class="eyebrow">YOLCULARIN PLANI</div><h2 id="modal-title">Kim, nereye?</h2>${[0,1].map(i=>`<div class="queue-details">${icon(i)}<div><b>${names[i]} durağı · ${state.waiting[i]} bekleyen</b><span>${names[1-i]} durağına gitmek istiyorlar.</span></div></div>`).join('')}<div class="legend"><span>${icon(0)} Sahil</span><span>${icon(1)} Park</span></div><p>Minibüsün camındaki simge yolcunun gideceği yeri gösterir. Boş cam, boş koltuktur.</p><button class="primary" data-action="close">Anladım →</button>`);}
function resetLevel(i){index=i;state=E.initial(levels[i]);history=[];busy=false;save();render();message(levels[i].tip);}
function complete() {
 const l=levels[index],stars=E.rating(l,state);best[l.id]=Math.min(best[l.id]||Infinity,state.trips);save();tone(900,.2);
 openModal(`<div class="eyebrow">${index===levels.length-1?'KASABANIN DURAK USTASI':'HERKES YERİNE ULAŞTI'}</div><h2 id="modal-title">${stars===3?'Çok iyi bir rota!':'Güzel yolculuktu.'}</h2><div class="stars" aria-label="${stars} yıldız">${'★'.repeat(stars)}<span class="off">${'★'.repeat(3-stars)}</span></div><p>${stars===3?'Her koltuk işe yaradı. Bu bölümün en az sefer hedefine ulaştın.':'Herkesi ulaştırdın. Daha az sefer için farklı minibüs sıralarını deneyebilirsin.'}</p><div class="result-stats"><div><b>${E.total(l)}</b><span>YOLCU ULAŞTI</span></div><div><b>${state.trips}</b><span>SEFER YAPTIN</span></div><div><b>${l.par}</b><span>ÜÇ YILDIZ HEDEFİ</span></div></div><button class="primary" data-action="${index<levels.length-1?'next':'levels'}">${index<levels.length-1?'Sonraki bölüm →':'Bölümlere dön →'}</button><button class="secondary" data-action="retry">Bu bölümü yeniden oyna</button><p class="modal-note">Deneme sorusu: Bir sonraki minibüsü seçerken yolcuların ineceği yeri düşündün mü?</p>`);
 if(!reduced&&!testMode)confetti();
}
function confetti(){for(let i=0;i<22;i++){const el=document.createElement('i');el.className='confetti';el.style.background=['#dca441','#38896e','#e3be8f','#6c9d9a'][i%4];el.style.left=(window.innerWidth/2)+'px';el.style.top=(window.innerHeight*.35)+'px';document.body.append(el);animate(el,[{transform:'translate(0,0) rotate(0)',opacity:1},{transform:`translate(${Math.sin(i*4.1)*175}px,${140+i*7}px) rotate(${i*53}deg)`,opacity:0}],950+i*17).then(()=>el.remove());}}
$('fleet').addEventListener('click',event=>{const el=event.target.closest('[data-car]');if(el)dispatch(Number(el.dataset.car));});
$('undo').addEventListener('click',()=>{if(busy||!history.length)return;state=history.pop();metrics.undos++;save();render();message('Son sefer geri alındı. Başka bir minibüs deneyebilirsin.');});
$('hint').addEventListener('click',()=>{
 if(busy||E.won(state))return;const plan=E.solve(state);metrics.hints++;
 if(!plan.path||!plan.path.length){message('Bu durumda ipucu hesaplanamadı. Geri alıp yeniden deneyebilirsin.',true);return;}
 const id=plan.path[0],r=E.step(state,id);document.querySelector(`[data-car="${id}"]`).classList.add('hinted');
 message(`${letters[id]} iyi bir seçim: ${r.event.out} yolcu iner, ${r.event.on} yolcu biner.`,true);
});
$('restart').addEventListener('click',()=>{if(busy)return;if(!state.trips){resetLevel(index);return;}openModal(`<div class="eyebrow">YENİ BİR PLAN</div><h2 id="modal-title">Baştan deneyelim mi?</h2><p>Bu bölümdeki seferler sıfırlanır. Kazandığın yıldızlar kalır.</p><button class="primary" data-action="retry">Bölümü yeniden başlat</button><button class="secondary" data-action="close">Oyuna dön</button>`);});
$('speed').addEventListener('click',()=>{speed=speed===1?2:1;$('speed').querySelector('span').textContent=speed+'×';save();});
$('sound').addEventListener('click',()=>{sound=!sound;save();$('sound').querySelector('i').hidden=sound;$('sound').setAttribute('aria-label',sound?'Ses kapat':'Ses aç');if(sound)tone(600,.12);});
$('help').addEventListener('click',()=>help());$('levels').addEventListener('click',levelMenu);$('queue-info').addEventListener('click',queueDetails);$('close-modal').addEventListener('click',()=>{seen=true;save();closeModal();});
$('modal-content').addEventListener('click',event=>{
 const button=event.target.closest('button');if(!button)return;
 if(button.dataset.level!==undefined){const i=Number(button.dataset.level);if(Number.isInteger(i)&&i>=0&&i<levels.length){closeModal();resetLevel(i);}return;}
 switch(button.dataset.action){case 'start':seen=true;save();closeModal();break;case 'close':closeModal();break;case 'next':closeModal();resetLevel(Math.min(index+1,levels.length-1));break;case 'retry':closeModal();resetLevel(index);break;case 'levels':levelMenu();break;}
});
document.addEventListener('keydown',event=>{
 if($('overlay').hidden)return;
 if(event.key==='Escape'){event.preventDefault();seen=true;save();closeModal();}
 if(event.key==='Tab'){
  const buttons=[...$('overlay').querySelectorAll('button:not(:disabled)')],first=buttons[0],last=buttons[buttons.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 }
});
document.addEventListener('visibilitychange',()=>{if(document.hidden)save();});
for(const l of levels)if(!l.par)l.par=E.solve(E.initial(l)).path.length;
load();state=state?E.normalize(state):E.initial(levels[index]);render();message(levels[index].tip);
if(!seen)help(true);else if(E.won(state))complete();
if(testMode)window.RenkTest={E,levels,get:()=>({index,state:E.copy(state),busy,history:E.copy(history),metrics:E.copy(metrics)}),load:i=>{if(!$('overlay').hidden)closeModal();resetLevel(i);},dispatch,close:()=>{if(!$('overlay').hidden)closeModal();},solve:()=>E.solve(state),storageKey:KEY};
})();
