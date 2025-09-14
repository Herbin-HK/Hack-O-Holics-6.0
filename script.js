// Mobile menu toggle
var sidemenu = document.getElementById("sidemenu");
function openmenu() {
    sidemenu.style.right = "0";
}
function closemenu() {
    sidemenu.style.right = "-200px";
}

// FAQ toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.faq-item input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const icon = this.nextElementSibling.querySelector('.faq-icon');
            icon.textContent = this.checked ? '−' : '+';
        });
    });
});

// Organizers slider
class OrganizerSlider {
    constructor() {
        this.container = document.querySelector('.organizers-slider');
        if (!this.container) return; // Exit if slider doesn't exist
        
        this.wrapper = document.querySelector('.slides-wrapper');
        this.slides = document.querySelectorAll('.organizer-slide');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.dotsContainer = document.querySelector('.slider-dots');
        
        this.currentSlide = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.totalSlides = this.slides.length;
        this.autoplayInterval = null;
        
        this.init();
    }

    getSlidesPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 4;
        if (width >= 768) return 3;
        if (width >= 480) return 2;
        return 1;
    }

    init() {
        this.createDots();
        this.updateSlider();
        this.bindEvents();
        this.startAutoplay();
    }

    createDots() {
        if (!this.dotsContainer) return;
        
        const dotsCount = Math.ceil(this.totalSlides / this.slidesPerView);
        this.dotsContainer.innerHTML = '';
        
        for (let i = 0; i < dotsCount; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        }
    }

    updateSlider() {
        if (!this.wrapper || !this.slides.length) return;
        
        const slideWidth = 100 / this.slidesPerView;
        this.slides.forEach(slide => {
            slide.style.minWidth = `${slideWidth}%`;
        });
        
        const translateX = -(this.currentSlide * (100 / this.slidesPerView));
        this.wrapper.style.transform = `translateX(${translateX}%)`;
        
        this.updateDots();
    }

    updateDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }

    nextSlide() {
        const maxSlide = Math.ceil(this.totalSlides / this.slidesPerView) - 1;
        this.currentSlide = this.currentSlide >= maxSlide ? 0 : this.currentSlide + 1;
        this.updateSlider();
    }

    prevSlide() {
        const maxSlide = Math.ceil(this.totalSlides / this.slidesPerView) - 1;
        this.currentSlide = this.currentSlide <= 0 ? maxSlide : this.currentSlide - 1;
        this.updateSlider();
    }

    goToSlide(index) {
        const maxSlide = Math.ceil(this.totalSlides / this.slidesPerView) - 1;
        this.currentSlide = Math.max(0, Math.min(index, maxSlide));
        this.updateSlider();
    }

    bindEvents() {
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                this.nextSlide();
                this.resetAutoplay();
            });
        }
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                this.prevSlide();
                this.resetAutoplay();
            });
        }
        
        // Handle resize
        window.addEventListener('resize', () => {
            const newSlidesPerView = this.getSlidesPerView();
            if (newSlidesPerView !== this.slidesPerView) {
                this.slidesPerView = newSlidesPerView;
                this.currentSlide = 0; // Reset to first slide on resize
                this.createDots();
                this.updateSlider();
            }
        });
        
        // Pause autoplay on hover
        if (this.container) {
            this.container.addEventListener('mouseenter', () => this.pauseAutoplay());
            this.container.addEventListener('mouseleave', () => this.startAutoplay());
        }
    }

    startAutoplay() {
        this.pauseAutoplay(); // Clear any existing interval
        this.autoplayInterval = setInterval(() => {
            this.nextSlide();
        }, 4000);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    resetAutoplay() {
        this.startAutoplay();
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return; // Skip empty anchors
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start',
                    inline: 'nearest'
                });
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    closemenu();
                }
            }
        });
    });
}

// Countdown Timer
function initCountdownTimer() {
    const countdown = document.getElementById("countdown");
    const registerBtn = document.getElementById("registerBtn");
    
    if (!countdown || !registerBtn) return;
    
    const deadline = new Date("Oct 7, 2025 23:59:59").getTime();
    
    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = deadline - now;

        if (distance < 0) {
            countdown.innerHTML = "<span class='expired'>Registration Closed</span>";
            registerBtn.classList.add("disabled");
            registerBtn.innerHTML = "Closed";
            registerBtn.href = "#";
            registerBtn.style.pointerEvents = "none";
            registerBtn.style.opacity = "0.6";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((distance % (1000 * 60)) / 1000);

        countdown.innerHTML = `
            <div class="time-box"><span>${days}</span><small>Days</small></div>
            <div class="time-box"><span>${hours}</span><small>Hours</small></div>
            <div class="time-box"><span>${mins}</span><small>Minutes</small></div>
            <div class="time-box"><span>${secs}</span><small>Seconds</small></div>
        `;

        // Add pulse animation when less than 3 days remaining
        if (days <= 3) {
            registerBtn.classList.add("pulse");
        } else {
            registerBtn.classList.remove("pulse");
        }
    };
    
    // Update immediately
    updateCountdown();
    
    // Update every second
    setInterval(updateCountdown, 1000);
}

// Enhanced scroll effects
function initScrollEffects() {
    // Add scroll-based animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.service-card, .track-card, .timeline-content, .rule-card, .organizer-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Handle external link behavior
function initExternalLinks() {
    document.querySelectorAll('a[href^="http"]').forEach(link => {
        link.addEventListener('click', (e) => {
            // Add a small delay for better UX
            link.style.transform = 'scale(0.95)';
            setTimeout(() => {
                link.style.transform = 'scale(1)';
            }, 150);
        });
    });
}

// Enhanced error handling for images
function initImageErrorHandling() {
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.alt = 'Image not available';
        });
        
        img.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

// Viewport height optimization
function optimizeViewportHeight() {
    // Set CSS custom property for actual viewport height
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    
    // Update on resize
    window.addEventListener('resize', () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize viewport height optimization
    optimizeViewportHeight();
    
    // Initialize countdown timer
    initCountdownTimer();
    
    // Initialize smooth scrolling
    initSmoothScrolling();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize external links
    initExternalLinks();
    
    // Initialize image error handling
    initImageErrorHandling();
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        const nav = document.querySelector('nav');
        const menuBtn = document.querySelector('.fa-bars');
        
        if (nav && !nav.contains(e.target) && window.innerWidth <= 768) {
            closemenu();
        }
    });
    
    // Handle escape key for mobile menu
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.innerWidth <= 768) {
            closemenu();
        }
    });
    
    // Prevent scroll when mobile menu is open
    const sidemenu = document.getElementById("sidemenu");
    if (sidemenu) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === "attributes" && mutation.attributeName === "style") {
                    const isOpen = sidemenu.style.right === "0px";
                    document.body.style.overflow = isOpen ? 'hidden' : '';
                }
            });
        });
        observer.observe(sidemenu, { attributes: true });
    }
});

// Initialize slider when page loads
window.addEventListener('load', () => {
    new OrganizerSlider();
});

// Handle page visibility changes (pause animations when tab is not active)
document.addEventListener('visibilitychange', function() {
    const sliders = document.querySelectorAll('.organizers-slider');
    sliders.forEach(slider => {
        if (document.hidden) {
            // Page is hidden, pause animations
            slider.style.animationPlayState = 'paused';
        } else {
            // Page is visible, resume animations
            slider.style.animationPlayState = 'running';
        }
    });
});

// Performance optimization - lazy load images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Initialize lazy loading after DOM is ready
document.addEventListener('DOMContentLoaded', initLazyLoading);