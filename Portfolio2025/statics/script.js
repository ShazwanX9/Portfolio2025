// Splash Screen Handler
const splashScreen = document.querySelector('.splash-screen');
const mainContent = document.querySelector('main');
const header = document.querySelector('header');
const footer = document.querySelector('footer');

// Show main content immediately if no splash screen
if (!splashScreen) {
    mainContent.classList.add('visible');
    header.classList.add('visible');
    footer.classList.add('visible');
} else {
    const video = splashScreen.querySelector('video');
    const soundToggle = splashScreen.querySelector('.sound-toggle');

    // Initialize video with muted state (browser policy)
    video.muted = true;

    // Function to show main content
    const showMainContent = () => {
        splashScreen.classList.add('fade-out');
        mainContent.classList.add('visible');
        header.classList.add('visible');
        footer.classList.add('visible');
        
        // Remove splash screen after fade out
        setTimeout(() => {
            splashScreen.style.display = 'none';
        }, 500);
    };

    // Sound toggle functionality
    soundToggle.addEventListener('click', () => {
        video.muted = !video.muted;
        soundToggle.classList.toggle('muted');
        soundToggle.querySelector('i').className = video.muted ? 'fas fa-volume-mute' : 'fas fa-volume-up';
    });

    // Video event handlers
    video.addEventListener('loadeddata', () => {
        console.log('Video loaded successfully');
        // Ensure video is playing
        video.play().catch(error => {
            console.error('Error playing video:', error);
        });
    });

    video.addEventListener('error', (e) => {
        console.error('Video error:', e);
        showMainContent();
    });

    video.addEventListener('ended', () => {
        console.log('Video ended');
        showMainContent();
    });
}

// Mobile Navigation
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-links li');

// Toggle Navigation
burger.addEventListener('click', () => {
    // Toggle Nav
    nav.classList.toggle('active');
    
    // Animate Links
    navLinks.forEach((link, index) => {
        if (link.style.animation) {
            link.style.animation = '';
        } else {
            link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        }
    });
    
    // Burger Animation
    burger.classList.toggle('toggle');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        nav.classList.remove('active');
        burger.classList.remove('toggle');
    });
});

// Smooth scrolling for navigation links
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

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        header.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
        // Scroll Down
        header.classList.remove('scroll-up');
        header.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
        // Scroll Up
        header.classList.remove('scroll-down');
        header.classList.add('scroll-up');
    }
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
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

// Observe elements
document.querySelectorAll('section, .project-card, .contact-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Form submission handler
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! I will get back to you soon.');
        contactForm.reset();
    });
}

// Add CSS animation for mobile navigation
const style = document.createElement('style');
style.textContent = `
    @keyframes navLinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .burger.toggle div:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
    }
    
    .burger.toggle div:nth-child(2) {
        opacity: 0;
    }
    
    .burger.toggle div:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
    }
`;
document.head.appendChild(style);

// Cursor Effects
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);

// Image loading handler
document.querySelectorAll('img').forEach(img => {
    // For already loaded images
    if (img.complete) {
        img.classList.add('loaded');
    }
    // For images still loading
    img.addEventListener('load', () => {
        img.classList.add('loaded');
    });
    // For images that fail to load
    img.addEventListener('error', () => {
        console.error('Failed to load image:', img.src);
    });
});

// Smooth cursor movement
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

// Cursor interaction states
const interactiveElements = document.querySelectorAll('a, button, .project-card, .contact-item');
interactiveElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
    });
    
    element.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
    });
});

// Typing effect for tagline
const typeWriter = () => {
    const roles = ['Software Engineer', 'Creative Developer', 'Digital Architect'];
    const typingText = document.querySelector('.typing-text');
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            typingText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            setTimeout(type, 2000); // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            setTimeout(type, 500); // Pause before next word
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    type();
};

typeWriter(); 