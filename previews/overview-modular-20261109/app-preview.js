import {mountModularOverview} from './preview.js?v=radar30';
import {mountIndicatorStructure} from '../../indicator-structure.js?v=20261110-3';
import {mountRubricScoring} from './rubric-preview.js?v=radar30';
import {mountOverviewLayout} from './layout-preview.js?v=radar30';
import {mountReportEdit} from '../../report-edit.js?v=20261102-edit-hover';
import {initRecording} from '../../recording.js?v=20261102-anomaly2';
import {literacyData} from '../../literacy-data.js';
import {initLiteracy} from '../../literacy.js?v=20261104-fit';
import {effectData} from '../../effect-data.js';
import {initEffect} from '../../effect.js?v=20261019-jump5';
import {methodData} from '../../method-data.js';
import {initMethod} from '../../method.js?v=20261102-language-evaluation';
import {contentData} from '../../content-data.js';
import {initContent} from '../../content.js?v=20261105-two-properties-policy';
import {attitudeData} from '../../attitude-data.js';
import {initAttitude} from '../../attitude.js?v=20261102-language-evaluation';
import {mountOverviewOutline} from '../../overview-outline.js';
import {mountOverviewIteration} from '../../overview-iteration.js?v=20261102-media-order';
import {mountAgentIteration} from '../../agent-iteration.js?v=20261104-agent-icons';
import {mountReportScaleConfig} from '../../report-scale-config.js?v=20261110-teacher-defaults';
import {mountScaleEvaluationV8} from '../../scale-evaluation-v8.js?v=20261028-ai-all1';
import {mountOverviewRecordingMerge} from '../../overview-recording-merge.js?v=20261102-anomaly2';

