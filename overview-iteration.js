import {overviewIterationVersion} from './overview-iteration-version.js';
import {reviews} from './overview-review-short.js';
import {chartEvidenceV2} from './overview-evidence-data.js';

const groups=[['attitude','教学态度',92.1],['content','教学内容',98.2],['method','教学方法',82.1],['literacy','课堂素养',95.1],['effect','教学效果',93.8]];
const modules={attitude:[['basics','基础情况'],['attendance','教师考勤'],['attire','教学着装'],['sensitive','敏感词'],['management','课堂管理'],['anomaly','教师异常行为'],['body','肢体语言'],['posture','教学姿态'],['emotion','教师情感'],['patrol','巡堂轨迹']],content:[['goals','教学目标'],['challenges','教学重难点'],['practice','理论联系实际'],['features','学科特点'],['accuracy','知识准确性']],method:[['multimedia','多媒体运用'],['language','语言表达'],['interaction','师生互动'],['questions','教学提问'],['board','课堂板书'],['homework','引导课后学习']],literacy:[['values','课程思政'],['collaboration','合作能力'],['critical','审辩思维'],['communication','沟通能力']],effect:[['monitoring','学情监测'],['state','学生学习状态'],['anomalies','学生异常行为'],['pyramid','学习金字塔'],['actions','学生动作']]};
const summaries=['准时到课、着装规范，部分课堂行为线索仍需结合情境核查。','教学目标与重难点清晰，学科前沿和跨学科联系较丰富。','课堂以教师讲授为主，建议增加高阶提问、学生表达和反馈。','已结合智慧医疗案例，建议增加论证、表达与合作任务。','课堂参与总体较高，建议结合低谷时段持续跟进参与质量。'];
const moduleSummaries={
  basics:'到课、着装及课堂风险行为概况',attendance:'13:27到课；16:32离开，提前3分钟待核查',attire:'着装整洁、得体，未见异常',sensitive:'2条课堂用语线索，需结合上下文复核',management:'记录11次考勤、教材、屏幕及笔记提醒',anomaly:'记录2次看手机；接打电话、吸烟未记录',body:'观察课堂肢体语言丰富度变化',language:'表达总体连贯，语速约280–320字/分钟，整体偏快',posture:'站立、走动、就坐时序可定位片段',emotion:'表情以平静为主，具体作用需结合问答片段',patrol:'学生区域覆盖32.8%，需结合指导情境复核',
  goals:'覆盖知识与能力目标，大纲目标匹配度55%',challenges:'呈现6项教学重难点，难点突破仍需学生复述核验',practice:'能将课堂案例与理论内容结合',features:'体现学科思维、发展前沿及跨学科联系',accuracy:'发现1处知识表述疑点，建议结合课件与上下文核查',
  multimedia:'课件与多媒体资源基本匹配教学环节',interaction:'已形成问答互动，学生表达和反馈仍可增加',questions:'教师提问30次，高阶问题4次，追问与评价仍可加强',board:'记录6段有效板书，与课堂讲解基本同步',homework:'有课后延伸思考，未识别到明确提交要求',
  values:'结合智慧医疗案例，引导关注科技向善与职业责任',collaboration:'已有合作任务线索，建议明确分工并形成共同产出',critical:'已有证据比较意识，可增加观点论证任务',communication:'已有课堂表达机会，可增加案例复述与同伴问答',
  monitoring:'实到27人，平均抬头率82%',state:'整体参与度90%；消极表情占38%，需结合低谷时段核查',anomalies:'记录看手机5次、随意走动6次等异常行为线索',pyramid:'被动学习约67%，主动学习约33%',actions:'记录举手10次、书写14次，并出现回头与站立行为'
};
const moduleMarks={basics:'异常',body:'示范',features:'示范',accuracy:'异常',questions:'异常',board:'示范',values:'示范',collaboration:'异常',monitoring:'示范',state:'异常',anomalies:'异常'};
const moduleScores={basics:8,attendance:8,attire:10,sensitive:8,management:9,anomaly:8,language:9,posture:10,emotion:9,patrol:9,goals:9,challenges:10,practice:10,features:10,accuracy:8,multimedia:8,interaction:8,questions:7,board:9,homework:8,values:10,collaboration:8,critical:9,communication:9,monitoring:10,state:9,anomalies:8,pyramid:9,actions:10};
const codes=['h0','h1','h2','p0','p1','p2'];
const star='<img src="assets/figma/content-img111111.svg" width="16" height="16" alt="">';
const ai=text=>`<div class="overview-v2-ai">${star}<p>${text}</p></div>`;

