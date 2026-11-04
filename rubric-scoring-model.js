import {contentKnowledgeVersion} from './content-knowledge-version.js';
import {teacherInvestmentSummary,teacherInvestmentBands} from './teacher-investment-data.js';
import {indicatorStructureVersion} from './indicator-structure-version.js';
import {rubricStandards} from './rubric-scoring-standards.js';
import {attitudeData} from './attitude-data.js';
import {methodData,rowDuration} from './method-data.js';
import {effectData} from './effect-data.js';
import {questionData} from './method-questions-data.js';

export const rubricDimensions=[['attitude','教学态度'],['content','教学内容'],['method','教学方法'],['literacy','教学素养'],['effect','教学效果']];
const rules=new Map(rubricStandards.observations.map(o=>[o.row,o]));
const round=n=>Math.round((n+Number.EPSILON)*10)/10;
const clock=t=>{const [h,m]=t.split(':').map(Number);return h*60+m};

// Parse comparison chains without executing spreadsheet text as JavaScript.
export function matchRubricBand(bands,value){
 for(const band of bands){
  const condition=band.condition.replaceAll('＞','>').replaceAll('＜','<').replaceAll('≤','<=').replaceAll('≥','>=');
  if(typeof value==='string'){if(condition.split('/').includes(value)||condition===value)return band;continue}
  if((condition==='较快或较慢'&&(value<120||value>150))||(condition==='较大或较小'&&(value<60||value>80)))return band;
  const comparisons=[...condition.replaceAll('%','').matchAll(/(?<![\d.])(?=((?:-?\d+(?:\.\d+)?|x)\s*(?:<=|>=|<|>|=)\s*(?:-?\d+(?:\.\d+)?|x)))/g)].map(m=>m[1].match(/^(-?\d+(?:\.\d+)?|x)\s*(<=|>=|<|>|=)\s*(-?\d+(?:\.\d+)?|x)$/));
  if(!Number.isFinite(value)||!comparisons.length)continue;
  if(comparisons.every(([,a,op,b])=>{a=a==='x'?value:Number(a);b=b==='x'?value:Number(b);return op==='<='?a<=b:op==='>='?a>=b:op==='<'?a<b:op==='>'?a>b:a===b}))return band;
 }
 return null;
}
function standard(row,value,actual,extra={}){
 const source=rules.get(row),band=matchRubricBand(source.bands,value);
 return {id:'row-'+row,name:source.observation,actual,value,bands:source.bands,matched:band?.condition||'',score:band?.score??null,max:band?10:0,counted:source.defaultScored&&!!band,source:'standard',sourceUrl:source.sourceUrl,...extra};
}
// These supplemental rules and values are authorized Demo examples, not copied source standards.
function simulated(id,name,actual,score,matched){return {id,name,actual,score,max:10,counted:true,source:'simulated',matched,bands:[{grade:'A',condition:'充分体现，且有完整的实施表现',score:10},{grade:'B',condition:'基本体现，部分环节仍可完善',score:8},{grade:'C',condition:'有所体现，但关键环节不足',score:5},{grade:'D',condition:'未体现',score:0}]}}
const moduleOf=(id,title,observations)=>({id,title,observations});
const countRemoved=(edits,id,total)=>Math.max(0,total-new Set(edits[id]?.removed||[]).size);

