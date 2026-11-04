import {mountAttitudeIterationV11} from './attitude-iteration-v11.js';
import {attitudeData} from './attitude-data.js';

const star='<img src="assets/figma/attitude-img111111.svg" alt="" width="16" height="16">';
const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const section=(id,title,analysis,content='')=>{
 const node=document.createElement('section');node.id=id;node.className='card section';node.setAttribute('aria-labelledby',id+'-title');
 node.innerHTML='<div class="section-heading"><h2 id="'+id+'-title">'+title+'</h2></div><button type="button" class="attitude-insight attitude-v12-result" data-v12-result="'+id+'" aria-label="'+title+'分析，打开课堂记录">'+star+'<p>'+analysis+'</p></button>'+content;
 return node;
};

export function mountAttitudeIterationV12(root,{openDialog}){
 mountAttitudeIterationV11(root,{openDialog});
 if(root.dataset.attitudeIteration!=='1.1'||root.dataset.attitudeExpansion)return;
 const style=document.createElement('link');style.rel='stylesheet';style.href=new URL('./attitude-iteration-v12.css',import.meta.url).href;document.head.append(style);
 const arrival=attitudeData.basics[0],departure=attitudeData.basics[1],attireRecord=attitudeData.basics[3],wordRecord=attitudeData.basics[4];
 const attendance=section('attitude-attendance','教师考勤','计划13:30上课，教师13:27到课，准时上课；计划16:35下课，教师16:32离开，提前3分钟，待核查。','<div class="attitude-attendance-timeline"><div class="attitude-attendance-boundaries"><span>计划上课</span><span>计划下课</span></div><div class="attitude-attendance-track"><div class="attitude-attendance-duration"></div><button type="button" class="attitude-attendance-point arrival" data-attendance-event="arrival" aria-label="教师13:27到课，打开课堂记录" title="教师到课 · 13:27"></button><button type="button" class="attitude-attendance-point departure" data-attendance-event="departure" aria-label="教师16:32离开，打开课堂记录" title="教师离开 · 16:32"></button></div><div class="attitude-attendance-axis"><span>13:27</span><span>14:05</span><span>14:42</span><span>15:20</span><span>15:57</span><span>16:35</span></div><div class="attitude-attendance-legend"><span><i></i>教师到课</span><span><i></i>教师离开</span></div></div>');
 const attire=section('attitude-attire','教学着装','教师着装整洁、得体，当前课堂记录未见着装异常。');
 const sensitive=section('attitude-sensitive','敏感词','识别到2条课堂用语线索，需结合原话和上下文复核，暂不判定为不当言论。');
 const management=root.querySelector('#attitude-management');management.before(attendance,attire,sensitive);
 // The original body-language chart is an offline indicator in the current scale.
 const body=root.querySelector('#attitude-body');
 if(body){body.hidden=false;root.querySelector('#attitude-posture')?.before(body);}
 root.dataset.attitudeExpansion='1.2';

 const attendanceEvidence='<div class="attitude-record-list"><article><time>'+escapeHTML(arrival.time)+'</time><p>'+escapeHTML(arrival.detail)+'</p></article><article><time>'+escapeHTML(departure.time)+'</time><p>'+escapeHTML(departure.detail)+'</p></article></div><div class="dialog-note">时间轴以课表时间和本课示例到离记录定位；蓝色横条只表示到离区间，不等于连续授课或视频有效时长。</div>';
 const attireEvidence='<div class="attitude-record-list"><article><time>全课节</time><p>'+escapeHTML(attireRecord.detail)+'</p></article></div><div class="dialog-note">当前示例未提供可定位的原始画面，着装结论仍需结合现场或视频复核。</div>';
 const sensitiveEvidence='<div class="attitude-record-list">'+wordRecord.events.map(([time,description])=>'<article><time>'+escapeHTML(time)+'</time><p>'+escapeHTML(description)+'</p></article>').join('')+'</div><div class="dialog-note">当前仅有课堂用语线索摘要，缺逐字原话和前后文；不能据此认定使用敏感词或不当言论。</div>';
 root.addEventListener('click',event=>{
  const trigger=event.target.closest('[data-v12-result],[data-attendance-event]');if(!trigger||!root.contains(trigger))return;
  if(trigger.dataset.attendanceEvent){const record=trigger.dataset.attendanceEvent==='arrival'?arrival:departure;openDialog(record.label,'<div class="attitude-record-list"><article><time>'+escapeHTML(record.time)+'</time><p>'+escapeHTML(record.detail)+'</p></article></div>','教学态度 / 教师考勤');return;}
  const id=trigger.dataset.v12Result;
  if(id==='attitude-attendance')openDialog('教师考勤',attendanceEvidence,'教学态度 / 教师考勤');
  if(id==='attitude-attire')openDialog('教学着装',attireEvidence,'教学态度 / 教学着装');
  if(id==='attitude-sensitive')openDialog('敏感词',sensitiveEvidence,'教学态度 / 敏感词');
 });
}
