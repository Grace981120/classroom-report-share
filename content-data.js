import {teachingContentVersion} from './content-quality-version.js';
import {contentAccuracyVersion} from './content-accuracy-version.js';
// Figma 202:35964. Shared by the detail page, overview modal and report export.
const contentV12=teachingContentVersion!=='baseline';
const history = '介绍人工智能的发展历程，从知识驱动到数据驱动，再到未来的混合驱动';
const applications = '讲解大模型的应用技术：Agent，RAG，Prompt Engineering，Function Calling，Workflow';
const teamwork = '引导学生进行跨学科合作与创新，提升团队协作与表达能力';
const practiceExamples = () => examples.map(e=>({...e,scene:'生产案例'}));
const examples = [
  {time:'00:01',text:'教师提及了智慧医疗的发展趋势和以史为鉴的研究意义'},
  {time:'00:01',text:'教师提及了1970年代著名的专家系统MYCIN及其在细菌感染诊断中的应用'}
];
export const contentData = {
  score:98.2,
  summary:`${contentV12?'教学目标':'课程目标'}清晰，重难点组织完整，学科前沿与跨学科联系丰富。建议细化目标达成标准，并增加实践任务，促进知识理解与应用。`,
  description:'目标与重难点清晰，建议细化评价标准、增加实践任务。',
  goals:[history,applications,teamwork],
  challenges:[history,'讲解大模型的应用技术：Agent，RAG，Prompt Engineering，Function Calling',teamwork,history,applications,teamwork],
  features:['学科思维','学科历史','学科前沿','跨学科联系'].map(name=>({name,examples:examples.map(e=>({...e}))})),
  practice:[
    {knowledge:'人工智能在自然语言处理方面的发展，展示了人工智能在像人一样行动的能力，思政案例和审辩问题。',examples:practiceExamples()},
    {knowledge:'人工智能在自然语言处理方面的发展，展示了人工智能在像人一样行动的能力。',examples:practiceExamples()}
  ],
  sections:[
    {id:'goals',name:contentV12?'教学目标':'课程目标',observation:'呈现 3 项目标，涵盖发展历程、应用技术与跨学科协作；建议细化达成标准。',status:'清晰',summary:`${contentV12?'教学目标':'课程目标'}清晰具体，涵盖了人工智能的发展历程、大模型应用技术以及跨学科合作。建议教师在后续课程中进一步细化目标的达成方式，例如提供更明确的评估标准或实践任务，以增强目标的可操作性和达成度。`},
    {id:'challenges',name:contentV12?'教学重难点':'课程重难点',observation:'呈现 6 项重难点，讲解清晰；建议增加案例、小组讨论和实践分析。',status:'完整',summary:contentAccuracyVersion==='baseline'?`本节课共6个${contentV12?'教学重难点':'课程重难点'}。教师对重难点讲解清晰，时间分配合理，内容深入浅出。建议在讲解大模型局限性时，可增加实际案例帮助学生理解；在人工智能概念部分，可引导学生进行小组讨论以加深理解；在评估行业问题部分，可设计具体任务让学生实践分析。`:'本节课围绕人工智能发展历程、大模型应用技术和跨学科协作组织重难点；对RAG等应用技术采用流程拆解与概念对照推进理解。当前列表未呈现评价指标辨析的直接证据，建议在后续讲解中用同一任务对照检索、生成与评价环节，并通过学生复述核验难点是否突破。'},
    {id:'features',name:'学科特点',observation:'从学科思维、历史、前沿和跨学科联系四个方面呈现课堂证据。',status:'丰富',summary:'学科特点整体表现为前沿性突出、跨学科融合丰富，学科思维与历史脉络亦有系统呈现；建议进一步强化核心理论与方法论的逻辑关联，明确学科前沿与课程核心知识点的内在联系，并通过案例或项目式学习深化学生对学科综合性的理解与应用。'},
    {id:'practice',name:'理论联系实际',observation:'知识与案例相结合，建议增加动手实践，验证学生的迁移应用能力。',status:'优秀',summary:'教师在理论联系实际方面表现优秀，案例丰富且与理论结合紧密。建议进一步增加学生动手实践环节，如让学生尝试设计一个基于蒙特卡洛搜索的简单游戏AI，或使用提示词工程优化大模型输出，以提升学生从实际中认识理论、将理论应用于实践的能力。'}
  ]
};
