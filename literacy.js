import {literacyData as data} from './literacy-data.js';
import {mountDimensionSummary} from './dimension-summary.js?v=20261019-jump5';
import {mountLiteracyIdeology} from './literacy-ideology.js?v=20261104-fit';

const escapeHTML = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const asset = name => `assets/figma/literacy-${name}.svg`;
const note = '<div class="dialog-note">本页保留设计稿中各维度重复的两条 00:01 示例记录，尚未接入课堂视频。以上建议用于演示分析方式；现有记录不代表已观察到学生的审辩、沟通或合作表现。</div>';

export function initLiteracy({openDialog}) {
  const root=document.querySelector('#literacy');
  root.innerHTML=`<section class="card attitude-summary"><div><h1>教学素养 <strong>${data.score}</strong><span class="tag">优秀</span></h1><p>${data.summary}</p></div></section>
    <section class="card section" id="literacy-analysis" aria-labelledby="literacy-analysis-title">
      <div class="section-heading"><h2 id="literacy-analysis-title">教学素养</h2></div>
      <div class="attitude-insight"><img src="${asset('ai')}" width="16" height="16" alt=""><p>${data.insight}</p></div>
      <div class="content-feature-grid">${data.sections.map(s=>`<article class="content-detail-card" id="literacy-${s.id}" aria-labelledby="literacy-${s.id}-title">
        <h3 id="literacy-${s.id}-title">${s.name}</h3><p class="literacy-card-summary">${s.summary}</p>
        <div class="content-examples">${s.examples.map((e,i)=>`<button class="content-example" data-literacy-example="${s.id}" data-example="${i}" aria-label="查看${s.name} ${e.time}课堂证据：${escapeHTML(e.text)}"><span class="content-time"><img src="${asset('clock')}" width="14" height="14" alt=""><time>${e.time}</time></span><span>${escapeHTML(e.text)}</span></button>`).join('')}</div>
      </article>`).join('')}</div>
    </section>
    <footer><span><span class="status-dot"></span>DEMO · 本页为人工智能课程素养示例</span><a class="text-button muted" href="#overview">返回报告总览 ↑</a></footer>`;
  mountDimensionSummary(root,'literacy',{openDialog});
  mountLiteracyIdeology(root,{openDialog});
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-literacy-example]');
    if(!button) return;
    const section=data.sections.find(s=>s.id===button.dataset.literacyExample);
    const record=section.examples[Number(button.dataset.example)];
    openDialog(`${section.name} · 课堂证据`,`<div class="content-evidence-time"><img src="${asset('clock')}" width="14" height="14" alt=""><time>${record.time}</time><span>课堂时间点</span></div><h3>课堂记录</h3><p>${escapeHTML(record.text)}</p><h3>分析与建议</h3><p>${section.summary}</p>${note}`,'教学素养 / '+section.name);
  });
}
