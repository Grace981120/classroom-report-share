// Authored demonstration data. Not a production classifier or an internal reference standard.
export const interactionEvents=[
 {id:'i1',start:1450,end:1516,title:'检索结果不一致时，应该相信哪一个？',active:true,response:true,continued:true,uncertain:false,reason:'学生从资料冲突主动发问，随后解释判断依据，同伴进一步补充适用范围，形成围绕同一问题的连续交流。',turns:[
 ['i1-1',1450,'学生1','老师，如果检索到的两份资料说法不一样，我们应该相信哪一个？','主动发起：学生提出资料冲突情境，拓展当前讲解。'],
 ['i1-2',1464,'教师','你会先比较资料的哪些信息？其他同学也可以补充。','教师回应：邀请说明判断依据，并开放同伴补充。'],
 ['i1-3',1475,'学生1','我会先看出处和发表时间，还要看它引用了哪些证据。','积极回应：给出具体判断依据。'],
 ['i1-4',1488,'学生2','也要看是不是适用于现在这个场景，不能只看哪个更新。','互动延续：同伴补充适用情境，推进原问题。'],
 ['i1-5',1503,'教师','我们把来源、证据和适用范围列出来，再比较两份资料。','教师归纳：将不同观点整理为核对步骤。']]},
 {id:'i2',start:2495,end:2550,title:'医院训练数据不同，会不会影响模型对患者的判断？',active:true,response:true,continued:false,uncertain:false,reason:'学生将模型偏差主动联系到不同医院的数据，并说明设备差异这一具体原因；当前片段未见同伴加入或进一步追问。',turns:[
 ['i2-1',2495,'学生3','老师，不同医院训练数据不一样，会不会影响模型对患者的判断？','主动发起：从当前概念拓展到医疗应用。'],['i2-2',2509,'教师','你认为哪些差异可能影响结果？','教师邀请具体解释。'],['i2-3',2523,'学生3','比如设备不一样，图像特点可能不同，模型未必能直接适应。','积极回应：提出设备差异与模型适应之间的联系。'],['i2-4',2541,'教师','对，应用前需要检查训练数据与使用场景的差异。','教师归纳适用边界。']]},
 {id:'i3',start:3920,end:3990,title:'同学之间继续比较评价模型的不同依据',active:false,response:true,continued:true,uncertain:false,reason:'本片段由教师邀请发言，学生给出理由，同伴补充漏判风险并继续比较；属于积极回应与互动延续，不计学生主动发起。',turns:[
 ['i3-1',3920,'教师','除了准确率，还应该怎样判断这个模型是否适用？','教师发起讨论。'],['i3-2',3934,'学生4','还要看误判会造成多大影响，不能只看总体正确的比例。','积极回应：给出评价依据。'],['i3-3',3948,'学生5','医疗场景里漏掉高风险患者的代价可能更大。','互动延续：同伴补充具体应用风险。'],['i3-4',3962,'学生4','那我们还要分别比较漏判和误判，而不是合成一个分数。','互动延续：根据同伴补充推进判断。'],['i3-5',3978,'教师','可以，把两类错误分别列出来再讨论。','教师组织后续比较。']]},
 {id:'i4',start:4720,end:4755,title:'教师布置讨论任务，后续回应记录待核对',active:false,response:false,continued:false,uncertain:true,reason:'现有片段保留教师任务，后续学生语音不完整，无法判断是否回应或继续讨论，不据此判定互动消极。',turns:[['i4-1',4720,'教师','请大家讨论这个方案在哪些情况下可能失效。','后续学生语音不完整，需结合完整课堂核对。']]}
];
export const codingLabels=['接纳情感','表扬或鼓励','接纳或利用学生观点','提问','讲授','给予指示','批评或维护权威','学生应答','学生主动发言','沉默或混乱'];
// Consecutive three-second coded units, an independently authored speech-structure sample.
export const codingSequence=[5,5,5,5,4,8,8,8,3,5,5,4,8,8,2,5,5,6,6,5,4,8,8,8,9,9,3,5,5,5,5,5,4,8,8,2,5,5,6,5,4,8,8,9,9,9,3,5,5,5,5,5,5,6,5,4,8,8,2,10];
export const codingStart=1440;
export const flandersReference=[.95,.85,.87,.8,.68]; // Display proportions only; not official benchmarks.
export const axisLabels=['启发／指导比','学生稳态比','教学内容比','学生发言比','教师提问比'];
export function calculateFlanders(sequence=codingSequence){
 const counts=Array(10).fill(0);sequence.forEach(c=>{if(!Number.isInteger(c)||c<1||c>10)throw Error('Invalid code');counts[c-1]++;});
 const sum=(a,b)=>counts.slice(a-1,b).reduce((s,n)=>s+n,0),total=sequence.length,teachers=sum(1,7),speech=sum(1,9),direct=sum(5,7);let studentPairs=0,stablePairs=0;
 for(let i=0;i<sequence.length-1;i++)if(sequence[i]===8||sequence[i]===9){studentPairs++;if(sequence[i+1]===8||sequence[i+1]===9)stablePairs++;}
 const ratio=(a,b)=>b?a/b:null;
 const values=[ratio(sum(1,4),direct),ratio(stablePairs,studentPairs),ratio(sum(4,5),speech),ratio(sum(8,9),total),ratio(counts[3],teachers)];
 return {counts,total,values,normalized:values.map((v,i)=>v===null?null:Math.min(1,v/(i===0?2:1))),fractions:[`${sum(1,4)} / ${direct}`,`${stablePairs} / ${studentPairs}`,`${sum(4,5)} / ${speech}`,`${sum(8,9)} / ${total}`,`${counts[3]} / ${teachers}`]};
}
export const interactionModel={events:interactionEvents,eventStatus:'available',sequence:codingSequence,codingStatus:'available',reference:flandersReference};
