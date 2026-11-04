// Teaching questions 1.0. Authored demonstration events, not real classroom analysis.
export const bloomLabels=['记忆','理解','应用','分析','评价','创造'];
export const matLabels=['为什么','是什么','怎么做','如果'];
export const levelLabels=['前结构','单点结构','多点结构','关联结构','抽象拓展结构'];
export const feedbackLabels=['简单肯定','针对肯定','激励','否定','重复'];
export const strategyLabels=['追问解释','问题拆解','引导反思'];
export const levelNotes=['回答尚未切中问题的相关信息。','回答包含一个相关信息点。','列出多个相关信息点，尚未建立明确联系。','将多个信息点联系起来，形成解释或推理。','将已有理解推广到新的情境，提出可检验的原则或假设。'];
// question text, Bloom, 4MAT, answers: [text, level]
const seeds=[
 ['知识驱动与数据驱动的方法有什么区别？','分析','是什么',[
 ['知识驱动依靠专家规则，数据驱动从数据中学习规律。','多点结构'],
 ['规则系统要由专家修改规则；数据驱动可用新数据训练，因此能否适应变化也取决于新数据的质量。','关联结构'],
 ['还需要考虑规则是否完整，以及训练数据有没有偏差。','多点结构']]],
 ['为什么检索增强生成能够改善回答的可靠性？','理解','为什么',[
 ['它能先找到参考资料。','单点结构']]],
 ['怎样判断一个医疗问答结果是否可靠？','评价','怎么做',[
 ['要看参考依据是否可靠，还要看内容是否适合当前病例。','多点结构'],
 ['可以将回答与权威资料逐项核对，再请专业人员检查适用条件，不能只看文字是否流畅。','关联结构']]],
 ['什么是机器学习中的训练数据？','记忆','是什么',[
 ['是用来让模型学习的样本。','单点结构'],['我觉得是电脑运行的速度。','前结构']]],
 ['专家系统中的知识库保存什么？','记忆','是什么',[
 ['保存专家知识和规则。','单点结构'],['应该就是屏幕上的所有按钮。','前结构']]],
 ['什么是检索增强生成？','记忆','是什么',[
 ['把检索到的资料提供给生成模型。','单点结构'],['先检索相关信息，再把这些信息作为生成回答时的依据。','关联结构']]],
 ['机器学习模型的参数是什么？','记忆','是什么', [['模型训练中调整的数值。','单点结构']]],
 ['提示词中的角色描述有什么作用？','理解','为什么', [['给模型一个回答的角色。','单点结构']]],
 ['为什么训练集与测试集要分开？','理解','为什么', [['避免在训练时就看过测试样本，这样才能观察模型对新样本的表现。','关联结构']]],
 ['如何为医疗问答写出明确的任务要求？','应用','怎么做', [['写清输入、任务和输出格式。','多点结构']]],
 ['如果检索资料之间存在矛盾，你会怎样处理？','分析','如果', [['先检查来源和日期，再核对适用条件；仍无法判断时明确保留分歧。','关联结构']]],
 ['为什么数据偏差会影响模型结果？','理解','为什么', [['因为学习样本有偏差。','单点结构']]],
 ['怎样设计一个可比较的提示词实验？','应用','怎么做', [['固定输入与评价标准，只改变提示词中的一个因素。','多点结构']]],
 ['如何将检索结果用于回答核验？','应用','怎么做', [['逐条对照回答与检索资料。','单点结构']]],
 ['检索结果与生成结果之间是什么关系？','理解','是什么', [['检索结果提供参考材料。','单点结构']]],
 ['如何为问答系统设计无法回答时的输出？','应用','怎么做', [['明确说资料不足并指出还需要哪些信息。','多点结构']]],
 ['为什么模型回答流畅不等于内容正确？','理解','为什么', [['流畅只是语言的表现。','单点结构']]],
 ['如何用同一套标准比较规则系统和大模型？','分析','怎么做', [['可以提出适用于不同系统的原则：固定任务与证据标准，分别检验正确性、可解释性和适应变化的能力，再在新领域验证这套原则。','抽象拓展结构']]],
 ['什么是模型推理？','记忆','是什么',[]],
 ['什么是提示词？','记忆','是什么',[]],
 ['如何理解模型的泛化能力？','理解','是什么',[]],
 ['怎样区分事实陈述和模型推测？','理解','是什么',[]],
 ['上下文窗口意味着什么？','理解','是什么',[]],
 ['为什么检索资料需要注明来源？','理解','为什么',[]],
 ['模型出现幻觉通常指什么？','理解','是什么',[]],
 ['如果输入信息不完整，输出可能发生什么？','理解','如果',[]],
 ['检索排序对参考材料有什么影响？','理解','是什么',[]],
 ['请把模糊的提问改写为有明确限制的任务。','应用','怎么做',[]],
 ['如果用户改变应用场景，如何调整提示词？','应用','如果',[]],
 ['如果资料过期，如何在回答中提醒用户？','应用','如果',[]]
];
const followText=[
 ['如果疾病表现发生变化，这两种方法更新知识的方式会有什么不同？','你把更新方式与适应条件联系起来了。其他同学还能补充哪些限制？'],
 ['先想一想：检索提供了什么？模型又如何使用这些材料？'],
 ['你刚才说要看依据，能解释一下怎样核对依据与结论吗？'],
 ['请回到“用于学习的样本”，举一个训练数据的例子。'],
 ['可以把知识库和操作界面分开想，知识库提供了什么判断依据？'],
 ['你提到了两个步骤，它们为什么要按这个顺序进行？'],
 ['试着解释参数改变后，模型的输出可能发生什么变化。'],
 ['角色描述和具体任务要求有什么关系？'],
 ['如果测试集混进训练数据，评价结果可能受到什么影响？'],
 ['能把输入、限制条件和输出要求分别说清楚吗？'],
 ['请全班比较两种处理方法，哪些证据能帮助我们做出选择？']
];
const questionStarts=seeds.map((_,i)=>i===0?1104:i===1?1930:i===2?2795:3200+(i-3)*195);
const assignments=seeds.map((_,i)=>i===0?[0,1,0]:[i%8,(i+1)%8]);
const questions=seeds.map(([text,bloom,mat,answers],i)=>{
 const id=`q${i+1}`,start=questionStarts[i]; const wait=[4.2,6,2,4,7,2,5,3,8][i%9];
 const turns=[{id:`${id}-prompt`,role:'teacher',start,end:start+5,text,kind:'question'}];let cursor=start+5+wait;
 const responseDurations=[8,18,4,12,22,3];
 const strategies=i===0?[['追问解释'],['引导反思']]:i<7?[['追问解释',...(i===1||i===3?['问题拆解']:[])]]:i<10?[['问题拆解']]:[['引导反思']];
 const feedback=i<18?feedbackLabels[i%5]:null;
 answers.forEach(([answer,level],j)=>{
  const duration=responseDurations[(i+j)%6];const turn={id:`${id}-answer-${j}`,role:'student',studentId:`student-${assignments[i][j%assignments[i].length]+1}`,start:cursor,end:cursor+duration,text:answer,level,kind:'answer'};
  turns.push(turn);cursor=turn.end+2;
  if(followText[i]?.[j]){const follow={id:`${id}-follow-${j}`,role:'teacher',kind:'followup',replyTo:turn.id,start:cursor,end:cursor+8,text:followText[i][j],strategies:strategies[j]||['引导反思']};turns.push(follow);cursor=follow.end+2;}
 });
 if(feedback){turns.push({id:`${id}-feedback`,role:'teacher',kind:'feedback',start:cursor,end:cursor+4,text:['好的。','你指出了回答中的关键依据。','请继续补充你的想法。','这处判断还需要核对依据。','你刚才提到的是这个关键点。'][i%5],feedback});cursor+=4;}
 return {id,start,end:Math.max(cursor,start+5),text,bloom,mat,turns,analysis:i===0?'问题要求比较两种方法。教师在回答后补充变化情境，引导学生解释更新方式与适应条件；可继续追问判断数据质量的依据。':`本问题以“${text}”组织课堂交流。${answers.length?'可结合下方学生原话和教师回应，观察是否形成与问题相关的解释。':'本示例未记录到学生对该问题的回应，可复核上下文，不能据此推定学生没有思考。'}`};
});
export const questionData={version:'1.0',duration:9000,answerStatus:'available',identityStatus:'available',followupStatus:'available',questions};
export function summarize(model){
 const qs=model.questions; const answerKnown=model.answerStatus==='available';const followKnown=model.followupStatus==='available';
 const allAnswers=answerKnown?qs.flatMap(q=>q.turns.filter(t=>t.kind==='answer')):[];
 const allFollow=followKnown?qs.flatMap(q=>q.turns.filter(t=>t.kind==='followup')):[];
 const allFeedback=qs.flatMap(q=>q.turns.filter(t=>t.kind==='feedback'));
 const waits=answerKnown?qs.flatMap(q=>{const first=q.turns.find(t=>t.kind==='answer');const prompt=q.turns[0];return first?[first.start-prompt.end]:[]}):[];
 return {questions:qs.length,answers:answerKnown?allAnswers.length:null,students:answerKnown&&model.identityStatus==='available'?new Set(allAnswers.filter(t=>t.studentId).map(t=>t.studentId)).size:null,responded:answerKnown?qs.filter(q=>q.turns.some(t=>t.kind==='answer')).length:null,
 bloom:bloomLabels.map(x=>qs.filter(q=>q.bloom===x).length),mat:matLabels.map(x=>qs.filter(q=>q.mat===x).length),
 levels:answerKnown?levelLabels.map(x=>allAnswers.filter(t=>t.level===x).length):null,
 waits:answerKnown?[waits.filter(t=>t<=3).length,waits.filter(t=>t>3&&t<=5).length,waits.filter(t=>t>5).length]:null,
 durations:answerKnown?[allAnswers.filter(t=>t.end-t.start<=5).length,allAnswers.filter(t=>t.end-t.start>5&&t.end-t.start<=15).length,allAnswers.filter(t=>t.end-t.start>15).length]:null,
 feedback:feedbackLabels.map(x=>allFeedback.filter(t=>t.feedback===x).length),followups:followKnown?allFollow.length:null,strategies:followKnown?strategyLabels.map(x=>allFollow.filter(t=>t.strategies.includes(x)).length):null};
}
