import {languageIntegrationVersion} from './language-integration-version.js';
import {languageExpressionModel} from './method-language-data.js?v=20261102-language-evaluation';
import {recordingTranscript as transcript} from './recording-transcript-data.js';
const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function mountLanguageIntegration(language,pitch,{openDialog,bindEvidence}){
 if(languageIntegrationVersion==='baseline'||language.dataset.languageIntegration)return;
 const grid=language.querySelector('.method-language-grid');if(!grid||!pitch)return;
 const pronunciation=grid.querySelector('[data-ml-detail="pronunciation"]'),fluency=grid.querySelector('[data-ml-detail="fluency"]');
 const pitchCard=pitch.querySelector('.pitch-stat');if(!pronunciation||!pitchCard)return;
 pronunciation.setAttribute('aria-label','发音：良好，查看依据');
 pronunciation.innerHTML='<strong>良好</strong><span>发音</span>';
 if(fluency){fluency.setAttribute('aria-label','流利度：优秀，查看依据');fluency.innerHTML='<strong>优秀</strong><span>流利度</span>';}
 pitchCard.className='basic-stat language-pitch-stat';pitchCard.setAttribute('aria-label','语调：平稳，查看时序与课堂记录');pitchCard.innerHTML='<strong>平稳</strong><span>语调</span>';
 const clarity=document.createElement('button');clarity.type='button';clarity.className='basic-stat';clarity.dataset.languageClarity='';clarity.setAttribute('aria-label','条理清晰度：良好，查看依据');clarity.innerHTML='<strong>良好</strong><span>条理清晰度</span>';
 const original=[...grid.querySelectorAll('[data-method-language]')];
 grid.replaceChildren(original[0],original[1],pitchCard,pronunciation,fluency,clarity,original[2],original[3]);
 const wordPanels=document.createElement('div');wordPanels.className='language-word-panels';
 const wordGroups=[{title:'高频词',index:2,words:['人工智能','数据','医疗','学习','模型','算法'],counts:[58,54,51,49,47,43]},{title:'语气词',index:3,words:['对吧','好','那么','嗯','是不是'],counts:[337,247,108,92,66]}];
 wordPanels.innerHTML=wordGroups.map(group=>`<section class="language-word-panel"><h3>${group.title}</h3><div class="language-word-table" style="--word-columns:${group.words.length}">${group.words.map((word,i)=>`<button type="button" data-method-language="${group.index}" aria-label="${word}，${group.counts[i]}次，查看${group.title}详情"><span>${word}</span><strong>${group.counts[i]}<small>次</small></strong></button>`).join('')}</div></section>`).join('');
 original[2].remove();original[3].remove();grid.after(wordPanels);
 bindEvidence?.(grid);
 // The acoustic curve is now available in the pitch summary's single evidence dialog.
 pitch.remove();language.dataset.languageIntegration='1.0';
 let trigger=null,scroll;
 clarity.addEventListener('click',()=>{
  trigger=clarity;scroll={x:scrollX,y:scrollY};
  openDialog('条理清晰度',`<div class="basic-dialog-value"><strong>良好</strong></div><p>讲解先交代安排，再从发展历程推进到方法比较和未来方向，主题转换有明确提示。建议在各部分结束时补充小结，使要点联系更清晰。</p>${[1,24,40,48].map(i=>{const row=transcript[i];return `<article class="language-clarity-source"><small>${String(Math.floor(row.time/60)).padStart(2,'0')}:${String(row.time%60).padStart(2,'0')} · ${esc(row.speaker)}</small><blockquote>${esc(row.text)}</blockquote></article>`}).join('')}`,'教学方法 / 语言表达');
 });
 document.querySelector('#detail-dialog').addEventListener('close',()=>{if(!trigger)return;const button=trigger;trigger=null;button.focus({preventScroll:true});window.scrollTo({left:scroll.x,top:scroll.y,behavior:'instant'})});
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./language-integration.css?v=20261102-language-evaluation',import.meta.url).href;document.head.append(style);
}
