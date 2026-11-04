// Shared demo data. Timeline positions follow the Figma blocks on a 150-minute axis.
export const methodColors=['#1D70F2','#00CC7E','#E545D2','#FF7626','#FFB743','#19ABEA'];
const row=(name,color,segments)=>({name,color,segments:segments.map(([start,end])=>[Math.round(start*90),Math.round(end*90)])});
export const methodData={
  score:82.1,
  duration:9000,
  description:'讲授与低阶提问较多，可增加深度互动和学习反馈。',
  summary:'教学行为以教师主导为主，语言表达流畅，提问集中在记忆与理解。建议增加高阶问题、延长候答时间，并明确课后任务与反馈方式。',
  sections:[
    {id:'behavior',name:'教学行为',observation:'教师行为 88%，学生行为 12%',status:'可提升',summary:'本课堂教师行为占比 88%，学生行为占比 12%。课堂以教师讲授为主，穿插提问、学生汇报与互动。建议增加学生表达和同伴讨论的机会，进一步锻炼知识输出与表达组织能力。'},
    {id:'language',name:'语言表达',observation:'语速偏快，音量适中；6 个高频词、5 个语气词',status:'关注语速',summary:'语速：教师以中高速输出知识，约 280–320 字/分钟。高频词：聚焦人工智能、数据、医疗、学习，紧扣课程主线。语气词：教师善用“对吧”“好”引导互动与过渡。'},
    {id:'questions',name:'教学提问',observation:'共 30 次提问；初阶 26 次，高阶 4 次',status:'可提升',summary:'教师提问以低阶认知问题（记忆/理解）为主，高阶问题占比不足，可能影响学生批判性思维发展。讲授过长，挤压了师生互动时间；评价环节薄弱，学生难以获得有效学习反馈。'},
    {id:'board',name:'课堂板书',observation:'查看板书片段与课堂时间分布',status:'片段分析',summary:''},
    {id:'interaction',name:'教学互动',observation:'S-T 轨迹与 Rt-Ch 分析，呈现混合型示例',status:'混合型',summary:''},
    {id:'homework',name:'引导课后学习',observation:'有课后思考引导，未识别到明确的课后提交要求',status:'待完善',summary:'教师在引导课后学习方面表现出良好的教学意识，课后任务与拓展资源均能有效延伸课堂学习价值。建议进一步优化任务设计的目标明确性与资源使用的指导性，结合学科特点设置阶段性反馈机制，提升学生持续探究的积极性与执行力。'}
  ],
  behavior:[row('教师讲课',methodColors[0],[[0,36],[57.6,91.5]]),row('教师提问',methodColors[1],[[5.8,14.5],[20,30.8],[62.5,73.7],[83.8,92]]),row('书写板书',methodColors[2],[[35,40.6],[91.5,96.4]]),row('学生汇报',methodColors[3],[[27.4,31.4],[57.6,60.2]]),row('师生互动',methodColors[4],[[14,16.3],[77,79]]),row('学生互动',methodColors[5],[[32.2,34.5],[81.3,84.5]])],
  questionTimeline:[row('教师提问',methodColors[0],[[4.7,10.8],[14.7,22.3],[41,44.5],[59.3,65]]),row('学生回答',methodColors[1],[[25.1,30.4],[65,68.5]]),row('教师评价',methodColors[2],[[34,39.3],[77,80.5]])],
  board:[row('课堂板书',methodColors[0],[[6.16,8.75],[16.88,18.30],[25.71,29.20],[61.07,66.07],[83.39,84.91],[85.09,85.45]])],
  ratios:{behavior:{title:'行为占比',labels:['教师行为','学生行为'],values:[88,12]},wait:{title:'候答时间',labels:['3秒以内','3–5秒','5秒以上'],values:[31,31,38]},answer:{title:'应答时间',labels:['5秒以内','5–15秒','15秒以上'],values:[67,33,0]},feedback:{title:'评价类型',labels:['简单肯定','针对肯定','激励','否定','重复'],values:[37,27,27,9,0]}},
  classifications:{bloom:{name:'布鲁姆分类',labels:['记忆','理解','应用','分析','评价','创造'],values:[6,13,7,3,1,0],groups:['初阶（26次）','高阶（4次）'],examples:['人工智能的发展经历了哪些阶段？','知识驱动与数据驱动有什么区别？','如何为智慧医疗场景设计提示词？','MYCIN 与大模型诊断各有哪些局限？','你会用哪些证据评估模型的可靠性？','本示例未记录创造类提问。']},mat:{name:'4MAT模式',labels:['为什么','是什么','怎么做','如果'],values:[6,13,7,4],groups:[],examples:['为什么需要研究人工智能的历史？','什么是检索增强生成（RAG）？','如何设计提示词来改善模型输出？','如果诊断数据存在偏差，结果会怎样？']}},
  language:[{name:'语速',value:'偏快',detail:'示例语速为 280–320 字/分钟。概念密集处可放慢节奏，在关键术语后留出短暂停顿。'},{name:'音量',value:'适中',detail:'示例音量总体适中。讲解重点时可结合重音与停顿，帮助学生区分关键信息。'},{name:'高频词',value:6,words:['人工智能','数据','医疗','学习','模型','算法'],detail:'课程关键词围绕人工智能及其应用展开。以下词项用于演示详情交互。'},{name:'语气词',value:5,words:['对吧','好','那么','嗯','是不是'],detail:'语气词可用于过渡和确认理解；建议避免以习惯性确认代替开放性追问。以下词项为演示补充。'}],
  homework:[{name:'布置任务，鼓励课后思考',available:true,detail:'示例任务：比较专家系统 MYCIN 与大模型在医疗诊断中的优势与局限，整理一个观点并列出支持证据。',suggestion:'下次课可安排小组分享，围绕数据可靠性与模型责任展开讨论。'},{name:'布置任务，要求课后完成',available:false,detail:'本示例未识别到明确的提交时间、提交形式或完成标准。',suggestion:'建议补充任务产出、截止时间和评价标准，形成可追踪的课后学习安排。'}]
};
export const methodTime=seconds=>`${Math.floor(seconds/60).toString().padStart(2,'0')}:${(seconds%60).toString().padStart(2,'0')}`;
export const methodDuration=seconds=>`${Math.floor(seconds/60)}分${seconds%60?`${seconds%60}秒`:''}`;
export const rowDuration=r=>r.segments.reduce((total,[a,b])=>total+b-a,0);
methodData.sections.find(s=>s.id==='board').summary=`图中展示 ${methodData.board[0].segments.length} 段板书，共 ${methodDuration(rowDuration(methodData.board[0]))}。点击时间色块，可查看对应板书片段。`;
methodData.sections.find(s=>s.id==='board').observation=`${methodData.board[0].segments.length} 段板书，共 ${methodDuration(rowDuration(methodData.board[0]))}`;
