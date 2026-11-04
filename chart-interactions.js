// One tooltip interaction for all time-based line charts.
export function bindChartHover({plot,tooltip,max,inspect,clear,fromRatio=ratio=>ratio*max}) {
  let current=0;
  plot.setAttribute('tabindex','0');
  plot.setAttribute('role','slider');
  plot.setAttribute('aria-valuemin','0');
  plot.setAttribute('aria-valuemax',String(max));
  plot.setAttribute('aria-valuenow','0');
  plot.setAttribute('aria-description','悬停或轻点查看数据；方向键切换时间，Escape 关闭提示。');
  function hide(){tooltip.hidden=true;clear();}
  function show(value,clientX,clientY){
    current=Math.round(Math.max(0,Math.min(max,value)));
    const message=inspect(current);
    plot.setAttribute('aria-valuenow',String(current));
    plot.setAttribute('aria-valuetext',message);
    tooltip.textContent=message;tooltip.hidden=false;
    const bounds=tooltip.getBoundingClientRect();
    tooltip.style.left=`${Math.max(8,Math.min(innerWidth-bounds.width-8,clientX+12))}px`;
    tooltip.style.top=`${Math.max(8,clientY-bounds.height-12<8?clientY+16:clientY-bounds.height-12)}px`;
  }
  function pointer(event){const r=plot.getBoundingClientRect();show(fromRatio((event.clientX-r.left)/r.width),event.clientX,event.clientY);}
  plot.addEventListener('pointermove',e=>{if(e.pointerType!=='touch')pointer(e);});
  plot.addEventListener('click',pointer);
  plot.addEventListener('pointerleave',hide);
  plot.addEventListener('blur',hide);
  plot.addEventListener('keydown',e=>{
    if(e.key==='Escape'){hide();return;}
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;
    e.preventDefault();const r=plot.getBoundingClientRect();
    show(e.key==='Home'?0:e.key==='End'?max:current+(e.key==='ArrowRight'?1:-1),r.left+r.width*current/max,r.top+20);
  });
  window.addEventListener('scroll',hide,true);
  window.addEventListener('resize',hide);
  return {hide};
}
