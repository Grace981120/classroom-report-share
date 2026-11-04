import {indicatorEvidence as evidence} from './new-indicator-report-data.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const methods=[
 {name:'启发式教学',summary:'从问题出发，引导学生比较方法、分析原因。',basis:'教师由历史起落引出原因问题，再比较知识与数据两种表达方式的局限和资源条件，体现由问题到分析的推进。',rows:[{key:'inquiry',text:'提出问题：人工智能为何经历“三起两落”'},{key:'comparison',text:'比较分析：两类方法的局限与适用条件'}]},
 {name:'案例教学',summary:'借助医疗案例，说明知识在实际情境中的应用。',basis:'原话引用霍乱统计、MYCIN和贝叶斯诊断等已学案例，并联系医疗行业需求；这里呈现案例的使用环节，不由案例出现直接认定完整案例研讨。',rows:[{key:'prior',text:'引入案例：引用医疗案例说明技术与问题的关系'},{key:'profession',text:'联系应用：结合医院与养老机构的实际需求'}]},
 {name:'任务驱动教学',summary:'围绕具体任务形成小组方案，再通过同伴互评完善思路。',basis:'教师要求明确服务对象、问题、数据与预期结果；学生提出导诊方案，再按需求、理由与数据条件组织互评，对应任务提出、方案形成与评价反馈三个环节。',rows:[{key:'practice',record:0,text:'提出任务：围绕医疗场景明确方案要求'},{key:'practice',record:1,text:'形成方案：小组提出导诊场景的方法选择'},{key:'practice',record:2,text:'组织互评：按三项标准评价并提出修改建议'}]}
];
const rowTime=r=>r.record===undefined?evidence[r.key].time:evidence[r.key].records[r.record].time;
export function mountTeachingMethods(root){
 if(!root||root.querySelector('#method-style'))return;
 const section=document.createElement('section');section.id='method-style';section.className='card section';section.setAttribute('aria-labelledby','method-style-title');
 section.innerHTML='<div class="section-heading"><h2>教学方法 <span class="tm-help"><button aria-label="教学方法定义">?</button><span role="tooltip">识别教师组织课堂学习采用的教学方法，结合提问、讲解、学习任务、学生产出与反馈判断。方法可以并用；出现案例、合作或任务用语，不直接等于完整实施案例、项目或任务驱动教学。</span></span></h2></div><div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>教师通过问题引入与比较分析启发思考，借医疗案例联系应用，并以任务提出、方案形成和同伴互评组织学习。</p></div><div class="content-feature-grid tm-methods"></div><dialog id="tm-evidence" aria-labelledby="tm-title"><header><h2 id="tm-title"></h2><button type="button" class="close" aria-label="关闭">×</button></header><div class="tm-body"></div></dialog>';
 section.querySelector('h2').id='method-style-title';
 root.querySelector('#method-language').after(section);
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('./method-methods.css?v=20261102-methods3',import.meta.url).href;document.head.append(sheet);
section.querySelector('.tm-methods').innerHTML=methods.map((m,i)=>`<article class="content-detail-card"><div class="tm-card-head"><h3>${m.name}</h3>${m.status?`<span>${m.status}</span>`:''}</div><p class="tm-summary">${m.summary}</p><div class="content-examples">${m.rows.map((r,j)=>`<button type="button" class="content-example" data-method="${i}" data-row="${j}" aria-label="${time(rowTime(r))}，${r.text}，查看原文"><span class="content-time"><img src="assets/figma/content-img.svg" width="14" height="14" alt=""><time>${time(rowTime(r))}</time></span><span>${r.text}</span></button>`).join('')}</div></article>`).join('');
const dialog=section.querySelector('#tm-evidence');let origin,scroll,overflow;
function open(button,m,row){origin=button;scroll={x:scrollX,y:scrollY};overflow=document.body.style.overflow;dialog.querySelector('#tm-title').textContent=m.name;const keys=[...new Set(m.rows.map(r=>r.key))];const records=keys.flatMap(key=>evidence[key].records.map(record=>({...record,key})));const seen=new Set();dialog.querySelector('.tm-body').innerHTML=`<p class="tm-verdict">${m.basis}</p>${records.filter(r=>{const id=r.time+'|'+r.text;if(seen.has(id))return false;seen.add(id);return true}).map(r=>`<article class="tm-source ${r.key===row?.key&&(row.record===undefined||r.time===rowTime(row))?'selected':''}" tabindex="-1"><small>${time(r.time)} · ${esc(r.speaker)}</small><blockquote>${esc(r.text)}</blockquote><details><summary>识别依据</summary><p>${esc(evidence[r.key].basis)}</p></details></article>`).join('')}`;document.body.style.overflow='hidden';dialog.showModal();dialog.scrollTop=0;dialog.querySelector('.selected')?.scrollIntoView({block:'nearest'});}
section.querySelector('.tm-methods').addEventListener('click',e=>{const button=e.target.closest('[data-method]');if(!button)return;const m=methods[Number(button.dataset.method)];open(button,m,m.rows[Number(button.dataset.row)]);});
dialog.querySelector('.close').onclick=()=>dialog.close();dialog.addEventListener('close',()=>{document.body.style.overflow=overflow;origin?.focus({preventScroll:true});window.scrollTo({left:scroll.x,top:scroll.y,behavior:'instant'});});

}
