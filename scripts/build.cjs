const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),E=require('../src/engine.js'),levels=require('../src/levels.js');
const solutions=levels.map(l=>{
 const errors=E.validate(l);if(errors.length)throw Error('Invalid level '+l.id+': '+errors);
 const result=E.solve(E.initial(l));if(!result.path)throw Error('Unsolved level '+l.id);
 l.par=result.path.length;
 return {level:l.id,minimumTrips:l.par,path:result.path.map(i=>String.fromCharCode(65+i)),states:result.visited};
});
fs.mkdirSync(path.join(root,'dist'),{recursive:true});fs.mkdirSync(path.join(root,'qa'),{recursive:true});
const read=file=>fs.readFileSync(path.join(root,'src',file),'utf8');
let html=read('index.html').replace('<link rel="stylesheet" href="style.css">','<style>\n'+read('style.css')+'\n</style>');
html=html.replace('<script src="engine.js"></script>','<script>\n'+read('engine.js')+'\n</script>');
html=html.replace('<script src="levels.js"></script>','<script>window.RENK_LEVELS = '+JSON.stringify(levels)+';</script>');
html=html.replace('<script src="app.js"></script>','<script>\n'+read('app.js')+'\n</script>');
fs.writeFileSync(path.join(root,'dist','renk-duragi-0.2.0.html'),html);
fs.writeFileSync(path.join(root,'qa','solutions.json'),JSON.stringify(solutions,null,2)+'\n');
console.log(solutions);console.log('Built dist/renk-duragi-0.2.0.html');
