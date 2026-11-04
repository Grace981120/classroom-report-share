import {attitudeIterationVersion} from './attitude-iteration-version.js';
import {methodData} from './method-data.js';
import {mountTeachingLanguage} from './method-language.js';
import {mountAttitudeIterationV11} from './attitude-iteration-v11.js';
import {mountAttitudeIterationV12} from './attitude-iteration-v12.js';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountAttitudeIteration(root,{openDialog}){
 if(attitudeIterationVersion==='1.2')return mountAttitudeIterationV12(root,{openDialog});
 if(attitudeIterationVersion==='1.1')return mountAttitudeIterationV11(root,{openDialog});
 if(attitudeIterationVersion==='baseline'||root.dataset.attitudeIteration)return;
 // If the independently versioned emotion module is disabled, retain the prior dimension.
 if(!root.querySelector('#attitude-emotion')?.shadowRoot)return;
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./attitude-iteration.css',import.meta.url).href;document.head.append(style);

const language=document.createElement('section');language.id='attitude-language';language.className='card section';language.setAttribute('aria-labelledby','attitude-language-title');
const source=methodData.sections.find(s=>s.id==='language');
language.innerHTML='<div class="section-heading"><h2 id="attitude-language-title">语言表达</h2></div><div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>'+esc(source.summary)+'</p></div><div class="method-language-grid">'+methodData.language.map((item,i)=>'<button class="basic-stat" data-attitude-language="'+i+'"><strong class="'+(typeof item.value==='number'?'basic-count':'')+'">'+esc(item.value)+(typeof item.value==='number'?'<small>个</small>':'')+'</strong><span>'+esc(item.name)+'</span></button>').join('')+'</div>';
const show=(title,body)=>openDialog(title,body,'教学态度 / 语言表达');
mountTeachingLanguage(language,{openDialog:show});
const languageStyle=language.querySelector('[data-ml-style]');
if(languageStyle)languageStyle.textContent=languageStyle.textContent.replaceAll('#method-language','#attitude-language');
language.addEventListener('click',event=>{
 const button=event.target.closest('[data-attitude-language]');if(!button)return;
 const item=methodData.language[Number(button.dataset.attitudeLanguage)];
 show(item.name,'<div class="basic-dialog-value"><strong>'+esc(item.value)+(typeof item.value==='number'?'<small>个</small>':'')+'</strong></div><p>'+esc(item.detail)+'</p>'+(item.words?'<div class="method-word-list">'+item.words.map(word=>'<span>'+esc(word)+'</span>').join('')+'</div>':''));
});

const attitude=root;
// Restore the exact report viewport after native dialogs restore their opener focus.
let pendingDialogContext=false;
root.addEventListener('click',event=>{
 const path=event.composedPath();
 if(pendingDialogContext||path.some(node=>node instanceof HTMLDialogElement))return;
 let active=document.activeElement;while(active?.shadowRoot?.activeElement)active=active.shadowRoot.activeElement;
 const opener=!event.isTrusted&&active?.matches('button,[role="button"]')?active:path.find(node=>node instanceof Element&&node.matches('button,[role="button"]'));
 if(!opener)return;
 pendingDialogContext=true;
 const position={x:window.scrollX,y:window.scrollY};
 queueMicrotask(()=>{
  pendingDialogContext=false;
  const dialog=[...root.querySelectorAll('dialog'),root.querySelector('#attitude-emotion')?.shadowRoot?.querySelector('dialog'),document.querySelector('#detail-dialog')].find(node=>node?.open);
  if(dialog)dialog.addEventListener('close',()=>queueMicrotask(()=>{
   if(!root.hidden){opener.focus({preventScroll:true});window.scrollTo({left:position.x,top:position.y,behavior:'instant'});}
  }),{once:true});
 });
},{capture:true});
const basic=attitude.querySelector('#attitude-basics'),management=attitude.querySelector('#attitude-management'),emotion=attitude.querySelector('#attitude-emotion'),patrol=attitude.querySelector('#attitude-patrol'),pose=attitude.querySelector('#attitude-body');
const investment=document.createElement('section');investment.id='attitude-investment';investment.className='card section';investment.setAttribute('aria-labelledby','investment-title');
investment.innerHTML='<div class="section-heading"><h2 id="investment-title">教师教学投入</h2></div>';
investment.append(emotion,patrol);
// Authorized minimal presentation exceptions; retain original text and chart geometry.
investment.querySelector('.section-heading').after(patrol.querySelector('.attitude-insight'));
// Management events already open the complete, flat evidence dialog.
if(management.querySelector('[data-cm-open]'))management.querySelector('[data-cm-open]').hidden=true;
const emotionalRoot=emotion.shadowRoot;
const compositionStyle=document.createElement('style');
compositionStyle.textContent=':host{margin-top:0!important}.section{padding:0!important;border-radius:0;background:transparent}.heading h2{font-size:14px;line-height:24px;font-weight:600;letter-spacing:0}.heading{margin-bottom:20px}#arcs path:focus-visible{outline:2px solid #1d70f2;outline-offset:3px}';
emotionalRoot.append(compositionStyle);
emotionalRoot.querySelector('.heading [data-open]').hidden=true;
const scope=emotionalRoot.querySelector('.scope');
emotionalRoot.querySelector('dialog .dialog').append(scope);
let ringTrigger=null;
emotionalRoot.querySelectorAll('#arcs path').forEach((path,i)=>{
 path.setAttribute('role','button');path.setAttribute('tabindex','0');
 path.setAttribute('aria-label',['平静60%','微笑30%','惊讶10%'][i]+'，查看对应时段');
 path.style.cursor='pointer';
 const activate=()=>{emotionalRoot.querySelector('[data-series="'+i+'"][data-part="0"]').click();ringTrigger=path;};
 path.addEventListener('click',activate);
 path.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)){e.preventDefault();activate();}});
});
emotionalRoot.querySelector('dialog').addEventListener('close',()=>{if(ringTrigger){ringTrigger.focus({preventScroll:true});ringTrigger=null;}});
const footer=attitude.querySelector('footer');
attitude.append(basic,management,investment,language,pose,footer);
// Confirmed dimension composition; original chart data remain unchanged.
const basicAnalysis=document.createElement('div');basicAnalysis.className='attitude-insight';
basicAnalysis.innerHTML='<img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>到课与着装记录正常；提前下课和疑似代课需核实，敏感词及看手机记录应结合原话和用途复核。</p>';
basic.querySelector('.section-heading').after(basicAnalysis);
basic.querySelector('.section-hint')?.setAttribute('hidden','');
footer.hidden=true;
// Only change investment presentation: original nodes and their listeners stay intact.
const tabs=document.createElement('div');tabs.className='investment-tabs';tabs.setAttribute('role','tablist');tabs.setAttribute('aria-label','教师教学投入');
tabs.innerHTML='<button id="investment-tab-emotion" role="tab" aria-controls="investment-panel-emotion" aria-selected="true" data-investment-tab="emotion">教师情感</button><button id="investment-tab-patrol" role="tab" aria-controls="investment-panel-patrol" aria-selected="false" tabindex="-1" data-investment-tab="patrol">巡堂轨迹</button>';
investment.querySelector(':scope>.section-heading').append(tabs);
const panels=document.createElement('div');panels.className='investment-panels';
for(const [key,node]of [['emotion',emotion],['patrol',patrol]]){const panel=document.createElement('div');panel.className='investment-panel';panel.id='investment-panel-'+key;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby','investment-tab-'+key);panel.append(node);panels.append(panel);}
investment.append(panels);
const analysis=investment.querySelector(':scope>.attitude-insight p'),patrolAnalysis=analysis.textContent;
analysis.classList.add('investment-analysis');analysis.replaceChildren();
for(const [key,text]of [['emotion','教师表情以平静为主；微笑和惊讶的具体作用需结合问答片段复盘，不以表情占比判断投入程度。'],['patrol',patrolAnalysis]]){const span=document.createElement('span');span.dataset.analysis=key;span.textContent=text;analysis.append(span);}
function selectInvestment(key){tabs.querySelectorAll('button').forEach(button=>{const active=button.dataset.investmentTab===key;button.setAttribute('aria-selected',String(active));button.tabIndex=active?0:-1;});panels.querySelectorAll('.investment-panel').forEach(panel=>{const inactive=panel.id!=='investment-panel-'+key;panel.hidden=inactive;panel.inert=inactive;});analysis.querySelectorAll('span').forEach(span=>span.hidden=span.dataset.analysis!==key);}
tabs.querySelectorAll('button').forEach(button=>{button.onclick=()=>selectInvestment(button.dataset.investmentTab);button.onkeydown=event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const buttons=[...tabs.querySelectorAll('button')],index=event.key==='Home'?0:event.key==='End'?1:1-buttons.indexOf(button);buttons[index].click();buttons[index].focus();};});
selectInvestment('emotion');

root.dataset.attitudeIteration='1.0';
const route=()=>{
 const hash=location.hash;
 if(!hash.startsWith('#attitude')){
  root.querySelectorAll('dialog[open]').forEach(dialog=>dialog.close());
  if(emotionalRoot.querySelector('dialog').open)emotionalRoot.querySelector('dialog').close();
  return;
 }
 if(hash==='#attitude-patrol')selectInvestment('patrol');
 if(hash==='#attitude-emotion'||hash==='#attitude-investment')selectInvestment('emotion');
};
document.addEventListener('attitude:route',route);
route();

}
