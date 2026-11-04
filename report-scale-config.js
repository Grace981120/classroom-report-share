import {publishedScaleRevision,publishedScaleConfig} from './report-scale-published.js?v=20261102-user-saved1';
import {scalePresets,scalePresetRevision} from './report-scale-presets.js';
const storageKey='teaching-evaluation-demo-scale-config-v1';
const templates={default:'默认量表',vocational:'高职院校',applied:'应用型院校',research:'研究型院校',comprehensive:'综合性大学',full:'全量量表'};
const pages={'教学态度':'attitude','教学内容':'content','教学方法':'method','教学素养':'literacy','教学效果':'effect'};
const offline=new Set([
  'attitude-basics','attitude-expressions','attitude-attendance','attitude-body','attitude-posture','attitude-patrol','attitude-attire','attitude-sensitive','attitude-anomaly',
  'method-language','method-board','method-interaction','method-multimedia',
  'effect-participation','effect-monitoring','effect-pyramid','effect-anomalies','effect-actions','effect-expressions'
]);
const aliases={'attitude-basics':'基础情况','attitude-attire':'教师着装','method-language':'语言表达','attitude-body':'肢体语言','attitude-patrol':'巡堂轨迹','method-interaction':'师生互动分析','method-multimedia':'多媒体运用','method-behavior':'师生行为时序','effect-actions':'学生行为','effect-participation':'学习参与度','effect-expressions':'学生表情'};

// Definitions inside heading help popovers are not part of indicator names.
function moduleName(node){
 if(aliases[node.id])return aliases[node.id];
 const heading=node.querySelector('h2');if(!heading)return node.id;
 const title=heading.cloneNode(true);
 title.querySelectorAll('button,[role="tooltip"],[class*="help"],[class*="tooltip"]').forEach(n=>n.remove());
 return title.textContent.replace(/\s+/g,' ').trim()||node.id;
}

