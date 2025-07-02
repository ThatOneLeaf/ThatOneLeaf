// Main JavaScript for Portfolio Website

document.addEventListener("DOMContentLoaded", function () {
  // Initialize all functions when DOM is loaded
  initNavigation();
  initScrollAnimations();
  initSkillBars();
  initBackToTop();
  initTypewriter();
  initParticles();
  initMobileMenu();
  initSmoothScrolling();
  initCarousels();
});

// Navigation functionality
function initNavigation() {
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  // Add active class to current section
  function updateActiveNavLink() {
    const sections = document.querySelectorAll("section[id]");
    const scrollPosition = window.scrollY + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = document.querySelector(
          `.nav-link[href="#${sectionId}"]`
        );
        if (activeLink) activeLink.classList.add("active");
      }
    });
  }

  // Navbar background on scroll
  function updateNavbarBackground() {
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  }

  // Event listeners
  window.addEventListener("scroll", () => {
    updateActiveNavLink();
    updateNavbarBackground();
  });

  // Initial call
  updateActiveNavLink();
}

// Mobile menu functionality
function initMobileMenu() {
  const navToggle = document.querySelector(".nav-toggle");
  const navMenu = document.querySelector(".nav-menu");
  const navLinks = document.querySelectorAll(".nav-link");

  navToggle.addEventListener("click", () => {
    navToggle.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    });
  });

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
      navToggle.classList.remove("active");
      navMenu.classList.remove("active");
    }
  });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Scroll animations
function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");

        // Special handling for staggered items
        if (entry.target.classList.contains("stagger-container")) {
          const items = entry.target.querySelectorAll(".stagger-item");
          items.forEach((item, index) => {
            setTimeout(() => {
              item.classList.add("animate");
            }, index * 100);
          });
        }
      }
    });
  }, observerOptions);

  // Observe elements with scroll reveal classes
  const scrollElements = document.querySelectorAll(
    ".scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .stagger-container"
  );
  scrollElements.forEach((el) => observer.observe(el));
}

// Animated skill bars
function initSkillBars() {
  const skillBars = document.querySelectorAll(".skill-progress");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const skillBar = entry.target;
          const targetWidth = skillBar.getAttribute("data-width");

          // Animate the skill bar
          setTimeout(() => {
            skillBar.style.width = targetWidth;
          }, 200);

          // Animate the percentage counter
          const skillItem = skillBar.closest(".skill-item");
          const percentageElement =
            skillItem.querySelector(".skill-percentage");
          const targetPercentage = parseInt(targetWidth);

          animateCounter(percentageElement, 0, targetPercentage, 2000);

          skillObserver.unobserve(skillBar);
        }
      });
    },
    { threshold: 0.5 }
  );

  skillBars.forEach((bar) => skillObserver.observe(bar));
}

// Counter animation function
function animateCounter(element, start, end, duration) {
  const startTime = performance.now();

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const currentValue = Math.floor(
      start + (end - start) * easeOutCubic(progress)
    );

    element.textContent = currentValue + "%";

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

// Easing function
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Back to top button
function initBackToTop() {
  const backToTopButton = document.getElementById("backToTop");

  function toggleBackToTop() {
    if (window.scrollY > 300) {
      backToTopButton.classList.add("visible");
    } else {
      backToTopButton.classList.remove("visible");
    }
  }

  window.addEventListener("scroll", toggleBackToTop);

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// Typewriter effect
function initTypewriter() {
  const typingElement = document.getElementById("typing-text");
  if (!typingElement) return;

  const fullText = "Hi, I'm Rafael";
  const highlightStart = 8; // Position where "Rafael" starts
  let i = 0;
  let currentHTML = "";

  function typeWriter() {
    if (i < fullText.length) {
      let currentChar = fullText.charAt(i);

      if (i < highlightStart) {
        // Regular text before highlight
        currentHTML += currentChar;
      } else if (i === highlightStart) {
        // Start the highlight span when we reach "Rafael"
        currentHTML += '<span class="highlight">' + currentChar;
      } else if (i < fullText.length - 1) {
        // Continue adding characters inside the highlight span
        currentHTML += currentChar;
      } else {
        // Last character - close the highlight span
        currentHTML += currentChar + "</span>";
      }

      typingElement.innerHTML = currentHTML;
      i++;
      setTimeout(typeWriter, 100);
    }
  }

  // Start typewriter effect immediately when page loads
  setTimeout(typeWriter, 500);
}

// Particle effect
function initParticles() {
  const particleContainers = document.querySelectorAll(".particles");

  particleContainers.forEach((container) => {
    createParticles(container, 20);
  });
}

function createParticles(container, count) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";

    // Random position and animation delay
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 6 + "s";
    particle.style.animationDuration = Math.random() * 3 + 3 + "s";

    container.appendChild(particle);
  }
}

