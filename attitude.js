import {bindChartHover} from './chart-interactions.js';
import {mountAttitudeIteration} from './attitude-iteration.js';
import {mountTeachingPose} from './attitude-pose.js';
import {attitudeIterationVersion} from './attitude-iteration-version.js';
import {mountTeacherEmotion} from './attitude-emotion.js';
import {mountClassroomManagement} from './attitude-management.js';
import {mountAttitudeSummary} from './attitude-summary.js?v=20261019-jump4';
import {mountAttitudeInvestmentV2} from './attitude-investment-v2.js?v=20261102-language-evaluation';
import {bodyTraceSVG} from './figma-chart-assets.js';
import {attitudeData as data, formatTime, formatDuration} from './attitude-data.js';

const insight = text => `<div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" alt="" width="16" height="16"><p>${text}</p></div>`;
const sectionHead = (id,title,hint='') => `<div class="section-heading"><h2 id="${id}-title">${title}</h2>${hint?`<span class="section-hint">${hint}</span>`:''}</div>`;
// Hover values are read from the same exported curve that is drawn on screen.
function bodyChart() {
  return `<div class="body-chart" id="body-chart"><div class="body-chart-canvas"><svg viewBox="0 0 1360 96" role="img" aria-label="肢体语言丰富度随课堂时间变化，Figma 示例曲线"><image href="assets/figma/attitude-imgGroup427321753.svg" x="45" y="7.5" width="1315" height="81"/><text class="body-axis-label" x="0" y="12">丰富</text><text class="body-axis-label" x="0" y="87">单一</text><g id="body-trace" transform="translate(45 8)">${bodyTraceSVG}</g><line id="body-crosshair" x1="45" x2="45" y1="8" y2="88" stroke="#1d70f2" stroke-dasharray="3 3" opacity="0"/><circle id="body-marker" cx="45" cy="50" r="3" fill="#1d70f2" stroke="white" stroke-width="1.5" opacity="0"/></svg><div class="body-time-axis">${Array.from({length:14},(_,i)=>`<span>${formatTime(i*600)}</span>`).join('')}</div></div><div class="chart-hover-tooltip" id="body-tooltip" role="status" hidden></div></div>`;
}
// Circular fillets on all four corners; 220 viewBox units render at 190 CSS px.
export function roundedDonutSegment(start, percent, renderWidth=190, outer=63, inner=45) {
  const corner=4*220/renderWidth;
  const a=start/100*Math.PI*2-Math.PI/2;
  const b=(start+percent)/100*Math.PI*2-Math.PI/2;
  const outerOffset=Math.asin(corner/(outer-corner));
  const innerOffset=Math.asin(corner/(inner+corner));
  const outerSide=Math.sqrt((outer-corner)**2-corner**2);
  const innerSide=Math.sqrt((inner+corner)**2-corner**2);
  const point=(r,t)=>`${110+r*Math.cos(t)},${84+r*Math.sin(t)}`;
  return `M ${point(outer,a+outerOffset)}
    A ${outer} ${outer} 0 ${b-a-2*outerOffset>Math.PI?1:0} 1 ${point(outer,b-outerOffset)}
    A ${corner} ${corner} 0 0 1 ${point(outerSide,b)}
    L ${point(innerSide,b)}
    A ${corner} ${corner} 0 0 1 ${point(inner,b-innerOffset)}
    A ${inner} ${inner} 0 ${b-a-2*innerOffset>Math.PI?1:0} 0 ${point(inner,a+innerOffset)}
    A ${corner} ${corner} 0 0 1 ${point(innerSide,a)}
    L ${point(outerSide,a)}
    A ${corner} ${corner} 0 0 1 ${point(outer,a+outerOffset)} Z`;
}
// Keep the inner arc and 4px fillets fixed while extending only the outer edge.
export function donutSegmentAttributes(start,percent,renderWidth=190,outer=63,inner=45) {
  const resting=roundedDonutSegment(start,percent,renderWidth,outer,inner);
  const expanded=roundedDonutSegment(start,percent,renderWidth,outer*1.08,inner);
  return `d="${resting}" style="--donut-hover-path:path('${expanded.replace(/\s+/g,' ')}')"`;
}
function postureChart() {
  return `<div class="posture-layout"><div class="posture-ratio"><h3>姿态占比</h3><div class="donut-wrap"><svg viewBox="0 0 220 180" role="group" aria-label="原地站立62%，走动31%，就坐7%">${[{v:62.2,start:0,c:'#1d70f2'},{v:30.9,start:62.2,c:'#00cc7e'},{v:6.9,start:93.1,c:'#e545d2'}].map((d,i)=>`<path class="donut-segment" data-posture="${i}" ${i===0?'data-stationary="true"':''} tabindex="0" role="button" aria-label="查看${i===0?'原地站立':data.posture[i].name}统计" ${donutSegmentAttributes(d.start,d.v-.8)} fill="${d.c}" data-corner-radius="4"/>`).join('')}<text x="178" y="117" class="donut-label">62%</text><text x="16" y="122" class="donut-label">31%</text><text x="56" y="20" class="donut-label">7%</text></svg></div><div class="posture-legend">${[['原地站立','#1d70f2'],['走动','#00cc7e'],['就坐','#e545d2']].map(([n,c])=>`<span><i style="background:${c}"></i>${n}</span>`).join('')}</div></div><div class="posture-timeline"><h3>姿态时序图 <span>点击色块查看片段</span></h3>${data.posture.map((p,i)=>`<div class="posture-row"><span class="posture-row-label">${p.name}</span><div class="posture-track">${p.segments.map(([start,end],j)=>`<button data-posture="${i}" data-segment="${j}" aria-label="${p.name} ${formatTime(start)}至${formatTime(end)}" title="${p.name} · ${formatTime(start)}–${formatTime(end)}" style="left:${start/data.duration*100}%;width:${(end-start)/data.duration*100}%;background:${p.color}"></button>`).join('')}</div><span class="posture-duration">${formatDuration(p.seconds)}</span></div>`).join('')}<div class="posture-axis">${Array.from({length:14},(_,i)=>`<span style="left:${i/13*100}%">${formatTime(i*600)}</span>`).join('')}</div><p class="chart-footnote">站立含走动；占比环图将原地站立、走动与就坐分开统计。</p></div></div>`;
}
function patrolChart() {
  return `<div class="patrol-layout"><div class="patrol-stats">${data.patrol.map((p,i)=>`<button data-patrol="${i}" aria-pressed="false"><strong>${p.percent}<small>%</small></strong><span>${p.label}</span></button>`).join('')}</div><div class="classroom-map"><svg viewBox="0 0 1074 216" role="group" aria-label="巡堂轨迹：讲台区域67.2%，学生区域32.8%，路径覆盖前方及两侧过道"><rect x="394" y="0" width="322.162" height="10" rx="4" fill="#f3f5f7"/><rect class="student-area" x="255" y="70" width="580" height="146" rx="8" fill="#f3f5f7"/><image class="patrol-path" href="assets/figma/attitude-imgGroup1142813942.svg" x="358" y="34" width="365.244" height="182"/><g class="map-region" data-patrol="0" role="button" tabindex="0" aria-label="查看讲台区域停留统计"><rect x="355" y="20" width="375" height="40" fill="transparent"/></g><g class="map-region" data-patrol="1" role="button" tabindex="0" aria-label="查看学生区域停留统计"><rect x="350" y="65" width="385" height="150" fill="transparent"/></g></svg><div id="patrol-caption" class="patrol-caption" aria-live="polite" hidden></div></div></div>`;
}
function managementChart() {
  return `<div class="management-chart"><div class="management-track">${data.management.map((e,i)=>`<button class="management-event" data-management="${i}" data-event-type="${e.type}" style="left:${e.time/data.duration*100}%;--event-color:${data.managementTypes[e.type].color};--event-offset:${i===8?'-9px':'0px'}" aria-label="${formatTime(e.time)} ${data.managementTypes[e.type].name}" title="${formatTime(e.time)} ${data.managementTypes[e.type].name}"><span></span></button>`).join('')}</div><div class="management-axis">${[0,30,60,90,130].map(t=>`<span style="left:${t/130*100}%">${formatTime(t*60)}</span>`).join('')}</div><div class="management-legend" aria-label="课堂管理类型筛选">${data.managementTypes.map((t,i)=>`<button data-management-filter="${i}" aria-pressed="true"><i style="background:${t.color}"></i>${t.name}</button>`).join('')}</div><div class="management-detail" id="management-detail" hidden aria-live="polite"></div></div>`;
}

