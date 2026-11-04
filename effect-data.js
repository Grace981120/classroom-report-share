import {methodTime,methodDuration,rowDuration} from './method-data.js';
export {methodTime as effectTime,methodDuration as effectDuration,rowDuration};
export const effectColors=['#1D70F2','#00CC7E','#E545D2','#FF7626','#FFB743','#19ABEA','#8066F5'];
const learningLabels=['听讲','阅读','视听','演示','讨论','实践','教给他人'];
const intervals=[[[0,32.3],[58.6,64.7],[75.3,76.4],[82,83],[95.5,100]],[[64.7,67.6]],[[19.5,21],[34.7,34.9],[61.4,63.1],[73.4,74.5],[92,93]],[],[[60,66],[74.3,74.8]],[],[[64.7,97.3]]];
export const effectData={
 score:93.8,duration:9000,
 description:'参与、学情与课堂行为共同呈现学生学习状态。',
 summary:'课堂整体参与度较高，学习行为以听讲、阅读等输入活动为主，讨论与同伴讲解提供了主动学习机会。建议结合学情变化与课堂证据，持续跟进学生参与质量。',
 sections:[
  {id:'participation',name:'学习参与度',observation:'整体参与度 90%，查看课堂参与变化',status:'优秀',summary:'本课整体参与度为 90%。课堂参与随教学环节变化，建议结合低谷时段的提问、讨论与任务安排，关注学生持续参与的质量。'},
  {id:'monitoring',name:'学情监测',observation:'实到 27 人，出勤率 66%，平均抬头率 82%',status:'综合观察',summary:'本页示例实到 27 人，平均抬头率为 82%。可结合出勤、迟到、早退及前排就坐情况观察课堂状态，并在参与下降的时段增加交流与即时反馈。'},
  {id:'pyramid',name:'学习金字塔',observation:'被动学习约 67%，主动学习约 33%',status:'可深化',summary:'学习行为以听讲、阅读和视听为主，讨论与教给他人构成主要的主动学习活动。建议增加实践与学生讲解的机会，促进知识应用与表达。'},
  {id:'anomalies',name:'学生异常行为',observation:'看手机 5 次、交头接耳 1 次、吃东西 2 次、随意走动 6 次',status:'关注线索',summary:'示例记录中，随意走动与看手机出现较多，另有少量交头接耳和吃东西。可结合当时教学任务与完整课堂情境，判断是否需要提醒或调整活动安排。'},
  {id:'actions',name:'学生动作',observation:'回头 24 次、举手 10 次、书写 14 次、站立 5 次',status:'行为分析',summary:'本课呈现回头、举手、书写与站立等动作。可结合实时分布观察提问响应、笔记记录和课堂交流，进一步了解学生参与方式。'},
  {id:'expressions',name:'学生表情',observation:'积极 31%、平淡 31%、消极 38%',status:'结合情境',summary:'表情分布与变化可作为课堂观察线索，建议结合学生回答、任务表现和反馈综合分析。表情标签不单独代表学生的学习成效或真实心理状态。'}
 ],
 gauges:[{name:'整体参与度',value:90,asset:'participation-imgEllipse1166',x:.12,y:0,w:116.352,h:60.0001,detail:'整体参与度采用设计稿的汇总示例。右侧曲线用于演示各时段变化，属于独立的曲线样例，不由该曲线计算 90%。'},
 {name:'出勤率',value:66,asset:'monitoring-imgEllipse1166',x:.12,y:0,w:75.528,h:60,detail:'本页展示实到 27 人和出勤率 66% 的设计稿示例。原稿未提供统一的应到人数，暂不反推缺勤人数。'},
 {name:'迟到率',value:2,asset:'monitoring-imgEllipse1167',x:0,y:55.2,w:18.036,h:4.8,detail:'迟到率为设计稿示例占比，未提供个人名单和到课明细。'},
 {name:'早退率',value:3,asset:'monitoring-imgEllipse1168',x:0,y:54.54,w:18.048,h:5.46,detail:'早退率为设计稿示例占比，需结合课程实际结束时间和课堂安排理解。'},
 {name:'前排就坐率',value:20,asset:'monitoring-imgEllipse1169',x:.12,y:23.772,w:25.692,h:36.228,detail:'前排就坐率为 20%。可结合教室布局、座位分布与课堂互动，观察是否需要拓展互动覆盖。'},
 {name:'平均抬头率',value:82,asset:'monitoring-imgEllipse1170',x:.12,y:0,w:111.612,h:60,detail:'平均抬头率采用原稿 82% 汇总示例，下方曲线为独立的波动样例。低头可能对应阅读、记录等活动，应结合教学情境理解。'}],
 learning:learningLabels.map((name,i)=>({name,value:[40,16,10,0,30,0,3][i],color:effectColors[i],segments:intervals[i].map(([a,b])=>[Math.round(a*90),Math.round(b*90)])})),
 anomalies:[{name:'看手机',value:5,detail:'观察到的手机使用可能对应查阅资料或与课程无关的活动，建议结合课堂任务核对。'},{name:'睡觉',value:0,detail:'本示例未记录睡觉线索。'},{name:'交头接耳',value:1,detail:'可结合当时是否安排同伴讨论，区分课堂交流与影响学习的交谈。'},{name:'吃东西',value:2,detail:'可结合具体情况适当提醒，保持课堂学习秩序。'},{name:'随意走动',value:6,detail:'可结合分组、展示和实践活动安排，核对是否属于教学所需移动。'},{name:'吸烟',value:0,detail:'本示例未记录吸烟线索。'}],
 actions:[{name:'回头',value:24},{name:'举手',value:10},{name:'书写',value:14},{name:'站立',value:5}],
 expressions:[{name:'积极',value:31},{name:'平淡',value:31},{name:'消极',value:38}],
 charts:{participation:{title:'学习参与度变化',unit:'%',max:60,labels:['参与度']},monitoring:{title:'抬头率',unit:'%',max:60,labels:['抬头率']},actions:{title:'学生实时动作',unit:'人',max:40,labels:['回头','举手','书写','站立']},expressions:{title:'学生实时表情',unit:'人',max:40,labels:['积极','平淡','消极']}}
};
