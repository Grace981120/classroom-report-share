// Constructed Demo observations; independent of expression, pitch and preparation.
export const teacherInvestmentWindows=[84,90,88,82,94,86,78,92,88,84,90,86,89].map((value,index)=>({
 id:'investment-window-'+index,start:index*600,end:(index+1)*600,value,activeSeconds:value*6,
 activity:['讲解与示范','组织问答','讲解与板书','指导学习','讲解与问答','组织练习','巡视指导','讲解与反馈','引导讨论','指导练习','总结与反馈','讲解与梳理','小结与答疑'][index],
}));
export const teacherInvestmentSummary={
 duration:teacherInvestmentWindows.reduce((n,w)=>n+w.end-w.start,0),
 activeSeconds:teacherInvestmentWindows.reduce((n,w)=>n+w.activeSeconds,0),
 get value(){return Math.round(this.activeSeconds/this.duration*1000)/10},
};
export const teacherInvestmentBands=[
 {grade:'A',condition:'x≥90%',score:10},{grade:'B',condition:'80%≤x<90%',score:8},
 {grade:'C',condition:'60%≤x<80%',score:5},{grade:'D',condition:'x<60%',score:0},
];
