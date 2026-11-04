import {goalsData} from './content-goals-data.js';
import {contentData} from './content-data.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Authored matching examples using the existing demonstration outline, not a formal syllabus assessment.
export const challengeMatches=[
 {requirement:goalsData.items[0].requirement,page:8,score:90,indices:[0,3],reason:'发展历程与知识驱动、数据驱动均列入重难点；技术路线转变的条件仍可进一步明确。'},
 {requirement:goalsData.items[2].requirement,page:8,score:80,indices:[2,5],reason:'已将跨学科合作与表达列为重难点；项目方案成果及其评价标准尚未在重难点表述中明确。'},
 {requirement:goalsData.items[3].requirement,page:9,score:0,indices:[],reason:'当前重难点列表未列出模型评价方法与结果比较；这里只判断重难点设置，不据此认定课堂没有讲授。'}
];
export function mountChallengeMatch(root,{openDialog}){
 if(location.pathname.includes('/previews/'))return;
 const section=root.querySelector('#content-challenges');if(!section||section.querySelector('[data-challenge-match]'))return;
 const score=Math.round(challengeMatches.reduce((s,r)=>s+r.score,0)/challengeMatches.length);
 const wrap=document.createElement('div');wrap.className='ccm-heading';wrap.innerHTML=`<button type="button" data-challenge-match aria-label="教学重难点大纲匹配度${score}%，查看对照">大纲匹配度 <strong>${score}<small>%</small></strong></button><span class="ccm-help"><button type="button" aria-label="教学重难点大纲匹配度定义" aria-expanded="false">?</button><span>以本课对应的大纲要求为参照，观察重难点设置是否对应关键内容与要求层次。条目等权汇总，未列入要求计0，拓展内容不抵消遗漏；不代表课堂讲授覆盖率或学生掌握程度。</span></span>`;
 section.querySelector('.section-heading').append(wrap);
 const style=document.createElement('style');style.textContent=`#content-challenges .ccm-heading{display:flex;gap:8px;align-items:center}#content-challenges [data-challenge-match]{border:0;background:transparent;cursor:pointer;font:13px/24px inherit;font-family:inherit;color:var(--muted);padding:0}#content-challenges [data-challenge-match] strong{font-size:20px;color:#1d70f2;font-weight:600;margin-left:8px}#content-challenges [data-challenge-match] small{font-size:12px;margin-left:2px}#content-challenges .ccm-help{position:relative;display:inline-flex}#content-challenges .ccm-help>button{width:16px;height:16px;border:1px solid var(--supplementary);color:var(--muted);border-radius:50%;font:11px/14px sans-serif;padding:0;background:transparent;cursor:pointer}#content-challenges .ccm-help>span{display:none;position:absolute;right:0;top:24px;width:300px;max-width:70vw;font-size:12px;line-height:22px;padding:12px 14px;background:white;border:1px solid var(--border);border-radius:8px;box-shadow:0 4px 16px #24324718;z-index:5;color:var(--secondary)}#content-challenges .ccm-help:hover>span,#content-challenges .ccm-help:focus-within>span,#content-challenges .ccm-help.is-open>span{display:block}#content-challenges :focus-visible{outline:2px solid #1d70f2;outline-offset:3px}#detail-dialog .ccm-record{padding:20px 0;border-top:1px solid var(--border)}#detail-dialog .ccm-record h3{font-size:16px;line-height:26px;margin:0 0 10px}#detail-dialog .ccm-record p{font-size:14px;line-height:24px}#detail-dialog .ccm-record small{font-size:12px;color:var(--muted)}#detail-dialog .ccm-source{background:#f5f8fd;padding:12px 14px;border-radius:8px}#detail-dialog .ccm-summary{font-size:14px;line-height:24px;color:var(--secondary)}@media(max-width:600px){#content-challenges>.section-heading{flex-wrap:wrap;gap:12px}#content-challenges .ccm-heading{margin-left:auto}}`;
 style.textContent=style.textContent.replace('font:13px/24px inherit','font-size:13px;line-height:24px');document.head.append(style);
 const dialog=document.getElementById('detail-dialog');let trigger,scroll;
 wrap.querySelector('[data-challenge-match]').addEventListener('click',e=>{
 trigger=e.currentTarget;scroll={x:scrollX,y:scrollY};
 openDialog('教学重难点 · 大纲匹配度',`<p class="ccm-summary"><strong>大纲匹配度 ${score}%</strong><br>${esc(goalsData.outline)} · ${esc(goalsData.scope)}<br>三项要求等权：（90%＋80%＋0%）÷3≈57%。按大纲要求核对，重复列出的同一重难点不重复加分。</p>${challengeMatches.map(r=>`<article class="ccm-record"><h3>${r.indices.length?'部分匹配':'未列入'} · ${r.score}%</h3><small>大纲要求 · 第${r.page}页</small><p class="ccm-source">${esc(r.requirement)}</p><small>对应重难点</small><p>${r.indices.length?esc(contentData.challenges[r.indices[0]]):'当前重难点列表未找到对应内容。'}</p><p>${esc(r.reason)}</p></article>`).join('')}<article class="ccm-record"><h3>拓展内容</h3><p>${esc(contentData.challenges[1])}</p><p>当前三项大纲要求中没有直接对应条目，保留其拓展价值，不计入匹配度，也不抵消未列入的要求。</p></article>`,'教学内容 / 教学重难点');
 });
 wrap.querySelector('.ccm-help>button').addEventListener('click',e=>{const open=e.currentTarget.getAttribute('aria-expanded')!=='true';e.currentTarget.setAttribute('aria-expanded',open);e.currentTarget.parentElement.classList.toggle('is-open',open)});
 dialog.addEventListener('close',()=>{if(dialog.open||!trigger)return;const target=trigger;trigger=null;target.focus({preventScroll:true});window.scrollTo({left:scroll.x,top:scroll.y,behavior:'instant'})});
}
