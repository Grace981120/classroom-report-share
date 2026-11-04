// Knowledge relations are editorial interpretations of existing corrected classroom records.
// No new transcript, official syllabus or model output is fabricated here.
export const knowledgeNodes=[
 {id:'history',name:'人工智能发展历程',x:100,y:64,indices:[24,29,30,31,34],summary:'由“三起两落”进入发展受限原因，再讲述新的发展阶段。'},
 {id:'knowledge',name:'知识驱动',x:330,y:64,indices:[32,40,62],summary:'以规则、公理和符号表达知识，讨论维护成本与规则完整性。'},
 {id:'data',name:'数据驱动',x:560,y:64,indices:[41,42],summary:'以数据表达知识，并进一步讨论数据规模与计算条件。'},
 {id:'future',name:'未来方向',x:790,y:64,indices:[38,48,49,50],summary:'从大模型的发展延伸到具身与非具身两类思路。'},
 {id:'limits',name:'算力与存储限制',x:100,y:204,indices:[29,30],summary:'用运算需求、存储能力和组合爆炸解释早期发展受限。'},
 {id:'rules',name:'规则表达与完备性',x:330,y:204,indices:[32,40,42,62],summary:'前段强调规则难以穷尽，后段出现“所有的规则都已经表达出来”，需要核对其适用语境。',review:true},
 {id:'resources',name:'数据与资源条件',x:560,y:204,indices:[38,42],summary:'讲解将数据规模与算力、网络、带宽及能源代价联系起来。'},
 {id:'embodied',name:'具身智能',x:790,y:204,indices:[48,49,50],summary:'讲述身体、环境及互动反馈与智能的关系。'},
 {id:'medical',name:'医疗行业需求',x:445,y:344,indices:[44],summary:'将技术应用联系到医院、器械厂商与养老机构的实际需求。'},
 {id:'nonembodied',name:'非具身智能',x:790,y:344,indices:[49,50],summary:'与具身智能对照，讨论内部计算与推理的思路；相关概括需结合上下文理解。'},
];
export const knowledgeRelations=[
 {from:'history',to:'knowledge',label:'讲授推进',x:215,y:64,indices:[1,24,32],basis:'课堂先提出发展历程，再进入专家系统与规则表达。该线表示讲授组织，不把先后顺序当作因果关系。'},
 {from:'knowledge',to:'data',label:'方式比较',x:445,y:64,indices:[40,41,42],basis:'原话连续比较规则表达与数据表达，并讨论各自条件。'},
 {from:'data',to:'future',label:'发展延伸',x:675,y:64,indices:[1,38,48],basis:'课堂安排与后续讲述将核心方法连接到大模型及具身方向，不表示数据驱动必然推出具身智能。'},
 {from:'history',to:'limits',label:'受限原因',x:100,y:134,indices:[29,30],basis:'用运算、存储和求解空间限制解释早期发展受限。'},
 {from:'knowledge',to:'rules',label:'表达方式',x:330,y:134,indices:[32,40,42,62],basis:'知识驱动通过规则表达知识；规则是否能穷尽的两处表述需区分封闭系统与现实世界等语境。'},
 {from:'data',to:'resources',label:'资源条件',x:560,y:134,indices:[38,41,42],basis:'数据驱动讲解继续展开为数据、算力、网络和能源条件。'},
 {from:'future',to:'embodied',label:'方向举例',x:790,y:134,indices:[48],basis:'以具身智能作为未来方向的一种讲解线索，不代表穷尽全部前沿。'},
 {from:'embodied',to:'nonembodied',label:'概念对照',x:790,y:274,indices:[48,49,50],basis:'连续原句对照具身与非具身思路，说明身体、环境、计算与反馈。'},
 {from:'rules',to:'medical',label:'应用联系',x:352,y:280,indices:[40,42,44],basis:'核心方法讨论之后联系医疗行业需求。现有记录支持应用情境关联，不代表完成了具体方案验证。'},
 {from:'resources',to:'medical',label:'需求约束',x:547,y:280,indices:[42,44],basis:'资源代价与医疗行业需求属于应用考虑的不同条件；关系由相邻课堂段落整理，不声称教师明确给出了完整决策模型。'},
];
export const knowledgeChecks=[
 {id:'coverage',name:'核心内容覆盖',value:'三条主线有讲述',tone:'good',indices:[1,24,40,41,48],verdict:'现有记录可定位发展历程、知识驱动与数据驱动、未来方向三条讲授主线。',basis:'参照本课开头声明的课堂安排核对已有记录；只确认内容出现，不等于覆盖正式课程大纲或学生已经掌握。'},
 {id:'repeat',name:'重复讲述',value:'规则表达再次涉及',tone:'review',indices:[40,42,62],verdict:'规则表达在前后段再次涉及，暂不直接判为无效重复。',basis:'前段侧重知识表达方式及其限制，后段回到符号规则的优缺点；复讲可能承担概念巩固，需要结合教学目的与新增信息判断是否冗余。'},
 {id:'offtopic',name:'离题情况',value:'未定位明确离题',tone:'neutral',indices:[1,42,44],verdict:'医疗行业需求与本课技术应用有关联，当前引用不支持直接认定离题。',basis:'行业需求是核心方法后的应用延伸。该判断仅针对已引用记录，不推断全课绝无离题；正式大纲尚待核对。'},
 {id:'logic',name:'逻辑跳跃',value:'未定位明确跳跃',tone:'neutral',indices:[40,41,42,48,49,50],verdict:'方法比较和具身/非具身对照均有连续讲解，现有记录未定位明确的逻辑跳跃。',basis:'知识点关联需有比较、条件或讲授推进等原话支持，不能把主题切换本身当作跳跃。必要前提是否充分仍需结合完整材料和学生基础复核。'},
 {id:'consistency',name:'前后矛盾疑点',value:'1组表述待核对',tone:'review',indices:[32,42,62],verdict:'“规则难以穷尽”与“所有的规则都已经表达出来”存在表面差异，需复核语境与转写。',basis:'两段可能分别讨论现实世界的规则维护与封闭规则系统的推理。不同对象或条件下的表述不能直接判为矛盾，当前仅提示复核。'},
 {id:'syllabus',name:'课程大纲匹配',value:'正式大纲待补充',tone:'pending',indices:[1,24,40,41,44,48],verdict:'已能对照课堂开头的讲授安排；尚缺正式课程大纲，暂不输出大纲匹配率或达标结论。',basis:'现有“课程要求与学生基础”为既有示例材料，不能替代正式课程大纲。待取得大纲后，按必讲知识点、范围、要求层次逐项对照课堂依据。'},
];
export const knowledgeAnalysis='已见发展历程、知识驱动与数据驱动、未来方向三条主线，方法间有比较、条件与应用联系。规则表达在后段再次涉及，需区分巩固与冗余；现有记录未定位明确离题或逻辑跳跃。“规则完备性”前后表述存在疑点，建议核对语境与转写；正式课程大纲待补充，匹配情况待核验。';
