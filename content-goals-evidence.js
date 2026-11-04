import {recordingTranscript as transcript} from './recording-transcript-data.js';
import {teachingGoalsVersion} from './content-goals-version.js?v=20261103-evidence';
import {goalsData} from './content-goals-data.js';
const data=structuredClone(goalsData);
data.summary='课堂口述与课件均提供目标线索。跨学科协作在两类来源中都有体现；人工智能发展脉络在口述中有对应，当前课件截图未明确列出。点击目标查看两类证据。';
const gap=data.items.find(x=>x.missing);gap.reason='本课大纲要求包含模型评价与比较，但当前提取的教学目标中未找到对应表述。这里判断的是目标设置，不据此认定课堂未讲授。';gap.suggestion='在本课教学目标中补充模型评价与比较要求，明确学生需要完成的任务。';
import {goalsStyles as baseStyles} from './content-goals-styles.js';
import {goalsGapStyles} from './content-goals-gap-styles.js';
const goalsStyles=baseStyles+goalsGapStyles+'#cg-dialog{width:min(1080px,calc(100vw - 32px));max-width:none}.goal-evidence-grid{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:24px;padding:20px 24px}.goal-media video{width:100%;aspect-ratio:16/9;background:#172234;display:block;border-radius:8px}.goal-media p{font-size:12px;color:#68788d}.goal-sources{max-height:62vh;overflow:auto;min-width:0}.goal-sources article{padding:12px 0;border-bottom:1px solid #e7edf5}.goal-sources h3,.goal-sources h4{margin:0 0 8px;font-size:14px;line-height:24px}.goal-sources p,.goal-sources blockquote{font-size:13px;line-height:23px;margin:8px 0}.goal-sources img{display:block;width:100%;border-radius:6px}.goal-sources button{border:0;background:#edf4ff;color:#1d70f2;border-radius:4px;padding:5px 8px;cursor:pointer;font:inherit;font-size:12px}.goal-match{color:#52657f}.goal-sources .selected{background:#edf4ff}@media(max-width:740px){.goal-evidence-grid{grid-template-columns:1fr;padding:14px;gap:12px}.goal-sources{max-height:none;overflow:visible}}\n';
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
 section.innerHTML=`<div class="section-heading"><h2 id="content-goals-title">教学目标</h2><div class="cg-title"><button type="button" class="cg-score" data-cg-all aria-label="大纲匹配度${total}%，查看全部对照">大纲匹配度 <strong>${total}<small>%</small></strong></button>${help}</div></div><div class="attitude-insight"><img src="./assets/figma/content-img111111.svg" width="16" height="16" alt=""><p>${esc(data.summary)}</p></div><div class="cg-map"><button type="button" class="cg-root" data-cg-all aria-label="查看全部目标与大纲依据">本课目标</button><div class="cg-connect"><svg viewBox="0 0 50 ${height}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cg-gradient"><stop stop-color="#1d70f2"/><stop offset="1" stop-color="#e3edff"/></linearGradient></defs><g fill="none" stroke="url(#cg-gradient)" stroke-width="8">${paths}</g></svg></div><div class="cg-list">${extracted.map(x=>`<button type="button" class="cg-node ${x.missing?'missing':''}" data-cg-id="${x.id}" aria-label="${esc(x.text)}，${'匹配度'+(x.match??0)+'%'}，查看依据"><span>${esc(x.text)}</span><span class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</span></button>`).join('')}</div></div><div class="cg-gaps"><div class="cg-gap-heading"><h3>待补充目标</h3><span>${missing.length}项</span></div>${missing.map(x=>`<button type="button" class="cg-gap-item" data-cg-id="${x.id}"><span>${esc(x.text)}</span><span class="cg-gap-action">查看对照 <span aria-hidden="true">›</span></span></button>`).join('')}</div>`;
 const dialog=document.createElement('dialog');dialog.id='cg-dialog';dialog.setAttribute('aria-labelledby','cg-dialog-title');document.body.append(dialog);
 let trigger,scrollY,previousOverflow;
 function record(x){return `<article class="cg-record" id="cg-record-${x.id}"><h3>${esc(x.text)}</h3><div class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</div><div class="cg-evidence"><div>${x.missing?`<div class="cg-paper"><h4>大纲要求原文</h4><p><mark>${esc(x.requirement)}</mark></p><small>${esc(data.outline)} · 第${x.page}页</small></div><p>本课大纲目标：理解模型评价，并依据评价结果比较模型表现。</p>`:`<div class="cg-paper"><h4>本课学习目标</h4>${data.ppt.map((t,i)=>`<p>${i===x.ppt?'<mark>':''}${i+1}. ${esc(t)}${i===x.ppt?'</mark>':''}</p>`).join('')}</div><small>课件《人工智能导论》 · 第3页 · 02:10–03:05<br>高亮范围：对应目标整句。</small><div class="cg-block"><h4>提取与分类依据</h4><p>目标由课件原文与口述归纳；${x.category==='能力目标'?'协作、创新与表达描述可观察的任务能力。':'发展脉络或技术概念描述学习内容及理解要求。'}</p></div>`}</div><div>${!x.missing?`<div class="cg-block"><h4>教师口述及上下文</h4><small>${x.time} · 教师 · ${x.segment}</small><p>“${esc(x.quote)}”</p><p>${esc(x.context)}</p></div>`:''}<div class="cg-block"><h4>${x.missing?'目标设置核对':'大纲对照'}</h4>${x.requirement&&!x.missing?`<small>${esc(data.outline)} · 第${x.page}页</small><p><mark>${esc(x.requirement)}</mark></p>`:''}<p>${esc(x.reason)}</p>${x.missing?'<small>当前提取的3项目标均未对应此项要求，因此列为待补充目标；这不是课堂漏讲结论。</small>':''}</div><div class="cg-block"><h4>改进建议</h4><p>${esc(x.suggestion)}</p></div></div></div></article>`}
 const asrIndex={history:[1],teamwork:[7]};
 const pptIndex={teamwork:3};
 const pptLines=['激发同学们对医疗健康的兴趣','锻炼在场景中发现问题的能力','学习医工交叉的思维方式','培养跨学科合作与创新的能力'];
 const fmt=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
 const image='./assets/recording-real/1-720.jpg';
 let hls,selectedTime=0;
 function evidence(x){
 const rows=(asrIndex[x.id]||[]).map(i=>transcript[i]).sort((a,b)=>a.time-b.time),match=x.id in pptIndex;
 return `<article id="goal-source-${x.id}"><h3>${esc(x.text)}</h3><div class="cg-meta"><span class="cg-category">${x.category}</span>${result(x)}</div><h4>ASR 口述 · ${rows.length?'有对应口述':'当前转写未定位'}</h4>${rows.length?rows.map(row=>`<button type="button" data-seek="${row.time}">▶ ${fmt(row.time)} 查看录像时间</button><blockquote>${esc(row.text)}</blockquote>`).join(''):'<p>当前转写未定位到对应讲解片段。</p>'}<h4>PPT · ${match?'有对应目标':'当前画面未见对应'}</h4>${match?`<p><mark>${pptLines[pptIndex[x.id]]}</mark></p>`:'<p>当前可核对的目标页未列出这项目标，不能据此判断整份课件没有对应内容。</p>'}<details ${match?'open':''}><summary>教学目标页 · 12:00</summary><img src="${image}" alt="课堂课件教学目标页"><button type="button" data-seek="720">▶ 12:00 查看录像时间</button><ul>${pptLines.map((line,i)=>`<li>${match&&i===pptIndex[x.id]?`<mark>${line}</mark>`:line}</li>`).join('')}</ul></details><details><summary>大纲对照</summary><p>${esc(x.reason)}</p><p>${esc(x.suggestion)}</p></details></article>`;
 }
 function open(button,id){trigger=button;scrollY=window.scrollY;previousOverflow=document.body.style.overflow;
 const target=data.items.find(x=>x.id===id),row=transcript[asrIndex[id]?.[0]];
 dialog.innerHTML=`<header class="cg-head"><h2 id="cg-dialog-title">教学目标</h2><button type="button" class="cg-close" aria-label="关闭">×</button></header>${target?.missing?`<div class="cg-body">${record(target)}</div>`:`<div class="goal-evidence-grid"><div class="goal-media"><video playsinline preload="auto" poster="${image}" aria-label="本课录像"></video><p role="status">完整录像仅在本地报告可播放</p></div><div class="goal-sources">${(target?[target]:extracted).map(evidence).join('')}</div></div>`}`;
 dialog.querySelector('.cg-close').onclick=()=>dialog.close();document.body.style.overflow='hidden';dialog.showModal();
 const video=dialog.querySelector('video');if(!video)return;
 const status=dialog.querySelector('[role=status]'),src='./assets/recording-video-web/master.m3u8';let attached=false;
 function seek(t){selectedTime=t;status.textContent='录像定位至 '+fmt(t);status.textContent='对应录像时间 '+fmt(t)+' · 完整录像仅在本地报告可播放';return;
 const fail=()=>{status.textContent='录像暂不可播放，目标原文和课件画面仍可查看。';attached=false};
 video.addEventListener('loadedmetadata',()=>{video.currentTime=selectedTime},{once:true});video.addEventListener('error',fail,{once:true});
 if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=src;return}
 const attach=()=>{if(!dialog.open||!video.isConnected)return;if(!window.Hls?.isSupported())return fail();hls=new window.Hls({startPosition:selectedTime});hls.attachMedia(video);hls.loadSource(src);hls.on(window.Hls.Events.ERROR,(_e,d)=>{if(d.fatal)fail()})};
 if(window.Hls)attach();else{const script=document.createElement('script');script.src='./assets/vendor/hls-1.5.20.min.js';script.onload=attach;script.onerror=fail;document.head.append(script)}
 }
 dialog.querySelectorAll('[data-seek]').forEach(b=>b.onclick=()=>{dialog.querySelector('.selected')?.classList.remove('selected');b.classList.add('selected');seek(Number(b.dataset.seek));});
 if(row){dialog.querySelector(`[data-seek="${row.time}"]`).classList.add('selected');seek(row.time)}
 }
 section.addEventListener('click',e=>{const b=e.target.closest('[data-cg-id],[data-cg-all]');if(b){e.stopPropagation();open(b,b.dataset.cgId)}});
 dialog.addEventListener('close',()=>{dialog.querySelector('video')?.pause();hls?.destroy();hls=null;document.body.style.overflow=previousOverflow;window.scrollTo(0,scrollY);trigger?.focus({preventScroll:true});});
}
