import {mountContentKnowledge} from './content-knowledge.js?v=20261101-1';
import {contentKnowledgeVersion} from './content-knowledge-version.js';
import {mountContentDepthAsr} from './content-depth-asr.js?v=20261103-depth-stars';
import {mountIndicatorReport} from './new-indicator-report.js';
import {contentDepthVersion} from './content-depth-version.js';
import {mountNewIndicator} from './new-indicator-render.js';
export function mountContentDepth(root,{openDialog}){
 if(contentDepthVersion==='baseline')return;
 if(contentKnowledgeVersion==='2.0'&&mountContentDepthAsr(root,{openDialog}))return;
 if(mountContentKnowledge(root,{openDialog}))return;
 if(contentDepthVersion==='2.0')return mountIndicatorReport(root,'content',{openDialog});
 const items=[
  {name:'内容深度',result:'待核验',summary:'由概念理解推进到应用或推理。',definition:'对照课程目标、教学要求和学生知识基础，判断概念、原理与应用的讲解层次是否适宜。',evidence:'现有课程目标与讲解示例可作部分对照，缺少完整学生先备知识与逐段讲解证据。',boundary:'高阶提问次数不能单独代表内容深度；难度高也不必然适宜。'},
  {name:'内容广度',result:'待核验',summary:'覆盖要求且不过度铺陈。',definition:'对照课程目标、教学要求和学生知识基础，判断本课知识范围及主题覆盖是否适宜。',evidence:'现有重难点和学科特点提供部分主题范围，尚不足以核验全部课程要求与课堂覆盖。',boundary:'知识点多不等于广度合适；应结合讲解时间与学生理解机会判断。'}
 ];
 return mountNewIndicator(root,root.querySelector('#content-challenges'),{id:'content-depth',title:'教学内容深度与广度',analysis:'当前示例可见目标与重难点，仍需对照完整课程要求和学生知识基础判断深度、广度是否适宜。',items,kind:'two',openDialog,eyebrow:'教学内容 / 教学内容深度与广度'});
}
