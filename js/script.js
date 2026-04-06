// Mobile Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    // Toggle mobile menu
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Animate hamburger icon
            this.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            if (menuToggle) {
                menuToggle.classList.remove('active');
            }
        });
    });

    // Smooth scroll for anchor links
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

    // Add active class to nav links on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        
        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');
            const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                if (navLink) {
                    navLink.classList.add('active');
                }
            }
        });
    });

    // Intersection Observer for fade-in animations
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

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.problem-card, .benefits, .contact-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Pricing Calculator
    const ordersInput = document.getElementById('dailyOrders');
    const ordersDisplay = document.getElementById('ordersDisplay');
    const calculatorResult = document.getElementById('calculatorResult');

    const PHONE_FEE = 1.49;
    const WEB_FEE = 0.99;

    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    function calculatePricing(dailyOrders) {
        // Update display value
        if (ordersDisplay) {
            ordersDisplay.textContent = dailyOrders;
        }

        if (!dailyOrders || dailyOrders <= 0) {
            calculatorResult.innerHTML = '<div class="best-plan" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">Slide to estimate your monthly cost</div>';
            return;
        }

        const monthlyOrders = dailyOrders * 30;
        const phoneCost = monthlyOrders * PHONE_FEE;
        const webCost = monthlyOrders * WEB_FEE;

        const html = `
            <div class="best-plan">
                📞 <strong>${formatNumber(monthlyOrders)} phone orders/mo</strong> = $${formatNumber(Math.round(phoneCost))}/mo<br>
                🌐 <strong>${formatNumber(monthlyOrders)} online orders/mo</strong> = $${formatNumber(Math.round(webCost))}/mo
            </div>
        `;

        calculatorResult.innerHTML = html;
    }

    if (ordersInput) {
        ordersInput.addEventListener('input', (e) => {
            calculatePricing(parseInt(e.target.value));
        });

        // Initial calculation with default value
        calculatePricing(parseInt(ordersInput.value));
    }
});

// Handle external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});
