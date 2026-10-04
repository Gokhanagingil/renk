const assert=require('node:assert/strict'),path=require('node:path');
let pw;try{pw=require('playwright');}catch(_){pw=require(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES+'/playwright');}
const root=path.resolve(__dirname,'..'),url='file://'+path.join(root,'dist/renk-duragi-0.7.0.html');let browser;
(async()=>{
 browser=await pw.chromium.launch({headless:true,executablePath:process.env.RENK_CHROMIUM_PATH||undefined,args:['--no-sandbox','--no-zygote','--disable-dev-shm-usage']});
 const p=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url+'?test=1');await p.getByRole('button',{name:'Otoparka gir'}).tap();
 await p.locator('#level-menu').tap();assert.equal(await p.locator('#chapter-select option').count(),25);assert.equal(await p.locator('#chapter-prev').isDisabled(),true);
 await p.locator('#chapter-next').tap();assert.equal(await p.locator('#chapter-select').inputValue(),'1');await p.locator('#chapter-prev').tap();assert.equal(await p.locator('#chapter-select').inputValue(),'0');
 await p.locator('#chapter-select').selectOption('24');assert.equal(await p.locator('#chapter-next').isDisabled(),true);assert.equal(await p.locator('[data-level]').count(),20);assert.equal(await p.locator('[data-level="499"]').count(),1);
 await p.locator('#level-jump-number').fill('501');await p.locator('#level-jump button').tap();assert.equal(await p.locator('#overlay').isVisible(),true);assert.equal(await p.evaluate(()=>ParkingTest.get().index),0);
 await p.locator('#level-jump-number').fill('500');await p.locator('#level-jump button').tap();assert.equal(await p.evaluate(()=>ParkingTest.get().index),499);await p.screenshot({path:path.join(root,'qa/campaign-last.png')});
 await p.locator('#speed').tap();await p.locator('#speed').tap();const first=await p.evaluate(()=>ParkingTest.levels[499].solution[0]);await p.locator(`[data-car="${first}"]`).tap();await p.waitForFunction(()=>!ParkingTest.get().busy);
 const saved=await p.evaluate(()=>({state:ParkingTest.get().state,uid:ParkingTest.levels[499].uid}));await p.evaluate(()=>ParkingNative.pause());await p.reload();assert.equal(await p.evaluate(()=>ParkingTest.get().index),499);assert.equal(await p.evaluate(()=>ParkingTest.get().speed),2);assert.deepEqual(await p.evaluate(()=>ParkingTest.get().state),saved.state);assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem(ParkingTest.storageKey)).levelUid),saved.uid);
 await p.locator('#level-menu').tap();assert.equal(await p.evaluate(()=>ParkingNative.back()),true);assert.equal(await p.locator('#overlay').isVisible(),false);assert.equal(await p.evaluate(()=>ParkingNative.back()),false);
 for(const index of [29,153,249,499]){
  await p.evaluate(i=>ParkingTest.load(i),index);await p.locator('#hint').tap();assert.equal(await p.locator('.hinted').count(),1);
  const solution=await p.evaluate(()=>ParkingTest.levels[ParkingTest.get().index].solution);
  for(const id of solution){await p.locator(`[data-car="${id}"]`).tap();await p.waitForFunction(()=>!ParkingTest.get().busy);}
  await p.waitForFunction(()=>!document.querySelector('#finish-card').hidden);assert.equal(await p.evaluate(()=>ParkingTest.E.won(ParkingTest.levels[ParkingTest.get().index],ParkingTest.get().state)),true);
  console.log('Campaign touch solution PASS',index+1);
 }
 assert.equal(await p.locator('#finish-card .primary').innerText(),'Şehir haritası →');await p.locator('#finish-card .primary').tap();assert.equal(await p.locator('[data-level="499"]').evaluate(e=>e.classList.contains('done')),true);await p.screenshot({path:path.join(root,'qa/campaign-map.png')});await p.close();
 // Version-4 saves map by original level identity, even after reordering.
 const legacy=await browser.newPage();await legacy.addInitScript(()=>{localStorage.clear();localStorage.setItem('renk-parking-v041',JSON.stringify({version:4,index:18,log:[],completed:Array.from({length:19},(_,i)=>i===18),seen:true,speed:1.3,sound:false}));});await legacy.goto(url+'?test=1');assert.equal(await legacy.evaluate(()=>ParkingTest.levels[ParkingTest.get().index].uid),'lot-19');assert.equal(await legacy.evaluate(()=>ParkingTest.get().speed),1.3);await legacy.locator('#speed').click();assert.ok(await legacy.evaluate(()=>JSON.parse(localStorage.getItem(ParkingTest.storageKey)).completedUids.includes('lot-19')));await legacy.close();
 const motion=await browser.newPage({viewport:{width:390,height:844}});await motion.goto(url+'?test=1&motion=1');await motion.getByRole('button',{name:'Otoparka gir'}).click();await motion.locator('[data-car="0"]').click();await motion.evaluate(()=>ParkingNative.pause());await motion.waitForTimeout(150);const paused=await motion.evaluate(()=>ParkingTest.get().state);await motion.waitForTimeout(350);assert.deepEqual(await motion.evaluate(()=>ParkingTest.get().state),paused);await motion.evaluate(()=>ParkingNative.resume());await motion.waitForFunction(()=>!ParkingTest.get().busy,{},{timeout:30000});await motion.close();
 assert.deepEqual(errors,[]);await browser.close();console.log('Campaign PASS: 25 groups, jump bounds, last-level completion, stable saves, legacy mapping, native hooks');
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
