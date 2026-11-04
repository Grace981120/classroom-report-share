// Authored demonstration records, not production ASR/OCR or a validated matching model.
export const goalsData = {
  summary:'发展脉络与大纲较一致；模型评价要求本课未覆盖，协作目标需细化成果标准。建议补充模型评价练习，并以小组方案汇报检验协作表现。',
  outline:'《人工智能导论》课程大纲 · 2026版', scope:'教学日历第6课节 · 3项大纲要求',
  ppt:['解释人工智能从知识驱动、数据驱动到混合驱动的发展脉络。','认识Agent、RAG、Prompt Engineering等技术，比较应用情境。','完成跨学科项目方案，说明团队分工与设计思路。'],
  items:[
    {id:'history',text:'介绍人工智能的发展历程，从知识驱动到数据驱动，再到未来的混合驱动',category:'知识目标',match:95,requirement:'理解人工智能主要发展阶段及其技术路线。',page:'8',ppt:0,time:'02:18–02:37',segment:'T02',quote:'这节课我们先梳理人工智能的发展脉络，看看知识驱动和数据驱动各自解决什么问题，以及为什么会走向融合。',context:'前文介绍课程主题，后文以专家系统和数据驱动方法作比较。',reason:'发展阶段与技术路线均有对应；混合驱动转变条件的说明尚不充分。',suggestion:'补充一例知识与数据结合的应用，说明选择技术路线的条件。'},
    {id:'applications',text:'讲解大模型的应用技术：Agent，RAG，Prompt Engineering，Function Calling，Workflow',category:'知识目标',match:null,requirement:null,ppt:1,time:'03:06–03:28',segment:'T03',quote:'接下来会介绍Agent、RAG、提示词工程、函数调用和工作流，结合应用情境理解这些技术。',context:'承接本课目标介绍，随后进入应用案例。',reason:'在本课对应的三项大纲要求中没有找到单独对应条款；不能由此推断该内容没有教学价值。',suggestion:'结合课程定位说明其拓展用途，并确认是否影响本课必需内容的时间安排。'},
    {id:'teamwork',text:'引导学生进行跨学科合作与创新，提升团队协作与表达能力',category:'能力目标',match:70,requirement:'能够在跨学科团队中完成项目方案，并清晰表达设计思路。',page:'8',ppt:2,time:'03:29–03:52',segment:'T04',quote:'大家会分组讨论一个跨学科应用方案，练习团队协作和表达自己的设计思路。',context:'前文介绍技术应用，后文说明分组讨论任务。',reason:'团队协作和表达有对应；目标口述缺少明确的方案成果及评价标准。',suggestion:'要求提交方案并进行小组汇报，按分工协作、方案合理性和表达清晰度评价。'},
    {id:'evaluation',text:'理解模型评价方法，并能依据评价结果比较模型表现。',category:'知识目标',match:0,missing:true,requirement:'理解模型评价方法，并能依据评价结果比较模型表现。',page:'9',reason:'本课教学日历要求安排模型评价练习；完整课堂记录核对后未发现该内容，且未记录课节调整。',suggestion:'补充模型评价练习，引导学生使用评价结果比较模型表现。'}
  ]
};
