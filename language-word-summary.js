import {recordingTranscript} from './recording-transcript-data.js';

const groups=[
 ['高频词',['人工智能','数据','医疗','模型','技术','知识','学习','系统','问题','算法','智能','医院','规则','机器']],
 ['语气词',['这个','然后','所以','其实','就是','那么','对吧','呃','是不是','当然','嗯','啊']],
 ['常用口头禅',['比如说','也就是说','大家想一想','大家可以','我们说','我们刚才','这样一个','实际上','我们经常','你会发现','你可以','你知道','我们可以']],
];
const escape=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const format=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
const teacherRows=recordingTranscript.filter(r=>r.speaker==='教师');

function rank(terms){
 const rows=new Map(terms.map(word=>[word,{word,count:0}]));
 const matcher=new RegExp([...terms].sort((a,b)=>b.length-a.length).join('|'),'g');
 for(const line of teacherRows){
  for(const match of line.text.matchAll(matcher)){
   const item=rows.get(match[0]);
   item.count++;
   item.example??={line,index:match.index};
  }
 }
 return [...rows.values()].filter(r=>r.count>0).sort((a,b)=>b.count-a.count).slice(0,10);
}

// Design samples only: these series are not measured from the recording.
const acoustics=[
 {title:'语速',range:[180,360],labels:['偏快','适中','偏慢'],values:[279,272,294,301,295,308,302,314,305,299,311,303,296,304,316,298,293,309,302,288,300,306,299,312,304,296]},
 {title:'音量',range:[50,90],labels:['偏大','适中','偏小'],values:[68,70,71,69,72,70,68,69,70,72,71,68,70,69,68,70,73,71,69,71,70,72,68,71,70,69]},
];
function trend({title,range:[lo,hi],labels,values},i){
 const points=values.map((v,n)=>[n*480/(values.length-1),12+(hi-v)/(hi-lo)*84]);
 const line=points.map(([x,y],n)=>i===0&&n?`H${x}V${y}`:`${n?'L':'M'}${x} ${y}`).join(' ');
 return `<section class="language-trend"><h3>${title}</h3><button type="button" data-method-language="${i}" aria-label="${title}示例趋势，查看说明"><span class="language-trend-labels" aria-hidden="true">${labels.map(t=>`<span>${t}</span>`).join('')}</span><span class="language-trend-plot"><svg viewBox="0 0 480 108" preserveAspectRatio="none" aria-hidden="true">${[12,33,54,75,96].map(y=>`<path class="language-trend-guide" d="M0 ${y}H480"/>`).join('')}<path class="language-trend-line" d="${line}"/></svg><span class="language-trend-axis" aria-hidden="true"><span>00:00</span><span>15:00</span><span>30:00</span><span>45:00</span><span>54:50</span></span></span></button></section>`;
}

export function mountLanguageWordSummary(root,pitch,{openDialog}){
 const grid=root.querySelector('.method-language-grid');
 grid.innerHTML=acoustics.map(trend).join('');
 grid.classList.add('language-acoustic-summary');
 pitch?.remove();
 root.querySelector('.attitude-insight p').textContent='示例语速约 280–320 字/分钟，整体偏快；音量适中。词语排行按已有教师转写片段统计。';
 const ranked=groups.map(([title,terms])=>({title,items:rank(terms)}));
 const panels=document.createElement('div');panels.className='language-lexical-grid';
 panels.innerHTML=ranked.map(({title,items},i)=>`<section><h3>${title}</h3><button type="button" class="language-lexical-table" data-language-rank="${i}" aria-label="查看${title}前十" aria-haspopup="dialog">${items.slice(0,3).map(({word,count})=>`<span><span>${escape(word)}</span><strong>${count}<small>次</small></strong></span>`).join('')}</button></section>`).join('');
 grid.after(panels);
 panels.addEventListener('click',e=>{
  const button=e.target.closest('[data-language-rank]');if(!button)return;
  const {title,items}=ranked[Number(button.dataset.languageRank)];
  openDialog(`${title} · 前十`,`<p>按现有教师转写片段中的出现次数排序。${items.length<10?'当前片段中不足十项，展示全部命中项。':''}</p><ol class="language-rank-list">${items.map(({word,count,example})=>{
   const {line,index}=example;
   const quote=escape(line.text.slice(0,index))+`<mark>${escape(word)}</mark>`+escape(line.text.slice(index+word.length));
   return `<li><details><summary><span>${escape(word)}</span><strong>${count} 次</strong></summary><p><time>${format(line.time)}</time> · 教师</p><blockquote>${quote}</blockquote></details></li>`;
  }).join('')}</ol>`,'教学方法 / 语言表达');
  const dialog=document.querySelector('#detail-dialog');
  dialog?.addEventListener('close',()=>button.focus({preventScroll:true}),{once:true});
 });
 const css=document.createElement('link');css.rel='stylesheet';css.href=new URL('./language-word-summary.css?v=20261110-3',import.meta.url).href;document.head.append(css);
 root.dataset.languageIntegration='2.0';
 return true;
}
