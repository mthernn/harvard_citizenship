const APPS_SCRIPT_URL = 'PASTE_YOUR_DEPLOYED_APPS_SCRIPT_WEB_APP_URL_HERE';
const PROGRAM_EMAIL = 'citizenship@harvardiop.org';

function cohortForDate(d = new Date()) {
  const mmdd = (d.getMonth() + 1) * 100 + d.getDate();
  if (mmdd >= 701 && mmdd <= 930) return 'September cohort';
  if (mmdd >= 301 && mmdd <= 630) return 'June cohort';
  return 'February cohort';
}

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showToast(message) {
  const toast = document.querySelector('.toast');
  if (!toast) return;
  toast.textContent = message;
  toast.style.display = 'block';
  setTimeout(() => { toast.style.display = 'none'; }, 4600);
}

function applyPartnerFromUrl() {
  const partner = qs('partner');
  if (!partner) return;
  document.querySelectorAll('select[name="partner"]').forEach(select => {
    [...select.options].forEach(option => {
      if (option.value === partner) select.value = partner;
    });
  });
  const register = document.querySelector('#register');
  if (register) setTimeout(() => register.scrollIntoView({ behavior: 'smooth' }), 250);
}

async function submitForm(form) {
  const success = form.parentElement.querySelector('.success-message');
  const fd = new FormData(form);
  fd.append('cohort', cohortForDate());
  fd.append('pageLanguage', document.documentElement.lang || 'en');
  fd.append('pageUrl', location.href);

  const submit = form.querySelector('button[type="submit"]');
  const oldText = submit ? submit.textContent : '';
  if (submit) {
    submit.disabled = true;
    submit.textContent = form.dataset.sendingText || 'Sending...';
  }

  try {
    if (APPS_SCRIPT_URL.includes('PASTE_YOUR')) {
      console.warn('Apps Script URL is not configured yet. Submission saved in browser demo storage only.');
      localStorage.setItem('hcp_last_demo_submission', JSON.stringify(Object.fromEntries(fd.entries())));
      showToast('Demo mode: connect Apps Script before launch.');
    } else {
      await fetch(APPS_SCRIPT_URL, { method: 'POST', body: fd, mode: 'no-cors' });
      showToast(form.dataset.successToast || 'Thank you. Your message was received.');
    }
    form.reset();
    if (success) success.style.display = 'block';
  } catch (error) {
    console.error(error);
    showToast('There was a connection issue. Please email ' + PROGRAM_EMAIL + '.');
  } finally {
    if (submit) {
      submit.disabled = false;
      submit.textContent = oldText;
    }
  }
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.count || 0);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const duration = 1200;
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const value = Math.floor(target * (1 - Math.pow(1 - progress, 3)));
        el.textContent = value.toLocaleString() + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.25 });
  counters.forEach(counter => observer.observe(counter));
}

function init() {
  document.querySelector('.menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('open');
  });
  document.querySelectorAll('form[data-form-type]').forEach(form => {
    form.addEventListener('submit', event => {
      event.preventDefault();
      submitForm(form);
    });
  });
  document.querySelectorAll('[data-cohort]').forEach(el => { el.textContent = cohortForDate(); });
  document.querySelectorAll('.partner-link').forEach(link => {
    link.addEventListener('click', event => {
      const partner = link.dataset.partner;
      document.querySelectorAll('select[name="partner"]').forEach(select => { select.value = partner; });
      showToast('Referral source selected: ' + partner);
    });
  });
  applyPartnerFromUrl();
  initCounters();
}

document.addEventListener('DOMContentLoaded', init);
