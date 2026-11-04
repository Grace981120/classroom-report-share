import {mountRecordingProcess} from './recording-process.js?v=20261102-release';
import {mountRecordingAnomaly} from './recording-anomaly.js?v=20261102-anomaly2';
import {mountRecordingSmartGuide} from './recording-smart-guide.js?v=20261102-anomaly2';
import {mountRealRecording} from './recording-real.js?v=20261102-anomaly2';
import {recordingRealVersion} from './recording-real-version.js';
import {recordingData as data, recordingScore, transcriptIndex, recordingTime as time} from './recording-data.js';
import {attendanceTrace, playerTrack} from './recording-assets.js';

const asset = name => `assets/figma/recording-${name}.svg`;
const picture = name => `assets/figma/recording-${name}.${/^imgRectangle346777[013]$/.test(name)?'jpg':'png'}`;
const icon = (name, size=24) => `<img src="${asset(name)}" alt="" width="${size}" height="${size}">`;
const safe = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const storageKey = recordingRealVersion==='baseline'?'teaching-recording-evaluation-v1':'teaching-recording-evaluation-medical-20240910';

export function initRecording({openDialog,toast}) {
  const root = document.querySelector('#recording');
  let saved;
  try { saved=JSON.parse(localStorage.getItem(storageKey)||'null'); } catch { /* A fresh demo remains usable without storage. */ }
  let answers=data.questions.map((_,i)=>data.ratings.some(r=>r.value===saved?.answers?.[i])?saved.answers[i]:null);
  let submitted=Boolean(saved?.submitted && answers.every(v=>v!==null));
  let current=data.initialTime, playing=false, speed=1, captions=false, muted=false, activeTab='evaluation', lastTick=0;
  const a=data.attendance;
  root.innerHTML=`<div class="recording-layout">
    <div class="recording-main">
      <section class="card recording-video-card" aria-label="课堂实录播放器">
        <div class="recording-heading"><div><div class="recording-title"><h1>${data.title}</h1><span class="recording-tag">本</span><span class="recording-tag">已下课</span></div><p class="recording-meta"><span>授课老师：${data.teacher}</span><span>学院：${data.college}</span><span>教室：${data.classroom}</span><span>班级：${data.className}</span><span>时间：${data.date}</span></p></div><button class="recording-invite" data-rec-action="invite">${icon('img1',16)}邀请评价</button></div>
        <div class="recording-player" id="recording-player">
          <div class="recording-feeds"><figure class="recording-teacher"><img src="${picture('imgRectangle3467770')}" alt="教师全景：教师在教室内授课" width="858" height="452"><figcaption>教师全景</figcaption></figure><figure class="recording-students"><img src="${picture('imgRectangle3467773')}" alt="学生全景：学生听课画面" width="430" height="227"><figcaption>学生全景</figcaption></figure><figure class="recording-screen"><img src="${picture('imgRectangle3467771')}" alt="电脑画面：课堂演示文稿" width="430" height="225"><figcaption>电脑画面</figcaption></figure></div>
          <div class="recording-caption" hidden></div>
          <div class="recording-controls"><div class="recording-progress"><div class="recording-progress-art" aria-hidden="true">${playerTrack}</div><input id="recording-seek" aria-label="播放进度" type="range" min="0" max="${data.duration}" step="1" value="${current}"></div>
            <div class="recording-control-row"><div class="recording-control-left"><button data-rec-action="play" class="recording-control" aria-label="播放" title="播放 / 暂停">${icon('img4')}<span hidden>暂停</span></button><output id="recording-time">${time(current)} / ${time(data.duration)}</output></div>
              <div class="recording-control-right"><label class="recording-speed"><span class="sr-only">播放倍速</span><select aria-label="播放倍速"><option value="1">倍速</option><option value="0.5">0.5×</option><option value="1.25">1.25×</option><option value="1.5">1.5×</option><option value="2">2×</option></select></label><button data-rec-action="captions" class="recording-control" aria-label="开启字幕" title="字幕" aria-pressed="false">${icon('img5')}</button><button data-rec-action="mute" class="recording-control" aria-label="静音" title="音量" aria-pressed="false">${icon('imgIc')}</button><button data-rec-action="layout" class="recording-control" aria-label="切换为教师单画面" title="切换画面布局" aria-pressed="false">${icon('imgIc1')}</button><button data-rec-action="fit" class="recording-control" aria-label="完整显示画面" title="适应画面" aria-pressed="false">${icon('imgIc2')}</button><button data-rec-action="fullscreen" class="recording-control" aria-label="全屏播放" title="全屏">${icon('imgIc3')}</button></div>
            </div>
          </div>
        </div>
        <div class="recording-segments"><strong>片段</strong><button data-rec-action="segment" aria-pressed="true">${icon('img2',14)}${data.segment}</button></div>
      </section>
      <section class="card recording-stat-card" aria-label="课堂出勤概况"><div class="recording-stat-grid">${[['出勤/应到',`${a.present}/${a.expected}`,'人','11,194,218'],['出勤率',a.present/a.expected*100,'%','29,112,242'],['前排就座率',a.frontRow,'%','0,204,126'],['平均抬头率',a.headsUp,'%','29,166,245']].map(([label,value,unit,color])=>`<div class="recording-stat" style="--stat-rgb:${color}"><span>${label}</span><div><strong>${value}</strong><small>${unit}</small></div></div>`).join('')}</div><div class="recording-chart" tabindex="0" role="slider" aria-label="学生抬头率曲线，左右方向键调整查看时间" aria-valuemin="0" aria-valuemax="${data.duration}" aria-valuenow="${current}"><div class="recording-chart-art" aria-hidden="true">${attendanceTrace}</div><span class="recording-chart-position"></span><span class="recording-chart-hover" hidden></span><output class="recording-chart-tooltip" hidden></output></div><div class="recording-chart-axis"><span>00:00</span><span>10:00</span><span>20:00</span><span>30:00</span><span>40:00</span></div></section>
    </div>
    <aside class="card recording-sidebar" aria-label="课堂实录评价与转写"><div class="recording-sidebar-head"><div role="tablist" aria-label="实录侧栏"><button role="tab" id="recording-evaluation-tab" aria-controls="recording-evaluation" aria-selected="true" data-rec-tab="evaluation">量表评价</button><button role="tab" id="recording-transcript-tab" aria-controls="recording-transcript" aria-selected="false" tabindex="-1" data-rec-tab="transcript">语音转写</button></div><button class="recording-collapse" data-rec-action="collapse" aria-label="收起评价面板" aria-expanded="true" title="收起面板">${icon('img',20)}</button></div>
      <section id="recording-evaluation" class="recording-side-panel" role="tabpanel" aria-labelledby="recording-evaluation-tab"><form id="recording-evaluation-form" novalidate><div class="recording-form-scroll"><div class="recording-form-intro"><h2>课堂教学评价表</h2><p>请结合课堂实录完成以下评价。每项占 25 分，总分 100 分。</p></div>${data.questions.map((q,i)=>`${i===0||q.section!==data.questions[i-1].section?`<h3 class="recording-form-section">${q.section}</h3>`:''}<fieldset class="recording-question" data-question="${i}"><legend><span class="recording-required" aria-hidden="true">*</span>${i+1}、${q.text}</legend><div class="recording-rating-options">${data.ratings.map(r=>`<label><input type="radio" name="rating-${i}" value="${r.value}" required ${answers[i]===r.value?'checked':''}><span>${r.label}</span></label>`).join('')}</div><p class="recording-field-error" hidden>请选择此项评价</p></fieldset>`).join('')}</div><div class="recording-submit-bar"><div><span>总计：</span><output id="recording-score">0</output><span>分/100</span><small id="recording-completion"></small></div><button class="primary-button" type="submit">提交</button></div></form></section>
      <section id="recording-transcript" class="recording-side-panel" role="tabpanel" aria-labelledby="recording-transcript-tab" hidden><div class="recording-transcript-tools"><label><span class="sr-only">搜索转写内容</span><input type="search" placeholder="搜索转写内容" aria-label="搜索转写内容"></label></div><div class="recording-transcript-scroll"></div><div class="recording-transcript-footer"><span class="recording-transcript-count"></span><button class="text-button" data-rec-action="download">下载转写</button></div></section>
    </aside>
  </div>`;
  const $ = selector=>root.querySelector(selector);
  function persist() {
    try {localStorage.setItem(storageKey,JSON.stringify({answers,submitted}));return true;} catch {toast('浏览器暂不支持保存，评价仅在本次访问中保留');return false;}
  }
  function updateScore() {
    $('#recording-score').textContent=recordingScore(answers);
    $('#recording-completion').textContent=`已评 ${answers.filter(v=>v!==null).length}/${answers.length} 项`;
    $('.recording-submit-bar button').textContent=submitted?'更新评价':'提交';
  }
  function renderTranscript() {
    const query=$('input[type="search"]').value.trim();
    const rows=data.transcript.map((row,i)=>({...row,index:i})).filter(row=>`${row.speaker}${row.text}`.includes(query));
    $('.recording-transcript-scroll').innerHTML=rows.length?rows.map(row=>`<button class="recording-transcript-item ${row.index===transcriptIndex(current)?'active':''}" data-rec-time="${row.time}" data-transcript-index="${row.index}" ${row.index===transcriptIndex(current)?'aria-current="true"':''}><span><strong>${row.speaker}</strong><time>${time(row.time)}</time></span><p>${safe(row.text).split(safe(query)).join(query?`<mark>${safe(query)}</mark>`:'')}</p></button>`).join(''):'<p class="recording-empty">没有找到相关内容，请尝试其他关键词。</p>';
    $('.recording-transcript-count').textContent=`共 ${rows.length} 条转写`;
  }
  function updateTime(follow=false) {
    current=Math.min(data.duration,Math.max(0,current));
    const seconds=Math.floor(current),ratio=current/data.duration;
    $('#recording-seek').value=seconds;
    $('#recording-seek').setAttribute('aria-valuetext',`${time(seconds)}，总时长 ${time(data.duration)}`);
    $('#recording-time').textContent=`${time(seconds)} / ${time(data.duration)}`;
    const tracks=$('.recording-progress-art').querySelectorAll('path');
    const x=1288*ratio;
    tracks[0].setAttribute('d',`M0 0H${x}V3.75875H0Z`);
    tracks[1].setAttribute('d',`M${x} 0H1288V3.75875H${x}Z`);
    $('.recording-chart-position').style.left=`${ratio*100}%`;
    $('.recording-chart').setAttribute('aria-valuenow',seconds);
    $('.recording-chart').setAttribute('aria-valuetext',time(seconds));
    const active=transcriptIndex(current);
    $('.recording-caption').textContent=data.transcript[active].text;
    root.querySelectorAll('[data-transcript-index]').forEach(item=>{
      const selected=Number(item.dataset.transcriptIndex)===active;
      item.classList.toggle('active',selected);
      if(selected)item.setAttribute('aria-current','true');else item.removeAttribute('aria-current');
    });
    if(follow&&activeTab==='transcript'&&$('.recording-follow input').checked) {
      const row=$('.recording-transcript-item.active'),scroll=$('.recording-transcript-scroll');
      if(row)scroll.scrollTop=row.offsetTop-12;
    }
  }
  function pause() {
    playing=false;
    const button=$('[data-rec-action="play"]');
    button.setAttribute('aria-label','播放');button.querySelector('img').hidden=false;button.querySelector('span').hidden=true;
  }
  function seek(seconds) {current=seconds;updateTime(true);if(current>=data.duration)pause();}
  function switchTab(tab) {
    activeTab=tab;
    root.querySelectorAll('[data-rec-tab]').forEach(button=>{const active=button.dataset.recTab===tab;button.setAttribute('aria-selected',active);button.tabIndex=active?0:-1;});
    $('#recording-evaluation').hidden=tab!=='evaluation';$('#recording-transcript').hidden=tab!=='transcript';
    if(tab==='transcript')updateTime(true);
  }
  root.addEventListener('click',async event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.dataset.recTab){switchTab(button.dataset.recTab);return;}
    if(button.dataset.recTime!==undefined){seek(Number(button.dataset.recTime));return;}
    switch(button.dataset.recAction) {
      case 'play': if(playing){pause();break;}if(current>=data.duration)current=0;playing=true;lastTick=performance.now();button.setAttribute('aria-label','暂停');button.querySelector('img').hidden=true;button.querySelector('span').hidden=false;break;
      case 'segment':seek(0);toast('已定位到片段开始');break;
      case 'captions':captions=!captions;$('.recording-caption').hidden=!captions;button.setAttribute('aria-pressed',captions);button.setAttribute('aria-label',captions?'关闭字幕':'开启字幕');break;
      case 'mute':muted=!muted;button.setAttribute('aria-pressed',muted);button.setAttribute('aria-label',muted?'取消静音':'静音');button.classList.toggle('is-muted',muted);break;
      case 'layout':{const single=$('.recording-feeds').classList.toggle('single');button.setAttribute('aria-pressed',single);button.setAttribute('aria-label',single?'切换为三路画面':'切换为教师单画面');break;}
      case 'fit':{const contain=$('.recording-feeds').classList.toggle('contain');button.setAttribute('aria-pressed',contain);button.setAttribute('aria-label',contain?'填充显示画面':'完整显示画面');break;}
      case 'fullscreen':try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#recording-player').requestFullscreen();}catch{toast('当前浏览器不支持全屏，可使用浏览器全屏查看');}break;
      case 'collapse':{const collapsed=$('.recording-layout').classList.toggle('sidebar-collapsed');button.setAttribute('aria-expanded',!collapsed);button.setAttribute('aria-label',collapsed?'展开评价面板':'收起评价面板');button.title=collapsed?'展开面板':'收起面板';break;}
      case 'invite':{const url=new URL(location.href);url.hash='recording';openDialog('邀请评价',`<p>复制课堂实录链接，邀请同事查看课堂并完成评价。</p><label class="field">课堂实录链接<input class="recording-share-input" readonly value="${safe(url.href)}" aria-label="课堂实录链接"></label><div class="dialog-note">访问线上课堂实录需输入访问密码。</div><div class="dialog-actions"><button class="secondary-button" data-action="close">关闭</button><button class="primary-button" id="recording-copy-link">复制链接</button></div>`,'课堂实录 / 邀请评价');document.querySelector('#recording-copy-link').onclick=async()=>{try{await navigator.clipboard.writeText(url.href);toast('课堂实录链接已复制');}catch{document.querySelector('.recording-share-input').select();toast('请手动复制已选中的链接');}};break;}
      case 'download':{const content=data.transcript.map(row=>`[${time(row.time)}] ${row.speaker}\n${row.text}`).join('\n\n');const url=URL.createObjectURL(new Blob([`${data.title} · 语音转写\n\n${content}`],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='课堂实录-语音转写.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('转写文本已下载');break;}
    }
  });
  $('#recording-seek').addEventListener('input',event=>seek(Number(event.target.value)));
  $('.recording-speed select').addEventListener('change',event=>{speed=Number(event.target.value);});
  $('input[type="search"]').addEventListener('input',renderTranscript);
  $('[role="tablist"]').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();switchTab(event.key==='Home'?'evaluation':event.key==='End'?'transcript':activeTab==='evaluation'?'transcript':'evaluation');$(`[data-rec-tab="${activeTab}"]`).focus();});
  $('#recording-evaluation-form').addEventListener('change',event=>{if(event.target.type!=='radio')return;const index=Number(event.target.name.split('-')[1]);answers[index]=Number(event.target.value);submitted=false;const field=$(`[data-question="${index}"]`);field.classList.remove('invalid');field.querySelector('.recording-field-error').hidden=true;field.querySelectorAll('input').forEach(input=>input.removeAttribute('aria-invalid'));updateScore();persist();});
  $('#recording-evaluation-form').addEventListener('submit',event=>{event.preventDefault();const missing=answers.findIndex(value=>value===null);root.querySelectorAll('.recording-question').forEach((field,i)=>{const invalid=answers[i]===null;field.classList.toggle('invalid',invalid);field.querySelector('.recording-field-error').hidden=!invalid;field.querySelectorAll('input').forEach(input=>input.setAttribute('aria-invalid',invalid));});if(missing!==-1){$(`[name="rating-${missing}"]`).focus();toast('请完成全部必填评价后提交');return;}submitted=true;const stored=persist();updateScore();if(stored)toast(`评价已保存，总分 ${recordingScore(answers)} 分`);});
  const chart=$('.recording-chart');
  let tracePoints;
  function hoverChart(ratio){
    ratio=Math.max(0,Math.min(1,ratio));
    const seconds=Math.round(ratio*data.duration);
    if(!tracePoints){const path=chart.querySelector('path[stroke]');tracePoints=[];if(path){const length=path.getTotalLength();for(let i=0;i<=length;i+=2)tracePoints.push(path.getPointAtLength(i));}}
    const point=tracePoints?.reduce((best,p)=>!best||Math.abs(p.x-ratio*1286.22)<Math.abs(best.x-ratio*1286.22)?p:best,null);
    const intensity=point?Math.round(Math.max(0,Math.min(100,(48.5-point.y)/48*100))):null;
    $('.recording-chart-hover').hidden=false;$('.recording-chart-hover').style.left=`${ratio*100}%`;
    const tooltip=$('.recording-chart-tooltip');tooltip.hidden=false;tooltip.textContent=`${time(seconds)} · ${intensity===null?'学生抬头率：暂无数据':`学生抬头率 ${intensity}%`}`;tooltip.style.left=`${Math.max(15,Math.min(85,ratio*100))}%`;
  }
  chart.addEventListener('pointermove',event=>{const box=chart.getBoundingClientRect();hoverChart((event.clientX-box.left)/box.width);});
  chart.addEventListener('pointerleave',()=>{$('.recording-chart-hover').hidden=true;$('.recording-chart-tooltip').hidden=true;});
  chart.addEventListener('click',event=>{const box=chart.getBoundingClientRect();seek((event.clientX-box.left)/box.width*data.duration);});
  chart.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();seek(event.key==='Home'?0:event.key==='End'?data.duration:current+(event.key==='ArrowRight'?10:-10));hoverChart(current/data.duration);});
  setInterval(()=>{if(!playing)return;if(root.hidden||document.hidden){pause();return;}const now=performance.now();current+=(now-lastTick)/1000*speed;lastTick=now;updateTime(true);if(current>=data.duration)pause();},250);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
  new MutationObserver(()=>{if(root.hidden)pause();}).observe(root,{attributes:true,attributeFilter:['hidden']});
  renderTranscript();updateScore();updateTime();
  mountRecordingProcess();
  mountRecordingAnomaly(root,{openDialog,seek});
  mountRecordingSmartGuide(root);
  mountRealRecording(root, {toast});
}
