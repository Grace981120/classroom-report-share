export const outlineLessons = [
  {id:'lesson-1',label:'第1次课'},
  {id:'lesson-2',label:'第2次课'},
  {id:'lesson-3',label:'第3次课'},
  {id:'lesson-4',label:'本次课'}
];

export const outlineKnowledge = [
  {
    group:'智慧医疗基础',
    source:'课程大纲 第二章“智慧医疗数据基础”',
    nodes:[
      {id:'medical-data',name:'医疗数据类型与特征',status:['new','repeat','covered','covered'],source:'2.1 医疗数据类型：结构化病历、医学影像与生命体征数据。',evidence:[['第1次课 · 00:12:18','区分结构化病历、影像与连续生命体征数据。'],['第2次课 · 00:08:42','结合缺失值示例再次说明医疗数据异质性。']]},
      {id:'data-quality',name:'医疗数据质量',status:['none','new','repeat','covered'],source:'2.2 医疗数据质量：完整性、一致性、时效性与可追溯性。',evidence:[['第2次课 · 00:21:05','用电子病历缺项说明完整性问题。'],['第3次课 · 00:16:30','练习中再次识别异常值与时间错位。']]}
    ]
  },
  {
    group:'医学人工智能方法',
    source:'课程大纲 第三章“医学人工智能核心方法”',
    nodes:[
      {id:'classification',name:'医学分类模型',status:['none','new','repeat','covered'],source:'3.1 医学分类模型：理解分类任务、训练过程及常用评价指标。',evidence:[['第2次课 · 00:34:12','以疾病风险分层说明二分类任务。'],['第3次课 · 00:27:48','复习训练集、验证集与测试集的用途。']]},
      {id:'sensitivity',name:'敏感度与特异度',status:['none','none','new','repeat'],source:'3.2 模型评价：掌握敏感度、特异度及其在医学场景中的含义。',evidence:[['第3次课 · 00:41:26','从漏诊风险引出敏感度。'],['本次课 · 00:18:44','对比敏感度与特异度，并解释阈值变化的影响。']]},
      {id:'roc',name:'ROC与AUC',status:['none','none','none','new'],source:'3.2 模型评价：理解ROC曲线与AUC，能够解释模型区分能力。',evidence:[['本次课 · 00:32:10','结合两组预测结果绘制ROC曲线。'],['本次课 · 00:46:35','学生根据曲线比较两个模型的区分能力。']]},
      {id:'validation',name:'临床模型验证',status:['none','none','none','new'],source:'3.3 临床验证：了解内部验证、外部验证及数据偏移风险。',evidence:[['本次课 · 01:05:28','用跨院数据差异说明外部验证的必要性。']]}
    ]
  },
  {
    group:'应用伦理与治理',
    source:'课程大纲 第五章“医学AI伦理与治理”',
    nodes:[
      {id:'privacy',name:'医疗隐私保护',status:['none','none','new','covered'],source:'5.1 数据安全与隐私：理解医疗数据使用中的授权、脱敏与安全责任。',evidence:[['第3次课 · 01:12:08','讨论病例数据脱敏和授权边界。']]},
      {id:'fairness',name:'算法公平性',status:['none','none','none','none'],source:'5.2 可信医学AI：理解公平性、可解释性与责任边界。',evidence:[]}
    ]
  }
];

export const outlineStatus = {
  covered:'此前覆盖',
  new:'本课新增',
  repeat:'再次涉及',
  none:'暂无证据'
};
