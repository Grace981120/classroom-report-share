const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
let styleLoaded=false;
export function mountNewIndicator(root,after,{id,title,analysis,items,kind='',openDialog,eyebrow,augmentExisting=false}){
 if(!root)return;
 const existing=document.getElementById(id);
 if(existing&&!augmentExisting)return;
 if(!styleLoaded){const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('./new-indicator-modules.css',import.meta.url).href;document.head.append(link);styleLoaded=true;}
 const section=existing||document.createElement('section');
 if(!existing){section.id=id;section.className='card section new-indicator-card';section.setAttribute('aria-labelledby',id+'-title');}
 const content=`${existing?'<h3 class="new-indicator-subheading">教学投入观察</h3>':`<div class="section-heading"><h2 id="${id}-title">${esc(title)}</h2></div>`}<div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" alt="" width="16" height="16"><p>${esc(analysis)}</p></div><div class="new-indicator-grid ${kind}">${items.map((item,index)=>`<button type="button" class="new-indicator-tile" data-new-indicator="${index}" aria-label="${esc(item.name)}：${esc(item.result)}，查看判断依据">${item.tag?`<span class="new-indicator-tag">${esc(item.tag)}</span>`:''}<h3>${esc(item.name)}</h3><strong>${esc(item.result)}</strong><p>${esc(item.summary)}</p></button>`).join('')}</div>`;
 if(existing){const extension=document.createElement('div');extension.className='new-indicator-extension';extension.innerHTML=content;section.append(extension);}else{section.innerHTML=content;after?.after(section);}
 let trigger=null,scroll=0;
 const dialog=document.getElementById('detail-dialog');
 section.addEventListener('click',event=>{
  const button=event.target.closest('[data-new-indicator]');if(!button)return;
  const item=items[Number(button.dataset.newIndicator)];trigger=button;scroll=window.scrollY;
  const detail=`<div class="new-indicator-detail"><dl><dt>当前结果</dt><dd>${esc(item.result)}</dd><dt>观察对象</dt><dd>${esc(item.definition)}</dd><dt>可用依据</dt><dd>${esc(item.evidence)}</dd><dt>判定边界</dt><dd>${esc(item.boundary)}</dd></dl></div>`;
  openDialog(item.name,detail,eyebrow||title);
 });
 dialog?.addEventListener('close',()=>{if(!trigger)return;const opener=trigger;trigger=null;if(opener.isConnected){opener.focus({preventScroll:true});window.scrollTo({top:scroll,behavior:'instant'});}});
 return section;
}
