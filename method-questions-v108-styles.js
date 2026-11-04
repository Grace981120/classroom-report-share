// Scoped teaching-questions 1.0.8 layout; baseline styles remain recoverable.
export const question108Styles=`
#method-questions .uq-stage h3,#method-questions .uq-timeline-title h3,#method-questions .mq-dialog h3{font-size:14px;line-height:24px;font-weight:600;color:var(--primary)}
#method-questions .attitude-insight{margin-bottom:24px}
#method-questions .uq-timeline-title h3{margin:0 0 12px}
#method-questions .method-timeline-scroll{padding:0 2px;overflow-x:auto}
#method-questions .uq-timeline{padding-top:24px;min-width:1000px}
#method-questions .uq-timeline .method-timeline-row{margin:0;grid-template-columns:66px minmax(0,1fr) 74px}
#method-questions .uq-timeline .method-axis{margin-top:8px}
#method-questions .uq-segment{background:#1d70f2;min-width:3px}
#method-questions .uq-chain{min-width:0;height:12px;border-radius:2px}
#method-questions .uq-chain:hover{filter:brightness(.92);box-shadow:0 0 0 2px #c4dbff}
#method-questions .uq-total{padding:0;text-align:left;color:var(--muted)}
#method-questions .uq-total:hover{color:#1d70f2}
#method-questions .uq-stages{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px;border-top:1px solid #e8edf5;margin-top:24px;padding-top:24px}
#method-questions .uq-stage{min-width:0;border:0;background:transparent}
#method-questions .uq-stage-head{display:flex;justify-content:space-between;align-items:center;height:24px;gap:6px;margin:0 0 16px}
#method-questions .uq-stage-head h3{margin:0;white-space:nowrap}
#method-questions .uq-stage-head .mq-tabs{margin:0;align-items:center}
#method-questions .uq-stage-head .mq-tabs button{height:24px;line-height:20px;padding:1px 5px;margin:0;display:inline-flex;align-items:center;justify-content:center}
#method-questions .uq-plot{height:240px;min-width:0}
#method-questions .uq-stage:first-child .uq-plot{display:flex;flex-direction:column}
#method-questions .uq-plot .mq-classification-groups{margin-top:12px}
#method-questions .uq-plot .mq-bars{margin-bottom:0}
#method-questions .uq-ring{display:grid;grid-template-rows:180px 44px;gap:16px}
#method-questions .uq-ring .mq-donut{height:180px;margin:0}
#method-questions .uq-ring .mq-donut svg{width:220px;height:180px}
#method-questions .uq-ring .mq-legend{height:44px;min-height:44px;display:flex;flex-wrap:wrap;align-content:flex-start;align-items:flex-start;justify-content:center;gap:0 8px;margin:0;padding:0}
#method-questions .uq-ring .mq-legend button{height:22px;line-height:20px;padding:1px 0;margin:0;white-space:nowrap}
#method-questions .uq-student .mq-legend{transform:translateY(-22px)}
#method-questions .uq-student .mq-legend button:last-child{flex-basis:100%;justify-content:center}
#method-questions .uq-strategies{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:repeat(3,40px);gap:16px;align-content:center;padding-bottom:44px;box-sizing:border-box}
#method-questions .uq-strategies .mq-strategy{margin:0;padding:0;height:40px;width:100%;grid-template-columns:72px minmax(0,1fr) 30px;gap:8px}
#method-questions [role=button]:focus-visible{outline:2px solid #1d70f2;outline-offset:3px}
#method-questions .mq-legend button:hover,#method-questions .mq-bars button:hover{color:#1d70f2;filter:brightness(.92)}
#method-questions .mq-strategy:hover i{background:#dce8fa}
#method-questions .uq-summary .mq-note{margin:0 0 12px}
#method-questions .uq-detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:24px;margin:0 0 24px}
#method-questions .uq-detail-grid section{min-width:0}
#method-questions .uq-detail-grid h3{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:0 0 12px}
#method-questions .uq-detail-grid .mq-donut{margin:0}
#method-questions .uq-result-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:16px 0;scroll-margin-top:12px}
#method-questions .uq-result-head h3{margin:0}
#method-questions .uq-record{border-top:1px solid #e8edf5;padding:20px 0;scroll-margin-top:12px}
#method-questions .uq-record-heading h3{margin:0 0 4px}
#method-questions .uq-record-selected{border-left:3px solid #1d70f2;padding-left:12px}
#method-questions .uq-record .mq-detail-stats{margin:12px 0}
#method-questions .uq-record-analysis{background:#f7faff;border-radius:8px;padding:12px 16px;margin:14px 0;line-height:24px}
#method-questions .uq-record .mq-link{padding:0;font-size:12px}
#method-questions .uq-record .mq-turn{grid-template-columns:85px 55px minmax(0,1fr)}
@media(max-width:1200px){#method-questions .uq-stages{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:24px}}
@media(max-width:700px){#method-questions .uq-stages{grid-template-columns:minmax(0,1fr)}#method-questions .uq-detail-grid{grid-template-columns:minmax(0,1fr)}#method-questions .uq-record .mq-turn{grid-template-columns:85px minmax(0,1fr)}#method-questions .uq-record .mq-turn>div{grid-column:1/-1}#method-questions .mq-filters{align-items:center}#method-questions .uq-result-head{align-items:flex-start}}
`;
