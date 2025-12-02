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
    const revenueInput = document.getElementById('monthlyRevenue');
    const revenueDisplay = document.getElementById('revenueDisplay');
    const calculatorResult = document.getElementById('calculatorResult');

    const plans = [
        { name: 'Standard', monthly: 99, commission: 0.05 },
        { name: 'Plus', monthly: 249, commission: 0.03 },
        { name: 'Prime', monthly: 499, commission: 0.015 },
        { name: 'Enterprise', monthly: 999, commission: 0.01 }
    ];

    function formatNumber(num) {
        return num.toLocaleString('en-US');
    }

    function calculatePricing(revenue) {
        // Update display value
        if (revenueDisplay) {
            revenueDisplay.textContent = formatNumber(revenue);
        }

        if (!revenue || revenue <= 0) {
            calculatorResult.innerHTML = '<div class="best-plan" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">Slide to find your best plan</div>';
            // Remove all highlights
            document.querySelectorAll('.pricing-card').forEach(card => {
                card.classList.remove('recommended');
            });
            return;
        }

        const results = plans.map(plan => ({
            ...plan,
            totalCost: plan.monthly + (revenue * plan.commission)
        }));

        results.sort((a, b) => a.totalCost - b.totalCost);
        const bestPlan = results[0];

        const html = `
            <div class="best-plan clickable" data-best-plan="${bestPlan.name}">
                💡 <strong>${bestPlan.name}</strong> is your best value at this volume
            </div>
        `;

        calculatorResult.innerHTML = html;

        // Highlight the best plan card
        document.querySelectorAll('.pricing-card').forEach(card => {
            card.classList.remove('recommended');
            if (card.dataset.plan === bestPlan.name) {
                card.classList.add('recommended');
            }
        });

        // Add click handler to result
        const resultDiv = calculatorResult.querySelector('.best-plan');
        if (resultDiv) {
            resultDiv.addEventListener('click', () => {
                const targetCard = document.querySelector(`.pricing-card[data-plan="${bestPlan.name}"]`);
                if (targetCard) {
                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    // Add temporary pulse effect
                    targetCard.style.animation = 'none';
                    setTimeout(() => {
                        targetCard.style.animation = 'highlightPulse 1s ease-in-out';
                    }, 10);
                }
            });
        }
    }

    if (revenueInput) {
        // Map slider position (0-100) to revenue with non-linear scale
        // 0-60 maps to $0-$20K (more granular)
        // 60-100 maps to $20K-$120K (larger jumps)
        function sliderToRevenue(sliderValue) {
            if (sliderValue <= 60) {
                // 0-60 = $0-$20K, increment by $1000
                return Math.round((sliderValue / 60) * 20) * 1000;
            } else {
                // 60-100 = $20K-$120K, increment by $10K
                const above20k = sliderValue - 60;
                return 20000 + Math.round((above20k / 40) * 10) * 10000;
            }
        }
        
        revenueInput.addEventListener('input', (e) => {
            const sliderValue = parseFloat(e.target.value);
            const revenue = sliderToRevenue(sliderValue);
            calculatePricing(revenue);
        });

        // Initial calculation with default value
        const initialRevenue = sliderToRevenue(parseFloat(revenueInput.value));
        calculatePricing(initialRevenue);
    }
});

// Handle external links
document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.setAttribute('rel', 'noopener noreferrer');
});
