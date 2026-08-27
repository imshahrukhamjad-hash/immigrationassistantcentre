const hero = document.querySelector('.hero');
const slides = document.querySelectorAll('.hero-content');
const mainNav = document.querySelector('.main-nav');
let currentSlide = 0;

function updateNavbar() {
  if (mainNav) mainNav.classList.toggle('is-scrolled', window.scrollY > 40);
}

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle('active', i === index);
  });

  hero.style.setProperty('--next-hero-image', `url("${slides[index].dataset.image}")`);
  hero.classList.remove('is-changing');
  void hero.offsetWidth;
  hero.classList.add('is-changing');

  window.setTimeout(() => {
    hero.style.backgroundImage = `url("${slides[index].dataset.image}")`;
    hero.classList.remove('is-changing');
  }, 1900);
}

if (hero && slides.length) {
  showSlide(currentSlide);
  window.setInterval(() => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }, 5000);
}

window.addEventListener('scroll', updateNavbar, { passive: true });
updateNavbar();

// Mobile Navigation Hamburger Toggle
const navToggle = document.querySelector('#nav-toggle');
const navMenu = document.querySelector('#nav-menu');
const navOverlay = document.querySelector('#nav-overlay');

if (navToggle && navMenu) {
  function toggleMobileMenu() {
    const isActive = navToggle.classList.toggle('active');
    navMenu.classList.toggle('active', isActive);
    if (navOverlay) navOverlay.classList.toggle('active', isActive);
    document.body.style.overflow = isActive ? 'hidden' : '';
  }

  function closeMobileMenu() {
    navToggle.classList.remove('active');
    navMenu.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', toggleMobileMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMobileMenu);

  document.querySelectorAll('#nav-menu a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
}

const reviewsViewport = document.querySelector('.reviews-grid');
const reviewsTrack = document.querySelector('.reviews-track');
const reviewCards = document.querySelectorAll('.review-card');
const reviewPrevious = document.querySelector('.review-prev');
const reviewNext = document.querySelector('.review-next');
let currentReview = 0;

function reviewsPerView() {
  return window.innerWidth <= 768 ? 1 : 3;
}

function showReview(index) {
  const visibleReviews = reviewsPerView();
  const maximumReview = Math.max(0, reviewCards.length - visibleReviews);
  currentReview = Math.min(Math.max(index, 0), maximumReview);
  const featuredReview = currentReview + (visibleReviews > 1 ? 1 : 0);
  reviewCards.forEach((card, cardIndex) => {
    card.classList.toggle('is-featured', cardIndex === featuredReview);
  });
  const cardSpacing = parseFloat(getComputedStyle(reviewsTrack).gap) || 0;
  const cardWidth = reviewCards[0].getBoundingClientRect().width;
  reviewsTrack.style.transform = `translateX(-${currentReview * (cardWidth + cardSpacing)}px)`;
}

if (reviewsViewport && reviewsTrack && reviewCards.length && reviewPrevious && reviewNext) {
  reviewPrevious.addEventListener('click', () => showReview(currentReview - 1));
  reviewNext.addEventListener('click', () => showReview(currentReview + 1));
  window.addEventListener('resize', () => showReview(currentReview));
  window.setInterval(() => {
    const maximumReview = Math.max(0, reviewCards.length - reviewsPerView());
    showReview(currentReview >= maximumReview ? 0 : currentReview + 1);
  }, 5000);
  showReview(0);
}

document.querySelectorAll('.faq-question').forEach((question) => {
  question.addEventListener('click', () => {
    const item = question.closest('.faq-item');
    const isOpen = item.classList.toggle('is-open');
    question.setAttribute('aria-expanded', String(isOpen));
  });
});

const applicationForm = document.querySelector('#application-form');
const successModal = document.querySelector('#success-modal');
const closeModalButtons = document.querySelectorAll('.modal-close, .modal-done');

if (applicationForm && successModal) {
  applicationForm.addEventListener('submit', (event) => {
    event.preventDefault();
    applicationForm.reset();
    successModal.classList.add('is-visible');
  });

  closeModalButtons.forEach((button) => {
    button.addEventListener('click', () => successModal.classList.remove('is-visible'));
  });
}

const revealSections = document.querySelectorAll('main section');
const staggerGroups = document.querySelectorAll('.stats-counter-grid, .feature-grid, .roadmap-track, .offices-grid, .team-grid, .visa-grid');
const whyChooseCards = document.querySelectorAll('.why-choose-us .feature-card');
const teamCards = document.querySelectorAll('.team-members .team-card');

document.body.classList.add('js-ready');
revealSections.forEach((section) => section.classList.add('scroll-reveal'));
staggerGroups.forEach((group) => {
  Array.from(group.children).forEach((item, index) => {
    item.classList.add('stagger-item');
    item.style.setProperty('--stagger-delay', `${index * 90}ms`);
  });
});

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-visible', entry.isIntersecting);
    });
  }, { threshold: 0.15 });

  revealSections.forEach((section) => revealObserver.observe(section));

  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-card-visible', entry.isIntersecting);
    });
  }, { threshold: 0.2 });

  whyChooseCards.forEach((card) => cardObserver.observe(card));

  const teamCardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      entry.target.classList.toggle('is-team-card-visible', entry.isIntersecting);
    });
  }, { threshold: 0.2 });

  teamCards.forEach((card) => teamCardObserver.observe(card));
} else {
  revealSections.forEach((section) => section.classList.add('is-visible'));
  whyChooseCards.forEach((card) => card.classList.add('is-card-visible'));
  teamCards.forEach((card) => card.classList.add('is-team-card-visible'));
}

function checkJourneyVisibility() {
  document.querySelectorAll('.journey-section').forEach((section) => {
    const sectionTop = section.getBoundingClientRect().top;
    const sectionBottom = section.getBoundingClientRect().bottom;
    const isVisible = sectionTop < window.innerHeight * 0.85 && sectionBottom > window.innerHeight * 0.15;
    section.classList.toggle('is-journey-visible', isVisible);
  });
}

window.addEventListener('scroll', checkJourneyVisibility, { passive: true });
window.addEventListener('resize', checkJourneyVisibility);
checkJourneyVisibility();

const backToTop = document.querySelector('.back-to-top');
if (backToTop) {
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 400);
  }, { passive: true });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Animated Number Counter for Stats Section
function animateCounters() {
  const statNumbers = document.querySelectorAll('.stats-counter-section .stat-number');
  if (!statNumbers.length) return;

  function startCounting(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(target)) return;

    let current = 0;
    const duration = 1800; // 1.8 seconds
    const frameRate = 60;
    const totalFrames = Math.round((duration / 1000) * frameRate);
    const increment = target / totalFrames;
    let frame = 0;

    const counterInterval = setInterval(() => {
      frame++;
      current += increment;
      if (frame >= totalFrames) {
        el.textContent = target + suffix;
        clearInterval(counterInterval);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 1000 / frameRate);
  }

  if ('IntersectionObserver' in window) {
    let hasRun = false;
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          statNumbers.forEach((el) => startCounting(el));
          counterObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });

    const statsSection = document.querySelector('.stats-counter-section');
    if (statsSection) {
      counterObserver.observe(statsSection);
    }
  } else {
    statNumbers.forEach((el) => startCounting(el));
  }
}

animateCounters();