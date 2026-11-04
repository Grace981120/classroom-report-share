import {reviews as fullReviews} from './overview-review-data.js';
export const reviews={...fullReviews,
 p0:{...fullReviews.p0,title:'追问后的理解仍需确认',summary:'学生只提到“找到参考资料”，尚未解释资料如何支持回答；追问后也未记录进一步回答。',paragraphs:[],suggestion:'建议让学生对照资料与回答，说明“哪条依据支持哪句话”，再请其完整解释。'},
 p1:{...fullReviews.p1,title:'概念混淆还需进一步澄清',summary:'有学生把训练数据理解为电脑运行速度，现有记录尚不能确认误解已消除。',paragraphs:[],suggestion:'建议对比医疗样本与运行速度，请学生分类、说明理由，再用一个新例子检查理解。'},
 p2:{...fullReviews.p2,title:'关键概念缺少学习反馈',summary:'“模型推理”未记录学生应答，暂不能判断理解情况。',paragraphs:[],suggestion:'建议先补查课堂记录，再用一道医疗情境简答题收集全班解释，针对误区反馈。'}
};
