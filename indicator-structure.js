import {mountLanguageIntegration} from './language-integration.js?v=20261102-release';
import {teacherInvestmentWindows as windows,teacherInvestmentSummary as summary} from './teacher-investment-data.js';
import {indicatorStructureVersion} from './indicator-structure-version.js';
const ai=text=>`<div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>${text}</p></div>`;
const section=(id,title)=>{const node=document.createElement('section');node.id=id;node.className='card section';node.setAttribute('aria-labelledby',id+'-title');node.innerHTML=`<div class="section-heading"><h2 id="${id}-title">${title}</h2></div>`;return node};
export function mountIndicatorStructure({openDialog}){
 if(indicatorStructureVersion==='baseline'||location.pathname.includes('/previews/')||document.documentElement.dataset.indicatorStructure)return false;
 const investment=document.querySelector('#attitude-investment.indicator-report');
 if(!investment)return false;
 const observations=investment.querySelectorAll('.investment-observation');
 const expression=observations[1],pitch=observations[2];
 const expressionCard=section('attitude-expressions','教师表情');expressionCard.classList.add('indicator-report','teacher-expression-card');
 const expressionHelp=expression.querySelector('h3 .help');if(expressionHelp)expressionCard.querySelector('h2').append(expressionHelp);
 expression.querySelector('h3').hidden=true;
 expressionCard.insertAdjacentHTML('beforeend',ai('教师表情以平淡为主，积极表情占30%、消极表情占10%；可结合各表情对应的讲解与互动时段复盘，不以表情占比直接判断教学质量。'));
 const expressionLayout=document.createElement('div');expressionLayout.className='effect-split teacher-expression-layout';
 const distribution=document.createElement('div');distribution.innerHTML='<h3>表情分布</h3>';distribution.append(expression);
 const timeline=document.createElement('div');timeline.className='teacher-expression-timeline';timeline.innerHTML='<h3>教师表情时序</h3><div class="teacher-expression-scroll"><div class="teacher-expression-tracks"></div></div>';
 const tracks=timeline.querySelector('.teacher-expression-tracks');
 const source=document.querySelector('#attitude-emotion')?.shadowRoot;
 const categories=[{name:'积极',color:'#1d70f2',original:1,percent:30},{name:'平淡',color:'#00cc7e',original:0,percent:60},{name:'消极',color:'#e545d2',original:2,percent:10}];
 const donut=expression.querySelector('.donut');
 donut?.setAttribute('aria-label','积极30%，平淡60%，消极10%');
 donut?.querySelectorAll('[data-indicator-expression]').forEach(path=>{const item=categories.find(c=>c.original===Number(path.dataset.indicatorExpression)),index=categories.indexOf(item);path.dataset.indicatorExpression=index;path.setAttribute('fill',item.color);path.setAttribute('aria-label',`${item.name}${item.percent}%，查看对应时段`)});
 expression.querySelectorAll('.expression-legend button').forEach((button,index)=>{const item=categories[index];button.dataset.indicatorExpression=index;button.innerHTML=`<i style="background:${item.color}"></i>${item.name}`});
 categories.forEach((category,index)=>{
  const row=source?.querySelectorAll('#tracks .row')[category.original];if(!row)return;
  const line=document.createElement('div');line.className='teacher-expression-row';line.innerHTML=`<span>${category.name}</span><div class="teacher-expression-track"></div>`;
  row.querySelectorAll('.segment').forEach(segment=>{
   const button=document.createElement('button');button.type='button';button.dataset.indicatorExpression=index;const range=category.name+' '+segment.getAttribute('aria-label').split(' ').slice(1).join(' ');button.dataset.expressionRange=range;button.setAttribute('aria-label',range+'，查看时段依据');button.title=range;button.style.cssText=segment.style.cssText;button.style.background=category.color;line.lastElementChild.append(button);
  });tracks.append(line);
 });
 tracks.insertAdjacentHTML('beforeend','<div class="teacher-expression-axis">'+[0,5,10,15,20,25,30].map(m=>`<span>${String(m).padStart(2,'0')}:00</span>`).join('')+'</div>');
 expressionLayout.append(distribution,timeline);expressionCard.append(expressionLayout);investment.after(expressionCard);investment.bindIndicatorInteractions?.(expressionCard);
 const language=document.querySelector('#method-language');
 if(language&&pitch){pitch.classList.add('indicator-pitch-section','indicator-report');language.append(pitch);investment.bindIndicatorInteractions?.(pitch);mountLanguageIntegration(language,pitch,{openDialog,bindEvidence:investment.bindIndicatorInteractions});}
 mountInvestment(investment,{openDialog});
 const effect=document.querySelector('#effect'),state=effect.querySelector('#effect-state');
 if(state){
  const splitCards=[];
  for(const [key,title] of [['participation','学习参与度'],['expressions','学生表情']]){
   const panel=state.querySelector('#panel-'+key),anchor=panel?.querySelector('#effect-'+key);if(!panel||!anchor)continue;
   anchor.id+='-retired';
   const card=section('effect-'+key,title);[...panel.children].filter(n=>n!==anchor).forEach(n=>card.append(n));state.before(card);splitCards.push(card);
  }
  effect.querySelector('#effect-monitoring')?.after(...splitCards);
  state.hidden=true;state.dataset.structureRetired='true';effect.dataset.indicatorStructure='split';
 }
 document.documentElement.dataset.indicatorStructure='ready';return true;
}

