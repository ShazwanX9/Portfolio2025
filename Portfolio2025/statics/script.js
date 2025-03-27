document.addEventListener('DOMContentLoaded', () => {
    initMobileNavigation();
    initSmoothScrolling();
    initHeaderScrollEffect();
    initIntersectionObserver();
    initFormSubmissionHandler();
    initImageLoadingHandler();
    if (window.innerWidth > 768) {  // Check for non-mobile screen size
        initSplashScreen();  // Add splash screen only on larger screens
        initCursorEffects();
    }
    else {
        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        mainContent.classList.add('visible');
        header.classList.add('visible');
        footer.classList.add('visible');
    }
    initTypingEffect();
});

// Splash Screen Handler for Non-Mobile Devices
function initSplashScreen() {
    const splashScreen = document.createElement('div');
    splashScreen.classList.add('splash-screen');

    const video = document.createElement('video');
    video.setAttribute('autoplay', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('preload', 'auto');
    const videoSource = document.createElement('source');
    videoSource.setAttribute('src', 'assets/Shazwan.mp4');
    videoSource.setAttribute('type', 'video/mp4');
    video.appendChild(videoSource);
    splashScreen.appendChild(video);

    const soundToggle = document.createElement('button');
    soundToggle.classList.add('sound-toggle');
    const soundIcon = document.createElement('i');
    soundIcon.classList.add('fas', 'fa-volume-up');
    soundToggle.appendChild(soundIcon);
    splashScreen.appendChild(soundToggle);

    document.body.appendChild(splashScreen);

    // Handle sound toggle
    video.muted = true;
    soundToggle.addEventListener('click', () => {
        video.muted = !video.muted;
        soundToggle.classList.toggle('muted');
        soundIcon.className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    });

    const showMainContent = () => {
        splashScreen.classList.add('fade-out');
        const mainContent = document.querySelector('main');
        const header = document.querySelector('header');
        const footer = document.querySelector('footer');
        mainContent.classList.add('visible');
        header.classList.add('visible');
        footer.classList.add('visible');

        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500);
    };

    video.addEventListener('ended', () => {
        showMainContent();
    });

    video.addEventListener('error', () => {
        showMainContent();
    });

    video.addEventListener('loadeddata', () => {
        video.play().catch(error => console.error('Error playing video:', error));
    });
}

// Mobile Navigation
function initMobileNavigation() {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('active');
        navLinks.forEach((link, index) => {
            link.style.animation = link.style.animation ? '' : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        });
        burger.classList.toggle('toggle');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            nav.classList.remove('active');
            burger.classList.remove('toggle');
        });
    });
}

// Smooth Scrolling for Navigation Links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Header Scroll Effect
function initHeaderScrollEffect() {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        const currentScroll = window.pageYOffset;

        if (currentScroll <= 0) {
            header.classList.remove('scroll-up');
            return;
        }

        if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-up');
            header.classList.add('scroll-down');
        } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
            header.classList.remove('scroll-down');
            header.classList.add('scroll-up');
        }
        lastScroll = currentScroll;
    });
}

// Intersection Observer for Fade-In Animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('project-card')) {
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.style.opacity = '1';
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('section, .project-card, .contact-item').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}

// Form Submission Handler
function initFormSubmissionHandler() {
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }
}

// Image Loading Handler
function initImageLoadingHandler() {
    document.querySelectorAll('img').forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        }
        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
        img.addEventListener('error', () => {
            console.error('Failed to load image:', img.src);
        });
    });
}

// Cursor Effects (For Desktop Only)
function initCursorEffects() {
    const cursor = document.createElement('div');
    cursor.classList.add('custom-cursor');
    document.body.appendChild(cursor);

    let cursorX = 0;
    let cursorY = 0;
    let currentX = 0;
    let currentY = 0;

    document.addEventListener('mousemove', (e) => {
        cursorX = e.clientX;
        cursorY = e.clientY;
    });

    function updateCursor() {
        const ease = 0.15;
        currentX += (cursorX - currentX) * ease;
        currentY += (cursorY - currentY) * ease;
        cursor.style.left = `${currentX}px`;
        cursor.style.top = `${currentY}px`;
        requestAnimationFrame(updateCursor);
    }
    updateCursor();

    const interactiveElements = document.querySelectorAll('a, button, .project-card, .contact-item');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });
}

// Typing Effect for Tagline
function initTypingEffect() {
    const roles = ['Software Engineer', 'Creative Developer', 'Digital Architect'];
    const typingText = document.querySelector('.typing-text');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const currentRole = roles[roleIndex];
        typingText.textContent = isDeleting 
            ? currentRole.substring(0, charIndex - 1) 
            : currentRole.substring(0, charIndex + 1);

        charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }

    type();
}
