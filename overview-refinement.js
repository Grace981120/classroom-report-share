export function mountOverviewRefinement(){const doc=document;const win=window;const main=doc.querySelector('.recording-main');const merged=doc.querySelector('#merged-overview');if(!main||!merged||main.dataset.overviewRefinement)return;main.dataset.overviewRefinement='20261028';
const css=doc.createElement('style');css.textContent=`
body.overview-recording-merge #recording .recording-main{height:auto;overflow:visible;padding-bottom:80px}
body.overview-recording-merge #recording .recording-layout{min-height:0}
body.overview-recording-merge #recording .recording-heading{margin-bottom:18px}
body.overview-recording-merge #merged-overview{padding:0 24px 24px}
body.overview-recording-merge #merged-overview>.hero{display:none}
.refine-summary{margin-bottom:20px;display:grid;grid-template-columns:160px minmax(0,1fr) 265px;gap:24px;padding:18px 22px;background:#f8faff;border:1px solid #e5ecf8;border-radius:8px;align-items:center}
.refine-score{border-right:1px solid #e0e7f2;padding-right:22px}.refine-label{font-size:13px;color:#64748a;line-height:22px}.refine-label img{width:16px;height:16px;vertical-align:-3px;margin-right:6px}.refine-number{margin:4px 0 0;color:#1d70f2;font-size:42px;font-weight:600;line-height:52px}.refine-number small{font-size:13px;font-weight:400;margin-left:6px}.refine-score button{font-size:11px;color:#8995a6;padding:0;background:none;border:0}.refine-copy{display:flex;flex-direction:column;gap:10px}.refine-copy p{margin:0;font-size:13px;line-height:24px;color:#58677d}.refine-copy strong{font-size:12px;font-weight:500;color:#479d78;padding:3px 7px;border-radius:4px;background:#eaf6ef;margin-right:9px}.refine-copy .advice strong{color:#c78a52;background:#fff0e3}.refine-radar{display:flex;justify-content:center;height:142px;border-left:1px solid #e0e7f2;padding-left:12px}.refine-radar svg{height:142px;width:225px}.refine-radar .axis-label text{font-size:13px}
body.overview-recording-merge #recording .recording-player:not(:fullscreen){height:440px;aspect-ratio:auto}
#overview-v2-highlights,#overview-v2-problems{display:none!important}
.refine-caption{font-size:12px;color:#9aa3b1;margin-left:auto;font-weight:400}
@media(max-width:1100px){.refine-summary{grid-template-columns:130px minmax(0,1fr)}.refine-radar{display:none}.refine-copy p{font-size:12px}}
`;doc.head.append(css);
const course=merged.querySelector('.course-name');const meta=merged.querySelector('.course-meta');if(course)doc.querySelector('.recording-title h1').textContent=course.textContent;if(meta)doc.querySelector('.recording-meta').innerHTML=meta.innerHTML.replace('孙志慧','授课教师：孙志慧');
const panel=doc.createElement('section');panel.className='refine-summary';panel.setAttribute('aria-label','AI评价摘要');panel.innerHTML=`<div class="refine-score"><div class="refine-label"><img src="./assets/figma/content-img111111.svg" alt="">AI综合评价</div><div class="refine-number">88.2<small>分</small></div><button type="button">得分说明 ⓘ</button></div><div class="refine-copy"><p><strong>教学优势</strong>结合医疗案例讲解，引导学生核对资料来源，关注病例适用条件，培养有依据的判断。</p><p class="advice"><strong>改进建议</strong>追问后请学生完整解释，并用新情境检查理解，确认概念误区是否消除。</p></div><div class="refine-radar"></div>`;
const svg=merged.querySelector('#radar svg');if(svg)panel.querySelector('.refine-radar').append(svg.cloneNode(true));doc.querySelector('.recording-heading').after(panel);panel.querySelector('img').src=new URL('./assets/figma/content-img111111.svg',location.href).href;
const title=merged.querySelector('#diagnosis-title');if(title)title.textContent='诊断地图';
panel.querySelector('.refine-radar')?.remove();
panel.querySelector('.refine-copy').innerHTML=`<div class="refine-findings"><strong>课堂亮点</strong><ul><li>联系医疗实际，引导学生有依据地判断。</li><li>通过情境追问，帮助学生把道理讲清楚。</li><li>鼓励核对资料，培养审慎的判断习惯。</li></ul></div><div class="refine-findings advice"><strong>改进建议</strong><ul><li>追问后请学生对照资料完整解释，确认理解。</li><li>对比医疗样本与运行速度，用新例子检查概念理解。</li></ul></div>`;
const thirdAdvice=doc.createElement('li');thirdAdvice.textContent='补查关键概念的课堂记录，用情境简答收集全班解释并针对误区反馈。';panel.querySelector('.refine-findings.advice ul').append(thirdAdvice);
const proofCodes=['h0','h1','h2','p0','p1','p2'];
let proofEntry=null;
panel.querySelectorAll('.refine-findings li').forEach((item,index)=>{
 const button=doc.createElement('button');button.type='button';button.textContent=item.textContent;button.setAttribute('aria-haspopup','dialog');item.replaceChildren(button);
 button.addEventListener('click',()=>{
  const original=merged.querySelector(`[data-overview-proof="${proofCodes[index]}"]`);
  const originalRoot=doc.querySelector('#overview');if(!original||!originalRoot)return;
  const parent=original.parentNode;const next=original.nextSibling;
  const scrollY=win.scrollY;proofEntry={button,scrollY};button.focus({preventScroll:true});
  originalRoot.append(original);
  try{original.click()}finally{parent.insertBefore(original,next)}
 });
});
doc.querySelector('#detail-dialog')?.addEventListener('close',()=>{if(!proofEntry)return;proofEntry.button.focus({preventScroll:true});win.scrollTo(0,proofEntry.scrollY);proofEntry=null});
const dimensionStyle=doc.createElement('style');dimensionStyle.textContent=`
.refine-summary{grid-template-columns:145px minmax(0,1fr);gap:22px}
.refine-copy{display:grid;grid-template-columns:1fr 1fr;gap:22px;align-items:start}
.refine-findings ul{list-style:none;padding:0;margin:7px 0 0;counter-reset:finding}
.refine-findings li{counter-increment:finding;position:relative;padding-left:18px;color:#58677d;font-size:13px;line-height:24px;margin:4px 0}
.refine-findings li:before{content:counter(finding) '.';position:absolute;left:0;color:#8c98a9}
.refine-findings strong{display:inline-block}
.refine-findings li button{font:inherit;color:inherit;text-align:left;padding:0;border-radius:3px;line-height:inherit}
.refine-findings li button:hover{color:#1d70f2;text-decoration:underline;text-underline-offset:3px}
.refine-comparison{width:100%;border-top:1px solid #e5eaf1;margin-top:0;padding-top:12px;display:grid;gap:7px;font-size:12px;line-height:20px;color:#8a94a4;text-align:left}
.refine-comparison>span{display:flex;align-items:baseline;justify-content:space-between;gap:6px;white-space:nowrap}
.refine-comparison b{color:#64738a;font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}
.refine-comparison em{font-style:normal;font-size:11px;color:#4d9f82}.refine-comparison em.below{color:#c89156}
.refine-average-note{font-size:11px;font-weight:400;color:#98a2b0;margin-left:auto}
#merged-overview #dimensions .dimension-card p{display:none}
#merged-overview #dimensions{gap:12px}
#merged-overview #dimensions .dimension-card{display:flex;flex-direction:column;align-items:center;padding:18px 12px;min-width:0;min-height:0}
#merged-overview #dimensions .dimension-card h3{margin-bottom:8px}
#merged-overview #dimensions .dimension-card .tag{flex:none}
#merged-overview #dimensions .dimension-score{display:inline-flex;align-items:baseline;justify-content:center;white-space:nowrap;margin:18px 0 14px;font-size:clamp(30px,2.4vw,36px);line-height:1.1;letter-spacing:-.8px}
#merged-overview #dimensions .dimension-score small{flex:none;font-size:12px;font-weight:400;color:#929eaf;margin-left:5px;letter-spacing:0}
#merged-overview #dimensions .card-arrow{display:none!important}
#merged-overview #dimensions .dimension-card::after{display:none!important}
#recording-smart-guide>.refine-summary{grid-template-columns:1fr!important}
#recording-smart-guide .refine-score{display:grid;grid-template-columns:1fr auto;align-items:center}
#recording-smart-guide .refine-number{grid-column:2;grid-row:1 / 3;margin:0}
#recording-smart-guide .refine-score button{justify-self:start}
@media(max-width:1100px){
 #merged-overview #dimensions{grid-template-columns:repeat(3,minmax(0,1fr))}
 #merged-overview #dimensions .dimension-card{min-height:0}
}
@media(max-width:700px){
 #merged-overview #dimensions{grid-template-columns:repeat(2,minmax(0,1fr))}
 #merged-overview #dimensions .dimension-card{min-height:0}
 #merged-overview #dimensions .dimension-card:last-child{grid-column:1/-1}
}
`;doc.head.append(dimensionStyle);
merged.querySelectorAll('#dimensions .tag.orange').forEach(tag=>tag.textContent='待提升');
const averages=[[89.5,88.6],[91.2,90.4],[85.6,84.8],[90.3,89.7],[89.8,88.9]];
merged.querySelectorAll('#dimensions .dimension-card').forEach((card,index)=>{const value=Number(card.querySelector('.dimension-score').textContent);const rows=['学院均分','学校均分'].map((label,j)=>{const average=averages[index][j];const delta=value-average;return `<span><span>${label}</span><b>${average.toFixed(1)} <em class="${delta<0?'below':''}">${delta<0?'↓':'↑'}${Math.abs(delta).toFixed(1)}</em></b></span>`}).join('');card.insertAdjacentHTML('beforeend',`<div class="refine-comparison">${rows}</div>`)});
merged.querySelectorAll('#dimensions .dimension-card').forEach(card=>{const score=card.querySelector('.dimension-score');if(score){score.insertAdjacentHTML('beforeend','<small> / 100</small>');card.setAttribute('aria-label',`${card.querySelector('h3').textContent}，得分${score.firstChild.textContent}分，满分100分`)}card.querySelectorAll('.card-arrow').forEach(arrow=>arrow.remove())});
doc.querySelector('#report-version-entry')?.setAttribute('hidden','');
doc.addEventListener('click',event=>{
 const card=event.target.closest('#merged-overview #dimensions .dimension-card');if(!card)return;
 event.preventDefault();event.stopImmediatePropagation();
 const dialog=doc.querySelector('#detail-dialog');
 doc.querySelector('#dialog-title').textContent=card.querySelector('h3').textContent;
 doc.querySelector('#dialog-eyebrow').textContent='诊断地图 / 指标摘要';
 dialog.classList.add('refine-diagnosis-dialog');
 doc.querySelector('#dialog-body').innerHTML='<div class="refine-dialog-score"></div><div class="refine-dialog-summary"></div><div class="overview-v2-module-list"></div>';
 const dimension=card.dataset.overviewDimension||['attitude','content','method','literacy','effect'][Number(card.dataset.dimension)];
 const report=doc.getElementById(dimension);
 const total=Number.parseFloat(card.querySelector('.dimension-score').textContent);
 const scoreHeader=doc.createElement('strong');scoreHeader.textContent=total.toFixed(1);const unit=doc.createElement('small');unit.textContent='分';scoreHeader.append(unit);
 const rating=doc.createElement('span');rating.className='tag'+(total<90?' orange':'');rating.textContent=total<90?'待提升':'优秀';dialog.querySelector('.refine-dialog-score').append(scoreHeader,rating);
 const dimensionSummaries={attitude:'准时到课、着装规范；课堂行为与用语线索需结合情境进一步核查。',content:'教学目标与重难点清晰，学科前沿和跨学科联系较丰富。',method:'课堂以教师讲授为主，建议增加高阶提问、学生表达和反馈。',literacy:'已结合智慧医疗案例，建议增加论证、表达与合作任务。',effect:'课堂参与总体较高，建议结合低谷时段持续跟进参与质量。'};
 dialog.querySelector('.refine-dialog-summary').textContent=dimensionSummaries[dimension];
 const list=dialog.querySelector('.overview-v2-module-list');
 const scoreByKey={basics:8,attendance:8,attire:10,sensitive:8,management:9,anomaly:8,language:9,body:10,posture:10,investment:9,emotion:9,patrol:9,goals:9,challenges:10,practice:10,features:10,accuracy:8,multimedia:8,interaction:8,questions:7,board:9,homework:8,values:10,collaboration:8,critical:9,communication:9,monitoring:10,state:9,anomalies:8,pyramid:9,actions:10};
 const shortSummaries={attendance:'13:27到课；16:32离开，提前3分钟待核查',attire:'着装整洁、得体，未见异常',sensitive:'2条课堂用语线索，需结合上下文复核',management:'有考勤提示、学习提醒和纪律管理记录',anomaly:'记录2次看手机，具体用途需核查',language:'表达总体连贯，语速约280–320字/分钟，整体偏快',posture:'站立、走动、就坐时序可定位片段',goals:'覆盖知识与能力目标，大纲目标匹配度55%',challenges:'呈现6项教学重难点，难点突破仍需学生复述核验',practice:'能将课堂案例与理论内容结合',features:'体现学科思维、发展前沿及跨学科联系',accuracy:'发现1处知识表述疑点，建议结合课件与上下文核查',multimedia:'课件与多媒体资源基本匹配教学环节',interaction:'已有问答互动，学生表达和反馈仍可增加',questions:'教师提问30次，高阶问题4次，追问与评价仍可加强',board:'记录6段有效板书，与课堂讲解基本同步',homework:'有课后延伸思考，未识别到明确提交要求',values:'结合医疗案例，引导关注科技向善与职业责任',collaboration:'已有合作任务线索，建议明确分工和共同产出',critical:'已有证据比较意识，可增加观点论证任务',communication:'已有课堂表达机会，可增加案例复述与同伴问答',monitoring:'实到27人，平均抬头率82%',state:'整体参与度90%，需结合参与低谷时段核查',anomalies:'记录看手机5次、随意走动6次等行为线索',pyramid:'被动学习约67%，主动学习约33%',actions:'记录举手10次、书写14次，并出现回头与站立'};
 const marks={features:'示范',accuracy:'异常',questions:'异常',board:'示范',values:'示范',collaboration:'异常',monitoring:'示范',anomalies:'异常'};
 if(report&&list){
  const isSummary=section=>section.id===dimension+'-summary'||section.matches('.dimension-summary-card,.attitude-dimension-summary');
  const sections=[...report.querySelectorAll('section[id],article[id]')].filter(section=>section.id.startsWith(dimension+'-')&&!section.hidden&&!isSummary(section)&&(section.querySelector('h2,h3')||section.shadowRoot?.querySelector('h2,h3'))&&!section.parentElement.closest('section[id^="'+dimension+'-"],article[id^="'+dimension+'-"]'));
  if(sections.length){list.replaceChildren();sections.forEach(section=>{
   const heading=section.querySelector('h2,h3')||section.shadowRoot?.querySelector('h2,h3');const key=section.id.slice(dimension.length+1);
   const row=doc.createElement('button');row.type='button';row.className='overview-v2-module-row';row.dataset.overviewModule=section.id;
   const name=doc.createElement('span');name.className='overview-v2-module-name';name.textContent=heading.textContent.trim();
   const summary=doc.createElement('span');summary.className='overview-v2-module-summary';summary.textContent=shortSummaries[key]||section.querySelector('.attitude-insight p,.overview-v2-ai p,.section-insight p,.ai-analysis p')?.textContent||'';
   const score=doc.createElement('span');score.className='overview-v2-module-score';score.innerHTML='<strong>'+ (scoreByKey[key]??'—')+'</strong><small> / 10</small>';
   const mark=doc.createElement('span');if(marks[key]){mark.className='overview-v2-module-mark '+(marks[key]==='异常'?'is-warning':'is-example');mark.textContent=marks[key]}
   row.append(name,summary,score,mark);list.append(row);
  })}
 }
 if(!dialog.open){card.focus({preventScroll:true});dialog.showModal()}
 const position={x:win.scrollX,y:win.scrollY};dialog.addEventListener('close',()=>{card.focus({preventScroll:true});win.scrollTo(position.x,position.y)},{once:true});
 dialog.querySelectorAll('.overview-v2-module-row').forEach(row=>{
  const score=row.querySelector('.overview-v2-module-score');
  if(score)score.setAttribute('aria-label',`得分 ${score.querySelector('strong')?.textContent}，满分 10 分`);
  row.querySelectorAll('.card-arrow,[aria-hidden="true"]').forEach(node=>{if(node.textContent.trim()==='↗')node.remove()});
 });
},true);
doc.querySelector('#detail-dialog').addEventListener('click',event=>{const row=event.target.closest('[data-overview-module]');if(!row)return;event.stopImmediatePropagation();doc.querySelector('#detail-dialog').close();win.location.hash='#'+row.dataset.overviewModule},true);
const dialogStyle=doc.createElement('style');dialogStyle.textContent=`
#detail-dialog .overview-v2-module-row::after{display:none!important}
#detail-dialog.refine-diagnosis-dialog .overview-v2-module-row{grid-template-columns:140px minmax(0,1fr) 46px 52px;gap:16px;min-height:64px}
.refine-dialog-score{display:flex;align-items:center;gap:18px;margin:0 0 16px}
.refine-dialog-score>strong{font-size:44px;line-height:1.2;font-weight:600;color:#243247}
.refine-dialog-score small{font-size:13px;color:#8c98a9;font-weight:400;margin-left:6px}
.refine-dialog-summary{padding:14px 18px;background:#f5f7ff;border-radius:8px;color:#63718a;font-size:14px;line-height:24px;margin-bottom:20px}
@media(max-width:650px){#detail-dialog.refine-diagnosis-dialog .overview-v2-module-row{grid-template-columns:80px minmax(0,1fr) 40px 38px;gap:8px}.refine-dialog-score>strong{font-size:36px}}
#detail-dialog .overview-v2-module-score{display:inline-flex;align-items:baseline;gap:5px;white-space:nowrap}
#detail-dialog .overview-v2-module-score small{font-size:12px;color:#96a0af}
`;doc.head.append(dialogStyle);
doc.querySelector('#detail-dialog').addEventListener('close',()=>doc.querySelector('#detail-dialog').classList.remove('refine-diagnosis-dialog'));
{
 const guideStyle=doc.createElement('style');guideStyle.textContent=`
 #recording-smart-guide{overflow-y:auto;display:block;scrollbar-width:thin}
 #recording-smart-guide[hidden]{display:none}
 #recording-smart-guide .recording-smart-overview-wrap{max-height:none;overflow:visible}
 #recording-smart-guide .recording-smart-content{display:block;flex:none;min-height:260px}
 #recording-smart-guide .recording-smart-scroll{overflow:visible;flex:none}
 #recording-smart-guide .recording-smart-switch{position:sticky;top:0;z-index:2}
 #recording-smart-guide .recording-smart-footer{position:static}
 #recording-smart-guide>.refine-summary{display:grid;grid-template-columns:105px minmax(0,1fr);gap:14px;margin:20px 20px 0;padding:16px;background:#f8faff;border-radius:8px}
 #recording-smart-guide .refine-score{padding-right:10px;border-right:0;align-self:center}
 #recording-smart-guide .refine-number{font-size:36px;line-height:46px}
 #recording-smart-guide .refine-radar{display:flex;grid-column:2;grid-row:1;height:145px;padding:0;border:0;align-items:center}
 #recording-smart-guide .refine-radar svg{width:210px;height:145px}
 #recording-smart-guide .refine-copy{grid-column:1 / -1;border-top:1px solid #e0e7f2;padding-top:14px;gap:12px}
 #recording-smart-guide .refine-copy p{font-size:13px;line-height:24px}
 #recording-smart-guide .refine-copy strong{display:table;margin-bottom:5px;line-height:20px}
 `;doc.head.append(guideStyle);
 const dimensionSection=title?.closest('section');
 if(dimensionSection)dimensionSection.before(panel);

}
doc.documentElement.dataset.overviewRefinement='20261028';
}
