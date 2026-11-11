const esc = s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const seconds=s=>s.split(':').reduce((a,n)=>a*60+Number(n),0), total=3290;
const names=['教学目标','教学重难点'];
const frameUrl=time=>new URL(`previews/outline-match-20261111/frames/${time}.jpg`,import.meta.url).href;
export function openOutlineEvidence(m,i,selected,trigger,alignment=[]){
 const dialog=document.createElement('dialog');
 dialog.className='outline-evidence-dialog';
 dialog.setAttribute('aria-labelledby','outline-evidence-title');
 document.body.append(dialog);
 let stop;
 dialog.addEventListener('close',()=>{stop?.();dialog.remove();trigger?.focus({preventScroll:true});},{once:true});
 const refs=[...new Map(m.keypoints.flatMap(p=>p.references).map(r=>[r.time,r])).values()].sort((a,b)=>seconds(a.time)-seconds(b.time));
 const player=`<div class="player"><div class="screen"><img alt="所选证据时刻的课堂截图"><span class="camera">教师全景</span><button class="center-play" data-play aria-label="播放截图序列">▶</button><div class="controls"><button data-play aria-label="播放截图序列">▶</button><span class="clock"></span><span class="frame-label">截图预览</span><button class="full" aria-label="全屏预览">⛶</button></div></div><div class="ticks"><span>00:00</span><span>11:00</span><span>22:00</span><span>33:00</span><span>44:00</span><span>54:50</span></div><div class="track" aria-label="证据时间轴">${refs.map(r=>`<button data-time="${r.time}" style="--at:${seconds(r.time)/total*100}%" aria-label="定位至 ${r.time}"></button>`).join('')}</div></div>`;
 dialog.innerHTML=`<header><h2 id="outline-evidence-title">${names[i]}${trigger?.matches('.cg-score')?`<small class="evidence-overall">总体大纲匹配度 <strong>${m.overall_match_score}%</strong></small>`:''}</h2><button autofocus class="close" aria-label="关闭">×</button></header><div class="dialog-grid">${player}<div class="evidence" tabindex="0" aria-label="课堂证据">${m.keypoints.map((p,j)=>`<section data-evidence="${j}"><div class="evidence-heading"><h3>${esc(alignment[j]?.outline ?? p.title)}</h3></div><p class="evidence-analysis"><strong class="evidence-label">大纲匹配度：</strong>${p.match_score}%</p>${alignment[j]?`<p class="evidence-analysis"><strong class="evidence-label">匹配情况：</strong>${esc(alignment[j].analysis)}</p>`:''}${p.references.map(r=>`<button class="quote" data-time="${r.time}"><span>⏵ ${r.time}</span><span class="quote-text">${esc(r.text)}</span></button>`).join('')}</section>`).join('')}</div></div>`;
 let current,timer;
 const select=(time,source,scroll=false)=>{
  current=time;dialog.querySelector('.screen img').src=`${frameUrl(seconds(time))}`;dialog.querySelector('.clock').textContent=`${time} / 54:50`;
  const quotes=[...dialog.querySelectorAll(`.quote[data-time="${time}"]`)];
  const active=source?.matches('.quote')?source:quotes[0];
  dialog.querySelectorAll('[data-time]').forEach(x=>x.setAttribute('aria-pressed',String(x===active||(x.parentElement.classList.contains('track')&&x.dataset.time===time))));
  if(scroll&&active){const list=dialog.querySelector('.evidence');list.scrollTop+=active.closest('section').getBoundingClientRect().top-list.getBoundingClientRect().top;}
 };
 const paint=playing=>dialog.querySelectorAll('[data-play]').forEach(x=>{x.textContent=playing?'Ⅱ':'▶';x.setAttribute('aria-label',playing?'暂停截图序列':'播放截图序列');});
 stop=()=>{clearInterval(timer);timer=null;paint(false);};
 dialog.onclick=ev=>{
  const el=ev.target.closest('button');
  if(el?.matches('.close'))dialog.close();
  if(el?.dataset.time){stop();select(el.dataset.time,el,el.parentElement.classList.contains('track'));}
  if(el?.matches('[data-play]')){
   if(timer){stop();return;}paint(true);
   timer=setInterval(()=>select(refs[(refs.findIndex(r=>r.time===current)+1)%refs.length].time,null,true),2200);
  }
  if(el?.matches('.full')){const screen=dialog.querySelector('.screen');if(document.fullscreenElement)document.exitFullscreen();else screen.requestFullscreen?.().catch(()=>{});}
 };
 dialog.showModal();
 const first=dialog.querySelector(`[data-evidence="${selected}"] .quote`);select(first.dataset.time,first,true);
}