const dimensions = [
  {name:'教学态度',score:attitudeData.score,weight:25,description:'教学投入较高，考勤与课堂行为线索待核查。',insight:attitudeData.summary,metrics:attitudeData.sections.map(s=>[s.name,s.observation,s.status])},
  {name:'教学内容',score:contentData.score,weight:20,description:contentData.description,insight:contentData.summary,metrics:contentData.sections.map(s=>[s.name,s.observation,s.status])},
  {name:'教学方法',score:methodData.score,weight:20,description:methodData.description,insight:methodData.summary,metrics:methodData.sections.map(s=>[s.name,s.observation,s.status])},
  {name:'教学素养',score:literacyData.score,weight:15,description:literacyData.description,insight:literacyData.summary,metrics:literacyData.sections.map(s=>[s.name,s.observation,s.status])},
  {name:'教学效果',score:effectData.score,weight:20,description:effectData.description,insight:effectData.summary,metrics:effectData.sections.map(s=>[s.name,s.observation,s.status])}
];
const evidence = [
  {question:'为什么说互动深度不足？',title:'课堂互动有数量，但深度不足',description:'证据综合来自教学行为、语言表达、教学提问与学生互动，数量不等同于高质量的理解和表达。',chart:'课堂行为分布',groups:[[['讲授',62],['问答',22],['讨论',8]],[['封闭提问',75],['开放提问',25],['学生追问',12]],[['教师表达',72],['学生表达',20],['自主思考',8]]],refs:[['00:18:24','连续 3 次判断式提问，学生以“是 / 不是”回答。'],['00:32:10','教师提出问题后约 3.2 秒进入讲解，学生思考时间较短。'],['00:46:35','讨论主要集中在前排，小组内观点交换较少。'],['01:12:08','练习核对以结论为主，尚未追问解题依据。']]},
  {question:'为什么说内容准备充分',title:'教学目标明确，知识结构完整',description:'课程目标、讲义、例题和课堂练习相互对应，重难点有明确提示，内容由概念逐步推进至应用。',chart:'教学内容覆盖',groups:[[['目标覆盖',98],['重点覆盖',96],['难点解析',94]],[['教案完整',100],['案例匹配',95],['练习匹配',92]],[['知识衔接',96],['内容准确',99],['资源准备',98]]],refs:[['00:02:15','课程开始明确本节参数估计的学习目标。'],['00:10:42','通过知识回顾衔接总体、样本与统计量概念。'],['00:26:18','使用分步板书说明估计量的构造过程。'],['00:51:30','围绕重点概念设置对应例题与课堂练习。'],['01:25:16','课程小结回顾关键条件与解题步骤。']]},
  {question:'学生侧效果如何验证',title:'总体参与积极，需要跟踪学习质量',description:'综合学生参与、练习完成和课堂反馈，观察学习行为变化；建议在下次课增加同类任务对比。',chart:'学生学习表现',groups:[[['平均参与',89],['练习完成',95],['主动回答',68]],[['前排参与',94],['中排参与',89],['后排参与',76]],[['概念理解',91],['应用迁移',84],['反思表达',72]]],refs:[['00:39:20','19 名学生中有 17 名参与当前课堂活动，后排参与相对较少。'],['01:18:45','18 名学生完成练习，部分回答仍缺少推理过程。']]},
  {question:'哪些异常需要关注',title:'关注局部参与下降与思考时间不足',description:'异常线索用于提示进一步观察，需要结合实际课堂情境理解，不直接作为独立评价结论。',chart:'需关注行为分布',groups:[[['注意分散',16],['参与下降',24],['练习停滞',11]],[['短时问答',75],['有效追问',28],['讨论覆盖',58]],[['前排参与',94],['中排参与',89],['后排参与',76]]],refs:[['00:32:10','候答时间较短，可延长至 8 秒后再给出提示。'],['00:46:35','部分后排学生未进入讨论，建议分配角色与发言任务。'],['01:05:28','连续讲授后出现短时注意力下降，可插入即时反馈活动。']]}
];
const suggestions = [
  {title:'课前：重写目标',tag:'低成本',text:'把“知识与技能目标”扩展为“知识、能力、素养、价值导向”四段式。',items:['补充 AI 伦理或科技向善案例','明确课堂讨论产出物','设计 1 个审辩问题']},
  {title:'课中：提高互动质量',tag:'高优先级',text:'把普通提问升级为“观点、证据、反驳、再表达”的审辩链条。',items:['候答时间不低于 8 秒','每组至少输出 1 个反方观点','教师追问聚焦论证逻辑']},
  {title:'课后：形成复盘任务',tag:'追踪项',text:'将课堂讨论沉淀为课后学习任务，用下次课数据验证参与度变化。',items:['记录学生高频误区','下次课对比参与度曲线']}
];
const $ = selector => document.querySelector(selector);
const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const storageKey = 'teaching-evaluation-demo-v1';
let saved = {};
try { saved = JSON.parse(localStorage.getItem(storageKey) || '{}') || {}; } catch { saved = {}; }
let plans = Array.isArray(saved.plans) ? [...new Set(saved.plans.filter(n => Number.isInteger(n) && n >= 0 && n < 3))] : [];
let completed = Array.isArray(saved.completed) ? saved.completed.filter(n => plans.includes(n)) : [];
let notes = {before:typeof saved.notes?.before === 'string' ? saved.notes.before.slice(0,300) : '',after:typeof saved.notes?.after === 'string' ? saved.notes.after.slice(0,300) : ''};
let activeEvidence = 0;
let expandedEvidence = false;
let activeDimension = 0;
let shownSeries = [true,true,true];
let toastTimer;
const visibleDimensions = () => {
  const config = window.__reportVersionConfig;
  return config ? config.dimensions.map(name=>dimensions.find(d=>d.name===name)).filter(Boolean) : dimensions;
};
function toast(message) { $('#toast').textContent = message; $('#toast').classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('show'),2800); }
function persist() { try { localStorage.setItem(storageKey, JSON.stringify({plans,completed,notes})); return true; } catch { toast('浏览器暂不支持保存，当前操作仅在本次访问中保留'); return false; } }
function renderDimensions() {
  $('#dimensions').innerHTML = visibleDimensions().map(d=>({d,i:dimensions.indexOf(d)})).map(({d,i}) => `<button class="dimension-card" data-dimension="${i}" aria-label="${d.name} ${d.score}分，查看评价依据"><span class="card-arrow" aria-hidden="true">↗</span><h3>${d.name}</h3><span class="tag ${i===2?'orange':''}">${i===2?'可提升':'优秀'}</span><strong class="dimension-score">${d.score.toFixed(1)}</strong><p>${d.description}</p></button>`).join('');
}
function renderRadar() {
  const activeDimensions=visibleDimensions();
  if(activeDimensions.length<3){$('#radar').innerHTML='<p class="version-radar-empty">至少启用 3 个维度后显示雷达图</p>';return;}
  const center = [175,135], radius = 96;
  const point = (i,amount) => [center[0] + Math.sin(i*Math.PI*2/activeDimensions.length)*radius*amount,center[1]-Math.cos(i*Math.PI*2/activeDimensions.length)*radius*amount];
  const polygon = values => values.map((v,i) => point(i,v/100).map(n=>n.toFixed(2)).join(',')).join(' ');
  const indices=activeDimensions.map(d=>dimensions.indexOf(d));
  const values = [activeDimensions.map(d=>d.score),indices.map(i=>[89.5,91.2,85.6,90.3,89.8][i]),indices.map(i=>[88.6,90.4,84.8,89.7,88.9][i])];
  const colors = ['#1d70f2','#b4bac0','#e545d2'];
  const labels=activeDimensions.map((d,i)=>{const [x,y]=point(i,1.22);return [x,y,x<145?'end':x>205?'start':'middle'];});
  $('#radar').innerHTML = `<svg viewBox="0 0 350 270" role="img" aria-labelledby="radar-title"><title id="radar-title">评价维度对比</title>${[.14286,.35714,.57143,.78571,1].map(r=>`<circle cx="175" cy="135" r="${radius*r}" fill="none" stroke="#e9ecf0" stroke-width="1"/>`).join('')}${activeDimensions.map((d,i)=>`<line x1="175" y1="135" x2="${point(i,1)[0]}" y2="${point(i,1)[1]}" stroke="#e9ecf0"/>`).join('')}${[1,2,0].map(i=>shownSeries[i]?`<polygon points="${polygon(values[i])}" fill="${colors[i]}" fill-opacity="${i===0?.12:.04}" stroke="${colors[i]}" stroke-width="${i===0?2:1.5}" ${i?'stroke-dasharray="3 3"':''}/>`:'').join('')}${shownSeries[0]?values[0].map((v,i)=>`<circle cx="${point(i,v/100)[0]}" cy="${point(i,v/100)[1]}" r="2.6" fill="#1d70f2" stroke="white" stroke-width="1"/>`).join(''):''}${labels.map(([x,y,anchor],i)=>`<g class="axis-label" data-dimension="${indices[i]}" data-college="${values[1][i]}" data-school="${values[2][i]}"><text x="${x}" y="${y}" text-anchor="${anchor}">${activeDimensions[i].name}</text><text class="value" x="${x}" y="${y+16}" text-anchor="${anchor}">${activeDimensions[i].score}</text></g>`).join('')}</svg>`;
}
function renderEvidence() {
  $('#evidence-tabs').innerHTML = evidence.map((e,i)=>`<button role="tab" id="evidence-tab-${i}" aria-controls="evidence-panel" aria-selected="${activeEvidence===i}" tabindex="${activeEvidence===i?0:-1}" data-evidence="${i}">${e.question}<span>${e.refs.length} 个证据</span></button>`).join('');
  const e = evidence[activeEvidence];
  $('#evidence-panel').setAttribute('aria-labelledby',`evidence-tab-${activeEvidence}`);
  $('#evidence-panel').innerHTML = `<h3>诊断：${e.title}</h3><p>${e.description}</p><div class="evidence-chart"><div class="chart-title">${e.chart}<span>本课节 · 示例统计</span></div><div class="bar-columns">${e.groups.map(group=>`<div>${group.map(([name,value])=>`<div class="bar-row"><span>${name}</span><div class="bar-track"><div class="bar-fill" style="width:${value}%"></div></div><b>${value}%</b></div>`).join('')}</div>`).join('')}</div></div><button class="evidence-detail-toggle" data-action="toggle-evidence" aria-expanded="${expandedEvidence}" aria-controls="evidence-source-list">${expandedEvidence?'收起':'查看'} ${e.refs.length} 条课堂证据 <span>${expandedEvidence?'⌃':'⌄'}</span></button><ul class="evidence-list" id="evidence-source-list" ${expandedEvidence?'':'hidden'}>${e.refs.map(([time,text])=>`<li><time>${time}</time><span>${text}</span></li>`).join('')}</ul>`;
}
function renderSuggestions() {
  $('#suggestion-grid').innerHTML = suggestions.map((s,i)=>`<article class="suggestion-card"><h3>${s.title}</h3><span class="tag">${s.tag}</span><p>${s.text}</p><ul>${s.items.map(item=>`<li>${item}</li>`).join('')}</ul><button class="add-plan" data-plan="${i}" aria-pressed="${plans.includes(i)}">${plans.includes(i)?'✓ 已加入改进计划':'＋ 加入改进计划'}</button></article>`).join('');
}
function renderTracking() {
  $('#before-copy').textContent = notes.before || '确认本次改进任务，准备案例与学习目标。';
  $('#after-copy').textContent = notes.after || '记录学生高频误区，下次课对比参与度变化。';
  $('#tracking-plan').hidden = !plans.length;
  $('#tracking-plan').innerHTML = `<div class="plan-heading">我的改进计划 <span>${completed.length} / ${plans.length} 已完成 · 保存在此浏览器</span></div>${plans.map(i=>`<div class="plan-row ${completed.includes(i)?'completed':''}"><label><input type="checkbox" data-complete="${i}" ${completed.includes(i)?'checked':''}>${suggestions[i].title}</label><button data-remove="${i}" aria-label="移除${suggestions[i].title}">移除</button></div>`).join('')}`;
}
function openDialog(title,body,eyebrow='评价详情') {
  $('#dialog-title').textContent = title;
  $('#dialog-eyebrow').textContent = eyebrow;
  $('#dialog-body').innerHTML = body;
  if (!$('#detail-dialog').open) $('#detail-dialog').showModal();
}
function configuredSections(prefix,sections) { return sections.filter(section=>document.getElementById(`${prefix}-${section.id}`)?.hidden!==true); }
function dimensionDialog(index) {
  activeDimension = index;
  const d = dimensions[index];
  if(index===3) {
    openDialog(d.name,`<div class="modal-score"><strong>${d.score}<small>分</small></strong><span class="tag">优秀</span></div><p>${d.insight}</p><div class="attitude-modal-rows">${literacyData.sections.map(s=>`<button class="attitude-modal-row" data-literacy-target="${s.id}"><span>${s.name}</span><p>${s.observation}</p><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="dialog-note">与教学素养页面同步的指标摘要。点击任一项查看对应分析与课堂证据；记录与评分均为演示数据。</div><div class="dialog-actions"><button class="secondary-button" data-action="close">返回总览</button><button class="primary-button" data-literacy-target="">查看教学素养详情</button></div>`,'诊断地图 / 指标摘要');
    return;
  }
  if(index===4) {
    openDialog(d.name,`<div class="modal-score"><strong>${d.score}<small>分</small></strong><span class="tag">优秀</span></div><p>${d.insight}</p><div class="attitude-modal-rows">${effectData.sections.map(s=>`<button class="attitude-modal-row" data-effect-target="${s.id}"><span>${s.name}</span><p>${s.observation}</p><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="dialog-note">与教学效果页面同步的指标摘要。点击任一项查看对应分析；本页为设计稿中的独立课堂示例。</div><div class="dialog-actions"><button class="secondary-button" data-action="close">返回总览</button><button class="primary-button" data-effect-target="">查看教学效果详情</button></div>`,'诊断地图 / 指标摘要');
    return;
  }
  if(index===2) {
    openDialog(d.name,`<div class="modal-score"><strong>${d.score}<small>分</small></strong><span class="tag orange">可提升</span></div><p>${d.insight}</p><div class="attitude-modal-rows">${methodData.sections.map(s=>`<button class="attitude-modal-row" data-method-target="${s.id}"><span>${s.name}</span><p>${s.observation}</p><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="dialog-note">与教学方法页面同步的指标摘要。点击任一项查看对应分析；当前为设计稿示例数据。</div><div class="dialog-actions"><button class="secondary-button" data-action="close">返回总览</button><button class="primary-button" data-method-target="">查看教学方法详情</button></div>`,'诊断地图 / 指标摘要');
    return;
  }
  if(index===1) {
    openDialog(d.name,`<div class="modal-score"><strong>${d.score}<small>分</small></strong><span class="tag">优秀</span></div><p>${d.insight}</p><div class="attitude-modal-rows">${contentData.sections.map(s=>`<button class="attitude-modal-row" data-content-target="${s.id}"><span>${s.name}</span><p>${s.observation}</p><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="dialog-note">与教学内容页面同步的指标摘要。点击任一项查看对应分析；本页展示设计稿中的人工智能课程示例。</div><div class="dialog-actions"><button class="secondary-button" data-action="close">返回总览</button><button class="primary-button" data-content-target="">查看教学内容详情</button></div>`,'诊断地图 / 指标摘要');
    return;
  }
  if(index===0) {
    openDialog(d.name,`<div class="modal-score"><strong>${d.score}<small>分</small></strong><span class="tag">优秀</span></div><p>${d.insight}</p><div class="attitude-modal-rows">${attitudeData.sections.map(s=>`<button class="attitude-modal-row" data-attitude-target="${s.id}"><span>${s.name}</span><p>${s.observation}</p><span aria-hidden="true">↗</span></button>`).join('')}</div><div class="dialog-note">与教学态度页面同步的指标摘要。点击任一项可查看对应分析；疑似代课等线索仅为演示数据，待结合课堂情境核查。</div><div class="dialog-actions"><button class="secondary-button" data-action="close">返回总览</button><button class="primary-button" data-attitude-target="">查看教学态度详情</button></div>`,'诊断地图 / 指标摘要');
    return;
  }
  openDialog(d.name,`<div class="modal-score"><strong>${d.score}<small>分</small></strong><span class="tag ${index===2?'orange':''}">${index===2?'可提升':'优秀'}</span></div><p>${d.insight}</p><table class="detail-table"><thead><tr><th>观察指标</th><th>本课节表现</th><th>评价</th></tr></thead><tbody>${d.metrics.map(row=>`<tr>${row.map(cell=>`<td>${cell}</td>`).join('')}</tr>`).join('')}</tbody></table><div class="dialog-note">当前展示总览中的指标摘要。独立指标分析页面将在后续补充；数据为演示样例。</div><div class="dialog-actions"><button class="secondary-button" data-action="close">返回总览</button><button class="primary-button" data-action="dimension-evidence">查看关联证据</button></div>`,'诊断地图 / 指标摘要');
}
function focusSection(id) { $(id).scrollIntoView({behavior:'smooth',block:'start'}); }
function scoringDialog() {
  openDialog('综合得分说明',`<p>综合得分由五个评价维度加权计算，满分 100 分。雷达图中的“本课节”与诊断地图使用同一组数据。</p><table class="detail-table"><thead><tr><th>评价维度</th><th>本课节得分</th><th>权重</th></tr></thead><tbody>${dimensions.map(d=>`<tr><td>${d.name}</td><td>${d.score}</td><td>${d.weight}%</td></tr>`).join('')}</tbody></table><h3>综合得分：92.11 → 92.1 分</h3><p>90 分及以上为优秀，80–89.9 分为可提升，80 分以下为需关注。</p><div class="dialog-note">本课程：同一课程课节的示例均值；全校课程：校级课程的示例均值。点击图例可显示或隐藏对比数据。本 DEMO 的分数、时间戳和结论均为演示数据。</div>`,'报告说明');
}
function recordDialog() {
  openDialog('编辑跟进记录',`<form id="record-form"><label class="field">课前准备<textarea name="before" maxlength="300" placeholder="例如：准备 1 个开放性问题，设置小组讨论产出物…">${escapeHTML(notes.before)}</textarea><small>最多 300 字，留空将恢复默认提示</small></label><label class="field">课后复盘<textarea name="after" maxlength="300" placeholder="例如：记录学生高频误区，下次课对比参与度…">${escapeHTML(notes.after)}</textarea><small>记录仅保存在当前浏览器中</small></label><div class="dialog-actions"><button type="button" class="secondary-button" data-action="close">取消</button><button type="submit" class="primary-button">保存记录</button></div></form>`,'追踪闭环');
  $('#record-form').addEventListener('submit',event=>{ event.preventDefault(); const data = new FormData(event.target); notes={before:String(data.get('before')).trim(),after:String(data.get('after')).trim()}; const stored = persist(); renderTracking(); $('#detail-dialog').close(); if(stored) toast('跟进记录已保存'); });
}
function exportReport() {
  const report = {title:'课堂评价报告',course:'高等数理统计',teacher:'孙志慧',date:'2026-07-02',demo:true,score:92.1,dimensions,attitude:attitudeData,content:contentData,method:methodData,literacy:literacyData,effect:effectData,evidence,suggestions,plans:plans.map(i=>({title:suggestions[i].title,completed:completed.includes(i)})),notes};
  const blob = new Blob([JSON.stringify(report,null,2)],{type:'application/json;charset=utf-8'});
  const url = URL.createObjectURL(blob), link = document.createElement('a');
  link.href = url; link.download = '课堂评价报告-高等数理统计-DEMO.json'; document.body.append(link); link.click(); link.remove(); setTimeout(()=>URL.revokeObjectURL(url),1000); toast('报告数据已导出');
}
document.addEventListener('click',event=>{
  const routeLink=event.target.closest('a[href^="#"]');
  if(routeLink && /^#(recording|overview|attitude(?:-(?:basics|body|posture|patrol|management|investment|emotion|language))?|content(?:-(?:goals|challenges|depth|features|practice|accuracy|two-properties))?|method(?:-(?:behavior|language|style|questions|board|interaction|homework|multimedia))?|literacy(?:-(?:analysis|ideology|critical|communication|collaboration|values))?|effect(?:-(?:participation|monitoring|state|pyramid|anomalies|actions|expressions))?)$/.test(routeLink.getAttribute('href'))) {
    event.preventDefault();navigate(routeLink.getAttribute('href'));return;
  }
  const target = event.target.closest('button, [data-dimension]');
  if (!target) return;
  if (target.dataset.literacyTarget !== undefined) {
    $('#detail-dialog').close();navigate(`#literacy${target.dataset.literacyTarget?'-'+target.dataset.literacyTarget:''}`);return;
  }
  if (target.dataset.effectTarget !== undefined) {
    $('#detail-dialog').close();navigate(`#effect${target.dataset.effectTarget?'-'+target.dataset.effectTarget:''}`);return;
  }
  if (target.dataset.methodTarget !== undefined) {
    $('#detail-dialog').close();navigate(`#method${target.dataset.methodTarget?'-'+target.dataset.methodTarget:''}`);return;
  }
  if (target.dataset.contentTarget !== undefined) {
    $('#detail-dialog').close();navigate(`#content${target.dataset.contentTarget?'-'+target.dataset.contentTarget:''}`);return;
  }
  if (target.dataset.attitudeTarget !== undefined) {
    $('#detail-dialog').close();navigate(`#attitude${target.dataset.attitudeTarget?'-'+target.dataset.attitudeTarget:''}`);return;
  }
  if (target.dataset.dimension !== undefined) return dimensionDialog(Number(target.dataset.dimension));
  if (target.dataset.evidence !== undefined) { activeEvidence=Number(target.dataset.evidence); expandedEvidence=false; renderEvidence(); $(`#evidence-tab-${activeEvidence}`).focus({preventScroll:true}); return; }
  if (target.dataset.series !== undefined) { const i=Number(target.dataset.series); if(shownSeries[i] && shownSeries.filter(Boolean).length===1) return toast('至少保留一组对比数据'); shownSeries[i]=!shownSeries[i]; target.classList.toggle('selected',shownSeries[i]); target.setAttribute('aria-pressed',String(shownSeries[i])); renderRadar(); return; }
  if (target.dataset.plan !== undefined) { const i=Number(target.dataset.plan); if(plans.includes(i)) return focusSection('#tracking'); plans.push(i); const stored = persist(); renderSuggestions(); renderTracking(); if(stored) toast('已加入改进计划，可在追踪闭环中查看'); return; }
  if (target.dataset.remove !== undefined) { const i=Number(target.dataset.remove); plans=plans.filter(n=>n!==i); completed=completed.filter(n=>n!==i); persist(); renderSuggestions(); renderTracking(); return; }
  switch(target.dataset.action) {
    case 'close': $('#detail-dialog').close(); break;
    case 'scoring': scoringDialog(); break;
    case 'course': navigate('#recording'); break;
    case 'record': recordDialog(); break;
    case 'focus-evidence': activeEvidence=0;expandedEvidence=true;renderEvidence();focusSection('#evidence');break;
    case 'focus-tracking':focusSection('#tracking');break;
    case 'toggle-evidence': expandedEvidence=!expandedEvidence;renderEvidence();$('.evidence-detail-toggle').focus({preventScroll:true});break;
    case 'dimension-evidence': $('#detail-dialog').close();navigate('#overview');activeEvidence=activeDimension===1?1:activeDimension===4?2:activeDimension===0?3:0;expandedEvidence=true;renderEvidence();focusSection('#evidence');break;
    case 'export': openDialog('导出课堂评价报告',`<p>可将当前报告导出为数据文件，或使用浏览器打印功能保存为 PDF。导出内容包含示例评价数据与已填写的跟进记录。</p><div class="dialog-actions"><button class="secondary-button" data-action="export-json">下载报告数据</button><button class="primary-button" data-action="print">打印 / 保存 PDF</button></div>`,'报告导出');break;
    case 'export-json':exportReport();$('#detail-dialog').close();break;
    case 'print':$('#detail-dialog').close();window.print();break;
  }
});
document.addEventListener('change',event=>{if(event.target.dataset.complete!==undefined){const i=Number(event.target.dataset.complete);completed=event.target.checked?[...new Set([...completed,i])]:completed.filter(n=>n!==i);persist();renderTracking();}});
$('#evidence-tabs').addEventListener('keydown',event=>{ if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key)) return; event.preventDefault(); activeEvidence=event.key==='Home'?0:event.key==='End'?3:(activeEvidence+(event.key==='ArrowDown'?1:3))%4;expandedEvidence=false;renderEvidence();$(`#evidence-tab-${activeEvidence}`).focus();});
$('#detail-dialog').addEventListener('click',event=>{if(event.target===$('#detail-dialog')){const r=event.target.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)event.target.close();}});
function navigate(hash) {
  if(location.hash!==hash) history.pushState(null,'',hash);
  renderRoute(true);
}
function renderRoute(scroll=false) {
  const isAttitude=/^#attitude(?:-(basics|body|posture|patrol|management|investment|expressions|emotion|language|anomaly|attendance|attire|sensitive))?$/.test(location.hash);
  const isContent=/^#content(?:-(goals|challenges|depth|features|practice|accuracy|two-properties))?$/.test(location.hash);
  const isMethod=/^#method(?:-(behavior|language|style|questions|board|interaction|homework|multimedia))?$/.test(location.hash);
  const isLiteracy=/^#literacy(?:-(analysis|ideology|critical|communication|collaboration|values))?$/.test(location.hash);
  const isEffect=/^#effect(?:-(participation|monitoring|state|pyramid|anomalies|actions|expressions))?$/.test(location.hash);
  const page=location.hash==='#recording'||location.hash==='#overview'||!location.hash?'recording':isAttitude?'attitude':isContent?'content':isMethod?'method':isEffect?'effect':isLiteracy?'literacy':'recording';
  if($('#detail-dialog').open) $('#detail-dialog').close();
  ['recording','overview','attitude','content','method','literacy','effect'].forEach(id=>{$('#'+id).hidden=id!==page;});
  document.dispatchEvent(new Event('attitude:route'));
  document.querySelectorAll('.topbar a').forEach(link=>{
    const active=link.getAttribute('href')==='#'+page;
    link.classList.toggle('active',active);
    if(active) link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
  });
  document.title=`${{recording:'报告总览',overview:'报告总览',attitude:'教学态度',content:'教学内容',method:'教学方法',literacy:'教学素养',effect:'教学效果'}[page]} · 课堂评价报告`;
  if(scroll) {
    const attitudeTarget=$('#attitude').dataset.attitudeIteration==='1.0'?({'#attitude-posture':'attitude-body','#attitude-emotion':'attitude-investment'}[location.hash]):location.hash==='#attitude-investment'&&!document.getElementById('attitude-investment')?'attitude-emotion':null;
    const target=page!=='overview' && location.hash!=='#'+page?document.getElementById(attitudeTarget||location.hash.slice(1)):null;
    if(target) target.scrollIntoView({block:'start',behavior:'instant'});else window.scrollTo({top:0,behavior:'instant'});
    const heading=(target || $('#'+page)).querySelector('h1,h2,h3');
    heading.setAttribute('tabindex','-1');heading.focus({preventScroll:true});
  }
}
window.addEventListener('hashchange',()=>renderRoute(true));
window.addEventListener('popstate',()=>renderRoute(true));
renderDimensions();renderRadar();renderEvidence();renderSuggestions();renderTracking();mountOverviewOutline({openDialog});initAttitude({openDialog});initContent({openDialog});initMethod({openDialog});initEffect({openDialog});initLiteracy({openDialog});initRecording({openDialog,toast});mountOverviewIteration({openDialog});mountAgentIteration();mountScaleEvaluationV8({toast});mountOverviewRecordingMerge();mountIndicatorStructure({openDialog});mountReportScaleConfig({dimensions:dimensions.map(d=>d.name),toast,onChange:()=>{renderDimensions();renderRadar();document.dispatchEvent(new Event('report:scale-changed'));}});renderRoute(/^#(?:literacy-|attitude-investment$|content-depth$|content-two-properties$|method-style$|method-language$)/.test(location.hash));

mountOverviewLayout();mountReportEdit();

mountRubricScoring({onScoresChange:report=>{report.dimensions.forEach(d=>{dimensions[d.index].score=d.score;dimensions[d.index].weight=20;});renderDimensions();renderRadar();}});

mountModularOverview();
