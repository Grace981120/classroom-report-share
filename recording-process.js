import {recordingProcessVersion} from './recording-process-version.js';
import {methodColors} from './method-data.js';
// Confirmed 40-minute design sample; not live ASR or video recognition.
export function mountRecordingProcess(){
if(recordingProcessVersion==='baseline'||document.querySelector('#process-v4'))return;

const style=document.createElement('style');style.textContent=`
#process-v4{flex-shrink:0;border-top:1px solid var(--border);padding-top:10px;margin-top:8px}
#process-v4 h3{font-size:14px;line-height:24px;margin:0 0 10px;font-weight:600}
#process-v4 .scroll{overflow-x:auto}#process-v4 .plot{min-width:680px;position:relative}
#process-v4 .row{display:grid;grid-template-columns:80px minmax(0,1fr);gap:12px;align-items:center;height:29px}
#process-v4 .label{display:flex;align-items:center;gap:6px;font-size:12px;line-height:20px;color:var(--muted)}
#process-v4 .label i{width:5px;height:5px;border-radius:50%;flex:none;background:var(--c)}
#process-v4 .student-start{border-top:1px solid #edf0f5;margin-top:6px;padding-top:6px;height:35px}
#process-v4 .track{position:relative;height:14px;background:#f4f6f9;border-radius:4px}
#process-v4 .bar{position:absolute;height:14px;border-radius:4px;padding:0;border:0;background:var(--c);cursor:pointer;transition:filter .15s}
#process-v4 .bar:hover{filter:brightness(.94)}
#process-v4 .bar:focus-visible,#process-v4 .stage:focus-visible{outline:2px solid #1d70f2;outline-offset:3px}
#process-v4 .stages{position:relative;height:32px;margin-bottom:8px}
#process-v4 .stage{position:absolute;height:28px;top:0;background:#edf4ff;color:#1d70f2;border:1px solid #dce9fc;border-radius:4px;font-size:12px;line-height:24px;padding:0;cursor:pointer}
#process-v4 .guides{position:absolute;left:92px;right:0;top:32px;bottom:24px;pointer-events:none;z-index:1}
#process-v4 .guide{position:absolute;top:0;bottom:0;border-left:1px dashed #c9d6e8}
#process-v4 .axis{margin-left:92px;display:flex;justify-content:space-between;height:24px;align-items:center;font-size:11px;color:var(--muted)}
#process-v4 .stage.selected{background:#1d70f2;color:white;border-color:#1d70f2}
#process-v4 .bar.dim{opacity:.18}#process-v4 .bar.hit{box-shadow:0 0 0 1px #24324722}
#process-v4 .selected-info{font-size:12px;line-height:22px;color:var(--secondary);background:#f5f8fd;border-radius:4px;margin-top:8px;padding:6px 10px}
`;document.head.append(style);
const stages=[[0,4,'导入'],[4,16,'新课讲授'],[16,23,'小组讨论'],[23,28,'汇报交流'],[28,37,'课堂练习'],[37,40,'总结']];
// Separate 40-minute design sample; historical PPT row retained outside the visible process.
const retiredPptProcessRow=['PPT演示',methodColors[0],[[0,1],[2.5,4],[6,9],[10.5,12.5],[14,16],[23,25],[27,28],[38,40]]];
const rows=[
 ['教师讲解',methodColors[0],[[0,1.5],[2.5,4],[4,7],[8,11],[12,16],[26,28],[37,40]]],
 ['教师提问',methodColors[1],[[1.5,2],[7,7.5],[11,11.5],[16,17],[25,25.5],[28,29]]],
 ['教师板书',methodColors[5],[[4.5,6],[9,10.5],[12.5,14],[26,27],[37,38]]],
 ['教师巡堂',methodColors[1],[[17,18],[20,21],[29,30],[32,34],[36,37]]],
 ['教师演示',methodColors[2],[[18,20],[21,23],[30,32],[34,36]]],
 ['学生回答',methodColors[3],[[2,2.5],[7.5,8],[11.5,12],[25.5,26]]],
 ['学生讨论',methodColors[4],[[17,23]]],
 ['学生汇报',methodColors[5],[[23,25]]],
 ['学生练习',methodColors[0],[[29,37]]]
];
const time=n=>String(Math.floor(n)).padStart(2,'0')+':'+String(Math.round(n%1*60)).padStart(2,'0');
const root=document.createElement('section');root.id='process-v4';
root.innerHTML='<h3>课堂过程</h3><div class="scroll"><div class="plot"><div class="row" style="height:36px"><span class="label">教学环节</span><div class="stages">'+stages.map(([s,e,n],i)=>`<button class="stage" data-stage="${i}" style="left:${s/40*100}%;width:calc(${(e-s)/40*100}% - 3px)" title="${n} ${time(s)}–${time(e)}">${n}</button>`).join('')+'</div></div>'+rows.map(([name,c,segs])=>`<div class="row${name==='学生回答'?' student-start':''}"><span class="label"><i style="--c:${c}" aria-hidden="true"></i>${name}</span><div class="track">${segs.map(([s,e])=>`<button class="bar" data-start="${s}" data-end="${e}" title="${name} ${time(s)}–${time(e)}" aria-label="${name} ${time(s)}–${time(e)}" style="left:${s/40*100}%;width:${(e-s)/40*100}%;--c:${c}"></button>`).join('')}</div></div>`).join('')+'<div class="guides">'+stages.slice(1).map(([s])=>`<i class="guide" style="left:${s/40*100}%"></i>`).join('')+'</div><div class="axis"><span>00:00</span><span>10:00</span><span>20:00</span><span>30:00</span><span>40:00</span></div></div></div><div class="selected-info" hidden></div>';
document.querySelector('.recording-segments').after(root);

const installHover=()=>{
const root=document.querySelector('#process-v4');
const style=document.createElement('style');style.textContent='.process-tip{position:fixed;z-index:1000;pointer-events:none;width:226px;padding:14px 16px;background:white;border:1px solid #e6e9ee;border-radius:8px;box-shadow:0 6px 22px #24324718;font:13px/24px "PingFang SC",sans-serif;color:#333}.process-tip b{display:block;font-weight:600;margin-bottom:6px}.process-tip i{display:inline-block;width:7px;height:7px;border-radius:50%;margin-right:7px}.process-tip .kv{display:flex;justify-content:space-between;gap:10px}.process-tip .kv span:first-child{color:#939990}.process-cross{position:fixed;border-left:1px dashed #83b8ad;pointer-events:none;z-index:900}';document.head.append(style);
const tip=document.createElement('div');tip.className='process-tip';tip.id='process-hover-tip';tip.role='tooltip';tip.hidden=true;root.append(tip);
const cross=document.createElement('div');cross.className='process-cross';cross.hidden=true;root.append(cross);
const fmt=n=>String(Math.floor(n)).padStart(2,'0')+':'+String(Math.round(n%1*60)).padStart(2,'0');
const clear=()=>{tip.hidden=true;cross.hidden=true;root.querySelectorAll('.dim,.hit,.selected').forEach(e=>e.classList.remove('dim','hit','selected'));root.querySelectorAll('[aria-describedby]').forEach(e=>e.removeAttribute('aria-describedby'));};
root.querySelectorAll('.bar,.stage').forEach(el=>{
const old=el.getAttribute('title')||el.getAttribute('aria-label')||el.textContent;el.dataset.tooltip=old;el.removeAttribute('title');
const show=ev=>{
clear();let s,e,name,color;
if(el.matches('.bar')){s=Number(el.dataset.start);e=Number(el.dataset.end);name=el.closest('.row').querySelector('.label').textContent;color=el.style.getPropertyValue('--c');el.classList.add('hit');}
else{const match=el.dataset.tooltip.match(/(\d+):(\d+)–(\d+):(\d+)/);s=Number(match[1])+Number(match[2])/60;e=Number(match[3])+Number(match[4])/60;name=el.textContent;color='#1D70F2';el.classList.add('selected');root.querySelectorAll('.bar').forEach(b=>{const hit=Number(b.dataset.start)<e&&Number(b.dataset.end)>s;b.classList.toggle('dim',!hit);b.classList.toggle('hit',hit)});}
const sec=Math.round((e-s)*60),dur=Math.floor(sec/60)+'分'+(sec%60?sec%60+'秒':'');
tip.innerHTML='<b><i style="background:'+color+'"></i>'+name+'</b><div class="kv"><span>起止时间</span><span>'+fmt(s)+'–'+fmt(e)+'</span></div><div class="kv"><span>时长</span><span>'+dur+'</span></div><div class="kv"><span>占全课时长</span><span>'+((e-s)/40*100).toFixed(1).replace(/\.0$/,'')+'%</span></div>';
tip.hidden=false;el.setAttribute('aria-describedby',tip.id);
const box=el.getBoundingClientRect(),plot=root.querySelector('.plot').getBoundingClientRect();
const x=ev.clientX||box.x+box.width/2,y=ev.clientY||box.bottom;
tip.style.left=Math.max(8,Math.min(innerWidth-242,x+16))+'px';tip.style.top=Math.max(8,Math.min(innerHeight-tip.offsetHeight-8,y+18))+'px';
cross.hidden=false;cross.style.left=x+'px';cross.style.top=plot.top+'px';cross.style.height=(plot.height-24)+'px';
};
el.onpointerenter=show;el.onpointermove=show;el.onpointerleave=clear;el.onfocus=show;el.onblur=clear;el.onclick=show;
});
root.addEventListener('keydown',e=>{if(e.key==='Escape')clear()});
window.addEventListener('scroll',clear,true);
window.addEventListener('resize',clear);
document.addEventListener('pointerdown',e=>{if(!root.contains(e.target))clear()});
new MutationObserver(()=>{if(document.querySelector('#recording').hidden)clear()}).observe(document.querySelector('#recording'),{attributes:true,attributeFilter:['hidden']});
};
installHover();

}

