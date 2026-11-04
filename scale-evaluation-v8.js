import {scaleEvaluationVersion} from './scale-evaluation-version.js';

const sections=[
  {name:'教学态度',score:20,items:[
    ['坚持正确思想导向，坚持以学生为本，以培养应用型人才为宗旨。',5,['content-goals','literacy-values']],
    ['材料齐全，备课充分，内容娴熟，能脱稿授课。',5,['method-multimedia','content-challenges']],
    ['师德师风优良，自觉遵守教学规范和纪律；能够进行课堂管理，规范学生课堂行为。',10,['attitude-management','attitude-investment']]
  ]},
  {name:'教学内容',score:25,items:[
    ['突出立德树人，以习近平新时代中国特色社会主义思想为指导，紧扣大纲教材，融入思政元素，推进素质教育。',10,['content-goals','literacy-values']],
    ['教学目标明确，课程设计合理，注重培养学生的学术思维和应用能力，注重提升学生发现、分析和解决问题的能力。',5,['content-goals','literacy-critical']],
    ['注重学科知识间的相互渗透，法学专业体现交叉融合，法外专业体现融法特色。',5,['content-features','content-practice']],
    ['内容有层次，重难点突出，能够反映本学科的学术前沿状况。',5,['content-challenges','content-features']]
  ]},
  {name:'教学方法',score:25,items:[
    ['普通话授课，语言表达规范、流畅，思路清晰。肢体语言恰当，教态自然大方，精神饱满，亲和力强。',5,['method-language','attitude-body']],
    ['合理使用多媒体课件，适当结合板书，能有效利用现代化教学手段，教学环节多样，形式灵活多变。',5,['method-multimedia','method-board']],
    ['理论联系实际，例证生动恰当，注重案例引用与理论阐释的有机结合，注重正面引导，讲解循序渐进，系统性强。',5,['content-practice','content-challenges']],
    ['积极进行教学方法改革，学生中心、问题导向，采用提问启发、学生展示等方法引导学生参与，给予学生充分自我成长空间。',10,['method-questions','method-interaction','effect-state']]
  ]},
  {name:'教学效果',score:30,items:[
    ['课堂组织严密，时间利用充分，能够达到预期教学目标。',5,['content-goals','effect-monitoring']],
    ['教学理念先进，形成适合学科特色和学生特点的教学模式，学生知识、能力与思维得到发展，学习兴趣和自主学习能力提高。',10,['method-interaction','effect-state','literacy-critical']],
    ['课堂气氛良好，学生主体性突出，注意集中，思维活跃，师生、生生能够有效互动。',10,['method-interaction','effect-state','effect-participation']],
    ['学生到课情况、前排入座情况、抬头听课情况（≥95%为A，85%≤X<95%为B，75%≤X<85%为C，<75%为D）。',5,['effect-monitoring','effect-state']]
  ]},
  {name:'特色加分项',score:null,items:[
    ['产教融合特色鲜明，通过项目化教学、案例式教学，邀请企业行业专家参与等方式，培养适应产业发展和变化的高素质人才。',null,['content-practice','method-interaction']],
    ['科研育人特色明显，重视创新思维培养和科研成果转化，吸收学生参与课题项目研究，或用教师本人的科研成果作为素材进行授课。',null,['content-features','content-practice']]
  ]}
];
const flat=sections.flatMap((section)=>section.items.map(item=>({section:section.name,sectionScore:section.score,text:item[0],max:item[1],refs:item[2]})));
const storageKey='teaching-evaluation-scale-v8';
let state={scores:Array(15).fill(null),notes:['',''],images:[[],[]],submitted:false};
const aiScores=[3,4,8,8,4,4,4,4,4,4,8,4,8,8,4];
let aiEvaluated=false;
try{localStorage.removeItem(storageKey);}catch{}
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const persist=()=>{};
const score=()=>state.scores.reduce((sum,value)=>sum+(Number.isFinite(value)?value:0),0);
const completed=()=>state.scores.filter(Number.isFinite).length+state.notes.filter(value=>value.trim()).length;
const options=max=>Array.from({length:max+1},(_,value)=>value);