export function initAttitude({openDialog}) {
  const root = document.querySelector('#attitude');
  root.innerHTML = `<section class="card attitude-summary"><div><h1>教学态度 <strong>${data.score}</strong><span class="tag">优秀</span></h1><p>${data.summary}</p></div></section>
  <section class="card section" id="attitude-basics" aria-labelledby="basics-title">${sectionHead('basics','基础情况')}<div class="basic-grid">${data.basics.map((b,i)=>`<button class="basic-stat" data-basic="${i}" aria-label="${b.label}：${b.value}${b.unit||''}，查看记录"><strong class="${b.unit?'basic-count':b.value==='无'?'basic-none':''}">${b.value}${b.unit?`<small>${b.unit}</small>`:''}</strong><span>${b.label}</span>${b.status==='待核查'?'<i class="review-dot" title="待核查"></i>':''}</button>`).join('')}</div></section>
  <section class="card section" id="attitude-body" aria-labelledby="body-title">${sectionHead('body','肢体语言')}${insight('教师课堂上使用了<strong>丰富的肢体语言</strong>，不仅增强了表达效果，还使课堂充满活力。')}${bodyChart()}</section>
  <section class="card section" id="attitude-posture" aria-labelledby="posture-title">${sectionHead('posture','教学姿态')}${insight('教师高度敬业：全程主导（93% 站立）体现强烈责任心；走动教学（31%）显著增强互动与课堂活力。')}${postureChart()}</section>
  <section class="card section" id="attitude-patrol" aria-labelledby="patrol-title">${sectionHead('patrol','巡堂轨迹')}${insight('讲台区调度自如体现教学节奏掌控力，学生区介入稍显不足；建议增加个性化指导频率以强化走动互动的深度覆盖。')}${patrolChart()}</section>
  <section class="card section" id="attitude-management" aria-labelledby="management-title">${sectionHead('management','课堂管理','点击时间点查看提醒内容')}${insight('教师在 13:35 强调考勤的重要性，授课过程中持续关注学生学习状态，多次提醒学生集中注意力。')}${managementChart()}</section>
  <footer><span><span class="status-dot"></span>DEMO · 示例数据 · 有效分析片段共 130 分钟（不含休息与未分析片段）</span><a class="text-button muted" href="#overview">返回报告总览 ↑</a></footer>`;

  mountTeacherEmotion(root);
  mountClassroomManagement(root);
  function basicDialog(i) {
    const b = data.basics[i];
    openDialog(b.label,`<div class="basic-dialog-value"><strong>${b.value}${b.unit?`<small>${b.unit}</small>`:''}</strong><span class="tag ${b.status==='待核查'?'orange':''}">${b.status}</span></div>${b.events?`<div class="attitude-record-list">${b.events.map(([time,text])=>`<article><time>${time}</time><p>${text}</p></article>`).join('')}</div>`:`<div class="attitude-record-list"><article><time>${b.time}</time><p>${b.detail}</p></article></div>`}<div class="dialog-note">本页为交互演示，记录、时间点与分析结果均为示例；待核查线索应结合完整课堂情境确认。</div><div class="dialog-actions"><button class="primary-button" data-action="close">知道了</button></div>`,`教学态度 / ${root.dataset.attitudeSummary?'关键指标':'基础情况'}`);
  }
  function postureDialog(i,segment,stationary=false) {
    const source=data.posture[i];
    const p=stationary?{...source,name:"原地站立",label:"原地站立",seconds:data.posture[0].seconds-data.posture[1].seconds}:source;
    const interval=segment===undefined?null:p.segments[segment];
    openDialog(`${p.name}${interval?'片段':'统计'}`,`<div class="basic-dialog-value"><strong>${interval?formatTime(interval[1]-interval[0]):formatDuration(p.seconds)}</strong></div><p>${interval?`片段时间：${formatTime(interval[0])}–${formatTime(interval[1])}，观察到教师${p.name}教学。`:`${p.label}累计 ${formatDuration(p.seconds)}，占有效分析时长的 ${(p.seconds/data.duration*100).toFixed(1)}%。`}</p><div class="dialog-note">${i===0?'站立统计包含走动，原地站立为 80分54秒。':'姿态片段与时长使用同一组示例数据。'} 时间轴以有效分析片段累计时间为准。</div>`,'教学态度 / 教学姿态');
  }
  root.addEventListener('click',e=>{
    const t=e.target.closest('[data-basic],[data-posture],[data-patrol],[data-management],[data-management-filter]');
    if(!t) return;
    if(t.dataset.basic!==undefined) return basicDialog(Number(t.dataset.basic));
    if(t.dataset.posture!==undefined) return postureDialog(Number(t.dataset.posture),t.dataset.segment===undefined?undefined:Number(t.dataset.segment),t.dataset.stationary==='true');
    if(t.dataset.patrol!==undefined) {
      const i=Number(t.dataset.patrol), p=data.patrol[i];
      root.querySelectorAll('.patrol-stats button').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
      const caption=root.querySelector('#patrol-caption'); caption.hidden=false;caption.textContent=`${p.label} ${p.percent}% · ${p.detail}`;
      root.querySelector('.classroom-map').dataset.region=String(i);return;
    }
    if(t.dataset.management!==undefined) {
      const i=Number(t.dataset.management),record=data.management[i];
      root.querySelectorAll('.management-event').forEach((b,j)=>b.setAttribute('aria-pressed',String(i===j)));
      const panel=root.querySelector('#management-detail');panel.hidden=false;
      panel.innerHTML=`<time style="color:${data.managementTypes[record.type].color}">${formatTime(record.time)}</time><strong>${data.managementTypes[record.type].name}</strong><p>${record.text}</p>`;return;
    }
    if(t.dataset.managementFilter!==undefined) {
      const selected=t.getAttribute('aria-pressed')!=='true';t.setAttribute('aria-pressed',String(selected));
      root.querySelectorAll(`[data-event-type="${t.dataset.managementFilter}"]`).forEach(b=>{b.hidden=!selected;});
      const active=root.querySelector('.management-event[aria-pressed="true"]');
      if(active?.hidden) root.querySelector('#management-detail').hidden=true;
      return;
    }
  });
  root.addEventListener('keydown',e=>{const target=e.target.closest('svg [role="button"]');if(target&&['Enter',' '].includes(e.key)){e.preventDefault();target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
  let curvePoints;
  function showIntensity(i) {
    if(!curvePoints) {
      curvePoints = [];
      root.querySelectorAll('#body-trace path[stroke]').forEach(path=>{
        const length=path.getTotalLength();
        for(let l=0;l<=length;l+=1) {const p=path.getPointAtLength(l);curvePoints.push({x:p.x,y:p.y});}
      });
    }
    const localX=i/130*1315, x=45+localX;
    let nearest=null;
    for(const point of curvePoints) if(!nearest || Math.abs(point.x-localX)<Math.abs(nearest.x-localX)) nearest=point;
    const available=nearest && Math.abs(nearest.x-localX)<3;
    const value=available?Math.round((79-nearest.y)/79*100):null;
    root.querySelector('#body-crosshair').setAttribute('x1',x);root.querySelector('#body-crosshair').setAttribute('x2',x);root.querySelector('#body-crosshair').setAttribute('opacity','1');
    const marker=root.querySelector('#body-marker');marker.setAttribute('cx',x);marker.setAttribute('cy',available?8+nearest.y:88);marker.setAttribute('opacity',available?'1':'0');
    const text=available?`${formatTime(i*60)} · 肢体语言${value>=60?'丰富':value>=35?'适中':'较少'}（示例曲线）`:`${formatTime(i*60)} · 此时段暂无曲线数据`;
    return text;
  }
  bindChartHover({
    plot:root.querySelector('.body-chart-canvas > svg'),tooltip:root.querySelector('#body-tooltip'),max:130,
    fromRatio:ratio=>(ratio*1360-45)/1315*130,inspect:showIntensity,
    clear:()=>{root.querySelector('#body-crosshair').setAttribute('opacity','0');root.querySelector('#body-marker').setAttribute('opacity','0');}
  });
  if(!['1.1','1.2'].includes(attitudeIterationVersion))mountTeachingPose(root);
  mountAttitudeIteration(root,{openDialog});
  mountAttitudeSummary(root);
  mountAttitudeInvestmentV2(root,{openDialog});
}