export function mountReportScaleConfig({dimensions,toast,onChange}){
  const modules=name=>{
    const items=[...document.querySelectorAll(`#${pages[name]} > section.card.section`)]
      .filter(node=>node.id&&!node.classList.contains('dimension-summary-card')&&node.id!=='attitude-basics'&&!node.id.endsWith('-legacy')&&node.id!=='attitude-emotion'&&node.id!=='attitude-language'&&node.id!=='effect-state')
      .map(node=>({id:node.id,name:moduleName(node),offline:offline.has(node.id)}));
    if(name==='教学效果'&&document.querySelector('#effect')?.dataset.indicatorStructure!=='split')items.push(...['effect-participation','effect-expressions'].map(id=>({id,name:aliases[id],offline:true})));
    return items;
  };
  const createTemplate=()=>({version:'advanced',dimensions:[...dimensions],modules:Object.fromEntries(dimensions.map(name=>[name,modules(name).map(item=>item.id)])),order:Object.fromEntries(dimensions.map(name=>[name,modules(name).map(item=>item.id)]))});
  let state={active:'default',literacyIndicatorVersion:1,newIndicatorsVersion:1,indicatorStructureVersion:1,templates:Object.fromEntries(Object.keys(templates).map(id=>[id,createTemplate()]))};
  let saved=null,previousConfig=null;
  try{
    previousConfig=localStorage.getItem(storageKey);
    saved=JSON.parse(previousConfig);
    if(saved?.templates){
      for(const id of Object.keys(templates))if(saved.templates[id]){
        const prior=saved.templates[id],current=state.templates[id];
        current.version=prior.version==='basic'?'basic':'advanced';
        current.dimensions=[...(prior.dimensions||[])].filter(name=>dimensions.includes(name));
        for(const name of dimensions)current.modules[name]=modules(name).map(item=>item.id).filter(item=>prior.modules?.[name]?.includes(item));
        if(prior.modules?.['教学态度']?.includes('attitude-language')&&!current.modules['教学方法'].includes('method-language'))current.modules['教学方法'].push('method-language');
        if(saved.literacyIndicatorVersion!==1&&!current.modules['教学素养'].includes('literacy-analysis'))current.modules['教学素养'].push('literacy-analysis');
        if(saved.newIndicatorsVersion!==1)for(const [name,moduleId] of [['教学态度','attitude-investment'],['教学内容','content-depth'],['教学方法','method-style'],['教学素养','literacy-ideology']])if(modules(name).some(item=>item.id===moduleId)&&!current.modules[name].includes(moduleId))current.modules[name].push(moduleId);
        if(saved.indicatorStructureVersion!==1&&modules('教学态度').some(item=>item.id==='attitude-expressions')&&current.modules['教学态度'].includes('attitude-investment')&&!current.modules['教学态度'].includes('attitude-expressions'))current.modules['教学态度'].push('attitude-expressions');
        for(const name of dimensions){
          const available=modules(name).map(item=>item.id);
          current.order[name]=[...(prior.order?.[name]||prior.modules?.[name]||[])].filter(id=>available.includes(id));
          current.order[name].push(...available.filter(id=>!current.order[name].includes(id)));
        }
      }
      if(templates[saved.active])state.active=saved.active;
    }
  }catch{}
  // Apply the newly requested defaults once; subsequent user edits remain independent.
  if(saved?.sourcePresetRevision!==scalePresetRevision){
    if(previousConfig)try{const key=storageKey+'-before-'+scalePresetRevision;if(!localStorage.getItem(key))localStorage.setItem(key,previousConfig);}catch{}
    for(const id of Object.keys(templates)){
      const preset=scalePresets[id],config=state.templates[id];
      config.version='advanced';
      config.dimensions=[...dimensions];
      for(const name of dimensions){
        const available=modules(name).map(item=>item.id);
        const matched=[...new Set(preset.rows.flatMap(row=>[row.module,...(row.additionalModules||[])]).filter(module=>available.includes(module)))];
        config.modules[name]=id==='full'?[...matched,...available.filter(module=>!matched.includes(module))]:matched;
        config.order[name]=[...matched,...available.filter(module=>!matched.includes(module))];
      }
    }
  }
  state.sourcePresetRevision=scalePresetRevision;
  // Install the approved browser export once on each origin, then preserve later edits.
  if(saved?.publishedScaleRevision!==publishedScaleRevision){
    if(previousConfig)try{const key=storageKey+'-before-'+publishedScaleRevision;if(!localStorage.getItem(key))localStorage.setItem(key,previousConfig);}catch{}
    for(const id of Object.keys(templates)){
      const prior=publishedScaleConfig.templates[id],config=state.templates[id];
      config.version=prior.version;
      config.dimensions=prior.dimensions.filter(name=>dimensions.includes(name));
      for(const name of dimensions){
        const available=modules(name).map(item=>item.id);
        config.modules[name]=prior.modules[name].filter(id=>available.includes(id));
        config.order[name]=[...prior.order[name].filter(id=>available.includes(id)),...available.filter(id=>!prior.order[name].includes(id))];
      }
    }
    state.active=publishedScaleConfig.active;
  }
  state.publishedScaleRevision=publishedScaleRevision;
  if(saved?.twoPropertiesVersion!==1){
    for(const config of Object.values(state.templates)){
      if(!config.modules['教学内容'].includes('content-two-properties'))config.modules['教学内容'].push('content-two-properties');
      const order=config.order['教学内容'];
      const without=order.filter(id=>id!=='content-two-properties');
      without.splice(without.indexOf('content-depth')+1,0,'content-two-properties');
      config.order['教学内容']=without;
    }
  }
  state.twoPropertiesVersion=1;
  const current=()=>state.templates[state.active];
  const isBasic=id=>{const row=scalePresets[state.active]?.rows.find(row=>row.module===id||row.additionalModules?.includes(id));return row?row.basic:offline.has(id);};
  const save=()=>{try{localStorage.setItem(storageKey,JSON.stringify(state));}catch{toast?.('浏览器暂不支持保存配置');}};
  const selected=(name)=>current().modules[name]||[];
  const ordered=(name)=>{const items=modules(name),order=current().order[name]||[];return [...items].sort((a,b)=>order.indexOf(a.id)-order.indexOf(b.id));};
  const apply=()=>{
    const config=current(),basic=config.version==='basic';
    const visibleDimensions=config.dimensions.filter(name=>!basic||modules(name).some(item=>isBasic(item.id)&&selected(name).includes(item.id)));
    window.__reportVersionConfig={dimensions:visibleDimensions,order:config.order,modules:Object.fromEntries(dimensions.map(name=>[name,selected(name).filter(id=>!basic||isBasic(id))]))};
    const nav=document.querySelector('.topbar nav');
    for(const name of [...config.dimensions,...dimensions.filter(item=>!config.dimensions.includes(item))]){
      const link=nav?.querySelector(`a[href="#${pages[name]}"]`);if(link)nav.append(link);
    }
    for(const name of dimensions){
      const enabled=visibleDimensions.includes(name),page=pages[name],root=document.getElementById(page);
      document.querySelector(`.topbar a[href="#${page}"]`)?.toggleAttribute('hidden',!enabled);
      const oldSummary=root.querySelector(':scope > .attitude-summary');
      if(oldSummary)oldSummary.hidden=basic||Boolean(root.dataset.dimensionSummary||root.dataset.attitudeSummary);
      const dimensionSummary=root.querySelector(':scope > .dimension-summary-card');
      if(dimensionSummary)dimensionSummary.hidden=basic;
      for(const item of modules(name)){
        const node=document.getElementById(item.id);
        if(node)node.hidden=!enabled||!selected(name).includes(item.id)||(basic&&!isBasic(item.id));
      }
      if(!enabled&&location.hash.startsWith(`#${page}`))location.hash='#recording';
      if(name==='教学效果'&&root.dataset.indicatorStructure!=='split'){
        root.querySelectorAll('[id$="-legacy"]').forEach(node=>node.hidden=true);
        const stateSection=root.querySelector('#effect-state');
        if(stateSection){
          const participation=selected(name).includes('effect-participation'),expressions=selected(name).includes('effect-expressions');
          stateSection.hidden=!enabled||(!participation&&!expressions);
          for(const [tab,id] of [['participation','effect-participation'],['expressions','effect-expressions']])stateSection.querySelector(`[data-tab="${tab}"]`)?.toggleAttribute('hidden',!selected(name).includes(id));
          const focus=stateSection.querySelector('[data-tab="focus"]');if(focus)focus.hidden=basic;
          if(!stateSection.hidden){
            const active=stateSection.querySelector('[data-tab][aria-selected="true"]');
            if(!active||active.hidden)stateSection.querySelector(`[data-tab="${participation?'participation':'expressions'}"]`)?.click();
          }
        }
      }
      const footer=root.querySelector(':scope > footer');
      const moved=new Set();
      for(const item of ordered(name)){
        const node=root.dataset.indicatorStructure!=='split'&&(item.id==='effect-participation'||item.id==='effect-expressions')?root.querySelector('#effect-state'):document.getElementById(item.id);
        if(node?.parentElement===root&&!moved.has(node)){root.append(node);moved.add(node);}
      }
      if(footer)root.append(footer);
      if(name==='教学效果'&&root.dataset.indicatorStructure!=='split'){
        const tabs=root.querySelector('#effect-state .state-tabs');
        for(const item of ordered(name))if(item.id==='effect-participation'||item.id==='effect-expressions'){
          const tab=tabs?.querySelector(`[data-tab="${item.id==='effect-participation'?'participation':'expressions'}"]`);if(tab)tabs.append(tab);
        }
      }
    }
    const overview=document.querySelector('#merged-overview')||document.querySelector('#overview');
    for(const selector of ['.summary-grid','.radar-card','.overall-score',':scope > .card.section'])overview?.querySelectorAll(selector).forEach(node=>node.hidden=basic);
    overview?.querySelectorAll('.overview-v2-highlight,.overview-v2-problem,.overview-v2-outline,#overview-v2-highlights,#overview-v2-problems').forEach(node=>node.hidden=basic);
    onChange?.();
  };
  const button=document.createElement('button');button.type='button';button.className='report-version-fab';button.textContent='配置量表';button.setAttribute('aria-label','配置量表');document.body.append(button);
  const panel=document.createElement('aside');panel.className='report-version-panel report-scale-panel';panel.hidden=true;
  panel.innerHTML='<div class="report-version-head"><div><span>Demo 临时配置入口</span><h2>配置量表</h2></div><button type="button" data-scale-close aria-label="关闭配置量表">×</button></div><div class="report-version-body"></div><footer><button type="button" data-scale-export>导出量表配置</button><button type="button" data-scale-save>保存当前量表</button></footer>';
  document.body.append(panel);
  const render=()=>{
    const config=current();
    const dimensionOrder=[...config.dimensions,...dimensions.filter(name=>!config.dimensions.includes(name))];
    panel.querySelector('.report-version-body').innerHTML=`<div class="report-scale-templates" role="tablist" aria-label="量表模板">${Object.entries(templates).map(([id,name])=>`<button type="button" role="tab" data-scale-template="${id}" aria-selected="${state.active===id}">${name}</button>`).join('')}</div><div class="report-version-tabs" role="tablist" aria-label="量表版本"><button type="button" role="tab" data-scale-version="basic" aria-selected="${config.version==='basic'}">基础版</button><button type="button" role="tab" data-scale-version="advanced" aria-selected="${config.version==='advanced'}">进阶版</button></div><p class="report-version-hint">基础版按当前模板的基础指标显示；进阶版显示所选的全部指标。可用箭头调整维度与指标顺序。</p><div class="version-dimensions">${dimensionOrder.map((name,index)=>{const active=config.dimensions.includes(name),items=ordered(name);return `<section class="version-dimension"><header><label><input type="checkbox" data-scale-dimension="${name}" ${active?'checked':''}>${name}</label><span><button type="button" data-scale-dimension-move="${name}|-1" aria-label="${name}上移" ${!active||index===0?'disabled':''}>↑</button><button type="button" data-scale-dimension-move="${name}|1" aria-label="${name}下移" ${!active||index===config.dimensions.length-1?'disabled':''}>↓</button></span></header><div class="version-modules">${items.map((item,index)=>{const disabled=config.version==='basic'&&!isBasic(item.id);return `<div class="${disabled?'report-scale-online':''}"><label><input type="checkbox" data-scale-module="${name}|${item.id}" ${selected(name).includes(item.id)?'checked':''} ${disabled?'disabled':''}>${item.name}</label><span>${disabled?'<small>进阶指标</small>':''}<button type="button" data-scale-module-move="${name}|${item.id}|-1" aria-label="${item.name}上移" ${index===0?'disabled':''}>↑</button><button type="button" data-scale-module-move="${name}|${item.id}|1" aria-label="${item.name}下移" ${index===items.length-1?'disabled':''}>↓</button></span></div>`;}).join('')}</div></section>`;}).join('')}</div>`;
  };
  button.addEventListener('click',()=>{render();panel.hidden=false;});
  panel.addEventListener('click',event=>{
    const target=event.target.closest('button,input');if(!target)return;
    if(target.matches('[data-scale-close]')){panel.hidden=true;return;}
    if(target.matches('[data-scale-save]')){save();toast?.('当前量表配置已保存');return;}
    if(target.matches('[data-scale-export]')){
      save();
      const url=URL.createObjectURL(new Blob([JSON.stringify(state,null,2)],{type:'application/json'}));
      const link=document.createElement('a');link.href=url;link.download='report-scale-config.json';document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
      toast?.('已导出六套量表的勾选、版本与顺序');return;
    }
    if(target.dataset.scaleTemplate){state.active=target.dataset.scaleTemplate;save();apply();render();return;}
    if(target.dataset.scaleVersion){current().version=target.dataset.scaleVersion;save();apply();render();return;}
    if(target.dataset.scaleDimensionMove){const [name,deltaText]=target.dataset.scaleDimensionMove.split('|'),list=current().dimensions,index=list.indexOf(name),next=index+Number(deltaText);if(index>=0&&next>=0&&next<list.length){[list[index],list[next]]=[list[next],list[index]];save();apply();render();}return;}
    if(target.dataset.scaleModuleMove){const [name,id,deltaText]=target.dataset.scaleModuleMove.split('|'),list=current().order[name],index=list.indexOf(id),next=index+Number(deltaText);if(index>=0&&next>=0&&next<list.length){[list[index],list[next]]=[list[next],list[index]];save();apply();render();}return;}
    if(target.dataset.scaleDimension){const name=target.dataset.scaleDimension;current().dimensions=target.checked?[...new Set([...current().dimensions,name])]:current().dimensions.filter(item=>item!==name);save();apply();render();return;}
    if(target.dataset.scaleModule){const [name,id]=target.dataset.scaleModule.split('|');if(target.disabled)return;current().modules[name]=target.checked?[...new Set([...selected(name),id])]:selected(name).filter(item=>item!==id);save();apply();return;}
  });
  save();apply();
}
