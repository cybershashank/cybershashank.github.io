document.addEventListener('DOMContentLoaded', () => {
  const siteHeader = document.getElementById('siteHeader');
  const mobileNavToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }

    let currentSection = '';
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  });

  if (mobileNavToggle && navMenu) {
    mobileNavToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  const counters = document.querySelectorAll('.metric-number');
  let animated = false;

  const countUp = (element) => {
    const target = parseInt(element.getAttribute('data-target'), 10);
    const duration = 1800;
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target;
        clearInterval(timer);
      } else {
        element.textContent = Math.ceil(current);
      }
    }, stepTime);
  };

  const metricsSection = document.querySelector('.metrics-telemetry-ribbon');
  if (metricsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !animated) {
          counters.forEach(counter => countUp(counter));
          animated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    observer.observe(metricsSection);
  }

  const resumeModalOverlay = document.getElementById('resumeModalOverlay');
  const openResumeTopBtn = document.getElementById('openResumeTopBtn');
  const openResumeMobileBtn = document.getElementById('openResumeMobileBtn');
  const heroOpenResumeBtn = document.getElementById('heroOpenResumeBtn');
  const footerResumeTrigger = document.getElementById('footerResumeTrigger');
  const closeResumeModalBtn = document.getElementById('closeResumeModalBtn');
  const printResumeBtn = document.getElementById('printResumeBtn');

  const openResumeModal = (e) => {
    if (e) e.preventDefault();
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
    }
    if (resumeModalOverlay) {
      resumeModalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeResumeModal = () => {
    if (resumeModalOverlay) {
      resumeModalOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  if (openResumeTopBtn) openResumeTopBtn.addEventListener('click', openResumeModal);
  if (openResumeMobileBtn) openResumeMobileBtn.addEventListener('click', openResumeModal);
  if (heroOpenResumeBtn) heroOpenResumeBtn.addEventListener('click', openResumeModal);
  if (footerResumeTrigger) footerResumeTrigger.addEventListener('click', openResumeModal);
  if (closeResumeModalBtn) closeResumeModalBtn.addEventListener('click', closeResumeModal);

  if (resumeModalOverlay) {
    resumeModalOverlay.addEventListener('click', (e) => {
      if (e.target === resumeModalOverlay) {
        closeResumeModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModalOverlay && resumeModalOverlay.classList.contains('active')) {
      closeResumeModal();
    }
  });

  if (printResumeBtn) {
    printResumeBtn.addEventListener('click', () => {
      window.print();
    });
  }

  const toast = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  const showToast = (message) => {
    if (toast && toastMessage) {
      toastMessage.textContent = message;
      toast.classList.add('active');
      setTimeout(() => {
        toast.classList.remove('active');
      }, 3500);
    }
  };

  const copyButtons = document.querySelectorAll('[data-copy]');
  copyButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.getAttribute('data-copy');
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied ${text} to clipboard!`);
        }).catch(() => {
          fallbackCopy(text);
        });
      } else {
        fallbackCopy(text);
      }
    });
  });

  const fallbackCopy = (text) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(`Copied ${text} to clipboard!`);
    } catch (err) {
      showToast('Could not auto-copy, please copy manually.');
    }
    document.body.removeChild(textArea);
  };

  const awardCarousel = document.getElementById('awardCarousel');
  const awardTrack = document.getElementById('awardCarouselTrack');
  const awardSlides = document.querySelectorAll('.award-carousel-slide');
  const awardPrevBtn = document.getElementById('awardPrevBtn');
  const awardNextBtn = document.getElementById('awardNextBtn');
  const awardDots = document.querySelectorAll('.award-carousel-dots .carousel-dot');

  if (awardCarousel && awardTrack && awardSlides.length > 0) {
    let currentSlide = 0;
    const totalSlides = awardSlides.length;
    let autoSlideInterval = null;

    const updateSlide = (index) => {
      currentSlide = (index + totalSlides) % totalSlides;
      awardTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
      awardDots.forEach((dot, idx) => {
        if (idx === currentSlide) {
          dot.classList.add('active');
        } else {
          dot.classList.remove('active');
        }
      });
    };

    const nextSlide = () => {
      updateSlide(currentSlide + 1);
    };

    const prevSlide = () => {
      updateSlide(currentSlide - 1);
    };

    const startAutoSlide = () => {
      stopAutoSlide();
      autoSlideInterval = setInterval(nextSlide, 3500);
    };

    const stopAutoSlide = () => {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    };

    if (awardNextBtn) {
      awardNextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
      });
    }

    if (awardPrevBtn) {
      awardPrevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
      });
    }

    awardDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateSlide(idx);
        startAutoSlide();
      });
    });

    awardCarousel.addEventListener('mouseenter', stopAutoSlide);
    awardCarousel.addEventListener('mouseleave', startAutoSlide);

    let startX = 0;
    let endX = 0;
    awardCarousel.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      stopAutoSlide();
    }, { passive: true });

    awardCarousel.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      if (startX - endX > 40) {
        nextSlide();
      } else if (endX - startX > 40) {
        prevSlide();
      }
      startAutoSlide();
    }, { passive: true });

    startAutoSlide();
  }
});
