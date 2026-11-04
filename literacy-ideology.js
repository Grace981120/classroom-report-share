import {literacyIdeologyVersion} from './literacy-ideology-version.js';
import {mountNewIndicator} from './new-indicator-render.js';
import {mountIdeologyReport} from './literacy-ideology-report.js';
import {mountIdeologyElements} from './literacy-ideology-elements.js?v=20261102-release';
export function mountLiteracyIdeology(root,{openDialog}){
 if(literacyIdeologyVersion==='baseline')return;
 if(literacyIdeologyVersion==='3.0'&&!location.pathname.includes('/previews/'))return mountIdeologyElements(root,{openDialog});
 if(literacyIdeologyVersion==='2.0'&&!location.pathname.includes('/previews/'))return mountIdeologyReport(root,{openDialog});
 const items=[
  {tag:'思政元素挖掘',name:'思政元素讲授的丰富性',result:'待统计',summary:'讲授频次',definition:'统计课堂中可定位的思政元素讲解次数，重复提及同一元素需按明确事件口径处理。',evidence:'现有两条00:01记录是摘要，不能作为两次独立讲解计数。',boundary:'频次不代表融合质量或学生理解。'},
  {tag:'思政元素挖掘',name:'思政元素维度的覆盖性',result:'待核验',summary:'政治认同、家国情怀、文化素养、法治意识、职业素养',definition:'判断课堂内容覆盖五大思政维度中的哪些维度，并统计有直接证据的维度数量。',evidence:'现有案例摘要不足以逐项判定五大维度覆盖。',boundary:'同一案例可涉及多个维度，但必须分别说明具体关联。'},
  {tag:'思政与课程融合',name:'思政元素与专业知识的融合性',result:'待核验',summary:'是否与专业知识自然关联',definition:'判断思政元素是否是专业教学内容或相关知识点的自然延伸。',evidence:'智慧医疗案例可提示科技责任议题，缺少可定位原话与完整教学上下文。',boundary:'单独提及价值词语不等于与课程融合。'},
  {tag:'思政与课程融合',name:'思政元素与学科素养的适配性',result:'待核验',summary:'学科特点与核心素养契合',definition:'判断思政元素是否与本学科核心素养及教学目标相契合。',evidence:'当前只有部分专业案例摘要，缺少对应学科素养目标的完整对照。',boundary:'不同学科的适配要求不同，不以同一主题套用所有课程。'},
  {tag:'思政与课程融合',name:'思政元素融合的适切性',result:'— / 5 星',summary:'自然、合理且不干扰教学',definition:'按五级星观察融入是否自然流畅、支持课程核心目标且不干扰正常教学；3星及以上为适切。',evidence:'目前没有足够的连续课堂上下文支撑五星判断。',boundary:'讲授次数与覆盖面不能代替适切性评分。'},
  {tag:'教学组织与实施',name:'课程思政教学的情景性',result:'待核验',summary:'故事、案例、时事或生活现实',definition:'判断是否以经典故事、案例、时事或生活现实切入，并以正面教育与榜样激励为主。',evidence:'现有医疗案例摘要提示情景可能性，缺少完整导入与展开片段。',boundary:'出现案例不等于思政情景已有效形成。'},
  {tag:'教学组织与实施',name:'课程思政教学方法的多样性',result:'待统计',summary:'讨论、辩论、案例、角色扮演等',definition:'分析课程思政教学方法的类型与频次，并观察导入和切换是否自然。',evidence:'现有记录不足以分别定位讨论、辩论、案例分析和角色扮演的实施过程。',boundary:'方法数量不自动代表教学有效性。'},
  {tag:'教学组织与实施',name:'课程思政教学技术的创新性',result:'待统计',summary:'信息化工具与新技术类型',definition:'分析借助教学平台或新技术开展课程思政教学的类型与频次。',evidence:'当前课件和视频使用记录未能明确关联到思政教学任务。',boundary:'使用信息化工具本身不等于技术创新或思政融合。'}
 ];
 return mountNewIndicator(root,root.querySelector('#literacy-analysis'),{id:'literacy-ideology',title:'课程思政',analysis:'现有课堂记录仅提示专业案例与价值议题有关；讲授频次、五维覆盖、融合质量及方法技术仍需逐项复核。',items,kind:'ideology',openDialog,eyebrow:'教学素养 / 课程思政'});
}
