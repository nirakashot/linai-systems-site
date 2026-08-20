(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-menu a');

  function closeMenu() {
    if (!navToggle || !navMenu) return;
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.querySelector('.sr-only').textContent = 'Open navigation';
    navMenu.classList.remove('is-open');
  }

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

  const steps = [
    {
      customer: 'I’d like two chicken lo mein and one order of spring rolls.',
      ai: 'Two chicken lo mein and one order of spring rolls. Is that correct?',
      note: 'LinAI follows the restaurant\'s menu and reads the order back for confirmation.',
      cart: 'Awaiting confirmation', status: 'QUEUED', ticket: 'Waiting for confirmation', foot: 'Kitchen workflow', printed: false
    },
    {
      customer: 'Yes, that’s correct. Pickup, please.',
      ai: 'Your pickup order is confirmed. The kitchen ticket is being sent.',
      note: 'The caller hears the order confirmed before the ticket moves into the restaurant workflow.',
      cart: 'Order confirmed', status: 'CONFIRMED', ticket: 'Confirmed · sending ticket', foot: 'Preparing ticket', printed: false
    },
    {
      customer: 'Thank you.',
      ai: 'Thank you. Your pickup order is on its way to the kitchen.',
      note: 'The confirmed sample order is now represented as a print-ready kitchen ticket.',
      cart: 'Ticket printed', status: 'PRINTED', ticket: 'Printed for kitchen', foot: 'Sent to kitchen workflow', printed: true
    }
  ];
  const navSteps = [...document.querySelectorAll('[data-step-nav]')];
  const playButton = document.querySelector('[data-play]');
  let activeStep = 0;
  let playTimer;

  function showStep(index) {
    activeStep = index;
    const step = steps[index];
    document.querySelector('[data-customer-copy]').textContent = step.customer;
    document.querySelector('[data-ai-copy]').textContent = step.ai;
    document.querySelector('[data-step-note]').textContent = step.note;
    document.querySelector('[data-cart-state]').lastChild.textContent = ` ${step.cart}`;
    document.querySelector('[data-cart-state]').classList.toggle('is-complete', step.printed);
    document.querySelector('[data-ticket-status]').textContent = step.status;
    document.querySelector('[data-ticket-copy]').textContent = step.ticket;
    document.querySelector('[data-ticket-foot]').textContent = step.foot;
    document.querySelector('.ticket-dot').classList.toggle('is-printed', step.printed);
    document.querySelector('[data-step-count]').textContent = `STEP 0${index + 1} / 03`;
    navSteps.forEach((item, itemIndex) => item.classList.toggle('is-current', itemIndex === index));
  }

  navSteps.forEach((item, index) => item.querySelector('button').addEventListener('click', () => {
    window.clearTimeout(playTimer);
    if (playButton) playButton.setAttribute('aria-pressed', 'false');
    showStep(index);
  }));

  if (playButton) {
    playButton.addEventListener('click', () => {
      const isPlaying = playButton.getAttribute('aria-pressed') === 'true';
      window.clearTimeout(playTimer);
      if (isPlaying) {
        playButton.setAttribute('aria-pressed', 'false');
        playButton.innerHTML = '<span aria-hidden="true">▶</span> Play sample';
        return;
      }
      activeStep = 0;
      playButton.setAttribute('aria-pressed', 'true');
      playButton.innerHTML = '<span aria-hidden="true">■</span> Playing sample';
      const advance = () => {
        showStep(activeStep);
        if (activeStep < steps.length - 1) {
          activeStep += 1;
          playTimer = window.setTimeout(advance, 1500);
        } else {
          playButton.setAttribute('aria-pressed', 'false');
          playButton.innerHTML = '<span aria-hidden="true">▶</span> Play sample';
        }
      };
      advance();
    });
  }

  const form = document.querySelector('[data-pilot-form]');
  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = form.querySelector('[data-form-status]');
      const fields = [...form.querySelectorAll('[required]')];
      const firstMissing = fields.find((field) => !field.value.trim());
      if (firstMissing) {
        status.textContent = 'Please complete the required fields before opening your email app.';
        firstMissing.focus();
        return;
      }
      const data = new FormData(form);
      const subject = encodeURIComponent(`14-day pilot request — ${data.get('restaurant')}`);
      const body = encodeURIComponent([
        'Hello LinAI Systems,', '',
        'I would like to request a 14-day pilot.', '',
        `Restaurant name: ${data.get('restaurant')}`,
        `Contact name: ${data.get('name')}`,
        `Phone or email: ${data.get('contact')}`,
        `Rough daily phone orders: ${data.get('dailyOrders')}`, '',
        'Thank you.'
      ].join('\n'));
      status.textContent = 'Opening a draft in your email app. If it does not open, use info@linaisystems.com.';
      window.location.href = `mailto:info@linaisystems.com?subject=${subject}&body=${body}`;
    });
  }
})();
