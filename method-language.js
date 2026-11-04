import {languageExpressionModel as model} from './method-language-data.js?v=20261102-language-evaluation';
import {languageExpressionStyles} from './method-language-styles.js';
import {teachingLanguageVersion} from './method-language-version.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const highlight=(quote,needle)=>{
  const safe=esc(quote);if(!needle)return `<mark>${safe}</mark>`;
  return safe.replace(esc(needle),`<mark>${esc(needle)}</mark>`);
};
const statusClass=status=>status==='建议复核'||status==='不当停顿'||status==='卡顿/重复'?'is-review':status==='教学留白'?'is-pause':'is-clear';
const evidenceCard=(item,wholeSentence=false)=>`<article class="ml-evidence"><div class="ml-evidence-head"><span class="ml-tag ${statusClass(item.status)}">${esc(item.status)}</span><span class="ml-tag">${esc(item.speaker)}</span><time>${esc(item.start)}–${esc(item.end)} · ${esc(item.id)}</time></div><blockquote>“${highlight(item.quote,wholeSentence?null:item.highlight)}”</blockquote><p>${esc(item.context)}</p><p class="ml-basis"><strong>判断依据：</strong>${esc(item.reason)}</p></article>`;

export function mountTeachingLanguage(root,{openDialog}={}){
  if(!root||teachingLanguageVersion==='baseline')return ()=>{};
  const grid=root.querySelector('.method-language-grid');if(!grid)return ()=>{};
  const style=document.createElement('style');style.dataset.mlStyle='';style.textContent=languageExpressionStyles;root.append(style);
  const cards=[['pronunciation',model.pronunciation],['fluency',model.fluency]].map(([key,item])=>{
    const card=document.createElement('button');card.type='button';card.className='basic-stat';card.dataset.mlDetail=key;card.setAttribute('aria-label',`${item.name}：${item.value}，查看详情`);card.innerHTML=`<strong>${esc(item.value)}</strong><span>${esc(item.name)}</span>`;grid.append(card);return card;
  });
  const controller=new AbortController();
  root.addEventListener('click',event=>{
    const card=event.target.closest('[data-ml-detail]');if(!card||!root.contains(card)||typeof openDialog!=='function')return;
    const key=card.dataset.mlDetail;
    if(key==='pronunciation'){
      const item=model.pronunciation;
      openDialog(item.name,`<div class="ml-summary"><span>整体结果<strong>${esc(item.value)}</strong></span><span>适用语言<strong>${esc(item.language)}</strong></span><span>有效语音<strong>${esc(item.validAudio)}</strong></span><span>建议复核<strong>${item.reviewCount}处</strong></span></div>${item.evidence.map(e=>evidenceCard(e,e.status==='建议复核')).join('')}<div class="ml-missing">${esc(item.missing)}</div>`,'教学方法 / 语言表达');
    }else{
      const item=model.fluency;
      openDialog(item.name,`<div class="ml-summary"><span>整体结果<strong>${esc(item.value)}</strong></span><span>停顿或卡顿<strong>${item.eventCount}处</strong></span><span>可能影响连贯<strong>${item.impactCount}处</strong></span></div>${item.evidence.map(e=>evidenceCard(e)).join('')}`,'教学方法 / 语言表达');
    }
  },{signal:controller.signal});
  return ()=>{controller.abort();cards.forEach(card=>card.remove());style.remove();};
}
