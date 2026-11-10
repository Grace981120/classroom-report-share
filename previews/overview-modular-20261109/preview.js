import {reviews} from '../../overview-review-data.js';
import {recordingTranscript as transcript} from '../../recording-transcript-data.js';
import {realVideos} from '../../recording-real-data.js';
import {ideologyRecords} from '../../literacy-ideology-report-data.js';

const abnormal='AI评分低 教师缺课 疑似代课 教师迟到 教师早退 就坐时长比例高 敏感词 教师异常行为 学习参与度低 学生出勤率低 学生迟到率高 学生早退率高 前排就坐率低 学生抬头率低 学生异常行为'.split(' ');
const exemplary='AI评分高 课堂管理 教学目标 教学重难点 理论联系实际次数多 学科思维 学科历史 学科前沿 跨学科联系 审辨思维 表达能力 合作能力 课程思政 学习参与度高 学生出勤率高 前排就座率高 学生抬头率高 学习行为类型多'.split(' ');
const fmt=t=>[Math.floor(t/60),t%60].map(n=>String(n).padStart(2,'0')).join(':');
const seconds=str=>str.split(':').reduce((a,b)=>a*60+Number(b),0);
const labels={ 't-late':'迟到','t-early':'早退','t-ppt-high':'PPT依赖度高','t-sensitive':'敏感词','t-call':'打电话','s-attendance':'出勤率低','s-eat':'吃东西','s-walk':'随意走动' };
const itemName=id=>labels[id]||(/phone/.test(id)?'看手机':/talk/.test(id)?'交头接耳':'睡觉');
const textEscape=s=>String(s).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const asr=(index,title)=>({start:transcript[index].time,title,quote:transcript[index].text,source:'课堂转写'});

