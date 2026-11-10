import {overviewLayoutVersion} from '../../overview-layout-version.js';


export function mountOverviewLayout(){
 if(overviewLayoutVersion==='baseline'||document.documentElement.dataset.overviewLocalLayout)return false;
 const summary=document.querySelector('.recording-main .refine-summary');
 const sourceContainer=document.querySelector('#merged-overview #radar');
 if(!summary||!sourceContainer)return false;
 document.body.classList.add('overview-layout-local');
 const oldEntries=[...summary.querySelectorAll('.refine-findings li button')];
 const codes=['h0','h1','h2','p0','p1','p2'];
 const originals=document.createElement('div');originals.hidden=true;originals.append(summary.querySelector('.refine-copy'));summary.append(originals);
 const score=summary.querySelector('.refine-score');
 score.querySelector('.refine-label').lastChild.textContent='AI总分';
 score.querySelector('.refine-label img').src=new URL('assets/figma/content-img111111.svg',document.baseURI).href;
 const radar=document.createElement('div');radar.className='op-radar';
 radar.innerHTML='<h3>五维评价对比</h3>';
 const legend=document.createElement('div');legend.className='op-legend';
 const shown=[true,true,true];
 const renderRadar=()=>{
  radar.querySelector('svg,.op-radar-empty')?.remove();
  const source=sourceContainer.querySelector('svg');
  legend.hidden=!source;
  if(!source){const empty=document.createElement('p');empty.className='op-radar-empty';empty.textContent=sourceContainer.textContent;radar.prepend(empty);return}
  const svg=source.cloneNode(true);svg.removeAttribute('aria-labelledby');svg.setAttribute('aria-label','本课节、学院均分与全校均分五维得分对比');
  svg.querySelectorAll('[id]').forEach(n=>n.removeAttribute('id'));
  const polygons=[...svg.querySelectorAll('polygon')];
  shown.forEach((visible,i)=>{if(polygons[[2,0,1][i]])polygons[[2,0,1][i]].style.display=visible?'':'none';if(i===0)svg.querySelectorAll('circle[r="2.6"]').forEach(n=>n.style.display=visible?'':'none')});
  radar.insertBefore(svg,legend);
 };
 ['本课节','学院均分','全校均分'].forEach((name,i)=>{
  const button=document.createElement('button');button.type='button';button.setAttribute('aria-pressed','true');button.innerHTML=`<i style="background:${['#1d70f2','#b4bac0','#e545d2'][i]}"></i>${name}`;
  button.addEventListener('click',()=>{shown[i]=!shown[i];button.setAttribute('aria-pressed',String(shown[i]));renderRadar()});legend.append(button);
 });
 radar.append(legend);summary.append(radar);renderRadar();
 new MutationObserver(renderRadar).observe(sourceContainer,{childList:true});
 const tabs=document.createElement('div');tabs.className='op-tabs';tabs.setAttribute('aria-label','课堂亮点与改进建议');summary.append(tabs);
 const groups=[];
 for(const label of ['课堂亮点','改进建议']){const group=document.createElement('div');group.className='op-finding-group';group.innerHTML=`<p class="op-group ${groups.length?'advice':''}">${label}</p>`;groups.push(group);tabs.append(group)}

 codes.forEach((code,i)=>{
  const button=document.createElement('button');button.type='button';button.dataset.opCode=code;button.setAttribute('aria-haspopup','dialog');
  button.innerHTML=`<span>${oldEntries[i].textContent}</span>`;
  button.addEventListener('click',()=>{
   const position={x:scrollX,y:scrollY};
   oldEntries[i].click();
   document.querySelector('#detail-dialog')?.addEventListener('close',()=>{button.focus({preventScroll:true});window.scrollTo({left:position.x,top:position.y,behavior:'instant'})},{once:true});
  });groups[i<3?0:1].append(button);
 });
 // Reuse the existing demo averages from overview-refinement; do not calculate new cohorts.
 const averages=[[89.5,88.6],[91.2,90.4],[85.6,84.8],[90.3,89.7],[89.8,88.9]];
 const dimensions=document.querySelector('#merged-overview #dimensions');
 const compare=()=>dimensions?.querySelectorAll('.dimension-card').forEach((card,index)=>{
  if(card.querySelector('.op-comparison'))return;
  card.querySelector('.refine-comparison')?.remove();
  const score=Number.parseFloat(card.querySelector('.dimension-score').textContent),values=averages[Number(card.dataset.dimension??index)];if(!values)return;
  const comparison=document.createElement('div');comparison.className='op-comparison';
  comparison.innerHTML=['学院均分','全校均分'].map((label,j)=>{const delta=score-values[j];return `<span><span>${label}</span><b>${values[j].toFixed(1)}<em class="${delta<0?'below':''}">${delta<0?'↓':'↑'}${Math.abs(delta).toFixed(1)}</em></b></span>`}).join('');card.append(comparison);
 });
 compare();if(dimensions)new MutationObserver(compare).observe(dimensions,{childList:true,subtree:true});
 const rail=document.querySelector('.supervision-rail-items');
 if(rail&&!rail.querySelector('[data-supervision-tab="knowledge"]')){
  const ppt=document.createElement('button');ppt.type='button';ppt.dataset.supervisionTab='knowledge';ppt.innerHTML='PPT<br>摘要';ppt.setAttribute('aria-label','PPT摘要');
  ppt.addEventListener('click',event=>{event.stopImmediatePropagation();document.querySelector('[data-supervision-open]').click();document.querySelector('.recording-sidebar [data-real-tab="knowledge"]').click()});rail.append(ppt);
 }
 const rowCopy={
  'attitude-investment':['教师教学投入',document.documentElement.dataset.indicatorStructure?'整体教学投入度87%，各时段为78%至94%，结合活动安排复盘变化。':'备课材料与课堂安排对应，表情以平静为主，重点讲解处音调有变化。'],
  'content-depth':['教学内容深度与广度',document.querySelector('#content')?.dataset.contentKnowledge?'知识点间有比较、条件与应用关联，规则表述待核对；正式大纲匹配待核验。':'由概念解释推进到方法比较与条件分析，内容范围与课程要求相符。'],
  'method-style':['教学方法','运用设疑、递进分析与比较，结合医疗需求方案和同伴互评开展教学。']
 };
 const dialog=document.querySelector('#detail-dialog');
 const fixRows=()=>dialog.querySelectorAll('[data-overview-module]').forEach(row=>{
  const score=row.querySelector('.overview-v2-module-score strong');
  if(score&&!Number.isFinite(Number.parseFloat(score.textContent))){
   const value=({'content-depth':9,'method-style':8,'literacy-ideology':9})[row.dataset.overviewModule]??9;
   score.textContent=String(value);row.querySelector('.overview-v2-module-score').setAttribute('aria-label',`得分 ${value}，满分 10 分`);
  }
  const override=window.__reportEditRowSummary?.[row.dataset.overviewModule];
  const copy=[...(rowCopy[row.dataset.overviewModule]||[null,null])];
  if(override!==undefined)copy[1]=override;
  if(!copy[0]&&override===undefined)return;
  const name=row.querySelector('.overview-v2-module-name'),description=row.querySelector('.overview-v2-module-summary');
  if(name&&copy[0]&&name.textContent!==copy[0])name.textContent=copy[0];if(description&&copy[1]!==null&&description.textContent!==copy[1])description.textContent=copy[1];
 });
 new MutationObserver(fixRows).observe(dialog,{childList:true,subtree:true});
 // The existing score explanation is delegated from the original overview root.
 score.querySelector('button').addEventListener('click',()=>{const root=document.querySelector('#overview'),original=document.querySelector('#merged-overview [data-action="scoring"]');if(!original)return;const parent=original.parentNode,next=original.nextSibling;root.append(original);try{original.click()}finally{parent.insertBefore(original,next)}const dialog=document.querySelector('#detail-dialog');dialog?.addEventListener('close',()=>score.querySelector('button').focus({preventScroll:true}),{once:true})});
 document.documentElement.dataset.overviewLocalLayout='ready';
 return true;
}
