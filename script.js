// Apple-Inspired Professional Portfolio JavaScript
// Modern ES6+ approach with performance optimization

class PortfolioApp {
  constructor() {
    this.isDarkMode = false;
    this.isAnimationEnabled = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeAnimations();
    this.setupIntersectionObserver();
    this.initializeNavigation();
    this.setupFormHandling();
    this.initializeSearch();
    this.setupThemeHandling();
    this.createInteractiveElements();
    
    // Initialize after DOM is ready
    requestAnimationFrame(() => {
      this.setupScrollEffects();
    });
  }

  /* ===== EVENT LISTENERS ===== */
  setupEventListeners() {
    // Optimized scroll handler with throttling
    let scrollTimeout;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        this.handleScroll();
        scrollTimeout = null;
      }, 16); // ~60fps
    }, { passive: true });

    // Resize handler with debouncing
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        this.handleResize();
      }, 150);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardNavigation(e);
    });

    // Prevent scroll when mobile menu is open
    document.addEventListener('touchmove', (e) => {
      if (document.body.style.overflow === 'hidden') {
        e.preventDefault();
      }
    }, { passive: false });
  }

  /* ===== NAVIGATION ===== */
  initializeNavigation() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    if (mobileToggle && navMenu) {
      mobileToggle.addEventListener('click', () => {
        this.toggleMobileMenu();
      });

      // Close menu when clicking on overlay
      document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !mobileToggle.contains(e.target)) {
          this.closeMobileMenu();
        }
      });
    }

    // Smooth scroll for navigation links
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        this.handleNavClick(e, link);
      });
    });
  }

  toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileToggle');
    const icon = mobileToggle?.querySelector('i');

    if (!navMenu || !icon) return;

    const isActive = navMenu.classList.contains('active');
    
    if (isActive) {
      this.closeMobileMenu();
    } else {
      navMenu.classList.add('active');
      icon.className = 'fas fa-times';
      document.body.style.overflow = 'hidden';
      
      // Animate menu items
      const menuItems = navMenu.querySelectorAll('li');
      menuItems.forEach((item, index) => {
        item.style.animation = `slideInRight 0.3s ease ${index * 0.1}s both`;
      });
    }
  }

  closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    const mobileToggle = document.getElementById('mobileToggle');
    const icon = mobileToggle?.querySelector('i');

    if (!navMenu || !icon) return;

    navMenu.classList.remove('active');
    icon.className = 'fas fa-bars';
    document.body.style.overflow = '';
  }

  handleNavClick(e, link) {
    e.preventDefault();
    
    const targetId = link.getAttribute('href').substring(1);
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      this.smoothScrollTo(targetElement);
      this.closeMobileMenu();
    }
  }

  smoothScrollTo(element) {
    const headerHeight = 80;
    const targetPosition = element.offsetTop - headerHeight;
    
    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });
  }

  /* ===== SCROLL EFFECTS ===== */
  setupScrollEffects() {
    this.updateActiveNavigation();
    this.updateHeaderBackground();
  }

  handleScroll() {
    this.updateActiveNavigation();
    this.updateHeaderBackground();
    this.updateScrollProgress();
  }

  updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    if (!sections.length || !navLinks.length) return;

    let currentSection = '';
    const scrollPosition = window.pageYOffset + 100;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      
      if (scrollPosition >= sectionTop && 
          scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${currentSection}`;
      link.classList.toggle('active', isActive);
    });
  }

  updateHeaderBackground() {
    const header = document.querySelector('header');
    if (!header) return;

    const scrolled = window.pageYOffset;
    const opacity = Math.min(scrolled / 100, 0.95);
    const backgroundOpacity = 0.72 + (opacity * 0.23);
    
    header.style.background = `rgba(28, 28, 30, ${backgroundOpacity})`;
    header.style.backdropFilter = `blur(${8 + scrolled / 10}px) saturate(180%)`;
  }

  updateScrollProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    // Update any scroll progress indicators
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
      progressBar.style.width = scrolled + '%';
    }
  }

  /* ===== ANIMATIONS & OBSERVERS ===== */
  initializeAnimations() {
    // Add CSS keyframes for animations
    if (!document.querySelector('#dynamic-animations')) {
      const style = document.createElement('style');
      style.id = 'dynamic-animations';
      style.textContent = `
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes bounceIn {
          0% { opacity: 0; transform: scale(0.3); }
          50% { opacity: 1; transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes ripple {
          to { transform: scale(4); opacity: 0; }
        }
        .ripple {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.6);
          transform: scale(0);
          animation: ripple 0.6s linear;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }
  }

  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      this.handleIntersection.bind(this),
      this.observerOptions
    );

    // Observe elements for animation
    const elementsToObserve = [
      '.animate-fade-in',
      '.skill-category',
      '.stat-card', 
      '.project-card',
      '.contact-item'
    ];

    elementsToObserve.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
      });
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateElement(entry.target);
      }
    });
  }

  animateElement(element) {
    if (!this.isAnimationEnabled) return;

    element.style.animationPlayState = 'running';

    // Special handling for skill categories
    if (element.classList.contains('skill-category')) {
      this.animateSkillBars(element);
    }

    // Special handling for stat cards
    if (element.classList.contains('stat-card')) {
      this.animateStatValue(element);
    }

    // Add bounce animation for project cards
    if (element.classList.contains('project-card')) {
      element.style.animation = 'bounceIn 0.6s ease-out';
    }
  }

  animateSkillBars(skillCategory) {
    const skillBars = skillCategory.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
      const targetWidth = bar.getAttribute('style')?.match(/width:\s*(\d+%)/)?.[1] || '0%';
      
      // Reset width
      bar.style.width = '0%';
      bar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      // Animate to target width with delay
      setTimeout(() => {
        bar.style.width = targetWidth;
      }, index * 200 + 300);
    });
  }

  animateStatValue(statCard) {
    const valueElement = statCard.querySelector('.stat-value');
    if (!valueElement) return;

    const targetValue = parseInt(valueElement.textContent) || 0;
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    const updateValue = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = Math.round(startValue + (targetValue - startValue) * easeOutExpo);
      
      valueElement.textContent = currentValue + (valueElement.textContent.includes('+') ? '+' : '');

      if (progress < 1) {
        requestAnimationFrame(updateValue);
      }
    };

    requestAnimationFrame(updateValue);
  }

  /* ===== INTERACTIVE ELEMENTS ===== */
  createInteractiveElements() {
    this.setupButtonRipples();
    this.setupHoverEffects();
    this.setupParallaxElements();
  }

  setupButtonRipples() {
    document.querySelectorAll('.btn').forEach(button => {
      button.addEventListener('click', (e) => {
        this.createRipple(e, button);
      });
    });
  }

  createRipple(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }

  setupHoverEffects() {
    // Enhanced hover effects for cards
    document.querySelectorAll('.project-card, .skill-category').forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        if (this.isAnimationEnabled) {
          e.target.style.transform = 'translateY(-8px) scale(1.02)';
        }
      });
      
      card.addEventListener('mouseleave', (e) => {
        e.target.style.transform = '';
      });
    });
  }

  setupParallaxElements() {
    if (!this.isAnimationEnabled) return;

    const parallaxElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * -0.5;
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.2);
        element.style.transform = `translate3d(0, ${rate * speed}px, 0)`;
      });
    }, { passive: true });
  }

  /* ===== THEME HANDLING ===== */
  setupThemeHandling() {
    // Check system preference
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkMode = prefersDark;
    
    // Apply theme
    this.updateTheme();
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      this.isDarkMode = e.matches;
      this.updateTheme();
    });

    // Manual theme toggle (if exists)
    const themeToggle = document.querySelector('.theme-toggle, .toggle-switch');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        this.toggleTheme();
      });
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.updateTheme();
  }

  updateTheme() {
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    
    // Update toggle state if exists
    const toggleSwitch = document.querySelector('.toggle-switch');
    if (toggleSwitch) {
      toggleSwitch.classList.toggle('active', this.isDarkMode);
    }
  }

  /* ===== FORM HANDLING ===== */
  setupFormHandling() {
    const contactForm = document.querySelector('.contact-form form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
      this.handleFormSubmission(e, contactForm);
    });

    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input);
      });
      
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });
    });
  }

  handleFormSubmission(event, form) {
    event.preventDefault();
    
    if (!this.validateForm(form)) {
      this.showFormError('Please fill in all required fields correctly.');
      return;
    }

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    this.submitForm(data, form);
  }

  validateForm(form) {
    const requiredFields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    requiredFields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    } else if (fieldType === 'email' && value && !this.isValidEmail(value)) {
      isValid = false;
      errorMessage = 'Please enter a valid email address.';
    }

    this.showFieldError(field, isValid ? '' : errorMessage);
    return isValid;
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  showFieldError(field, message) {
    this.clearFieldError(field);
    
    if (message) {
      field.style.borderColor = 'var(--error-color, #ff4444)';
      
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error';
      errorDiv.textContent = message;
      errorDiv.style.cssText = `
        color: var(--error-color, #ff4444);
        font-size: 12px;
        margin-top: 4px;
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
      
      field.parentNode.appendChild(errorDiv);
      requestAnimationFrame(() => errorDiv.style.opacity = '1');
    }
  }

  clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
      existingError.remove();
    }
  }

  showFormError(message) {
    // Create or update form error message
    let errorDiv = document.querySelector('.form-error');
    if (!errorDiv) {
      errorDiv = document.createElement('div');
      errorDiv.className = 'form-error';
      errorDiv.style.cssText = `
        background: rgba(255, 68, 68, 0.1);
        color: var(--error-color, #ff4444);
        padding: 12px;
        border-radius: 8px;
        margin-bottom: 20px;
        border: 1px solid rgba(255, 68, 68, 0.3);
        opacity: 0;
        transition: opacity 0.3s ease;
      `;
    }
    
    errorDiv.textContent = message;
    const form = document.querySelector('.contact-form form');
    form.insertBefore(errorDiv, form.firstChild);
    requestAnimationFrame(() => errorDiv.style.opacity = '1');
  }

  async submitForm(data, form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    
    // Show loading state
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitButton.disabled = true;

    try {
      // Simulate API call (replace with actual endpoint)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Success
      this.showFormSuccess('Thank you for your message! I\'ll get back to you within 24 hours.');
      form.reset();
      
    } catch (error) {
      this.showFormError('Sorry, there was an error sending your message. Please try again.');
    } finally {
      // Reset button
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }
  }

  showFormSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'form-success';
    successDiv.style.cssText = `
      background: rgba(52, 199, 89, 0.1);
      color: var(--success-color, #34c759);
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 20px;
      border: 1px solid rgba(52, 199, 89, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    successDiv.textContent = message;
    const form = document.querySelector('.contact-form form');
    form.insertBefore(successDiv, form.firstChild);
    requestAnimationFrame(() => successDiv.style.opacity = '1');
    
    // Remove after 5 seconds
    setTimeout(() => {
      successDiv.style.opacity = '0';
      setTimeout(() => successDiv.remove(), 300);
    }, 5000);
  }

  /* ===== SEARCH FUNCTIONALITY ===== */
  initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const suggestionsContainer = document.querySelector('.search-suggestions');
    
    if (!searchInput || !suggestionsContainer) return;

    const searchData = [
      {
        title: "ABAC University Platform",
        description: "Student portal with course registration and grade tracking",
        category: "Education",
        link: "#projects"
      },
      {
        title: "E-commerce Solution", 
        description: "Full-featured online shopping platform",
        category: "E-commerce",
        link: "#projects"
      },
      {
        title: "Analytics Dashboard",
        description: "Real-time data visualization and reporting",
        category: "Analytics",
        link: "#projects"
      },
      {
        title: "About Me",
        description: "Learn more about my background and experience",
        category: "Profile",
        link: "#about"
      },
      {
        title: "Skills",
        description: "Technical skills and expertise",
        category: "Skills", 
        link: "#skills"
      },
      {
        title: "Contact",
        description: "Get in touch for collaboration",
        category: "Contact",
        link: "#contact"
      }
    ];

    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        this.performSearch(e.target.value, searchData, suggestionsContainer);
      }, 300);
    });

    searchInput.addEventListener('keydown', (e) => {
      this.handleSearchKeyboard(e, suggestionsContainer);
    });

    // Close search when clicking outside
    document.addEventListener('click', (e) => {
      if (!searchInput.contains(e.target) && !suggestionsContainer.contains(e.target)) {
        suggestionsContainer.classList.remove('visible');
      }
    });
  }

  performSearch(query, data, container) {
    const searchTerm = query.toLowerCase().trim();
    
    if (!searchTerm) {
      container.classList.remove('visible');
      return;
    }

    const results = data.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      item.category.toLowerCase().includes(searchTerm)
    );

    this.displaySearchResults(results, container, searchTerm);
  }

  displaySearchResults(results, container, searchTerm) {
    container.innerHTML = '';
    
    if (results.length === 0) {
      container.innerHTML = `
        <div class="suggestion-item">
          <div class="no-results">No results found for "${searchTerm}"</div>
        </div>
      `;
    } else {
      results.forEach((result, index) => {
        const item = document.createElement('div');
        item.className = 'suggestion-item';
        item.innerHTML = `
          <div class="suggestion-content">
            <div class="suggestion-title">${result.title}</div>
            <div class="suggestion-description">${result.description}</div>
            <div class="suggestion-category">${result.category}</div>
          </div>
        `;
        
        item.addEventListener('click', () => {
          this.handleSearchSelection(result);
          container.classList.remove('visible');
        });
        
        container.appendChild(item);
      });
    }
    
    container.classList.add('visible');
  }

  handleSearchSelection(result) {
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
      searchInput.value = result.title;
    }
    
    // Navigate to the selected item
    if (result.link.startsWith('#')) {
      const target = document.querySelector(result.link);
      if (target) {
        this.smoothScrollTo(target);
      }
    } else {
      window.location.href = result.link;
    }
  }

  handleSearchKeyboard(e, container) {
    const suggestions = container.querySelectorAll('.suggestion-item');
    const currentActive = container.querySelector('.suggestion-item.active');
    let activeIndex = Array.from(suggestions).indexOf(currentActive);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        activeIndex = Math.min(activeIndex + 1, suggestions.length - 1);
        this.updateActiveSuggestion(suggestions, activeIndex);
        break;
      case 'ArrowUp':
        e.preventDefault();
        activeIndex = Math.max(activeIndex - 1, 0);
        this.updateActiveSuggestion(suggestions, activeIndex);
        break;
      case 'Enter':
        e.preventDefault();
        if (currentActive) {
          currentActive.click();
        }
        break;
      case 'Escape':
        container.classList.remove('visible');
        break;
    }
  }

  updateActiveSuggestion(suggestions, activeIndex) {
    suggestions.forEach((suggestion, index) => {
      suggestion.classList.toggle('active', index === activeIndex);
    });
  }

  /* ===== KEYBOARD NAVIGATION ===== */
  handleKeyboardNavigation(e) {
    // Skip key if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'Escape':
        this.closeMobileMenu();
        document.querySelector('.search-suggestions')?.classList.remove('visible');
        break;
      case '/':
        e.preventDefault();
        document.querySelector('.search-input')?.focus();
        break;
    }
  }

  /* ===== RESIZE HANDLING ===== */
  handleResize() {
    // Close mobile menu on desktop
    if (window.innerWidth > 768) {
      this.closeMobileMenu();
    }
    
    // Update any size-dependent features
    this.updateHeaderBackground();
  }

  /* ===== UTILITY METHODS ===== */
  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  /* ===== PERFORMANCE MONITORING ===== */
  measurePerformance() {
    if ('performance' in window) {
      window.addEventListener('load', () => {
        const perfData = performance.getEntriesByType('navigation')[0];
        console.log(`Page load time: ${perfData.loadEventEnd - perfData.fetchStart}ms`);
      });
    }
  }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
  window.portfolioApp = new PortfolioApp();
});

// Handle page visibility changes for performance
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    // Pause animations when tab is not visible
    document.body.style.animationPlayState = 'paused';
  } else {
    document.body.style.animationPlayState = 'running';
  }
});

// Export for potential external use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PortfolioApp;
}