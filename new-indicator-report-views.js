export const resultDetails={
 preparation:{title:'备课充分度',result:'教学材料齐备，课堂安排与旧知衔接清楚。',keys:'materials,plan,prior',note:'教案、课件与教学计划的主题安排与课堂讲解相对应，旧知回顾和方法比较支持本讲目标。'},
 plan:{title:'教学安排',result:'已明确讲授内容与推进顺序。',keys:'plan,task',note:'教师交代人工智能历程、知识驱动到数据驱动及未来方向，并说明研讨安排。'},
 prior:{title:'知识衔接',result:'已通过前课案例衔接本课内容。',keys:'prior',note:'回顾智慧医疗简史以及统计方法、专家系统等案例，承接本课人工智能发展与方法讨论。'},
 materials:{title:'材料准备',result:'教案、课件与教学计划齐备，内容安排相互对应。',keys:'materials,plan',note:'材料覆盖发展历程、核心方法与未来方向，课堂实际安排与材料所列主题一致。'},
 depth:{title:'讲解深度',result:'讲解从概念解释推进到条件分析。',keys:'requirements,comparison,embodied',note:'知识驱动与数据驱动的讲解包含概念解释、类比说明及规则完整性和资源条件的比较。概念到条件比较的讲解层次与课程要求、学生基础相符。'},
 breadth:{title:'内容覆盖',result:'已见发展历程、知识驱动、数据驱动和未来方向的讲解。',keys:'requirements,topicHistory,topicKnowledge,topicData,topicFuture',note:'四类主题均有对应讲解，与本讲要求的主题范围相符；主题数量不单独代表广度质量。'},
 method:{title:'启发式讲解',result:'运用设疑、递进分析和比较引导理解。',keys:'inquiry,reasoning,comparison,embodied,demonstration',note:'分布统计5个讲解片段：设疑1、递进分析1、比较2、推理展示1；按主要方式归类，次数用于观察方式分布，不单独判断教学质量。'},
 profession:{title:'行业需求关联',result:'技术应用联系医疗行业实际需求。',keys:'profession',note:'教师引导关注医院、医疗器械厂商和养老服务机构的需求。该关联支持职业情境判断，不等于已完成实践教学。'},
 task:{title:'学生任务设计',result:'已安排行业调研与小组讨论。',keys:'task',note:'原话涉及前课调研与后续讨论安排；任务布置不等于本课已实施，需进一步核对学生参与过程和产出。'},
 practice:{title:'实践与评价',result:'围绕医疗需求形成方案，并进行同伴评价。',keys:'practice',note:'任务要求包含需求、方法、数据与预期结果，学生提交方案后按三项标准互评并提出修改建议。'}
};

export function attitudeView({title,ai,help,renderPitch}){
 return `<section class="preview-module" id="design-attitude">${title('教师教学投入','分别观察教学准备、教师表情与音调，各自依据不同，不直接合成投入分数。')}
 ${ai('备课材料与课堂安排相互对应，教师表情以平静为主，重点讲解处音调有变化；建议在比较和推理后留出停顿，便于学生整理思路。')}
 <div class="investment-observations">
 <div class="investment-observation"><h3>备课充分度${help('结合教案、教材、课件与课堂实施判断准备情况；课堂安排与旧知回顾是线索，不能独立证明备课充分。')}</h3><button class="investment-result" data-indicator-result="preparation">准备较充分</button><div class="investment-preparation-list"><button data-indicator-result="plan"><span>教学安排</span><strong>内容与顺序明确</strong></button><button data-indicator-result="prior"><span>知识衔接</span><strong>联系前课知识与案例</strong></button><button data-indicator-result="materials"><span>材料准备</span><strong>三类材料齐备</strong></button></div></div>
 <div class="investment-observation"><h3>教师表情${help('统计可识别时段内的表情分布，点击图形查看对应时段；表情不等于内心状态，比例不直接代表教学质量。')}</h3><div id="expression-chart" class="expression-chart"></div><div id="expression-mount" hidden><footer hidden></footer></div></div>
 <div class="investment-observation"><h3>音调${help('依据声音基频及变化，单位Hz；无声、噪声或无法辨识的区间保留为空，不能从ASR文字推算音调。')}</h3>${renderPitch()}</div>
 </div></section>`;
}

