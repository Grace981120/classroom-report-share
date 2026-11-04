import {questionData,levelLabels} from './method-questions-data.js';
export const records={h0:2,h1:0,h2:10,p0:1,p1:3,p2:18};
export const findings={
h0:['医疗问答核验落到具体方法','理论联系实际','学生从“看依据”进一步说明权威资料逐项核对和病例适用条件，回答包含可执行的核验方法。','保留医疗问答任务，要求学生标注依据与适用条件。'],
h1:['追问推动方法比较','提问技能','教师补充疾病变化情境后，学生把规则更新、数据训练与适应条件联系起来，比较不止停留在列举差异。','保留情境追问，再要求学生说明数据质量的判断依据。'],
h2:['矛盾资料处理形成核验步骤','审辩思维','学生提出检查来源、日期与适用条件，并在无法判断时保留分歧，呈现有条件的判断。','保留相互矛盾的资料对照，要求学生明确哪些证据足以支持结论。'],
p0:['RAG回答未说明作用机制','提问技能','学生仅回答“它能先找到参考资料”。教师已追问资料如何使用，但该记录未呈现进一步解释，机制理解仍待核验。','给出检索资料与生成回答的对照，追问“哪一句依据支持哪一个结论”。'],
p1:['训练数据概念出现误解','学情监测','同一问题出现正确表述与“电脑运行的速度”这一误解。教师已引导举例，记录中尚未呈现纠正后的回答。','让学生区分训练样本与计算性能，再独立举出一个医疗训练数据例子。'],
p2:['模型推理缺少应答记录','学情监测','该提问记录只有教师问题，未记录学生应答；不能据此判断学生不理解，需要补充学习反馈。','用一次全班简答收集“输入—处理—输出”的解释，再抽取不同答案追问。']
};
export const actions={
h0:['课前：准备一段带错误引用的医疗回答。','课中：学生逐句标注依据、适用病例与不确定之处。','验证：检查学生能否指出引用与结论不匹配的位置。'],
h1:['课前：准备疾病表现变化的对照情境。','课中：要求比较两类方法的更新路径与限制条件。','验证：换一个情境，检查学生能否独立解释适应条件。'],
h2:['课前：提供来源、日期或适用条件不同的两份材料。','课中：学生提交取舍理由，无法判断时明确保留分歧。','验证：检查结论是否与所引用证据逐项对应。'],
p0:['课前：准备检索材料、生成回答与无依据句的对照。','课中：给学生思考时间，先解释对应关系，再由同伴补充。','验证：收集一条“依据—结论”说明，检查是否超出简单复述。'],
p1:['课前：准备训练样本、模型参数、运行速度三类例子。','课中：学生分类并解释理由；对误解先追问，再用反例澄清。','验证：课末用新医疗样本复测，记录仍混淆的学生答案。'],
p2:['课前：准备一个医疗模型输入与输出情境。','课中：全班提交简答，再抽取不同答案讨论推理过程。','验证：保留答案与反馈，区分未采集、未作答与概念错误。']
};
export const time=n=>`${String(Math.floor(n/3600)).padStart(2,'0')}:${String(Math.floor(n/60)%60).padStart(2,'0')}:${String(Math.floor(n%60)).padStart(2,'0')}`;
export function getQuestion(code){return questionData.questions[records[code]];}
const colors={question:'#4268e8',answer:'#36a675',followup:'#e545a8',feedback:'#edaa52'};
const labels={question:'教师提问',answer:'学生应答',followup:'教师追问',feedback:'教师评价'};
export function chartEvidence(code){const q=getQuestion(code),answers=q.turns.filter(t=>t.kind==='answer');const span=q.end-q.start;return `<div class="chart-proof"><section><h3>教学方法 · 问答时序</h3><svg viewBox="0 0 520 180" role="img" aria-label="${time(q.start)}至${time(q.end)}问答时序">${Object.keys(labels).map((kind,i)=>`<text x="0" y="${24+i*32}" fill="#536176" font-size="13">${labels[kind]}</text><line x1="85" x2="505" y1="${20+i*32}" y2="${20+i*32}" stroke="#edf0f6"/>${q.turns.filter(t=>t.kind===kind).map(t=>`<rect x="${85+(t.start-q.start)/span*420}" y="${12+i*32}" width="${Math.max(3,(t.end-t.start)/span*420)}" height="16" rx="3" fill="${colors[kind]}"><title>${time(t.start)} ${t.text}</title></rect>`).join('')}`).join('')}<text x="85" y="166" fill="#8490a0" font-size="12">${time(q.start)}</text><text x="505" y="166" text-anchor="end" fill="#8490a0" font-size="12">${time(q.end)}</text></svg></section><section><h3>教学效果 · 本问回答结构</h3>${answers.length?`<svg viewBox="0 0 340 180" role="img" aria-label="本问题${answers.length}条回答的结构分布">${levelLabels.map((l,i)=>{const n=answers.filter(a=>a.level===l).length;return `<text x="0" y="${24+i*30}" font-size="12" fill="#536176">${l}</text><rect x="108" y="${12+i*30}" width="180" height="14" rx="3" fill="#edf0f6"/><rect x="108" y="${12+i*30}" width="${n/answers.length*180}" height="14" rx="3" fill="#4268e8"/><text x="300" y="${24+i*30}" font-size="12" fill="#536176">${n}条</text>`}).join('')}</svg>`:'<div class="chart-missing">未记录学生应答<br><small>不计算回答结构，不判定未掌握</small></div>'}</section></div><section class="phase-evidence"><h3>教学内容 · 对应问答原句</h3>${q.turns.map(t=>`<div class="quote-record"><time>${time(t.start)}</time><span>${labels[t.kind]}</span><p>${t.text}</p></div>`).join('')}</section>`;}

