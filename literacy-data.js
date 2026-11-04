// Figma 225:44201. Shared by the detail page, diagnosis modal and JSON export.
const examples = [
  {time:'00:01',text:'教师提及了智慧医疗的发展趋势和以史为鉴的研究意义'},
  {time:'00:01',text:'教师提及了1970年代著名的专家系统MYCIN及其在细菌感染诊断中的应用'}
];
export const literacyData = {
  score:95.1,
  summary:'以智慧医疗与人工智能发展史为切入点，连接专业知识与现实问题。建议进一步设计审辩讨论、观点表达和小组协作任务，让素养培养形成可观察的学习产出。',
  description:'结合医疗案例，建议将审辩、沟通、合作与价值引导转化为课堂任务。',
  insight:'从审辩思维、沟通能力、合作能力和课程思政四个方面梳理课堂线索。现有案例涉及智慧医疗与 MYCIN 专家系统，建议结合真实问题开展证据论证、小组交流和伦理讨论，并补充学生参与及任务产出的记录。',
  sections:[
    {id:'critical',name:'审辩思维',status:'待深化',observation:'历史与应用案例可作为审辩素材，建议补充观点论证过程。',summary:'结合发展史与医疗案例，建议引导学生比较技术的适用边界，并用证据支持观点。'},
    {id:'communication',name:'沟通能力',status:'待观察',observation:'建议增加案例复述与观点交流，观察学生解释和回应的表现。',summary:'以智慧医疗案例为表达素材，建议安排案例复述与同伴问答，观察解释和回应的质量。'},
    {id:'collaboration',name:'合作能力',status:'待观察',observation:'案例具备跨学科协作空间，建议记录任务分工与小组共同产出。',summary:'人工智能与医疗的联系可拓展为小组任务，建议明确分工，并形成共同的分析报告。'},
    {id:'values',name:'课程思政',status:'待深化',observation:'从医疗应用延伸科技向善议题，建议结合现实情境开展伦理讨论。',summary:'围绕智慧医疗的社会价值，建议融入科技向善、隐私保护与责任意识的讨论。'}
  ].map(section=>({...section,examples:examples.map(example=>({...example}))}))
};