// Form validation and handling
function initFormHandling() {
  const contactForm = document.getElementById("contact-form");
  if (!contactForm) return;

  contactForm.addEventListener("submit", handleFormSubmit);

  // Real-time validation
  const formInputs = contactForm.querySelectorAll("input, textarea");
  formInputs.forEach((input) => {
    input.addEventListener("blur", validateField);
    input.addEventListener("input", clearError);
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  const formData = new FormData(e.target);
  const formObject = Object.fromEntries(formData);

  // Validate all fields
  const isValid = validateForm(e.target);

  if (isValid) {
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalText = submitButton.innerHTML;
    submitButton.innerHTML = '<span class="loading-spinner"></span> Sending...';
    submitButton.disabled = true;

    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
      showNotification("Message sent successfully!", "success");
      e.target.reset();
      submitButton.innerHTML = originalText;
      submitButton.disabled = false;
    }, 2000);
  }
}

function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!validateField({ target: input })) {
      isValid = false;
    }
  });

  return isValid;
}

function validateField(e) {
  const field = e.target;
  const value = field.value.trim();
  const fieldName = field.name;

  // Remove existing error
  clearError(e);

  let isValid = true;
  let errorMessage = "";

  // Required field validation
  if (!value) {
    errorMessage = `${
      fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
    } is required`;
    isValid = false;
  }

  // Email validation
  if (fieldName === "email" && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errorMessage = "Please enter a valid email address";
      isValid = false;
    }
  }

  // Show error if validation failed
  if (!isValid) {
    showFieldError(field, errorMessage);
  }

  return isValid;
}

function showFieldError(field, message) {
  field.classList.add("error");

  let errorElement = field.parentNode.querySelector(".error-message");
  if (!errorElement) {
    errorElement = document.createElement("span");
    errorElement.className = "error-message";
    field.parentNode.appendChild(errorElement);
  }

  errorElement.textContent = message;
}

function clearError(e) {
  const field = e.target;
  field.classList.remove("error");

  const errorElement = field.parentNode.querySelector(".error-message");
  if (errorElement) {
    errorElement.remove();
  }
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;

  document.body.appendChild(notification);

  // Show notification
  setTimeout(() => notification.classList.add("show"), 100);

  // Auto hide after 5 seconds
  setTimeout(() => hideNotification(notification), 5000);

  // Close button
  notification
    .querySelector(".notification-close")
    .addEventListener("click", () => {
      hideNotification(notification);
    });
}

function hideNotification(notification) {
  notification.classList.remove("show");
  setTimeout(() => {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

// Utility functions
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// Initialize form handling
document.addEventListener("DOMContentLoaded", initFormHandling);

// Carousel functionality
function moveCarousel(button, direction) {
  const carousel = button.closest(".carousel");
  const container = carousel.querySelector(".carousel-container");
  const items = carousel.querySelectorAll(".carousel-item");
  const dots = carousel.querySelectorAll(".dot");

  // Find current active item
  let currentIndex = Array.from(items).findIndex((item) =>
    item.classList.contains("active")
  );

  // Calculate new index
  let newIndex = currentIndex + direction;
  if (newIndex >= items.length) newIndex = 0;
  if (newIndex < 0) newIndex = items.length - 1;

  // Update active classes
  items[currentIndex].classList.remove("active");
  items[newIndex].classList.add("active");

  // Update dots
  dots[currentIndex].classList.remove("active");
  dots[newIndex].classList.add("active");
}

function jumpToSlide(dot, index) {
  const carousel = dot.closest(".carousel");
  const items = carousel.querySelectorAll(".carousel-item");
  const dots = carousel.querySelectorAll(".dot");

  // Remove all active classes
  items.forEach((item) => item.classList.remove("active"));
  dots.forEach((dot) => dot.classList.remove("active"));

  // Add active class to selected item and dot
  items[index].classList.add("active");
  dots[index].classList.add("active");
}

// Auto-advance carousel
function initCarousels() {
  const carousels = document.querySelectorAll(".carousel");
  carousels.forEach((carousel) => {
    setInterval(() => {
      const nextButton = carousel.querySelector(".carousel-button.next");
      if (document.visibilityState === "visible") {
        moveCarousel(nextButton, 1);
      }
    }, 5000); // Change slide every 5 seconds
  });
}