export function mountOverviewIteration({openDialog}){
  if(overviewIterationVersion==='baseline') return;
  const root=document.querySelector('#overview');
  if(!root || root.dataset.overviewIteration) return;
  root.dataset.overviewIteration='2.0';
  document.querySelector('a[href="#literacy"]').textContent='课堂素养';
  root.querySelector('.overall-score strong').textContent='88.2';
  root.querySelector('.overall-score>div p').textContent='本课节综合评价';
  root.querySelector('.score-context').hidden=true;
  const cards=root.querySelector('.summary-grid');
  const outline=root.querySelector('[data-outline-open]');
  cards.innerHTML=`<button type="button" class="summary-item overview-v2-highlight" data-overview-section="highlights"><span class="eyebrow">亮点 <span class="arrow" aria-hidden="true">↗</span></span><h3>联系医疗实际，引导有据判断</h3><p>结合病例与资料，培养审慎判断</p></button><button type="button" class="summary-item overview-v2-problem" data-overview-section="problems"><span class="eyebrow">问题 <span class="arrow" aria-hidden="true">↗</span></span><h3>${reviews.p0.title}</h3><p>补充学生回答，确认是否理解</p></button>`;
  outline?.remove();
  const dimensionRoot=root.querySelector('#dimensions');
  dimensionRoot.innerHTML=groups.map(([id,name,score],i)=>`<button type="button" class="dimension-card" data-overview-dimension="${id}" aria-haspopup="dialog"><h3>${name}</h3><span class="tag ${score<90?'orange':''}">${score>=90?'优秀':'可提升'}</span><strong class="dimension-score">${score.toFixed(1)}</strong><p>${summaries[i]}</p></button>`).join('');
  const oldEvidence=root.querySelector('#evidence'); if(oldEvidence) oldEvidence.hidden=true;
  const oldSuggestions=root.querySelector('#suggestions'); if(oldSuggestions) oldSuggestions.hidden=true;
  const tracking=root.querySelector('#tracking'); if(tracking) tracking.hidden=true;
  root.querySelector('footer').hidden=true;
  oldEvidence?.insertAdjacentHTML('afterend',sectionHTML('highlights','课堂亮点','本课较可取的是，教师能把技术问题放进医疗应用情境，并通过追问和资料比较，引导学生说明理由、审慎判断。部分学生的回答已体现出这样的思考。','h'));
  root.querySelector('#overview-v2-highlights').insertAdjacentHTML('afterend',sectionHTML('problems','问题及改进建议','后续可更多关注学生在讲解和提示之后如何回答：对解释不充分的地方继续引导，对已经暴露的误解再次确认，并补充关键概念的学习反馈。','p'));
  updateRadar(root);
  root.addEventListener('click',event=>{const trigger=event.target.closest('[data-overview-section]');if(!trigger)return;const section=root.querySelector('#overview-v2-'+trigger.dataset.overviewSection);const heading=section?.querySelector('h2');section?.scrollIntoView({behavior:'smooth',block:'start'});if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}});

  function sectionHTML(id,title,intro,prefix){return `<section class="card section overview-v2-section" id="overview-v2-${id}"><div class="section-heading"><h2>${title}</h2></div><div class="suggestion-grid">${codes.filter(c=>c[0]===prefix).map(code=>`<button type="button" class="suggestion-card overview-v2-finding overview-v2-${prefix==='h'?'highlight':'problem'}" data-overview-proof="${code}" aria-haspopup="dialog"><span class="eyebrow">${prefix==='h'?'课堂亮点':'重点改进'}</span><h3>${reviews[code].title}</h3><p>${reviews[code].summary}</p>${prefix==='p'?`<p class="overview-v2-advice">${reviews[code].suggestion}</p>`:''}</button>`).join('')}</div></section>`;}
  function diagnosis(id){const i=groups.findIndex(g=>g[0]===id),g=groups[i],level=g[2]<90?'可提升':'优秀',selected=window.__reportVersionConfig?.modules?.[g[1]],items=modules[id].filter(([key])=>{const module=document.getElementById(id+'-'+key);return module&&!module.hidden&&(!selected||selected.includes(id+'-'+key));});openDialog(g[1],`<div class="modal-score overview-v2-diagnosis-score"><strong>${g[2]}<small>分</small></strong><span class="tag ${g[2]<90?'orange':''}">${level}</span></div>${ai(summaries[i])}<div class="overview-v2-module-list">${items.map(([key,name])=>`<button type="button" class="overview-v2-module-row" data-overview-module="${id}-${key}"><span class="overview-v2-module-name">${name}</span><span class="overview-v2-module-summary">${moduleSummaries[key]}</span><span class="overview-v2-module-score"><strong>${moduleScores[key]}</strong><small>/10</small></span>${moduleMarks[key]?`<span class="overview-v2-module-mark ${moduleMarks[key]==='异常'?'is-warning':'is-example'}">${moduleMarks[key]}</span>`:'<span></span>'}</button>`).join('')}</div>`,'诊断地图 / 指标摘要');}
  function proof(code){const r=reviews[code];openDialog(r.title,`${ai(r.summary)}<section class="overview-v2-review">${r.paragraphs.map(p=>`<p>${p}</p>`).join('')}<h3>${code[0]==='h'?'进一步发挥教学优势':'教学建议'}</h3><p>${r.suggestion}</p></section><h3 class="overview-v2-evidence-title">相关课堂记录</h3>${chartEvidenceV2(code)}`,'课堂诊断');document.querySelector('#detail-dialog').classList.add('overview-v2-proof-dialog');}
  root.addEventListener('click',event=>{const score=event.target.closest('[data-action="scoring"]');const axis=event.target.closest('#radar [data-dimension]');const mapCard=event.target.closest('#dimensions [data-dimension]');if(!score&&!axis&&!mapCard)return;event.preventDefault();event.stopImmediatePropagation();if(axis){const section=root.querySelector('#diagnosis-title')?.closest('.section');const heading=section?.querySelector('h2');section?.scrollIntoView({behavior:'smooth',block:'start'});if(heading){heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});}return;}if(mapCard){const group=groups[Number(mapCard.dataset.dimension)];if(group)diagnosis(group[0]);return;}openDialog('得分说明',`<p>五个维度采用百分制；观测点按各自满分及用户配置权重折算，模块不单独打分。</p><table class="detail-table"><thead><tr><th>评价维度</th><th>本课节得分</th><th>权重</th></tr></thead><tbody>${groups.map(g=>`<tr><td>${g[1]}</td><td>${g[2]}</td><td>20%</td></tr>`).join('')}</tbody></table><h3>综合得分：88.2 分</h3>`,'报告说明');},true);
  root.addEventListener('click',event=>{const card=event.target.closest('[data-overview-card]');if(card){const target=root.querySelector(`[data-overview-proof="${card.dataset.overviewCard}"]`);target?.scrollIntoView({behavior:'smooth',block:'center'});target?.focus({preventScroll:true});return;}const d=event.target.closest('[data-overview-dimension]');if(d){diagnosis(d.dataset.overviewDimension);return;}const finding=event.target.closest('[data-overview-proof]');if(finding) proof(finding.dataset.overviewProof);});
  document.querySelector('#detail-dialog').addEventListener('click',event=>{const jump=event.target.closest('[data-overview-module]');if(!jump)return;const id=jump.dataset.overviewModule;document.querySelector('#detail-dialog').close();setTimeout(()=>{location.hash='#'+id;},0);});
  document.querySelector('#detail-dialog').addEventListener('close',event=>event.currentTarget.classList.remove('overview-v2-proof-dialog'));
}

function updateRadar(root){const svg=root.querySelector('#radar svg');if(!svg)return;const point=(i,v)=>[175+Math.sin(i*Math.PI*2/5)*96*v/100,135-Math.cos(i*Math.PI*2/5)*96*v/100];const current=[...svg.querySelectorAll('polygon')].at(-1);current?.setAttribute('points',groups.map((g,i)=>point(i,g[2]).join(',')).join(' '));svg.querySelectorAll('.axis-label').forEach((label,i)=>{label.querySelector('text').textContent=groups[i][1];label.querySelector('.value').textContent=groups[i][2];});svg.querySelectorAll('circle[r="2.6"]').forEach((circle,i)=>{const p=point(i,groups[i][2]);circle.setAttribute('cx',p[0]);circle.setAttribute('cy',p[1]);});}
