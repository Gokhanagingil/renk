const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
let playwright;try{playwright=require('playwright');}catch(_){playwright=require(path.join(process.env.CODEX_PRIMARY_RUNTIME_NODE_MODULES,'playwright'));}
const root=path.resolve(__dirname,'..'),url='file://'+path.join(root,'dist/renk-duragi-0.2.0.html');
(async()=>{
 const browser=await playwright.chromium.launch({headless:true,executablePath:process.env.RENK_CHROMIUM_PATH||undefined,args:['--no-sandbox','--disable-dev-shm-usage','--no-zygote']});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,deviceScaleFactor:1});
 const page=await context.newPage(),errors=[],external=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
 await page.goto(url+'?test=1');await page.getByRole('button',{name:'İlk sefere çık'}).tap();
 assert.equal(await page.locator('[data-car]').count(),2);
 await page.screenshot({path:path.join(root,'qa/phone-start.png'),fullPage:true});
 await page.locator('[data-car="1"]').tap();assert.equal((await page.evaluate(()=>RenkTest.get())).state.trips,0);
 const before=await page.evaluate(()=>RenkTest.get().state);
 await page.locator('[data-car="0"]').tap();await page.waitForFunction(()=>!RenkTest.get().busy);
 assert.equal((await page.evaluate(()=>RenkTest.get())).state.delivered,2);
 await page.getByRole('button',{name:'Geri al',exact:true}).tap();assert.deepEqual(await page.evaluate(()=>RenkTest.get().state),before);
 await page.locator('[data-car="0"]').tap();await page.waitForFunction(()=>!RenkTest.get().busy);
 const saved=await page.evaluate(()=>RenkTest.get().state);await page.reload();assert.deepEqual(await page.evaluate(()=>RenkTest.get().state),saved);
 const outcomes=[];
 for(let index=0;index<8;index++){
  await page.evaluate(i=>RenkTest.load(i),index);const result=await page.evaluate(()=>RenkTest.solve());
  for(const id of result.path){await page.locator(`[data-car="${id}"]`).tap();await page.waitForFunction(()=>!RenkTest.get().busy);}
  const s=await page.evaluate(()=>RenkTest.get().state);assert.ok(await page.evaluate(()=>RenkTest.E.won(RenkTest.get().state)));
  assert.equal(await page.locator('.stars').getAttribute('aria-label'),'3 yıldız');
  outcomes.push({level:index+1,trips:s.trips,delivered:s.delivered});
 }
 await page.screenshot({path:path.join(root,'qa/phone-complete.png'),fullPage:true});
 await page.evaluate(()=>RenkTest.load(7));await page.getByRole('button',{name:'İpucu',exact:true}).tap();assert.equal(await page.locator('.vehicle.hinted').count(),1);
 for(const viewport of [{width:320,height:568},{width:360,height:740},{width:390,height:844},{width:430,height:932},{width:1280,height:900}]){
  await page.setViewportSize(viewport);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  const clipped=await page.locator('[data-car]').evaluateAll(els=>els.some(el=>el.scrollWidth>el.clientWidth+1));assert.equal(clipped,false);
  await page.screenshot({path:path.join(root,`qa/viewport-${viewport.width}.png`),fullPage:true});
 }
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>RenkTest.load(1));
 await page.getByRole('button',{name:'Nasıl oynanır?'}).tap();await page.keyboard.press('Escape');assert.equal(await page.locator('#overlay').isVisible(),false);
 const corrupt=await browser.newPage();corrupt.on('pageerror',e=>errors.push(e.message));
 await corrupt.addInitScript(()=>localStorage.setItem('renk-duragi-v02','{broken'));await corrupt.goto(url+'?test=1');assert.equal(await corrupt.locator('#overlay').isVisible(),true);await corrupt.close();
 const invalid=await browser.newPage();invalid.on('pageerror',e=>errors.push(e.message));
 await invalid.addInitScript(()=>localStorage.setItem('renk-duragi-v02',JSON.stringify({version:2,index:999,state:{cars:[[900,1]],waiting:[0,0],stop:0},seen:true})));await invalid.goto(url+'?test=1');assert.equal((await invalid.evaluate(()=>RenkTest.get())).index,0);await invalid.close();
 // Production animation and rapid taps: only one transaction may be applied.
 const production=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});production.on('pageerror',e=>errors.push(e.message));production.on('request',r=>{if(/^https?:/.test(r.url()))external.push(r.url());});
 await production.goto(url);await production.getByRole('button',{name:'İlk sefere çık'}).tap();
 await production.locator('[data-car="0"]').tap();await production.waitForTimeout(450);await production.screenshot({path:path.join(root,'qa/phone-animation.png'),fullPage:true});
 await production.locator('[data-car="1"]').dispatchEvent('click');await production.waitForFunction(()=>!document.body.classList.contains('busy'));
 assert.equal(await production.locator('#trips').innerText(),'1');assert.equal(await production.locator('#delivered').innerText(),'2');
 assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 fs.writeFileSync(path.join(root,'qa/browser-results.json'),JSON.stringify({outcomes,viewports:[320,360,390,430,1280],errors,externalRequests:external.length,checks:['touch','8 complete levels','undo','resume','hint','responsive','modal escape','corrupt storage','real animation','one transaction at a time']},null,2));
 console.log('Browser PASS',JSON.stringify(outcomes));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
