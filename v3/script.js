(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  const closeMenu = () => {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('.sr-only').textContent = 'Open navigation';
    navMenu.classList.remove('is-open');
  };

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.querySelector('.sr-only').textContent = isOpen ? 'Open navigation' : 'Close navigation';
      navMenu.classList.toggle('is-open', !isOpen);
    });
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const storySteps = [...document.querySelectorAll('[data-story-step]')];
  const storyTabs = [...document.querySelectorAll('[data-story-tab]')];
  const canvas = document.querySelector('[data-product-canvas]');
  const modules = [...document.querySelectorAll('[data-module]')];
  const progressLabel = document.querySelector('[data-progress-label]');
  const progressBar = document.querySelector('[data-progress-bar]');
  const transcriptStatus = document.querySelector('[data-transcript-status]');
  const cartStatus = document.querySelector('[data-cart-status]');
  const confirmation = document.querySelector('[data-confirmation]');
  const ticketStatus = document.querySelector('[data-ticket-status]');
  const canvasCaption = document.querySelector('[data-canvas-caption]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const states = [
    {
      label: '01 · HEAR',
      transcript: 'LISTENING',
      cart: 'BUILDING',
      confirmation: 'Awaiting caller confirmation',
      ticket: 'QUEUED',
      caption: 'Following the restaurant menu and combo choices.'
    },
    {
      label: '02 · CONFIRM',
      transcript: 'READ BACK',
      cart: 'CONFIRMED',
      confirmation: 'Confirmed with caller',
      ticket: 'READY',
      caption: 'Keeping the rice and included side attached to the combo.'
    },
    {
      label: '03 · PRINT',
      transcript: 'COMPLETE',
      cart: 'CONFIRMED',
      confirmation: 'Confirmed with caller',
      ticket: 'PRINTED',
      caption: 'Handing a readable thermal ticket to the kitchen workflow.'
    }
  ];

  const showStoryStep = (index) => {
    if (!canvas || !states[index]) return;
    const state = states[index];
    canvas.dataset.activeStep = String(index);
    storySteps.forEach((step, stepIndex) => step.classList.toggle('is-active', stepIndex === index));
    storyTabs.forEach((tab, tabIndex) => {
      tab.setAttribute('aria-selected', String(tabIndex === index));
      tab.tabIndex = tabIndex === index ? 0 : -1;
    });
    modules.forEach((module, moduleIndex) => module.classList.toggle('is-active', moduleIndex === index));
    progressLabel.textContent = state.label;
    progressBar.style.width = `${((index + 1) / states.length) * 100}%`;
    transcriptStatus.textContent = state.transcript;
    cartStatus.textContent = state.cart;
    confirmation.textContent = state.confirmation;
    ticketStatus.textContent = state.ticket;
    canvasCaption.textContent = state.caption;
  };

  if (storySteps.length && canvas) {
    showStoryStep(reduceMotion ? 2 : 0);
    storyTabs.forEach((tab, index) => {
      tab.addEventListener('click', () => showStoryStep(index));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const nextIndex = event.key === 'Home'
          ? 0
          : event.key === 'End'
            ? storyTabs.length - 1
            : (index + (event.key === 'ArrowRight' ? 1 : -1) + storyTabs.length) % storyTabs.length;
        storyTabs[nextIndex].focus();
        showStoryStep(nextIndex);
      });
    });
    if (!reduceMotion && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length) showStoryStep(Number(visible[0].target.dataset.storyStep));
      }, { rootMargin: '-30% 0px -45% 0px', threshold: [0, .1, .25] });
      storySteps.forEach((step) => observer.observe(step));
    }
  }

  const coverageHours = document.querySelector('#coverage-hours');
  const phoneOrders = document.querySelector('#phone-orders');
  const hoursOutput = document.querySelector('[data-hours-output]');
  const ordersOutput = document.querySelector('[data-orders-output]');
  const coverageValue = document.querySelector('[data-coverage-value]');
  const linaiFees = document.querySelector('[data-linai-fees]');
  const estimateDifference = document.querySelector('[data-estimate-difference]');
  const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const updateEstimator = () => {
    if (!coverageHours || !phoneOrders) return;
    const hours = Number(coverageHours.value);
    const orders = Number(phoneOrders.value);
    const monthlyCoverage = hours * 30 * 18;
    const monthlyFees = orders * 30 * 1.59;
    const difference = monthlyCoverage - monthlyFees;
    hoursOutput.textContent = `${hours.toLocaleString('en-US')} ${hours === 1 ? 'hour' : 'hours'}`;
    ordersOutput.textContent = `${orders} ${orders === 1 ? 'order' : 'orders'}`;
    coverageValue.textContent = money.format(monthlyCoverage);
    linaiFees.textContent = `− ${money.format(monthlyFees)}`;
    estimateDifference.textContent = difference < 0
      ? `− ${money.format(Math.abs(difference))}`
      : money.format(difference);
  };

  if (coverageHours && phoneOrders) {
    coverageHours.addEventListener('input', updateEstimator);
    phoneOrders.addEventListener('input', updateEstimator);
    updateEstimator();
  }

  const form = document.querySelector('[data-pilot-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const requiredFields = [...form.querySelectorAll('[required]')];
      const firstMissing = requiredFields.find((field) => !field.value.trim());
      if (firstMissing) {
        status.textContent = 'Please complete the required fields before opening your email app.';
        firstMissing.focus();
        return;
      }

      const data = new FormData(form);
      const subject = encodeURIComponent(`14-day pilot request — ${data.get('restaurant')}`);
      const body = encodeURIComponent([
        'Hello LinAI Systems,',
        '',
        'I would like to request a 14-day pilot.',
        '',
        `Restaurant name: ${data.get('restaurant')}`,
        `Contact name: ${data.get('name')}`,
        `Phone or email: ${data.get('contact')}`,
        `Rough daily phone orders: ${data.get('dailyOrders')}`,
        '',
        'Thank you.'
      ].join('\n'));
      status.textContent = 'Opening a draft in your email app. If it does not open, use info@linaisystems.com.';
      window.location.href = `mailto:info@linaisystems.com?subject=${subject}&body=${body}`;
    });
  }
})();
