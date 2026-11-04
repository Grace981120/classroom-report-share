// Confirmed Demo layout. The authored page/ASR examples are not production analysis.
const durations=[4,5,7,6,8,8,10,16,12,9,7,6,4,3];
export function mountMultimedia181(root){
 // The behavior source module remains outside the confirmed teaching-method layout.
 for(const id of ['method-behavior']){
  const section=document.getElementById(id);
  if(section)section.hidden=true;
 }
 const sheet=document.createElement('link');sheet.rel='stylesheet';sheet.href=new URL('./method-multimedia-v181.css?v=20261028-wrap1',import.meta.url);document.head.append(sheet);
 root.dataset.multimediaVersion='1.8.1';
 const original=root.querySelector('.mm-grid');const grid=document.createElement('div');grid.className='mm181-grid';
 grid.append(original.firstElementChild);original.hidden=true;original.after(grid);
 grid.insertAdjacentHTML('beforeend',`<div><h3>课件页数 <button class="mm-help" data-mm="content" title="按原文件页号去重，回看同页不重复计数">?</button></h3><div class="mm181-value"><button data-mmx="pages" aria-label="课件14页，展示范围">14<small> 页</small></button></div></div><div><h3>课件页面停留</h3><div class="mm181-bars">${durations.map((d,i)=>`<button data-mmx="page${i+1}" title="第${i+1}页，停留${d}分钟" aria-label="第${i+1}页，停留${d}分钟" style="height:${d*8}px;${i===7?'background:#ffb743':''}"></button>`).join('')}</div><div class="mm181-axis">${durations.map((d,i)=>`<button data-mmx="page${i+1}" aria-label="第${i+1}页，停留${d}分钟">${i+1}</button>`).join('')}</div></div><div><h3>PPT依赖度 <button class="mm-help" data-mmx="dependency" title="结合看课件姿态、同期ASR与课件重合及扩展解释综合判断">?</button></h3><div class="mm181-value"><button data-mmx="dependency" aria-label="PPT依赖度68%，联合依据">68<small> %</small></button></div></div>`);
 const pageCard=grid.children[1],dependencyCard=grid.children[3];grid.insertBefore(dependencyCard,pageCard);grid.append(pageCard);
 root.querySelector('.attitude-insight p').textContent='课件配合视频演示；部分讲解同时呈现持续看课件与原文重合，需关注是否缺少补充解释。建议在长停留页增加脱离课件的举例或提问。';
 const pageHelp=grid.querySelector('[data-mm="content"]');delete pageHelp.dataset.mm;pageHelp.dataset.mmx='pages';pageHelp.setAttribute('aria-label','课件页数统计口径');
 const dialog=document.createElement('dialog');dialog.className='mm-dialog';dialog.setAttribute('aria-labelledby','mm181-title');root.append(dialog);let origin,scroll;
 const evidence=(time,who,text)=>`<p class="mm181-meta">${time} · ${who}</p><blockquote>${text}</blockquote>`;
 function open(button){origin=button;scroll=window.scrollY;const key=button.dataset.mmx;let title,body;
 if(key==='pages'){title='课件展示范围';body='<p>原文件18页，课堂展示第1—14页，未展示第15—18页。同页回看不新增页数。</p><p>逐页累计可见105分钟，包含回看及内嵌视频21分钟，不与视频播放时长相加。</p>';}
 else if(key==='dependency'){title='PPT依赖度 · 姿态与讲解依据';body='<p>结合持续看课件、同期ASR与页面内容重合，以及是否有补充解释、举例和问答。单纯看PPT或必要的术语复述不判为依赖；姿态不等于精确视线。</p><h3>联合分析口径</h3><table><tr><th>姿态、ASR与页面均可对齐的讲解范围</th><td>50分钟</td></tr><tr><th>双证据支持且缺少扩展解释的时长</th><td>34分钟</td></tr><tr><th>PPT依赖度</th><td>34 ÷ 50 = 68%</td></tr></table><p>按同期语义完整句与当时可见页比较，排除术语、定义的必要复述；持续看课件但在扩展解释的片段不计入依赖。重合度和持续时长阈值仍需样本校准。</p><p>原始姿态帧、ASR与课件对齐记录暂不可用，尚不能逐段复核该数值。</p>';}
 else{const n=Number(key.slice(4));title=`第${n}页 · 页面停留`;body=`<p>累计停留${durations[n-1]}分钟，按该页可见时段累计，含回看及内嵌视频，不等于连续讲授时长。</p>`;
 if(n===8)body+=evidence('42:10—48:00','教师','先检索指南，再把找到的证据和问题一起送给模型。')+evidence('48:12—49:00','学生','不是重新训练模型，是先找相关资料，再根据资料回答。')+'<p>课堂环节：流程讲解 → 视频拆解 → 学生复述。回应支持本片段理解，不代表全体学生掌握。</p>';
 else if(n===10)body+='<p>课件内容：敏感度 = TP/(TP+FN)；阳性预测值 = TP/(TP+FP)。</p>'+evidence('78:20—82:00','教师','下面看一个筛查结果，注意漏诊的代价。')+'<p>已有指标讲解，未定位到学生独立计算或解释分母的回应。</p>';
 else body+='<p>对应讲解与学生回应暂缺，不能仅凭停留时长判断使用是否合理。</p>';
 }
 dialog.innerHTML=`<header><h2 id="mm181-title">${title}</h2><button class="mm-close" aria-label="关闭">×</button></header><div>${body}${key==='dependency'?'':'<p class="mm181-meta">原始课件与对应视频暂不可用。</p>'}</div>`;
 dialog.querySelector('.mm-close').onclick=()=>dialog.close();dialog.showModal();dialog.querySelector('.mm-close').focus();
 }
 // Capture the new help control before the legacy generic help handler.
 root.addEventListener('click',e=>{const b=e.target.closest('[data-mmx]');if(b){e.stopImmediatePropagation();open(b);}},true);
 dialog.addEventListener('close',()=>{window.scrollTo({top:scroll,behavior:'instant'});origin?.focus({preventScroll:true});});
}
