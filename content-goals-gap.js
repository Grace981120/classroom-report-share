import {teachingGoalsVersion} from './content-goals-version.js?v=20261102-goals-gap';
import {goalsData} from './content-goals-data.js';
const data=structuredClone(goalsData);
data.summary='已提取3项目标，发展脉络与大纲较一致，协作目标需细化成果标准；另有1项本课大纲目标待补充，建议补充模型评价与比较的目标表述。';
const gap=data.items.find(x=>x.missing);gap.reason='本课大纲要求包含模型评价与比较，但当前提取的教学目标中未找到对应表述。这里判断的是目标设置，不据此认定课堂未讲授。';gap.suggestion='在本课教学目标中补充模型评价与比较要求，明确学生需要完成的任务。';
import {goalsStyles as baseStyles} from './content-goals-styles.js';
import {goalsGapStyles} from './content-goals-gap-styles.js';
const goalsStyles=baseStyles+goalsGapStyles;
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountTeachingGoalsGap(root){
 if(teachingGoalsVersion==='baseline')return;
 const section=root.querySelector('#content-goals');if(!section||section.dataset.goalsVersion)return;
 section.dataset.goalsVersion=teachingGoalsVersion;
 const style=document.createElement('style');style.textContent=goalsStyles;document.head.append(style);
 const requirements=data.items.filter(x=>x.match!==null), total=Math.round(requirements.reduce((s,x)=>s+x.match,0)/requirements.length);
 const result=x=>`<span class="cg-match">大纲匹配度 <b>${x.match??0}%</b></span>`;
 const help=`<span class="cg-help-wrap"><button class="cg-help" type="button" aria-label="大纲匹配度定义" aria-describedby="cg-definition">?</button><span class="cg-tip" id="cg-definition" role="tooltip">核对本课提取目标与本课大纲要求的对应程度。大纲要求缺少对应目标时计0%；额外目标单项显示0%，不抵消缺项。目标表述缺项不等于课堂未讲授，也不代表学生未掌握。</span></span>`;
 const extracted=data.items.filter(x=>!x.missing),missing=data.items.filter(x=>x.missing);
 const height=extracted.length*88-12, center=height/2;
 const paths=extracted.map((_,i)=>`<path d="M0 ${center} C28 ${center} 22 ${i*88+38} 50 ${i*88+38}"/>`).join('');
 section.innerHTML=`<div class="section-heading"><h2 id="content-goals-title">教学目标</h2><div class="cg-title"><button type="button" class="cg-score" data-cg-all aria-label="大纲匹配度${total}%，查看全部对照">大纲匹配度 <strong>${total}<small>%</small></strong></button>${help}</div></div><div class="attitude-insight"><img src="assets/figma/content-img111111.svg" width="16" height="16" alt=""><p>${esc(data.summary)}</p></div><div class="cg-map"><button type="button" class="cg-root" data-cg-all aria-label="查看全部目标与大纲依据">本课目标</button><div class="cg-connect"><svg viewBox="0 0 50 ${height}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cg-gradient"><stop stop-color="#1d70f2"/><stop offset="1" stop-color="#e3edff"/></linearGradient></defs><g fill="none" stroke="url(#cg-gradient)" stroke-width="8">${paths}</g></svg></div><div class="cg-list">${extracted.map(x=>`<button type="button" class="cg-node ${x.missing?'missing':''}" data-cg-id="${x.id}" aria-label="${esc(x.text)}，${'匹配度'+(x.match??0)+'%'}，查看依据"><span>${esc(x.text)}</span><span class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</span></button>`).join('')}</div></div><div class="cg-gaps"><div class="cg-gap-heading"><h3>待补充目标</h3><span>${missing.length}项</span></div>${missing.map(x=>`<button type="button" class="cg-gap-item" data-cg-id="${x.id}"><span>${esc(x.text)}</span><span class="cg-gap-action">查看对照 <span aria-hidden="true">›</span></span></button>`).join('')}</div>`;
 const dialog=document.createElement('dialog');dialog.id='cg-dialog';dialog.setAttribute('aria-labelledby','cg-dialog-title');document.body.append(dialog);
 let trigger,scrollY,previousOverflow;
 function record(x){return `<article class="cg-record" id="cg-record-${x.id}"><h3>${esc(x.text)}</h3><div class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</div><div class="cg-evidence"><div>${x.missing?`<div class="cg-paper"><h4>大纲要求原文</h4><p><mark>${esc(x.requirement)}</mark></p><small>${esc(data.outline)} · 第${x.page}页</small></div><p>本课大纲目标：理解模型评价，并依据评价结果比较模型表现。</p>`:`<div class="cg-paper"><h4>本课学习目标</h4>${data.ppt.map((t,i)=>`<p>${i===x.ppt?'<mark>':''}${i+1}. ${esc(t)}${i===x.ppt?'</mark>':''}</p>`).join('')}</div><small>课件《人工智能导论》 · 第3页 · 02:10–03:05<br>高亮范围：对应目标整句。</small><div class="cg-block"><h4>提取与分类依据</h4><p>目标由课件原文与口述归纳；${x.category==='能力目标'?'协作、创新与表达描述可观察的任务能力。':'发展脉络或技术概念描述学习内容及理解要求。'}</p></div>`}</div><div>${!x.missing?`<div class="cg-block"><h4>教师口述及上下文</h4><small>${x.time} · 教师 · ${x.segment}</small><p>“${esc(x.quote)}”</p><p>${esc(x.context)}</p></div>`:''}<div class="cg-block"><h4>${x.missing?'目标设置核对':'大纲对照'}</h4>${x.requirement&&!x.missing?`<small>${esc(data.outline)} · 第${x.page}页</small><p><mark>${esc(x.requirement)}</mark></p>`:''}<p>${esc(x.reason)}</p>${x.missing?'<small>当前提取的3项目标均未对应此项要求，因此列为待补充目标；这不是课堂漏讲结论。</small>':''}</div><div class="cg-block"><h4>改进建议</h4><p>${esc(x.suggestion)}</p></div></div></div></article>`}
 function open(button,id){trigger=button;scrollY=window.scrollY;previousOverflow=document.body.style.overflow;
 dialog.innerHTML=`<header class="cg-head"><h2 id="cg-dialog-title">教学目标与大纲对照</h2><button type="button" class="cg-close" aria-label="关闭">×</button></header><div class="cg-body"><div class="cg-note"><strong>大纲匹配度 ${total}%</strong><p>${esc(data.outline)} · ${esc(data.scope)}</p><p>本课3项大纲要求等权：（95%＋70%＋0%）÷3＝55%。待补充目标计0%；大纲外目标不抵消缺项。</p><small>单项分值依据内容与要求的语义对应判断，不按关键词数量或学生达成率计算。</small></div>${data.items.map(record).join('')}</div>`;
 dialog.querySelector('.cg-close').onclick=()=>dialog.close();document.body.style.overflow='hidden';dialog.showModal();dialog.scrollTop=0;
 if(id)requestAnimationFrame(()=>{const target=dialog.querySelector('#cg-record-'+id);target.classList.add('active');target.scrollIntoView({block:'start'});});
 }
 section.addEventListener('click',e=>{const b=e.target.closest('[data-cg-id],[data-cg-all]');if(b){e.stopPropagation();open(b,b.dataset.cgId)}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;window.scrollTo(0,scrollY);trigger?.focus({preventScroll:true});});
}
