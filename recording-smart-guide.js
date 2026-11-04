import {recordingSmartGuideVersion} from './recording-smart-guide-version.js';

const guideData={
  keywords:['智慧医疗','人工智能发展历程','知识驱动与数据驱动','大模型原理与局限','智能体 Agent','检索增强生成 RAG','提示词工程','医疗行业痛点','前沿智能技术','跨学科团队研讨'],
  overview:'本课为《智慧医疗创新体验》第二次课，主题为“人工智能探秘”，系统梳理人工智能七十年发展历程与核心思想。课程首先阐明智能医学已进入第三代，强调 AI 是新医科背景下必备的通识素养与底层能力；继而回顾 AI 三次发展浪潮，剖析知识驱动与数据驱动的演进逻辑及局限；重点解析大模型、智能体、检索增强生成、提示词工程、函数调用与工作流，并以宠物健康助手案例具象化多智能体协同流程；最后通过小组学生行业研讨，聚焦智慧医疗真实痛点、数据孤岛与隐私安全、伦理责任界定、模型泛化能力、中医标准化缺失、养老体系嵌合失位等，并探讨光芯片、远程手术机器人、智能可穿戴、无创生物检测等前沿技术路径。',
  sections:[
    {title:'第 1 节',items:[
      ['05:26','人工智能探秘与智能医学演进','人工智能是智能医学发展的核心驱动力，其发展历程可划分为知识驱动、数据驱动及大模型引领的新兴阶段。当前广泛应用的大模型虽尚未实现通用人工智能，但已作为关键“火花”深刻改变各行业实践方式，医疗领域亦正加速融合AI技术。医学范式已从经验医学、循证医学发展至智能医学新阶段，教育部提出“新医科”建设，强调培养具备创新思维的复合型人才，而非仅具执行效率的工具型人才。本课聚焦AI思想内核与医学演进逻辑，为后续技术应用与小组研讨奠定认知基础。'],
      ['07:39','智慧医疗发展脉络与自主学习要求','医学教育内容持续更新，学生需培养自主学习能力，明确个人学习方向。2019年响应教育部号召，我校开设智慧医疗创新体验课程，聚焦智能医学技术原理与医务调查创新方法。在人工智能探秘教学前，课程通过回顾智慧医疗简史强化“以史见今”理念，梳理技术与临床问题协同演进的探索路径。典型案例包括：数理统计应用于霍乱疫情分析、MYCIN专家系统辅助感染诊断、贝叶斯方法支持内科决策、IBM Watson整合机器学习与肿瘤诊疗。'],
      ['12:00','人工智能发展历程与学科体系','人工智能自1950年图灵提出概念、1956年达特茅斯会议正式命名以来，历经七十余年发展，总体呈现“三起两落”的演进特征。其驱动范式从早期知识驱动，逐步转向数据驱动，未来正迈向知识与数据融合的混合驱动新阶段。学科建设方面，2019年起我国设立人工智能一级学科，下设五个方向：基础理论（含优化理论、机器学习理论、脑科学与类脑智能）、共性技术（如计算机视觉、自然语言理解）、支撑技术（含芯片、操作系统、AI架构等卡脖子领域）、应用技术（如智慧医疗、智能交通、无人驾驶、机器翻译）以及交叉方向（涵盖伦理、可信、安全、公平性与隐私保护等社科议题）。'],
      ['27:20','人工智能的知识表达与演进路径','人工智能的核心在于知识表达，主要分为知识驱动与数据驱动两种范式：知识驱动依赖显式规则与符号逻辑，如公理系统，具备可解释性但构建成本高；数据驱动则通过海量数据训练模型，模拟人类无监督学习过程，虽适应性强却依赖大算力、大网络与高带宽，引发能源消耗问题。产业发展从早期政府主导转向产业资本主导，强调市场回报与实际付费意愿，尤其在智慧医疗等垂直领域需对接医院、器械厂商与养老机构的真实需求。人工智能的定义可归纳为四类：像人一样行动（如图灵测试）、像人一样思考（模拟认知与神经机制）、合理地行动（基于目标函数优化决策）、合理地思考（形式化逻辑推理）。当前研究亦分化为具身智能（强调身体-环境交互）与非具身智能（纯内部计算），二者代表不同智能实现路径。']
    ]},
    {title:'第 2 节',items:[
      ['00:00','大模型原理、局限与应用技术','大模型的核心是基于概率的序列建模，将各类任务（翻译、摘要、问答等）统一为“预测下一个词”的生成过程。其通用性体现在跨领域多任务处理能力，已在医疗CDS、病历质控、患者服务等场景落地，但存在本质局限：缺乏真正语义理解、逻辑推理、数学计算、因果推断与自主规划能力，易产生幻觉、事实错误与格式偏差。为克服短板，需结合Agent工作流——通过角色化提示词工程、检索增强（RAG）、外部工具调用、任务分解与多步推理，构建可控、可调试、领域可信的智能系统。'],
      ['28:43','大模型局限性与RAG增强技术原理','大模型虽具通用能力，但存在知识幻觉、专业领域适配不足、私有数据缺失、成本高及数据安全等固有局限。为解决这些问题，需引入检索增强生成（RAG）技术：通过接入专业文献、企业知识库或教材等可信参考信息，使模型输出严格符合领域规范与实际需求。RAG还支持对外部工具调用（如Wolfram Alpha执行数学计算、绘图控件生成图像），实现自然语言驱动的精准计算与专业协作。该技术弥补了大模型封闭式推理的缺陷，使非专业人士也能无需学习专业语法，直接以自然语言完成高准确度任务。']
    ]},
    {title:'第 3 节',items:[
      ['00:03','智能医疗行业问题与前沿技术研讨','本环节围绕智能医疗领域的核心问题与前沿技术展开小组研讨。各组聚焦四大类行业问题：一是系统性嵌合难题，如智慧养老缺乏适配主办方、电子病历无法互联互通、医疗AI难以融入现有保障体系；二是技术可靠性瓶颈，包括大模型黑箱导致的可验证性缺失、算法在跨时空数据分布（如新冠/流感季节、城乡医院）下的泛化能力不足；三是应用落地障碍，涵盖医生学习成本高、基层医院技术覆盖率低、用户过度依赖与数据隐私风险；四是中医现代化困境，涉及疗效周期长、药性标准模糊、问诊经验难量化等。前沿技术方面，重点讨论光芯片（提升AI训练速度与能效）、医疗机器人（远程手术、康复辅助）、超声波无创检测、三维器官重建、无人机样本运输、智能穿戴与生物识别（如粪便菌群分析）、AI运动姿态评估及中医药智能问诊系统等方向。']
    ]}
  ]
};

