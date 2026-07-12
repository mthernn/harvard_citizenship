
const APPS_SCRIPT_URL = 'https://script.google.com/macros/u/8/s/AKfycbxFzbCwE5XcHgQVG4BY3dNy_gAVef41p9T6YvuZrYmQrAPb8490INPecaGQx84Cn8q2Zg/exec';
const PROGRAM_EMAIL = 'citizenship@harvardiop.org';
function cohortForDate(d=new Date()){
  const y=d.getFullYear(); const m=d.getMonth()+1; const day=d.getDate();
  const mmdd = m*100+day;
  if(mmdd>=701 && mmdd<=930) return 'September cohort';
  if(mmdd>=301 && mmdd<=630) return 'June cohort';
  return 'February cohort';
}
function qs(name){return new URLSearchParams(window.location.search).get(name)}
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
      console.warn('Apps Script URL not configured.');
      localStorage.setItem('hcp_last_demo_submission', JSON.stringify(Object.fromEntries(fd.entries())));
    } else {
      await fetch(APPS_SCRIPT_URL,{method:'POST',body:fd,mode:'no-cors'});
    }
    form.reset();
    const chip = form.querySelector('.cohort-chip'); if(chip) chip.textContent = cohortForDate();
    if(success) success.style.display='block';
    showToast('Thank you. Your message was received.');
  } catch(e){
    console.error(e); showToast('There was a connection issue. Please email '+PROGRAM_EMAIL+'.');
  } finally { if(submit){submit.disabled=false; submit.textContent=old} }
}
function initCounters(){const els=document.querySelectorAll('[data-count]');const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(!entry.isIntersecting)return;const el=entry.target;const target=+el.dataset.count;const suffix=el.dataset.suffix||'';let start=0;const dur=1200;const t0=performance.now();function tick(t){const p=Math.min((t-t0)/dur,1);const val=Math.floor(target*(1-Math.pow(1-p,3)));el.textContent=val.toLocaleString()+suffix;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick);obs.unobserve(el)})},{threshold:.25});els.forEach(e=>obs.observe(e))}
function init(){
  document.querySelector('.menu-toggle')?.addEventListener('click',()=>document.querySelector('.nav-links')?.classList.toggle('open'));
  document.querySelectorAll('form[data-form-type]').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();submitForm(form)}));
  document.querySelectorAll('[data-cohort]').forEach(el=>el.textContent=cohortForDate());
  document.querySelectorAll('.partner-link').forEach(a=>a.addEventListener('click',()=>{const p=a.dataset.partner;document.querySelectorAll('select[name="partner"]').forEach(s=>s.value=p);showToast('Referral source selected: '+p)}));
  applyPartnerFromUrl(); initCounters();
}
document.addEventListener('DOMContentLoaded',init);
