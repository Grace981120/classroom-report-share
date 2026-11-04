import {dimensionSummaryVersions} from './dimension-summary-version.js';
import {contentData} from './content-data.js';
import {goalsData} from './content-goals-data.js';
import {questionData,summarize} from './method-questions-data.js';
import {literacyData} from './literacy-data.js';
import {effectData} from './effect-data.js';

const safe = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const card = (label,value,unit='',detail='',tone='') => ({label,value,unit,detail,tone});
const questionStats = summarize(questionData);
const outlineRequirements = goalsData.items.filter(item => item.requirement);
const outlineMatch = Math.round(outlineRequirements.reduce((total,item) => total + (item.match ?? 0),0) / outlineRequirements.length);
const caseRecords = contentData.practice.flatMap(group => group.examples);
const targets = {
  content:['#content-goals','#content-challenges','#content-practice'],
  method:['#method-multimedia','#method-questions','#method-questions','#method-questions','#method-questions'],
  literacy:literacyData.sections.map(section => `#literacy-${section.id}`),
  effect:['#effect-monitoring','#effect-monitoring','#effect-monitoring','#effect-participation',...effectData.anomalies.map(() => '#effect-anomalies')]
};

function definition(kind) {
  if (kind === 'content') return {
    title:'教学内容',score:contentData.score,rating:'优秀',
    summary:`教学重难点呈现 ${contentData.challenges.length} 项、案例记录 ${caseRecords.length} 条；本课三项大纲要求的匹配汇总为 ${outlineMatch}%。建议补足模型评价练习，并用具体任务核验目标达成。`,
    cards:[
      card('大纲匹配度',outlineMatch,'%',`按本课三项大纲要求等权汇总：${outlineRequirements.map(item => item.match ?? 0).join('%、')}% 的平均值为 ${outlineMatch}%。拓展目标不抵消遗漏；这不是学生学习达成率。`,'watch'),
      card('教学重难点',contentData.challenges.length,'个',`本课示例列出 ${contentData.challenges.length} 项教学重难点。次数不代表难点已被学生掌握。`),
      card('案例',caseRecords.length,'个',`现有“理论联系实际”模块共展示 ${caseRecords.length} 条案例记录，其中两条示例被重复引用；此处统计展示条目，不代表 ${caseRecords.length} 个互不相同的案例。`)
    ]
  };
  if (kind === 'method') return {
    title:'教学方法',score:82.1,rating:'可提升',
    summary:`PPT 依赖度示例为 68%，仍需逐段对齐原始依据；课堂记录包含 ${questionStats.questions} 次教师提问、${questionStats.answers} 次学生应答、${questionStats.followups} 次教师追问及 1 次学生主动提问。建议结合原话复盘追问质量与课件使用。`,
    cards:[
      card('PPT依赖度',68,'%', '示例按可对齐讲解范围内的依赖时长计算为 34 ÷ 50 = 68%。原始姿态帧、ASR 与课件页的逐段对齐记录仍不可用，不能将重合度直接视为依赖度。','watch'),
      card('教师提问',questionStats.questions,'次','仅统计教师发起的主问题；学生主动提问单列，不并入此数。'),
      card('学生应答',questionStats.answers,'次','统计示例问答记录中学生作出的应答回合；不等同于参与学生人数。'),
      card('教师追问',questionStats.followups,'次','统计承接学生回答的教师追问回合；追问策略标签可能重叠，不将策略次数相加。'),
      card('学生主动提问',1,'次','教学提问 1.0.8 的同一示例问答记录中有 1 次学生发起的问题，单列于教师提问之外。')
    ]
  };
  if (kind === 'literacy') return {
    title:'课堂素养',score:literacyData.score,rating:'优秀',
    summary:'审辩思维、沟通能力、合作能力和课程思政各展示 1 次示例；现有课堂记录有跨类别重复引用。建议补充学生观点、交流过程与小组产出，进一步核验实际表现。',
    cards:literacyData.sections.map(section => card(section.name,1,'次',`“${section.name}”按本页 Demo 设为展示 1 次。当前两条 00:01 示例记录被多类素养重复引用，此数不代表已核验的独立课堂发生次数。`))
  };
  const gauges = Object.fromEntries(effectData.gauges.map(item => [item.name,item]));
  return {
    title:'教学效果',score:effectData.score,rating:'优秀',
    summary:'出勤率 66%、前排就坐率 20%、平均抬头率 82%，整体参与度示例为 90%；看手机与随意走动等次数是待核查线索，应结合当时教学任务理解。',
    cards:[
      ...[['出勤率','学生出勤率'],['前排就坐率','前排就坐率'],['平均抬头率','平均抬头率'],['整体参与度','学习参与度']].map(([source,label]) => card(label,gauges[source].value,'%',gauges[source].detail,source === '出勤率' ? 'watch' : '')),
      ...effectData.anomalies.map(item => card(item.name,item.value,'次',item.detail,'watch'))
    ]
  };
}

export function mountDimensionSummary(root,kind,{openDialog}) {
  if (dimensionSummaryVersions[kind] === 'baseline' || root.dataset.dimensionSummary) return;
  const old = root.querySelector(':scope > .attitude-summary');
  if (!old) return;
  if (!document.querySelector('link[data-dimension-summary-style]')) {
    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.dataset.dimensionSummaryStyle = '';
    style.href = new URL('./dimension-summary.css?v=20261019-title2',import.meta.url).href;
    document.head.append(style);
  }
  const model = definition(kind);
  const section = document.createElement('section');
  section.className = 'card section dimension-summary-card';
  section.id = `${kind}-summary`;
  section.setAttribute('aria-labelledby',`${kind}-summary-title`);
  section.dataset.kind = kind;
  section.innerHTML = `<div class="section-heading"><h2 id="${kind}-summary-title">${safe(model.title)}</h2><span class="dimension-summary-score"><strong>${model.score.toFixed(1)}</strong><small>分</small></span><span class="tag ${model.rating === '可提升' ? 'orange' : ''}">${model.rating}</span></div><div class="attitude-insight"><img src="assets/figma/attitude-img111111.svg" width="16" height="16" alt=""><p>${safe(model.summary)}</p></div><div class="dimension-summary-grid">${model.cards.map((item,index) => `<button type="button" class="basic-stat dimension-summary-stat ${item.tone ? `is-${item.tone}` : ''}" data-summary-index="${index}" aria-label="${safe(item.label)}：${safe(item.value)}${safe(item.unit)}，定位对应模块"><strong class="${typeof item.value === 'number' ? 'basic-count' : ''}">${safe(item.value)}${item.unit ? `<small>${safe(item.unit)}</small>` : ''}</strong><span>${safe(item.label)}</span></button>`).join('')}</div>`;
  old.hidden = true;
  root.prepend(section);
  root.dataset.dimensionSummary = dimensionSummaryVersions[kind];
  section.addEventListener('click',event => {
    const button = event.target.closest('[data-summary-index]');
    if (!button) return;
    if (kind === 'effect' && button.dataset.summaryIndex === '3') {
      root.querySelector('#effect-state [data-tab="participation"]')?.click();
    }
    const target = root.querySelector(targets[kind][Number(button.dataset.summaryIndex)]) || (kind === 'method' ? root.querySelector('#method-board') : null);
    if (!target) return;
    target.style.scrollMarginTop = '90px';
    target.scrollIntoView({behavior:'smooth',block:'start'});
    const heading = target.querySelector('h2,h3') || target;
    heading.setAttribute('tabindex','-1');
    heading.focus({preventScroll:true});
  });
}
