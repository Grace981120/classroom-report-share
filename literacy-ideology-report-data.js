// Interpretations of the project's corrected transcript, not newly generated ASR.
export const ideologyCategories=['政治认同','家国情怀','文化素养','法治意识','职业素养'];
export const ideologyRecords=[
 {id:'collaboration',title:'尊重专业差异，开展跨学科合作',categories:['职业素养'],index:7,excerpt:'目的其实是为了参与跨学科的团队学习，学会如何与不同背景的专业人员进行合作。你得了解他们，知道他们知道什么、不知道什么，这是非常重要的。',reason:'原文明确引导跨学科团队学习、了解不同专业人员的知识与特长，归入职业素养中的协作意识。未据此认定学生已形成合作能力。'},
 {id:'governance',title:'关注人工智能伦理与隐私保护',categories:['职业素养'],index:16,excerpt:'那么基于人工智能里边有跟社会科学相关的里边包括伦理、可信、安全、公平性、隐私保护等这些方向。',reason:'从人工智能应用延伸到治理中的伦理、公平、安全和隐私，归入职业素养中的技术责任意识。原文未讲授具体法律规范，不仅凭“隐私保护”归为法治意识。'},
 {id:'history',title:'以史为鉴，探究技术发展的原因',categories:['文化素养'],index:24,excerpt:'所以到现在70年之后，它一共经历了三起两落。所以当谈到人工智能的历史时，我们要知道三起两落。当然三起两落背后，我们肯定更关心的是落的原因和起的原因。',reason:'从记忆发展史转向追问兴衰原因，体现科学文化与求因意识，归入文化素养。这是对原文的语义归类，不等于已经观察到学生形成科学精神。'}
];
export const ideologyObservations=[
 {id:'elements',short:'讲授丰富性',name:'思政元素讲授的丰富性',definition:'观察课堂中价值引导的主题和可定位讲授事件。',analysis:'记录涉及专业协作、技术责任和以史为鉴三类线索，内容有不同切入点。建议围绕一个核心价值问题组织讲述，避免主题出现即视为充分展开。',records:['collaboration','governance','history']},
 {id:'coverage',short:'维度覆盖性',name:'思政元素维度的覆盖性',definition:'按政治认同、家国情怀、文化素养、法治意识、职业素养五类，对有依据的课堂内容归类。',analysis:'当前提取记录可归入文化素养与职业素养。未对其它类别强行归类；覆盖类别多不自动代表质量高，应以课程目标和专业需要决定取舍。',records:['collaboration','governance','history']},
 {id:'integration',short:'专业融合性',name:'思政元素与专业知识的融合性',definition:'观察价值引导是否从专业知识、技术问题或应用情境自然延伸。',analysis:'人工智能治理直接联系伦理、公平和隐私，价值主题与专业内容有明确连接。建议加入一项具体医疗AI决策，让学生说明技术选择及责任依据。',records:['governance']},
 {id:'discipline',short:'学科适配性',name:'思政元素与学科素养的适配性',definition:'观察价值主题是否契合本学科的思维方式与专业责任。',analysis:'跨学科协作与技术责任契合智慧医疗的专业情境，发展史追因也能支持理性认识技术。建议将这些要求落到具体分析任务；现有记录不能代替正式学科目标对照。',records:['collaboration','governance','history']},
 {id:'appropriateness',short:'融合适切性',name:'思政元素融合的适切性',definition:'观察融入是否自然、流畅、合理，并支持课程核心目标。',analysis:'现有原文分别处于团队学习、人工智能治理和发展史讲解语境，价值议题有专业承接。是否影响教学节奏仍需结合连续课堂过程判断，不仅凭关键词出现下结论。',records:['collaboration','governance','history']},
 {id:'context',short:'教学情景性',name:'课程思政教学的情景性',definition:'观察是否借助故事、案例、时事或生活现实承载价值引导。',analysis:'跨专业团队和人工智能治理提供了可讨论的情境。当前原文更多呈现教师说明，建议用医疗数据使用或团队分工的具体案例，让学生面对需要取舍的问题。',records:['collaboration','governance']},
 {id:'diversity',short:'方法多样性',name:'课程思政教学方法的多样性',definition:'观察讲解、讨论、辩论、案例分析和角色扮演等方法的实际实施。',analysis:'当前提取记录主要呈现教师讲解，合作学习的倡议不等于已实施讨论。建议补充学生观点、分歧与回应记录，再核验方法是否形成有效参与。',records:['collaboration','governance']},
 {id:'technology',short:'技术创新性',name:'课程思政教学技术的创新性',definition:'观察教学平台或新技术是否实际服务于课程思政任务。',analysis:'这些原文不能直接证明信息化工具用于思政任务。建议将匿名观点收集、案例投票等工具与价值判断任务结合，并保留学生回应；不能把讲授人工智能当成采用新技术教学。',records:['governance']}
];