export function contentView({title,ai,help}){return `<section class="preview-module" id="design-content">${title('教学内容深度与广度','对照课程目标、教学要求和学生先备知识，判断讲解深度及内容范围是否适宜。')}
 ${ai('讲解由概念解释推进到方法比较与条件分析，内容范围与课程要求相符；建议结合医疗场景增加一次学生自主判断，巩固方法适用条件。')}
 <div class="preview-grid"><div><h3>讲解深度${help('呈现课堂讲解推进的层次；不能用高阶提问次数或概念难度代替深度适宜性判断。')}</h3><button class="result-statement" data-indicator-result="depth">从概念理解推进到条件分析</button>
 <div class="depth-levels" aria-label="已见概念解释、类比说明和条件分析"><button data-indicator-result="depth"><i>1</i><strong>概念解释</strong><span>说明知识表达方式</span></button><button data-indicator-result="depth"><i>2</i><strong>类比说明</strong><span>联系已有生活经验</span></button><button data-indicator-result="depth"><i>3</i><strong>条件分析</strong><span>比较方法优势与限制</span></button></div></div>
 <div><h3>内容广度${help('以下主题均已见课堂讲解；不代表完成全部课程要求，也不据主题个数判断广度适宜。')}</h3><button class="result-statement" data-indicator-result="breadth">涵盖发展历程、核心方法与未来方向</button>
 <div class="topic-overview" aria-label="已讲授主题"><button data-indicator-result="breadth">人工智能发展历程</button><button data-indicator-result="breadth">知识驱动</button><button data-indicator-result="breadth">数据驱动</button><button data-indicator-result="breadth">未来方向</button></div>
 <div class="fit-summary"><span class="result-label">深广度适宜性</span><button data-indicator-result="depth">与课程要求及学生基础相符</button></div></div></div></section>`;}

export function methodView({title,ai,help,methodEvents,colors}){
 const counts=[0,1,2,3].map(category=>methodEvents.filter(item=>item.category===category).length);
 return `<section class="preview-module" id="design-method">${title('教学方式','观察启发式讲解的实施，以及教学方法对实践、任务、岗位能力和做中学的支持。')}
 ${ai('设疑、递进分析与方法比较相互配合，并通过医疗需求方案与同伴互评承接应用；建议增加对不同方案选择理由的对比反馈。')}
 <div class="preview-grid"><div><h3>启发式讲解</h3><div class="plot-heading distribution-heading"><span class="result-label">讲解方式分布${help('统计5个讲解片段，按主要方式归类：设疑1、递进分析1、比较2、推理展示1；次数不等于讲解质量。')}</span><span class="unit">片段 / 个</span></div>
 ${['设疑引导','递进分析','比较分析','推理展示'].map((name,index)=>`<button class="bar-row" ${counts[index]?`data-indicator-evidence="${methodEvents.filter(item=>item.category===index).map(item=>item.key).join(',')}"`:'disabled'}><span>${name}</span><span class="bar-track"><i class="bar-fill" style="width:${counts[index]/2*100}%;--color:${colors[index]}"></i></span><span class="bar-value">${counts[index]}</span></button>`).join('')}</div>
 <div><h3>教学方法与职教特点适配性</h3><div class="fit-findings"><button data-indicator-result="profession"><i class="finding-dot"></i><div><strong>行业需求关联</strong><span>围绕医院、厂商与养老机构讨论技术应用</span></div></button><button data-indicator-result="task"><i class="finding-dot green"></i><div><strong>学生任务设计</strong><span>已安排行业调研与小组讨论</span></div></button><button data-indicator-result="practice"><i class="finding-dot"></i><div><strong>实践与评价</strong><span>形成需求方案，并按三项标准同伴互评</span></div></button></div></div></div></section>`;
}