const quoteList=q=>`<section class="phase-evidence"><h3>对应课堂原句</h3>${q.turns.map(t=>`<div class="quote-record"><time>${time(t.start)}</time><span>${labels[t.kind]}</span><p>${t.text}</p></div>`).join('')}</section>`;
const timeline=q=>{const span=q.end-q.start;return `<figure class="evidence-timeline"><figcaption>问答推进过程</figcaption>${q.turns.map(t=>`<div class="timeline-event" style="--start:${(t.start-q.start)/span*100}%;--width:${Math.max(5,(t.end-t.start)/span*100)}%;--event:${colors[t.kind]}"><span>${labels[t.kind]}</span></div>`).join('')}<div class="timeline-axis"><time>${time(q.start)}</time><time>${time(q.end)}</time></div></figure>`;};
const answerLevels=q=>{const answers=q.turns.filter(t=>t.kind==='answer');return answers.length?`<figure class="evidence-levels"><figcaption>学生回答的结构层次</figcaption>${levelLabels.map(label=>{const count=answers.filter(a=>a.level===label).length;return `<div><span>${label}</span><i><b style="width:${count/answers.length*100}%"></b></i><strong>${count}条</strong></div>`}).join('')}</figure>`:`<figure class="evidence-empty"><figcaption>学习反馈完整性</figcaption><strong>未记录学生应答</strong><p>当前只能确认教师提出了问题，暂不判断学生是否掌握。</p></figure>`;};
export function chartEvidenceV2(code){const q=getQuestion(code),answers=q.turns.filter(t=>t.kind==='answer');let visual='';
 if(code==='h0') visual=`<div class="evidence-grid"><figure class="evidence-check"><figcaption>回答中的核验依据</figcaption>${['权威资料','病例适用条件','专业人员复核'].map((x,i)=>`<div><i class="${i<2?'hit':'partial'}"></i><span>${x}</span><strong>${i<2?'已提及':'间接提及'}</strong></div>`).join('')}</figure>${answerLevels(q)}</div>`;
 if(code==='h1') visual=`<div class="evidence-grid">${timeline(q)}<figure class="evidence-chain"><figcaption>追问带来的认识推进</figcaption><div><span>比较两种方法</span><b>→</b><span>加入疾病变化情境</span><b>→</b><span>说明更新方式与限制</span></div></figure></div>`;
 if(code==='h2') visual=`<div class="evidence-grid"><figure class="evidence-steps"><figcaption>学生提出的判断步骤</figcaption>${['检查资料来源','核对资料日期','比较适用条件','证据不足时保留分歧'].map((x,i)=>`<div><i>${i+1}</i><span>${x}</span></div>`).join('')}</figure>${answerLevels(q)}</div>`;
 if(code==='p0') visual=`<div class="evidence-grid"><figure class="evidence-gap"><figcaption>回答完整度</figcaption><div><span class="done">检索作用</span><span>资料与回答的对应关系</span><span>可靠性提升机制</span></div><p>目前只说明了第一步，解释尚未形成完整链条。</p></figure><figure class="evidence-response"><figcaption>追问后的反馈情况</figcaption><div><strong>1</strong><span>教师追问</span></div><div class="missing"><strong>0</strong><span>追问后复答</span></div><p>教师已继续引导，现有记录未呈现学生进一步回答。</p></figure></div>`;
 if(code==='p1') visual=`<div class="evidence-grid"><figure class="evidence-compare"><figcaption>同一问题出现两种理解</figcaption><div><span>正确理解</span><strong>用于模型学习的样本</strong></div><div class="wrong"><span>概念混淆</span><strong>电脑运行的速度</strong></div></figure><figure class="evidence-loop"><figcaption>纠正闭环</figcaption><div><span class="done">发现误解</span><b>→</b><span class="done">教师提示</span><b>→</b><span>学生复答</span></div><p>复答缺失，尚不能确认误解已消除。</p></figure></div>`;
 if(code==='p2') visual=`<div class="evidence-grid"><figure class="evidence-feedback"><figcaption>本次提问反馈链</figcaption><div><span class="done">教师提问</span><b>→</b><span>学生应答</span><b>→</b><span>教师反馈</span></div><p>后两项均未记录，学习情况暂不可判定。</p></figure>${answerLevels(q)}</div>`;
 return visual+quoteList(q);
}
