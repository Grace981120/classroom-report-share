// All observations below are fictional demo data, shared by the page and overview dialog.
export const attitudeData = {
  score: 92.1,
  duration: 7800,
  summary: '准时到课、着装规范，肢体表达丰富、站立教学投入较高；提前下课、疑似代课及课堂用语等线索需结合课堂情境进一步核查。',
  basics: [
    {label:'教师到课',value:'准时上课',status:'正常',time:'13:27',detail:'课表上课时间为 13:30，示例到课记录为 13:27，提前 3 分钟到课。'},
    {label:'教师离开',value:'提前下课',status:'待核查',time:'16:32',detail:'课表结束时间为 16:35，示例课堂结束记录为 16:32，提前 3 分钟。需结合实际调课或课间安排确认。'},
    {label:'代课情况',value:'疑似代课',status:'待核查',time:'13:30',detail:'示例授课人员匹配结果存在疑似差异，需要结合排课与代课登记人工核查，当前不作代课事实认定。'},
    {label:'教师着装',value:'规范',status:'正常',time:'全课节',detail:'示例课堂观察中教师着装整洁、仪态得体，未记录着装异常。'},
    {label:'敏感词',value:'2',unit:'次',status:'待核查',events:[['00:18:24','课堂用语线索 1：表达较为直接，需结合上下文核查是否影响学生表达意愿。'],['01:05:28','课堂用语线索 2：提示学生时语气偏强，建议结合实际语境复核。']]},
    {label:'看手机',value:'2',unit:'次',status:'待核查',events:[['00:26:18','教师短时查看手机，示例持续 12 秒；用途未确认。'],['01:12:08','教师短时查看手机，示例持续 8 秒；需区分教学使用与无关使用。']]},
    {label:'接打电话',value:'无',status:'未记录',time:'全课节',detail:'当前示例中未记录接打电话行为。'},
    {label:'吸烟',value:'无',status:'未记录',time:'全课节',detail:'当前示例中未记录吸烟行为。'}
  ],
  sections: [
    {id:'basics',name:'基础情况',observation:'准时到课、着装规范；提前下课、疑似代课、2 次用语线索与 2 次看手机待核查。',status:'待核查'},
    {id:'body',name:'肢体语言',observation:'肢体语言较丰富，手势与讲解相结合，有助于增强表达效果。',status:'丰富'},
    {id:'posture',name:'教学姿态',observation:'站立（含走动）约 93%，其中走动约 31%；就坐约 7%。',status:'投入较高'},
    {id:'patrol',name:'巡堂轨迹',observation:'讲台区域 67.2%，学生区域 32.8%；建议增加学生区域个性化指导。',status:'可优化'},
    {id:'management',name:'课堂管理',observation:'13:35 强调考勤，记录 10 次学习状态、教材及笔记提醒。',status:'持续关注'}
  ],
  posture: [
    {name:'站立',label:'站立（含走动）',color:'#1d70f2',seconds:7267,segments:[[0,2500],[2800,6270],[6503,7800]]},
    {name:'走动',label:'走动',color:'#00cc7e',seconds:2413,segments:[[600,1100],[1500,2100],[3900,4500],[5200,5913]]},
    {name:'就坐',label:'就坐',color:'#e545d2',seconds:533,segments:[[2500,2800],[6270,6503]]}
  ],
  managementTypes: [
    {name:'考勤',color:'#1d70f2'},
    {name:'提醒看黑板 / 屏幕',color:'#00cc7e'},
    {name:'提醒看书本 / 教材',color:'#e545d2'},
    {name:'提醒做笔记',color:'#ff7626'}
  ],
  management: [
    {time:300,type:0,text:'教师于 13:35 强调考勤的重要性，提醒学生按时到课。'},
    {time:480,type:2,text:'提醒学生打开教材，定位参数估计章节。'},
    {time:610,type:3,text:'提醒记录估计量定义及其适用条件。'},
    {time:1140,type:1,text:'提醒学生关注屏幕上的例题与已知条件。'},
    {time:1620,type:3,text:'提示记录关键推导步骤，标注易错条件。'},
    {time:1980,type:1,text:'提醒学生观察黑板中的公式变形过程。'},
    {time:2960,type:1,text:'引导学生回看屏幕，对照两种解题思路。'},
    {time:4180,type:2,text:'提醒学生阅读教材例题，核对推导过程。'},
    {time:4225,type:1,text:'提示学生回到黑板，关注关键结论。'},
    {time:5480,type:2,text:'引导学生参照教材完成课堂练习。'},
    {time:7230,type:3,text:'课程小结阶段提醒记录高频误区。'}
  ],
  patrol: [
    {label:'讲台区域',percent:67.2,time:'讲解与板书',detail:'教师活动主要集中在讲台及黑板前方，便于维持课堂节奏。'},
    {label:'学生区域',percent:32.8,time:'巡视与指导',detail:'走动覆盖两侧过道及中部区域，后排和学生个别指导仍可增加。'}
  ]
};
export function formatTime(seconds) {
  const m = Math.floor(seconds / 60), s = Math.floor(seconds % 60);
  return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
export function formatDuration(seconds) { return `${Math.floor(seconds/60)}分${String(seconds%60).padStart(2,'0')}秒`; }
