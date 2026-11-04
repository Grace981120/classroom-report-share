import {contentQualityData as data} from './content-quality-data.js';
import {contentQualityStyles as styles} from './content-quality-styles.js';
import {teachingContentVersion} from './content-quality-version.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountContentQuality(root){
 if(!root||teachingContentVersion==='baseline'||teachingContentVersion==='1.2')return()=>{};
 const goals=root.querySelector('#content-goals-title'),challenges=root.querySelector('#content-challenges-title');
 const oldGoals=goals?.textContent,oldChallenges=challenges?.textContent;
 if(goals)goals.textContent='教学目标';if(challenges)challenges.textContent='教学重难点';
 root.querySelectorAll('[aria-label*="课程目标"]').forEach(e=>e.setAttribute('aria-label',e.getAttribute('aria-label').replaceAll('课程目标','教学目标')));
 root.querySelectorAll('[aria-label*="课程重难点"]').forEach(e=>e.setAttribute('aria-label',e.getAttribute('aria-label').replaceAll('课程重难点','教学重难点')));
 const style=document.createElement('style');style.dataset.cqStyle='';style.textContent=styles;root.append(style);
 const section=document.createElement('section');section.className='card section cq-section';section.id='content-quality';section.setAttribute('aria-labelledby','content-quality-title');
 section.innerHTML=`<div class="cq-heading"><div class="cq-title"><h2 id="content-quality-title">教学内容组织与质量</h2><button type="button" class="cq-help" data-cq-help aria-label="查看教学内容组织与质量定义">?</button></div><button type="button" class="cq-link" data-cq-all>查看详情 ›</button></div><div class="cq-list">${data.items.map(x=>`<button type="button" class="cq-row" data-cq-item="${x.id}" aria-label="${x.name}：${x.result}，查看详情"><span>${x.name}</span><strong>${x.result}</strong><em>›</em></button>`).join('')}</div>`;
 root.querySelector('#content-challenges')?.after(section);
 let modal=null,trigger=null,active=data.items[0].id;
 const item=()=>data.items.find(x=>x.id===active)||data.items[0];
 const tabs=()=>`<nav class="cq-tabs" role="tablist" aria-label="教学内容组织与质量观测点">${data.items.map(x=>`<button type="button" role="tab" data-cq-tab="${x.id}" aria-selected="${x.id===active}" tabindex="${x.id===active?0:-1}">${x.name.replace('内容','')}</button>`).join('')}</nav>`;
 const details=x=>`${tabs()}<div class="cq-result"><span>${x.name}</span><strong>${x.result}</strong><p>${x.summary}</p></div>${x.path?`<h3>知识推进路径</h3><div class="cq-chain">${x.path.map((r,i)=>`${i?'<i>→</i>':''}<article><time>${r[0]}</time>${esc(r[1])}</article>`).join('')}</div>`:''}${x.facts?`<h3>分析对照</h3><table class="cq-facts"><tbody>${x.facts.map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}</tbody></table>`:''}<h3>课堂原话</h3>${x.evidence.map(r=>`<div class="cq-evidence ${r[1]==='学生'?'is-student':''}"><time>${r[0]}</time><label>${r[1]}</label><p>${esc(r[2])}</p></div>`).join('')}<div class="cq-basis"><strong>判断依据</strong><p>${esc(x.reason)}</p></div>`;
 function ensure(){if(modal)return;modal=document.createElement('dialog');modal.className='cq-dialog';modal.setAttribute('aria-labelledby','cq-dialog-title');root.append(modal);modal.addEventListener('cancel',e=>{e.preventDefault();close()});modal.addEventListener('click',e=>{if(e.target===modal){const r=modal.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}})}
 function render(help=false){ensure();modal.innerHTML=`<div class="cq-head"><h2 id="cq-dialog-title">教学内容组织与质量</h2><button type="button" data-cq-close aria-label="关闭详情">×</button></div><div class="cq-body">${help?`<div class="cq-definitions">${data.items.map(x=>`<div><strong>${x.name}</strong><p>${esc(data.definitions[x.id])}</p></div>`).join('')}</div>`:details(item())}</div>`;if(!modal.open)modal.showModal();modal.querySelector('[data-cq-close]').focus({preventScroll:true})}
 function close(){if(!modal)return;modal.close();modal.remove();modal=null;if(trigger?.isConnected)trigger.focus({preventScroll:true})}
 root.addEventListener('click',e=>{const b=e.target.closest('[data-cq-item],[data-cq-all],[data-cq-help],[data-cq-tab],[data-cq-close]');if(!b)return;if('cqClose'in b.dataset){close();return}if(!b.dataset.cqTab)trigger=b;if('cqHelp'in b.dataset){render(true);return}if(b.dataset.cqItem)active=b.dataset.cqItem;if(b.dataset.cqTab)active=b.dataset.cqTab;render(false)});
 root.addEventListener('keydown',e=>{const tab=e.target.closest('[data-cq-tab]');if(!tab||!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const index=data.items.findIndex(x=>x.id===tab.dataset.cqTab);active=e.key==='Home'?data.items[0].id:e.key==='End'?data.items.at(-1).id:data.items[(index+(e.key==='ArrowRight'?1:data.items.length-1))%data.items.length].id;render(false);modal.querySelector(`[data-cq-tab="${active}"]`)?.focus({preventScroll:true})});
 return()=>{close();style.remove();section.remove();if(goals)goals.textContent=oldGoals;if(challenges)challenges.textContent=oldChallenges};
}
