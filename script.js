// script.js
document.addEventListener('DOMContentLoaded', function() {
  /* Ripple Effect for Buttons */
  document.querySelectorAll('.amazon-button').forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      const rect = button.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  /* Scroll Animation with Intersection Observer */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  document.querySelectorAll('.portfolio-item, .profile-header, .section-title, .skill-category').forEach(item => {
    observer.observe(item);
  });

  /* Light/Dark Mode Toggle */
  const modeToggle = document.getElementById('mode-toggle');
  const savedMode = localStorage.getItem('darkMode');
  
  // Apply saved mode or prefer system setting
  if (savedMode === 'enabled' || 
      (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.body.classList.add('dark-mode');
    modeToggle.checked = true;
  }
  
  modeToggle.addEventListener('change', function() {
    document.body.classList.toggle('dark-mode', this.checked);
    localStorage.setItem('darkMode', this.checked ? 'enabled' : 'disabled');
  });

  /* Search Suggestions */
  const searchInput = document.getElementById('search-input');
  const suggestionsContainer = document.getElementById('search-suggestions');
  
  const projects = [
    { 
      title: "ABAC University Platform", 
      description: "Student portal for ABAC University", 
      link: "univer.html",
      keywords: ["university", "student", "abac", "education", "portal"]
    },
    { 
      title: "Work and Travel USA Program", 
      description: "Cultural exchange program experience", 
      link: "wat.html",
      keywords: ["work", "travel", "usa", "experience", "cultural"]
    },
    { 
      title: "E-commerce Solution", 
      description: "Full-featured online shopping platform", 
      link: "#",
      keywords: ["ecommerce", "shopping", "payment", "store"]
    },
    { 
      title: "Health & Fitness App", 
      description: "Mobile application for tracking workouts and nutrition", 
      link: "#",
      keywords: ["health", "fitness", "mobile", "app", "nutrition"]
    }
  ];

  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.trim().toLowerCase();
    const suggestions = getSuggestions(searchTerm);
    showSuggestions(suggestions);
  });

  function getSuggestions(searchTerm) {
    if (!searchTerm) return [];
    
    return projects.filter(project => {
      return project.title.toLowerCase().includes(searchTerm) ||
             project.description.toLowerCase().includes(searchTerm) ||
             project.keywords.some(kw => kw.includes(searchTerm));
    });
  }

  function showSuggestions(suggestions) {
    suggestionsContainer.innerHTML = '';
    suggestionsContainer.classList.toggle('visible', suggestions.length > 0);

    suggestions.forEach((project, index) => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.style.animationDelay = `${index * 0.05}s`;
      div.innerHTML = `
        <div class="suggestion-title">${project.title}</div>
        <div class="suggestion-desc">${project.description}</div>
      `;
      div.addEventListener('click', () => {
        window.location.href = project.link;
        suggestionsContainer.classList.remove('visible');
      });
      suggestionsContainer.appendChild(div);
    });

    if (suggestions.length === 0 && searchInput.value) {
      const noResults = document.createElement('div');
      noResults.className = 'suggestion-item';
      noResults.textContent = 'No results found for "' + searchInput.value + '"';
      suggestionsContainer.appendChild(noResults);
    }
  }

  // Close suggestions when clicking outside or pressing Escape
  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target)) {
      suggestionsContainer.classList.remove('visible');
    }
  });
  
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      suggestionsContainer.classList.remove('visible');
    }
  });

  // Add percentage values to skill bars
  document.querySelectorAll('.skill-level').forEach(skill => {
    const percent = skill.style.width;
    skill.setAttribute('data-percent', percent);
  });
});