import {contentKnowledgeVersion} from './content-knowledge-version.js';
import {knowledgeNodes as nodes,knowledgeRelations as relations,knowledgeChecks as checks,knowledgeAnalysis} from './content-knowledge-data.js';
import {recordingTranscript as transcript} from './recording-transcript-data.js';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
const byId=new Map(nodes.map(n=>[n.id,n]));
function records(indices){return [...new Set(indices)].sort((a,b)=>transcript[a].time-transcript[b].time).map(index=>{const row=transcript[index];return `<article class="ck-record"><div class="ck-record-meta"><time>${time(row.time)}</time><span>${esc(row.speaker)}</span><span>ASR-${String(index+1).padStart(3,'0')}</span></div><blockquote>${esc(row.text)}</blockquote><details><summary>上下文</summary>${index>0?`<p><time>${time(transcript[index-1].time)}</time> · ${esc(transcript[index-1].speaker)}<br>${esc(transcript[index-1].text)}</p>`:''}${index+1<transcript.length?`<p><time>${time(transcript[index+1].time)}</time> · ${esc(transcript[index+1].speaker)}<br>${esc(transcript[index+1].text)}</p>`:''}</details></article>`}).join('')}
export function mountContentKnowledge(root,{openDialog}){
 if(contentKnowledgeVersion==='baseline'||location.pathname.includes('/previews/'))return false;
 if(root.querySelector('#content-depth.content-knowledge-card'))return true;
 const card=document.createElement('section');card.id='content-depth';card.className='card section content-knowledge-card';card.setAttribute('aria-labelledby','content-depth-title');
 const definition='从知识点及其比较、条件、应用和讲授推进关系观察课堂内容组织，并对照核心内容与课程大纲核查覆盖。复讲不直接等于冗余，疑点不直接等于事实错误；大纲缺失时不输出匹配率。';
 card.innerHTML=`<div class="section-heading"><h2 id="content-depth-title">教学内容深度与广度<span class="ck-help"><button type="button" aria-label="教学内容深度与广度定义" aria-expanded="false">?</button><span>${definition}</span></span></h2></div><div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>${knowledgeAnalysis}</p></div><div class="ck-layout"><div class="ck-summary"><button type="button" class="ck-summary-card" data-ck-summary="depth"><span>深度</span><strong>方法比较<br>应用举例</strong></button><button type="button" class="ck-summary-card" data-ck-summary="breadth"><span>广度</span><strong>覆盖3条教学主线</strong></button></div><div class="ck-graph"><div class="ck-graph-heading"><h3>知识点关联</h3><span class="ck-review-key"><i></i>表述待核对</span></div><div class="ck-graph-scroll" tabindex="0" role="group" aria-label="课堂知识点与关系，窄屏可横向滚动"><div class="ck-stage"><svg viewBox="0 0 960 400" preserveAspectRatio="none" aria-hidden="true">${relations.map(r=>{const a=byId.get(r.from),b=byId.get(r.to);return `<line x1="${a.x}" y1="${a.y}" x2="${b.x}" y2="${b.y}"/>`}).join('')}</svg>${relations.map((r,index)=>`<button type="button" class="ck-relation" data-ck-relation="${index}" style="left:${r.x/960*100}%;top:${r.y/400*100}%" aria-label="${byId.get(r.from).name}与${byId.get(r.to).name}：${r.label}">${r.label}</button>`).join('')}${nodes.map(n=>`<button type="button" class="ck-node${n.review?' ck-node-review':''}" data-ck-node="${n.id}" style="left:${n.x/960*100}%;top:${n.y/400*100}%" aria-label="${n.name}${n.review?'，表述待核对':''}，查看课堂依据"><span>${n.name}</span>${n.review?'<i aria-hidden="true"></i>':''}</button>`).join('')}</div></div></div><div class="ck-diagnosis"><h3>内容分析</h3>${checks.map(c=>`<button type="button" class="ck-check" data-ck-check="${c.id}" aria-label="${c.name}：${c.value}，查看分析依据"><span>${c.name}</span><strong class="ck-tone-${c.tone}"><i></i>${c.value}</strong></button>`).join('')}</div></div>`;
 const previous=root.querySelector('#content-depth');if(previous){previous.id='content-depth-legacy';previous.hidden=true;previous.after(card)}else root.querySelector('#content-challenges')?.after(card);
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./content-knowledge.css?v=20261101-7',import.meta.url).href;document.head.append(style);
 const dialog=document.querySelector('#detail-dialog');let trigger=null,scroll;
 function show(button,title,verdict,basis,indices){
  trigger=button;scroll={x:scrollX,y:scrollY};
  openDialog(title,`<div class="ck-detail"><p class="ck-verdict">${esc(verdict)}</p><p class="ck-basis">${esc(basis)}</p>${records(indices)}</div>`,'教学内容 / 教学内容深度与广度');
  dialog.classList.add('ck-dialog');dialog.scrollTop=0;
 }
 card.addEventListener('click',event=>{
  const help=event.target.closest('.ck-help button');if(help){const isOpen=help.getAttribute('aria-expanded')==='true';help.setAttribute('aria-expanded',String(!isOpen));help.parentElement.classList.toggle('is-open',!isOpen);return}
  const button=event.target.closest('[data-ck-node],[data-ck-relation],[data-ck-check],[data-ck-summary]');if(!button)return;
  if(button.dataset.ckSummary){const depth=button.dataset.ckSummary==='depth';show(button,depth?'内容深度':'内容广度',depth?'讲解包含方法比较、资源条件和应用联系，规则完备性存在表述待核对。':'已定位三条课堂主线，整理出10个关联知识点。',depth?'以下原话支持比较、条件解释与应用联系。讲解层次不直接等于难度适宜；仍需结合学生知识基础与课程要求判断。':'三条主线以教师开头声明的课堂安排为参照，10个知识点为现有记录的整理。知识点数量不直接代表广度适宜，正式大纲匹配待核验。',depth?[40,41,42,44,62]:[1,24,32,40,41,48,49,50])}
  else if(button.dataset.ckNode){const n=byId.get(button.dataset.ckNode);show(button,n.name,n.summary,'以下为该知识点在现有课堂记录中的可定位原话。知识点出现不等于讲解充分或学生已理解。',n.indices)}
  else if(button.dataset.ckRelation!==undefined){const r=relations[Number(button.dataset.ckRelation)];show(button,`${byId.get(r.from).name} · ${byId.get(r.to).name}`,`${r.label}：${byId.get(r.from).name}与${byId.get(r.to).name}之间的课堂联系。`,r.basis,r.indices)}
  else {const c=checks.find(c=>c.id===button.dataset.ckCheck);show(button,c.name,c.verdict,c.basis,c.indices)}
 });
 dialog.addEventListener('close',()=>{if(!trigger)return;dialog.classList.remove('ck-dialog');const button=trigger;trigger=null;button.focus({preventScroll:true});window.scrollTo({left:scroll.x,top:scroll.y,behavior:'instant'})});
 root.dataset.contentKnowledge='1.0';return true;
}
