// Styles belong only to the teaching-interaction 1.1.4 dashboard.
export const interactionDashboardStyles=`
#method-interaction .mi-module-analysis{display:flex;align-items:flex-start;gap:7px;margin:12px 0 20px;padding:11px 12px;border-radius:4px;background:#edf6ff;color:var(--secondary);font-size:12px;line-height:20px}
#method-interaction .mi-module-analysis b{color:#1d70f2;font-size:15px;line-height:20px}
#method-interaction .method-interaction-grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}
#method-interaction .mi-dashboard-card{box-sizing:border-box;min-width:0;padding:20px!important;border:1px solid var(--border)!important;border-radius:8px!important;background:#fff}
#method-interaction .mi-dashboard-head,#method-interaction .mi-dashboard-card.mi-inline .mi-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:32px;margin-bottom:0}
#method-interaction .mi-dashboard-head h3,#method-interaction .mi-dashboard-card.mi-inline .mi-heading h3{display:flex;align-items:center;gap:4px;margin:0;font-size:14px;line-height:24px;font-weight:600;color:var(--primary)}
#method-interaction .mi-dashboard-card.mi-inline{padding:20px!important}
#method-interaction .mi-switch{display:flex;padding:3px;border:1px solid var(--border);border-radius:8px;background:#fff}
#method-interaction .mi-switch button{padding:4px 12px;border-radius:4px;font-size:12px;line-height:20px;color:var(--secondary)}
#method-interaction .mi-switch button[aria-selected=true]{background:#eaf7f2;color:#15966c}
#method-interaction .mi-chart-panel{display:flex;justify-content:center;margin-top:10px}
#method-interaction .mi-chart-panel .method-chart-button{margin-top:0}
#method-interaction .mi-chart-panel .method-analysis-svg{width:270px;height:270px}
#method-interaction .mi-dashboard-card.mi-inline .mi-radar{margin-top:2px}
#method-interaction .mi-dashboard-card.mi-inline .mi-radar svg{height:270px}
#method-interaction .mi-dashboard-card.mi-inline .mi-legend{margin-top:-34px}
@media(max-width:850px){#method-interaction .method-interaction-grid{grid-template-columns:1fr}}
@media(max-width:500px){#method-interaction .mi-dashboard-head{flex-wrap:wrap}#method-interaction .mi-switch{width:100%}#method-interaction .mi-switch button{flex:1;white-space:nowrap}}
`;
