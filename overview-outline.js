import {overviewOutlineVersion} from './overview-outline-version.js';
import {outlineKnowledge,outlineLessons,outlineStatus} from './overview-outline-data.js';

const escapeHTML = value => String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function mountOverviewOutline({openDialog}) {
  if(overviewOutlineVersion==='baseline') return;
  const score=document.querySelector('#overview .overall-score');
  if(!score || score.querySelector('[data-outline-open]')) return;
  const trigger=document.createElement('button');
  trigger.className='outline-score';
  trigger.type='button';
  trigger.dataset.outlineOpen='';
  trigger.setAttribute('aria-haspopup','dialog');
  trigger.innerHTML='<strong>42<small>%</small></strong><span>大纲知识覆盖率</span>';
  const context=score.querySelector('.score-context');
  if(context) context.hidden=true;
  score.insertBefore(trigger,context);

  let activeLesson='lesson-4';
  let activeNode='roc';
  let opener=null;
  const dialog=document.querySelector('#detail-dialog');

  const allNodes=()=>outlineKnowledge.flatMap(group=>group.nodes.map(node=>({...node,group:group.group,groupSource:group.source})));
  const nodeById=id=>allNodes().find(node=>node.id===id) || allNodes()[0];
  const lessonIndex=()=>outlineLessons.findIndex(lesson=>lesson.id===activeLesson);
  const statusFor=node=>node.status[lessonIndex()] || 'none';
  const evidenceLessonIndex=time=>time.startsWith('本次课')?outlineLessons.length-1:Number((time.match(/^第(\d+)次课/)||[])[1])-1;
  const visibleEvidence=node=>node.evidence.filter(([time])=>evidenceLessonIndex(time)<=lessonIndex());

  function bodyHTML() {
    const active=nodeById(activeNode);
    const status=statusFor(active);
    const evidence=visibleEvidence(active);
    return `<div class="outline-toolbar">
      <div class="outline-tabs" role="tablist" aria-label="选择课次">${outlineLessons.map(lesson=>`<button type="button" role="tab" data-outline-lesson="${lesson.id}" aria-selected="${lesson.id===activeLesson}" tabindex="${lesson.id===activeLesson?0:-1}">${lesson.label}</button>`).join('')}</div>
      <div class="outline-legend" aria-label="知识覆盖状态">${Object.entries(outlineStatus).map(([key,label])=>`<span><i class="is-${key}"></i>${label}</span>`).join('')}</div>
    </div>
    <div class="outline-layout">
      <div class="outline-tree" aria-label="课程大纲知识树">${outlineKnowledge.map(group=>`<section><div class="outline-branch"><h3>${escapeHTML(group.group)}</h3><span>${escapeHTML(group.source)}</span></div><div class="outline-nodes">${group.nodes.map(node=>{const nodeStatus=statusFor(node);return `<button type="button" class="outline-node is-${nodeStatus}${node.id===activeNode?' active':''}" data-outline-node="${node.id}" aria-pressed="${node.id===activeNode}"><i></i><span>${escapeHTML(node.name)}</span><small>${outlineStatus[nodeStatus]}</small></button>`}).join('')}</div></section>`).join('')}</div>
      <aside class="outline-evidence" aria-live="polite">
        <div class="outline-evidence-title"><span class="outline-state is-${status}">${outlineStatus[status]}</span><h3>${escapeHTML(active.name)}</h3></div>
        <dl><dt>大纲原文</dt><dd>${escapeHTML(active.source)}</dd><dt>大纲位置</dt><dd>${escapeHTML(active.groupSource)}</dd></dl>
        <h4>历次课证据</h4>
        ${evidence.length?`<ol>${evidence.map(([time,text])=>`<li><time>${escapeHTML(time)}</time><p>${escapeHTML(text)}</p></li>`).join('')}</ol>`:'<p class="outline-empty">截至所选课次，课堂记录中暂未发现对应讲解证据。</p>'}
      </aside>
    </div>`;
  }

  function bindDialog() {
    const body=dialog.querySelector('#dialog-body');
    body.querySelectorAll('[data-outline-lesson]').forEach(button=>button.addEventListener('click',()=>{activeLesson=button.dataset.outlineLesson;renderDialog();}));
    body.querySelectorAll('[data-outline-node]').forEach(button=>button.addEventListener('click',()=>{activeNode=button.dataset.outlineNode;renderDialog(button.dataset.outlineNode);}));
    const tabs=body.querySelector('.outline-tabs');
    tabs.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
      event.preventDefault();
      let index=lessonIndex();
      if(event.key==='Home') index=0; else if(event.key==='End') index=outlineLessons.length-1; else index=(index+(event.key==='ArrowRight'?1:-1)+outlineLessons.length)%outlineLessons.length;
      activeLesson=outlineLessons[index].id;
      renderDialog();
      dialog.querySelector(`[data-outline-lesson="${activeLesson}"]`).focus();
    });
  }

  function renderDialog(focusNode='') {
    dialog.querySelector('#dialog-body').innerHTML=bodyHTML();
    bindDialog();
    if(focusNode) dialog.querySelector(`[data-outline-node="${focusNode}"]`)?.focus({preventScroll:true});
  }

  trigger.addEventListener('click',()=>{
    opener=trigger;
    openDialog('课程大纲匹配',bodyHTML(),'课程进度');
    dialog.classList.add('outline-dialog');
    bindDialog();
  });
  dialog.addEventListener('close',()=>{
    if(!dialog.classList.contains('outline-dialog')) return;
    dialog.classList.remove('outline-dialog');
    opener?.focus({preventScroll:true});
    opener=null;
  });
}
