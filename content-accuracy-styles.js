export const contentAccuracyStyles = `
.ca-section .attitude-insight{margin-bottom:20px}
.ca-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
.ca-card{min-width:0;text-align:left;border:1px solid var(--border);border-radius:8px;background:#fcfdff;padding:18px 20px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:7px 16px;align-items:start}
.ca-card:hover{background:#f4f8ff;border-color:#bed6fc;box-shadow:0 5px 16px #1d70f20d}
.ca-card h3{font-size:14px;line-height:24px;color:var(--primary)}
.ca-card p{grid-column:1 / -1;font-size:13px;line-height:22px;color:var(--secondary)}
.ca-status{font-size:12px;line-height:22px;padding:0 8px;border-radius:4px;color:#c47732;background:#fff6ea;border:1px solid #f0d2ae;white-space:nowrap}
.ca-dialog{width:760px;max-width:calc(100% - 32px);max-height:86vh}
.ca-head{padding:23px 28px 18px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--border)}
.ca-head h2{font-size:21px;line-height:32px;color:var(--primary)}
.ca-close{width:32px;height:32px;border-radius:50%;font-size:24px;line-height:28px;color:#939aa8}
.ca-close:hover{background:#f0f3fc}
.ca-body{padding:22px 28px 28px;overflow:auto}
.ca-lead{display:flex;align-items:center;gap:10px;margin-bottom:18px}
.ca-lead strong{font-size:16px;color:var(--primary)}
.ca-meta{font-size:12px;color:var(--muted);margin-bottom:8px}
.ca-block{padding:15px 17px;border:1px solid var(--border);border-radius:8px;background:#fcfdff;margin-top:12px}
.ca-block h3{font-size:14px;line-height:24px;color:var(--primary);margin:0 0 6px}
.ca-block p{font-size:13px;line-height:23px;color:var(--secondary);margin:0}
.ca-quote{border-left:3px solid var(--blue);background:#f5f8ff}
.ca-quote p{color:var(--primary)}
.ca-context{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.ca-context .ca-block{margin-top:0}
.ca-formula{font-variant-numeric:tabular-nums}
.ca-dialog mark{background:#fff0b8;color:inherit;padding:1px 2px}
@media(max-width:700px){.ca-grid,.ca-context{grid-template-columns:1fr}.ca-card{padding:16px}.ca-head{padding:18px 20px 14px}.ca-body{padding:18px 20px 22px}.ca-head h2{font-size:18px}.ca-dialog{max-width:calc(100% - 20px)}}
@media print{.ca-card{break-inside:avoid}.ca-dialog{display:none!important}}
`;
