import {mountIndicatorReport} from './new-indicator-report.js?v=20261102-language-evaluation';
import {attitudeInvestmentV2Version} from './attitude-investment-v2-version.js';
import {mountNewIndicator} from './new-indicator-render.js';
export function mountAttitudeInvestmentV2(root,{openDialog}){
 if(attitudeInvestmentV2Version==='baseline')return;
 if(attitudeInvestmentV2Version==='2.0')return mountIndicatorReport(root,'attitude',{openDialog});
 const items=[
  {name:'备课充分度',result:'待核验',summary:'对照教案、课件与课堂目标。',definition:'观察备课材料是否支持本课目标、重点和教学活动，及课堂讲授是否体现相应准备。',evidence:'当前报告没有可定位的教案与课件完整材料；课堂讲授线索不能单独证明备课充分。',boundary:'材料齐全与否、能否脱稿授课和实际教学效果应分别核查。'},
  {name:'教师表情',result:'平静为主',summary:'结合讲解与互动时段复核。',definition:'观察教师可见表情与当时教学活动的配合，作为精神状态的外显线索。',evidence:'现有表情示例在30分钟可识别时段内为平静60%、微笑30%、惊讶10%。',boundary:'表情分布不等于内心状态；平静不能直接判为精神不饱满，缺少原画面时不能确定整体状态。'},
  {name:'音调',result:'待核验',summary:'观察音调变化与讲解重点。',definition:'观察教师声音高低及变化与教学内容和课堂互动是否配合。',evidence:'当前报告没有可定位的音调声学片段及同期课堂原话对照。',boundary:'音调高或变化大均不自动等于讲课有激情；应结合讲解任务和听感复核。'}
 ];
 return mountNewIndicator(root,root.querySelector('#attitude-management'),{id:'attitude-investment',title:'教师教学投入',analysis:'表情样例以平静为主；备课材料和语调证据不足，暂不判断整体教学投入。',items,openDialog,eyebrow:'教学态度 / 教师教学投入',augmentExisting:true});
}