export function mountModularOverview(){
 const root=document.querySelector('#recording'), main=root.querySelector('.recording-main'), overview=root.querySelector('#merged-overview');
 const old=root.querySelector('#recording-anomaly-timeline'), process=root.querySelector('#process-v4');
 if(!old||!process||!main.querySelector('.op-radar'))return;
 document.body.classList.add('modular-overview-preview');
 const scores=main.querySelector('.refine-summary');
 overview.prepend(scores);
 const top=document.createElement('div');top.className='mod-top';
 const player=root.querySelector('.recording-video-card'), stats=root.querySelector('.recording-stat-card');
 const basic=document.createElement('section');basic.className='mod-basic';basic.setAttribute('aria-label','课程基础信息与播放器');
 const section=document.createElement('section');section.className='card mod-labels';section.setAttribute('aria-label','课堂标签、亮点与改进建议');
 const heading=player.querySelector('.recording-heading');
 player.before(top);heading.classList.add('mod-course-heading');
 top.append(basic,section);basic.append(player,stats);
 const updateMini=mountFloatingPlayer(player.querySelector('.recording-player'),root,i=>jumpTo(i));
 top.after(process);
 old.hidden=true;
 section.innerHTML=[abnormal,exemplary].map((group,i)=>`<div class="mod-group ${i?'good':'bad'}"><h3>${i?'示范标签':'异常标签'}</h3><div class="mod-tag-strip"><div class="mod-tags">${group.map(label=>`<button type="button" data-label="${label}" aria-pressed="false">${label}</button>`).join('')}</div><div class="mod-tag-nav" hidden><button type="button" data-tag-dir="-1" aria-label="查看前面的${i?'示范':'异常'}标签">‹</button><button type="button" data-tag-dir="1" aria-label="查看后面的${i?'示范':'异常'}标签">›</button></div></div></div>`).join('')+'<div class="mod-evidence" hidden><div class="mod-result" aria-live="polite"></div><div class="mod-track-wrap"></div><div class="mod-detail" aria-live="polite" hidden></div></div>';
 const score=scores.querySelector('.refine-score'),scoreButton=score.querySelector('button'),number=score.querySelector('.refine-number');
 score.classList.add('mod-score');
 score.querySelector('.refine-label')?.remove();
 scoreButton.setAttribute('aria-label','查看总分与量表详情');
 scoreButton.setAttribute('aria-haspopup','dialog');
 const scoreLabel=document.createElement('span');scoreLabel.className='mod-score-label';scoreLabel.textContent='得分';
 const arrow=document.createElementNS('http://www.w3.org/2000/svg','svg');
 arrow.setAttribute('class','mod-score-arrow');arrow.setAttribute('viewBox','0 0 16 16');arrow.setAttribute('aria-hidden','true');
 arrow.innerHTML='<path d="m6 3 5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
 scoreButton.title='查看量表详情';
 scoreButton.replaceChildren(scoreLabel,number,arrow);
 const head=document.createElement('header');head.className='mod-review-head';
 head.innerHTML='<h2>AI评课</h2>';head.append(score);section.prepend(head);
 const findings=document.createElement('div');findings.className='mod-findings';
 const highlights=[
  ['联系医疗实践',reviews.h0.summary],
  ['追问技术原理',reviews.h1.summary],
  ['培养证据意识',reviews.h2.summary],
 ];
 const advice=[
  ['深化课程思政融合','讲解医疗大模型的局限时，可结合《新一代人工智能治理原则》，请学生讨论医疗 AI 如何兼顾技术创新、患者隐私与公平可及。'],
  ['增加高阶思维任务','讲解模型的黑箱问题后，可请小组为远程心电诊断设计人机协同流程，并说明哪些判断应由医生复核、如何兼顾效率与医疗安全。'],
  ['精炼课堂表达','讲解技术原理前，可先整理核心概念和过渡句。减少“这个”“然后”等填充词，按语义选用“具体而言”“由此可见”，关键处适当放慢语速。'],
 ];
 findings.innerHTML=[['课堂亮点',highlights,'highlight'],['改进建议',advice,'advice']].map(([title,items,kind])=>`<section class="mod-finding ${kind}"><h3>${title}</h3><ul>${items.map(([label,copy])=>`<li><strong>${textEscape(label)}：</strong>${textEscape(copy)}</li>`).join('')}</ul></section>`).join('');
 section.append(findings);
 const panel=section.querySelector('.mod-evidence');
 const out=section.querySelector('.mod-result'), track=section.querySelector('.mod-track-wrap'), detail=section.querySelector('.mod-detail');
 let selected=null, current=[], activeKey=null;
 const keyOf=r=>r.mark?.dataset.anomalyId??`${r.start}:${r.title}`;
 const anomaly=filter=>[...old.querySelectorAll('[data-anomaly-id]:not([hidden])')].filter(node=>filter(node.dataset.anomalyId)).map(node=>{
  const id=node.dataset.anomalyId,[start,end]=node.getAttribute('aria-label').match(/\d+:\d+/g).map(seconds);
  return {start,end,title:itemName(id),mark:node,source:'异常行为演示数据',color:node.style.getPropertyValue('--anomaly-color')};
 });
 const data={
  '教师迟到':()=>anomaly(id=>id==='t-late'),'教师早退':()=>anomaly(id=>id==='t-early'),'敏感词':()=>anomaly(id=>id==='t-sensitive'),
  '教师异常行为':()=>anomaly(id=>id.startsWith('t-')&&!['t-late','t-early','t-sensitive'].includes(id)),
  '学生出勤率低':()=>anomaly(id=>id==='s-attendance'),'学生异常行为':()=>anomaly(id=>id.startsWith('s-')&&id!=='s-attendance'),
  '教学目标':()=>[[6,'激发同学们对医疗健康的兴趣'],[44,'锻炼在场景中发现问题的能力'],[3,'学习医工交叉的思维方式'],[7,'培养跨学科合作与创新的能力']].map(([i,s])=>asr(i,s)),
  '理论联系实际次数多':()=>[asr(5,'用 MYCIN、沃森医生说明技术如何回应诊疗问题')],
  '教学重难点':()=>[asr(32,'分析专家系统的规则冲突与自主学习局限'),asr(40,'比较规则驱动与数据驱动的知识表达')],
  '学科思维':()=>[asr(40,'比较两种知识表达方式')],
  '课程思政':()=>ideologyRecords.map(r=>asr(r.index,r.title)),
  '学科历史':()=>[asr(24,'回顾人工智能发展历程')],
  '学科前沿':()=>[asr(48,'讲解具身与非具身智能')],
  '跨学科联系':()=>[asr(3,'介绍智能医学与跨学科合作')],
 };

 const show=()=>{
  const tags=[...section.querySelectorAll('[data-label]')];
  const evidence=new Map(tags.map(b=>[b.dataset.label,data[b.dataset.label]?.()||[]]));
  if(!evidence.get(selected)?.length)selected=null;
  for(const b of tags){
   const n=evidence.get(b.dataset.label).length;
   b.hidden=!n;b.classList.toggle('has-evidence',n>0);
   b.setAttribute('aria-pressed',String(b.dataset.label===selected));
   b.innerHTML=textEscape(b.dataset.label)+(n?` <span>${n}</span>`:'');
  }
  for(const group of section.querySelectorAll('.mod-group'))group.hidden=!group.querySelector('[data-label]:not([hidden])');
  current=(evidence.get(selected)||[]).sort((a,b)=>a.start-b.start);
  const sample=current[0]?.mark;
  const length=sample?2400:Math.floor(realVideos[0].duration);
  const color=abnormal.includes(selected)?'#e97024':'#1d70f2';
  section.style.setProperty('--evidence-color',color);
  out.innerHTML=current.length?`<strong>${textEscape(selected)}</strong><span${sample?' title="示例数据"':''}>${current.length} 次</span>`:'<span>本节课暂无可定位标签</span>';
  if(!current.some(r=>keyOf(r)===activeKey))activeKey=null;
  detail.hidden=!activeKey;
  panel.hidden=!current.length;
  updateMini?.(current,current.findIndex(r=>keyOf(r)===activeKey));
  if(!current.length){track.innerHTML='';return;}
  const marks=current.map(({start,end,title,color},i)=>{
   const pos=Math.min(100,start/length*100);
   const caption=`${fmt(start)}${end?'–'+fmt(end):''} ${textEscape(title)}`;
   return `<button type="button" data-evidence-index="${i}" class="mod-mark mod-point${keyOf(current[i])===activeKey?' chosen':''}" style="--pos:${pos}%;--dot:${color||'var(--evidence-color)'}" aria-label="${caption}" title="${caption}"></button>`;
  }).join('');
  track.innerHTML=`<div class="mod-track" role="group" aria-label="${textEscape(selected)}证据时间轴">${marks}</div>`;
 };
 function seekPlayer(seconds){
  const slider=root.querySelector('#recording-seek');
  if(!slider||!Number.isFinite(seconds))return;
  slider.value=seconds;slider.dispatchEvent(new Event('input',{bubbles:true}));
 }
 process.addEventListener('click',e=>{
  const entry=e.target.closest('button.bar,button.stage');if(!entry)return;
  if(entry.matches('.bar'))seekPlayer(Number(entry.dataset.start)*60);
  else{
   const start=entry.dataset.tooltip?.match(/(\d+):(\d+)–/);
   if(start)seekPlayer(Number(start[1])*60+Number(start[2]));
  }
 });
 function jumpTo(i){
  const r=current[i];if(!r)return;
  section.querySelectorAll('[data-evidence-index]').forEach(b=>b.classList.toggle('chosen',Number(b.dataset.evidenceIndex)===i));
  activeKey=keyOf(r);
  detail.hidden=false;
  detail.innerHTML=`<strong>${fmt(r.start)}${r.end?'–'+fmt(r.end):''} · ${textEscape(r.title)}</strong><p>${r.quote?textEscape(r.quote):textEscape(r.source)}</p>`;
  seekPlayer(r.start);
  updateMini?.(current,i);
 }
 section.addEventListener('click',e=>{
  const label=e.target.closest('[data-label]');
  if(label){
   selected=selected===label.dataset.label?null:label.dataset.label;
   activeKey=null;show();if(selected)jumpTo(0);return;
  }
  const entry=e.target.closest('[data-evidence-index]');
  if(entry)jumpTo(Number(entry.dataset.evidenceIndex));
 });
 for(const strip of section.querySelectorAll('.mod-tag-strip')){
  const list=strip.querySelector('.mod-tags'),nav=strip.querySelector('.mod-tag-nav'),[prev,next]=nav.querySelectorAll('button');
  const sync=()=>{
   nav.hidden=list.scrollWidth<=strip.clientWidth+1;
   prev.disabled=list.scrollLeft<2;
   next.disabled=list.scrollLeft+list.clientWidth>=list.scrollWidth-2;
  };
  nav.addEventListener('click',e=>{
   const btn=e.target.closest('[data-tag-dir]');if(!btn)return;
   const direction=Number(btn.dataset.tagDir);
   const edges=[...list.querySelectorAll('button:not([hidden])')].map(b=>b.offsetLeft);
   const target=direction>0?edges.find(x=>x>list.scrollLeft+list.clientWidth-50):edges.filter(x=>x<list.scrollLeft-2).find(x=>x>=list.scrollLeft-list.clientWidth);
   list.scrollTo({left:target??(direction>0?list.scrollWidth:0),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  list.addEventListener('scroll',sync,{passive:true});
  new ResizeObserver(sync).observe(strip);
  new MutationObserver(sync).observe(list,{subtree:true,attributes:true,attributeFilter:['hidden']});
  requestAnimationFrame(sync);
 }
 show();
 new MutationObserver(records=>{if(records.some(r=>r.target.matches('[data-anomaly-id]')))show();}).observe(old,{subtree:true,attributes:true,attributeFilter:['hidden']});
 const radar=scores.querySelector('.op-radar');
 const tip=document.createElement('div');tip.className='mod-radar-tip';tip.hidden=true;tip.setAttribute('role','tooltip');tip.id='mod-radar-tip';radar.append(tip);
 const showComparison=axis=>{
  const college=Number(axis.dataset.college),school=Number(axis.dataset.school),score=Number(axis.querySelector('.value').textContent);
  const compare=(name,value)=>{const diff=Math.round((score-value)*10)/10;return `<span>${name} <b>${value.toFixed(1)}</b><em class="${diff<0?'low':''}">${diff===0?'持平':`<span aria-hidden="true">${diff>0?'↑':'↓'}</span><span class="sr-only">${diff>0?'高':'低'} </span>${Math.abs(diff).toFixed(1)} 分`}</em></span>`;};
  tip.innerHTML=`<strong>${axis.querySelector('text').textContent} · 本课 ${score} 分</strong>${compare('学院均分',college)}${compare('全校均分',school)}`;
  tip.hidden=false;axis.setAttribute('aria-describedby',tip.id);
 };
 for(const event of ['pointerover','focusin'])radar.addEventListener(event,e=>{const target=e.target;let axis=target.closest?.('[data-dimension]');if(!axis&&target.matches?.('circle[r="2.6"]')){const svg=target.ownerSVGElement;axis=svg.querySelectorAll('.axis-label')[[...svg.querySelectorAll('circle[r="2.6"]')].indexOf(target)];}if(axis)showComparison(axis);else tip.hidden=true;});
 radar.addEventListener('pointerleave',()=>{tip.hidden=true;});
 radar.addEventListener('focusout',()=>{tip.hidden=true;});
}


function mountFloatingPlayer(player, root, onJump){
 if(!player)return;
 const anchor=document.createElement('div');
 anchor.className='mod-player-anchor';
 player.before(anchor);anchor.append(player);
 const controls=document.createElement('div');
 controls.className='mod-float-tools';controls.hidden=true;
 controls.innerHTML='<button type="button" data-return-player aria-label="回到大播放器" title="回到大播放器">↗</button><button type="button" data-close-player aria-label="关闭浮窗" title="关闭浮窗">×</button>';
 const jumps=document.createElement('div');
 jumps.className='mod-float-jumps';jumps.hidden=true;
 jumps.innerHTML='<button type="button" data-prev aria-label="上一条证据">‹</button><button type="button" data-repeat aria-label="跳到当前证据时间"></button><button type="button" data-next aria-label="下一条证据">›</button>';
 player.append(controls,jumps);
 let evidence=[],index=-1;
 const prev=jumps.querySelector('[data-prev]'),repeat=jumps.querySelector('[data-repeat]'),next=jumps.querySelector('[data-next]');
 prev.onclick=()=>onJump(index-1);repeat.onclick=()=>onJump(index);next.onclick=()=>onJump(index+1);
 let dismissed=false, frame=0;
 function refresh(){
  frame=0;
  if(root.hidden||document.fullscreenElement){player.classList.remove('mod-floating');controls.hidden=true;jumps.hidden=true;return;}
  const box=anchor.getBoundingClientRect(),nav=document.querySelector('.topbar').getBoundingClientRect();
  if(box.bottom>nav.bottom+36)dismissed=false;
  const floating=!dismissed&&box.bottom<=nav.bottom;
  player.classList.toggle('mod-floating',floating);
  controls.hidden=!floating;
  jumps.hidden=!floating||index<0;
  if(floating)player.style.setProperty('--float-left',Math.max(12,box.left)+'px');
 }
 function schedule(){if(!frame)frame=requestAnimationFrame(refresh);}
 controls.querySelector('[data-close-player]').onclick=()=>{dismissed=true;refresh();};
 controls.querySelector('[data-return-player]').onclick=()=>{dismissed=true;refresh();anchor.scrollIntoView({block:'start',behavior:'smooth'});};
 window.addEventListener('scroll',schedule,{capture:true,passive:true});
 window.addEventListener('resize',schedule);
 window.addEventListener('hashchange',schedule);
 document.addEventListener('fullscreenchange',schedule);
 new ResizeObserver(schedule).observe(anchor);
 schedule();
 return (items,active)=>{
  evidence=items;index=active;
  prev.disabled=index<=0;next.disabled=index<0||index>=evidence.length-1;
  repeat.textContent=index<0?'':fmt(evidence[index].start);
  jumps.hidden=!player.classList.contains('mod-floating')||index<0;
 };
}
