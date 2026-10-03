const path=require('node:path'),fs=require('node:fs'),assert=require('node:assert/strict');
let pw;try{pw=require('playwright');}catch(_){pw=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));}
const root=path.resolve(__dirname,'..'),url='file://'+path.join(root,'dist/renk-duragi-0.3.0.html');let browser;
(async()=>{
 browser=await pw.chromium.launch({headless:true,executablePath:process.env.RENK_CHROMIUM_PATH||undefined,args:['--no-sandbox','--no-zygote','--disable-dev-shm-usage']});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage(),errors=[],requests=[];
 const monitor=p=>{p.on('pageerror',e=>errors.push(e.message));p.on('request',r=>{if(/^https?:/.test(r.url()))requests.push(r.url());});};monitor(page);
 await page.goto(url+'?test=1');await page.getByRole('button',{name:'Parkı çözmeye başla'}).tap();await page.screenshot({path:path.join(root,'qa/parking-start.png'),fullPage:true});
 const tap=async id=>{await page.locator(`[data-car="${id}"]`).tap();await page.waitForFunction(()=>!ParkingTest.get().busy);};
 await tap(1);assert.equal((await page.evaluate(()=>ParkingTest.get())).state.moves,0);assert.equal(await page.locator('.obstacle').count(),1);
 await tap(0);assert.equal(await page.locator('[data-bay-car="0"]').count(),1);assert.equal((await page.evaluate(()=>ParkingTest.get())).state.head,0);
 const saved=await page.evaluate(()=>ParkingTest.get().state);await page.reload();assert.deepEqual(await page.evaluate(()=>ParkingTest.get().state),saved);
 await tap(2);await tap(3);assert.ok(await page.locator('#app').evaluate(el=>el.classList.contains('jammed')));assert.ok((await page.locator('#message').innerText()).includes('kilitlendi'));
 const trapped=await page.evaluate(()=>ParkingTest.get());await page.screenshot({path:path.join(root,'qa/parking-jam.png'),fullPage:true});await tap(1);assert.deepEqual(await page.evaluate(()=>ParkingTest.get().trace),trapped.trace);
 await page.getByRole('button',{name:'Geri al',exact:true}).tap();assert.equal(await page.locator('#app').evaluate(el=>el.classList.contains('jammed')),false);
 await page.getByRole('button',{name:'İpucu',exact:true}).tap();assert.equal(await page.locator('.car.hinted').count(),1);await tap(1);assert.equal((await page.evaluate(()=>ParkingTest.get())).state.head,6);
 const outcomes=[];
 for(let i=0;i<12;i++){
  await page.evaluate(i=>ParkingTest.load(i),i);const solution=await page.evaluate(()=>ParkingTest.solve());
  for(const id of solution.path)await tap(id);
  assert.equal(await page.locator('#modal-title').innerText(),'Park açıldı!');
  assert.equal(await page.evaluate(()=>ParkingTest.E.won(ParkingTest.levels[ParkingTest.get().index],ParkingTest.get().state)),true);
  outcomes.push({level:i+1,moves:(await page.evaluate(()=>ParkingTest.get())).state.moves});
 }
 await page.screenshot({path:path.join(root,'qa/parking-complete.png'),fullPage:true});
 await page.evaluate(()=>ParkingTest.load(11));
 for(const width of [320,360,390,430,1280]){
  await page.setViewportSize({width,height:width===320?568:width===360?740:width===430?932:844});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const targets=await page.locator('[data-car]').evaluateAll(els=>els.map(el=>({w:el.getBoundingClientRect().width,h:el.getBoundingClientRect().height})));
  assert.ok(targets.every(r=>Math.min(r.w,r.h)>=43),'Smallest car touch dimension');
  await page.screenshot({path:path.join(root,`qa/parking-${width}.png`),fullPage:true});
 }
 await page.getByRole('button',{name:'Yolcu sırasının tamamı'}).click();assert.ok(await page.locator('.queue-list .person').count()>8);await page.keyboard.press('Escape');assert.equal(await page.locator('#overlay').isVisible(),false);
 const bad=await browser.newPage();monitor(bad);await bad.addInitScript(()=>localStorage.setItem('renk-parking-v03',JSON.stringify({version:3,index:0,trace:[1,99],seen:true})));await bad.goto(url+'?test=1');assert.equal((await bad.evaluate(()=>ParkingTest.get())).state.moves,0);await bad.close();
 const production=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});monitor(production);await production.goto(url);await production.getByRole('button',{name:'Parkı çözmeye başla'}).tap();
 await production.locator('[data-car="0"]').tap();await production.locator('[data-car="2"]').dispatchEvent('click');await production.waitForFunction(()=>!document.body.classList.contains('busy'));assert.equal(await production.locator('.bay-car').count(),1);
 await production.locator('[data-car="1"]').tap();await production.waitForTimeout(500);await production.screenshot({path:path.join(root,'qa/parking-animation.png'),fullPage:true});await production.waitForFunction(()=>!document.body.classList.contains('busy'));assert.equal(await production.locator('#departed').innerText(),'2 / 4');
 assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
 fs.writeFileSync(path.join(root,'qa/browser-results.json'),JSON.stringify({outcomes,viewports:[320,360,390,430,1280],errors,externalRequests:requests.length,checks:['physical block','full-bay deadlock','no random auto-completion','undo recovery','FIFO boarding','12 winning paths','resume','corrupt trace','hint','queue inspection','normal animation','rapid tap guard']},null,2));
 console.log('Browser PASS',outcomes);await browser.close();
})().catch(async e=>{console.error(e);await browser?.close();process.exitCode=1;});
