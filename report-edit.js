import {reportEditVersion} from './report-edit-version.js';
import {attitudeData} from './attitude-data.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey='evaluation-report-edits-v1';
const minutes=value=>{if(!/^\d{2}:\d{2}$/.test(value))return NaN;const [h,m]=value.split(':').map(Number);return h<24&&m<60?h*60+m:NaN};
const fmt=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const clone=value=>JSON.parse(JSON.stringify(value));
export function mountReportEdit(){
 if(reportEditVersion==='baseline'||/\/previews\//.test(location.pathname)||document.documentElement.dataset.reportEditing)return false;
 if(!document.getElementById('recording-anomaly-timeline'))return false;
 const registry=[];let saved={};try{saved=JSON.parse(localStorage.getItem(storageKey)||localStorage.getItem('evaluation-report-edit-preview-v1')||'{}')}catch{}
 const attitudeHeadline=document.querySelector('#attitude-basics .attitude-insight p');
 const originalHeadline=attitudeHeadline?.textContent;
 if(!saved||typeof saved!=='object'||Array.isArray(saved))saved={};
 window.__reportEditRowSummary={};
 const add=(id,title,kind,events=[],node=document.getElementById(id))=>{
  if(registry.some(r=>r.id===id))return;
  const paragraph=node?.querySelector('.attitude-insight p,.ai-analysis p,.section-insight p,.overview-v2-ai p');
  registry.push({id,title,kind,events,node,paragraph,original:paragraph?.textContent||'',originalChildren:node?[...node.children]:[]});
 };
 const recording=document.getElementById('recording-anomaly-timeline');
 for(const [who,label] of [['teacher','课堂实录 · 教师规范'],['student','课堂实录 · 学生规范']]){
  const events=[...recording.querySelectorAll(`[data-anomaly-track="${who}"] [data-anomaly-id]`)].map(n=>{
   const full=n.getAttribute('aria-label'),matched=full.match(/，(.+)至(.+)$/);
   return {id:n.dataset.anomalyId,time:matched?`${matched[1]}–${matched[2]}`:'',text:full.split('：')[1]?.split('，')[0]||full,node:n};
  });add('recording-'+who,label,'events',events,recording);
 }
 add('attitude-attendance','教师考勤','attendance');
 const management=attitudeData.management.flatMap((r,i)=>i===8?[]:[{...r,label:attitudeData.managementTypes[r.type].name}]);
 management.push({time:1104,label:'停止交谈',text:'请先停止交谈，我们一起看黑板上的条件。'},{time:5610,label:'收起手机',text:'请把手机收起来，先完成这道练习。'});management.sort((a,b)=>a.time-b.time);
 add('attitude-management','课堂管理','events',management.map((r,i)=>({id:'management-'+i,time:fmt(r.time),text:`${r.label}：${r.text}`,node:document.querySelector(`[data-cm-event="${i}"]`)})));
 add('attitude-anomaly','教师异常行为','events',[...document.querySelectorAll('#attitude-anomaly .attitude-anomaly-event')].map((node,i)=>({id:'teacher-anomaly-'+i,time:attitudeData.basics[5].events[i][0],text:attitudeData.basics[5].events[i][1],node})));
 add('attitude-sensitive','敏感词','events',attitudeData.basics[4].events.map(([time,text],i)=>({id:'sensitive-'+i,time,text})));
 add('effect-anomalies','学生异常行为','aggregate');
 const labels={attitude:'教学态度',content:'教学内容',method:'教学方法',literacy:'教学素养',effect:'教学效果'};
 for(const [dimension,label] of Object.entries(labels)){
  const root=document.getElementById(dimension);
  for(const node of root.querySelectorAll('section[id],article[id]')){
   if(!node.id.startsWith(dimension+'-')||registry.some(r=>r.id===node.id)||node.matches('.attitude-dimension-summary,.dimension-summary-card')||node.hasAttribute('data-structure-retired')||node.id.endsWith('-summary')||node.id.endsWith('-basics'))continue;
   if(node.parentElement.closest(`section[id^="${dimension}-"],article[id^="${dimension}-"]`))continue;
   const heading=node.querySelector('h2,h3')||node.shadowRoot?.querySelector('h2,h3');if(!heading)continue;
   const title=[...heading.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim()||heading.firstChild?.textContent;
   const locked=['attitude-body','attitude-posture'].includes(node.id);
   add(node.id,`${label} · ${title}`,locked?'locked':'text',[],node);
   const item=registry.at(-1);if(item.kind==='text'&&!item.paragraph)item.kind='readonly';
  }
 }
 const dialog=document.createElement('dialog');dialog.id='rme-dialog';dialog.setAttribute('aria-labelledby','rme-title');
 dialog.innerHTML='<div class="rme-head"><h2 id="rme-title">修改报告</h2><button class="rme-close" type="button" aria-label="关闭修改">×</button></div><div class="rme-picker"><label for="rme-module">选择修改的模块</label><select id="rme-module"></select></div><div class="rme-content"></div><p class="rme-error" role="alert" hidden></p><div class="rme-foot"><button class="rme-restore" type="button">恢复原始结果</button><button class="rme-cancel" type="button">取消</button><button class="rme-save" type="button">保存修改</button></div>';
 document.body.append(dialog);
 const picker=dialog.querySelector('select'),content=dialog.querySelector('.rme-content'),error=dialog.querySelector('.rme-error'),saveButton=dialog.querySelector('.rme-save');
 picker.innerHTML=registry.map(r=>`<option value="${r.id}">${esc(r.title)}${['locked','readonly','aggregate'].includes(r.kind)?'（只读）':''}</option>`).join('');
 let current=null,draft=null,trigger=null,entryScroll=null;
 const attendanceDefault={arrival:'13:27',departure:'16:32',late:false,early:true};
 const defaultFor=r=>r.kind==='attendance'?clone(attendanceDefault):r.kind==='events'?{removed:[]}:r.kind==='text'?{summary:r.original}:{};
 const stateFor=r=>({...defaultFor(r),...saved[r.id]});
 const active=r=>r.events.filter(e=>!stateFor(r).removed.includes(e.id));
 function notice(text){let node=document.querySelector('.rme-status');if(!node){node=document.createElement('div');node.className='rme-status';node.setAttribute('role','status');document.body.append(node)}node.textContent=text;clearTimeout(notice.timer);notice.timer=setTimeout(()=>node.remove(),2600)}
 function showError(text){error.hidden=!text;error.textContent=text}
 const attendanceSummary=a=>`计划13:30上课，教师${a.arrival}到课，${a.late?'迟到'+(minutes(a.arrival)-810)+'分钟':'未迟到'}；计划16:35下课，教师${a.departure}离开，${a.early?'早退'+(995-minutes(a.departure))+'分钟':'未早退'}。`;
 function render(){
  showError('');const r=current;saveButton.hidden=['locked','readonly','aggregate'].includes(r.kind);dialog.querySelector('.rme-restore').hidden=!saved[r.id];
  if(r.kind==='attendance'){
   content.innerHTML=`<h3>修正教师到离记录</h3><p class="rme-note">课表时间 13:30–16:35。迟到和早退时长按修正后的时间计算。</p><div class="rme-grid"><label class="rme-field">到课状态<select name="late"><option value="false">未迟到</option><option value="true">迟到</option></select></label><label class="rme-field">实际到课时间<input name="arrival" type="time" required value="${esc(draft.arrival)}"></label><label class="rme-field">离开状态<select name="early"><option value="true">早退</option><option value="false">未早退</option></select></label><label class="rme-field">实际离开时间<input name="departure" type="time" required value="${esc(draft.departure)}"></label></div><div class="rme-preview" aria-live="polite"></div>`;
   for(const name of ['late','early'])content.querySelector(`[name=${name}]`).value=String(draft[name]);updateAttendance();
  }else if(r.kind==='events'){
   const deleted=new Set(draft.removed);
   content.innerHTML=`<h3>核对识别时间点</h3><p class="rme-note">仅可删除具体时间点，行为类型、时间和原始记录不可改写。删除后可撤销，保存后同步更新对应次数。</p><p class="rme-note">保留 ${r.events.length-deleted.size} 条 · 已删除 ${deleted.size} 条</p>${r.events.length?r.events.map(e=>`<article class="rme-event ${deleted.has(e.id)?'is-removed':''}"><time>${esc(e.time)}</time><p>${esc(e.text)}</p><button type="button" data-rme-event="${e.id}">${deleted.has(e.id)?'撤销':'删除'}</button></article>`).join(''):'<p class="rme-empty">未识别到可删除的时间点。</p>'}`;
  }else if(r.kind==='text'){
   content.innerHTML=`<h3>修订分析结论和建议</h3><p class="rme-note">保留原始证据、图表与评分，修改后的文字会替换报告中的分析说明。</p><label class="rme-field">分析说明<textarea name="summary" maxlength="800">${esc(draft.summary)}</textarea></label><p class="rme-note">最多800字</p>`;
  }else content.innerHTML=`<h3>${esc(r.title)}</h3><p class="rme-empty">${r.kind==='locked'?'此指标不支持修改，保留原始分析结果。':r.kind==='aggregate'?'当前只有行为汇总次数，未提供对应时间点，不能直接修改次数。课堂实录中的学生规范可逐条删除已识别的时间点。':'此模块的图表和统计结果保持只读。'}</p>`;
 }
 function updateAttendance(){const a=Number.isFinite(minutes(draft.arrival))&&Number.isFinite(minutes(draft.departure));content.querySelector('.rme-preview').textContent=a?attendanceSummary(draft):'请填写完整时间。'}
 function choose(id){current=registry.find(r=>r.id===id)||registry[0];picker.value=current.id;draft=clone(stateFor(current));render()}
 function open(id,button){if(document.querySelector('dialog[open]'))return;trigger=button;entryScroll={x:scrollX,y:scrollY};choose(id);dialog.showModal();picker.focus()}
 picker.addEventListener('change',()=>{
  if(JSON.stringify(draft)!==JSON.stringify(stateFor(current))){picker.value=current.id;showError('当前修改尚未保存，请先保存，或取消后重新选择模块。');return}
  choose(picker.value);
 });
 content.addEventListener('input',e=>{const name=e.target.name;if(!name)return;draft[name]=['late','early'].includes(name)?e.target.value==='true':e.target.value;if(current.kind==='attendance')updateAttendance()});
 content.addEventListener('click',e=>{const button=e.target.closest('[data-rme-event]');if(!button)return;const id=button.dataset.rmeEvent;draft.removed=draft.removed.includes(id)?draft.removed.filter(x=>x!==id):[...draft.removed,id];render();content.querySelector(`[data-rme-event="${id}"]`)?.focus({preventScroll:true})});
 for(const selector of ['.rme-close','.rme-cancel'])dialog.querySelector(selector).addEventListener('click',()=>dialog.close());
 dialog.addEventListener('close',()=>{trigger?.focus({preventScroll:true});if(entryScroll)window.scrollTo({...{left:entryScroll.x,top:entryScroll.y},behavior:'instant'})});
 function persist(next){try{localStorage.setItem(storageKey,JSON.stringify(next));saved=next;return true}catch{showError('浏览器未能保存修改，请重试。');return false}}
 saveButton.addEventListener('click',()=>{
  if(!['attendance','events','text'].includes(current.kind))return;
  if(current.kind==='attendance'){
   const a=minutes(draft.arrival),d=minutes(draft.departure);
   if(!Number.isFinite(a)||!Number.isFinite(d)||a>=d)return showError('请填写有效的到离时间，离开时间须晚于到课时间。');
   if(draft.late!==(a>810)||draft.early!==(d<995))return showError('状态与时间不一致：13:30后到课为迟到，16:35前离开为早退。');
  }
  if(current.kind==='text'&&!draft.summary.trim())return showError('分析说明不能为空。');
  if(!persist({...saved,[current.id]:clone(draft)}))return;
  applyAll();dialog.close();notice('已保存到当前报告');
 });
 dialog.querySelector('.rme-restore').addEventListener('click',()=>{const next={...saved};delete next[current.id];if(!persist(next))return;applyAll();choose(current.id);notice('已恢复原始结果')});
 const entry=document.createElement('button');entry.type='button';entry.className='rme-entry';entry.textContent='修改报告';entry.addEventListener('click',()=>open(registry[0].id,entry));document.body.append(entry);
 const pencil='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><path d="m14.5 5.5 4 4M4 20l4.8-1.1L20 7.7a2.8 2.8 0 0 0-4-4L4.9 14.9 4 20Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 20h7" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/></svg>';
 const attachEdit=(node,id,label)=>{
  node.classList.add('rme-editable');
  const button=document.createElement('button');button.type='button';button.className='rme-module-edit';button.innerHTML=pencil;button.setAttribute('aria-label',label);button.title=label;
  button.addEventListener('click',e=>{e.stopPropagation();open(id,button)});node.append(button);
 };
 for(const r of registry){
  if(['locked','readonly','aggregate'].includes(r.kind)||r.id.startsWith('recording-'))continue;
  const heading=r.node?.querySelector('.section-heading,.heading');if(!heading)continue;
  attachEdit(r.node,r.id,'修改'+r.title);
 }
 attachEdit(recording,'recording-teacher','修改课堂异常行为');
 function showEvidence(r,button){
  const target=document.getElementById('detail-dialog');if(target.open)return;
  const scroll={left:scrollX,top:scrollY};document.getElementById('dialog-title').textContent=r.title;document.getElementById('dialog-eyebrow').textContent='修订后的报告记录';
  document.getElementById('dialog-body').innerHTML=r.kind==='attendance'?`<p>${esc(attendanceSummary(stateFor(r)))}</p>`:active(r).map(e=>`<article class="rme-event"><time>${esc(e.time)}</time><p>${esc(e.text)}</p></article>`).join('')||'<p>当前没有保留的识别时间点。</p>';
  target.showModal();target.addEventListener('close',()=>{button?.focus({preventScroll:true});window.scrollTo({...scroll,behavior:'instant'})},{once:true});
 }
 // Modified records use the same flat evidence surface rather than the stale original list.
 document.addEventListener('click',event=>{
  const button=event.target.closest('button');if(!button||button.closest('#rme-dialog')||button.classList.contains('rme-module-edit'))return;
  const r=registry.find(r=>saved[r.id]&&['attendance','events'].includes(r.kind)&&r.node?.contains(button)&&
   (r.id.startsWith('recording-')?(button.dataset.anomalyId&&r.events.some(x=>x.id===button.dataset.anomalyId))||button.dataset.anomalyWho===r.id.replace('recording-',''):button.matches('[data-attendance-event],[data-v12-result],[data-cm-event],[data-cm-open],[data-anomaly-row]')));
  if(r){event.preventDefault();event.stopImmediatePropagation();showEvidence(r,button)}
 },true);
 function applyAll(){
  for(const r of registry){
   const changed=!!saved[r.id],s=stateFor(r);
   if(r.kind==='text'&&r.paragraph)r.paragraph.textContent=changed?s.summary:r.original;
   if(r.kind==='attendance'){
    const text=changed?attendanceSummary(s):r.original;if(r.paragraph)r.paragraph.textContent=text;
    const track=r.node.querySelector('.attitude-attendance-track');const axis=r.node.querySelector('.attitude-attendance-axis');
    if(!r.originalAxis)r.originalAxis=axis.innerHTML;
    const a=minutes(s.arrival),d=minutes(s.departure),min=Math.min(810,a),max=Math.max(995,d),position=t=>(t-min)/(max-min)*100;
    for(const [name,time] of [['arrival',s.arrival],['departure',s.departure]]){const n=r.node.querySelector(`[data-attendance-event="${name}"]`);n.style.left=position(minutes(time))+'%';n.title=(name==='arrival'?'教师到课':'教师离开')+' · '+time;n.setAttribute('aria-label',n.title+'，打开课堂记录')}
    const interval=track.querySelector('.attitude-attendance-duration');interval.style.left=position(a)+'%';interval.style.width=(position(d)-position(a))+'%';
    axis.innerHTML=changed?Array.from({length:6},(_,i)=>{const time=Math.round(min+(max-min)*i/5);return `<span>${String(Math.floor(time/60)).padStart(2,'0')}:${String(time%60).padStart(2,'0')}</span>`}).join(''):r.originalAxis;
    const buttons=document.querySelectorAll('#attitude-basics [data-basic]');
    for(const [i,text] of [[0,s.late?'迟到'+(a-810)+'分钟':'准时上课'],[1,s.early?'早退'+(995-d)+'分钟':'未早退']]){const strong=buttons[i]?.querySelector('strong');if(strong)strong.textContent=changed?text:attitudeData.basics[i].value}
   }
   if(r.kind==='events'){
    for(const item of r.events)if(item.node){item.node.hidden=s.removed.includes(item.id);item.node.toggleAttribute('data-rme-removed',s.removed.includes(item.id))}
    if(!r.id.startsWith('recording-')&&r.paragraph)r.paragraph.textContent=changed?`保留${active(r).length}条识别时间点，已核除${s.removed.length}条。${r.id==='attitude-anomaly'?'手机用途需结合教学情境判断。':r.id==='attitude-sensitive'?'用语线索仍需结合原话和上下文复核。':'提醒次数不等于违规次数。'}`:r.original;
    if(r.id==='attitude-anomaly')r.node.querySelectorAll('.attitude-anomaly-row').forEach(row=>{const count=[...row.querySelectorAll('.attitude-anomaly-event')].filter(n=>!n.hasAttribute('data-rme-removed')).length;const b=row.querySelector('.attitude-anomaly-count');b.textContent=count+'次';b.setAttribute('aria-label',row.querySelector('.attitude-anomaly-label').textContent+' '+count+'次')});
   }
   if(r.node&&!r.id.startsWith('recording-')){
    let stamp=r.node.querySelector('.rme-stamp');if(changed&&!stamp){stamp=document.createElement('span');stamp.className='rme-stamp';stamp.textContent='已修订';r.node.querySelector('h2,h3')?.after(stamp)}if(!changed)stamp?.remove();
   }
   if(changed&&!r.id.startsWith('recording-'))window.__reportEditRowSummary[r.id]=r.kind==='attendance'?attendanceSummary(s):r.kind==='events'?r.paragraph.textContent:s.summary;
   else delete window.__reportEditRowSummary[r.id];
  }
  // Recording counts and category tags are recomputed from retained original event IDs.
  const retained=['teacher','student'].flatMap(who=>active(registry.find(r=>r.id==='recording-'+who)));
  recording.querySelector('.recording-anomaly-head span').textContent='共 '+retained.length+' 条';
  for(const [index,who] of ['teacher','student'].entries()){
   const r=registry.find(r=>r.id==='recording-'+who),list=active(r),article=recording.querySelectorAll('.recording-anomaly-summary article')[index];article.querySelector('strong').textContent=(who==='teacher'?'教师':'学生')+'异常 · '+list.length+' 次';
   article.querySelectorAll('[data-anomaly-type]').forEach(tag=>{const count=list.filter(e=>e.text===tag.dataset.anomalyType).length;tag.hidden=false;tag.disabled=count===0;tag.querySelector('b').textContent=count+'次';tag.setAttribute('aria-label',`${tag.dataset.anomalyType}，共${count}次`)});
  }
  const sensitive=registry.find(r=>r.id==='attitude-sensitive'),anomaly=registry.find(r=>r.id==='attitude-anomaly');
  for(const [index,r] of [[4,sensitive],[5,anomaly]]){
   const button=document.querySelector(`#attitude-basics [data-basic="${index}"]`),strong=button?.querySelector('strong');
   const count=active(r).length;if(strong)strong.innerHTML=count+'<small>次</small>';
   button?.setAttribute('aria-label',attitudeData.basics[index].label+'：'+count+'次，定位对应模块');
  }
  if(attitudeHeadline)attitudeHeadline.textContent=['attitude-attendance','attitude-sensitive','attitude-anomaly'].some(id=>saved[id])
   ?attendanceSummary(stateFor(registry.find(r=>r.id==='attitude-attendance')))+` 着装记录保持规范；保留${active(sensitive).length}条课堂用语线索、${active(anomaly).length}条教师异常行为记录，需结合教学情境核查。`
   :originalHeadline;
  window.__reportEditState=clone(saved);
  document.dispatchEvent(new Event('report:edited'));
 }
 applyAll();
 document.documentElement.dataset.reportEditing='ready';
 return true;
}
