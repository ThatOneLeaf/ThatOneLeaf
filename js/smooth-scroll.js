// Smooth Scrolling Enhancement

class SmoothScroll {
  constructor(options = {}) {
    this.options = {
      duration: 800,
      easing: "easeInOutCubic",
      offset: 80,
      updateURL: true,
      ...options,
    };

    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Handle all anchor links that start with #
    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (link) {
        this.handleClick(e, link);
      }
    });

    // Handle scroll to section on page load
    window.addEventListener("load", () => {
      this.handleHashOnLoad();
    });
  }

  handleClick(e, link) {
    e.preventDefault();

    const href = link.getAttribute("href");
    const targetId = href.substring(1);

    if (targetId === "") {
      // Scroll to top if href is just "#"
      this.scrollToTop();
    } else {
      // Scroll to target element
      const target = document.getElementById(targetId);
      if (target) {
        this.scrollToElement(target, href);
      }
    }
  }

  handleHashOnLoad() {
    const hash = window.location.hash;
    if (hash) {
      const target = document.querySelector(hash);
      if (target) {
        // Small delay to ensure page is fully loaded
        setTimeout(() => {
          this.scrollToElement(target, hash, false);
        }, 100);
      }
    }
  }

  scrollToTop() {
    this.animateScroll(0);

    if (this.options.updateURL) {
      history.pushState(null, null, " ");
    }
  }

  scrollToElement(element, hash, updateURL = true) {
    const elementPosition = this.getElementPosition(element);
    const offsetPosition = elementPosition - this.options.offset;

    this.animateScroll(Math.max(0, offsetPosition));

    if (updateURL && this.options.updateURL) {
      history.pushState(null, null, hash);
    }

    // Focus management for accessibility
    this.manageFocus(element);
  }

  getElementPosition(element) {
    const rect = element.getBoundingClientRect();
    return rect.top + window.pageYOffset;
  }

  animateScroll(targetPosition) {
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / this.options.duration, 1);

      const easedProgress = this.easing[this.options.easing](progress);
      const currentPosition = startPosition + distance * easedProgress;

      window.scrollTo(0, currentPosition);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }

  manageFocus(element) {
    // Save current focus
    const currentFocus = document.activeElement;

    // Make element focusable if it isn't already
    const originalTabIndex = element.getAttribute("tabindex");
    if (!element.hasAttribute("tabindex")) {
      element.setAttribute("tabindex", "-1");
    }

    // Focus the target element
    element.focus();

    // Remove tabindex if we added it
    if (originalTabIndex === null) {
      element.removeAttribute("tabindex");
    }
  }

  // Easing functions
  easing = {
    linear: (t) => t,

    easeInQuad: (t) => t * t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutQuad: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),

    easeInCubic: (t) => t * t * t,
    easeOutCubic: (t) => --t * t * t + 1,
    easeInOutCubic: (t) =>
      t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,

    easeInQuart: (t) => t * t * t * t,
    easeOutQuart: (t) => 1 - --t * t * t * t,
    easeInOutQuart: (t) =>
      t < 0.5 ? 8 * t * t * t * t : 1 - 8 * --t * t * t * t,

    easeInQuint: (t) => t * t * t * t * t,
    easeOutQuint: (t) => 1 + --t * t * t * t * t,
    easeInOutQuint: (t) =>
      t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * --t * t * t * t * t,
  };
}

// Enhanced scroll behavior for better UX
class ScrollEnhancer {
  constructor() {
    this.isScrolling = false;
    this.scrollTimer = null;
    this.sections = [];
    this.currentSection = null;

    this.init();
  }

  init() {
    this.collectSections();
    this.bindEvents();
    this.updateCurrentSection();
  }

  collectSections() {
    this.sections = Array.from(document.querySelectorAll("section[id]")).map(
      (section) => ({
        id: section.id,
        element: section,
        top: section.offsetTop,
        height: section.offsetHeight,
      })
    );
  }

  bindEvents() {
    window.addEventListener(
      "scroll",
      this.throttle(() => {
        this.handleScroll();
      }, 16)
    ); // ~60fps

    window.addEventListener(
      "resize",
      this.debounce(() => {
        this.collectSections();
      }, 250)
    );
  }

  handleScroll() {
    this.updateCurrentSection();
    this.updateNavigationState();
    this.handleScrollStart();
    this.handleScrollEnd();
  }

  updateCurrentSection() {
    const scrollPosition = window.pageYOffset + 100; // Offset for fixed header

    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      if (scrollPosition >= section.top) {
        if (this.currentSection !== section.id) {
          this.currentSection = section.id;
          this.onSectionChange(section);
        }
        break;
      }
    }
  }

  updateNavigationState() {
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === `#${this.currentSection}`) {
        link.classList.add("active");
      }
    });
  }

  onSectionChange(section) {
    // Dispatch custom event
    const event = new CustomEvent("sectionChange", {
      detail: { section: section.id, element: section.element },
    });
    document.dispatchEvent(event);

    // Update page title if needed
    this.updatePageTitle(section);
  }

  updatePageTitle(section) {
    const sectionTitle = section.element.querySelector("h2, h1");
    if (sectionTitle) {
      const baseTitle = "ThatOneLeaf - Portfolio";
      const newTitle = `${sectionTitle.textContent} | ${baseTitle}`;
      document.title = newTitle;
    }
  }

  handleScrollStart() {
    if (!this.isScrolling) {
      this.isScrolling = true;
      document.body.classList.add("is-scrolling");
    }
  }

  handleScrollEnd() {
    clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      this.isScrolling = false;
      document.body.classList.remove("is-scrolling");
    }, 150);
  }

  // Utility methods
  throttle(func, limit) {
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

  debounce(func, wait) {
    let timeout;
    return function () {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  // Public methods
  scrollToSection(sectionId) {
    const section = this.sections.find((s) => s.id === sectionId);
    if (section) {
      const offsetPosition = section.top - 80;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  }

  getCurrentSection() {
    return this.currentSection;
  }

  getSections() {
    return this.sections;
  }
}

// Parallax scroll effect
class ParallaxScroll {
  constructor(elements = ".parallax") {
    this.elements = document.querySelectorAll(elements);
    this.init();
  }

  init() {
    if (this.elements.length === 0) return;

    this.bindEvents();
    this.updateParallax();
  }

  bindEvents() {
    window.addEventListener(
      "scroll",
      this.throttle(() => {
        this.updateParallax();
      }, 16)
    );
  }

  updateParallax() {
    const scrollTop = window.pageYOffset;

    this.elements.forEach((element) => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrollTop * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  throttle(func, limit) {
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
}

// Initialize smooth scrolling
document.addEventListener("DOMContentLoaded", () => {
  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (!prefersReducedMotion) {
    new SmoothScroll({
      duration: 1000,
      easing: "easeInOutCubic",
      offset: 80,
    });

    new ScrollEnhancer();
    new ParallaxScroll();
  } else {
    // Fallback for users who prefer reduced motion
    new ScrollEnhancer(); // Still provide section tracking without smooth scrolling
  }
});

// Export for use in other modules
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SmoothScroll, ScrollEnhancer, ParallaxScroll };
}
