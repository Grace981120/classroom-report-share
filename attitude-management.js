import {classroomManagementVersion} from './attitude-management-version.js';
import {attitudeData as data,formatTime} from './attitude-data.js';

// Design examples, not connected to ASR. Preserve original records in attitude-data.js.
export function mountClassroomManagement(root){
 if(classroomManagementVersion==='baseline')return;
 const card=root.querySelector('#attitude-management');
 const types=[{name:'考勤',color:'#1d70f2'},{name:'提醒',color:'#00cc7e'},{name:'纪律管理',color:'#e545d2'}];
 const records=data.management.flatMap((e,i)=>i===8?[]:[{...e,id:'original-'+i,kind:e.type===0?0:1,label:data.managementTypes[e.type].name}]);
 records.push({id:'discipline-1',time:1104,kind:2,label:'停止交谈',quote:'请先停止交谈，我们一起看黑板上的条件。',before:'教师正在讲解例题条件。',after:'教师继续说明第二步推导。'}, {id:'discipline-2',time:5610,kind:2,label:'收起手机',quote:'请把手机收起来，先完成这道练习。',before:'学生正在完成课堂练习。',after:'暂无可定位的后续学生反应。'});
 records.sort((a,b)=>a.time-b.time);
 const active=new Set([0,1,2]);
 card.querySelector('.section-hint').outerHTML='<button class="text-button" data-cm-open>查看详情 ›</button>';
 card.querySelector('.attitude-insight p').textContent='教师进行了考勤提示、学习提醒和纪律管理。';
 const chart=card.querySelector('.management-chart');
 chart.innerHTML=`<div class="management-track">${records.map((r,i)=>`<button class="management-event" data-cm-event="${i}" style="left:${r.time/data.duration*100}%;--event-color:${types[r.kind].color};--event-offset:0px" aria-label="${formatTime(r.time)} ${r.label}" title="${formatTime(r.time)} ${r.label}"><span></span></button>`).join('')}</div><div class="management-axis">${[0,30,60,90,130].map(t=>`<span style="left:${t/130*100}%">${formatTime(t*60)}</span>`).join('')}</div><div class="management-legend">${types.map((t,i)=>`<button data-cm-filter="${i}" aria-pressed="true"><i style="background:${t.color}"></i>${t.name}</button>`).join('')}</div>`;
 const style=document.createElement('style');style.textContent='#attitude-management .management-axis{font-size:12px;line-height:20px}#attitude-management .cm-body{padding:22px 28px;font-size:14px;line-height:24px}#attitude-management .cm-row{display:flex;gap:16px;align-items:center;text-align:left;width:100%;padding:13px 0;border-bottom:1px solid #e9ecf2}#attitude-management .cm-row time{color:var(--blue);font-size:13px}#attitude-management .cm-row span{flex:1}#attitude-management .cm-meta{font-size:12px;color:var(--muted);margin:14px 0}#attitude-management blockquote{margin:16px 0;padding:10px 14px;background:#f4f8ff;border-radius:8px}#attitude-management mark{background:#fff0bd;color:inherit}#attitude-management .cm-context{margin-top:16px;color:var(--secondary)}#attitude-management .cm-body h3{margin:12px 0}@media(max-width:560px){#attitude-management .management-axis{font-size:10px}#attitude-management .cm-body{padding:20px}}';card.append(style);
 const dialog=document.createElement('dialog');dialog.setAttribute('aria-labelledby','cm-dialog-title');dialog.innerHTML='<div class="dialog-head"><div><span class="dialog-eyebrow">教学态度 / 课堂管理</span><h2 id="cm-dialog-title">课堂管理详情</h2></div><button class="icon-button" data-cm-close aria-label="关闭弹窗">×</button></div><div class="cm-body"></div>';card.append(dialog);
 const body=dialog.querySelector('.cm-body');let trigger=null;
 style.textContent+='#attitude-management .cm-evidence{padding:16px 0;border-bottom:1px solid #e9ecf2;scroll-margin:90px}#attitude-management .cm-evidence:first-child{padding-top:0}#attitude-management .cm-evidence:last-child{border-bottom:0}#attitude-management .cm-evidence[data-selected]{background:#f4f8ff;box-shadow:0 0 0 10px #f4f8ff;border-radius:8px}#attitude-management .cm-evidence .cm-meta{margin:6px 0 12px}#attitude-management .dialog-head{position:sticky;top:0;z-index:1;background:white}';
 function open(button,index){
  trigger=button;
  body.innerHTML=records.map((r,i)=>active.has(r.kind)?`<article class="cm-evidence" data-cm-record="${i}" tabindex="-1" aria-labelledby="cm-record-title-${i}" ${i===index?'data-selected':''}><h3 id="cm-record-title-${i}">${r.label}</h3><p class="cm-meta">${formatTime(r.time)} · 教师</p>${r.quote?`<blockquote><mark>${r.quote}</mark></blockquote><p class="cm-meta">整句为判断依据</p><p>教师明确提出停止某项行为的要求，记录为纪律管理；提醒次数不等于违规次数。</p><div class="cm-context"><p>前文：${r.before}</p><p>后文：${r.after}</p></div>`:`<p>${r.text}</p><p class="cm-meta">当前记录为摘要，未提供逐字原话及前后文。</p>`}</article>`:'').join('')||'<p>当前未选中管理类型。</p>';
  if(!dialog.open)dialog.showModal();
  const record=index===undefined?null:body.querySelector(`[data-cm-record="${index}"]`);
  if(record){record.focus({preventScroll:true});dialog.scrollTop=record.offsetTop-dialog.querySelector('.dialog-head').offsetHeight-16;}
  else{dialog.scrollTop=0;dialog.querySelector('[data-cm-close]').focus({preventScroll:true});}
 }
 card.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;const d=b.dataset;if('cmOpen'in d)open(b);if('cmEvent'in d)open(b,Number(d.cmEvent));if('cmClose'in d)dialog.close();if('cmFilter'in d){const kind=Number(d.cmFilter);active.has(kind)?active.delete(kind):active.add(kind);b.setAttribute('aria-pressed',String(active.has(kind)));chart.querySelectorAll('[data-cm-event]').forEach(p=>p.hidden=!active.has(records[Number(p.dataset.cmEvent)].kind));}});
 dialog.addEventListener('close',()=>trigger?.focus({preventScroll:true}));
}
