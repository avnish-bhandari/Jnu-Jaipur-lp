/* ============ NAVBAR SHRINK ON SCROLL ============ */
const nav = document.getElementById('mainNav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ============ HERO FADE-IN ANIMATION ============ */
const heroAnimatedEls = document.querySelectorAll('#hero [data-animate]');
if (heroAnimatedEls.length) {
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          heroObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  heroAnimatedEls.forEach((el, index) => {
    el.style.transitionDelay = `${index * 0.1}s`;
    heroObserver.observe(el);
  });
}

/* ============ CLOSE MOBILE MENU ON LINK CLICK ============ */
document.querySelectorAll('#navMenu .nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    const collapseEl = document.getElementById('navMenu');
    if (collapseEl.classList.contains('show')) {
      bootstrap.Collapse.getInstance(collapseEl).hide();
    }
  });
});

/* ============ SUBTLE PARALLAX ON HERO ============ */
const hero = document.getElementById('hero');

window.addEventListener('scroll', () => {
  const offset = window.scrollY;
  if (offset < window.innerHeight) {
    hero.style.backgroundPositionY = `${offset * 0.3}px`;
  }
});


/* ===== Specializations section: pill toggle ===== */
(function () {
  const section = document.getElementById('specializations');
  if (!section) return;

  section.querySelectorAll('.spec-pill').forEach((pill) => {
    pill.addEventListener('click', () => {
      section.querySelectorAll('.spec-pill').forEach((p) => p.classList.remove('active'));
      pill.classList.add('active');
    });
  });
})();


/* ===== Life at JNU: testimonial carousel ===== */
(function () {
  const section = document.getElementById('campusLife');
  if (!section) return;

  // Testimonial carousel
  const data = [
    {
      quote: "MBA gave me the exposure, confidence and opportunities to grow into the professional I am today. The MBA program here is truly transformative.",
      name: "Ritika Sharma", role: "MBA, Alumnus, 2023",
      avatar: "https://i.pravatar.cc/120?img=47"
    },
    {
      quote: "The faculty's mentorship and the industry-aligned curriculum helped me land my dream role before I even graduated.",
      name: "Arjun Mehta", role: "MBA, Alumnus, 2022",
      avatar: "https://i.pravatar.cc/120?img=12"
    },
    {
      quote: "From international collaborations to vibrant campus life, JNU shaped me as a leader and a global citizen.",
      name: "Sneha Kapoor", role: "MBA, Alumnus, 2024",
      avatar: "https://i.pravatar.cc/120?img=32"
    }
  ];

  const body = document.getElementById('clBody');
  const quoteEl = document.getElementById('clQuote');
  const nameEl = document.getElementById('clName');
  const roleEl = document.getElementById('clRole');
  const avatarEl = document.getElementById('clAvatar');
  let idx = 0;
  let timer;

  function show(i) {
    idx = (i + data.length) % data.length;
    body.classList.add('cl-fade');
    setTimeout(() => {
      quoteEl.textContent = '"' + data[idx].quote + '"';
      nameEl.textContent = data[idx].name;
      roleEl.textContent = data[idx].role;
      avatarEl.src = data[idx].avatar;
      body.classList.remove('cl-fade');
    }, 250);
  }

  function startAuto() {
    stopAuto();
    timer = setInterval(() => show(idx + 1), 6000);
  }
  function stopAuto() { if (timer) clearInterval(timer); }

  document.getElementById('clPrev').addEventListener('click', () => { show(idx - 1); startAuto(); });
  document.getElementById('clNext').addEventListener('click', () => { show(idx + 1); startAuto(); });

  const box = section.querySelector('.cl-testimonial');
  box.addEventListener('mouseenter', stopAuto);
  box.addEventListener('mouseleave', startAuto);

  startAuto();
})();


/* ===== FAQ Section: accordion ===== */
(function () {
  const section = document.getElementById('faqs');
  if (!section) return;

  // Accordion (one open at a time)
  const items = section.querySelectorAll('.af-faq-item');
  function close(item) {
    item.classList.remove('open');
    const a = item.querySelector('.af-faq-a');
    if (a) a.style.maxHeight = null;
    const q = item.querySelector('.af-faq-q');
    if (q) q.setAttribute('aria-expanded', 'false');
  }
  function open(item) {
    item.classList.add('open');
    const a = item.querySelector('.af-faq-a');
    if (a) a.style.maxHeight = a.scrollHeight + 'px';
    const q = item.querySelector('.af-faq-q');
    if (q) q.setAttribute('aria-expanded', 'true');
  }

  items.forEach((item) => {
    const btn = item.querySelector('.af-faq-q');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(close);
      if (!isOpen) open(item);
    });
  });

  // Open first item by default for inviting UX
  if (items.length > 0) {
    open(items[0]);
  }

  // Keep open answer sized correctly on resize
  window.addEventListener('resize', () => {
    section.querySelectorAll('.af-faq-item.open .af-faq-a').forEach((a) => {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  });
})();


