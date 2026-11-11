import {goalsStyles} from '../../content-goals-styles.js';
import {goalsGapStyles} from '../../content-goals-gap-styles.js';
import {openOutlineEvidence} from '../outline-match-20261111/evidence-dialog.js?v=goals19';
import {report,goalAlignment} from '../outline-match-20261111/data.js?v=challenges1';

function updateGoals(){
 const section=document.querySelector('#content-goals'),nodes=[...section?.querySelectorAll('.cg-node')??[]];
 const goals=report[0];
 if(nodes.length!==goals.keypoints.length)return false;
 if(section.dataset.goalsContentPreview)return true;
 section.dataset.goalsContentPreview='true';
 section.querySelector('.cg-root').textContent='目标';
 section.querySelector('.attitude-insight p').textContent=goals.evaluate_suggestions;
 const score=section.querySelector('.cg-score');
 score.querySelector('strong').firstChild.nodeValue=goals.overall_match_score;
 score.setAttribute('aria-label',`大纲匹配度${goals.overall_match_score}%，查看全部对照`);
 nodes.forEach((node,i)=>{
  const goal=goals.keypoints[i];
  node.querySelector('.cg-match b').textContent=`${goal.match_score}%`;
  const title=goalAlignment[i].outline;
  node.firstElementChild.textContent=title;
  node.setAttribute('aria-label',`${title}，匹配度${goal.match_score}%，查看依据`);
 });
 renderUncovered(section,goals.unmatched_keypoints);
 return true;
}
function renderUncovered(section,items){
 const gaps=section.querySelector('.cg-gaps');
 if(gaps){
  const heading=document.createElement('div');heading.className='cg-gap-heading';
  const title=document.createElement('h3');title.textContent='未涉及';heading.append(title);
  gaps.replaceChildren(heading);
  gaps.hidden=!items.length;
  const list=document.createElement('ul');list.className='cg-uncovered-list';gaps.append(list);
  let extraList;
  const remaining=items.length-1;
  if(remaining>0){
   const details=document.createElement('details');details.className='cg-uncovered-more';
   const summary=document.createElement('summary');
   summary.textContent=`展开其余 ${remaining} 项`;
   details.addEventListener('toggle',()=>{if(details.open)collapse.focus({preventScroll:true});});
   extraList=document.createElement('ul');extraList.className=list.className;
   const collapse=document.createElement('button');collapse.type='button';collapse.className='cg-uncovered-collapse';
   collapse.textContent='收起其余条目';
   collapse.addEventListener('click',()=>{details.open=false;summary.focus();});
   details.append(summary,extraList,collapse);gaps.append(details);
  }
  for(const [i,goal] of items.entries()){
   const row=document.createElement('li');
   const name=document.createElement('span');name.textContent=goal.title;
   const type=document.createElement('span');type.className='cg-category';type.textContent=goal.type;
   row.append(name,type);(i===0?list:extraList).append(row);
  }
 }
}
function updateChallenges(){
 const section=document.querySelector('#content-challenges'),map=section?.querySelector('.content-map');
 if(!map)return Boolean(section?.hasAttribute('data-challenges-content-preview'));
 const model=report[1],height=model.keypoints.length*88-12;
 section.dataset.challengesContentPreview='true';
 const score=document.createElement('button');score.type='button';score.className='cg-score';
 score.innerHTML=`大纲匹配度 <strong>${model.overall_match_score}<small>%</small></strong>`;
 score.setAttribute('aria-label',`大纲匹配度${model.overall_match_score}%，查看全部对照`);
 section.querySelector('.section-heading').append(score);
 const summary=section.querySelector('.attitude-insight p');if(summary)summary.textContent=model.evaluate_suggestions;
 const paths=model.keypoints.map((_,i)=>`<path d="M0 ${height/2} C28 ${height/2} 22 ${i*88+38} 50 ${i*88+38}"/>`).join('');
 const tree=document.createElement('div');tree.className='cg-map';
 tree.innerHTML=`<button type="button" class="cg-root" data-cg-all>重难点</button><div class="cg-connect"><svg viewBox="0 0 50 ${height}" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="challenge-gradient"><stop stop-color="#1d70f2"/><stop offset="1" stop-color="#e3edff"/></linearGradient></defs><g fill="none" stroke="url(#challenge-gradient)" stroke-width="8">${paths}</g></svg></div><div class="cg-list"></div>`;
 model.keypoints.forEach(p=>{
  const node=document.createElement('button');node.type='button';node.className='cg-node';
  node.innerHTML=`<span></span><span class="cg-meta"><span class="cg-category"></span><span class="cg-match">大纲匹配度 <b>${p.match_score}%</b></span></span>`;
  node.firstElementChild.textContent=p.title;node.querySelector('.cg-category').textContent=p.type;
  tree.querySelector('.cg-list').append(node);
 });
 const gaps=document.createElement('div');gaps.className='cg-gaps';
 map.replaceWith(tree,gaps);renderUncovered(section,model.unmatched_keypoints);
 return true;
}
const mount=()=>{const goals=updateGoals(),challenges=updateChallenges();return goals&&challenges;};
if(!mount()){
 const observer=new MutationObserver(()=>{if(mount())observer.disconnect();});
 observer.observe(document.body,{childList:true,subtree:true});
}

