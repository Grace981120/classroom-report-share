import {questionData,bloomLabels,matLabels,levelLabels,levelNotes,feedbackLabels,strategyLabels,summarize} from './method-questions-data.js';
import {questionStyles} from './method-questions-styles.js';
import {donutSegmentAttributes} from './attitude.js';
import {question108Styles} from './method-questions-v108-styles.js';

const colors=['#1d70f2','#00cc7e','#e545d2','#ff7626','#ffb743','#19abea'];
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=v=>{v=Math.floor(v);return [Math.floor(v/3600),Math.floor(v/60)%60,v%60].map(n=>String(n).padStart(2,'0')).join(':');};
const axisTime=v=>`${String(Math.floor(v/60)).padStart(2,'0')}:${String(Math.floor(v%60)).padStart(2,'0')}`;
const round=v=>Math.round(v*10)/10;
const pct=(n,total)=>total?round(n/total*100):0;
const button=(attrs,text,cls='mq-link')=>`<button type="button" ${attrs} class="${cls}">${text}</button>`;
const empty=(title,text)=>`<div class="mq-empty"><strong>${esc(title)}</strong>${esc(text)}</div>`;
// Authored demo event. It is separate from teacher-led question statistics.
const studentQuestion={id:'sq1',topic:'训练数据的数量与质量',initiator:'student',start:2600,end:2636,text:'老师，是不是训练数据越多，模型效果就一定越好？',turns:[
  {id:'sq1-prompt',role:'student',studentId:'student-5',kind:'question',start:2600,end:2606,text:'老师，是不是训练数据越多，模型效果就一定越好？'},
  {id:'sq1-response',role:'teacher',kind:'response',start:2607,end:2624,text:'不一定。如果增加的是重复或错误的数据，数量多也不代表有效信息多。我们还要看数据质量和代表性。'},
  {id:'sq1-continuation',role:'student',studentId:'student-5',kind:'continuation',start:2625,end:2636,text:'所以除了数量，还要看数据是否正确、能不能代表实际情况。'}
]};

