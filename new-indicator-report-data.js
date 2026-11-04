import {recordingTranscript as transcript} from './recording-transcript-data.js';
// Existing corrected ASR remains unchanged. Constructed additions are marked below.
export const indicatorEvidence={
 plan:{title:'教学内容安排',indices:[1],hit:'那所以呢我们会分成三个部分',basis:'教师明确交代讲授范围和推进顺序，可作为课堂安排的线索；不能由此确认教案齐备或备课充分。'},
 prior:{title:'旧知回顾',indices:[5],hit:'比如说数理统计和霍乱',basis:'讲解将本课与前课案例衔接；尚需教案、课件及课程要求核对准备情况。'},
 inquiry:{title:'设疑引导',indices:[24],hit:'三起两落背后，我们肯定更关心的是落的原因和起的原因',basis:'将历史回顾转为原因问题，引导关注发展起落背后的条件；本段未记录学生应答，不由此推断学生已参与分析。'},
 reasoning:{title:'递进分析',indices:[29,30],hit:'整个运算量超过了当时最大芯片的能力',basis:'从运算需求进一步分析存储与求解空间限制，用多个条件解释早期人工智能发展受限。'},
 comparison:{title:'知识与数据比较',indices:[40,41,42],hit:'这两个流派，知识表达更简洁一些，但是规则提得不够全',basis:'由规则和数据两种表达方式，推进到规则完整性与算力资源的比较，超过术语罗列。'},
 embodied:{title:'具身与非具身比较',indices:[48,49,50],hit:'而具身智能更关注互动与反馈',basis:'围绕智能是否依赖身体、环境及互动反馈比较两类思路；未据此推断学生已理解。'},
 task:{title:'行业调研与讨论安排',indices:[2,13],hit:'那我们希望大家通过小组讨论的方式',basis:'原话明确调研与讨论的安排。这是任务布置线索，不能作为课堂已完成实践、学生已形成岗位能力的证据。'},
 profession:{title:'联系医疗行业需求',indices:[44],hit:'当你做一个东西，你首先要问问医院',basis:'教师将技术应用联系到医院、医疗器械厂商和养老服务机构的实际需求，可支持职业情境关联；未见学生实践产出。'},
 topicHistory:{title:'人工智能发展历程',indices:[24,31,34],hit:'它一共经历了三起两落',basis:'已校对记录包含发展历程及不同阶段的讲解；完整课程要求未提供，不能判定本课覆盖达标。'},
 topicKnowledge:{title:'知识驱动',indices:[32,40,62],hit:'规则不断提出',basis:'讲解涉及专家规则的表达方式与维护问题，可定位到具体课堂原句。'},
 topicData:{title:'数据驱动',indices:[41,42],hit:'我用大量的数据去表示知识',basis:'讲解涉及从数据学习的方式和算力条件；完整课程要求未提供，暂不判定适宜性。'},
 topicFuture:{title:'未来方向',indices:[38,48,49,50],hit:'具身智能是指智能体的智能不仅依赖于大脑',basis:'有大模型、具身与非具身方向的讲解线索；并非对未来方向的完整覆盖审核。'},
 innovation:{title:'创新与持续学习',indices:[3,4],hit:'那所以你要不断地自主学习',basis:'教师从医工交叉和课程变化引出创新、自主学习的要求，是专业学习的价值引导线索；不等于学生价值目标已达成。'},
 cooperation:{title:'跨学科合作',indices:[7],hit:'学会如何与不同背景的专业人员进行合作',basis:'合作要求与跨学科团队学习直接关联，可作为职业素养及专业融合的线索；不等于已观察到有效合作。'},
 ethics:{title:'人工智能治理议题',indices:[16],hit:'伦理、可信、安全、公平性、隐私保护',basis:'原话列出相关研究议题，但未展开具体法律规范或价值论证，不能仅凭词语判定法治意识维度已覆盖。'}
};