const layout=document.createElement('style');
layout.textContent=(goalsStyles+goalsGapStyles).replaceAll('#content-goals','#content-challenges[data-challenges-content-preview]')+`
#content-challenges[data-challenges-content-preview] .cg-score{margin-left:auto}

:is(#content-goals,#content-challenges) .cg-uncovered-more{margin-top:8px}
:is(#content-goals,#content-challenges) .cg-uncovered-more summary{cursor:pointer;width:fit-content;font-size:13px;color:var(--text-action)}
:is(#content-goals,#content-challenges) .cg-uncovered-more[open] summary{display:none}
:is(#content-goals,#content-challenges) .cg-uncovered-more .cg-uncovered-collapse{margin-top:8px;padding:0;border:0;background:none;color:var(--text-action);font:inherit;font-size:13px;cursor:pointer}

:is(#content-goals[data-goals-content-preview],#content-challenges[data-challenges-content-preview]) .cg-gaps{padding:0;border:0;background:none;margin-top:20px}
:is(#content-goals,#content-challenges) .cg-gaps .cg-gap-heading h3{color:var(--secondary);font-weight:600}
:is(#content-goals,#content-challenges) .cg-uncovered-list{margin:0;padding:0;list-style:none;display:grid;gap:8px;color:var(--secondary);font-size:14px;line-height:22px}
:is(#content-goals,#content-challenges) .cg-uncovered-list li{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:start;gap:12px;border:1px solid var(--border);background:#f8fafc;border-radius:8px;padding:10px 14px}
:is(#content-goals,#content-challenges) .cg-uncovered-list .cg-category{font-size:12px;line-height:20px;white-space:nowrap;background:none;color:var(--muted);padding:0;font-weight:400}


#content-goals[data-goals-content-preview]{container-type:inline-size}
@container (min-width:690px){
#content-goals[data-goals-content-preview] .cg-map:has(.cg-node:nth-child(4):last-child){
 grid-template-columns:minmax(0,1fr) 36px 94px 36px minmax(0,1fr);gap:12px 0;max-width:none
}
#content-goals[data-goals-content-preview] .cg-list{display:contents}
#content-goals[data-goals-content-preview] .cg-root{grid-area:1/3/3/4;z-index:1}
#content-goals[data-goals-content-preview] .cg-connect{grid-area:1/2/3/5}
#content-goals[data-goals-content-preview] .cg-node{z-index:1}
#content-goals[data-goals-content-preview] .cg-node:nth-child(1){grid-area:1/1}
#content-goals[data-goals-content-preview] .cg-node:nth-child(2){grid-area:2/1}
#content-goals[data-goals-content-preview] .cg-node:nth-child(3){grid-area:1/5}
#content-goals[data-goals-content-preview] .cg-node:nth-child(4){grid-area:2/5}
#content-goals[data-goals-content-preview] .cg-connect>svg:not(.cg-balanced){display:none}
}
.cg-balanced{display:none}
@container (min-width:690px){#content-goals .cg-connect>svg.cg-balanced{display:block}}
`;
document.head.append(layout);
const addBranches=()=>{
 const connector=document.querySelector('#content-goals[data-goals-content-preview] .cg-connect');
 if(!connector)return false;
 connector.insertAdjacentHTML('beforeend',`<svg class="cg-balanced" viewBox="0 0 166 200" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="cg-balance-left"><stop stop-color="#e3edff"/><stop offset="1" stop-color="#1d70f2"/></linearGradient><linearGradient id="cg-balance-right"><stop stop-color="#1d70f2"/><stop offset="1" stop-color="#e3edff"/></linearGradient></defs><g fill="none" stroke-width="7"><path stroke="url(#cg-balance-left)" d="M36 100 C17 100 22 50 0 50 M36 100 C17 100 22 150 0 150"/><path stroke="url(#cg-balance-right)" d="M130 100 C149 100 144 50 166 50 M130 100 C149 100 144 150 166 150"/></g></svg>`);
 return true;
};
if(!addBranches()){
 const observer=new MutationObserver(()=>{if(addBranches())observer.disconnect();});
 observer.observe(document.body,{childList:true,subtree:true});
}

document.addEventListener('click',event=>{
 const trigger=event.target.closest(':is(#content-goals[data-goals-content-preview],#content-challenges[data-challenges-content-preview]) :is(.cg-score,.cg-node,[data-cg-all])');
 if(!trigger)return;
 event.preventDefault();
 event.stopPropagation();
 const section=trigger.closest('#content-goals,#content-challenges'),i=Number(section.id==='content-challenges');
 const nodes=[...section.querySelectorAll('.cg-node')];
 openOutlineEvidence(report[i],i,Math.max(0,nodes.indexOf(trigger)),trigger,i?report[i].keypoints.map(p=>({analysis:p.reason})):goalAlignment);
},true);
