import {rubricScoringVersion} from './rubric-scoring-version.js';
import {buildRubricReport} from './rubric-scoring-model.js?v=20261102-methods3';
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const number=n=>Number.isInteger(n)?String(n):n.toFixed(1);
function bandDescription(o){
 const c=o.matched.replaceAll('＞','>').replaceAll('＜','<').replace(/\s/g,'');
 const interval=c.match(/^(\d+(?:\.\d+)?)(%)?<x≤(\d+(?:\.\d+)?)(.*)$/);
 if(interval){const unit=interval[2]||interval[4];return `${o.name}超过 ${interval[1]}${unit}，且不超过 ${interval[3]}${unit}`}
 const single=c.match(/^x([>≤])(\d+(?:\.\d+)?)(.*)$/);
 if(single)return `${o.name}${single[1]==='>'?'超过':'不超过'} ${single[2]}${single[3]}`;
 return o.matched.replaceAll('x',o.name);
}

export function mountRubricScoring({onScoresChange}={}){
 if(rubricScoringVersion==='baseline'||location.pathname.includes('/previews/')||document.getElementById('rubric-score-dialog'))return false;
 const dialog=document.createElement('dialog');dialog.id='rubric-score-dialog';dialog.setAttribute('aria-labelledby','rsc-title');
 dialog.innerHTML='<header class="rsc-header"><div><h2 id="rsc-title">量表评分</h2></div><button type="button" class="rsc-close" aria-label="关闭量表评分">×</button></header><nav class="rsc-nav" aria-label="评分维度"></nav><div class="rsc-scroll" tabindex="0"></div>';
 document.body.append(dialog);
 const scroll=dialog.querySelector('.rsc-scroll'),nav=dialog.querySelector('.rsc-nav');let report,trigger,position,navigating=false;
 function render(){
  nav.innerHTML=report.dimensions.map(d=>`<button type="button" data-rsc-jump="${d.id}">${d.name}<span>${d.score.toFixed(1)}</span></button>`).join('');
  scroll.innerHTML=report.dimensions.map(d=>`<section class="rsc-dimension" id="rsc-${d.id}" aria-labelledby="rsc-title-${d.id}"><div class="rsc-dimension-head"><div><h3 id="rsc-title-${d.id}" tabindex="-1">${d.enabled?`<a href="#${d.id}" data-rsc-route aria-label="进入${d.name}报告">${d.name}</a>`:`${d.name}<small>未启用</small>`}</h3></div><strong>${d.score.toFixed(1)}<small>/ 100</small></strong></div><div class="rsc-columns" aria-hidden="true"><span>观测点</span><span>课堂表现</span><span>评分标准档位</span></div>${d.modules.map(m=>`<article class="rsc-module${m.enabled?'':' rsc-disabled'}"><div class="rsc-module-head"><h4>${m.enabled?`<a href="#${m.id}" data-rsc-route aria-label="进入${escape(m.title)}报告模块">${escape(m.title)}</a>`:escape(m.title)}</h4><span>${m.enabled?'':'未启用 · '}${number(m.earned)} / ${number(m.possible)} 分</span></div>${m.observations.map(o=>`<div class="rsc-observation"><div class="rsc-name"><h5>${escape(o.name)}</h5>${o.source==='simulated'?'<small class="rsc-example">示例规则</small>':''}</div><div class="rsc-result"><p title="${escape(o.actual)}">${escape(o.actual)}</p></div><div class="rsc-inline-bands">${o.bands.length?o.bands.map(b=>`<div class="${b.condition===o.matched?'is-matched':''}"><span>${escape(b.condition.replaceAll('x',o.name))}</span><b>${number(b.score)}分</b></div>`).join(''):'<span class="rsc-no-bands">未设置评分档位，仅观察</span>'}</div>${o.score===null?'<span class="rsc-row-status">仅观察</span>':!o.counted?'<span class="rsc-row-status rsc-excluded">不计分</span>':''}</div>`).join('')}</article>`).join('')}</section>`).join('');
 }
 function refresh(){
  report=buildRubricReport({edits:window.__reportEditState||{},config:window.__reportVersionConfig||null});
  onScoresChange?.(report);
  document.querySelectorAll('.refine-number').forEach(n=>n.innerHTML=`${report.total.toFixed(1)}<small>分</small>`);
  report.dimensions.forEach(d=>document.querySelectorAll(`#${d.id} > .attitude-summary h1 strong, #${d.id} > .dimension-summary-card .dimension-summary-score strong, #${d.id} .attitude-summary-score strong`).forEach(n=>n.textContent=d.score.toFixed(1)));
  if(dialog.open){const top=scroll.scrollTop;render();scroll.scrollTop=top}
 }
 function jump(id){
  const section=dialog.querySelector('#rsc-'+id);if(!section)return;
  scroll.scrollTop+=section.getBoundingClientRect().top-scroll.getBoundingClientRect().top-12;
  nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.rscJump===id)));
  section.querySelector('h3').focus({preventScroll:true});
 }
 function open(entry,index){
  if(document.querySelector('dialog[open]'))return;
  trigger=entry;position={x:scrollX,y:scrollY};render();dialog.showModal();
  if(index!==undefined)jump(report.dimensions.find(d=>d.index===index)?.id);else{scroll.scrollTop=0;dialog.querySelector('.rsc-close').focus({preventScroll:true})}
 }
 dialog.querySelector('.rsc-close').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()}});
 dialog.addEventListener('close',()=>{if(navigating){navigating=false;return}trigger?.focus({preventScroll:true});if(position)window.scrollTo({left:position.x,top:position.y,behavior:'instant'})});
 dialog.addEventListener('click',e=>{const link=e.target.closest('[data-rsc-route]');if(!link)return;e.preventDefault();navigating=true;dialog.close();if(location.hash!==link.hash)location.hash=link.hash;else window.dispatchEvent(new HashChangeEvent('hashchange'));});
 nav.addEventListener('click',e=>{const b=e.target.closest('[data-rsc-jump]');if(b)jump(b.dataset.rscJump)});
 function entryFor(target){
  const axis=target.closest('.op-radar svg [data-dimension], #merged-overview #radar [data-dimension]');
  const card=target.closest('#merged-overview #dimensions .dimension-card');
  const entry=axis||card||target.closest('.op-radar svg, #merged-overview #radar svg, .refine-score button');
  return entry?{entry,index:axis||card?Number(entry.dataset.dimension):undefined}:null;
 }
 // Capture before legacy dimension-specific handlers, so both entries use this same flat rubric.
 window.addEventListener('click',e=>{const found=e.target instanceof Element&&entryFor(e.target);if(found){e.preventDefault();e.stopImmediatePropagation();open(found.entry,found.index)}},true);
 window.addEventListener('keydown',e=>{if(!['Enter',' '].includes(e.key))return;const found=e.target instanceof Element&&entryFor(e.target);if(found){e.preventDefault();e.stopImmediatePropagation();open(found.entry,found.index)}},true);
 function accessible(){document.querySelectorAll('.op-radar svg, #merged-overview #radar svg').forEach(svg=>{
  svg.setAttribute('role','button');svg.setAttribute('tabindex','0');svg.setAttribute('aria-label','打开全量量表评分');svg.setAttribute('aria-haspopup','dialog');
  svg.querySelectorAll('[data-dimension]').forEach(axis=>{axis.setAttribute('role','button');axis.setAttribute('tabindex','0');axis.setAttribute('aria-haspopup','dialog');axis.setAttribute('aria-label',`查看${report.dimensions.find(d=>d.index===Number(axis.dataset.dimension)).name}量表评分`)});
 })}
 document.addEventListener('report:scale-changed',refresh);document.addEventListener('report:edited',refresh);
 refresh();accessible();
 for(const target of document.querySelectorAll('.op-radar, #merged-overview #radar'))new MutationObserver(accessible).observe(target,{childList:true});
 document.documentElement.dataset.rubricScoring='ready';return true;
}
