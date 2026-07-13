
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzhp057KM4iuwhN1idzSytRmqFRcRfOuNEYOpNt4nmompZoUyHcgnWOVjSC1CuKaKlL1g/exec';
const PROGRAM_EMAIL = 'citizenship@harvardiop.org';
function qs(name){return new URLSearchParams(location.search).get(name)}
function cohortForDate(d=new Date()){
  const m=d.getMonth()+1, day=d.getDate();
  if((m===7&&day>=1)||m===8||m===9) return 'Register soon! Our next cohort of classes starts in September.';
  if(m===10||m===11||m===12||m===1||m===2) return 'Register soon! Our next cohort of classes starts in February.';
  return 'Register soon! Our next cohort of classes starts in June.';
}
function showToast(msg){const t=document.querySelector('.toast'); if(!t)return; t.textContent=msg; t.style.display='block'; setTimeout(()=>t.style.display='none',4200)}
function applyPartnerFromUrl(){const partner=qs('partner'); if(!partner)return; document.querySelectorAll('select[name="partner"]').forEach(s=>{[...s.options].forEach(o=>{if(o.value===partner)s.value=partner})}); const reg=document.querySelector('#register'); if(reg) setTimeout(()=>reg.scrollIntoView({behavior:'smooth'}),200)}
async function submitForm(form){
  const success = form.parentElement.querySelector('.success-message');
  const fd = new FormData(form);
  fd.append('cohort', cohortForDate());
  fd.append('pageLanguage', document.documentElement.lang || 'en');
  fd.append('pageUrl', location.href);
  const submit = form.querySelector('button[type="submit"]');
  const old = submit ? submit.textContent : '';
  if(submit){submit.disabled=true; submit.textContent='Sending...'}
  try{
    if(APPS_SCRIPT_URL.includes('PASTE_YOUR')){
      console.warn('Apps Script URL not configured. Submission saved locally for testing.');
      localStorage.setItem('hcp_last_demo_submission', JSON.stringify(Object.fromEntries(fd.entries())));
    } else {
      await fetch(APPS_SCRIPT_URL,{method:'POST',body:fd,mode:'no-cors'});
    }
    form.reset();
    document.querySelectorAll('[data-cohort]').forEach(el=>el.textContent = cohortForDate());
    if(success) success.style.display='block';
    showToast('Thank you. Your message was received.');
  } catch(e){
    console.error(e); showToast('There was a connection issue. Please email '+PROGRAM_EMAIL+'.');
  } finally { if(submit){submit.disabled=false; submit.textContent=old} }
}
function initCounters(){const els=document.querySelectorAll('[data-count]');const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const target=+el.dataset.count;const suffix=el.dataset.suffix||'';const prefix=el.dataset.prefix||'';const label=el.dataset.label||'';let start=0;const dur=1200;const t0=performance.now();function tick(t){const p=Math.min((t-t0)/dur,1);const val=Math.floor(target*(1-Math.pow(1-p,3)));el.textContent=prefix+val.toLocaleString()+suffix+label;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);obs.unobserve(el)})},{threshold:.25});els.forEach(e=>obs.observe(e))}
function init(){
  document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('open'));
  document.querySelectorAll('form[data-form-type]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();submitForm(form)}));
  document.querySelectorAll('[data-cohort]').forEach(el=>el.textContent=cohortForDate());
  document.querySelectorAll('.partner-link').forEach(a=>a.addEventListener('click',()=>{const p=a.dataset.partner;document.querySelectorAll('select[name="partner"]').forEach(s=>s.value=p);showToast('Referral source selected: '+p)}));
  applyPartnerFromUrl(); initCounters();
}
document.addEventListener('DOMContentLoaded',init);
