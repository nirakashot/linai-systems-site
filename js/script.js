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
            empty: 'Slide to estimate monthly labor savings',
            coverage: 'phone coverage hours/mo',
            labor: 'Phone staff cost avoided',
            port: 'Future phone-port savings',
            total: 'Rough monthly savings',
            note: 'AI answers the phone instead of adding a dedicated phone shift.'
        },
        zh: {
            empty: '拖动滑块估算每月人工节省',
            coverage: '电话覆盖小时/月',
            labor: '可少掉的接电话人工',
            port: '未来电话port后的额外节省',
            total: '粗略每月可省',
            note: '用AI接电话，少安排一个专门守电话的班。'
        },
        es: {
            empty: 'Mueva el control para estimar ahorro mensual en personal',
            coverage: 'horas de teléfono/mes',
            labor: 'Costo de personal telefónico evitado',
            port: 'Ahorro futuro por portar el teléfono',
            total: 'Ahorro mensual aproximado',
            note: 'AI contesta el teléfono en lugar de agregar un turno dedicado.'
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
            calculatorResult.innerHTML = `<div class="best-plan">${copy.empty}</div>`;
            return;
        }

        const monthlyCoverageHours = dailyPhoneHours * DAYS_PER_MONTH;
        const laborSavings = monthlyCoverageHours * STAFF_HOURLY_COST;
        const totalSavings = laborSavings + FUTURE_PHONE_PORT_SAVINGS;

        const html = `
            <div class="best-plan">
                <strong>${formatNumber(monthlyCoverageHours)} ${copy.coverage}</strong><br>
                ${copy.labor}: <strong>$${formatNumber(Math.round(laborSavings))}/mo</strong><br>
                ${copy.port}: <strong>$${formatNumber(FUTURE_PHONE_PORT_SAVINGS)}/mo</strong><br>
                ${copy.total}: <strong>$${formatNumber(Math.round(totalSavings))}/mo</strong><br>
                <span>${copy.note}</span>
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
