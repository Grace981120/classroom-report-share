import {mountTeachingGoalsEvidence} from './content-goals-evidence.js';
import {mountTeachingGoalsGap} from './content-goals-gap.js?v=20261102-goals-gap';
import {teachingGoalsVersion} from './content-goals-version.js?v=20261103-evidence';
import {goalsData as data} from './content-goals-data.js';
import {goalsStyles} from './content-goals-styles.js';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountTeachingGoals(root){
 if(teachingGoalsVersion==='baseline')return;
 if(teachingGoalsVersion==='1.9')return mountTeachingGoalsEvidence(root);
 if(teachingGoalsVersion==='1.8')return mountTeachingGoalsGap(root);
 const section=root.querySelector('#content-goals');if(!section||section.dataset.goalsVersion)return;
 section.dataset.goalsVersion=teachingGoalsVersion;
 const style=document.createElement('style');style.textContent=goalsStyles;document.head.append(style);
 const requirements=data.items.filter(x=>x.match!==null), total=Math.round(requirements.reduce((s,x)=>s+x.match,0)/requirements.length);
 const result=x=>x.missing?'<span class="cg-missing">未覆盖</span>':x.match===null?'<span class="cg-neutral">无对应</span>':`<span class="cg-match">大纲匹配度 <b>${x.match}%</b></span>`;
 const help=`<span class="cg-help-wrap"><button class="cg-help" type="button" aria-label="大纲匹配度定义" aria-describedby="cg-definition">?</button><span class="cg-tip" id="cg-definition" role="tooltip">以本课教学计划对应的大纲要求为范围，按条目匹配程度等权汇总；未覆盖要求纳入计算，拓展内容不抵消遗漏。此指标不代表学生学习达成。</span></span>`;
 const height=data.items.length*88-12, center=height/2;
 const paths=data.items.map((_,i)=>`<path d="M0 ${center} C28 ${center} 22 ${i*88+38} 50 ${i*88+38}"/>`).join('');
 section.innerHTML=`<div class="section-heading"><h2 id="content-goals-title">教学目标</h2><div class="cg-title"><button type="button" class="cg-score" data-cg-all aria-label="大纲匹配度${total}%，查看全部对照">大纲匹配度 <strong>${total}<small>%</small></strong></button>${help}</div></div><div class="attitude-insight"><img src="assets/figma/content-img111111.svg" width="16" height="16" alt=""><p>${esc(data.summary)}</p></div><div class="cg-map"><button type="button" class="cg-root" data-cg-all aria-label="查看全部目标与大纲依据">目标</button><div class="cg-connect"><svg viewBox="0 0 50 ${height}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cg-gradient"><stop stop-color="#1d70f2"/><stop offset="1" stop-color="#e3edff"/></linearGradient></defs><g fill="none" stroke="url(#cg-gradient)" stroke-width="8">${paths}</g></svg></div><div class="cg-list">${data.items.map(x=>`<button type="button" class="cg-node ${x.missing?'missing':''}" data-cg-id="${x.id}" aria-label="${esc(x.text)}，${x.missing?'未覆盖':x.match===null?'无对应':'匹配度'+x.match+'%'}，查看依据"><span>${esc(x.text)}</span><span class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</span></button>`).join('')}</div></div>`;
 const dialog=document.createElement('dialog');dialog.id='cg-dialog';dialog.setAttribute('aria-labelledby','cg-dialog-title');document.body.append(dialog);
 let trigger,scrollY,previousOverflow;
 function record(x){return `<article class="cg-record" id="cg-record-${x.id}"><h3>${esc(x.text)}</h3><div class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</div><div class="cg-evidence"><div>${x.missing?`<div class="cg-paper"><h4>大纲要求原文</h4><p><mark>${esc(x.requirement)}</mark></p><small>${esc(data.outline)} · 第${x.page}页</small></div><p>本课计划：模型评价讲解与练习。</p>`:`<div class="cg-paper"><h4>本课学习目标</h4>${data.ppt.map((t,i)=>`<p>${i===x.ppt?'<mark>':''}${i+1}. ${esc(t)}${i===x.ppt?'</mark>':''}</p>`).join('')}</div><small>课件《人工智能导论》 · 第3页 · 02:10–03:05<br>高亮范围：对应目标整句。</small><div class="cg-block"><h4>提取与分类依据</h4><p>目标由课件原文与口述归纳；${x.category==='能力目标'?'协作、创新与表达描述可观察的任务能力。':'发展脉络或技术概念描述学习内容及理解要求。'}</p></div>`}</div><div>${!x.missing?`<div class="cg-block"><h4>教师口述及上下文</h4><small>${x.time} · 教师 · ${x.segment}</small><p>“${esc(x.quote)}”</p><p>${esc(x.context)}</p></div>`:''}<div class="cg-block"><h4>${x.missing?'课堂覆盖核对':'大纲对照'}</h4>${x.requirement&&!x.missing?`<small>${esc(data.outline)} · 第${x.page}页</small><p><mark>${esc(x.requirement)}</mark></p>`:''}<p>${esc(x.reason)}</p>${x.missing?'<small>核对范围：本课完整转写与课件记录00:00–130:00；不是只依据目标页未出现。若记录不完整，应改为“未见课堂证据”。</small>':''}</div><div class="cg-block"><h4>改进建议</h4><p>${esc(x.suggestion)}</p></div></div></div></article>`}
 function open(button,id){trigger=button;scrollY=window.scrollY;previousOverflow=document.body.style.overflow;
 dialog.innerHTML=`<header class="cg-head"><h2 id="cg-dialog-title">教学目标与大纲对照</h2><button type="button" class="cg-close" aria-label="关闭">×</button></header><div class="cg-body"><div class="cg-note"><strong>大纲匹配度 ${total}%</strong><p>${esc(data.outline)} · ${esc(data.scope)}</p><p>本课3项大纲要求等权：（95%＋70%＋0%）÷3＝55%。课堂额外目标不抵消遗漏。</p><small>单项分值依据内容与要求的语义对应判断，不按关键词数量或学生达成率计算。</small></div>${data.items.map(record).join('')}</div>`;
 dialog.querySelector('.cg-close').onclick=()=>dialog.close();document.body.style.overflow='hidden';dialog.showModal();dialog.scrollTop=0;
 if(id)requestAnimationFrame(()=>{const target=dialog.querySelector('#cg-record-'+id);target.classList.add('active');target.scrollIntoView({block:'start'});});
 }
 section.addEventListener('click',e=>{const b=e.target.closest('[data-cg-id],[data-cg-all]');if(b){e.stopPropagation();open(b,b.dataset.cgId)}});
 dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;window.scrollTo(0,scrollY);trigger?.focus({preventScroll:true});});
}