const summaryTemplate=()=>`<div class="recording-smart-scroll">
  <h2 class="recording-smart-section-title">关键词</h2>
  <div class="recording-smart-tags">${guideData.keywords.map(word=>`<span>${word}</span>`).join('')}</div>
  <h2 class="recording-smart-section-title">概览</h2>
  <p class="recording-smart-overview">${guideData.overview}</p>
  ${guideData.sections.map(section=>`<div class="recording-smart-divider"></div><div class="recording-smart-chapter"><h3>${section.title}</h3></div><div class="recording-smart-timeline">${section.items.map(([time,title,text])=>`<article class="recording-smart-moment" data-smart-seek="${time}" tabindex="0"><time>${time}</time><strong>${title}</strong><p>${text}</p></article>`).join('')}</div>`).join('')}
</div>`;

const mapTemplate=(type='mindmap')=>`<div class="recording-smart-map"><div class="recording-smart-map-switch" role="tablist" aria-label="图谱视图"><button type="button" data-smart-map-view="mindmap" role="tab" aria-selected="${type==='mindmap'}">思维导图</button><button type="button" data-smart-map-view="graph" role="tab" aria-selected="${type==='graph'}">知识图谱</button></div><div class="recording-smart-map-frame"><button type="button" class="recording-smart-map-zoom" data-smart-map-open aria-label="放大查看${type==='graph'?'知识图谱':'思维导图'}"><img src="assets/smart-guide/${type==='graph'?'knowledge-graph':'mindmap'}.png" alt="智慧医疗创新体验课程${type==='graph'?'知识图谱':'思维导图'}"></button></div></div>`;
const overviewTemplate=()=>`<div class="recording-smart-scroll"><h2 class="recording-smart-section-title">关键词</h2><div class="recording-smart-tags">${guideData.keywords.map(word=>`<span>${word}</span>`).join('')}</div><h2 class="recording-smart-section-title">概览</h2><p class="recording-smart-overview">${guideData.overview}</p></div>`;

