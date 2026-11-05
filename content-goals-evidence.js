import {recordingTranscript as transcript} from './recording-transcript-data.js';
import {teachingGoalsVersion} from './content-goals-version.js?v=20261103-evidence';
import {goalsData} from './content-goals-data.js';
const data=structuredClone(goalsData);
data.outline='《智慧医疗创新体验》课程大纲';
data.items=[
{id:'interest',text:'激发同学们对医疗健康的兴趣',category:'素质目标',match:90,requirement:'了解智慧医疗的实际价值，形成关注医疗健康问题的学习兴趣。',reason:'目标与医疗健康兴趣培养相对应，但未明确兴趣表现的观察方式。',suggestion:'结合真实医疗问题设置自主选题或提问环节。'},
{id:'problem',text:'锻炼在场景中发现问题的能力',category:'能力目标',match:85,requirement:'能够在真实医疗场景中识别需求，并提出具有明确对象和约束的问题。',reason:'覆盖场景中的问题发现，尚未说明需求分析成果和问题界定标准。',suggestion:'要求提交场景、使用者需求及问题清单。'},
{id:'interdisciplinary',text:'学习医工交叉的思维方式',category:'能力目标',match:95,requirement:'能够联系医学需求与工程技术，分析技术与问题的适配关系。',reason:'医工交叉思维与大纲要求一致，若补充技术适配分析任务，对应关系更完整。',suggestion:'用同一医疗问题比较两种技术思路。'},
{id:'teamwork',text:'培养跨学科合作与创新的能力',category:'能力目标',match:90,requirement:'能够在跨学科团队中完成创新方案，并说明分工与设计依据。',reason:'覆盖跨学科合作与创新，方案成果和评价要求仍需细化。',suggestion:'明确小组方案、角色分工和创新依据的提交要求。'}
];
data.summary='课件列出4项教学目标，与课程大纲的兴趣培养、问题发现、医工交叉和团队创新要求总体一致。建议补充问题清单、技术适配分析及小组方案等成果标准。点击目标查看实际讲解片段、课件原句与大纲对照。';
import {goalsStyles as baseStyles} from './content-goals-styles.js';
import {goalsGapStyles} from './content-goals-gap-styles.js';
const framePlayerStyles='.goal-frame-controls{display:flex;align-items:center;gap:10px;padding:10px 12px;background:#172234;color:white;border-radius:0 0 8px 8px;font-size:12px}.goal-frame-controls button{border:0;background:transparent;color:white;cursor:pointer;width:24px}.goal-frame-seek{flex:1;min-width:0;accent-color:#1d70f2}.goal-frame-controls span{white-space:nowrap}.goal-media .goal-teacher-frame{border-radius:8px 8px 0 0!important}';
const goalsStyles=baseStyles+goalsGapStyles+framePlayerStyles+'#cg-dialog{width:min(1080px,calc(100vw - 32px));max-width:none}.goal-evidence-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:24px;padding:20px 24px}.goal-asr-title{font-weight:500;color:#25334b}.goal-media{position:relative}.goal-media-label{position:absolute;top:8px;left:8px;z-index:1;background:#172234aa;color:white;padding:2px 6px;font-size:12px;border-radius:4px}.goal-media .goal-teacher-frame{width:100%;aspect-ratio:16/9;background:#172234;display:block;border-radius:8px}.goal-media p{font-size:12px;color:#68788d}.goal-sources{max-height:62vh;overflow:auto;min-width:0}.goal-sources article{padding:12px 0;border-bottom:1px solid #e7edf5}.goal-sources h3,.goal-sources h4{margin:0 0 8px;font-size:14px;line-height:24px}.goal-sources p,.goal-sources blockquote{font-size:13px;line-height:23px;margin:8px 0}.goal-sources img{display:block;width:100%;border-radius:6px}.goal-sources button{border:0;background:#edf4ff;color:#1d70f2;border-radius:4px;padding:5px 8px;cursor:pointer;font:inherit;font-size:12px}.goal-match{color:#52657f}.goal-sources .selected{background:#edf4ff}@media(max-width:740px){.goal-evidence-grid{grid-template-columns:1fr;padding:14px;gap:12px}.goal-sources{max-height:none;overflow:visible}}\n';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountTeachingGoalsEvidence(root){
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
 section.innerHTML=`<div class="section-heading"><h2 id="content-goals-title">教学目标</h2><div class="cg-title"><button type="button" class="cg-score" data-cg-all aria-label="大纲匹配度${total}%，查看全部对照">大纲匹配度 <strong>${total}<small>%</small></strong></button>${help}</div></div><div class="attitude-insight"><img src="./assets/figma/content-img111111.svg" width="16" height="16" alt=""><p>${esc(data.summary)}</p></div><div class="cg-map"><button type="button" class="cg-root" data-cg-all aria-label="查看全部目标与大纲依据">本课目标</button><div class="cg-connect"><svg viewBox="0 0 50 ${height}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cg-gradient"><stop stop-color="#1d70f2"/><stop offset="1" stop-color="#e3edff"/></linearGradient></defs><g fill="none" stroke="url(#cg-gradient)" stroke-width="8">${paths}</g></svg></div><div class="cg-list">${extracted.map(x=>`<button type="button" class="cg-node ${x.missing?'missing':''}" data-cg-id="${x.id}" aria-label="${esc(x.text)}，${'匹配度'+(x.match??0)+'%'}，查看依据"><span>${esc(x.text)}</span><span class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</span></button>`).join('')}</div></div><div class="cg-gaps" ${missing.length?'':'hidden'}><div class="cg-gap-heading"><h3>待补充目标</h3><span>${missing.length}项</span></div>${missing.map(x=>`<button type="button" class="cg-gap-item" data-cg-id="${x.id}"><span>${esc(x.text)}</span><span class="cg-gap-action">查看对照 <span aria-hidden="true">›</span></span></button>`).join('')}</div>`;
 const dialog=document.createElement('dialog');dialog.id='cg-dialog';dialog.setAttribute('aria-labelledby','cg-dialog-title');document.body.append(dialog);
 let trigger,scrollY,previousOverflow;
 function record(x){return `<article class="cg-record" id="cg-record-${x.id}"><h3>${esc(x.text)}</h3><div class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</div><div class="cg-evidence"><div>${x.missing?`<div class="cg-paper"><h4>大纲要求原文</h4><p><mark>${esc(x.requirement)}</mark></p><small>${esc(data.outline)} · 第${x.page}页</small></div><p>本课大纲目标：理解模型评价，并依据评价结果比较模型表现。</p>`:`<div class="cg-paper"><h4>本课学习目标</h4>${data.ppt.map((t,i)=>`<p>${i===x.ppt?'<mark>':''}${i+1}. ${esc(t)}${i===x.ppt?'</mark>':''}</p>`).join('')}</div><small>课件《人工智能导论》 · 第3页 · 02:10–03:05<br>高亮范围：对应目标整句。</small><div class="cg-block"><h4>提取与分类依据</h4><p>目标由课件原文与口述归纳；${x.category==='能力目标'?'协作、创新与表达描述可观察的任务能力。':'发展脉络或技术概念描述学习内容及理解要求。'}</p></div>`}</div><div>${!x.missing?`<div class="cg-block"><h4>教师口述及上下文</h4><small>${x.time} · 教师 · ${x.segment}</small><p>“${esc(x.quote)}”</p><p>${esc(x.context)}</p></div>`:''}<div class="cg-block"><h4>${x.missing?'目标设置核对':'大纲对照'}</h4>${x.requirement&&!x.missing?`<small>${esc(data.outline)} · 第${x.page}页</small><p><mark>${esc(x.requirement)}</mark></p>`:''}<p>${esc(x.reason)}</p>${x.missing?'<small>当前提取的3项目标均未对应此项要求，因此列为待补充目标；这不是课堂漏讲结论。</small>':''}</div><div class="cg-block"><h4>改进建议</h4><p>${esc(x.suggestion)}</p></div></div></div></article>`}
 const asrIndex={interest:[6],problem:[44],interdisciplinary:[3,5],teamwork:[7,2]};
 const pptIndex={interest:0,problem:1,interdisciplinary:2,teamwork:3};
 const pptLines=['激发同学们对医疗健康的兴趣','锻炼在场景中发现问题的能力','学习医工交叉的思维方式','培养跨学科合作与创新的能力'];
 const fmt=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
 const narration={
531:'教师从医生、患者和机构的需求出发，说明智慧医疗与医疗健康的联系。',
1774:'教师引导学生询问医院等机构的实际需求，判断技术是否真正解决问题。',
427:'教师回顾医学发展与医工交叉，说明为什么需要培养创新思维。',
494:'教师结合 MYCIN 和贝叶斯诊断案例，说明技术与医疗问题相结合的思路。',
561:'教师强调了解不同专业背景，说明跨学科团队如何开展合作。',
393:'教师安排行业调研与小组分享，引导学生交流前沿技术和应用思路。'
 };
 const teacherPoster='./assets/goals-teacher-frames/561.jpg';
 const image='./assets/recording-real/1-720.jpg';
 let hls,selectedTime=0;
 function evidence(x){
 const rows=(asrIndex[x.id]||[]).map(i=>transcript[i]).sort((a,b)=>a.time-b.time),match=x.id in pptIndex;
 return `<article id="goal-source-${x.id}"><h3>${esc(x.text)}</h3><div class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</div><h4>ASR 相关讲解 · ${rows.length?'已定位':'当前转写未定位'}</h4>${rows.length?rows.map(row=>`<button type="button" data-seek="${row.time}">▶ ${fmt(row.time)} 查看画面</button><blockquote>${esc(row.text)}</blockquote>`).join(''):'<p>当前转写未定位到对应讲解片段。</p>'}<h4>PPT · ${match?'有对应目标':'当前画面未见对应'}</h4>${match?`<p><mark>${pptLines[pptIndex[x.id]]}</mark></p>`:'<p>当前可核对的目标页未列出这项目标，不能据此判断整份课件没有对应内容。</p>'}<details ${match?'open':''}><summary>教学目标页 · 12:00</summary><img src="${image}" alt="课堂课件教学目标页"><button type="button" data-seek="720">▶ 12:00 查看画面</button><ul>${pptLines.map((line,i)=>`<li>${match&&i===pptIndex[x.id]?`<mark>${line}</mark>`:line}</li>`).join('')}</ul></details><details open><summary>大纲对照</summary><h4>课程大纲要求</h4><p>${esc(x.requirement)}</p><h4>对应分析</h4><p>${esc(x.reason)}</p><p>${esc(x.suggestion)}</p></details></article>`;
 }
 function open(button,id){trigger=button;scrollY=window.scrollY;previousOverflow=document.body.style.overflow;
 const target=data.items.find(x=>x.id===id),row=transcript[asrIndex[id]?.[0]];
 dialog.innerHTML=`<header class="cg-head"><h2 id="cg-dialog-title">教学目标</h2><button type="button" class="cg-close" aria-label="关闭">×</button></header>${target?.missing?`<div class="cg-body">${record(target)}</div>`:`<div class="goal-evidence-grid"><div class="goal-media"><span class="goal-media-label">教师画面</span><img class="goal-teacher-frame" src="${teacherPoster}" alt="教师画面截图"><div class="goal-frame-controls"><button type="button" class="goal-frame-play" aria-label="播放截图序列">▶</button><time class="goal-frame-time">00:00</time><input class="goal-frame-seek" type="range" min="0" max="1774" value="0" step="1" aria-label="定位教师画面"><span>画面回放</span></div><p role="status">点击时间戳或拖动时间轴查看教师画面</p></div><div class="goal-sources">${(target?[target]:extracted).map(evidence).join('')}</div></div>`}`;
 dialog.querySelector('.cg-close').onclick=()=>dialog.close();document.body.style.overflow='hidden';dialog.showModal();
 const frame=dialog.querySelector('.goal-teacher-frame');if(!frame)return;
 const status=dialog.querySelector('[role=status]');
 const times=[393,427,494,531,561,720,1774],slider=dialog.querySelector('.goal-frame-seek'),play=dialog.querySelector('.goal-frame-play');let timer;
 function seek(t){const nearest=times.reduce((a,b)=>Math.abs(b-t)<Math.abs(a-t)?b:a);selectedTime=nearest;frame.src='./assets/goals-teacher-frames/'+nearest+'.jpg';frame.alt='教师画面 · '+fmt(nearest);slider.value=nearest;dialog.querySelector('.goal-frame-time').textContent=fmt(nearest);status.textContent='教师画面 · '+fmt(nearest);}
 slider.onchange=()=>seek(Number(slider.value));
 function stop(){clearInterval(timer);timer=null;play.textContent='▶';play.setAttribute('aria-label','播放截图序列')}
 play.onclick=()=>{if(timer)return stop();play.textContent='Ⅱ';play.setAttribute('aria-label','暂停截图序列');timer=setInterval(()=>{const next=times.find(t=>t>selectedTime);if(next===undefined)return stop();seek(next)},2000)};
 dialog.addEventListener('close',stop,{once:true});

 dialog.querySelectorAll('[data-seek]').forEach(b=>b.onclick=()=>{dialog.querySelector('.selected')?.classList.remove('selected');b.classList.add('selected');seek(Number(b.dataset.seek));});
 if(row){dialog.querySelector(`[data-seek="${row.time}"]`).classList.add('selected');seek(row.time)}
 }
 section.addEventListener('click',e=>{const b=e.target.closest('[data-cg-id],[data-cg-all]');if(b){e.stopPropagation();open(b,b.dataset.cgId)}});
 dialog.addEventListener('close',()=>{dialog.querySelector('video')?.pause();hls?.destroy();hls=null;document.body.style.overflow=previousOverflow;window.scrollTo(0,scrollY);trigger?.focus({preventScroll:true});});
}
