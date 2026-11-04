import {overviewRecordingMergeVersion} from './overview-recording-merge-version.js';
import {mountOverviewRefinement} from './overview-refinement.js?v=20261028-3';

export function mountOverviewRecordingMerge(){
  if(overviewRecordingMergeVersion==='baseline') return;
  const recording=document.querySelector('#recording');
  const overview=document.querySelector('#overview');
  const main=recording?.querySelector('.recording-main');
  const recordingLink=document.querySelector('.topbar a[href="#recording"]');
  const overviewLink=document.querySelector('.topbar a[href="#overview"]');
  const sidebar=recording?.querySelector('.recording-sidebar');
  if(!recording||!overview||!main||!recordingLink||!sidebar) return;

  document.body.classList.add('overview-recording-merge');
  recording.dataset.overviewRecordingMerge=overviewRecordingMergeVersion;
  recording.setAttribute('aria-label','报告总览');
  recordingLink.textContent='报告总览';
  overviewLink?.remove();

  const merged=document.createElement('div');
  merged.id='merged-overview';
  merged.setAttribute('aria-label','课堂评价报告总览');
  while(overview.firstChild) merged.append(overview.firstChild);
  main.append(merged);

  sidebar.hidden=true;
  sidebar.setAttribute('aria-label','督导评价：量表评价、智能导读、语音转写与PPT摘要');
  document.body.append(sidebar);
  const supervisionEntry=document.createElement('nav');
  supervisionEntry.id='supervision-reopen';
  supervisionEntry.className='supervision-rail';
  supervisionEntry.setAttribute('aria-label','督导评价快捷入口');
  supervisionEntry.innerHTML='<button type="button" class="supervision-rail-toggle" data-supervision-open aria-label="展开督导评价" title="展开督导评价"><svg viewBox="0 0 28 28" width="28" height="28" aria-hidden="true"><path d="M10 7h15M10 14h15M10 21h15M7 14H2m0 0 4-4m-4 4 4 4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="supervision-rail-items"><button type="button" data-supervision-tab="evaluation">量表<br>评价</button><button type="button" data-supervision-tab="guide">智能<br>导读</button><button type="button" data-supervision-tab="transcript">语音<br>转写</button></div>';
  document.body.append(supervisionEntry);
  let activeSupervisionTab='evaluation';
  let railTrigger=supervisionEntry.querySelector('[data-supervision-open]');
  const markRail=()=>supervisionEntry.querySelectorAll('[data-supervision-tab]').forEach(button=>{
    const selected=button.dataset.supervisionTab===activeSupervisionTab;
    button.classList.toggle('is-active',selected);
    if(selected)button.setAttribute('aria-current','true');else button.removeAttribute('aria-current');
  });
  const openSupervision=(key=activeSupervisionTab)=>{
    const tab=key==='guide'?sidebar.querySelector('[data-smart-guide-tab="guide"]'):sidebar.querySelector(`[data-rec-tab="${key}"]`);
    if(tab)switchSupervisionTab(tab);
    sidebar.hidden=false;
    supervisionEntry.hidden=true;
    document.body.classList.add('supervision-open');
    tab?.focus({preventScroll:true});
  };
  const closeSupervision=()=>{
    sidebar.hidden=true;
    supervisionEntry.hidden=false;
    document.body.classList.remove('supervision-open');
    markRail();
    railTrigger.focus({preventScroll:true});
  };
  const switchSupervisionTab=tab=>{
    const key=tab.dataset.smartGuideTab||tab.dataset.realTab||tab.dataset.recTab;
    activeSupervisionTab=key;
    const panelByKey={evaluation:'recording-evaluation',guide:'recording-smart-guide',transcript:'recording-transcript',knowledge:'recording-knowledge'};
    sidebar.querySelectorAll('.recording-sidebar-head [role="tab"]').forEach(button=>{
      const selected=button===tab;
      button.setAttribute('aria-selected',selected);
      button.tabIndex=selected?0:-1;
    });
    Object.entries(panelByKey).forEach(([name,id])=>{
      const panel=document.getElementById(id);
      if(panel)panel.hidden=name!==key;
    });
    markRail();
  };
  supervisionEntry.addEventListener('click',event=>{
    const button=event.target.closest('button');if(!button)return;
    railTrigger=button;
    openSupervision(button.dataset.supervisionTab||activeSupervisionTab);
  });
  sidebar.addEventListener('click',event=>{
    const tab=event.target.closest('.recording-sidebar-head [role="tab"]');
    if(!tab)return;
    event.preventDefault();
    event.stopImmediatePropagation();
    switchSupervisionTab(tab);
  },true);
  sidebar.querySelector('.recording-sidebar-head [role="tablist"]')?.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const tabs=[...sidebar.querySelectorAll('.recording-sidebar-head [role="tab"]')];
    const current=Math.max(0,tabs.indexOf(document.activeElement));
    const target=event.key==='Home'?tabs[0]:event.key==='End'?tabs.at(-1):tabs[(current+(event.key==='ArrowRight'?1:tabs.length-1))%tabs.length];
    switchSupervisionTab(target);
    target.focus();
  },true);
  sidebar.querySelector('.recording-collapse')?.addEventListener('click',event=>{
    event.preventDefault();
    event.stopImmediatePropagation();
    closeSupervision();
  },true);
  mountOverviewRefinement();
  markRail();
  openSupervision();
}