function mountInvestment(card,{openDialog}){
 const time=t=>`${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;
 const point=(x,y)=>[48+x/summary.duration*900,168-y/100*144];
 const points=windows.map(w=>point((w.start+w.end)/2,w.value).join(',')).join(' ');
 card.classList.add('teacher-investment-card');
 card.innerHTML=`<div class="section-heading"><h2 id="attitude-investment-title">教师教学投入<span class="help"><button type="button" aria-label="教学投入定义与口径" aria-expanded="false">?</button><span class="help-tip">观察教师持续讲解、示范、组织互动与指导学习的时间分布。投入度为可观察时段中上述活动的时长占比，不由表情、音调或备课情况合成，也不直接代表教学质量。</span></span></h2></div>${ai('整体教学投入度为87%，各时段在78%至94%之间；60–70分钟相对较低，可结合当时指导学习与活动转换的安排复盘。')}<div class="effect-participation-layout teacher-investment-layout"><button type="button" class="effect-gauge" data-investment-window="all" aria-label="整体教学投入度87%，查看时段依据"><span class="effect-gauge-plot"><img class="teacher-investment-gauge-background" src="assets/figma/effect-participation-imgEllipse1165.svg" width="119.76" height="60" style="left:.12px;top:0" alt=""><svg viewBox="0 0 120 60" class="teacher-investment-gauge-value" aria-hidden="true"><path d="${investmentGaugePath(summary.value)}" fill="#1d70f2"/></svg><strong>${summary.value}<small>%</small></strong><span>整体教学投入度</span></span></button><div class="teacher-investment-chart"><div class="teacher-investment-plot"><svg viewBox="0 0 972 200" role="group" aria-label="教学投入度随时间变化，点击时段查看依据">${[0,25,50,75,100].map(v=>`<path d="M48 ${point(0,v)[1]}H948" fill="none" stroke="#e9ecf0" stroke-dasharray="3 3"/><text x="38" y="${point(0,v)[1]+4}" text-anchor="end">${v}%</text>`).join('')}<polyline points="${points}" fill="none" stroke="#1d70f2" stroke-width="2" stroke-linejoin="round"/>${windows.map((w,i)=>{const [x,y]=point((w.start+w.end)/2,w.value);return `<circle cx="${x}" cy="${y}" r="4" fill="white" stroke="#1d70f2" stroke-width="2" role="button" tabindex="0" data-investment-window="${i}" aria-label="${time(w.start)}至${time(w.end)}，教学投入度${w.value}%"><title>${time(w.start)}–${time(w.end)} · ${w.value}%</title></circle>`}).join('')}${[0,1800,3600,5400,7200,7800].map(t=>`<text x="${point(t,0)[0]}" y="193" text-anchor="middle">${time(t)}</text>`).join('')}</svg></div></div></div>`;
 let trigger=null,position;
 const activate=element=>{
  const selected=element.dataset.investmentWindow==='all'?null:Number(element.dataset.investmentWindow);
  trigger=element;position={x:scrollX,y:scrollY};
  openDialog('教师教学投入',`<div class="indicator-report-detail"><p class="evidence-verdict">整体教学投入度 ${summary.value}%，观察范围 ${time(0)}–${time(summary.duration)}。</p><p class="result-detail-note">按每10分钟一个观察窗统计，投入时长为持续讲解、示范、组织互动及指导学习的时长。活动转换等其余时长不直接判为消极；表情、音调和备课情况不计入本项。</p><div class="table-wrap"><table class="detail-table"><thead><tr><th>观察时段</th><th>主要活动</th><th>投入时长</th><th>投入度</th></tr></thead><tbody>${windows.map((w,i)=>`<tr ${i===selected?'class="investment-selected" aria-current="true"':''}><td>${time(w.start)}–${time(w.end)}</td><td>${w.activity}</td><td>${(w.activeSeconds/60).toFixed(1)} / 10 分钟</td><td>${w.value}%</td></tr>`).join('')}</tbody></table></div></div>`,'教学态度 / 教师教学投入');
  if(selected!==null)requestAnimationFrame(()=>document.querySelector('#detail-dialog .investment-selected')?.scrollIntoView({block:'center'}));
 };
 card.addEventListener('click',event=>{const button=event.target.closest('[data-investment-window]');if(button)activate(button)});
 card.addEventListener('keydown',event=>{const button=event.target.closest('svg [data-investment-window]');if(button&&['Enter',' '].includes(event.key)){event.preventDefault();activate(button)}});
 document.querySelector('#detail-dialog').addEventListener('close',()=>{if(!trigger)return;const opener=trigger;trigger=null;opener.focus({preventScroll:true});window.scrollTo({left:position.x,top:position.y,behavior:'instant'})});
}

function investmentGaugePath(percent){
 const outer=60,inner=48,corner=4,a=-Math.PI,b=a+Math.PI*percent/100;
 const oo=Math.asin(corner/(outer-corner)),io=Math.asin(corner/(inner+corner));
 const os=Math.sqrt((outer-corner)**2-corner**2),is=Math.sqrt((inner+corner)**2-corner**2);
 const p=(r,t)=>`${60+r*Math.cos(t)},${60+r*Math.sin(t)}`;
 return `M ${p(outer,a+oo)} A ${outer} ${outer} 0 0 1 ${p(outer,b-oo)} A ${corner} ${corner} 0 0 1 ${p(os,b)} L ${p(is,b)} A ${corner} ${corner} 0 0 1 ${p(inner,b-io)} A ${inner} ${inner} 0 0 0 ${p(inner,a+io)} A ${corner} ${corner} 0 0 1 ${p(is,a)} L ${p(os,a)} A ${corner} ${corner} 0 0 1 ${p(outer,a+oo)} Z`;
}
