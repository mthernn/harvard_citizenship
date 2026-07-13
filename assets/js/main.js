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
function applyPartnerFromUrl(){
  const partner=qs('partner');
  if(!partner)return;
  document.querySelectorAll('select[name="partnerName"]').forEach(s=>{
    [...s.options].forEach(o=>{if(o.value===partner)s.value=partner});
  });
  const reg=document.querySelector('#register');
  if(reg) setTimeout(()=>reg.scrollIntoView({behavior:'smooth'}),200);
}
async function submitForm(form){
  const success = form.parentElement.querySelector('.success-message');
  const fd = new FormData(form);
  const payload = Object.fromEntries(fd.entries());
  payload.cohort = cohortForDate();
  payload.pageLanguage = document.documentElement.lang || 'en';
  payload.pageUrl = location.href;
  if(!payload.submissionType){
    if(payload.formType === 'student_registration') payload.submissionType = 'registration';
    else if(payload.formType === 'tutor_interest') payload.submissionType = 'tutorInterest';
    else payload.submissionType = payload.formType || 'contact';
  }
  console.log('Sending form payload:', payload);
  const submit = form.querySelector('button[type="submit"]');
  const old = submit ? submit.textContent : '';
  if(submit){submit.disabled=true; submit.textContent='Sending...'}
  try{
    if(APPS_SCRIPT_URL.includes('PASTE_YOUR')){
      console.warn('Apps Script URL not configured. Submission saved locally for testing.');
      localStorage.setItem('hcp_last_demo_submission', JSON.stringify(payload));
    } else {
      await fetch(APPS_SCRIPT_URL,{method:'POST',body:JSON.stringify(payload),headers:{'Content-Type':'text/plain;charset=utf-8'},mode:'no-cors'});
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
  document.querySelectorAll('.partner-link').forEach(a=>a.addEventListener('click',()=>{
    const p=a.dataset.partner;
    document.querySelectorAll('select[name="partnerName"]').forEach(s=>s.value=p);
    showToast('Referral source selected: '+p);
  }));
  applyPartnerFromUrl();
  initCounters();
}
document.addEventListener('DOMContentLoaded',init);

.partner-marquee {
  position: relative;
  overflow: hidden;
  width: 100%;
  padding: 24px 0;
  mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, #000 8%, #000 92%, transparent);
}

.partner-track {
  display: flex;
  align-items: center;
  gap: 40px;
  width: max-content;
  animation: partner-scroll 42s linear infinite;
  will-change: transform;
}

.partner-marquee:hover .partner-track {
  animation-play-state: paused;
}

.partner-logo-card {
  flex: 0 0 auto;
  width: 220px;
  min-height: 150px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 14px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  background: rgba(255, 255, 255, 0.88);
  border: 1px solid rgba(20, 37, 63, 0.12);
  border-radius: 18px;
  box-shadow: 0 14px 32px rgba(20, 37, 63, 0.08);
  transition: transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease;
}

.partner-logo-card:hover,
.partner-logo-card:focus-visible {
  transform: translateY(-4px);
  background: #ffffff;
  border-color: rgba(165, 28, 48, 0.28);
  box-shadow: 0 18px 40px rgba(20, 37, 63, 0.14);
}

.partner-logo-card img {
  display: block;
  width: 100%;
  max-width: 150px;
  height: 72px;
  object-fit: contain;
  filter: grayscale(1) saturate(0) contrast(1.08);
  opacity: 0.72;
  transition: filter 180ms ease, opacity 180ms ease, transform 180ms ease;
}

.partner-logo-card:hover img,
.partner-logo-card:focus-visible img {
  filter: grayscale(0) saturate(1) contrast(1);
  opacity: 1;
  transform: scale(1.03);
}

.partner-logo-card span {
  font-size: 0.86rem;
  line-height: 1.25;
  font-weight: 700;
  color: var(--navy, #14253f);
}

@keyframes partner-scroll {
  from {
    transform: translateX(0);
  }

  to {
    transform: translateX(calc(-50% - 20px));
  }
}

@media (prefers-reduced-motion: reduce) {
  .partner-track {
    animation: none;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
  }

  .partner-marquee {
    overflow: visible;
    mask-image: none;
    -webkit-mask-image: none;
  }
}

@media (max-width: 700px) {
  .partner-track {
    gap: 28px;
    animation-duration: 56s;
  }

  .partner-logo-card {
    width: 190px;
    min-height: 140px;
    padding: 20px;
  }

  .partner-logo-card img {
    max-width: 130px;
    height: 64px;
  }
}
