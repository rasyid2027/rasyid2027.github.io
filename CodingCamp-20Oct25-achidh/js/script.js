// ===================================
// SMOOTH SCROLLING & NAVIGATION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // ===================================
    // WELCOME MESSAGE WITH NAME INPUT
    // ===================================
    const nameInput = document.getElementById('userName');
    const submitNameBtn = document.getElementById('submitName');
    const nameInputWrapper = document.getElementById('nameInputWrapper');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const userNameDisplay = document.getElementById('userNameDisplay');
    
    // Check if user name is already stored
    const storedName = localStorage.getItem('userName');
    if (storedName && nameInputWrapper && welcomeMessage) {
        nameInputWrapper.style.display = 'none';
        welcomeMessage.style.display = 'block';
        userNameDisplay.textContent = storedName;
    }
    
    // Handle name submission
    if (submitNameBtn) {
        submitNameBtn.addEventListener('click', function() {
            const name = nameInput.value.trim();
            
            if (name) {
                // Store name in localStorage
                localStorage.setItem('userName', name);
                
                // Hide input, show welcome message
                nameInputWrapper.style.display = 'none';
                welcomeMessage.style.display = 'block';
                userNameDisplay.textContent = name;
            } else {
                nameInput.focus();
                nameInput.style.borderColor = 'var(--accent-color)';
                setTimeout(() => {
                    nameInput.style.borderColor = '';
                }, 2000);
            }
        });
        
        // Allow Enter key to submit
        nameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                submitNameBtn.click();
            }
        });
    }
    
    // Smooth scroll for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                
                    // Update active link
                    navLinks.forEach(l => l.classList.remove('active'));
                    this.classList.add('active');
                
                    // Close mobile menu if open
                    const navLinksContainer = document.querySelector('.nav-links');
                    const menuToggle = document.getElementById('menuToggle');
                    navLinksContainer.classList.remove('active');
                    menuToggle.classList.remove('active');
                }
            }
        });
    });
    
    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    
    menuToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        navLinksContainer.classList.toggle('active');
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
});

// ===================================
// ANIMATED COUNTER FOR STATS
// ===================================
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target + (target === 98 ? '%' : '+');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start) + (target === 98 ? '%' : '+');
        }
    }, 16);
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                animateCounter(stat, target);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// ===================================
// FORM VALIDATION
// ===================================
const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');

// Validation rules
const validationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 50,
        pattern: /^[a-zA-Z\s]+$/,
        messages: {
            required: 'Name is required',
            minLength: 'Name must be at least 2 characters',
            maxLength: 'Name must not exceed 50 characters',
            pattern: 'Name can only contain letters and spaces'
        }
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        messages: {
            required: 'Email is required',
            pattern: 'Please enter a valid email address'
        }
    },
    phone: {
        required: true,
        pattern: /^[\d\s\-\+\(\)]+$/,
        minLength: 10,
        maxLength: 20,
        messages: {
            required: 'Phone number is required',
            pattern: 'Please enter a valid phone number',
            minLength: 'Phone number must be at least 10 digits',
            maxLength: 'Phone number must not exceed 20 characters'
        }
    },
    message: {
        required: true,
        minLength: 10,
        maxLength: 500,
        messages: {
            required: 'Message is required',
            minLength: 'Message must be at least 10 characters',
            maxLength: 'Message must not exceed 500 characters'
        }
    }
};

// Validate single field
function validateField(fieldName, value) {
    const rules = validationRules[fieldName];
    const errors = [];
    
    // Required check
    if (rules.required && !value.trim()) {
        errors.push(rules.messages.required);
        return errors;
    }
    
    // Skip other validations if field is empty and not required
    if (!value.trim()) {
        return errors;
    }
    
    // Min length check
    if (rules.minLength && value.trim().length < rules.minLength) {
        errors.push(rules.messages.minLength);
    }
    
    // Max length check
    if (rules.maxLength && value.trim().length > rules.maxLength) {
        errors.push(rules.messages.maxLength);
    }
    
    // Pattern check
    if (rules.pattern && !rules.pattern.test(value.trim())) {
        errors.push(rules.messages.pattern);
    }
    
    return errors;
}

// Display error message
function showError(fieldName, message) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    input.classList.add('error');
    errorElement.textContent = message;
}

