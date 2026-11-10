import {contentData as data} from './content-data.js?v=20261103-all-case-labels';
import {teachingContentVersion} from './content-quality-version.js';
import {mountTeachingGoals} from './content-goals.js?v=20261105-teacher-source';
import {mountContentDepth} from './content-depth.js?v=20261103-depth-stars';
import {mountContentAccuracy} from './content-accuracy.js';
import {mountChallengeMatch} from './content-challenges-match.js';
import {mountDimensionSummary} from './dimension-summary.js?v=20261019-jump5';

import {mountContentTwoProperties} from './content-two-properties.js?v=20261105-two-properties-policy';

const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = name => `assets/figma/content-${name}.svg`;
const note = '';
const connectors = side => `<div class="content-connectors ${side==='left'?'is-left':''}" aria-hidden="true"><img class="branch-top" src="${asset(side==='left'?'imgVector1249':'imgVector1246')}" alt=""><img class="branch-middle" src="${asset('imgVector1248')}" alt=""><img class="branch-bottom" src="${asset(side==='left'?'imgVector1249':'imgVector1246')}" alt=""></div>`;
const contentV12=teachingContentVersion!=='baseline';
const contentLabel=kind=>kind==='goals'?(contentV12?'教学目标':'课程目标'):(contentV12?'教学重难点':'课程重难点');
const node = (text,kind,i) => `<button class="content-map-node" data-content-node="${kind}" data-index="${i}" aria-label="查看${contentLabel(kind)} ${i+1}：${escapeHTML(text)}">${escapeHTML(text)}</button>`;
function map(kind) {
  const items=data[kind],both=kind==='challenges';
  return `<div class="content-map ${both?'content-map-bilateral':'content-map-goals'}" role="group" aria-label="${contentLabel(kind)}关系图">
    ${both?`<div class="content-map-list content-map-left">${items.slice(0,3).map((t,i)=>node(t,kind,i)).join('')}</div>${connectors('left')}`:''}
    <button class="content-map-root" data-content-all="${kind}" aria-label="查看全部${contentLabel(kind)}">${both?'重难点':'目标'}</button>
    ${connectors('right')}<div class="content-map-list content-map-right">${items.slice(both?3:0).map((t,i)=>node(t,kind,both?i+3:i)).join('')}</div>
  </div>`;
}
function exampleRows(examples,kind,index) {
  return `<div class="content-examples">${examples.map((e,i)=>`<button class="content-example" data-content-example="${kind}" data-index="${index}" data-example="${i}" aria-label="查看${e.time}课堂证据：${escapeHTML(e.text)}"><span class="content-time"><img src="${asset('img')}" width="14" height="14" alt=""><time>${e.time}</time></span><span>${e.scene?`<span class="practice-scene">${escapeHTML(e.scene)}</span>`:''}${escapeHTML(e.text)}</span></button>`).join('')}</div>`;
}
export function initContent({openDialog}) {
  const root=document.querySelector('#content');
  const contents={
    goals:map('goals'),
    challenges:map('challenges'),
    features:`<div class="content-feature-grid">${data.features.map((f,i)=>`<article class="content-detail-card"><h3>${f.name}</h3>${exampleRows(f.examples,'features',i)}</article>`).join('')}</div>`,
    practice:`<div class="content-practice-grid">${data.practice.map((p,i)=>`<article class="content-detail-card"><span class="content-label">知识</span><h3>${p.knowledge}</h3><span class="content-label">案例</span>${exampleRows(p.examples,'practice',i)}</article>`).join('')}</div>`
  };
  root.innerHTML=`<section class="card attitude-summary"><div><h1>教学内容 <strong>${data.score}</strong><span class="tag">优秀</span></h1><p>${data.summary}</p></div></section>
    ${data.sections.map(s=>`<section class="card section" id="content-${s.id}" aria-labelledby="content-${s.id}-title"><div class="section-heading"><h2 id="content-${s.id}-title">${s.name}</h2></div><div class="attitude-insight"><img src="${asset('img111111')}" width="16" height="16" alt=""><p>${s.id==='goals'?`共呈现 ${data.goals.length} 个${contentV12?'教学目标':'课程目标'}。`:''}${s.summary}</p></div>${contents[s.id]}</section>`).join('')}
    <footer><span></span><a class="text-button muted" href="#overview">返回报告总览 ↑</a></footer>`;
  root.querySelector('#content-practice .section-heading').insertAdjacentHTML('beforeend','<div class="practice-ratings"><span class="practice-rating" aria-label="激发兴趣：3星，满分5星">激发兴趣<span class="practice-stars" aria-hidden="true">★★★<span>☆☆</span></span></span><span class="practice-rating" aria-label="学科相关性：5星，满分5星">学科相关性<span class="practice-stars" aria-hidden="true">★★★★★<span></span></span></span></div>');
  mountTeachingGoals(root);
  mountContentAccuracy(root);
  mountDimensionSummary(root,'content',{openDialog});
  mountContentDepth(root,{openDialog});
  mountChallengeMatch(root,{openDialog});
  mountContentTwoProperties(root,{openDialog});
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-content-node],[data-content-all],[data-content-example]');
    if(!button) return;
    const {contentNode,contentAll,contentExample,index,example}=button.dataset;
    if(contentNode || contentAll) {
      const kind=contentNode||contentAll, section=data.sections.find(s=>s.id===kind);
      const items=contentNode?[data[kind][Number(index)]]:data[kind];
      openDialog(contentNode?`${section.name} · ${Number(index)+1}`:section.name,`<ol class="content-dialog-list" ${contentNode?`start="${Number(index)+1}"`:''}>${items.map(t=>`<li>${escapeHTML(t)}</li>`).join('')}</ol><h3>分析与建议</h3><p>${section.summary}</p>${note}`,'教学内容 / '+section.name);
      return;
    }
    const group=data[contentExample][Number(index)],record=group.examples[Number(example)];
    const title=contentExample==='features'?group.name:'理论联系实际';
    openDialog(`${title} · 课堂证据`,`<div class="content-evidence-time"><img src="${asset('img')}" width="14" height="14" alt=""><time>${record.time}</time><span>课堂时间点</span></div>${group.knowledge?`<h3>关联知识</h3><p>${group.knowledge}</p>`:''}<h3>课堂记录</h3><p>${record.text}</p>${note}`,'教学内容 / '+title);
  });
}
