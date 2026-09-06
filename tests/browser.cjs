const assert=require('node:assert/strict');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'/home/rodrigonieva/filodesk-app/filodesk-app/node_modules/playwright');
const path=require('node:path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome-stable',args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1080},offline:true});
 const page=await context.newPage(),errors=[],network=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url())});
 await page.goto('file://'+path.resolve('landing.html'));await page.waitForFunction(()=>document.querySelector('#preview0')&&document.images[0].complete);await page.waitForTimeout(500);
 await page.screenshot({path:'/tmp/concurrente-lobby.png',fullPage:true});
 async function launch(id){await page.evaluate(id=>Concurrente.launch(id),id);await page.click('#overlayButton')}
 async function state(fn){return page.evaluate(fn)}
 async function pointer(x,y){const b=await page.locator('#world').boundingBox();return {x:b.x+x*b.width/960,y:b.y+y*b.height/560}}
 // Actual pointer drag wakes barber and assigns a resource.
 await launch(0);await state(()=>Concurrente.step(4));let p=await state(()=>{let q=Concurrente.game.clients.find(o=>o.state==='door');return {x:q.x,y:q.y-40}});let a=await pointer(p.x,p.y),b=await pointer(330,285);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:10});await page.mouse.up();assert(await state(()=>!!Concurrente.game.current));
 await page.click('[data-action="auto"]');await state(()=>{let g=Concurrente.game;for(let i=0;i<8000&&!g.finished;i++){if((g.t*.8)%1>.4&&(g.t*.8)%1<.68)g.cutBeat();g.tick(1/60)}Concurrente.render()});assert.equal(await state(()=>Concurrente.game.served),8);console.log('PASS barber: drag/drop, queue, rhythm, mission');
 // Visual barber with seated and walking characters.
 await launch(0);await page.click('[data-action="auto"]');await state(()=>Concurrente.step(22));await page.screenshot({path:'/tmp/concurrente-barber.png'});
 // Deadlock and recovery via ordered fork assignment.
 await launch(1);await page.click('[data-action="chaos"]');assert(await state(()=>Concurrente.game.dead));await page.screenshot({path:'/tmp/concurrente-philosophers-deadlock.png'});await page.click('[data-action="safe"]');await state(()=>{for(let i=0;i<5;i++){Concurrente.game.step(i);Concurrente.game.step(i);Concurrente.step(4)}});assert(await state(()=>Concurrente.game.ate.every(n=>n>0)));console.log('PASS philosophers: circular wait, ordered acquisition, all eat');
 // Factory: move along actual paths, exercise full/empty semaphores.
 await launch(2);await state(()=>{let g=Concurrente.game;for(let i=0;i<7200&&!g.finished;i++){if(!g.goal){if(g.carry)g.action('belt');else g.action('dock')}g.tick(1/60)}Concurrente.render()});let factory=await state(()=>({done:Concurrente.game.delivered,t:Concurrente.game.t,finished:Concurrente.game.finished}));console.log('factory',factory);assert.equal(factory.done,10);console.log('PASS factory: paths, circular FIFO, delivery goal');
 await launch(2);await state(()=>{Concurrente.game.action('dock');Concurrente.step(2);Concurrente.game.action('belt');Concurrente.step(2)});await page.screenshot({path:'/tmp/concurrente-factory.png'});
 // Bridge: reproduce head-on wait, physically reverse, then safe admission.
 await launch(3);await state(()=>Concurrente.step(9));assert(await state(()=>Concurrente.game.dead));await page.screenshot({path:'/tmp/concurrente-bridge.png'});await page.click('[data-action="safe"]');await page.click('[data-action="retreat"]');await state(()=>Concurrente.step(88));let bridge=await state(()=>({done:Concurrente.game.delivered,t:Concurrente.game.t,resources:Concurrente.game.resources}));console.log('bridge',bridge);assert.equal(bridge.done,6);console.log('PASS bridge: deadlock, rollback, safe crossings');
 // Race visible before enabling mutex; serial guarded rounds produce exact totals.
 await launch(4);await state(()=>Concurrente.step(12));assert.equal(await state(()=>Concurrente.game.lost),1);await page.screenshot({path:'/tmp/concurrente-vault-race.png'});await page.click('[data-action="safe"]');await state(()=>Concurrente.step(2));a=await pointer(237,136);b=await pointer(211,238);await page.mouse.move(a.x,a.y);await page.mouse.down();await page.mouse.move(b.x,b.y,{steps:8});await page.mouse.up();assert.equal(await state(()=>Concurrente.game.lock),0);await page.screenshot({path:'/tmp/concurrente-vault-key.png'});await state(()=>{let g=Concurrente.game;for(let i=0;i<7000&&!g.finished;i++){if(g.lock===null){let o=g.agents.find(o=>o.phase==='wait');if(o)g.giveKey(o.id)}g.tick(1/60)}Concurrente.render()});assert.equal(await state(()=>Concurrente.game.correct),3);console.log('PASS mutex: lost update without lock; three correct guarded rounds');
 // Parking guard refuses a fourth reservation, FIFO and signal complete eight visits.
 await launch(5);await page.click('[data-action="auto"]');await state(()=>Concurrente.step(80));assert.equal(await state(()=>Concurrente.game.done),8);console.log('PASS parking: automatic permit handoff, mission');
 await launch(5);await page.click('[data-action="auto"]');await state(()=>Concurrente.step(15));await page.screenshot({path:'/tmp/concurrente-parking.png'});
 // Pause actually freezes simulation and resumes.
 await page.click('#pauseButton');let t=await state(()=>Concurrente.game.t);await page.waitForTimeout(250);assert.equal(await state(()=>Concurrente.game.t),t);await page.click('#overlayButton');await page.waitForTimeout(150);assert(await state(()=>Concurrente.game.t)>t);
 await page.click('#backButton');assert.equal(await page.locator('#totalWins').textContent(),'6 / 6 misiones resueltas');await page.reload();assert.equal(await page.locator('#totalWins').textContent(),'6 / 6 misiones resueltas');
 await page.click('#quizButton');for(let i=0;i<6;i++){await page.click('[data-answer="'+[0,1,2,0,1,2][i]+'"]');await page.click('#nextQuestion')}assert((await page.locator('#infoBody').textContent()).includes('6 / 6'));await page.click('#closeInfo');await page.click('#terminalButton');await page.fill('#terminalInput','kill -STOP 101');await page.locator('#terminalForm button').click();assert((await page.locator('#terminalOutput').textContent()).includes('detuvo'));await page.fill('#terminalInput','ps');await page.locator('#terminalForm button').click();assert((await page.locator('#terminalOutput').textContent()).includes('T'));await page.click('#closeInfo');
 // Narrow viewport: no horizontal overflow, controls remain accessible.
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'/tmp/concurrente-mobile.png',fullPage:true});assert(await state(()=>document.documentElement.scrollWidth<=window.innerWidth));await launch(0);await page.screenshot({path:'/tmp/concurrente-mobile-game.png',fullPage:true});assert(await state(()=>document.documentElement.scrollWidth<=window.innerWidth));
 assert.deepEqual(errors,[]);assert.deepEqual(network,[]);console.log('PASS pause, persistence, quiz, terminal, mobile layout, no runtime errors; 0 network requests.');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
