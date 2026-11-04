export const languageExpressionStyles=`
@media(min-width:851px){#method-language .method-language-grid{grid-template-columns:repeat(6,minmax(0,1fr))}}
.ml-summary{display:flex;gap:28px;flex-wrap:wrap;background:#fcfdff;border:1px solid var(--border);border-radius:8px;padding:12px 16px;margin-bottom:18px}
.ml-summary span{font-size:12px;line-height:20px;color:var(--muted)}
.ml-summary strong{margin-left:7px;font-size:16px;line-height:24px;font-weight:600;color:var(--primary)}
.ml-evidence{border:1px solid var(--border);border-radius:8px;padding:16px;margin-top:12px}
.ml-evidence-head{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.ml-evidence-head time{margin-left:auto;font-size:12px;line-height:20px;color:var(--muted)}
.ml-tag{border-radius:4px;padding:1px 7px;font-size:12px;line-height:20px;background:#edf4ff;color:var(--text-action)}
.ml-tag.is-review{background:#fff3e9;color:#d66018}.ml-tag.is-clear,.ml-tag.is-pause{background:#eafaf3;color:#068c59}
.ml-evidence blockquote{margin:0;font-size:14px;line-height:24px;color:var(--primary)}
.ml-evidence p{font-size:12px;line-height:20px;color:var(--muted);margin-top:8px}
.ml-basis{border-top:1px solid var(--border);padding-top:9px!important;margin-top:10px!important}
.ml-evidence mark{background:#fff0bd;color:inherit;padding:1px 0}
.ml-missing{border:1px dashed var(--border);border-radius:8px;padding:12px 14px;margin-top:12px;font-size:12px;line-height:20px;color:var(--muted)}
@media(max-width:560px){.ml-summary{gap:8px 16px;padding:10px 12px}.ml-evidence{padding:12px}.ml-evidence-head{align-items:flex-start;flex-wrap:wrap}.ml-evidence-head time{width:100%;margin-left:0}}
`;