// Clear error message
function clearError(fieldName) {
    const input = document.getElementById(fieldName);
    const errorElement = document.getElementById(fieldName + 'Error');
    
    input.classList.remove('error');
    errorElement.textContent = '';
}

// Real-time validation on input
const formInputs = contactForm.querySelectorAll('.form-input');
formInputs.forEach(input => {
    // Validate on blur
    input.addEventListener('blur', function() {
        const fieldName = this.getAttribute('name');
        const value = this.value;
        const errors = validateField(fieldName, value);
        
        if (errors.length > 0) {
            showError(fieldName, errors[0]);
        } else {
            clearError(fieldName);
        }
    });
    
    // Clear error on focus
    input.addEventListener('focus', function() {
        const fieldName = this.getAttribute('name');
        clearError(fieldName);
    });
    
    // Validate on input (for immediate feedback)
    input.addEventListener('input', function() {
        const fieldName = this.getAttribute('name');
        const errorElement = document.getElementById(fieldName + 'Error');
        
        // Only validate if there's already an error showing
        if (errorElement.textContent) {
            const value = this.value;
            const errors = validateField(fieldName, value);
            
            if (errors.length > 0) {
                showError(fieldName, errors[0]);
            } else {
                clearError(fieldName);
            }
        }
    });
});

// Form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        message: document.getElementById('message').value
    };
    
    // Validate all fields
    let isValid = true;
    const allErrors = {};
    
    Object.keys(formData).forEach(fieldName => {
        const errors = validateField(fieldName, formData[fieldName]);
        if (errors.length > 0) {
            isValid = false;
            allErrors[fieldName] = errors[0];
            showError(fieldName, errors[0]);
        } else {
            clearError(fieldName);
        }
    });
    
    // If form is valid, show success message
    if (isValid) {
        // Log form data (in production, this would be sent to a server)
        console.log('Form submitted successfully:', formData);
        
        // Display submitted values in the success message
        document.getElementById('displayName').textContent = formData.name;
        document.getElementById('displayEmail').textContent = formData.email;
        document.getElementById('displayPhone').textContent = formData.phone;
        document.getElementById('displayMessage').textContent = formData.message;
        
        // Show success message
        successMessage.classList.add('show');
        
        // Reset form
        contactForm.reset();
        
        // Hide success message after 10 seconds (increased to allow reading)
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 10000);
        
        // Optional: Send data to server
        // submitFormData(formData);
    } else {
        // Scroll to first error
        const firstErrorField = Object.keys(allErrors)[0];
        const firstErrorInput = document.getElementById(firstErrorField);
        firstErrorInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstErrorInput.focus();
    }
});

// Optional: Function to send form data to server
function submitFormData(data) {
    // Example using Fetch API
    /*
    fetch('/api/contact', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(result => {
        console.log('Success:', result);
    })
    .catch(error => {
        console.error('Error:', error);
    });
    */
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to cards
const cards = document.querySelectorAll('.service-card, .stat-card, .info-card');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(card);
});

// ===================================
// ACTIVE SECTION HIGHLIGHTING
// ===================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNavigation() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            if (navLink) {
                navLink.classList.add('active');
            }
        }
    });
}

window.addEventListener('scroll', highlightNavigation);

// ===================================
// PHONE NUMBER FORMATTING (OPTIONAL)
// ===================================
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    // Format as: (XXX) XXX-XXXX for US numbers
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 6) {
            value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        } else {
            value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(6, 10)}`;
        }
    }
    
    // Only update if different to avoid cursor jumping
    if (e.target.value !== value) {
        e.target.value = value;
    }
});

// ===================================
// PREVENT FORM RESUBMISSION ON REFRESH
// ===================================
if (window.history.replaceState) {
    window.history.replaceState(null, null, window.location.href);
}

// ===================================
// ACCESSIBILITY ENHANCEMENTS
// ===================================
// Add keyboard navigation for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

// Announce form errors to screen readers
function announceError(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'alert');
    announcement.setAttribute('aria-live', 'assertive');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
        document.body.removeChild(announcement);
    }, 1000);
}

// ===================================
// PERFORMANCE OPTIMIZATION
// ===================================
// Debounce function for scroll events
function debounce(func, wait) {
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