function formMarkup(){let index=0,subjective=0;return `<form class="scale-v8-form" novalidate><div class="recording-form-scroll"><div class="recording-form-intro"><h2>山东政法学院教师课堂教学质量评价表（理论课）</h2><p>15 道计分题满分 100 分；2 道特色加分题不计分。</p></div>${sections.map(section=>`<h3 class="recording-form-section">${section.name}${section.score===null?'（酌情赋分，总分不超过100分）':`（${section.score}分）`}</h3>${section.items.map(item=>{const current=index++;if(item[1]===null){const noteIndex=subjective++;return `<fieldset class="recording-question scale-v8-subjective" data-scale-question="${current}"><legend><span class="recording-required" aria-hidden="true">*</span>${current+1}. ${esc(item[0])}</legend><textarea data-scale-note="${noteIndex}" maxlength="500" placeholder="请输入评价">${esc(state.notes[noteIndex]||'')}</textarea><div class="scale-v8-count"><span>${(state.notes[noteIndex]||'').length} / 500</span></div><label class="scale-v8-upload"><input type="file" accept="image/*" multiple data-scale-images="${noteIndex}"><span>▧</span> 图片</label><div class="scale-v8-files">${(state.images[noteIndex]||[]).map(name=>`<span>${esc(name)}</span>`).join('')}</div></fieldset>`;}const scoreIndex=current;return `<fieldset class="recording-question" data-scale-question="${current}"><legend><span class="recording-required" aria-hidden="true">*</span>${current+1}. ${esc(item[0])}<button type="button" class="scale-v8-ai" data-scale-ai="${current}">✦ AI辅助</button></legend><div class="recording-rating-options" style="--scale-columns:${item[1]+1}">${options(item[1]).map(value=>`<label><input type="radio" name="scale-${scoreIndex}" value="${value}" ${state.scores[scoreIndex]===value?'checked':''}><span>${value}</span></label>`).join('')}</div></fieldset>`;}).join('')}`).join('')}</div><div class="recording-submit-bar"><div><span>总计：</span><output>${score()}</output><span>分/100</span><small>已评 ${completed()}/17 项</small></div><button class="primary-button" type="submit">${state.submitted?'更新评价':'提交'}</button></div></form>`;}