export function mountQuestions108(root,source=questionData){
  if(!root)return ()=>{};
  const original=root.innerHTML;
  const model=source===questionData?{...source,questions:[...source.questions,studentQuestion]}:source;
  const questions=[...model.questions].sort((a,b)=>a.start-b.start);
  // 主问题链将首问、候答、学生应答和教师跟进视作一个完整课堂片段；零散追问不单列色块。
  const questionChains=[
    {questionId:'q1',start:1050,end:1450,topic:'RAG更新方式'},
    {questionId:'q5',start:2200,end:2540,topic:'检索与生成'},
    {questionId:'q9',start:3300,end:3750,topic:'训练数据与测试集'},
    {questionId:'q13',start:4520,end:4900,topic:'提示词的角色与任务'},
    {questionId:'q17',start:5750,end:6200,topic:'应用场景与限制条件'},
    {questionId:'q21',start:7150,end:7460,topic:'资料时效与核验依据'}
  ];
  const isTeacher=q=>(q.initiator||q.turns[0]?.role||'teacher')==='teacher';
  const teachers=questions.filter(isTeacher);
  const answers=q=>model.answerStatus==='available'?q.turns.filter(t=>t.kind==='answer'&&t.role==='student'):[];
  const follows=q=>model.followupStatus==='available'?q.turns.filter(t=>t.kind==='followup'&&t.replyTo&&q.turns.some(a=>a.id===t.replyTo&&a.role==='student')):[];
  const visible=q=>q.turns.filter(t=>!((model.answerStatus!=='available'&&t.role==='student'&&t.kind!=='question')||(model.followupStatus!=='available'&&t.kind==='followup')));
  const statistics=qs=>{const s=summarize({...model,questions:qs});const fs=qs.flatMap(follows);return {...s,followups:model.followupStatus==='available'?fs.length:null,strategies:model.followupStatus==='available'?strategyLabels.map(label=>fs.filter(t=>t.strategies?.includes(label)).length):null};};
  const stats=statistics(teachers);
  let mode='bloom',view='teacher',selection=null,refinement=null,page=0,origin=null,savedScroll=0;
  const controller=new AbortController();
  function alignLegends(){
    const labels=[...root.querySelectorAll('.uq-stage:first-child .mq-bars small')];
    if(!labels.length)return;
    const target=Math.max(...labels.map(e=>e.getBoundingClientRect().bottom));
    root.querySelectorAll('.uq-ring .mq-legend').forEach(legend=>{
      const entries=[...legend.querySelectorAll('button')];if(!entries.length)return;
      legend.style.transform='none';
      const bottom=Math.max(...entries.map(e=>e.getBoundingClientRect().bottom));
      const teacherTop=root.querySelector('.uq-stage').getBoundingClientRect().top;
      const stageTop=legend.closest('.uq-stage').getBoundingClientRect().top;
      legend.style.transform=`translateY(${target+stageTop-teacherTop-bottom}px)`;
    });
  }
  const resizeObserver=new ResizeObserver(()=>requestAnimationFrame(alignLegends));
  resizeObserver.observe(root);
  const action=(kind,value)=>`data-uq-filter="${esc(kind)}" data-value="${esc(value)}"`;
  const a11y='tabindex="0" role="button"';
  function help(id,title,content){return `<span class="mq-help"><button type="button" class="mq-help-button" aria-label="${esc(title)}" aria-describedby="uq-help-${id}">?</button><span id="uq-help-${id}" role="tooltip" class="mq-tooltip"><strong>${esc(title)}</strong>${content}</span></span>`;}
  function donut(kind,labels,values){
    if(values===null)return empty('暂无法分析','缺少可分析的学生发言或课堂资料。');
    const total=values.reduce((a,b)=>a+b,0);
    if(!total)return empty('暂无相关记录','当前范围没有可统计的记录。');
    let start=0;
    const shapes=values.map((n,i)=>{const val=n/total*100;const attrs=donutSegmentAttributes(start,Math.max(0,val-.8),220,60,43);const angle=(start+val/2)*Math.PI/50-Math.PI/2;start+=val;
      const value=kind==='waits'||kind==='durations'?i:labels[i];
      return n?`<path ${attrs} fill="${colors[i]}" ${a11y} ${action(kind,value)} aria-label="${esc(labels[i])} ${n}次，占${pct(n,total)}%"><title>${esc(labels[i])} · ${n}次</title></path><text x="${110+Math.cos(angle)*84}" y="${84+Math.sin(angle)*76}" text-anchor="middle">${pct(n,total)}%</text>`:'';
    }).join('');
    return `<div class="mq-donut"><svg viewBox="0 0 220 180" role="group" aria-label="${esc(labels.join('、'))}">${shapes}</svg></div><div class="mq-legend">${labels.map((label,i)=>button(action(kind,kind==='waits'||kind==='durations'?i:label),`<i style="background:${colors[i]}"></i>${esc(label)}`,'')).join('')}</div>`;
  }
  function classification(){const labels=mode==='bloom'?bloomLabels:matLabels,values=stats[mode],max=Math.max(1,...values);
    return `<div class="uq-stage-head"><h3>教师提问</h3><div class="mq-tabs" role="tablist" aria-label="提问分类方式">${[['bloom','布鲁姆分类'],['mat','4MAT模式']].map(([id,label])=>button(`id="uq-tab-${id}" role="tab" data-uq-mode="${id}" aria-selected="${mode===id}" aria-controls="uq-classification" tabindex="${mode===id?0:-1}"`,label,'')).join('')}</div></div><div class="uq-plot" id="uq-classification" role="tabpanel" aria-labelledby="uq-tab-${mode}"><div class="mq-classification-groups">${mode==='bloom'?`<span>初阶（${values.slice(0,3).reduce((a,b)=>a+b,0)}次）</span><span>高阶（${values.slice(3).reduce((a,b)=>a+b,0)}次）</span>`:'<span>四类提问</span>'}</div><div class="mq-bars">${labels.map((label,i)=>button(action(mode,label),`<span>${values[i]}次</span><i style="height:${values[i]/max*115}px;background:${colors[i]}"></i><small>${esc(label)}</small>`,'')).join('')}</div></div>`;
  }
  function timeline(){
    const duration=Math.max(model.duration||0,...questionChains.map(q=>q.end),60);
    const segments=questionChains.map(chain=>{const left=chain.start/duration*100,width=(chain.end-chain.start)/duration*100;
      return button(`data-uq-event="${esc(chain.questionId)}" aria-label="问题主题：${esc(chain.topic)}，问题链 ${time(chain.start)}至${time(chain.end)}" style="left:${left}%;width:${Math.max(0,width)}%"`,'','uq-segment uq-chain');
    }).join('');
    return `<div class="uq-timeline-title"><h3>提问时序图</h3></div><div class="method-timeline-scroll" tabindex="0" aria-label="提问时序图，可横向滚动"><div class="method-timeline uq-timeline"><div class="method-timeline-row"><span class="method-row-name">问题链</span><div class="method-track">${segments}</div>${button('data-uq-all aria-label="全部问题链"',`${questionChains.length}个`,'method-row-duration uq-total')}</div><div class="method-axis">${Array.from({length:11},(_,i)=>`<span>${axisTime(duration*i/10)}</span>`).join('')}</div></div></div>`;
  }
  function insight(){
    if(model.answerStatus!=='available')return '学生发言资料不足，暂不能判断回答结构与应答参与情况；可先核对已识别的教师问题。';
    if(!stats.answers)return '已分析范围内未识别到学生应答，需结合课堂原话和录音核查，不据此判断学生没有思考。';
    const strengths=stats.followups?'教师已有追问，引导学生继续解释；':'';
    return strengths+(stats.levels[1]?'部分回答仍停留在单个信息点，建议承接这些回答追问理由与联系。':'回答呈现了多个信息点，建议结合具体原话进一步核查解释和推理的联系。');
  }
  function render(){
    root.innerHTML=`<style>${questionStyles}${question108Styles}</style><div class="mq-head"><h2 id="method-questions-title">教学提问</h2></div><div class="attitude-insight"><img src="assets/figma/method-behavior-img111111.svg" width="16" height="16" alt=""><p>${insight()}</p></div>${timeline()}<div class="uq-stages"><section class="uq-stage">${classification()}</section><section class="uq-stage uq-student"><div class="uq-stage-head"><h3>学生应答</h3>${help('levels','回答建构分类（SOLO）',levelLabels.map((l,i)=>`<span><b>${l}</b>：${levelNotes[i]}</span>`).join('')+'<span>按回答的结构分类，不直接等同于知识掌握程度。</span>')}</div><div class="uq-plot uq-ring">${donut('levels',levelLabels,stats.levels)}</div></section><section class="uq-stage uq-feedback"><div class="uq-stage-head"><h3>教师评价</h3></div><div class="uq-plot uq-ring">${donut('feedback',feedbackLabels,stats.feedback)}</div></section><section class="uq-stage"><div class="uq-stage-head"><h3>教师追问</h3></div><div class="uq-plot uq-strategies">${stats.strategies===null?empty('暂无法分析','缺少完整教师跟进记录。'):!stats.followups?empty('暂无追问记录','当前范围未识别到承接学生回答的追问。'):strategyLabels.map((label,i)=>button(action('strategies',label),`<span>${label}</span><i><em style="width:${pct(stats.strategies[i],Math.max(1,...stats.strategies))}%"></em></i><b>${stats.strategies[i]}次</b>`,'mq-strategy')).join('')}</div></section></div>`;
  }
  function matches(q,filter){
    if(!filter)return true;
    const {kind,value}=filter;
    if(kind==='id')return q.id===value;
    if(kind==='bloom'||kind==='mat')return isTeacher(q)&&q[kind]===value;
    if(kind==='levels')return answers(q).some(t=>t.level===value);
    if(kind==='feedback')return q.turns.some(t=>t.feedback===value);
    if(kind==='strategies')return follows(q).some(t=>t.strategies?.includes(value));
    if(kind==='responded')return answers(q).length>0;
    if(kind==='waits'){const first=answers(q)[0];if(!first||!isTeacher(q))return false;const wait=first.start-q.turns[0].end;return Number(value)===(wait<=3?0:wait<=5?1:2);}
    if(kind==='durations')return answers(q).some(t=>Number(value)===(t.end-t.start<=5?0:t.end-t.start<=15?1:2));
    return true;
  }
  function hitIds(q){
    const filter=refinement||selection;if(!filter)return [];
    if(filter.kind==='id')return visible(q).map(t=>t.id);
    if(filter.kind==='bloom'||filter.kind==='mat'||filter.kind==='waits')return [q.turns[0]?.id,...(filter.kind==='waits'?[answers(q)[0]?.id]:[])];
    if(filter.kind==='strategies')return follows(q).filter(t=>t.strategies?.includes(filter.value)).flatMap(t=>[t.replyTo,t.id]);
    if(filter.kind==='feedback')return q.turns.filter(t=>t.feedback===filter.value).map(t=>t.id);
    if(filter.kind==='levels')return answers(q).filter(t=>t.level===filter.value).map(t=>t.id);
    if(filter.kind==='durations')return answers(q).filter(t=>Number(filter.value)===(t.end-t.start<=5?0:t.end-t.start<=15?1:2)).map(t=>t.id);
    return answers(q).map(t=>t.id);
  }
  function record(q){
    const as=answers(q),hits=hitIds(q),prompt=q.turns[0],first=as[0];
    const student=q.initiator==='student'||prompt.role==='student';
    const speaker=t=>t.role==='student'?(model.identityStatus==='available'&&t.studentId?'学生 '+t.studentId.split('-').pop():'学生'):'教师';
    return `<article class="uq-record" id="uq-record-${esc(q.id)}" tabindex="-1"><div class="uq-record-heading"><h3>${esc(q.text)}</h3><span class="mq-muted">${time(q.start)}–${time(q.end)} · ${student?'学生主动提问':'教师发起'}</span></div><div class="mq-detail-stats">${student?'':`<span>提问分类 ${esc(q.bloom||'未分类')} / ${esc(q.mat||'未分类')}</span><span>首次候答 ${model.answerStatus!=='available'?'资料不足':first?round(first.start-prompt.end)+'秒':'无应答，未计候答时长'}</span><span>学生应答 ${model.answerStatus==='available'?as.length+'次 · '+round(as.reduce((n,t)=>n+t.end-t.start,0))+'秒':'资料不足'}</span>`}</div>${visible(q).map(t=>`<div class="mq-turn ${t.role==='student'?'student':''}" id="uq-turn-${esc(t.id)}" tabindex="-1"><time>${time(t.start)}<br>–${time(t.end)}</time><label>${esc(speaker(t))}</label><div><p>${hits.includes(t.id)?`<mark class="mq-evidence-hit">${esc(t.text)}</mark>`:esc(t.text)}</p>${t.level?`<small>回答建构：${esc(t.level)} · ${esc(levelNotes[levelLabels.indexOf(t.level)]||'')}</small>`:''}${t.strategies?`<small>追问策略：${esc(t.strategies.join('、'))}${t.replyTo&&visible(q).some(a=>a.id===t.replyTo)?` · ${button(`data-uq-locate="${esc(t.replyTo)}"`,'定位前置回答')}`:''}</small>`:''}${t.feedback?`<small>教师评价：${esc(t.feedback)}</small>`:''}</div></div>`).join('')}${q.analysis&&model.answerStatus==='available'&&model.followupStatus==='available'?`<p class="uq-record-analysis">${esc(q.analysis.replace('本示例未记录到','未记录到'))}</p>`:''}<span class="mq-muted">转写片段 ${esc(q.id)}</span></article>`;
  }
  function participation(s){return `<section><h3>学生应答参与度</h3><div class="mq-kpis">${button(action('responded',''),`<strong>${s.answers??'—'}<small>次</small></strong><span>学生应答</span>`,'mq-kpi')}${button(action('responded',''),`<strong>${s.students??'—'}<small>人</small></strong><span>不同应答学生</span>`,'mq-kpi')}</div><div class="mq-meter"><i style="width:${pct(s.responded||0,s.questions)}%"></i></div><div class="mq-between"><span>有学生回应的问题</span><span>${s.responded===null?'资料不足':s.responded+' / '+s.questions+' · '+pct(s.responded,s.questions)+'%'}</span></div>${s.students===null?'<p class="mq-note">无法可靠区分学生身份，人数暂不统计。</p>':''}</section>`;}
  function filterName(f){if(!f)return '';return f.kind==='waits'?['3秒以内','3–5秒','5秒以上'][Number(f.value)]:f.kind==='durations'?['5秒以内','5–15秒','15秒以上'][Number(f.value)]:f.kind==='responded'?'有学生应答':f.kind==='id'?'指定问答片段':f.value;}
  function dialogBody(){
    const domain=view==='timeline'?questions:teachers;
    const base=domain.filter(q=>matches(q,selection));
    const subset=base.filter(q=>matches(q,refinement));
    const s=statistics(base.filter(isTeacher));
    const perPage=2,max=Math.max(1,Math.ceil(subset.length/perPage));page=Math.max(0,Math.min(page,max-1));
    let summary='';
    if(view==='teacher')summary=`<div class="uq-detail-grid"><section><h3>候答时间 ${help('waits','候答时间口径','<span>当前关联问题中，教师首问结束到学生首次应答开始的时差；未应答不记为0秒，不含追问后的等待。</span>')}</h3>${donut('waits',['3秒以内','3–5秒','5秒以上'],s.waits)}</section><section><h3>提问记录</h3><div class="mq-detail-stats"><span>${base.length}个教师问题</span><span>${s.responded??'—'}个问题有学生回应</span></div><p class="mq-note">下方逐条呈现问题、候答时长及对应原话。黄色标记为支持当前筛选条件的完整依据句。</p></section></div>`;
    if(view==='student')summary=`<p class="mq-note">关联问题中的全部学生应答；当前命中回答已在原话中标记。</p><div class="uq-detail-grid"><section><h3>应答时间 ${help('duration','应答时间口径','<span>每次学生应答从开始到结束的持续时长，按应答次数统计，不含候答时间。参与人数依赖可区分的学生身份。</span>')}</h3>${donut('durations',['5秒以内','5–15秒','15秒以上'],s.durations)}</section>${participation(s)}</div>`;
    if(view==='timeline')summary=`<div class="mq-detail-stats"><span>教师发起 ${base.filter(isTeacher).length}个</span><span>学生主动提问 ${base.filter(q=>!isTeacher(q)).length}个</span></div>`;
    if(view==='followup')summary='<p class="mq-note">策略可重叠；同一追问可同时含解释、拆解或反思。下方同时保留前置回答与后续回应。</p>';
    return `<div class="uq-summary">${summary}</div><div class="uq-result-head" tabindex="-1"><h3>问答证据 · ${subset.length}个片段</h3><div class="mq-filters">${selection?`<span class="mq-muted">${esc(filterName(selection))}</span>`:''}${refinement?`<span class="mq-muted">${esc(filterName(refinement))}</span>${button('data-uq-clear-refine','清除细分筛选','')}`:''}${selection||refinement?button('data-uq-clear','全部记录',''):''}</div></div><div class="uq-records">${subset.slice(page*perPage,(page+1)*perPage).map(record).join('')||empty('没有匹配的问答','可清除筛选查看当前板块的全部记录。')}</div><div class="mq-pages">${button(`data-uq-page="-1" ${page===0?'disabled':''}`,'上一页')}<span>${subset.length?page+1:0} / ${subset.length?max:0}</span>${button(`data-uq-page="1" ${page>=max-1?'disabled':''}`,'下一页')}</div>`;
  }
  function close(){const dialog=root.querySelector('.mq-dialog');if(dialog){dialog.close();dialog.remove();}window.scrollTo({top:savedScroll,behavior:'instant'});origin?.isConnected&&origin.focus({preventScroll:true});}
  function updateDialog(){const body=root.querySelector('.mq-modal-body');body.innerHTML=dialogBody();}
  function open(target,nextView,filter){
    origin=target;savedScroll=window.scrollY;view=nextView;selection=filter;refinement=null;page=0;
    const dialog=document.createElement('dialog');dialog.className='mq-dialog';dialog.setAttribute('aria-labelledby','mq-dialog-title');
    const titles={teacher:'教师提问',student:'学生应答',evaluation:'教师评价',followup:'教师追问',timeline:'问答片段'};
    dialog.innerHTML=`<div class="mq-modal-head"><h2 id="mq-dialog-title">${titles[view]}</h2>${button('data-uq-close aria-label="关闭"','×','mq-close')}</div><div class="mq-modal-body"></div>`;
    root.append(dialog);updateDialog();dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.showModal();dialog.querySelector('[data-uq-close]').focus({preventScroll:true});
    if(filter?.kind==='id')dialog.querySelector('.uq-record')?.classList.add('uq-record-selected');
  }
  root.addEventListener('click',event=>{
    const target=event.target.closest('button,[role="button"]');if(!target||!root.contains(target))return;
    const d=target.dataset;
    if('uqClose' in d){close();return;}
    if(d.uqMode){mode=d.uqMode;render();requestAnimationFrame(alignLegends);root.querySelector(`[data-uq-mode="${mode}"]`).focus({preventScroll:true});return;}
    if(d.uqEvent){open(target,'timeline',{kind:'id',value:d.uqEvent});return;}
    if('uqAll' in d){open(target,'timeline',null);return;}
    if(d.uqFilter){const filter={kind:d.uqFilter,value:d.value||''};
      if(target.closest('.mq-dialog')){refinement=filter;page=0;updateDialog();root.querySelector('.uq-result-head').focus({preventScroll:true});}
      else open(target,['levels','durations','responded'].includes(filter.kind)?'student':filter.kind==='feedback'?'evaluation':filter.kind==='strategies'?'followup':'teacher',filter);
      return;
    }
    if('uqClear' in d||'uqClearRefine' in d){if('uqClear' in d)selection=null;refinement=null;page=0;updateDialog();root.querySelector('.uq-result-head').focus({preventScroll:true});return;}
    if(d.uqPage){page+=Number(d.uqPage);updateDialog();const result=root.querySelector('.uq-result-head');result.focus({preventScroll:true});result.scrollIntoView({block:'start'});return;}
    if(d.uqLocate){const turn=root.querySelector(`#uq-turn-${CSS.escape(d.uqLocate)}`);if(turn){root.querySelectorAll('.mq-highlight').forEach(e=>e.classList.remove('mq-highlight'));turn.classList.add('mq-highlight');turn.focus({preventScroll:true});turn.scrollIntoView({block:'nearest'});}}
  },{signal:controller.signal});
  root.addEventListener('keydown',event=>{
    const tab=event.target.closest('[data-uq-mode]');
    if(tab&&['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();mode=event.key==='Home'?'bloom':event.key==='End'?'mat':mode==='bloom'?'mat':'bloom';render();requestAnimationFrame(alignLegends);root.querySelector(`[data-uq-mode="${mode}"]`).focus({preventScroll:true});}
    if(event.target.matches('path[role="button"]')&&['Enter',' '].includes(event.key)){event.preventDefault();event.target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}
  },{signal:controller.signal});
  render();requestAnimationFrame(alignLegends);document.fonts.ready.then(alignLegends);
  return ()=>{controller.abort();resizeObserver.disconnect();const dialog=root.querySelector('.mq-dialog');if(dialog){dialog.close();dialog.remove();}root.innerHTML=original;};
}
