import {attitudeView,contentView,methodView,resultDetails} from './new-indicator-report-views.js';
import {indicatorEvidence as evidence,indicatorMethodEvents as methodEvents,indicatorColors as colors,indicatorPitch as pitch,indicatorTranscript as transcript} from './new-indicator-report-data.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fmt=seconds=>`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.round(seconds%60)).padStart(2,'0')}`;
const definitions={attitude:['attitude-investment','教师教学投入','attitude-management'],content:['content-depth','教学内容深度与广度','content-challenges'],method:['method-style','教学方式','method-language']};
let stylesLoaded=false;

function renderPitch(includeStat=true){
 const minTime=pitch[0].time,maxTime=pitch.at(-1).time;
 const x=time=>32+(time-minTime)/(maxTime-minTime)*312,y=hz=>146-(hz-100)/150*124;
 const points=pitch.map(row=>`${x(row.time).toFixed(2)},${y(row.hz).toFixed(2)}`).join(' ');
 const mean=Math.round(pitch.reduce((sum,row)=>sum+row.hz,0)/pitch.length);
 return `<div class="investment-pitch indicator-pitch"><span class="pitch-unit">基频 / Hz</span><svg viewBox="0 0 364 180" role="group" aria-label="语调时序，点击数据点查看对应记录">${[100,150,200,250].map(hz=>`<path d="M32 ${y(hz)}H344" stroke="#edf0f5"/><text x="25" y="${y(hz)+4}" text-anchor="end">${hz}</text>`).join('')}<polyline points="${points}" fill="none" stroke="#1d70f2" stroke-width="2" stroke-linejoin="round"/>${pitch.map((row,index)=>`<circle cx="${x(row.time).toFixed(2)}" cy="${y(row.hz).toFixed(2)}" r="4" fill="#fff" stroke="#1d70f2" stroke-width="2" role="button" tabindex="0" data-indicator-pitch="${index}" aria-label="${fmt(row.time)}，语调${row.hz}Hz"><title>${fmt(row.time)} · ${row.hz} Hz</title></circle>`).join('')}${[minTime,900,1500,maxTime].map(time=>`<text x="${x(time)}" y="173" text-anchor="middle">${fmt(time)}</text>`).join('')}</svg>${includeStat?`<button class="pitch-stat" type="button" data-indicator-pitch="all">平均 ${mean} Hz<span>146–194 Hz</span></button>`:''}</div>`;
}

function renderExpression(root,section){
 const chart=section.querySelector('#expression-chart');
 const original=root.querySelector('#attitude-emotion')?.shadowRoot?.querySelector('.donut');
 const fallback=`<svg class="donut" viewBox="0 0 220 180" aria-label="平静60%，微笑30%，惊讶10%">${[60,30,10].map((value,i)=>`<circle cx="110" cy="84" r="54" fill="none" stroke="${colors[i]}" stroke-width="18" stroke-dasharray="${(value-.8)/100*339.292} 339.292" stroke-dashoffset="${-[0,60,90][i]/100*339.292}" transform="rotate(-90 110 84)"/>`).join('')}<text x="179" y="111">60%</text><text x="9" y="119">30%</text><text x="48" y="20">10%</text></svg>`;
 chart.innerHTML=(original?.outerHTML||fallback)+`<div class="expression-legend">${['平静','微笑','惊讶'].map((name,index)=>`<button type="button" data-indicator-expression="${index}"><i style="background:${colors[index]}"></i>${name}</button>`).join('')}</div>`;
 chart.querySelectorAll('#arcs path,svg>circle').forEach((path,index)=>{path.dataset.indicatorExpression=index;path.setAttribute('role','button');path.setAttribute('tabindex','0');path.setAttribute('aria-label',['平静60%','微笑30%','惊讶10%'][index]+'，查看对应时段');});
}

