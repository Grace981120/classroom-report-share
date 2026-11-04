export const recordingData = {
  title: '大学物理公开课', teacher: '刘博士', college: '物理与电子学院', classroom: '学海楼401',
  className: '2023级电子物理1班', date: '2024-07-08 15:00–20:00（第9–11节）',
  duration: 2400, initialTime: 344, segment: '上课中 17:00–17:45',
  attendance: {present: 50, expected: 80, frontRow: 12, headsUp: 11},
  ratings: [{label:'优秀',value:100},{label:'良好',value:85},{label:'中等',value:70},{label:'及格',value:60},{label:'不及格',value:0}],
  questions: [
    {section:'教学目标',text:'紧扣教学大纲，教学目标明确'},
    {section:'教学目标',text:'立德树人，重视教学过程对学生的德育培养和价值引领'},
    {section:'教学目标',text:'内容饱满，材料丰富，融入学科前沿知识或者最新成果'},
    {section:'教学内容',text:'重点突出，难点讲解清楚，教学内容与课程目标相匹配'}
  ],
  transcript: [
    {time:0,speaker:'教师',text:'同学们好。今天我们从一个熟悉的现象出发，一起讨论物理规律如何帮助我们理解生活中的运动。'},
    {time:72,speaker:'教师',text:'这节课有三个学习目标：理解基本概念，掌握分析方法，并能把所学知识应用到实际问题中。'},
    {time:186,speaker:'教师',text:'请先回顾上节课的内容。描述一个物体的运动时，我们需要明确研究对象、参考系和初始条件。'},
    {time:344,speaker:'教师',text:'观察屏幕上的情境，先不要急于套用公式。请大家想一想：哪些量发生了变化，哪些条件保持不变？'},
    {time:418,speaker:'学生',text:'我认为应该先确定物体受到的作用，再分析运动状态的变化。'},
    {time:486,speaker:'教师',text:'很好。分析问题时，需要把观察到的现象与背后的规律联系起来，并说明判断的依据。'},
    {time:645,speaker:'教师',text:'下面通过一个例题，练习从问题描述到建立模型的过程。请在纸上画出示意图，标注已知条件。'},
    {time:812,speaker:'学生',text:'如果改变初始条件，得到的结果也会发生变化吗？'},
    {time:900,speaker:'教师',text:'这是一个很好的问题。我们可以保持其他条件不变，比较不同初始条件下的结果。'},
    {time:1140,speaker:'教师',text:'接下来请与身边的同学讨论，尝试用两种不同的方法解释这个现象，并比较各自的适用条件。'},
    {time:1386,speaker:'学生',text:'我们小组先分析了受力情况，再检查计算结果的单位和数量级是否合理。'},
    {time:1620,speaker:'教师',text:'除了得到答案，更重要的是说明推理过程。科学研究需要证据，也需要对假设和结果进行检验。'},
    {time:1920,speaker:'教师',text:'现在完成这道课堂练习。请独立思考，注意公式的适用范围，完成后与同伴交流解题思路。'},
    {time:2220,speaker:'教师',text:'今天我们学习了如何明确研究对象、建立模型和检验结论。课后请寻找一个生活中的实例，用今天的方法进行分析。'}
  ]
};

export function recordingScore(answers) {
  return Math.round(answers.reduce((sum,value)=>sum+(Number.isFinite(value)?value:0),0)/recordingData.questions.length*10)/10;
}
export function transcriptIndex(time) {
  return Math.max(0,recordingData.transcript.findLastIndex(row=>row.time<=time));
}
export function recordingTime(seconds) {
  return `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(Math.floor(seconds%60)).padStart(2,'0')}`;
}
