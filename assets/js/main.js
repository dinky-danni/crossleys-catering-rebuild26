
(function(){
  const current = document.body.dataset.page || 'home';
  const rootPath = current === 'home' ? './' : '../';
  // Header and footer are rendered once here so navigation/contact updates stay global.
  const navItems = [
    ['home', rootPath, 'Home'],
    ['menu', rootPath + 'menu/', 'Menu'],
    ['catering-services', rootPath + 'catering-services/', 'Catering services'],
    ['sandwich-shop', rootPath + 'sandwich-shop/', 'Sandwich shop'],
    ['contact', rootPath + 'contact/', 'Contact']
  ];
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
            <form class="contact-form" action="#" method="post">
              <div class="form-grid">
                <input type="text" name="first-name" placeholder="First Name" aria-label="First Name">
                <input type="text" name="last-name" placeholder="Last Name" aria-label="Last Name">
                <input type="email" name="email" placeholder="Email" aria-label="Email" required>
                <input type="tel" name="phone" placeholder="Phone number" aria-label="Phone number">
              </div>
              <textarea name="message" placeholder="Message" aria-label="Message"></textarea>
              <button type="submit">Send</button>
              <p class="form-note" hidden>This static form is visual only and will need connecting to a form handler before launch.</p>
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
  document.addEventListener('click', function(e){
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
  document.addEventListener('submit', function(e){
    if(e.target.classList.contains('contact-form')){
      e.preventDefault();
      alert('This static form is ready visually, but needs connecting to a form handler before launch.');
    }
  });

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
