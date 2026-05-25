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
    const animatedElements = document.querySelectorAll('.problem-card, .benefits, .pricing-card, .contact-item');
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

    const STAFF_HOURLY_COST = 18;
    const DAYS_PER_MONTH = 30;
    const FUTURE_PHONE_PORT_SAVINGS = 60;
    const pageLang = document.documentElement.lang || 'en';
    const copy = {
        en: {
            empty: 'Slide to see your monthly savings',
            heroLabel: 'could go back in your pocket every month',
            breakdownHours: 'your staff get back',
            breakdownLabor: 'phone-shift labor avoided',
            breakdownPort: 'phone-line savings once ported',
            hoursUnit: 'hrs/mo'
        },
        zh: {
            empty: '拖动滑块看看每月可以省多少',
            heroLabel: '每月可以回到你口袋的钱',
            breakdownHours: '员工时间还给厨房和顾客',
            breakdownLabor: '省下的接电话人工',
            breakdownPort: '号码port后电话线节省',
            hoursUnit: '小时/月'
        },
        es: {
            empty: 'Mueva el control para ver el ahorro mensual',
            heroLabel: 'podrían volver a tu bolsillo cada mes',
            breakdownHours: 'que tu equipo recupera',
            breakdownLabor: 'de turno telefónico evitado',
            breakdownPort: 'de línea telefónica una vez portada',
            hoursUnit: 'hrs/mes'
        }
    }[pageLang.startsWith('zh') ? 'zh' : pageLang.startsWith('es') ? 'es' : 'en'];

    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    function calculatePricing(dailyPhoneHours) {
        // Update display value
        if (ordersDisplay) {
            ordersDisplay.textContent = dailyPhoneHours;
        }

        if (!dailyPhoneHours || dailyPhoneHours <= 0) {
            calculatorResult.innerHTML = `<div class="result-empty">${copy.empty}</div>`;
            return;
        }

        const monthlyCoverageHours = dailyPhoneHours * DAYS_PER_MONTH;
        const laborSavings = monthlyCoverageHours * STAFF_HOURLY_COST;
        const totalSavings = laborSavings + FUTURE_PHONE_PORT_SAVINGS;

        const html = `
            <div class="result-hero">
                <div class="result-amount">$${formatNumber(Math.round(totalSavings))}<span class="result-amount-unit">/mo</span></div>
                <div class="result-amount-label">${copy.heroLabel}</div>
            </div>
            <ul class="result-breakdown">
                <li><strong>${formatNumber(monthlyCoverageHours)} ${copy.hoursUnit}</strong><span>${copy.breakdownHours}</span></li>
                <li><strong>$${formatNumber(Math.round(laborSavings))}</strong><span>${copy.breakdownLabor}</span></li>
                <li><strong>$${FUTURE_PHONE_PORT_SAVINGS}</strong><span>${copy.breakdownPort}</span></li>
            </ul>
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