export function buildRubricReport({edits={},config=null}={}){
 const attendance={arrival:'13:27',departure:'16:32',...edits['attitude-attendance']};
 const late=Math.max(0,clock(attendance.arrival)-810),early=Math.max(0,995-clock(attendance.departure));
 const sensitive=countRemoved(edits,'attitude-sensitive',2),anomalies=countRemoved(edits,'attitude-anomaly',2);
 const management=attitudeData.management.filter((r,i)=>i!==8).map(r=>({...r,kind:r.type===0?'attendance':'reminder'}));
 management.push({time:1104,kind:'discipline'},{time:5610,kind:'discipline'});management.sort((a,b)=>a.time-b.time);
 const remaining=management.filter((r,i)=>!edits['attitude-management']?.removed?.includes('management-'+i));
 const attendanceReminders=remaining.filter(r=>r.kind==='attendance').length,reminders=remaining.filter(r=>r.kind==='reminder').length;
 const questions=questionData.questions,turns=questions.flatMap(q=>q.turns),feedback=turns.filter(t=>t.kind==='feedback');
 const feedbackMinutes=feedback.reduce((n,t)=>n+t.end-t.start,0)/60;
 const answerTurns=turns.filter(t=>t.kind==='answer');
 const waitTimes=questions.flatMap(q=>{const a=q.turns.find(t=>t.kind==='answer');return a?[a.start-q.turns[0].end]:[]});
 const duration=answerTurns.reduce((n,t)=>n+t.end-t.start,0)/Math.max(1,answerTurns.length);
 const bodyPercent=24; // Constructed scoring example; the source curve does not measure an aggregate percentage.
 const sitting=attitudeData.posture[2].seconds/attitudeData.duration*100;
 const patrolMinutes=attitudeData.duration*.328/60;
 const all=[
  moduleOf('attitude-attendance','教师考勤',[
   standard(4,late,late?`迟到 ${late} 分钟（${attendance.arrival} 到课）`:`未迟到，0 分钟（${attendance.arrival} 到课）`,{name:'教师迟到'}),
   standard(5,early,early?`早退 ${early} 分钟（${attendance.departure} 离开）`:`未早退，0 分钟（${attendance.departure} 离开）`,{name:'教师早退'})]),
  moduleOf('attitude-body','肢体语言',[standard(7,bodyPercent,`活跃动作时长占比 ${bodyPercent}%`,{name:'肢体语言丰富度'})]),
  moduleOf('attitude-posture','教学姿态',[standard(8,sitting,`就坐时长占比 ${round(sitting)}%`,{name:'就坐时长占比'})]),
  moduleOf('attitude-patrol','巡堂轨迹',[standard(9,patrolMinutes,`学生区域巡堂约 ${round(patrolMinutes)} 分钟`,{name:'学生区域巡堂时长'})]),
  moduleOf('attitude-attire','教师着装',[standard(10,'及膝以上裤子/裙子','裤子/裙子长度：及膝以上',{name:'着装是否得体'})]),
  moduleOf('attitude-sensitive','敏感词',[standard(11,sensitive,`保留 ${sensitive} 条用语线索`,{name:'敏感词次数'})]),
  moduleOf('attitude-anomaly','教师异常行为',[standard(12,anomalies,`看手机、接打电话及吸烟合计 ${anomalies} 次`,{name:'教师异常行为总次数'})]),
  moduleOf('attitude-management','课堂管理',[standard(13,attendanceReminders,`考勤提示 ${attendanceReminders} 次`,{name:'关注教学纪律：考勤'}),standard(14,reminders,`看黑板/屏幕、教材、做笔记提醒合计 ${reminders} 次`,{name:'关注学生学习状态'})]),
  moduleOf('attitude-investment','教师教学投入',[
   simulated('preparation','备课充分度','教学材料与课堂安排相互对应',10,'充分体现，且有完整的实施表现'),
   simulated('expression','教师表情','表情以平静为主，伴随微笑',8,'基本体现，部分环节仍可完善'),
   simulated('pitch','音调','重点讲解处音调有变化',8,'基本体现，部分环节仍可完善')]),
  moduleOf('content-goals','教学目标',[standard(15,1,'已识别目标讲述，时长大于 0 分钟',{name:'教学目标讲述时长'})]),
  moduleOf('content-challenges','教学重难点',[standard(16,1,'已识别重难点讲述，时长大于 0 分钟',{name:'教学重难点讲述时长'})]),
  moduleOf('content-practice','理论联系实际',[standard(17,4,'联系医疗案例和技术应用共 4 次',{name:'理论联系实际次数'})]),
  moduleOf('content-features','学科特点',[
   standard(18,1,'已介绍学科核心理论与方法，时长大于 0 分钟',{name:'学科思维'}),
   standard(19,1,'已讲述人工智能发展历程，时长大于 0 分钟',{name:'学科历史'}),
   standard(20,1,'已联系医学与信息技术，时长大于 0 分钟',{name:'跨学科联系'}),
   standard(21,1,'已介绍大模型与具身智能，时长大于 0 分钟',{name:'学科前沿'})]),
  moduleOf('content-depth','教学内容深度与广度',[
   simulated('depth','讲解深度',contentKnowledgeVersion==='2.0'?'技术路线由概念推进到方法比较与条件分析，应用推演仍可补充':contentKnowledgeVersion==='baseline'?'从概念解释推进到方法比较与条件分析':'知识点间可见比较、条件和应用关联，规则完备性表述待核对',8,'基本体现，部分环节仍可完善'),
   simulated('breadth','内容广度',contentKnowledgeVersion==='2.0'?'围绕四个主题整理10个知识点；正式大纲覆盖仍待核验':contentKnowledgeVersion==='baseline'?'覆盖发展历程、核心方法和未来方向':'已见三条课堂主线；正式课程大纲匹配待核验',10,'充分体现，且有完整的实施表现')]),
  moduleOf('content-accuracy','知识准确性',[simulated('accuracy','知识表述准确性','1 处表述疑点需结合材料复核',8,'基本体现，部分环节仍可完善')]),
  moduleOf('method-questions','教学提问',[
   standard(22,new Set(questions.map(q=>q.mat)).size,`覆盖 ${new Set(questions.map(q=>q.mat)).size} 类 4MAT 提问`,{name:'4MAT 提问类型数'}),
   standard(23,new Set(questions.map(q=>q.bloom)).size,`覆盖 ${new Set(questions.map(q=>q.bloom)).size} 类布鲁姆提问`,{name:'布鲁姆提问类型数'}),
   standard(24,null,`平均 ${round(waitTimes.reduce((a,b)=>a+b,0)/Math.max(1,waitTimes.length))} 秒`,{name:'平均教师候答时间'}),
   standard(25,null,`平均 ${round(duration)} 秒`,{name:'平均学生应答时间'}),
   standard(26,null,`包含 ${new Set(feedback.map(t=>t.feedback)).size} 类教师评价`,{name:'教师评价类型'}),
   standard(27,feedbackMinutes,`教师反馈与评价共 ${round(feedbackMinutes)} 分钟`,{name:'及时反馈与评价时长'})]),
  moduleOf('method-language','语言表达',[
   standard(28,300,'约 280–320 字/分钟，整体偏快',{name:'授课语速'}),
   standard(29,70,'授课音量适中',{name:'授课音量'}),
   standard(30,24,'语气词累计 24 次',{name:'语气词次数'}),
   standard(31,null,'已提取 6 个高频词',{name:'高频词'})]),
  moduleOf('method-board','课堂板书',[standard(32,rowDuration(methodData.board[0])/60,`板书时长 ${round(rowDuration(methodData.board[0])/60)} 分钟`,{name:'板书时长'})]),
  moduleOf('method-interaction','师生互动',[standard(33,'混合型','Rt-Ch 课堂类型为混合型',{name:'课堂互动类型'})]),
  moduleOf('method-homework','引导课后学习',[
   standard(34,1,'已提出课后比较任务，讲述时长大于 0 分钟',{name:'引导课后思考'}),
   standard(35,0,'未识别到课外资源推荐，0 分钟',{name:'推荐课外资源'})]),
  moduleOf('method-multimedia','多媒体运用',[simulated('multimedia','信息化工具与教学环节的适配','结合课件和电脑演示辅助讲解',8,'基本体现，部分环节仍可完善')]),
  moduleOf('method-style','教学方法',[
   simulated('heuristic','启发式讲解','采用设疑、递进分析和方法比较',8,'基本体现，部分环节仍可完善'),
   simulated('vocational','教学方法与职教特点适配性','以医疗需求方案和同伴互评承接应用',8,'基本体现，部分环节仍可完善')]),
  moduleOf('literacy-analysis','教学素养',[
   standard(36,1.5,'开放性问题与观点分析共 1.5 分钟',{name:'审辩思维'}),
   standard(37,2.5,'学生口头、书面表达机会共 2.5 分钟',{name:'表达能力'}),
   standard(38,3,'小组任务与合作交流共 3 分钟',{name:'合作能力'}),
   standard(39,4,'文化素养与社会责任相关讲述共 4 分钟',{name:'课程思政：文化素养培养'})]),
  moduleOf('literacy-ideology','课程思政',[
   simulated('elements','思政元素讲授的丰富性','结合医疗场景展开价值引导',10,'充分体现，且有完整的实施表现'),
   simulated('coverage','思政元素维度的覆盖性','涉及文化素养、职业素养与社会责任',8,'基本体现，部分环节仍可完善'),
   simulated('integration','思政元素与专业知识的融合性','从医疗技术应用自然延伸科技责任',10,'充分体现，且有完整的实施表现'),
   simulated('discipline','思政元素与学科素养的适配性','关联医学信息技术的审慎应用',8,'基本体现，部分环节仍可完善'),
   simulated('appropriateness','思政元素融合的适切性','价值引导与知识讲解衔接较自然',8,'基本体现，部分环节仍可完善'),
   simulated('context','课程思政教学的情景性','从医疗案例切入技术伦理问题',10,'充分体现，且有完整的实施表现'),
   simulated('diversity','课程思政教学方法的多样性','结合案例分析与讨论',8,'基本体现，部分环节仍可完善'),
   simulated('technology','课程思政教学技术的创新性','借助课件与信息化案例开展教学',8,'基本体现，部分环节仍可完善')]),
  moduleOf('effect-participation','学习参与度',[standard(40,effectData.gauges[0].value,`整体参与度 ${effectData.gauges[0].value}%`,{name:'整体参与度'})]),
  moduleOf('effect-monitoring','学情监测',effectData.gauges.slice(1).map((g,i)=>standard(41+i,g.value,`${g.name} ${g.value}%`,{name:g.name}))),
  moduleOf('effect-pyramid','学习金字塔',[standard(46,effectData.learning.filter(r=>r.value>0).length,`出现 ${effectData.learning.filter(r=>r.value>0).length} 类学习行为`,{name:'学习类型数量'})]),
  moduleOf('effect-anomalies','学生异常行为',[standard(47,effectData.anomalies.reduce((n,r)=>n+r.value,0),`六类行为合计 ${effectData.anomalies.reduce((n,r)=>n+r.value,0)} 次`,{name:'学生异常行为总次数'})]),
  moduleOf('effect-actions','学生行为',[standard(48,null,'举手 10 次、站立 5 次、回头 24 次、书写 14 次',{name:'学生行为分析'})]),
  moduleOf('effect-expressions','学生表情',[standard(49,null,'积极 31%、平淡 31%、消极 38%',{name:'学生表情分布'})])
 ];
 if(indicatorStructureVersion!=='baseline'){
  const investment=all.find(m=>m.id==='attitude-investment'),expression=investment.observations.find(o=>o.id==='expression'),pitch=investment.observations.find(o=>o.id==='pitch');
  const band=matchRubricBand(teacherInvestmentBands,teacherInvestmentSummary.value);
  investment.observations=[{id:'teaching-investment',name:'教学投入度',actual:`整体教学投入度 ${teacherInvestmentSummary.value}%`,value:teacherInvestmentSummary.value,bands:teacherInvestmentBands,matched:band.condition,score:band.score,max:10,counted:true,source:'simulated'}];
  expression.actual='积极30%、平淡60%、消极10%';
  all.splice(all.indexOf(investment)+1,0,moduleOf('attitude-expressions','教师表情',[expression]));
  all.find(m=>m.id==='method-language').observations.push(pitch);
 }
 const dimensions=rubricDimensions.map(([id,name],index)=>{
  const enabled=!config||config.dimensions.includes(name);
  let modules=all.filter(m=>m.id.startsWith(id+'-'));
  // Mirror module order while retaining disabled modules in the full-scale view.
  const order=config?.order?.[name]||config?.modules?.[name]||[];
  const selected=config?.modules?.[name]||[];
  if(order.length)modules.sort((a,b)=>{const ai=order.indexOf(a.id),bi=order.indexOf(b.id);return (ai<0?999:ai)-(bi<0?999:bi)});
  modules.forEach(m=>{
   m.enabled=enabled&&(!config||selected.includes(m.id));
   m.observations.forEach(o=>{o.included=m.enabled&&o.counted});
   const scored=m.observations.filter(o=>o.score!==null);m.earned=scored.reduce((n,o)=>n+o.score,0);m.possible=scored.reduce((n,o)=>n+o.max,0);
  });
  const counted=modules.flatMap(m=>m.observations).filter(o=>o.included);
  const earned=counted.reduce((n,o)=>n+o.score,0),possible=counted.reduce((n,o)=>n+o.max,0);
  return {id,name,index,enabled,modules,earned,possible,rawScore:possible?earned/possible*100:0,score:possible?round(earned/possible*100):0,count:counted.length};
 });
 if(config?.dimensions)dimensions.sort((a,b)=>{const rank=d=>{const i=config.dimensions.indexOf(d.name);return i<0?100+d.index:i};return rank(a)-rank(b)});
 // Use unrounded dimension scores; each dimension contributes exactly 20%.
 return {dimensions,total:round(dimensions.reduce((n,d)=>n+d.rawScore*.2,0))};
}