indicatorEvidence.materials={title:'备课材料对照',origin:'constructed-demo',records:[
 {time:360,speaker:'教学计划',text:'本讲围绕人工智能发展历程、知识驱动与数据驱动、未来方向组织教学。先回顾前课案例，再比较两类知识表达方式，最后联系医疗行业需求。'},
 {time:360,speaker:'教案',text:'学生已了解智慧医疗基础案例。本课通过规则表达与数据学习的比较，帮助学生说明两类方法的优点、限制及适用条件。'},
 {time:360,speaker:'课件',text:'内容结构：发展历程—核心方法—未来方向；比较内容：规则完整性、数据规模、计算资源与应用需求。'}
],basis:'教学计划、教案与课件覆盖本讲主题，并与课堂中的旧知回顾、方法比较及行业联系相对应。',hit:''};
indicatorEvidence.requirements={title:'课程要求与学生基础',origin:'constructed-demo',records:[
 {time:360,speaker:'课程要求',text:'能够概述人工智能发展历程，比较知识驱动与数据驱动的基本方式、优势及限制，并举例说明医疗行业中的应用需求。'},
 {time:360,speaker:'学生基础',text:'已学习智慧医疗简史，接触过MYCIN、统计方法与贝叶斯诊断案例；本讲不要求推导模型训练算法。'}
],basis:'课堂从概念与案例推进到方法条件比较，讲授范围与上述要求相符，未要求超出先备基础的训练算法推导。',hit:''};
indicatorEvidence.demonstration={title:'推理展示',origin:'constructed-demo',records:[{time:2480,speaker:'教师',text:'先确定医院希望解决的问题，再看能不能把判断条件写成稳定规则。如果规则难以穷尽，但已有足够标注案例，就考虑数据驱动；如果样本很少，就不能只凭模型复杂来作决定。'}],basis:'按照任务条件、规则表达及数据基础展示方法选择的推理过程。',hit:'如果规则难以穷尽，但已有足够标注案例，就考虑数据驱动'};
indicatorEvidence.practice={title:'任务实施与评价',origin:'constructed-demo',records:[
 {time:2660,speaker:'教师',text:'每组选择一个医院场景，写清服务对象、当前问题、可用数据和预期结果，再判断适合规则驱动还是数据驱动。不要只列技术名称，要说明为什么这样选。'},
 {time:2810,speaker:'学生',text:'我们选择导诊场景，先整理科室与症状的明确对应规则；对描述不清楚的问题，再收集历史咨询样本，比较两种方式的准确性。'},
 {time:2890,speaker:'教师',text:'请相邻小组从需求是否明确、方法理由是否充分、数据是否可获得三个方面评价方案，并给出一项修改建议。'}
],basis:'学生围绕医疗场景形成方法选择方案，评价同时关注需求、选择理由与数据条件，构成任务—产出—反馈的过程。',hit:'需求是否明确、方法理由是否充分、数据是否可获得'};
for(const [key,item] of Object.entries(indicatorEvidence)){
 item.key=key;
 if(!item.records){item.origin='existing-corrected-asr';item.records=item.indices.map(index=>({...transcript[index],id:'ASR-'+String(index+1).padStart(3,'0')}));}
 item.time=item.records[0].time;
 if(item.hit&&!item.records.some(row=>row.text.includes(item.hit)))throw new Error('Evidence text mismatch: '+key);
}
export const indicatorMethodEvents=[{key:'inquiry',category:0},{key:'reasoning',category:1},{key:'comparison',category:2},{key:'embodied',category:2},{key:'demonstration',category:3}];
export const indicatorColors=['#1d70f2','#00cc7e','#e545d2','#ff9d4d'];
// Constructed F0 observations; no audio analysis service was called.
const pitchIndices=[1,5,8,12,16,20,24,27,31,35,39,42,46,49,53,56,59,62];
const pitchValues=[146,158,154,171,163,176,159,188,165,178,157,191,172,183,168,194,181,162];
export const indicatorPitch=pitchIndices.map((index,i)=>({time:transcript[index].time,hz:pitchValues[i],transcriptIndex:index,origin:'constructed-demo'}));
export const indicatorTranscript=transcript;
