import {attitudeData,formatTime} from './attitude-data.js';
import {methodData} from './method-data.js';
import {mountTeachingLanguage} from './method-language.js';

const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const phoneEvents=attitudeData.basics[5].events.map(([time,description],index)=>({time,description,index}));
const minute=time=>{const [h,m,s]=time.split(':').map(Number);return h*60+m+s/60;};

export function mountAttitudeIterationV11(root,{openDialog}){
 if(root.dataset.attitudeIteration)return;
 const basics=root.querySelector('#attitude-basics');
 const management=root.querySelector('#attitude-management');
 const posture=root.querySelector('#attitude-posture');
 const patrol=root.querySelector('#attitude-patrol');
 const emotion=root.querySelector('#attitude-emotion');
 const body=root.querySelector('#attitude-body');
 if(!basics||!management||!posture||!patrol||!emotion?.shadowRoot)return;
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./attitude-iteration-v11.css',import.meta.url).href;document.head.append(style);

 const source=methodData.sections.find(section=>section.id==='language');
 const language=document.createElement('section');language.id='attitude-language';language.className='card section';language.setAttribute('aria-labelledby','attitude-language-title');
 language.innerHTML='<div class="section-heading"><h2 id="attitude-language-title">语言表达</h2></div><div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>'+escapeHTML(source.summary)+'</p></div><div class="method-language-grid">'+methodData.language.map((item,index)=>'<button class="basic-stat" data-attitude-language="'+index+'"><strong class="'+(typeof item.value==='number'?'basic-count':'')+'">'+escapeHTML(item.value)+(typeof item.value==='number'?'<small>个</small>':'')+'</strong><span>'+escapeHTML(item.name)+'</span></button>').join('')+'</div>';
 const showLanguage=(title,content)=>openDialog(title,content,'教学态度 / 语言表达');
 mountTeachingLanguage(language,{openDialog:showLanguage});
 const languageStyle=language.querySelector('[data-ml-style]');
 if(languageStyle)languageStyle.textContent=languageStyle.textContent.replaceAll('#method-language','#attitude-language');
 language.addEventListener('click',event=>{
  const button=event.target.closest('[data-attitude-language]');if(!button)return;
  const item=methodData.language[Number(button.dataset.attitudeLanguage)];
  showLanguage(item.name,'<div class="basic-dialog-value"><strong>'+escapeHTML(item.value)+(typeof item.value==='number'?'<small>个</small>':'')+'</strong></div><p>'+escapeHTML(item.detail)+'</p>'+(item.words?'<div class="method-word-list">'+item.words.map(word=>'<span>'+escapeHTML(word)+'</span>').join('')+'</div>':''));
 });

 const anomaly=document.createElement('section');anomaly.id='attitude-anomaly';anomaly.className='card section';anomaly.setAttribute('aria-labelledby','attitude-anomaly-title');
 const rows=[['看手机',phoneEvents],['接打电话',[]],['吸烟',[]]];
 anomaly.innerHTML='<div class="section-heading"><h2 id="attitude-anomaly-title">教师异常行为</h2></div><div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>记录2次看手机，接打电话和吸烟未记录；看手机用途需结合当时教学活动核查。</p></div><div class="attitude-anomaly-chart">'+rows.map(([name,events],row)=>'<div class="attitude-anomaly-row"><span class="attitude-anomaly-label">'+name+'</span><div class="attitude-anomaly-track">'+events.map(event=>'<button type="button" class="attitude-anomaly-event" data-anomaly-row="'+row+'" data-anomaly-event="'+event.index+'" style="left:'+minute(event.time)/130*100+'%" aria-label="'+name+' '+event.time+'，查看课堂记录" title="'+name+' · '+event.time+'"></button>').join('')+'</div><button type="button" class="attitude-anomaly-count" data-anomaly-row="'+row+'" aria-label="'+name+' '+events.length+'次，查看课堂记录">'+events.length+'次</button></div>').join('')+'<div class="attitude-anomaly-axis">'+[0,26,52,78,104,130].map(value=>'<span>'+formatTime(value*60)+'</span>').join('')+'</div></div>';
 anomaly.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-anomaly-row]');if(!trigger)return;
  const row=Number(trigger.dataset.anomalyRow),[name,events]=rows[row];
  const selected=trigger.dataset.anomalyEvent===undefined?null:events[Number(trigger.dataset.anomalyEvent)];
  const evidence=selected?[selected]:events;
  openDialog(name+'课堂记录','<div class="basic-dialog-value"><strong>'+events.length+'<small>次</small></strong></div>'+(evidence.length?'<div class="attitude-record-list">'+evidence.map(item=>'<article><time>'+escapeHTML(item.time)+'</time><p>'+escapeHTML(item.description)+'</p></article>').join('')+'</div>':'<p>本课示例未记录该行为。</p>')+(row===0?'<div class="dialog-note">仅记录可见的看手机线索；是否用于教学，需结合当时课堂活动核查。原画面未提供，不能据此认定违规。</div>':''),'教学态度 / 教师异常行为');
 });

 const emotionRoot=emotion.shadowRoot;
 emotionRoot.querySelector('[data-open]')?.setAttribute('hidden','');
 const emotionStyle=document.createElement('style');emotionStyle.textContent='[data-open][hidden]{display:none!important}:host{margin-top:0!important}#arcs path{cursor:pointer}#arcs path:focus-visible{outline:2px solid #1d70f2;outline-offset:3px}.attitude-emotion-ai{display:flex;gap:9px;align-items:flex-start;background:#f4f8ff;border-radius:5px;padding:10px 12px;margin:0 0 22px;font-size:11px;line-height:1.7;color:#596576}.attitude-emotion-ai img{flex:none;margin-top:2px}';emotionRoot.append(emotionStyle);
 const emotionAnalysis=document.createElement('div');emotionAnalysis.className='attitude-emotion-ai';emotionAnalysis.innerHTML='<img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><span>表情以平静为主；微笑和惊讶的作用需结合问答片段复盘，不以表情占比判断教学投入。</span>';emotionRoot.querySelector('.heading').after(emotionAnalysis);
 const scope=emotionRoot.querySelector('.scope');emotionRoot.querySelector('dialog .dialog').append(scope);
 let ringTrigger=null;
 emotionRoot.querySelectorAll('#arcs path').forEach((path,index)=>{
  path.setAttribute('role','button');path.setAttribute('tabindex','0');path.setAttribute('aria-label',['平静60%','微笑30%','惊讶10%'][index]+'，查看对应时段');
  const open=()=>{ringTrigger=path;emotionRoot.querySelector('[data-series="'+index+'"][data-part="0"]')?.click();};
  path.addEventListener('click',open);path.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();open();}});
 });
 emotionRoot.querySelector('dialog').addEventListener('close',()=>{ringTrigger?.focus({preventScroll:true});ringTrigger=null;});
 emotion.hidden=true;patrol.hidden=true;
 patrol.addEventListener('click',event=>{
  const target=event.target.closest('[data-patrol]');if(!target)return;
  event.stopImmediatePropagation();
  const item=attitudeData.patrol[Number(target.dataset.patrol)];
  openDialog(item.label,'<div class="basic-dialog-value"><strong>'+item.percent+'<small>%</small></strong></div><p>'+escapeHTML(item.detail)+'</p><div class="dialog-note">当前示例只提供区域占比与路线示意，未提供可定位的原始画面；不据此判断指导质量。</div>','教学态度 / 巡堂轨迹');
 },true);
 patrol.addEventListener('keydown',event=>{const target=event.target.closest('svg [role="button"]');if(target&&(event.key==='Enter'||event.key===' ')){event.preventDefault();event.stopPropagation();target.dispatchEvent(new MouseEvent('click',{bubbles:true}));}});
 management.querySelector('[data-cm-open]')?.setAttribute('hidden','');
 body.hidden=true;
 language.hidden=true; // Historical module retained; the active language module is under teaching method.
 const footer=root.querySelector('footer');root.append(basics,management,anomaly,language,posture,emotion,patrol,body,footer);footer.hidden=true;
 root.dataset.attitudeIteration='1.1';
 const analysis=document.createElement('div');analysis.className='attitude-insight';analysis.innerHTML='<img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>到课与着装记录正常；提前下课和疑似代课需核查，敏感词及看手机记录应结合原话和用途复核。</p>';basics.querySelector('.section-heading').after(analysis);
 const postureAnalysis=posture.querySelector('.attitude-insight p');if(postureAnalysis)postureAnalysis.textContent='站立（含走动）约93%，其中走动约31%；姿态时序可定位相应片段，不能仅据时长判断教学质量。';
 posture.querySelector('.posture-timeline h3 span')?.remove();
 posture.querySelector('.chart-footnote')?.remove();
 // Keep historical links usable without making a hidden module visible automatically.
 document.addEventListener('attitude:route',()=>{
  if(!location.hash.startsWith('#attitude'))emotionRoot.querySelector('dialog[open]')?.close();
 });
}
