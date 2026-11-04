import {teachingPoseVersion} from './attitude-pose-version.js';
import {attitudeData,formatTime} from './attitude-data.js';

// Design examples only; no production gesture detector or video is connected.
const movements=[['摸面部',6],['整理衣物',3],['拨弄头发',1]];
const orientations=[['面向学生',61],['扭头看课件',24],['背身板书',15]];
const colors=['#1d70f2','#00cc7e','#e545d2'];
function arc(start,percent){const outer=63,inner=45,c=4,a=start/100*2*Math.PI-Math.PI/2,b=(start+percent)/100*2*Math.PI-Math.PI/2,oo=Math.asin(c/(outer-c)),io=Math.asin(c/(inner+c)),os=Math.sqrt((outer-c)**2-c*c),is=Math.sqrt((inner+c)**2-c*c),p=(r,t)=>`${110+r*Math.cos(t)},${84+r*Math.sin(t)}`;return `M ${p(outer,a+oo)} A 63 63 0 ${b-a-2*oo>Math.PI?1:0} 1 ${p(outer,b-oo)} A 4 4 0 0 1 ${p(os,b)} L ${p(is,b)} A 4 4 0 0 1 ${p(inner,b-io)} A 45 45 0 ${b-a-2*io>Math.PI?1:0} 0 ${p(inner,a+io)} A 4 4 0 0 1 ${p(is,a)} L ${p(os,a)} A 4 4 0 0 1 ${p(outer,a+oo)} Z`;}
function ring(rows){let start=0;return `<svg class="tp-ring" viewBox="0 0 220 180" aria-hidden="true">${rows.map(([name,v],i)=>{const angle=(start+v/2)/100*2*Math.PI-Math.PI/2,s=`<path d="${arc(start,v-.8)}" fill="${colors[i]}"/><text x="${110+86*Math.cos(angle)}" y="${Math.max(10,84+86*Math.sin(angle))}" dominant-baseline="middle" text-anchor="middle">${v}%</text>`;start+=v;return s}).join('')}</svg><div class="tp-legend">${rows.map(([name],i)=>`<span><i style="background:${colors[i]}"></i>${name}</span>`).join('')}</div>`;}
export function mountTeachingPose(root){
 if(teachingPoseVersion==='baseline')return;
 const body=root.querySelector('#attitude-body'),posture=root.querySelector('#attitude-posture');if(!body||!posture)return;
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./attitude-pose.css',import.meta.url).href;document.head.append(style);
 const pose=[['原地站立',+(100*(attitudeData.posture[0].seconds-attitudeData.posture[1].seconds)/attitudeData.duration).toFixed(1)],['走动',+(100*attitudeData.posture[1].seconds/attitudeData.duration).toFixed(1)],['就坐',+(100*attitudeData.posture[2].seconds/attitudeData.duration).toFixed(1)]];
 const originalChildren=Array.from(body.childNodes);originalChildren.forEach(n=>n.remove());posture.hidden=true;
 body.classList.add('tp-module');body.innerHTML=`<div class="section-heading"><div class="tp-heading"><h2 id="body-title">教学姿态</h2><span class="tp-help"><button aria-label="教学姿态定义" aria-expanded="false">?</button><span role="tooltip">观察重复小动作、头部朝向及姿态分布。次数和时长不直接代表教学质量，需结合具体教学活动判断。</span></span></div></div><div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>课堂以站立、走动为主；摸面部动作有重复出现，可结合片段复盘。</p></div><div class="tp-grid"><button class="tp-card" data-pose-tab="0" aria-label="重复性小动作，共10次，查看分类详情"><h3>重复性小动作</h3><div class="tp-total"><strong>${movements.reduce((s,r)=>s+r[1],0)}</strong><span>次</span></div>${movements.map(([n,v],i)=>`<div class="tp-row"><span>${n}</span><div class="tp-bar"><i style="width:${v/6*100}%;background:${colors[i]}"></i></div><span>${v} 次</span></div>`).join('')}</button><button class="tp-card" data-pose-tab="1" aria-label="身体朝向：${orientations.map(r=>r.join(' ')+'%').join('，')}，查看详情"><h3>身体朝向</h3>${ring(orientations)}</button><button class="tp-card" data-pose-tab="2" aria-label="姿态分布：${pose.map(r=>r.join(' ')+'%').join('，')}，查看详情"><h3>姿态分布</h3>${ring(pose)}</button></div>`;
 const dialog=document.createElement('dialog');dialog.className='tp-dialog';dialog.setAttribute('aria-labelledby','tp-dialog-title');dialog.innerHTML='<div class="dialog-head"><h2 id="tp-dialog-title">教学姿态详情</h2><button class="icon-button" aria-label="关闭">×</button></div><div class="tp-details"><div class="tp-tabs" role="tablist">'+['重复性小动作','身体朝向','姿态分布'].map((n,i)=>`<button role="tab" data-tab="${i}" id="tp-tab-${i}" aria-controls="tp-panel-${i}">${n}</button>`).join('')+'</div>'+[0,1,2].map(i=>`<div role="tabpanel" id="tp-panel-${i}" aria-labelledby="tp-tab-${i}"></div>`).join('')+'</div>';body.append(dialog);
 const panels=[0,1,2].map(i=>dialog.querySelector('#tp-panel-'+i));
 panels[0].innerHTML=movements.map(([n,v])=>`<p>${n}：${v} 次</p>`).join('')+'<div class="dialog-note">原始帧图和对应片段暂不可用，不能判断动作用途或是否干扰表达。</div><h3>肢体表达趋势</h3><p>此趋势为独立观察，不能用于推算摸面部等动作次数。</p>';
 // Move the original curve node, retaining its hover listeners and original paths.
 originalChildren.filter(n=>n.nodeType===1&&n.classList.contains('body-chart')).forEach(n=>panels[0].append(n));
 panels[1].innerHTML=orientations.map(([n,v])=>`<p>${n}：${v}%</p>`).join('')+'<div class="dialog-note">按可识别头部动作时长统计，不等同完整身体朝向或目光覆盖。对应帧图和时序暂不可用。</div>';
 const layout=posture.querySelector('.posture-layout');panels[2].append(layout);panels[2].insertAdjacentHTML('beforeend','<div class="dialog-note" id="tp-segment-note">原地站立、走动、就坐互斥统计；原时序中的“站立”包含走动。</div>');
 let trigger=null;
 function select(i){panels.forEach((p,j)=>p.hidden=i!==j);dialog.querySelectorAll('[data-tab]').forEach((b,j)=>{b.setAttribute('aria-selected',String(i===j));b.tabIndex=i===j?0:-1;});}
 body.querySelectorAll('[data-pose-tab]').forEach(b=>b.onclick=()=>{trigger=b;select(+b.dataset.poseTab);dialog.showModal()});
 dialog.querySelector('.icon-button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>trigger?.focus({preventScroll:true}));
 dialog.querySelectorAll('[data-tab]').forEach(b=>{b.onclick=()=>select(+b.dataset.tab);b.onkeydown=e=>{if(['ArrowRight','ArrowLeft','Home','End'].includes(e.key)){e.preventDefault();const i=e.key==='Home'?0:e.key==='End'?2:(+b.dataset.tab+(e.key==='ArrowRight'?1:2))%3;select(i);dialog.querySelector(`[data-tab="${i}"]`).focus();}}});
 // Keep original posture clicks within this dialog instead of stacking another dialog.
 dialog.addEventListener('click',e=>{const target=e.target.closest('[data-posture]');if(!target)return;e.stopPropagation();const row=attitudeData.posture[+target.dataset.posture],seg=target.dataset.segment===undefined?null:row.segments[+target.dataset.segment];dialog.querySelector('#tp-segment-note').textContent=seg?`${row.name} · ${formatTime(seg[0])}–${formatTime(seg[1])}。对应原始帧图暂不可用。`:`${target.dataset.stationary?'原地站立':row.name}统计；站立包含走动，原地站立为站立扣除走动。`;});
 const help=body.querySelector('.tp-help button');help.onclick=()=>help.setAttribute('aria-expanded',String(help.getAttribute('aria-expanded')!=='true'));
}
