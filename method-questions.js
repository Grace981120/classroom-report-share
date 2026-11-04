import {mountQuestions109} from './method-questions-v109.js?v=20261102-questions109';
import {methodData as originalMethodData,methodTime,methodDuration,rowDuration} from './method-data.js';
import {questionData,bloomLabels,matLabels,levelLabels,levelNotes,feedbackLabels,strategyLabels,summarize} from './method-questions-data.js';
import {questionStyles} from './method-questions-styles.js';
import {teachingQuestionsVersion} from './method-questions-version.js?v=20261102-questions109';
import {mountQuestions108} from './method-questions-v108.js?v=20260912-5';
import {donutSegmentAttributes} from './attitude.js';
const colors=['#1d70f2','#00cc7e','#e545d2','#ff7626','#ffb743','#19abea'];
const soloColors=colors;
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=v=>{v=Math.floor(v);return [Math.floor(v/3600),Math.floor(v/60)%60,v%60].map(n=>String(n).padStart(2,'0')).join(':');};
const duration=v=>`${Math.floor(v/60)}分${Math.round(v%60)}秒`;
const pct=(v,total)=>total?Math.round(v/total*1000)/10:0;
const empty=(title,body)=>`<div class="mq-empty"><strong>${esc(title)}</strong>${esc(body)}</div>`;
const tags=arr=>`<span class="mq-tags">${arr.filter(Boolean).map(x=>`<span>${esc(x)}</span>`).join('')}</span>`;
const btn=(attr,label,cls='mq-link')=>`<button type="button" class="${cls}" ${attr}>${label}</button>`;
// Mount returns a disposer for precise restoration; it never edits siblings, navigation or shared data.
export function mountTeachingQuestions(root,model=questionData,{force=false}={}){
 if(teachingQuestionsVersion==='1.0.9')return mountQuestions109(root,model);
 if(teachingQuestionsVersion==='1.0.8')return mountQuestions108(root,model);
 if(!root||(!force&&teachingQuestionsVersion==='baseline'))return ()=>{};
 const original=root.innerHTML;const stats=summarize(model);let mode='bloom',filter={kind:'all',value:''},page=0,selected=null,highlight=null;
 let previousTrigger=null,listOrigin=null,listScroll=0;const controller=new AbortController();const size=4;
 const answers=q=>model.answerStatus==='available'?q.turns.filter(t=>t.kind==='answer'):[];
 const follows=q=>model.followupStatus==='available'?q.turns.filter(t=>t.kind==='followup'):[];
 const visibleTurns=q=>q.turns.filter(t=>(model.answerStatus==='available'||t.kind!=='answer')&&(model.followupStatus==='available'||t.kind!=='followup'));
 function matches(q){const {kind,value}=filter;
  if(kind==='all')return true;if(kind==='responded')return answers(q).length>0;if(kind==='followed')return follows(q).length>0;
  if(kind==='bloom'||kind==='mat')return q[kind]===value;
  if(kind==='levels')return answers(q).some(t=>t.level===value);
  if(kind==='strategies')return follows(q).some(t=>t.strategies.includes(value));
  if(kind==='feedback')return q.turns.some(t=>t.feedback===value);
  if(kind==='waits'){const a=answers(q)[0];if(!a)return false;const n=a.start-q.turns[0].end;return Number(value)===(n<=3?0:n<=5?1:2);}
  if(kind==='durations')return answers(q).some(t=>Number(value)===(t.end-t.start<=5?0:t.end-t.start<=15?1:2));return true;
 }
 function chartAction(kind,value){return `data-mq-filter="${kind}" data-value="${esc(value)}"`;}
 function donut(kind,labels,values,small=false,palette=colors){
  if(values===null)return empty('暂无法分析','缺少可分析的学生发言或课堂资料。');
  const total=values.reduce((a,b)=>a+b,0);if(!total)return empty('未识别到相关记录','已分析范围内暂无对应事件，可查看核心提问。');
  let start=0;const paths=values.map((n,i)=>{const val=n/total*100;const label=`${labels[i]} ${n}次，占${pct(n,total)}%，筛选问题`;const attrs=donutSegmentAttributes(start,Math.max(0,val-.8),220,60,43);const a=(start+val/2)*Math.PI/50-Math.PI/2;start+=val;return n?`<path ${attrs} fill="${palette[i]}" tabindex="0" role="button" ${chartAction(kind,kind==='waits'||kind==='durations'?i:labels[i])} aria-label="${esc(label)}"><title>${esc(label)}</title></path>${`<text x="${110+Math.cos(a)*84}" y="${84+Math.sin(a)*76}" text-anchor="middle">${pct(n,total)}%</text>`}`:'';}).join('');
  const legend=`<div class="mq-legend">${labels.map((label,i)=>btn(chartAction(kind,kind==='waits'||kind==='durations'?i:label),`<i style="background:${palette[i]}"></i>${esc(label)}`, '')).join('')}</div>`;
  const svg=`<div class="mq-donut"><svg viewBox="0 0 220 180" role="group" aria-label="${esc(kind==='levels'?'回答建构分类':labels.join('、'))}">${paths}</svg></div>`;
  return small?`<div class="mq-solo">${svg}${legend}</div>`:svg+legend;
 }
 function classification(){const labels=mode==='bloom'?bloomLabels:matLabels,values=stats[mode];const max=Math.max(1,...values);
  return `<div class="mq-chart-title"><h3>提问分类</h3><div class="mq-tabs" role="tablist" aria-label="提问分类方式">${[['bloom','布鲁姆分类'],['mat','4MAT模式']].map(([id,label])=>`<button type="button" id="mq-tab-${id}" role="tab" data-mq-mode="${id}" aria-selected="${id===mode}" aria-controls="mq-classifications" tabindex="${id===mode?0:-1}">${label}</button>`).join('')}</div></div><div id="mq-classifications" role="tabpanel" aria-labelledby="mq-tab-${mode}"><div class="mq-classification-groups">${mode==='bloom'?`<span>初阶（${stats.bloom.slice(0,3).reduce((a,b)=>a+b,0)}次）</span><span>高阶（${stats.bloom.slice(3).reduce((a,b)=>a+b,0)}次）</span>`:'<span>四类提问</span>'}</div><div class="mq-bars">${labels.map((n,i)=>btn(chartAction(mode,n),`<span>${values[i]}次</span><i style="height:${values[i]/max*115}px;background:${colors[i]}"></i><small>${n}</small>`,'')).join('')}</div></div>`;
 }
 function timeline(){return `<div class="mq-list-head"><h3>教学时序图</h3></div><div class="method-timeline-scroll" tabindex="0" role="group" aria-label="教学时序图，窄屏可横向滚动"><div class="method-timeline">${originalMethodData.questionTimeline.map((r,rowIndex)=>`<div class="method-timeline-row"><span class="method-row-name">${r.name}</span><div class="method-track"><span class="method-break" style="left:45%;width:10%" title="未分析片段"></span>${r.segments.map(([a,b],segmentIndex)=>`<button type="button" data-mq-segment="${rowIndex}" data-index="${segmentIndex}" aria-label="${r.name} ${methodTime(a)}至${methodTime(b)}，查看片段" class="mq-original-segment" style="left:${a/originalMethodData.duration*100}%;width:${(b-a)/originalMethodData.duration*100}%;background:${r.color}" title="${r.name} · ${methodTime(a)}–${methodTime(b)}"></button>`).join('')}</div><span class="method-row-duration">${methodDuration(rowDuration(r))}</span></div>`).join('')}<div class="method-axis">${Array.from({length:11},(_,i)=>`<span>${String(i*15).padStart(2,'0')}:00</span>`).join('')}</div></div></div>`;}
 function list(){const qs=model.questions.filter(matches),maxPage=Math.max(0,Math.ceil(qs.length/size)-1);page=Math.min(page,maxPage);
  return `<div class="mq-list-head" id="mq-list-heading" tabindex="-1"><h3>核心提问 <span class="mq-muted">${filter.kind==='all'?qs.length+'个问题':qs.length+' / '+stats.questions+'个问题'}</span></h3><div class="mq-filters">${[['all','全部'],['responded','有学生应答'],['followed','有教师跟进']].map(([k,label])=>btn(`data-mq-filter="${k}" aria-pressed="${filter.kind===k}"`,label,'')).join('')}${!['all','responded','followed'].includes(filter.kind)?`<span class="mq-muted">筛选：${esc(filter.value)} ${btn('data-mq-filter="all"','清除')}</span>`:''}</div></div><div aria-live="polite">${qs.slice(page*size,(page+1)*size).map(q=>btn(`data-mq-open="${q.id}"`,`<time>${time(q.start)}</time><span><strong>${esc(q.text)}</strong>${tags([q.bloom,model.answerStatus==='available'?`${answers(q).length}次应答`:'应答待分析',...new Set(answers(q).map(t=>t.level)),follows(q).length?'有教师跟进':null])}</span><span class="mq-open">查看问答详情 ›</span>`,'mq-row')).join('')||empty('没有符合条件的问题','可清除筛选查看全部问题。')}</div><div class="mq-pages">${btn(`data-mq-page="-1" ${page===0?'disabled':''}`,'上一页')}<span>${qs.length?page+1:0} / ${Math.ceil(qs.length/size)} 页</span>${btn(`data-mq-page="1" ${page===maxPage?'disabled':''}`,'下一页')}</div>`;
 }
 function renderOverview(){const single=stats.levels?.[1];const note=stats.answers===null?'学生语音暂无法分析；已识别的教师问题仍可查看。':stats.answers===0?'已分析范围内未识别到学生应答。请结合原始课堂片段核对，不直接推断学生没有思考。':`本课共${stats.questions}个提问，${stats.responded}个问题有学生回应。${single}次回答呈现单个信息点，可结合后续追问引导学生建立联系。`;
  root.innerHTML=`<style>${questionStyles}</style><div class="mq-head"><h2 id="method-questions-title">教学提问</h2>${btn('data-mq-list-open','查看核心提问 ›')}</div><div class="attitude-insight"><img src="assets/figma/method-behavior-img111111.svg" width="16" height="16" alt=""><p>${note}</p></div><div class="mq-charts"><div class="mq-chart">${classification()}</div><div class="mq-chart"><div class="mq-chart-title"><h3>候答时间</h3></div>${donut('waits',['3秒以内','3–5秒','5秒以上'],stats.waits)}</div><div class="mq-chart"><div class="mq-chart-title"><h3>应答时间</h3></div>${donut('durations',['5秒以内','5–15秒','15秒以上'],stats.durations)}</div><div class="mq-chart"><div class="mq-chart-title"><h3>评价类型</h3></div>${donut('feedback',feedbackLabels,stats.feedback)}</div></div><div class="mq-more"><article class="mq-panel"><h3>学生应答参与度 ${btn('data-mq-participation','查看明细 ›')}</h3><div class="mq-kpis">${btn('data-mq-filter="responded"',`<strong>${stats.answers??'—'}<small>${stats.answers===null?'':'次'}</small></strong><span>学生应答</span>`,'mq-kpi')}${btn('data-mq-filter="responded"',`<strong>${stats.students??'—'}<small>${stats.students===null?'':'人'}</small></strong><span>不同应答学生</span>`,'mq-kpi')}</div><div class="mq-meter"><i style="width:${stats.responded===null?0:pct(stats.responded,stats.questions)}%"></i></div><div class="mq-between"><span>有学生回应的问题</span><span>${stats.responded===null?'暂无法分析':`${stats.responded} / ${stats.questions} · ${pct(stats.responded,stats.questions)}%`}</span></div></article><article class="mq-panel"><h3>回答建构分类 ${levelHelp()}</h3>${donut('levels',levelLabels,stats.levels,true,soloColors)}</article><article class="mq-panel"><h3>教师理答与启发性互动 <span class="mq-muted">${stats.followups===null?'暂无法分析':stats.followups+'个事件'}</span></h3>${stats.strategies===null?empty('暂无法分析教师跟进','缺少完整问答上下文。'):strategyLabels.map((n,i)=>btn(chartAction('strategies',n),`<span>${n}</span><i><em style="width:${stats.strategies[i]/Math.max(1,...stats.strategies)*100}%"></em></i><b>${stats.strategies[i]}次</b>`,'mq-strategy')).join('')}</article></div>${timeline()}`;
 }
 function ensureDialog(){
  let dialog=root.querySelector('.mq-dialog');if(!dialog){dialog=document.createElement('dialog');dialog.className='mq-dialog';dialog.setAttribute('aria-labelledby','mq-dialog-title');root.append(dialog);dialog.addEventListener('cancel',e=>{e.preventDefault();closeDetail();},{signal:controller.signal});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDetail();}},{signal:controller.signal});}
  return dialog;
 }
 function showSummary(title,body){const dialog=ensureDialog();dialog.innerHTML=`<div class="mq-modal-head"><h2 id="mq-dialog-title">${esc(title)}</h2>${btn('data-mq-back aria-label="关闭详情"','×','mq-close')}</div><div class="mq-modal-body">${body}</div>`;if(!dialog.open)dialog.showModal();dialog.querySelector('[data-mq-back]').focus({preventScroll:true});}
 function openQuestionList(){listOrigin='list';showSummary('核心提问',`<div id="mq-list">${list()}</div>`);}
 function participation(){listOrigin='participation';const qs=model.questions.filter(q=>answers(q).length);showSummary('学生应答参与度 · 明细',`<div class="mq-detail-stats"><span>学生应答 ${stats.answers??'—'}次</span><span>不同应答学生 ${stats.students??'—'}人</span><span>有回应的问题 ${stats.responded??'—'} / ${stats.questions}</span></div>${stats.answers===null?empty('暂无法分析学生回答','缺少可分析的学生发言。'):qs.map(q=>btn(`data-mq-open="${q.id}"`,`<time>${time(q.start)}</time><span><strong>${esc(q.text)}</strong>${tags([answers(q).length+'次应答'])}</span><span class="mq-open">查看问答详情 ›</span>`,'mq-row')).join('')||empty('未识别到学生应答','已分析范围内暂无应答记录。')}`);}
 function levelHelp(){return `<span class="mq-help"><button type="button" class="mq-help-button" aria-label="回答建构分类说明" aria-describedby="mq-level-tooltip">?</button><span id="mq-level-tooltip" role="tooltip" class="mq-tooltip"><strong>回答建构分类（SOLO）</strong>${levelLabels.map((n,i)=>`<span><b>${n}</b>：${levelNotes[i]}</span>`).join('')}<span>依据回答呈现的结构分类，不等同知识掌握程度。</span></span></span>`;}
 function matchedTurns(q){const ts=visibleTurns(q),{kind,value}=filter;
 if(kind==='levels')return ts.filter(t=>t.level===value).map(t=>t.id);
 if(kind==='strategies')return ts.filter(t=>t.strategies?.includes(value)).flatMap(t=>[t.replyTo,t.id]).filter(Boolean);
 if(kind==='feedback')return ts.filter(t=>t.feedback===value).map(t=>t.id);
 if(kind==='bloom'||kind==='mat')return [q.turns[0].id];
 if(kind==='waits')return [q.turns[0].id,answers(q)[0]?.id].filter(Boolean);
 if(kind==='durations')return answers(q).filter(t=>Number(value)===(t.end-t.start<=5?0:t.end-t.start<=15?1:2)).map(t=>t.id);
 if(kind==='responded')return answers(q).map(t=>t.id);return [];
 }
 function detail(){const q=model.questions.find(x=>x.id===selected);if(!q){selected=null;renderOverview();return;}
  const hitIds=matchedTurns(q);
  const as=answers(q);const first=as[0];const people=model.identityStatus==='available'&&model.answerStatus==='available'?new Set(as.filter(a=>a.studentId).map(a=>a.studentId)).size:null;
  const dialog=ensureDialog();
  dialog.innerHTML=`<div class="mq-modal-head"><div><h2 id="mq-dialog-title">问答详情</h2><span class="mq-muted">核心提问 · ${time(q.start)}–${time(q.end)}</span></div>${btn('data-mq-back aria-label="关闭问答详情"','×','mq-close')}</div><div class="mq-modal-body"><div>${listOrigin?btn('data-mq-list-return','‹ 返回列表'):""}<h3>${esc(q.text)}</h3>${tags([`布鲁姆：${q.bloom}`,`4MAT：${q.mat}`])}${hitIds.length?`<p class="mq-note">筛选依据：${esc(filter.value||'学生应答')} · 已标出对应原话</p>`:''}<div class="mq-detail-stats"><span>候答 ${first?`${Math.round((first.start-q.turns[0].end)*10)/10}秒`:'—'}</span><span>应答 ${stats.answers===null?'—':as.length+'次'}</span><span>学生 ${people===null?'—':people+'人'}</span></div>${model.answerStatus==='available'?'':empty('暂无法分析学生回答','保留教师问题；学生发言缺失不计作0次应答。')}<div>${visibleTurns(q).map(t=>`<div class="mq-turn ${t.role==='student'?'student':''} ${highlight===t.id?'mq-highlight':''}" id="mq-${t.id}" tabindex="-1"><time>${time(t.start)}</time><label>${t.role==='student'?(model.identityStatus==='available'&&t.studentId?'学生'+t.studentId.split('-')[1]:'学生'):'教师'}</label><div><p>${hitIds.includes(t.id)?`<mark class="mq-evidence-hit">${esc(t.text)}</mark>`:esc(t.text)}</p>${t.level?`<small>回答建构：${t.level} · ${levelNotes[levelLabels.indexOf(t.level)]}</small>`:''}${t.strategies?`<small>理答策略：${t.strategies.join('、')} ${t.replyTo&&visibleTurns(q).some(x=>x.id===t.replyTo)?btn(`data-mq-locate="${t.replyTo}"`,'查看前置回答'):''}</small>`:''}${t.feedback?`<small>教师评价：${t.feedback}</small>`:''}</div></div>`).join('')}</div><div class="mq-analysis"><strong>✦ 问题设计${model.followupStatus==='available'?'与理答':''}分析</strong>${model.answerStatus==='available'&&model.followupStatus==='available'?esc(q.analysis):'当前问答上下文不完整，暂不生成关于学生回答和教师跟进的质量判断。'}</div>${btn(`data-mq-locate="${q.turns[0].id}"`,`定位本段转写 ${time(q.start)}–${time(q.end)}`)}</div></div>`;
  if(!dialog.open)dialog.showModal();dialog.querySelector('[data-mq-back]').focus({preventScroll:true});
 }
 function closeDetail(){const dialog=root.querySelector('.mq-dialog');if(dialog){dialog.close();dialog.remove();}selected=null;highlight=null;listOrigin=null;if(previousTrigger?.isConnected)previousTrigger.focus({preventScroll:true});}
 function focusList(){root.querySelector('#mq-list-heading')?.focus({preventScroll:true});root.querySelector('#mq-list-heading')?.scrollIntoView({block:'nearest'});}
 function render(){selected?detail():renderOverview();}
 root.addEventListener('click',e=>{const target=e.target.closest('button,[role="button"]');if(!target||!root.contains(target))return;const d=target.dataset;
  if('mqListOpen' in d){previousTrigger=target;filter={kind:'all',value:''};page=0;openQuestionList();return;}
  if('mqListReturn' in d){const qid=selected;selected=null;if(listOrigin==='participation')participation();else openQuestionList();root.querySelector('.mq-modal-body').scrollTop=listScroll;root.querySelector(`[data-mq-open="${qid}"]`)?.focus({preventScroll:true});return;}
  if('mqParticipation' in d){previousTrigger=target;filter={kind:'responded',value:''};participation();return;}
  if(d.mqSegment!==undefined){listOrigin=null;previousTrigger=target;const r=originalMethodData.questionTimeline[Number(d.mqSegment)],[a,b]=r.segments[Number(d.index)];showSummary(`${r.name} · 片段 ${Number(d.index)+1}`,`<div class="mq-detail-stats"><span>${methodTime(a)}–${methodTime(b)}</span><span>持续 ${methodDuration(b-a)}</span></div><h3>课堂观察</h3><p>${r.name.includes('提问')?'教师围绕人工智能课程内容发起问题，引导学生回顾和理解知识。':r.name.includes('回答')?'学生围绕当前问题表达观点，展示理解和学习成果。':'教师回应学生表达，进行确认、鼓励或补充说明。'}</p>`);return;}
  if(d.mqMode){mode=d.mqMode;renderOverview();root.querySelector(`[data-mq-mode="${mode}"]`).focus({preventScroll:true});return;}
  if(d.mqFilter){const inDialog=!!target.closest('.mq-dialog');if(!inDialog)previousTrigger=target;filter={kind:d.mqFilter,value:d.value||''};page=0;if(inDialog&&root.querySelector('#mq-list'))root.querySelector('#mq-list').innerHTML=list();else openQuestionList();focusList();return;}
  if(d.mqPage){page+=Number(d.mqPage);root.querySelector('#mq-list').innerHTML=list();focusList();return;}
  if(d.mqOpen){if(!target.closest('.mq-dialog'))previousTrigger=target;listScroll=root.querySelector('.mq-modal-body')?.scrollTop||0;selected=d.mqOpen;highlight=d.turn||null;detail();return;}
  if('mqBack' in d){closeDetail();return;}
  if(d.mqLocate){root.querySelectorAll('.mq-highlight').forEach(el=>el.classList.remove('mq-highlight'));const el=root.querySelector(`#mq-${d.mqLocate}`);if(!el)return;el.classList.add('mq-highlight');el.focus({preventScroll:true});el.scrollIntoView({block:'nearest'});return;}

 },{signal:controller.signal});
 root.addEventListener('keydown',e=>{const tab=e.target.closest('[data-mq-mode]');if(tab&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();mode=e.key==='Home'?'bloom':e.key==='End'?'mat':mode==='bloom'?'mat':'bloom';renderOverview();root.querySelector(`[data-mq-mode="${mode}"]`).focus({preventScroll:true});}if(e.target.matches('path[role="button"]')&&['Enter',' '].includes(e.key)){e.preventDefault();e.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}if(e.key==='Escape'&&root.querySelector('.mq-dialog[open]')){e.preventDefault();closeDetail();}},{signal:controller.signal});
 render();return ()=>{closeDetail();controller.abort();root.innerHTML=original;};
}