/* ===== Hero Lead Form & Apply Scroll Logic ===== */
(function () {
  const form = document.getElementById('heroLeadForm');
  const card = document.getElementById('leadFormCard');
  const successState = document.getElementById('formSuccessState');
  const resetBtn = document.getElementById('btnResetForm');
  const submitBtn = document.getElementById('btnLeadSubmit');
  const submitText = submitBtn ? submitBtn.querySelector('.submit-text') : null;
  const submitSpinner = submitBtn ? submitBtn.querySelector('.spinner-border') : null;
  const applicantNameSpan = document.getElementById('successUserName');
  const downloadBrochureBtn = document.getElementById('btnDownloadBrochureNow');

  if (!form || !card) return;

  // Real-time input clearing of error states
  form.querySelectorAll('input, select').forEach((input) => {
    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
    });
    input.addEventListener('change', () => {
      input.classList.remove('is-invalid');
    });
  });

  // Phone input formatting: only allow digits (up to 10)
  const phoneInput = document.getElementById('leadPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').slice(0, 10);
    });
  }

  // Validate form fields
  function validateForm() {
    let isValid = true;

    const name = document.getElementById('leadName');
    if (!name || !name.value.trim() || name.value.trim().length < 2) {
      if (name) name.classList.add('is-invalid');
      isValid = false;
    } else {
      name.classList.remove('is-invalid');
    }

    const email = document.getElementById('leadEmail');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !email.value.trim() || !emailRegex.test(email.value.trim())) {
      if (email) email.classList.add('is-invalid');
      isValid = false;
    } else {
      email.classList.remove('is-invalid');
    }

    const phone = document.getElementById('leadPhone');
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phone.value.trim() || !phoneRegex.test(phone.value.trim())) {
      if (phone) phone.classList.add('is-invalid');
      isValid = false;
    } else {
      phone.classList.remove('is-invalid');
    }

    const spec = document.getElementById('leadSpecialization');
    if (!spec || !spec.value) {
      if (spec) spec.classList.add('is-invalid');
      isValid = false;
    } else {
      spec.classList.remove('is-invalid');
    }

    const city = document.getElementById('leadCity');
    if (!city || !city.value.trim()) {
      if (city) city.classList.add('is-invalid');
      isValid = false;
    } else {
      city.classList.remove('is-invalid');
    }

    const consent = document.getElementById('leadConsent');
    if (!consent || !consent.checked) {
      if (consent) consent.classList.add('is-invalid');
      isValid = false;
    } else {
      consent.classList.remove('is-invalid');
    }

    return isValid;
  }

  // Handle submit with feedback
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Loading state
    if (submitBtn) submitBtn.disabled = true;
    if (submitText) submitText.classList.add('d-none');
    if (submitSpinner) submitSpinner.classList.remove('d-none');

    const enteredName = document.getElementById('leadName') ? document.getElementById('leadName').value.trim() : '';

    setTimeout(() => {
      // Transition to success state
      form.classList.add('d-none');
      if (applicantNameSpan) {
        applicantNameSpan.textContent = enteredName || 'Applicant';
      }
      if (successState) {
        successState.classList.remove('d-none');
      }

      // Reset submit button state
      if (submitBtn) submitBtn.disabled = false;
      if (submitText) submitText.classList.remove('d-none');
      if (submitSpinner) submitSpinner.classList.add('d-none');
    }, 600);
  });

  // Handle reset form
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
      form.classList.remove('d-none');
      if (successState) successState.classList.add('d-none');
    });
  }

  // Handle brochure download button in success state
  if (downloadBrochureBtn) {
    downloadBrochureBtn.addEventListener('click', (e) => {
      e.preventDefault();
      downloadBrochureBtn.innerHTML = '<i class="bi bi-check2-circle me-1"></i> Brochure Download Started!';
      setTimeout(() => {
        downloadBrochureBtn.innerHTML = '<i class="bi bi-file-earmark-pdf-fill me-1"></i> Download MBA Brochure (PDF)';
      }, 3000);
    });
  }

  // Smooth scroll to lead form on any "#apply" or ".js-scroll-to-form" clicks
  function scrollToForm(e) {
    e.preventDefault();
    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    card.classList.remove('highlight-pulse');
    void card.offsetWidth; // trigger reflow
    card.classList.add('highlight-pulse');
    setTimeout(() => {
      const nameInput = document.getElementById('leadName');
      if (nameInput) nameInput.focus();
    }, 600);
  }

  document.querySelectorAll('a[href="#apply"], .js-scroll-to-form').forEach((el) => {
    el.addEventListener('click', scrollToForm);
  });

  // Brochure download buttons: also smoothly scroll to form
  document.querySelectorAll('.js-open-brochure, a[href="#brochure"]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToForm(e);
    });
  });
})();