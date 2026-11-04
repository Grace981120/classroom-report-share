import {attitudeSummaryVersion} from './attitude-summary-version.js';
import {attitudeData} from './attitude-data.js';

export function mountAttitudeSummary(root) {
  if (attitudeSummaryVersion === 'baseline' || root.dataset.attitudeSummary) return;
  const summary = root.querySelector(':scope > .attitude-summary');
  const basics = root.querySelector('#attitude-basics');
  const heading = basics?.querySelector('.section-heading h2');
  const analysis = basics?.querySelector('.attitude-insight p');
  if (!summary || !basics || !heading || !analysis) return;

  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet';
  stylesheet.href = new URL('./attitude-summary.css?v=20261019-title2', import.meta.url).href;
  document.head.append(stylesheet);

  summary.hidden = true;
  const legacyPosture = root.querySelector('#attitude-posture');
  if (legacyPosture && root.dataset.attitudeIteration !== '1.1') legacyPosture.hidden = true;
  root.prepend(basics);
  heading.textContent = '教学态度';
  heading.id = 'basics-title';
  heading.insertAdjacentHTML('afterend', `<span class="attitude-summary-score"><strong>${attitudeData.score.toFixed(1)}</strong><small>分</small></span><span class="tag attitude-summary-rating">优秀</span>`);
  analysis.textContent = root.dataset.attitudeIteration === '1.1'
    ? '准时到课、着装规范；提前下课、疑似代课及两次看手机线索需结合课堂情境核查。'
    : attitudeData.summary;
  basics.classList.add('attitude-dimension-summary');
  root.dataset.attitudeSummary = attitudeSummaryVersion;
  const destinations = root.dataset.attitudeExpansion === '1.2'
    ? ['#attitude-attendance','#attitude-attendance','#attitude-management','#attitude-attire','#attitude-sensitive','#attitude-anomaly','#attitude-anomaly','#attitude-anomaly']
    : root.dataset.attitudeIteration === '1.1'
      ? ['#attitude-management','#attitude-management','#attitude-management','#attitude-posture','#attitude-language','#attitude-anomaly','#attitude-anomaly','#attitude-anomaly']
      : ['#attitude-management','#attitude-management','#attitude-management','#attitude-body','#attitude-language','#attitude-management','#attitude-management','#attitude-management'];
  basics.querySelectorAll('[data-basic]').forEach((button,index) => {
    button.setAttribute('aria-label',`${attitudeData.basics[index].label}：${attitudeData.basics[index].value}${attitudeData.basics[index].unit || ''}，定位对应模块`);
    button.title = '点击定位对应模块；按住 Alt 点击查看原记录';
  });
  basics.addEventListener('click',event => {
    const button = event.target.closest('[data-basic]');
    if (!button || event.altKey) return;
    const target = root.querySelector(destinations[Number(button.dataset.basic)]);
    if (!target) return;
    event.stopPropagation();
    target.style.scrollMarginTop = '90px';
    target.scrollIntoView({behavior:'smooth',block:'start'});
    const targetHeading = target.querySelector('h2') || target;
    targetHeading.setAttribute('tabindex','-1');
    targetHeading.focus({preventScroll:true});
  });
}
