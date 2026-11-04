import {teachingEffectVersion} from './effect-iteration-version.js';
import {mountFocusPreview} from './effect-focus.js';
import {effectTraces} from './effect-chart-assets.js';
export function mountEffectIteration(root,{openDialog}){
if(teachingEffectVersion==='baseline'||root.querySelector('#effect-state'))return;
const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./effect-iteration.css',import.meta.url).href;document.head.append(style);
const preservedSelectors=['.effect-gauge-grid','[data-effect-chart="monitoring"]','.effect-bars-anomalies','.effect-pyramid-layout','#effect-actions .effect-split','.effect-participation-layout','#effect-expressions .effect-split'];
const originals=preservedSelectors.map(selector=>({selector,node:root.querySelector(selector),html:root.querySelector(selector).outerHTML}));
const originalAi=root.querySelector('#effect-participation .attitude-insight');
const state=document.createElement('section');state.className='card section';state.id='effect-state';state.setAttribute('aria-labelledby','state-title');
state.innerHTML='<div class="section-heading"><h2 id="state-title">学生学习状态</h2><div class="state-tabs" role="tablist" aria-label="学生学习状态"><button role="tab" id="tab-focus" data-tab="focus" aria-controls="panel-focus" aria-selected="true">专注度</button><button role="tab" id="tab-participation" data-tab="participation" aria-controls="panel-participation" aria-selected="false" tabindex="-1">学习参与度</button><button role="tab" id="tab-expressions" data-tab="expressions" aria-controls="panel-expressions" aria-selected="false" tabindex="-1">学生表情</button></div></div><div class="state-stage"><div class="state-panel" id="panel-focus" role="tabpanel" aria-labelledby="tab-focus"></div><div class="state-panel" id="panel-participation" role="tabpanel" aria-labelledby="tab-participation" hidden></div><div class="state-panel" id="panel-expressions" role="tabpanel" aria-labelledby="tab-expressions" hidden></div></div>';
const focusAi=originalAi.cloneNode(true);focusAi.querySelector('p').textContent='当前缺少结合教学任务的专注表现证据，暂不作专注度判断。';state.querySelector('#panel-focus').append(focusAi);
state.querySelector('#panel-focus').insertAdjacentHTML('beforeend','<h3 class="state-focus-title">学生课堂专注表现</h3><div class="state-empty" role="status">暂无分析结果</div>');
for(const key of ['participation','expressions']){const source=root.querySelector('#effect-'+key);[...source.children].filter(n=>!n.classList.contains('section-heading')).forEach(n=>state.querySelector('#panel-'+key).append(n));source.id+='-legacy';source.hidden=true;const anchor=document.createElement('div');anchor.id='effect-'+key;anchor.className='effect-route-anchor';anchor.innerHTML='<h3>'+({'participation':'学习参与度','expressions':'学生表情'}[key])+'</h3>';state.querySelector('#panel-'+key).prepend(anchor);}
const footer=root.querySelector('footer');
for(const module of [root.querySelector('#effect-monitoring'),state,root.querySelector('#effect-anomalies'),root.querySelector('#effect-pyramid'),root.querySelector('#effect-actions')])root.insertBefore(module,footer);
root.querySelector('.attitude-summary p').textContent='学习活动以听讲、阅读和视听为主，讨论与同伴讲解提供了主动参与机会。建议结合手机使用、走动等时段核查任务匹配，并补充实践与个体反馈。';
root.querySelectorAll('.attitude-insight p').forEach(p=>{p.textContent=p.textContent.replace('本页示例实到','本课实到').replace('示例记录中，','课堂记录中，');});
function select(key){state.querySelectorAll('[data-tab]').forEach(t=>{const active=t.dataset.tab===key;t.setAttribute('aria-selected',String(active));t.tabIndex=active?0:-1;});state.querySelectorAll('.state-panel').forEach(p=>p.hidden=p.id!=='panel-'+key);}
state.querySelectorAll('[data-tab]').forEach(tab=>{tab.onclick=()=>select(tab.dataset.tab);tab.onkeydown=e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...state.querySelectorAll('[data-tab]')],i=tabs.indexOf(tab),n=e.key==='Home'?0:e.key==='End'?2:(i+(e.key==='ArrowRight'?1:2))%3;tabs[n].click();tabs[n].focus();};});
mountFocusPreview(root,{openDialog});
// Let original path geometry determine missing expression samples, not the overlay ranges.
effectTraces.expressions.gaps=[];
function onRoute(){const key=location.hash.slice(8);if(['participation','expressions'].includes(key)){select(key);requestAnimationFrame(()=>state.scrollIntoView({block:'start'}));}}
document.fonts.ready.then(onRoute);window.addEventListener('hashchange',onRoute);window.addEventListener('popstate',onRoute);
document.addEventListener('click',event=>{if(event.target.closest('a[href^="#effect"],[data-effect-target]'))queueMicrotask(onRoute);});
root.verifyOriginalCharts=()=>originals.map(({selector,node,html})=>({selector,identical:node.outerHTML===html}));
}