function marked(text,hit){const index=hit?text.indexOf(hit):-1;return index<0?esc(text):esc(text.slice(0,index))+'<mark>'+esc(hit)+'</mark>'+esc(text.slice(index+hit.length));}
function evidenceMarkup(keys){return keys.split(',').map(key=>evidence[key]).filter(Boolean).map(item=>`<article class="evidence-record"><h3>${esc(item.title)}</h3><p class="evidence-basis">${esc(item.basis)}</p>${item.records.map(row=>`<div class="evidence-meta">${fmt(row.time)} · ${esc(row.speaker)}${row.id?' · '+esc(row.id):' · 课堂记录'}</div><blockquote class="evidence-quote">${marked(row.text,item.hit)}</blockquote>`).join('')}${item.indices?`<div class="evidence-context">${item.indices[0]>0?`<p>前文 ${fmt(transcript[item.indices[0]-1].time)} · ${esc(transcript[item.indices[0]-1].text)}</p>`:''}${item.indices.at(-1)+1<transcript.length?`<p>后文 ${fmt(transcript[item.indices.at(-1)+1].time)} · ${esc(transcript[item.indices.at(-1)+1].text)}</p>`:''}</div>`:''}</article>`).join('');}

export function mountIndicatorReport(root,kind,{openDialog}){
 if(!root)return;
 const [id,name,afterId]=definitions[kind];
 if(root.querySelector(`#${id}.indicator-report`))return;
 if(!stylesLoaded){const link=document.createElement('link');link.rel='stylesheet';link.href=new URL('./new-indicator-report.css',import.meta.url).href;document.head.append(link);stylesLoaded=true;}
 const help=text=>`<span class="help"><button type="button" aria-label="指标定义与口径" aria-expanded="false">?</button><span class="help-tip">${esc(text)}</span></span>`;
 const title=(text,definition)=>`<div class="preview-heading section-heading"><h2 id="${id}-title">${esc(text)}${help(definition)}</h2></div>`;
 const ai=text=>`<div class="preview-ai attitude-insight"><img src="${new URL('./assets/figma/attitude-img111111.svg',import.meta.url).href}" width="16" height="16" alt=""><p>${esc(text)}</p></div>`;
 const template=document.createElement('template');
 template.innerHTML=({attitude:attitudeView,content:contentView,method:methodView})[kind]({title,ai,help,methodEvents,colors,renderPitch});
 const section=template.content.firstElementChild;section.id=id;section.className='card section indicator-report';section.setAttribute('aria-labelledby',id+'-title');
 const prior=root.querySelector('#'+id);
 if(prior){prior.id=id+'-legacy';prior.hidden=true;prior.after(section);}else{const anchor=root.querySelector('#'+afterId);if(anchor)anchor.after(section);else root.append(section);}
 if(kind==='attitude')renderExpression(root,section);
 let trigger=null,position=0;
 const dialog=document.getElementById('detail-dialog');
 const show=(element,title,body)=>{trigger=element;position=window.scrollY;openDialog(title,`<div class="indicator-report-detail">${body}</div>`,element.closest('#method-language')?'教学方法 / 语言表达':element.closest('#attitude-expressions')?'教学态度 / 教师表情':name);};
 const activate=element=>{
  if(element.hasAttribute('data-indicator-result')){const result=resultDetails[element.dataset.indicatorResult];show(element,result.title,`<p class="evidence-verdict">${esc(result.result)}</p><p class="result-detail-note">${esc(result.note)}</p>${evidenceMarkup(result.keys)}`);return;}
  if(element.hasAttribute('data-indicator-evidence')){const keys=element.dataset.indicatorEvidence,items=keys.split(',').map(key=>evidence[key]);show(element,items.length===1?items[0].title:'启发式讲解',evidenceMarkup(keys));return;}
  if(element.hasAttribute('data-indicator-expression')){
   const modern=!!element.closest('#attitude-expressions'),selected=Number(element.dataset.indicatorExpression),rows=modern?[['积极','30%','9分钟','09:00–12:00、21:00–27:00'],['平淡','60%','18分钟','00:00–09:00、15:00–21:00、27:00–30:00'],['消极','10%','3分钟','12:00–15:00']]:[['平静','60%','18分钟','00:00–09:00、15:00–21:00、27:00–30:00'],['微笑','30%','9分钟','09:00–12:00、21:00–27:00'],['惊讶','10%','3分钟','12:00–15:00']];
   show(element,'教师表情',`<p class="evidence-verdict">${modern?'教师表情以平淡为主，积极30%、平淡60%、消极10%。':'可识别时段内以平静为主，伴有微笑和惊讶。'}</p><p class="result-detail-note">占比按30分钟可识别时长计算，需结合当时讲解与互动理解，不据此单独判断教学质量。</p>${element.dataset.expressionRange?`<p class="result-detail-note">当前时段：${esc(element.dataset.expressionRange)}</p>`:''}<div class="table-wrap"><table class="detail-table"><thead><tr><th>表情</th><th>占比</th><th>时长</th><th>对应时段</th></tr></thead><tbody>${rows.map((row,index)=>`<tr class="${index===selected?'selected-expression':''}">${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);return;
  }
  if(element.hasAttribute('data-indicator-pitch')){
   const all=element.dataset.indicatorPitch==='all',samples=all?pitch:[pitch[Number(element.dataset.indicatorPitch)]],mean=Math.round(pitch.reduce((n,p)=>n+p.hz,0)/pitch.length);
   show(element,'语调',`<div class="language-pitch-detail"><p class="evidence-verdict">${all?`平均基频${mean} Hz，观察范围为146–194 Hz。`:`${fmt(samples[0].time)} · 语调 ${samples[0].hz} Hz`}</p><p class="result-detail-note">音高是声音的一个特征，不直接等于激情或教学质量；结合讲解任务、重音和停顿判断其作用。</p>${all?`<div class="pitch-detail-scroll">${renderPitch(false)}</div>`:''}${samples.map((row,index)=>`<article class="evidence-record" data-pitch-record="${index}"><div class="evidence-meta">${fmt(row.time)} · 教师 · 基频 ${row.hz} Hz</div><blockquote class="evidence-quote">${esc(transcript[row.transcriptIndex].text)}</blockquote></article>`).join('')}</div>`);
   if(all){
    dialog.classList.add('language-pitch-dialog');
    dialog.addEventListener('close',()=>dialog.classList.remove('language-pitch-dialog'),{once:true});
    const host=dialog.querySelector('.language-pitch-detail');
    const locate=point=>{host.querySelectorAll('[data-pitch-record]').forEach(record=>record.classList.toggle('is-selected',record.dataset.pitchRecord===point.dataset.indicatorPitch));const record=host.querySelector(`[data-pitch-record="${point.dataset.indicatorPitch}"]`);if(record)dialog.scrollTop+=record.getBoundingClientRect().top-dialog.getBoundingClientRect().top-Math.max(80,(dialog.clientHeight-record.offsetHeight)/2)};
    host.addEventListener('click',event=>{const point=event.target.closest('[data-indicator-pitch]');if(point)locate(point)});
    host.addEventListener('keydown',event=>{const point=event.target.closest('[data-indicator-pitch]');if(point&&['Enter',' '].includes(event.key)){event.preventDefault();locate(point)}});
   }
  }
 };
 const bindInteractions=host=>{
 host.addEventListener('click',event=>{
  const helpButton=event.target.closest('.help>button');if(helpButton){const expanded=helpButton.parentElement.classList.toggle('open');helpButton.setAttribute('aria-expanded',String(expanded));return;}
  const element=event.target.closest('[data-indicator-result],[data-indicator-evidence],[data-indicator-expression],[data-indicator-pitch]');if(element&&!element.disabled)activate(element);
 });
 host.addEventListener('keydown',event=>{const element=event.target.closest('svg [role="button"]');if(element&&['Enter',' '].includes(event.key)){event.preventDefault();activate(element);}});
 };
 bindInteractions(section);
 section.bindIndicatorInteractions=bindInteractions;
 dialog?.addEventListener('close',()=>{if(!trigger)return;const opener=trigger;trigger=null;if(opener.isConnected){opener.focus({preventScroll:true});window.scrollTo({top:position,behavior:'instant'});}});
 return section;
}
