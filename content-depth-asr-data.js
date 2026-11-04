// Confirmed preview data; timestamps refer to existing corrected transcript records.
export const topics=[
 {title:'人工智能发展历程',progress:'发展阶段 → 兴衰原因',steps:[{index:24,depth:'发展阶段',text:'概述人工智能的“三起两落”'},{index:29,depth:'兴衰原因',text:'解释早期发展的算力限制'},{index:30,depth:'兴衰原因',text:'分析存储瓶颈与组合爆炸'}]},
 {title:'知识驱动与数据驱动',progress:'概念说明 → 方法比较 → 条件分析',steps:[{index:40,depth:'概念说明',text:'说明规则与公理的知识表达方式'},{index:41,depth:'概念说明',text:'引入数据表达与学习方式'},{index:42,depth:'方法比较 → 条件分析',text:'比较规则局限与数据、算力等资源条件'}]},
 {title:'未来发展方向',progress:'方向介绍 → 概念对照',steps:[{index:48,depth:'方向介绍',text:'介绍具身智能与环境的联系'},{index:49,depth:'概念对照',text:'对照非具身智能的计算思路'},{index:50,depth:'概念对照',text:'进一步说明互动反馈的差异'}]},
 {title:'医疗应用与行业需求',progress:'应用价值 → 需求举例',steps:[{index:6,depth:'应用价值',text:'说明智慧医疗面向医护、患者及社会的价值'},{index:44,depth:'需求举例',text:'联系医院、器械厂商与养老机构的实际需求'}]}
];

export const depthBreadthAnalysis='本课涉及10个知识点，技术路线由概念介绍推进到方法比较与条件分析，未来方向有概念对照，医疗应用主要停留在需求举例。对照大纲，模型评价要求尚未定位到对应讲解；建议补齐评价方法与应用推演，避免只增加主题而未充分展开。';

// Group related explanations without dropping or joining transcript records.
export const topicGroups=[
 [{indices:[24],text:'梳理人工智能“三起两落”的发展阶段'},{indices:[29,30],text:'分析算力、存储限制与组合爆炸等低谷成因'}],
 [{indices:[40,41],text:'说明规则与数据两种知识表达方式'},{indices:[42],text:'比较两种方法的局限及算力、能源条件'}],
 [{indices:[48],text:'说明具身智能与身体、环境的关系'},{indices:[49,50],text:'比较两类智能对计算、互动与反馈的不同侧重'}],
 [{indices:[6],text:'说明智慧医疗对医护、患者和社会的应用价值'},{indices:[44],text:'结合医院、器械厂商与养老机构说明行业需求'}]
];