function bindForm(root,{toast}={}){const form=root.querySelector('.scale-v8-form');if(!form)return;form.addEventListener('change',event=>{if(event.target.matches('input[type=radio]')){const index=Number(event.target.name.replace('scale-',''));state.scores[index]=Number(event.target.value);persist();sync(root);}if(event.target.matches('[data-scale-images]')){const index=Number(event.target.dataset.scaleImages);state.images[index]=[...event.target.files].map(file=>file.name);persist();sync(root);}});form.addEventListener('input',event=>{if(event.target.matches('[data-scale-note]')){const index=Number(event.target.dataset.scaleNote);state.notes[index]=event.target.value.slice(0,500);persist();root.querySelectorAll('.scale-v8-count span')[index].textContent=`${state.notes[index].length} / 500`;syncEntries();}});form.addEventListener('submit',event=>{event.preventDefault();const missing=state.scores.findIndex(value=>!Number.isFinite(value));if(missing>=0){root.querySelector(`[data-scale-question="${missing}"]`)?.scrollIntoView({behavior:'smooth',block:'center'});toast?.(`请完成第 ${missing+1} 题评分`);return;}state.submitted=true;persist();sync(root);toast?.('量表评价已保存');});root.querySelector('[data-scale-ai-all]')?.addEventListener('click',()=>{aiEvaluated=true;syncAiRecommendations();toast?.('AI已完成15项量表评价');});root.querySelectorAll('[data-scale-ai]').forEach(button=>button.addEventListener('click',()=>{const index=Number(button.dataset.scaleAi);const item=flat[index];root.querySelectorAll('[data-scale-question]').forEach(question=>question.classList.toggle('scale-v8-current',question.dataset.scaleQuestion===String(index)));document.dispatchEvent(new CustomEvent('agent:scale-assist',{detail:{index,number:index+1,text:item.text,max:item.max,refs:item.refs,embedded:root.id==='recording-evaluation'}}));}));}
function sync(root){const out=root.querySelector('.recording-submit-bar output');if(out)out.textContent=score();const small=root.querySelector('.recording-submit-bar small');if(small)small.textContent=`已评 ${completed()}/17 项`;const submit=root.querySelector('.recording-submit-bar .primary-button');if(submit)submit.textContent=state.submitted?'更新评价':'提交';syncEntries();}
function syncEntries(){document.querySelectorAll('.scale-v8-entry small').forEach(node=>node.textContent=`已评 ${completed()}/17 项`);}
function syncAiRecommendations(){document.querySelectorAll('.scale-v8-form').forEach(form=>{form.querySelectorAll('.scale-v8-ai-recommended').forEach(label=>label.classList.remove('scale-v8-ai-recommended'));if(aiEvaluated)aiScores.forEach((value,index)=>{form.querySelector(`input[name="scale-${index}"][value="${value}"]`)?.closest('label')?.classList.add('scale-v8-ai-recommended');});const button=form.querySelector('[data-scale-ai-all]');if(button)button.innerHTML='✦ 一键AI评价';});}
let panel,entry,lastTrigger;
function closePanel(){if(!panel||panel.hidden)return;panel.hidden=true;document.body.classList.remove('scale-v8-open','scale-agent-coexist');entry.hidden=false;lastTrigger?.focus({preventScroll:true});}
function openPanel(){lastTrigger=document.activeElement;panel.hidden=false;entry.hidden=true;document.body.classList.add('scale-v8-open');if(document.body.classList.contains('agent-open'))document.body.classList.add('scale-agent-coexist');panel.querySelector('.scale-v8-close').focus();}
function enhanceForm(root){const intro=root.querySelector('.recording-form-intro');if(intro){const title=intro.querySelector('h2');if(title)title.textContent='教师课堂教学质量评价表（理论课）';intro.querySelector('p')?.remove();if(!intro.querySelector('[data-scale-ai-all]'))intro.insertAdjacentHTML('beforeend','<div class="scale-v8-ai-run"><button type="button" data-scale-ai-all>✦ 一键AI评价</button></div>');}root.querySelectorAll('.scale-v8-ai').forEach(button=>button.textContent='✦ AI评价');root.querySelectorAll('.scale-v8-subjective').forEach(fieldset=>{const index=Number(fieldset.dataset.scaleQuestion);const legend=fieldset.querySelector('legend');if(legend&&!legend.querySelector('[data-scale-ai]'))legend.insertAdjacentHTML('beforeend',`<button type="button" class="scale-v8-ai" data-scale-ai="${index}">✦ AI评价</button>`);});root.querySelectorAll('.scale-v8-upload>span').forEach(icon=>{icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"></rect><circle cx="8.5" cy="8.5" r="2"></circle><path d="m4 17 4.5-4.5 3.2 3.2 2.2-2.2L20 19"></path></svg>';});const submit=root.querySelector('.recording-submit-bar .primary-button');if(submit&&!root.querySelector('[data-scale-draft]'))submit.insertAdjacentHTML('beforebegin','<button type="button" class="scale-v8-draft" data-scale-draft>暂存</button>');syncAiRecommendations();}

export function mountScaleEvaluationV8({toast}={}){
 if(scaleEvaluationVersion==='baseline')return;
 const recording=document.querySelector('#recording-evaluation');if(recording){recording.innerHTML=formMarkup();recording.dataset.scaleVersion='8.0';enhanceForm(recording);bindForm(recording,{toast});}
 panel=document.createElement('aside');panel.id='scale-v8-panel';panel.hidden=true;panel.innerHTML=`<header><div><h2>量表评价</h2></div><button type="button" class="scale-v8-close" aria-label="关闭量表评价">×</button></header>${formMarkup()}`;document.body.append(panel);enhanceForm(panel);bindForm(panel,{toast});
 entry=document.createElement('button');entry.type='button';entry.id='scale-v8-entry';entry.className='scale-v8-entry';entry.innerHTML=`<span class="scale-v8-entry-icon">▤</span><span>量表评价<small>已评 ${completed()}/17 项</small></span>`;document.body.append(entry);entry.addEventListener('click',openPanel);panel.querySelector('.scale-v8-close').addEventListener('click',closePanel);
 const route=()=>{const recordingRoute=location.hash==='#recording'||location.hash==='#overview'||!location.hash;entry.hidden=recordingRoute||!panel.hidden;if(recordingRoute)closePanel();};window.addEventListener('hashchange',route);window.addEventListener('popstate',route);document.addEventListener('click',event=>{if(event.target.closest('.topbar a[href^="#"]'))setTimeout(route,0);});document.addEventListener('scale:reopen',openPanel);route();
 document.addEventListener('click',event=>{const draft=event.target.closest('[data-scale-draft]');if(draft){draft.textContent='已暂存';toast?.('当前评价已暂存');setTimeout(()=>{if(draft.isConnected)draft.textContent='暂存';},1200);return;}const jump=event.target.closest('[data-scale-jump]');if(!jump)return;location.hash=jump.dataset.scaleJump;});
}
