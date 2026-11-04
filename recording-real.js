import {recordingRealVersion} from './recording-real-version.js';
import {realVideos,realKnowledge} from './recording-real-data.js';
import {recordingTranscript} from './recording-transcript-data.js';

export function mountRealRecording(root,{toast}) {
  if(recordingRealVersion==='baseline')return;
  root.classList.add('real-recording');
  root.classList.add('real-video-pending');
  const screenshotMode=recordingRealVersion==='screenshots-1.0';
  const $=s=>root.querySelector(s), fmt=t=>{t=Math.floor(t||0);return `${String(Math.floor(t/60)).padStart(2,'0')}:${String(t%60).padStart(2,'0')}`;};
  const link=document.createElement('link');link.rel='stylesheet';link.href='./recording-real.css';document.head.append(link);
  let selected=1,activeTab='evaluation',pendingTime=0;
  const video=document.createElement('video');video.id='real-classroom-video';video.preload='metadata';video.playsInline=true;video.setAttribute('aria-label','智慧医疗创新体验课堂录像');
  $('.recording-teacher').append(video);
  $('.recording-teacher figcaption').textContent='教师全景';
  const absent=document.createElement('span');absent.className='real-feed-empty';absent.textContent='学生画面加载中';$('.recording-students').append(absent);
  const student=document.createElement('video');student.id='real-student-video';student.preload='metadata';student.muted=true;student.defaultMuted=true;student.playsInline=true;student.setAttribute('aria-label','学生全景');$('.recording-students').append(student);
  function alignStudent(force=false){
    if(student.readyState<1)return;
    const target=Math.min(video.currentTime,student.duration);
    if(force||Math.abs(student.currentTime-target)>.2)student.currentTime=target;
    student.playbackRate=video.playbackRate;
  }
  async function playStudent(){
    if(student.readyState<1||video.paused||video.seeking)return;
    alignStudent();
    if(student.currentTime>=student.duration)return;
    try{await student.play();}catch{absent.hidden=false;absent.textContent='学生画面播放未成功';}
  }
  student.addEventListener('loadedmetadata',()=>alignStudent(true));
  student.addEventListener('loadeddata',()=>{absent.hidden=true;playStudent();});
  student.addEventListener('error',()=>{absent.hidden=false;absent.textContent='学生画面加载失败';});
  video.addEventListener('playing',playStudent);
  for(const event of ['pause','waiting','ended'])video.addEventListener(event,()=>student.pause());
  video.addEventListener('seeking',()=>{student.pause();alignStudent(true);});
  video.addEventListener('seeked',()=>{alignStudent(true);playStudent();});
  video.addEventListener('timeupdate',()=>alignStudent());
  video.addEventListener('ratechange',()=>{student.playbackRate=video.playbackRate;});
  const screen=document.createElement('canvas');screen.width=840;screen.height=490;screen.setAttribute('aria-label','导播画面中屏幕区域的同步局部放大');$('.recording-screen').append(screen);
  $('.recording-screen figcaption').textContent='电脑画面';
  const context=screen.getContext('2d');
  function drawScreen(){if(video.readyState>=2)context.drawImage(video,460,420,840,490,0,0,840,490);}
  if(video.requestVideoFrameCallback){const frame=()=>{drawScreen();video.requestVideoFrameCallback(frame);};video.requestVideoFrameCallback(frame);}
  else video.addEventListener('timeupdate',drawScreen);
  video.addEventListener('seeked',drawScreen);
  video.addEventListener('loadeddata',drawScreen);
  video.addEventListener('emptied',()=>context.clearRect(0,0,840,490));
  $('.recording-title h1').textContent='智慧医疗创新体验';
  $('.recording-meta').innerHTML='<span>授课老师：周晋</span><span>日期：2024-09-10</span><span>导播画面</span>';
  const tabs=$('[role=tablist]');
  const tab=document.createElement('button');tab.type='button';tab.id='recording-knowledge-tab';tab.dataset.realTab='knowledge';tab.setAttribute('role','tab');tab.setAttribute('aria-controls','recording-knowledge');tab.setAttribute('aria-selected','false');tab.tabIndex=-1;tab.textContent='PPT摘要';tabs.append(tab);
  const panel=document.createElement('section');panel.id='recording-knowledge';panel.className='recording-side-panel';panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panel.hidden=true;
  panel.innerHTML='<div class="real-knowledge-tools"><label><input type="search" class="real-search" aria-label="搜索知识点" placeholder="搜索知识点"></label></div><div class="real-knowledge-list"></div>';
  $('.recording-sidebar').append(panel);
  const transcriptPanel=$('#recording-transcript');
  transcriptPanel.innerHTML='<div class="recording-transcript-tools"><label><span class="sr-only">搜索转写内容</span><input type="search" class="real-transcript-search" placeholder="搜索转写内容" aria-label="搜索转写内容"></label></div><div class="recording-transcript-scroll real-transcript-scroll"></div><div class="recording-transcript-footer"><span class="recording-transcript-count"></span><button class="text-button" data-rec-action="download">下载转写</button></div>';
  // Attendance placeholder removed per confirmed layout.
  const picker=document.createElement('span');picker.className='real-segment-picker';picker.innerHTML=realVideos.map(v=>`<button type="button" data-real-video="${v.id}" aria-pressed="${v.id===1}">${v.title} · ${v.start}</button>`).join('');$('.recording-segments').append(picker);
  const summary=document.createElement('section');summary.className='real-classroom-summary';summary.innerHTML='<div class="real-summary-tabs"><button type="button" class="active" data-summary-filter="all">全部</button><button type="button" data-summary-filter="ppt">PPT</button><button type="button" data-summary-filter="video">视频</button><button type="button" data-summary-filter="desktop">电脑桌面</button></div><div class="real-summary-timeline"></div>';
  panel.innerHTML='';panel.append(summary);
  const summaryNodes=[
    {kind:'ppt',time:1440,title:'人文社科类人才',desc:'介绍智慧医疗中人文社科类人才的职责与价值，教师结合案例进行讲解。',duration:'2分36秒',image:'assets/recording-screen-20260912/slide-1440.jpg'},
    {kind:'video',time:2219,title:'便携式超声机案例视频',desc:'播放便携式超声机案例，说明人工智能辅助诊断的应用场景。',duration:'1分46秒',image:'assets/recording-screen-20260912/screen-2400.jpg'},
    {kind:'desktop',time:2520,title:'切换并打开课堂案例材料',desc:'教师切换桌面窗口并打开案例材料，继续讲解案例内容。',duration:'38秒',image:'assets/recording-screen-20260912/screen-2520.jpg'}
  ];
  const summaryFmt=fmt;
  function renderSummary(filter='all'){
    summary.querySelector('.real-summary-timeline').innerHTML=summaryNodes.filter(n=>filter==='all'||n.kind===filter).map(n=>`<article class="real-summary-node ${n.kind}"><time>${summaryFmt(n.time)}</time><span class="real-summary-dot"></span><img src="${n.image}" alt="${n.title}代表画面"><div class="real-summary-copy"><span class="real-summary-label">${n.kind==='ppt'?'PPT':n.kind==='video'?'视频':'电脑桌面'}</span><h3>${n.title}</h3><p>${n.desc}</p><small>持续 ${n.duration}</small><button type="button" class="real-summary-jump" data-real-seek="${n.time}">定位原视频</button></div></article>`).join('');
  }
  renderSummary();
  summary.addEventListener('click',e=>{const tab=e.target.closest('[data-summary-filter]');if(!tab)return;summary.querySelectorAll('[data-summary-filter]').forEach(b=>b.classList.toggle('active',b===tab));renderSummary(tab.dataset.summaryFilter);});
  const feedback=document.createElement('div');feedback.className='real-playback-status';feedback.setAttribute('role','status');feedback.hidden=true;$('.recording-player').append(feedback);
  function status(text=''){feedback.textContent=text;feedback.hidden=!text;}
  let hls;
  function loadRemoteVideo(time=0,autoplay=false){
    const source='./assets/recording-video/master.m3u8';
    const start=()=>{video.currentTime=time;video.load();};
    if(video.canPlayType('application/vnd.apple.mpegurl')){video.src=source;start();return;}
    const resume=()=>{if(autoplay)video.play().catch(()=>status('视频已加载，请点击播放'));};
    const attach=()=>{hls=new window.Hls({enableWorker:true});hls.loadSource(source);hls.attachMedia(video);hls.on(window.Hls.Events.MANIFEST_PARSED,()=>{video.currentTime=time;resume();});hls.on(window.Hls.Events.ERROR,(_event,data)=>{if(data.fatal)useStaticPreview();});};
    if(window.Hls){attach();return;}
    const script=document.createElement('script');script.src='https://cdn.jsdelivr.net/npm/hls.js@1.5.20/dist/hls.min.js';script.onload=attach;script.onerror=useStaticPreview;document.head.append(script);
  }
  function useStaticPreview(){
    root.classList.add('real-video-unavailable');
    video.hidden=true;
    student.hidden=true;
    screen.hidden=true;
    absent.hidden=true;
    status();
  }
  function renderTranscript(){const query=$('.real-transcript-search').value.trim();const current=video.currentTime||0;const rows=recordingTranscript.filter(row=>`${row.speaker}${row.text}`.includes(query));$('.real-transcript-scroll').innerHTML=rows.length?rows.map(row=>`<button type="button" class="recording-transcript-item ${current>=row.time&&(recordingTranscript[recordingTranscript.indexOf(row)+1]?.time??Infinity)>current?'active':''}" data-real-seek="${row.time}"><span><strong>${row.speaker}</strong><time>${fmt(row.time)}</time></span><p>${row.text}</p></button>`).join(''):'<p class="recording-empty">没有找到相关内容，请尝试其他关键词。</p>';$('.recording-transcript-count').textContent=`共 ${rows.length} 条转写`;}
  function render(){if($('.real-search')){const q=$('.real-search').value.trim();const entries=realKnowledge.filter(k=>k.video===selected&&k.title.includes(q));$('.real-knowledge-list').innerHTML=entries.length?entries.map(k=>`<button type="button" class="real-knowledge-item" data-real-seek="${k.time}"><img src="${k.image}" alt="${k.title}课件截图"><span class="real-ppt-copy"><strong>${k.title}</strong><span class="real-ppt-meta"><time>${fmt(k.time)}</time>${Number.isFinite(k.dwellSeconds)?`<span>停留 ${Math.floor(k.dwellSeconds/60)}分${k.dwellSeconds%60?`${k.dwellSeconds%60}秒`:""}</span>`:""}${k.hasBoard===true?'<span class="real-ppt-board">板书</span>':""}</span></span></button>`).join(''):'<p class="recording-empty">没有匹配的知识点</p>';}renderTranscript();sync();}
  function sync(){const duration=Number.isFinite(video.duration)?video.duration:realVideos[selected-1].duration;const t=video.currentTime||0;$('#recording-seek').max=duration;$('#recording-seek').value=t;$('#recording-seek').setAttribute('aria-valuetext',`${fmt(t)}，总时长 ${fmt(duration)}`);$('#recording-time').textContent=`${fmt(t)} / ${fmt(duration)}`;const paths=$('.recording-progress-art').querySelectorAll('path');const x=1288*t/duration;paths[0].setAttribute('d',`M0 0H${x}V3.75875H0Z`);paths[1].setAttribute('d',`M${x} 0H1288V3.75875H${x}Z`);const play=$('[data-rec-action=play]');play.setAttribute('aria-label',video.paused?'播放':'暂停');play.querySelector('img').hidden=!video.paused;play.querySelector('span').hidden=video.paused;const matches=[...root.querySelectorAll('[data-real-seek]')];const current=matches.find(n=>Math.abs(Number(n.dataset.realSeek)-t)<2);matches.forEach(n=>{n.classList.toggle('active',n===current);if(n===current)n.setAttribute('aria-current','true');else n.removeAttribute('aria-current');});}
  let mediaLoaded=false;
  function select(id,time=0){video.pause();student.pause();if(hls){hls.destroy();hls=undefined;}selected=id;pendingTime=time;mediaLoaded=false;root.classList.add('real-video-pending');status();root.querySelectorAll('[data-real-video]').forEach(b=>b.setAttribute('aria-pressed',Number(b.dataset.realVideo)===id));render();}
  function showScreenshot(t){
    const entry=realKnowledge.filter(k=>k.video===selected&&k.time<=t).at(-1);
    const img=$('.recording-screen>img');
    img.hidden=!entry;
    if(entry){img.src=entry.image;img.alt=`电脑画面原帧：${entry.title} · ${fmt(entry.time)}`;}
    $('#recording-time').textContent=`${fmt(t)} / ${fmt(realVideos[selected-1].duration)}`;
    $('#recording-seek').value=t;
    panel.querySelectorAll('[data-real-seek]').forEach(el=>el.classList.toggle('active',entry&&Number(el.dataset.realSeek)===entry.time));
  }
  function seek(t){if(video.readyState<1){pendingTime=t;if(screenshotMode)showScreenshot(t);return;}video.currentTime=Math.max(0,Math.min(video.duration,t));sync();}
  function switchTab(name){activeTab=name;tabs.querySelectorAll('[role=tab]').forEach(b=>{const yes=(b.dataset.realTab||b.dataset.recTab)===name;b.setAttribute('aria-selected',yes);b.tabIndex=yes?0:-1;});$('#recording-evaluation').hidden=name!=='evaluation';$('#recording-transcript').hidden=name!=='transcript';panel.hidden=name!=='knowledge';}
  // Capture only playback/tab events so the original demo clock cannot simulate playback.
  root.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;const ds=b.dataset;
    if(ds.recTab||ds.realTab){e.stopImmediatePropagation();switchTab(ds.realTab||ds.recTab);return;}
    if(ds.realVideo){e.stopImmediatePropagation();select(Number(ds.realVideo));return;}
    if(ds.realSeek){e.stopImmediatePropagation();seek(Number(ds.realSeek));return;}
    if(!['play','mute','fit','layout','captions','segment','download'].includes(ds.recAction))return;
    e.stopImmediatePropagation();
    if(ds.recAction==='play'){
      if(screenshotMode){toast('当前展示真实课堂截图，请在PPT中选择电脑画面');return;}
      if(!mediaLoaded){mediaLoaded=true;root.classList.remove('real-video-pending');loadRemoteVideo(pendingTime,true);status('正在加载原课堂录像…');return;}
      if(root.classList.contains('real-video-unavailable')){toast('当前为课堂画面预览');return;}
      if(!video.paused)video.pause();else try{await video.play();status();}catch{useStaticPreview();toast('当前为课堂画面预览');}
    }
    if(ds.recAction==='mute'){video.muted=!video.muted;b.classList.toggle('is-muted',video.muted);b.setAttribute('aria-pressed',video.muted);b.setAttribute('aria-label',video.muted?'取消静音':'静音');}
    if(ds.recAction==='fit'){const contain=$('.recording-feeds').classList.toggle('contain');b.setAttribute('aria-pressed',contain);b.setAttribute('aria-label',contain?'填充显示画面':'完整显示画面');}
    if(ds.recAction==='layout'){const single=$('.recording-feeds').classList.toggle('single');b.setAttribute('aria-pressed',single);b.setAttribute('aria-label',single?'切换为三分屏':'切换为导播单画面');}
    if(ds.recAction==='captions')toast('当前录像未提供字幕轨道，请查看右侧语音转写');
    if(ds.recAction==='download'){const content=recordingTranscript.map(row=>`[${fmt(row.time)}] ${row.speaker}\n${row.text}`).join('\n\n');const url=URL.createObjectURL(new Blob([`智慧医疗创新体验 · 语音转写\n\n${content}`],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='智慧医疗创新体验-语音转写.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('转写文本已下载');}
  },true);
  root.addEventListener('input',e=>{if(e.target.id==='recording-seek'){e.stopImmediatePropagation();seek(Number(e.target.value));}if(e.target.matches('.real-search')){e.stopImmediatePropagation();render();}if(e.target.matches('.real-transcript-search')){e.stopImmediatePropagation();renderTranscript();}},true);
  root.addEventListener('change',e=>{if(e.target.matches('.recording-speed select')){e.stopImmediatePropagation();video.playbackRate=Number(e.target.value);}},true);
  tabs.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();e.stopImmediatePropagation();const names=['evaluation','transcript','knowledge'];const i=names.indexOf(activeTab);switchTab(e.key==='Home'?names[0]:e.key==='End'?names[2]:names[(i+(e.key==='ArrowRight'?1:2))%3]);tabs.querySelector('[aria-selected=true]').focus();},true);
  video.addEventListener('loadedmetadata',()=>{video.playbackRate=Number($('.recording-speed select').value);seek(pendingTime);pendingTime=0;sync();});
  for(const event of ['timeupdate','play','pause','ended','seeked'])video.addEventListener(event,()=>{sync();if(activeTab==='transcript')renderTranscript();});
  video.addEventListener('error',useStaticPreview);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)video.pause();});
  new MutationObserver(()=>{if(root.hidden)video.pause();}).observe(root,{attributes:true,attributeFilter:['hidden']});
  select(1);
  if(screenshotMode){
    useStaticPreview();
    $('.recording-teacher>img').src='assets/recording-screen-20260912/teacher-1440.jpg';
    $('.recording-teacher>img').alt='教师全景原帧 · 24:00';
    $('.recording-students>img').src='assets/recording-screen-20260912/student-1440.jpg';
    $('.recording-students>img').alt='学生全景原帧 · 24:00';
    $('.recording-teacher figcaption').textContent='教师全景 · 24:00';
    $('.recording-students figcaption').textContent='学生全景 · 24:00';
    $('[data-rec-action=play]').setAttribute('aria-label','课堂截图预览');
    seek(1440);switchTab('knowledge');
  }
}
