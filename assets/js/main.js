
(function(){
  const current = document.body.dataset.page || 'home';
  const rootPath = document.body.dataset.rootPath || (current === 'home' ? './' : '../');
  // Header and footer are rendered once here so navigation/contact updates stay global.
  const navItems = [
    ['home', rootPath, 'Home'],
    ['menu', rootPath + 'menu/', 'Menu'],
    ['catering-services', rootPath + 'catering-services/', 'Catering services'],
    ['sandwich-shop', rootPath + 'sandwich-shop/', 'Sandwich shop'],
    ['contact', rootPath + 'contact/', 'Contact']
  ];
  const renderEnquiryFields = (sourceSection) => `
    <input type="hidden" name="form_type" value="enquiry">
    <input type="hidden" name="source_page" data-enquiry-meta="source_page" value="${current}">
    <input type="hidden" name="source_section" data-enquiry-meta="source_section" value="${sourceSection}">
    <input type="hidden" name="page_title" data-enquiry-meta="page_title">
    <input type="hidden" name="page_path" data-enquiry-meta="page_path">
    <input type="hidden" name="page_url" data-enquiry-meta="page_url">
    <div class="form-honeypot" aria-hidden="true">
      <label>Website <input type="text" name="website" tabindex="-1" autocomplete="off"></label>
    </div>
    <label class="form-consent">
      <input type="checkbox" name="consent" value="yes" required>
      <span>I consent to Crossley's using these details to respond to my enquiry. See our <a href="${rootPath}privacy-policy/">Privacy Policy</a>.</span>
    </label>
    <div class="form-turnstile" data-turnstile-container></div>
    <p class="form-status" data-form-status hidden></p>`;
  const header = document.getElementById('site-header');
  if(header){
    header.innerHTML = `
      <div class="topbar"><div class="container">
        <span><img src="${rootPath}assets/images/phone-call-icon.svg" alt=""> 0161 483 2727</span>
        <span><img src="${rootPath}assets/images/mail-icon.svg" alt=""> crossleyscatering@gmail.com</span>
        <span><img src="${rootPath}assets/images/location-pin.svg" alt=""> 377-379 Buxton Rd, Stockport, SK2 7EY</span>
      </div></div>
      <nav class="main-nav" aria-label="Main navigation"><div class="container nav-inner">
        <a class="nav-brand" href="${rootPath}" aria-label="Crossleys home">
          <img src="${rootPath}assets/images/crossleys-logo-dark.png" data-dark-logo="${rootPath}assets/images/crossleys-logo-dark.png" data-light-logo="${rootPath}assets/images/crossleys-logo-light.png" alt="Crossleys">
        </a>
        <ul class="nav-links" id="nav-links">
          ${navItems.map(([key, href, label]) => `<li><a href="${href}" ${key===current ? 'aria-current="page"' : ''}>${label}</a></li>`).join('')}
        </ul>
        <a class="nav-cta" href="${rootPath}contact/">Get a quote</a>
        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="nav-links">Menu</button>
      </div></nav>`;
  }
  const contact = document.getElementById('global-contact');
  if(contact){
    const includeFooterForm = current !== 'contact';
    contact.innerHTML = `
      <section class="footer-contact" aria-labelledby="footer-contact-title">
        <div class="container">
          <div class="footer-contact__grid${includeFooterForm ? '' : ' footer-contact__grid--compact'}">
            <div class="footer-contact__details">
              <img src="${rootPath}assets/images/crossleys-logo-light.png" alt="Crossleys" class="footer-logo">
              <h2 id="footer-contact-title">Get In Touch</h2>
              <p>Available for all your catering needs, celebrations, Weddings, Christenings, Birthdays, Funerals, Conferences, Business Lunches. For affordable and quality catering services in Stockport or Cheshire, call Crossley's on <strong>0161 483 2727</strong> or email us at <a href="mailto:crossleyscatering@gmail.com">crossleyscatering@gmail.com</a>.</p>
            </div>
            ${includeFooterForm ? `
            <form class="contact-form" action="/api/enquiry" method="post" data-enquiry-form>
              <div class="form-grid">
                <input type="text" name="name" placeholder="First Name" aria-label="First Name" required>
                <input type="text" name="surname" placeholder="Last Name" aria-label="Last Name">
                <input type="email" name="email" placeholder="Email" aria-label="Email" required>
                <input type="tel" name="phone" placeholder="Phone number" aria-label="Phone number" required>
              </div>
              <textarea name="message" placeholder="Message" aria-label="Message" required></textarea>
              ${renderEnquiryFields('footer-contact-form')}
              <button type="submit">Send</button>
            </form>
            ` : ''}
          </div>
          <div class="footer-contact__bottom">
            <nav class="policy-links" aria-label="Policy links">
              <a href="${rootPath}privacy-policy/">Privacy Policy</a>
              <a href="${rootPath}cookie-policy/">Cookie Policy</a>
              <a href="${rootPath}terms-and-conditions/">Terms &amp; Conditions</a>
            </nav>
            <p class="copyright">© 2021. The content on this website is owned by us and our licensors. Do not copy any content (including images) without our consent.</p>
          </div>
        </div>
      </section>`;
  }
  const footer = document.getElementById('site-footer');
  if(footer){ footer.innerHTML = `<button class="back-top" type="button" aria-label="Back to top">⌃</button>`; }

  const cookieChoiceKey = 'crossleys_cookie_choice';
  let memoryCookieChoice = null;
  const getCookieChoice = () => {
    try{
      return window.localStorage.getItem(cookieChoiceKey) || memoryCookieChoice;
    }catch(error){
      return memoryCookieChoice;
    }
  };
  const setCookieChoice = (choice) => {
    memoryCookieChoice = choice;
    try{
      window.localStorage.setItem(cookieChoiceKey, choice);
    }catch(error){
      // Privacy modes can block localStorage; the in-memory value still controls this page view.
    }
  };
  const applyCookieChoice = (choice) => {
    const optionalAccepted = choice === 'accepted';
    document.querySelectorAll('[data-cookie-embed]').forEach(embed => {
      const iframe = embed.querySelector('iframe[data-cookie-src]');
      const placeholder = embed.querySelector('.cookie-embed-placeholder');
      if(iframe){
        if(optionalAccepted && !iframe.src){
          iframe.src = iframe.dataset.cookieSrc;
        }
        if(!optionalAccepted && iframe.src){
          iframe.removeAttribute('src');
        }
      }
      if(placeholder){
        placeholder.hidden = optionalAccepted;
      }
    });
  };
  const updateCookieControls = () => {
    const choice = getCookieChoice();
    const banner = document.querySelector('[data-cookie-banner]');
    const settingsButton = document.querySelector('[data-cookie-open-global]');
    if(banner) banner.hidden = Boolean(choice);
    if(settingsButton) settingsButton.hidden = !choice;
    applyCookieChoice(choice);
  };
  const renderCookieControls = () => {
    if(document.querySelector('[data-cookie-banner]')) return;
    const controls = document.createElement('div');
    controls.innerHTML = `
      <aside class="cookie-banner" data-cookie-banner aria-label="Cookie choices">
        <div>
          <h2>Cookie choices</h2>
          <p>We use essential cookies to make the site work. Optional cookies are only used for embedded services such as Google Maps. You can accept or reject optional cookies at any time.</p>
          <p class="cookie-banner__links"><a href="${rootPath}cookie-policy/">Cookie Policy</a> <a href="${rootPath}privacy-policy/">Privacy Policy</a></p>
        </div>
        <div class="cookie-actions">
          <button class="btn white" type="button" data-cookie-choice="rejected">Reject Optional Cookies</button>
          <button class="btn" type="button" data-cookie-choice="accepted">Accept Optional Cookies</button>
        </div>
      </aside>
      <button class="cookie-settings-button" type="button" data-cookie-open-global data-cookie-open hidden>Cookie Settings</button>`;
    document.body.append(...controls.children);
    updateCookieControls();
  };
  renderCookieControls();

  document.addEventListener('click', function(e){
    const cookieChoiceButton = e.target.closest('[data-cookie-choice]');
    if(cookieChoiceButton){
      setCookieChoice(cookieChoiceButton.dataset.cookieChoice);
      updateCookieControls();
    }
    if(e.target.closest('[data-cookie-open]')){
      const banner = document.querySelector('[data-cookie-banner]');
      const settingsButton = document.querySelector('[data-cookie-open-global]');
      if(banner) banner.hidden = false;
      if(settingsButton) settingsButton.hidden = true;
    }
    if(e.target.classList.contains('nav-toggle')){
      const links = document.getElementById('nav-links');
      const open = links.classList.toggle('open');
      e.target.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if(e.target.classList.contains('back-top')) window.scrollTo({top:0, behavior:'smooth'});
    if(e.target.closest('.review-dots button')){
      const button = e.target.closest('.review-dots button');
      const dots = [...button.parentElement.querySelectorAll('button')];
      const grid = document.querySelector('.review-grid');
      const cards = grid ? [...grid.querySelectorAll('.review-card')] : [];
      const index = dots.indexOf(button);
      dots.forEach(dot => dot.classList.toggle('active', dot === button));
      if(cards[index]){
        grid.scrollTo({left: cards[index].offsetLeft - grid.offsetLeft, behavior: 'smooth'});
      }
    }
  });
  const enquiryForms = [...document.querySelectorAll('[data-enquiry-form]')];
  const setFormStatus = (form, message, tone) => {
    const status = form.querySelector('[data-form-status]');
    if(!status) return;
    status.textContent = message;
    status.hidden = !message;
    status.dataset.tone = tone || 'neutral';
  };
  const populateFormMeta = (form) => {
    const values = {
      source_page: current,
      page_title: document.title,
      page_path: window.location.pathname,
      page_url: window.location.href
    };
    form.querySelectorAll('[data-enquiry-meta]').forEach(input => {
      input.value = values[input.dataset.enquiryMeta] || input.value || '';
    });
  };
  const resetTurnstile = (form) => {
    if(window.turnstile){
      form.querySelectorAll('.cf-turnstile').forEach(widget => {
        if(widget.dataset.widgetId) window.turnstile.reset(widget.dataset.widgetId);
      });
    }
  };
  const loadTurnstile = (siteKey) => new Promise((resolve, reject) => {
    if(window.turnstile) return resolve();
    const existing = document.querySelector('script[data-turnstile-script]');
    if(existing){
      existing.addEventListener('load', resolve, { once:true });
      existing.addEventListener('error', reject, { once:true });
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.dataset.turnstileScript = 'true';
    script.addEventListener('load', resolve, { once:true });
    script.addEventListener('error', reject, { once:true });
    document.head.appendChild(script);
  });
  const setupTurnstile = async () => {
    if(!enquiryForms.length) return;
    try{
      const response = await fetch('/api/turnstile-config', { headers:{ accept:'application/json' } });
      if(!response.ok) return;
      const config = await response.json();
      if(!config.turnstileSiteKey) return;
      await loadTurnstile(config.turnstileSiteKey);
      enquiryForms.forEach(form => {
        const container = form.querySelector('[data-turnstile-container]');
        if(container && !container.querySelector('.cf-turnstile')){
          const widget = document.createElement('div');
          widget.className = 'cf-turnstile';
          container.appendChild(widget);
          widget.dataset.widgetId = window.turnstile.render(widget, { sitekey: config.turnstileSiteKey });
        }
      });
    }catch(error){
      enquiryForms.forEach(form => setFormStatus(form, 'Security check will appear when the site is running on Cloudflare Pages.', 'neutral'));
    }
  };
  enquiryForms.forEach(form => {
    populateFormMeta(form);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      populateFormMeta(form);
      const button = form.querySelector('button[type="submit"]');
      const originalText = button ? button.textContent : '';
      if(button){
        button.disabled = true;
        button.textContent = 'Sending...';
      }
      setFormStatus(form, 'Sending your enquiry...', 'neutral');
      try{
        const response = await fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { accept:'application/json' }
        });
        const result = await response.json().catch(() => ({}));
        if(response.status === 404){
          throw new Error('The enquiry form is ready for Cloudflare Pages. Please call or email us while previewing locally.');
        }
        if(!response.ok || !result.ok){
          throw new Error(result.message || 'The enquiry could not be sent.');
        }
        window.location.href = result.redirect || '/thank-you/';
      }catch(error){
        resetTurnstile(form);
        setFormStatus(form, error.message || 'Sorry, something went wrong. Please call or email us instead.', 'error');
      }finally{
        if(button){
          button.disabled = false;
          button.textContent = originalText;
        }
      }
    });
  });
  setupTurnstile();

  const reviewGrid = document.querySelector('.review-grid');
  const reviewDots = document.querySelector('.review-dots');
  if(reviewGrid && reviewDots){
    const dots = [...reviewDots.querySelectorAll('button')];
    const cards = [...reviewGrid.querySelectorAll('.review-card')];
    let reviewTicking = false;
    const setActiveReviewDot = () => {
      let closestIndex = 0;
      let closestDistance = Infinity;
      cards.forEach((card, index) => {
        const cardLeft = card.offsetLeft - reviewGrid.offsetLeft;
        const distance = Math.abs(cardLeft - reviewGrid.scrollLeft);
        if(distance < closestDistance){
          closestDistance = distance;
          closestIndex = index;
        }
      });
      dots.forEach((dot, index) => dot.classList.toggle('active', index === closestIndex));
      reviewTicking = false;
    };
    reviewGrid.addEventListener('scroll', () => {
      if(!reviewTicking){
        reviewTicking = true;
        requestAnimationFrame(setActiveReviewDot);
      }
    }, { passive:true });
  }

  // The stats image keeps a stronger parallax effect; generic reveal animations were removed.
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const statsSection = document.querySelector('.home-stats');
    let ticking = false;
    const updateParallax = () => {
      const viewport = window.innerHeight || 1;
      if(statsSection){
        const rect = statsSection.getBoundingClientRect();
        const progress = (viewport - rect.top) / (viewport + rect.height);
        const clamped = Math.max(0, Math.min(1, progress));
        const shift = (clamped - 0.5) * 260;
        statsSection.style.setProperty('--stats-bg-y', `${shift}px`);
      }
      ticking = false;
    };
    const requestParallax = () => {
      if(!ticking){
        window.requestAnimationFrame(updateParallax);
        ticking = true;
      }
    };
    updateParallax();
    window.addEventListener('scroll', requestParallax, { passive: true });
    window.addEventListener('resize', requestParallax);
  }

  if(header){
    const hero = document.querySelector('.home-hero, .hero');
    const logo = header.querySelector('.nav-brand img');
    // Once the hero is passed, switch to the dark glass header and light logo for contrast.
    const updateHeaderTheme = () => {
      if(!hero) return;
      const topbar = header.querySelector('.topbar');
      const topbarHeight = topbar ? topbar.offsetHeight : 0;
      const policyThreshold = hero.classList.contains('policy-page') ? topbarHeight : null;
      const shouldDarken = window.scrollY > (policyThreshold ?? Math.max(80, hero.offsetHeight - header.offsetHeight - 20));
      header.classList.toggle('is-past-hero', shouldDarken);
      header.classList.toggle('is-topbar-gone', window.scrollY > topbarHeight);
      if(logo){
        logo.src = shouldDarken ? logo.dataset.lightLogo : logo.dataset.darkLogo;
      }
    };
    updateHeaderTheme();
    window.addEventListener('scroll', updateHeaderTheme, { passive: true });
    window.addEventListener('resize', updateHeaderTheme);
  }
})();
