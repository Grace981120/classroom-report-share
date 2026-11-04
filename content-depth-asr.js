import {topics,topicGroups,depthBreadthAnalysis} from './content-depth-asr-data.js?v=20261102-depth-earliest';
import {recordingTranscript as transcript} from './recording-transcript-data.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const time=s=>`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
export function mountContentDepthAsr(root,{openDialog}){
 if(location.pathname.includes('/previews/'))return false;
 if(root.querySelector('[data-content-depth-asr]'))return true;
 const section=document.createElement('section');section.id='content-depth';section.className='card section';section.dataset.contentDepthAsr='2.0';section.setAttribute('aria-labelledby','content-depth-title');
 section.innerHTML=`<div class="section-heading"><h2 id="content-depth-title">教学内容深度与广度</h2><div class="depth-ratings"><span aria-label="深度：3星，满分5星">深度 <strong class="depth-stars" aria-hidden="true">★★★<span>☆☆</span></strong></span><span aria-label="广度：4星，满分5星">广度 <strong class="depth-stars" aria-hidden="true">★★★★<span>☆</span></strong></span></div></div><div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>${esc(depthBreadthAnalysis)}</p></div><div class="content-feature-grid">${topics.map((topic,i)=>`<article class="content-detail-card"><h3>${esc(topic.title)}</h3><div class="content-examples">${topicGroups[i].map((group,j)=>`<button type="button" class="content-example" data-cda-topic="${i}" data-cda-step="${j}" aria-label="${topic.title}，${time(Math.min(...group.indices.map(index=>transcript[index].time)))}，${group.text}，查看ASR原文"><span class="cda-times">${[group.indices.reduce((a,b)=>transcript[a].time<=transcript[b].time?a:b)].map(index=>`<span class="content-time"><img src="assets/figma/content-img.svg" alt="" width="14" height="14"><time>${time(transcript[index].time)}</time></span>`).join('')}</span><span>${esc(group.text)}</span></button>`).join('')}</div></article>`).join('')}</div>`;
 root.querySelector('#content-challenges').after(section);
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./content-depth-asr.css?v=20261103-depth-stars',import.meta.url).href;document.head.append(style);
 const dialog=document.getElementById('detail-dialog');let trigger,scroll;
 section.addEventListener('click',e=>{
 const button=e.target.closest('[data-cda-topic]');if(!button)return;
 const topicIndex=Number(button.dataset.cdaTopic),topic=topics[topicIndex],group=topicGroups[topicIndex][Number(button.dataset.cdaStep)];trigger=button;scroll={x:scrollX,y:scrollY};
 const source=index=>{
  const row=transcript[index],step=topic.steps.find(step=>step.index===index);
  return `<article class="cda-source"><small>${time(row.time)} · ${esc(row.speaker)} · ASR-${String(index+1).padStart(3,'0')}</small><h3>${esc(step.text)}</h3><blockquote>${esc(row.text)}</blockquote><details><summary>上下文</summary>${[index-1,index+1].filter(i=>transcript[i]).map(i=>`<div><small>${time(transcript[i].time)} · ${esc(transcript[i].speaker)}</small><p>${esc(transcript[i].text)}</p></div>`).join('')}</details></article>`;
 };
 openDialog(topic.title,`<div class="cda-detail"><h3>讲解推进</h3><p>${esc(topic.progress)}</p><p class="cda-selected">${esc(group.text)}</p>${group.indices.map(source).join('')}</div>`,'教学内容 / 教学内容深度与广度');dialog.classList.add('cda-dialog');dialog.scrollTop=0;
 });
 dialog.addEventListener('close',()=>{if(dialog.open||!trigger)return;dialog.classList.remove('cda-dialog');const target=trigger;trigger=null;if(target.isConnected)target.focus({preventScroll:true});window.scrollTo({left:scroll.x,top:scroll.y,behavior:'instant'})});
 root.dataset.contentKnowledge='2.0';return true;
}
