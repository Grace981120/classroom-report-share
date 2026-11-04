import {contentAccuracyVersion} from './content-accuracy-version.js';
import {contentAccuracyData as data} from './content-accuracy-data.js';
import {contentAccuracyStyles} from './content-accuracy-styles.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

export function mountContentAccuracy(root){
  if(!root||contentAccuracyVersion==='baseline')return ()=>{};
  const challenges=root.querySelector('#content-challenges');
  if(!challenges||root.querySelector('#content-accuracy'))return ()=>{};
  const style=document.createElement('style');
  style.dataset.contentAccuracyStyle='';
  style.textContent=contentAccuracyStyles;
  document.head.append(style);
  const section=document.createElement('section');
  section.className='card section ca-section';
  section.id='content-accuracy';
  section.setAttribute('aria-labelledby','content-accuracy-title');
  section.innerHTML=`<div class="section-heading"><h2 id="content-accuracy-title">知识准确性</h2></div><div class="attitude-insight"><img src="assets/figma/content-img111111.svg" width="16" height="16" alt=""><p>${esc(data.insight)}</p></div><div class="ca-grid">${data.items.map(item=>`<button type="button" class="ca-card" data-ca-id="${item.id}" aria-label="${esc(item.title)}，${item.status}，查看证据"><h3>${esc(item.title)}</h3><span class="ca-status">${esc(item.status)}</span><p>${esc(item.summary)}</p></button>`).join('')}</div>`;
  challenges.after(section);
  // Other content modules may mount after initContent; keep accuracy immediately after practice.
  queueMicrotask(()=>{const practice=root.querySelector('#content-practice');if(section.isConnected&&practice)practice.after(section)});

  const dialog=document.createElement('dialog');
  dialog.className='ca-dialog';
  dialog.setAttribute('aria-labelledby','ca-dialog-title');
  document.body.append(dialog);
  let trigger=null,scrollY=0,previousOverflow='';
  function close(){if(dialog.open)dialog.close()}
  function open(button,item){
    trigger=button;scrollY=window.scrollY;previousOverflow=document.body.style.overflow;
    dialog.innerHTML=`<header class="ca-head"><h2 id="ca-dialog-title">${esc(item.title)}</h2><button type="button" class="ca-close" aria-label="关闭">×</button></header><div class="ca-body"><div class="ca-lead"><strong>知识表述核查</strong><span class="ca-status">${esc(item.status)}</span></div><div class="ca-block ca-quote"><div class="ca-meta">${esc(item.time)} · ${esc(item.speaker)}</div><h3>教师原话</h3><p>“${esc(item.quote)}”</p></div><h3 style="margin:18px 0 10px;font-size:14px">上下文</h3><div class="ca-context"><div class="ca-block"><h3>前文</h3><p>${esc(item.before)}</p></div><div class="ca-block"><h3>后文</h3><p>${esc(item.after)}</p></div></div><div class="ca-block ca-formula"><h3>课件公式对照</h3><p>${esc(item.slide)}</p></div><div class="ca-block"><h3>待核查判断</h3><p>${esc(item.judgment)}</p></div><div class="ca-block"><h3>修正建议</h3><p>${esc(item.suggestion)}</p></div></div>`;
    dialog.querySelector('.ca-close').addEventListener('click',close);
    document.body.style.overflow='hidden';dialog.showModal();dialog.querySelector('.ca-close').focus({preventScroll:true});
  }
  section.addEventListener('click',event=>{const button=event.target.closest('[data-ca-id]');if(!button)return;const item=data.items.find(entry=>entry.id===button.dataset.caId);if(item)open(button,item)});
  dialog.addEventListener('cancel',event=>{event.preventDefault();close()});
  dialog.addEventListener('click',event=>{if(event.target!==dialog)return;const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)close()});
  dialog.addEventListener('close',()=>{document.body.style.overflow=previousOverflow;window.scrollTo(0,scrollY);trigger?.focus({preventScroll:true})});
  return ()=>{close();dialog.remove();section.remove();style.remove()};
}
