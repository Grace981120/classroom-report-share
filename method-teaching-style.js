import {mountTeachingMethods} from './method-methods.js?v=20261102-methods3';
import {mountIndicatorReport} from './new-indicator-report.js';
import {methodTeachingStyleVersion} from './method-teaching-style-version.js?v=20261102-methods3';
import {mountNewIndicator} from './new-indicator-render.js';
export function mountMethodTeachingStyle(root,{openDialog}){
 if(methodTeachingStyleVersion==='baseline')return;
 if(methodTeachingStyleVersion==='3.0')return mountTeachingMethods(root);
 if(methodTeachingStyleVersion==='2.0')return mountIndicatorReport(root,'method',{openDialog});
 const items=[
  {name:'启发式讲解',result:'待核验',summary:'递进分析、比较、设疑与推理展示。',definition:'观察教师在讲解中是否通过递进分析、比较、设疑或推理展示引导学生理解与思考。',evidence:'现有问答示例可提示教师设疑，尚无连续讲解片段来核验递进分析及推理展示。',boundary:'有提问不等于形成启发式讲解；需看问题与讲解、学生思考的承接关系。'},
  {name:'教学方法与职教特点适配性',result:'待核验',summary:'实践、任务、岗位能力与做中学。',definition:'观察教学方法是否适配职业教育强调的实践、任务、岗位能力和做中学。',evidence:'当前报告未提供岗位任务、实践产出与教学活动的完整对照。',boundary:'使用案例或多媒体不等于符合职教特点；需看学生是否在真实或模拟任务中应用知识。'}
 ];
 return mountNewIndicator(root,root.querySelector('#method-language'),{id:'method-style',title:'教学方式',analysis:'现有问答和案例线索不足以判断两类特色教学方式的实施质量，需结合连续讲解与实践任务复核。',items,kind:'two',openDialog,eyebrow:'教学方法 / 教学方式'});
}
