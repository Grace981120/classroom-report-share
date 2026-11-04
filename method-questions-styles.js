// Every selector is scoped to the existing teaching-questions section.
export const questionStyles=`
#method-questions{font-family:var(--font-chinese);font-size:14px;line-height:24px}
#method-questions button{font-family:var(--font-chinese)}
#method-questions .mq-head h2,#method-questions .mq-modal-head h2{line-height:32px;font-weight:700}
#method-questions .mq-panel h3,#method-questions .mq-chart-title h3{font-size:16px;line-height:26px;font-weight:600}
#method-questions .mq-dialog #mq-list>.mq-list-head{margin-top:0}
#method-questions [data-mq-list-return]{margin-bottom:14px}

#method-questions .mq-dialog{box-sizing:border-box;width:min(960px,calc(100vw - 48px));max-width:none;max-height:calc(100dvh - 64px);padding:0;border:1px solid #e5ebf3;border-radius:16px;background:#fff;color:var(--secondary);box-shadow:0 20px 70px #14233b33;overflow:hidden;margin:auto;font-family:var(--font-chinese)}
#method-questions .mq-dialog::backdrop{background:rgba(20,32,52,.42)}
#method-questions .mq-modal-head{display:flex;justify-content:space-between;align-items:center;padding:22px 28px;border-bottom:1px solid #e5ebf3;gap:16px}
#method-questions .mq-modal-head h2{font-size:22px;line-height:30px;margin:0 0 4px;color:var(--text-heading)}
#method-questions .mq-close{flex-shrink:0;width:36px;height:36px;font-size:28px;line-height:32px;border-radius:8px;color:var(--muted)}
#method-questions .mq-close:hover{background:#f1f5fa}
#method-questions .mq-modal-body{padding:24px 28px;max-height:calc(100dvh - 174px);overflow:auto;overscroll-behavior:contain;box-sizing:border-box}
#method-questions .mq-dialog .mq-turn{scroll-margin-top:12px}
@media(max-width:700px){#method-questions .mq-dialog{width:calc(100vw - 24px);max-height:calc(100dvh - 32px);border-radius:12px}#method-questions .mq-modal-head{padding:16px}#method-questions .mq-modal-body{padding:18px 16px;max-height:calc(100dvh - 130px)}}

#method-questions .mq-head{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:18px}
#method-questions .mq-head h2{margin:0;font-size:22px}
#method-questions .mq-muted{font-size:12px;color:var(--muted);font-weight:400}
#method-questions .mq-note{font-size:12px;line-height:20px;color:var(--muted);margin:12px 0 0}
#method-questions .mq-link{color:#1d70f2;font-size:13px;padding:6px 8px;border-radius:4px}
#method-questions .mq-link:hover{background:#edf4ff}
#method-questions button:focus-visible{outline:2px solid #1d70f2;outline-offset:3px}
#method-questions .mq-charts{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
#method-questions .mq-chart{min-width:0}
#method-questions h3{font-size:16px;line-height:26px;margin:0 0 12px}
#method-questions .mq-chart-title{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;min-height:24px}
#method-questions .mq-tabs{display:flex;border:1px solid #dde5f0;border-radius:4px;overflow:hidden}
#method-questions .mq-tabs button{padding:1px 6px;font-size:11px;line-height:20px;color:var(--muted)}
#method-questions .mq-tabs [aria-selected=true]{color:#1d70f2;background:#edf4ff}
#method-questions .mq-bars{display:flex;align-items:flex-end;justify-content:space-around;height:156px;border-bottom:1px solid #e9edf3;margin-bottom:36px;background:repeating-linear-gradient(to top,transparent 0,transparent 37px,#f0f3f7 37px,#f0f3f7 38px)}
#method-questions .mq-bars button{position:relative;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;gap:4px;width:15%;font-size:12px;color:var(--secondary);height:100%;padding:0}
#method-questions .mq-bars i{display:block;width:21px;border-radius:4px 4px 0 0}
#method-questions .mq-bars small{position:absolute;top:100%;padding-top:8px;white-space:nowrap;font-size:12px}
#method-questions .mq-donut{display:flex;justify-content:center}
#method-questions .mq-donut svg{width:220px;height:180px;overflow:visible}
#method-questions .mq-donut text{font-family:var(--font-chinese);font-size:12px;fill:var(--secondary)}
#method-questions .mq-donut .mq-center{font-size:25px;font-weight:500;fill:var(--text-heading)}
#method-questions .mq-donut path{cursor:pointer;transition:filter .15s}
#method-questions .mq-donut path:hover,#method-questions .mq-donut path:focus{filter:brightness(1.12)}
#method-questions .mq-legend{display:flex;align-items:center;flex-wrap:wrap;gap:2px 8px;min-height:24px;justify-content:center}
#method-questions .mq-legend button{display:flex;align-items:center;gap:5px;font-size:11px;line-height:20px;padding:2px 0;color:var(--muted)}
#method-questions .mq-legend i{width:6px;height:6px;border-radius:50%;flex-shrink:0}
#method-questions .mq-more{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px;border-top:1px solid #ecf0f5;padding-top:24px;margin-top:24px}
#method-questions .mq-panel{padding:20px;border:1px solid #e5ebf3;border-radius:8px;min-width:0}
#method-questions .mq-panel h3{display:flex;align-items:center;justify-content:space-between;gap:8px}
#method-questions .mq-kpis{display:grid;grid-template-columns:1fr 1fr;gap:12px}
#method-questions .mq-kpi{background:#f7faff;border-radius:8px;padding:14px;text-align:left}
#method-questions .mq-kpi strong{display:block;font-size:30px;line-height:38px;color:#1d70f2;font-weight:500}
#method-questions .mq-kpi small{font-size:13px;margin-left:3px}
#method-questions .mq-kpi span{display:block;font-size:12px;margin-top:4px;color:var(--muted)}
#method-questions .mq-meter{height:8px;border-radius:4px;background:#eaf0f8;overflow:hidden;margin:18px 0 8px}
#method-questions .mq-meter i{display:block;height:100%;background:#1d70f2}
#method-questions .mq-between{display:flex;justify-content:space-between;font-size:12px;color:var(--muted);gap:8px}
#method-questions .mq-solo{display:block}
#method-questions .mq-legend b{font-weight:400;margin-left:2px}
#method-questions .mq-strategy{display:grid;grid-template-columns:88px 1fr 30px;gap:8px;align-items:center;width:100%;font-size:13px;color:var(--secondary);margin:17px 0;padding:0;text-align:left}
#method-questions .mq-strategy i{height:10px;background:#edf2f8;border-radius:4px;overflow:hidden}
#method-questions .mq-strategy em{height:100%;display:block;background:#1d70f2;border-radius:4px}
#method-questions .mq-strategy b{text-align:right;font-weight:500;font-size:12px}
#method-questions .mq-list-head{display:flex;align-items:center;justify-content:space-between;gap:12px;margin:26px 0 12px;flex-wrap:wrap}
#method-questions .mq-list-head h3{margin:0;font-size:18px}
#method-questions .mq-filters{display:flex;gap:8px;flex-wrap:wrap}
#method-questions .mq-filters button{padding:5px 10px;background:#f3f6f9;color:var(--muted);border-radius:4px;font-size:12px}
#method-questions .mq-filters [aria-pressed=true]{background:#eaf2ff;color:#1d70f2}
#method-questions .mq-row{display:grid;grid-template-columns:78px 1fr auto;gap:16px;align-items:center;border:1px solid #e5ebf3;padding:16px 18px;border-radius:8px;width:100%;margin:10px 0;text-align:left}
#method-questions .mq-row:hover{border-color:#bdd4fa;background:#fcfdff}
#method-questions .mq-row time{font-size:13px;color:#1d70f2}
#method-questions .mq-row strong{display:block;font-size:14px;line-height:24px;margin-bottom:7px;font-weight:600;color:var(--text-heading)}
#method-questions .mq-tags{display:flex;gap:6px;flex-wrap:wrap}
#method-questions .mq-tags span{background:#f1f5fa;color:var(--muted);padding:2px 7px;border-radius:4px;font-size:12px;line-height:19px}
#method-questions .mq-row .mq-open{font-size:13px;color:#1d70f2;white-space:nowrap}
#method-questions .mq-pages{display:flex;align-items:center;justify-content:flex-end;gap:16px;margin:14px 0;font-size:12px;color:var(--muted)}
#method-questions button:disabled{opacity:.45;cursor:default}
#method-questions .mq-detail{display:grid;grid-template-columns:250px minmax(0,1fr);gap:24px}
#method-questions .mq-sidebar{max-height:760px;overflow:auto;border-right:1px solid #e5ebf3;padding-right:18px}
#method-questions .mq-sidebar button{display:block;padding:14px;border-radius:8px;margin-bottom:10px;width:100%;text-align:left;background:#f8faff;border:1px solid transparent;color:var(--secondary);font-size:13px;line-height:22px}
#method-questions .mq-sidebar button[aria-current=true]{background:#edf4ff;border-color:#bcd5fb}
#method-questions .mq-sidebar time{display:block;font-size:12px;color:#1d70f2;margin-bottom:7px}
#method-questions .mq-detail-stats{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}
#method-questions .mq-detail-stats span{background:#f4f7fb;border-radius:8px;padding:8px 12px;font-size:13px}
#method-questions .mq-turn{display:grid;grid-template-columns:85px 55px 1fr;gap:12px;padding:16px 0;border-bottom:1px solid #edf0f5;font-size:14px;line-height:24px;scroll-margin-top:100px}
#method-questions .mq-turn time{font-size:12px;color:var(--muted)}
#method-questions .mq-turn label{font-size:12px;color:#1d70f2}
#method-questions .mq-turn.student label{color:#009d65}
#method-questions .mq-turn p{margin:0;overflow-wrap:anywhere}
#method-questions .mq-turn small{display:block;color:var(--muted);font-size:12px;margin-top:6px}
#method-questions .mq-turn.mq-highlight{background:#edf5ff;outline:1px solid #bdd4fa;border-radius:8px}
#method-questions .mq-analysis{padding:16px 18px;background:#f7faff;border:1px solid #dfeafa;border-radius:8px;margin:20px 0;font-size:14px;line-height:24px;color:var(--secondary)}
#method-questions .mq-analysis strong{display:block;color:var(--text-heading);margin-bottom:6px}
#method-questions .mq-empty{text-align:center;padding:26px 16px;color:var(--muted);font-size:13px;line-height:24px;background:#f8faff;border-radius:8px}
#method-questions .mq-empty strong{display:block;color:var(--secondary);margin-bottom:8px}
#method-questions .mq-original-segment{position:absolute;height:16px;top:0;border-radius:4px;min-width:3px}
#method-questions .mq-timeline{overflow:auto;margin-top:12px}
#method-questions .mq-time-inner{min-width:720px}
#method-questions .mq-time-row{display:grid;grid-template-columns:78px 1fr 68px;gap:10px;align-items:center;margin:12px 0;font-size:12px;color:var(--muted)}
#method-questions .mq-track{height:28px;border-radius:4px;background:#f2f5f8;position:relative}
#method-questions .mq-track button{position:absolute;min-width:5px;height:16px;top:6px;border-radius:4px;padding:0}
#method-questions .mq-track button:hover{filter:brightness(1.15);transform:scaleY(1.4)}
#method-questions .mq-axis{display:flex;justify-content:space-between;margin:0 78px 0 88px;font-size:12px;color:var(--muted)}
@media(max-width:1250px){#method-questions .mq-charts{grid-template-columns:repeat(2,minmax(0,1fr))}#method-questions .mq-more{grid-template-columns:1fr 1fr}#method-questions .mq-panel:last-child{grid-column:1/-1}}
@media(max-width:700px){#method-questions .mq-charts,#method-questions .mq-more{grid-template-columns:1fr}#method-questions .mq-panel:last-child{grid-column:auto}#method-questions .mq-detail{grid-template-columns:1fr}#method-questions .mq-sidebar{max-height:160px;border:0;padding:0}#method-questions .mq-row{grid-template-columns:64px 1fr;padding:14px;gap:10px}#method-questions .mq-row .mq-open{grid-column:2}#method-questions .mq-turn{grid-template-columns:65px 1fr;gap:8px}#method-questions .mq-turn>div{grid-column:1/-1}#method-questions .mq-panel{padding:16px}#method-questions .mq-head{align-items:flex-start;flex-wrap:wrap}}
@media print{#method-questions .mq-pages,#method-questions .mq-filters{display:none}#method-questions .mq-timeline{overflow:visible}#method-questions .mq-time-inner{min-width:0}}
@media(prefers-reduced-motion:reduce){#method-questions .mq-track button,#method-questions .mq-donut path{transition:none;transform:none}}

#method-questions .mq-charts h3,#method-questions .mq-panel h3,#method-questions>.mq-list-head h3{font-size:14px;line-height:24px;font-weight:600;color:var(--primary)}
#method-questions .mq-classification-groups{display:flex;gap:6px;height:32px;margin-top:12px}
#method-questions .mq-classification-groups span{flex:1;border:1px solid var(--border);border-bottom:0;border-radius:4px 4px 0 0;text-align:center;font-size:11px;line-height:32px;color:var(--muted);background:#fcfdff}
#method-questions .mq-bars{height:140px;background:repeating-linear-gradient(to top,transparent 0,transparent 27px,#edf0f5 27px,#edf0f5 28px)}
#method-questions .mq-donut{margin-top:10px}
#method-questions .mq-help{position:relative;display:inline-flex;align-items:center;font-weight:400}
#method-questions .mq-help-button{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;border:1px solid var(--muted);border-radius:50%;padding:0;font-size:11px;line-height:14px;color:var(--muted)}
#method-questions .mq-tooltip{display:none;position:absolute;right:0;top:22px;width:min(320px,calc(100vw - 64px));box-sizing:border-box;z-index:5;background:white;border:1px solid var(--border);box-shadow:0 8px 24px #18263c22;border-radius:8px;padding:14px 16px;font-size:12px;line-height:22px;color:var(--secondary);text-align:left}
#method-questions .mq-tooltip>span{display:block;margin-top:6px}
#method-questions .mq-help:hover .mq-tooltip,#method-questions .mq-help:focus-within .mq-tooltip{display:block}
#method-questions .mq-evidence-hit{background:#fff0b3;color:inherit;border-radius:3px;padding:1px 2px;box-decoration-break:clone}

`;
