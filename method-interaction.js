import {interactionModel,calculateFlanders,axisLabels,codingLabels,codingStart} from './method-interaction-data.js';
import {interactionStyles} from './method-interaction-styles.js';
import {interactionDashboardStyles} from './method-interaction-dashboard-styles.js';
import {teachingInteractionVersion} from './method-interaction-version.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=s=>[Math.floor(s/3600),Math.floor(s/60)%60,Math.floor(s)%60].map(n=>String(n).padStart(2,'0')).join(':');
const button=(attrs,label,cls='mi-link')=>`<button type="button" ${attrs} class="${cls}">${label}</button>`;
const empty=(title,body)=>`<div class="mi-empty"><strong>${title}</strong>${body}</div>`;
const categories=[['active','学生主动提问'],['response','积极回应'],['continued','互动延续']];
const activeMounts=new WeakMap();
export function mountTeachingInteraction(root,model=interactionModel,{force=false}={}){
 if(!root||(!force&&teachingInteractionVersion==='baseline'))return ()=>{};
 const original=root.innerHTML,controller=new AbortController(),signal=controller.signal;
 const owner={},previousOwner=activeMounts.get(root);activeMounts.set(root,owner);root.querySelectorAll('.mi-inline,style[data-mi-style]').forEach(e=>e.remove());
 const title=root.querySelector('h2');if(title)title.textContent='师生互动';
 const stats=model.codingStatus==='available'?calculateFlanders(model.sequence):null;
 const events=model.eventStatus==='available'?model.events:[];
 let modal=null,trigger=null,tab='flanders',filter='all',view='summary',chosen=null,listScroll=0;
 const labels=e=>[...categories.filter(([k])=>e[k]).map(([,n])=>n),...(e.uncertain?['待核对']:[])];
 const tags=e=>`<div class="mi-tags">${labels(e).map(t=>`<span>${t}</span>`).join('')}</div>`;
 function radar(){
  if(!stats||!stats.total)return empty('暂无可用编码结果','补充完整课堂话语及编码后，可查看互动结构。');
  const point=(i,v)=>[175+Math.sin(i*Math.PI*2/5)*92*v,143-Math.cos(i*Math.PI*2/5)*92*v];
  const poly=values=>values.map((v,i)=>point(i,v??0).map(n=>n.toFixed(1)).join(',')).join(' ');
  const svg=`<svg viewBox="0 0 350 290" role="img" aria-label="弗兰德斯互动分析，查看数据解读"><g fill="none" stroke="#e5ebf3">${[.2,.4,.6,.8,1].map(v=>`<polygon points="${poly(Array(5).fill(v))}"/>`).join('')}${axisLabels.map((_,i)=>`<path d="M175 143L${point(i,1).join(' ')}"/>`).join('')}</g>${model.reference?`<polygon points="${poly(model.reference)}" fill="none" stroke="#1d70f2" stroke-width="3" stroke-dasharray="7 5"/>`:''}<polygon points="${poly(stats.normalized)}" fill="#00cc7e22" stroke="#00cc7e" stroke-width="3"/>${axisLabels.map((n,i)=>`<text x="${point(i,1.3)[0]}" y="${point(i,1.3)[1]}" text-anchor="middle">${n}</text>`).join('')}</svg>`;
  return `<div class="mi-radar">${button('data-mi-open="flanders"',svg,'mi-radar-button')}<div class="mi-legend"><span><i></i>当前值</span>${model.reference?'<span><i class="ref"></i>参考值</span>':''}</div></div>`;
 }
 root.insertAdjacentHTML('beforeend',`<style data-mi-style>${interactionStyles}${interactionDashboardStyles}</style>`);
 const grid=root.querySelector('.method-interaction-grid'),originalCards=[...grid.children],icon=originalCards[0]?.querySelector('.method-info')?.innerHTML||'ⓘ';
 const charts=originalCards.map(card=>card.querySelector('.method-chart-button')).filter(Boolean);
 const flandersCard=document.createElement('section');flandersCard.className='mi-section mi-inline mi-dashboard-card';flandersCard.innerHTML=`<div class="mi-heading"><h3>弗兰德斯互动分析 ${button('data-mi-open="flanders" aria-label="弗兰德斯指标定义"','ⓘ')}</h3></div>${radar()}`;
 const combined=document.createElement('section');combined.className='mi-dashboard-card mi-combined';combined.innerHTML=`<div class="mi-dashboard-head"><h3>S-T/Rt-Ch分析 <button type="button" class="method-info" data-method-info="rt" aria-label="Rt-Ch分析说明">${icon}</button></h3><div class="mi-switch" role="tablist" aria-label="互动结构分析图"><button type="button" role="tab" data-mi-chart="st" aria-selected="false" tabindex="-1">S-T分析</button><button type="button" role="tab" data-mi-chart="rt" aria-selected="true">Rt-Ch分析</button></div></div><div class="mi-chart-panel"></div>`;
 charts.forEach((chart,i)=>{chart.dataset.miChartPanel=i?'rt':'st';chart.hidden=!i;combined.querySelector('.mi-chart-panel').append(chart);});
 const count=k=>events.filter(e=>e[k]).length;
 grid.replaceChildren(flandersCard,combined);
 grid.insertAdjacentHTML('beforebegin',`<div class="mi-module-analysis"><b>✦</b><span>本课呈对话型互动结构，识别到${count('active')}次学生主动提问、${count('response')}次积极回应和${count('continued')}次互动延续。</span></div>`);
 function ensureModal(){if(modal)return;modal=document.createElement('dialog');modal.className='mi-dialog';modal.setAttribute('aria-labelledby','mi-title');root.append(modal);modal.addEventListener('cancel',e=>{e.preventDefault();close();},{signal});modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}},{signal});}
 function close(){if(modal){modal.close();modal.remove();modal=null;}if(trigger?.isConnected)trigger.focus({preventScroll:true});chosen=null;view='summary';}
 const value=(n,i)=>n===null?'—':i===0?n.toFixed(2):`${(n*100).toFixed(1)}%`;
 function flanders(){
  if(!stats||!stats.total)return empty('暂无可用编码结果','补充完整课堂话语及编码后，可查看互动结构。');
  const definitions=['间接影响编码1–4 ÷ 直接影响编码5–7','学生话语后仍为学生话语的相邻对 ÷ 以学生话语起始的相邻对','提问与讲授编码4–5 ÷ 有效言语编码1–9','学生话语编码8–9 ÷ 全部编码1–10','教师提问编码4 ÷ 教师话语编码1–7'];
  return `<p class="mi-note">分析时段 ${time(codingStart)}–${time(codingStart+stats.total*3)} · ${stats.total}个编码单元</p><div class="mi-analysis"><strong>✦ 互动结构解读</strong><p>学生话语占${value(stats.values[3],3)}，教师话语中的提问占${value(stats.values[4],4)}。可结合学生原话核对表达与讨论过程。</p></div><div class="mi-table-wrap"><table class="mi-table"><thead><tr><th>指标</th><th>当前值</th><th>参考值</th><th>计算依据</th></tr></thead><tbody>${axisLabels.map((n,i)=>`<tr><td>${n}</td><td>${value(stats.values[i],i)}</td><td>${model.reference?value(model.reference[i]*(i===0?2:1),i):'—'}</td><td>${stats.fractions[i]}</td></tr>`).join('')}</tbody></table></div><p class="mi-note">雷达径向范围：启发／指导比0–2，其余指标0–100%。参考值用于对照，不作为达标线。分母为0时不计算该项。</p><h3>统计口径</h3>${definitions.map((d,i)=>`<p class="mi-note"><strong>${axisLabels[i]}：</strong>${d}。</p>`).join('')}<p class="mi-note">每3秒一个编码单元；编码10为沉默或混乱。结构比例不直接代表互动积极性。</p>${button('data-mi-codes','查看编码记录 ›')}`;
 }
 function rows(items){return items.map(e=>button(`data-mi-event="${e.id}"`,`<time>${time(e.start)}</time><div><strong>${esc(e.title)}</strong>${tags(e)}</div><span class="mi-open">查看互动详情 ›</span>`,'mi-event')).join('')||empty('未识别到符合条件的片段','可切换其他类别查看已分析记录。');}
 function initiative(){if(model.eventStatus!=='available')return empty('暂无法分析学生互动表现','缺少清晰的学生发言记录，补充完整发言后可查看互动证据。');
  const qs=events.filter(e=>filter==='all'||e[filter]);
  return `<div class="mi-heading"><h3>互动片段 · ${qs.length}个</h3><div class="mi-filters" aria-label="互动证据筛选">${[['all','全部'],...categories,['uncertain','待核对']].map(([k,n])=>button(`data-mi-filter="${k}" aria-pressed="${filter===k}"`,n,'')).join('')}</div></div>${rows(qs)}`;
 }
 function evidence(){const e=events.find(x=>x.id===chosen);if(!e)return empty('暂无对应片段','请返回列表查看其他记录。');return `${button('data-mi-return','‹ 返回互动列表','mi-link mi-back')}<h3>${esc(e.title)}</h3>${tags(e)}${e.turns.map(([id,t,role,text,note])=>`<div id="mi-${id}" class="mi-turn ${role.startsWith('学生')?'student':''}" tabindex="-1"><time>${time(t)}</time><label>${role}</label><p>${esc(text)}<small>${esc(note)}</small></p></div>`).join('')}<div class="mi-analysis" style="margin-top:20px"><strong>判断依据</strong><p>${esc(e.reason)}</p></div>${button(`data-mi-locate="mi-${e.turns[0][0]}"`,`定位原话 ${time(e.start)}–${time(e.end)}`)}`;}
 function codes(){return `${button('data-mi-return','‹ 返回数据解读','mi-link mi-back')}<h3>课堂话语编码 · ${stats.total}个单元</h3><div class="mi-table-wrap"><table class="mi-table"><thead><tr><th>编码</th><th>类别</th><th>单元数</th></tr></thead><tbody>${codingLabels.map((n,i)=>`<tr><td>${i+1}</td><td>${n}</td><td>${stats.counts[i]}</td></tr>`).join('')}</tbody></table></div><div class="mi-code-list">${model.sequence.map((c,i)=>`<div class="mi-code"><time>${time(codingStart+i*3)}</time>${c} · ${codingLabels[c-1]}</div>`).join('')}</div>`;}
 function render(){ensureModal();const title=view==='evidence'?'互动片段证据':tab==='flanders'?'弗兰德斯数据解读':'互动积极性证据';modal.innerHTML=`<div class="mi-dialog-head"><h2 id="mi-title">${title}</h2>${button('data-mi-close aria-label="关闭详情"','×','')}</div><div class="mi-dialog-body">${view==='summary'?(tab==='flanders'?flanders():initiative()):view==='codes'?codes():evidence()}</div>`;if(!modal.open)modal.showModal();}
 root.addEventListener('click',e=>{if(activeMounts.get(root)!==owner)return;const target=e.target.closest('button');if(!target||!root.contains(target))return;const d=target.dataset;
  if(d.miChart){const selected=d.miChart;root.querySelectorAll('[data-mi-chart]').forEach(el=>{const active=el.dataset.miChart===selected;el.setAttribute('aria-selected',String(active));el.tabIndex=active?0:-1;});root.querySelectorAll('[data-mi-chart-panel]').forEach(el=>el.hidden=el.dataset.miChartPanel!==selected);const info=root.querySelector('.mi-combined .method-info');info.dataset.methodInfo=selected;info.setAttribute('aria-label',`${selected==='st'?'S-T':'Rt-Ch'}分析说明`);}
  else if(d.miOpen){trigger=target;tab=d.miOpen;view='summary';filter='all';render();modal.querySelector('[data-mi-close]').focus({preventScroll:true});}
  else if('miClose'in d)close();
  else if(d.miFilter){filter=d.miFilter;const scroll=modal.querySelector('.mi-dialog-body').scrollTop;render();modal.querySelector('.mi-dialog-body').scrollTop=scroll;modal.querySelector(`[data-mi-filter="${filter}"]`).focus({preventScroll:true});}
  else if(d.miEvent){chosen=d.miEvent;listScroll=modal.querySelector('.mi-dialog-body').scrollTop;view='evidence';render();modal.querySelector('[data-mi-return]').focus({preventScroll:true});}
  else if('miCodes'in d){view='codes';render();modal.querySelector('[data-mi-return]').focus({preventScroll:true});}
  else if('miReturn'in d){view='summary';render();modal.querySelector('.mi-dialog-body').scrollTop=listScroll;const el=modal.querySelector(`[data-mi-event="${chosen}"]`)||modal.querySelector('[data-mi-codes]');el?.focus({preventScroll:true});}
  else if(d.miLocate){modal.querySelectorAll('.is-selected').forEach(x=>x.classList.remove('is-selected'));const el=modal.querySelector(`#${d.miLocate}`);el?.classList.add('is-selected');el?.focus({preventScroll:true});el?.scrollIntoView({block:'nearest'});}
 },{signal});
 root.addEventListener('keydown',e=>{if(activeMounts.get(root)!==owner)return;if(e.key==='Escape'&&modal){e.preventDefault();close();return;}const el=e.target.closest('[data-mi-chart]');if(el&&['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?'st':e.key==='End'?'rt':el.dataset.miChart==='st'?'rt':'st';root.querySelector(`[data-mi-chart="${next}"]`).click();root.querySelector(`[data-mi-chart="${next}"]`).focus();}},{signal});
 return ()=>{close();controller.abort();root.innerHTML=original;if(previousOwner)activeMounts.set(root,previousOwner);else activeMounts.delete(root);};
}