export function mountRecordingSmartGuide(root){
  if(recordingSmartGuideVersion==='baseline')return;
  const tabs=root.querySelector('.recording-sidebar-head [role=tablist]');
  const sidebar=root.querySelector('.recording-sidebar');
  const evaluation=tabs?.querySelector('[data-rec-tab="evaluation"]');
  if(!tabs||!sidebar||!evaluation)return;
  root.classList.add('recording-smart-guide-enabled');
  sidebar.setAttribute('aria-label','课堂实录量表、智能导读、语音转写与PPT摘要');
  const link=document.createElement('link');link.rel='stylesheet';link.href='./recording-smart-guide.css';document.head.append(link);
  const tab=document.createElement('button');
  tab.type='button';tab.id='recording-smart-guide-tab';tab.dataset.smartGuideTab='guide';tab.setAttribute('role','tab');tab.setAttribute('aria-controls','recording-smart-guide');tab.setAttribute('aria-selected','false');tab.tabIndex=-1;tab.textContent='智能导读';evaluation.after(tab);
  const panel=document.createElement('section');
  panel.id='recording-smart-guide';panel.className='recording-smart-guide-panel';panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panel.hidden=true;
  panel.innerHTML=`<div class="recording-smart-overview-wrap">${overviewTemplate()}</div><div class="recording-smart-switch" role="tablist" aria-label="智能导读目录"><button type="button" data-smart-guide-view="summary" role="tab" aria-selected="true">摘要</button><button type="button" data-smart-guide-view="mindmap" role="tab" aria-selected="false">思维导图</button></div><div class="recording-smart-content">${summaryTemplate()}</div><div class="recording-smart-footer">智能导读由AI生成，仅供参考</div><div class="recording-smart-lightbox" hidden role="dialog" aria-modal="true" aria-label="放大查看图谱"><button type="button" class="recording-smart-lightbox-close" data-smart-map-close aria-label="关闭">×</button><div class="recording-smart-lightbox-switch" role="tablist" aria-label="图谱视图"><button type="button" data-smart-lightbox-view="mindmap" role="tab">思维导图</button><button type="button" data-smart-lightbox-view="graph" role="tab">知识图谱</button></div><img data-smart-map-preview alt=""></div>`;
  sidebar.append(panel);
  const lightbox=panel.querySelector('.recording-smart-lightbox');
  document.body.append(lightbox);
  const content=panel.querySelector('.recording-smart-content');
  function render(view){
    panel.querySelectorAll('[data-smart-guide-view]').forEach(button=>{const active=button.dataset.smartGuideView===view;button.setAttribute('aria-selected',active);button.tabIndex=active?0:-1;});
    content.innerHTML=view==='summary'?`<div class="recording-smart-scroll">${guideData.sections.map(section=>`<div class="recording-smart-divider"></div><div class="recording-smart-chapter"><h3>${section.title}</h3></div><div class="recording-smart-timeline">${section.items.map(([time,title,text])=>`<article class="recording-smart-moment" data-smart-seek="${time}" tabindex="0"><time>${time}</time><strong>${title}</strong><p>${text}</p></article>`).join('')}</div>`).join('')}</div>`:mapTemplate('mindmap');
  }
  function hideGuide(){panel.hidden=true;tab.setAttribute('aria-selected','false');tab.tabIndex=-1;}
  function showGuide(){
    tabs.querySelectorAll(':scope > [role="tab"]').forEach(button=>{const active=button===tab;button.setAttribute('aria-selected',active);button.tabIndex=active?0:-1;});
    sidebar.querySelectorAll(':scope > section').forEach(section=>{section.hidden=section!==panel;});
  }
  root.addEventListener('click',event=>{
    const button=event.target.closest('[role="tab"]');if(!button||button.parentElement!==tabs)return;
    if(button===tab){event.preventDefault();event.stopImmediatePropagation();showGuide();return;}
    hideGuide();
  },true);
  tabs.addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();event.stopImmediatePropagation();
    const buttons=[...tabs.querySelectorAll(':scope > [role="tab"]')];
    const current=Math.max(0,buttons.indexOf(root.ownerDocument.activeElement));
    const target=event.key==='Home'?buttons[0]:event.key==='End'?buttons.at(-1):buttons[(current+(event.key==='ArrowRight'?1:buttons.length-1))%buttons.length];
    target.click();target.focus();
  },true);
  panel.addEventListener('click',event=>{const button=event.target.closest('[data-smart-guide-view]');if(button)render(button.dataset.smartGuideView);});
  panel.addEventListener('click',event=>{const button=event.target.closest('[data-smart-map-view]');if(button){content.innerHTML=mapTemplate(button.dataset.smartMapView);}});
  const seekSmart=(node)=>{const [minutes,seconds]=node.dataset.smartSeek.split(':').map(Number);const seek=document.querySelector('#recording-seek');if(!seek)return;seek.value=minutes*60+seconds;seek.dispatchEvent(new Event('input',{bubbles:true}));};
  panel.addEventListener('click',event=>{const node=event.target.closest('[data-smart-seek]');if(node)seekSmart(node);});
  panel.addEventListener('keydown',event=>{if((event.key==='Enter'||event.key===' ')&&event.target.closest('[data-smart-seek]')){event.preventDefault();seekSmart(event.target.closest('[data-smart-seek]'));}});
  panel.addEventListener('click',event=>{
    const open=event.target.closest('[data-smart-map-open]');
    const close=event.target.closest('[data-smart-map-close]');
    if(open){const image=open.querySelector('img');const preview=lightbox.querySelector('[data-smart-map-preview]');preview.src=image.src;preview.alt=image.alt;lightbox.hidden=false;lightbox.style.display='flex';lightbox.querySelector('[data-smart-map-close]').focus();}
    if(close||event.target===lightbox){lightbox.hidden=true;lightbox.style.display='none';open?.focus();}
  });
  panel.addEventListener('keydown',event=>{if(event.key==='Escape'&&!lightbox.hidden){lightbox.hidden=true;lightbox.style.display='none';panel.querySelector('[data-smart-map-open]')?.focus();}});
  lightbox.addEventListener('click',event=>{if(event.target===lightbox||event.target.closest('[data-smart-map-close]')){lightbox.hidden=true;lightbox.style.display='none';panel.querySelector('[data-smart-map-open]')?.focus();}});
  lightbox.addEventListener('click',event=>{const button=event.target.closest('[data-smart-lightbox-view]');if(!button)return;const type=button.dataset.smartLightboxView;const preview=lightbox.querySelector('[data-smart-map-preview]');preview.src=`assets/smart-guide/${type==='graph'?'knowledge-graph':'mindmap'}.png`;preview.alt=`智慧医疗创新体验课程${type==='graph'?'知识图谱':'思维导图'}`;content.innerHTML=mapTemplate(type);});
  lightbox.addEventListener('keydown',event=>{if(event.key==='Escape'){event.preventDefault();lightbox.hidden=true;panel.querySelector('[data-smart-map-open]')?.focus();}});
  panel.querySelector('.recording-smart-switch').addEventListener('keydown',event=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();
    const views=['summary','mindmap'];const current=Math.max(0,views.indexOf(event.target.dataset.smartGuideView));const target=event.key==='Home'?views[0]:event.key==='End'?views[1]:views[(current+(event.key==='ArrowRight'?1:1))%views.length];render(target);panel.querySelector(`[data-smart-guide-view="${target}"]`).focus();
  });
  render('summary');
}
