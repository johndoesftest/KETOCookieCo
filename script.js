document.addEventListener('DOMContentLoaded', function() {
    // --- PRELOADER ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        preloader.style.opacity = '0';
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // --- DATA FOR CARDS & TOOLTIPS ---
    const flavorDetails = {
        "White Chocolate Macadamia": {
            img: "https://placehold.co/600x400/1a1a1a/f0f0f0?text=White+Chocolate+Macadamia",
            desc: "A timeless classic, perfected for the keto lifestyle. Our soft-baked cookie is loaded with rich, sugar-free white chocolate chips and buttery macadamia nuts for a truly decadent, melt-in-your-mouth experience. It's the ultimate guilt-free comfort food.",
            nutrition: {
                carbs: "~2g",
                fat: "~15g",
                protein: "~5g"
            }
        },
        "Stuffed Red Velvet": {
            img: "https://placehold.co/600x400/1a1a1a/f0f0f0?text=Stuffed+Red+Velvet",
            desc: "Experience pure luxury with our deep red velvet cookie, featuring notes of vanilla and rich cocoa. At its heart lies a delightful surprise: a rich and tangy cream cheese frosting filling that melts in your mouth. This is indulgence without compromise.",
             nutrition: {
                carbs: "~3g",
                fat: "~14g",
                protein: "~4g"
            }
        },
        "Thin Mint Delight": {
            img: "https://placehold.co/600x400/1a1a1a/f0f0f0?text=Thin+Mint",
            desc: "A nostalgic flavor, reimagined for a healthier lifestyle. Our rich, dark chocolate cookie is infused with natural peppermint oil for a cool, refreshing finish that perfectly complements the deep cocoa notes. It's the ideal balance of chocolate and mint.",
             nutrition: {
                carbs: "~2g",
                fat: "~12g",
                protein: "~5g"
            }
        }
    };
    const ingredientDetails = {
        "nut-flours": {
            img: "images/flour.jpg",
            title: "Premium Nut Flours",
            desc: "We use ultra-fine, blanched almond and coconut flours as the base for our cookies. They provide a wonderfully soft texture and are naturally low in carbs and gluten-free, making them the perfect foundation for our guilt-free treats."
        },
        "chocolate": {
            img: "images/chocolate.jpg",
            title: "Artisanal Sugar-Free Chocolate",
            desc: "Our chocolate is sourced from chocolatiers who specialize in sugar-free creations. Sweetened with natural monk fruit and erythritol, it delivers a rich, decadent flavor without any of the sugar, ensuring a pure and satisfying chocolate experience."
        }
    };

    // --- GENERAL SETUP ---
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-text').forEach(el => observer.observe(el));

    const header = document.querySelector('header');
    const backToTopBtn = document.getElementById('back-to-top');
    const hero = document.querySelector('.hero-section');
    const progressBar = document.getElementById('scroll-progress-bar');

    let isTicking = false;

    function onScroll() {
        if (!isTicking) {
            window.requestAnimationFrame(() => {
                updateScrollElements();
                isTicking = false;
            });
            isTicking = true;
        }
    }

    function updateScrollElements() {
        const scrollPosition = window.pageYOffset;
        
        const isScrolled = scrollPosition > 50;
        header.classList.toggle('bg-opacity-100', isScrolled);
        header.classList.toggle('shadow-lg', isScrolled);
        
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', scrollPosition > 400);
        }

        if (hero) {
            hero.style.backgroundPositionY = `${Math.max(0, scrollPosition * 0.5)}px`;
        }

        if (progressBar) {
            const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = (scrollPosition / totalHeight) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }

    window.addEventListener('scroll', onScroll);

    // --- HERO FLOATING FOIL EFFECT ---
    const foilContainer = document.getElementById('hero-foil-container');
    if (foilContainer) {
        const particleCount = 25;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('foil-particle');
            const size = Math.random() * 15 + 5; // Size between 5px and 20px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`; // Duration 10s to 25s
            particle.style.animationDelay = `${Math.random() * 10}s`;
            particle.style.bottom = `-${size}px`; // Start from just below the screen
            foilContainer.appendChild(particle);
        }
    }


    // --- MODAL HANDLING ---
    const modalBackdrop = document.getElementById('modal-backdrop');
    const allModals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-modal-btn');

    const openModal = (modal) => {
        modalBackdrop.classList.add('active');
        modal.classList.add('active');
    };

    const closeModal = () => {
        modalBackdrop.classList.remove('active');
        allModals.forEach(m => m.classList.remove('active'));
    };

    closeModalBtns.forEach(btn => btn.addEventListener('click', closeModal));
    modalBackdrop.addEventListener('click', closeModal);

    // --- ORDER MODAL ---
    const orderModal = document.getElementById('order-modal');
    const orderNowBtns = document.querySelectorAll('.order-now-btn');
    const checkoutBtn = document.getElementById('checkout-btn');
    const continueShoppingBtn = document.getElementById('continue-shopping-btn');
    const modalOrderContent = document.getElementById('modal-content-order');
    const modalSuccessContent = document.getElementById('modal-content-success');
    
    orderNowBtns.forEach(btn => btn.addEventListener('click', () => {
        modalOrderContent.style.display = 'block';
        modalSuccessContent.style.display = 'none';
        openModal(orderModal);
    }));
    
    continueShoppingBtn.addEventListener('click', closeModal);
    checkoutBtn.addEventListener('click', () => {
        modalOrderContent.style.display = 'none';
        modalSuccessContent.style.display = 'block';
    });

    // --- PRODUCT CARD FLIP LOGIC ---
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        const flavorName = card.dataset.flavor;
        const details = flavorDetails[flavorName];
        
        if (details) {
            // Inject content for the back of the card
            const cardBack = card.querySelector('.product-card-back');
            cardBack.innerHTML = `
                <h3 class="text-2xl font-serif gold-gradient-text mb-2">${flavorName}</h3>
                <p class="text-gray-300 text-sm mb-4 flex-grow">${details.desc}</p>
                <div class="border-t border-gray-700 pt-3 text-left w-full">
                    <h4 class="text-md font-bold text-white mb-1">Nutrition Highlights</h4>
                    <p class="text-gray-400 text-sm">Net Carbs: ${details.nutrition.carbs}</p>
                    <p class="text-gray-400 text-sm">Fat: ${details.nutrition.fat}</p>
                    <p class="text-gray-400 text-sm">Protein: ${details.nutrition.protein}</p>
                </div>
                <button class="close-details-btn">Back</button>
            `;

            // Create and inject the hover overlay for the front of the card
            const cardFront = card.querySelector('.product-card-front .relative');
            const overlay = document.createElement('div');
            overlay.className = 'image-overlay';
            overlay.innerHTML = `
                <div class="image-overlay-content text-center">
                    <h4 class="text-md font-bold text-white mb-2 border-b border-gray-600 pb-1">Nutrition Highlights</h4>
                    <p class="text-gray-300 text-sm">Net Carbs: ${details.nutrition.carbs}</p>
                    <p class="text-gray-300 text-sm">Fat: ${details.nutrition.fat}</p>
                    <p class="text-gray-300 text-sm">Protein: ${details.nutrition.protein}</p>
                </div>
            `;
            if(cardFront) {
                cardFront.appendChild(overlay);
            }
        }

        const detailsBtn = card.querySelector('.details-btn');
        detailsBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            card.classList.add('is-flipped');
        });

        const closeBtn = card.querySelector('.close-details-btn');
        if(closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                card.classList.remove('is-flipped');
            });
        }
        
        const container = card.closest('.product-card-container');
        container.addEventListener('mouseleave', () => {
            card.classList.remove('is-flipped');
        });
    });

    // --- INGREDIENT TOOLTIP LOGIC ---
    const tooltip = document.getElementById('ingredient-tooltip');
    const ingredientSpans = document.querySelectorAll('.ingredient-spotlight');

    ingredientSpans.forEach(span => {
        const ingredientKey = span.dataset.ingredient;
        const details = ingredientDetails[ingredientKey];

        span.addEventListener('mouseenter', () => {
            if (details) {
                document.getElementById('ingredient-tooltip-img').src = details.img;
                document.getElementById('ingredient-tooltip-title').innerText = details.title;
                document.getElementById('ingredient-tooltip-desc').innerText = details.desc;
                tooltip.classList.add('visible');
            }
        });

        span.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');
        });

        span.addEventListener('mousemove', (e) => {
            let x = e.clientX + 20;
            let y = e.clientY + 20;
            
            if (x + tooltip.offsetWidth > window.innerWidth) {
                x = e.clientX - tooltip.offsetWidth - 20;
            }
            if (y + tooltip.offsetHeight > window.innerHeight) {
                y = e.clientY - tooltip.offsetHeight - 20;
            }

            tooltip.style.left = `${x}px`;
            tooltip.style.top = `${y}px`;
        });
    });

    // --- SUBSCRIPTION PRICE TOGGLE ---
    const subOptions = document.querySelector('.subscription-options');
    if (subOptions) {
        const subPriceEl = document.getElementById('subscription-price');
        const optionBtns = subOptions.querySelectorAll('.option-btn');

        subOptions.addEventListener('click', (e) => {
            const clickedBtn = e.target.closest('.option-btn');
            if (!clickedBtn) return;

            optionBtns.forEach(btn => btn.classList.remove('active'));
            clickedBtn.classList.add('active');

            const newPrice = clickedBtn.dataset.price;
            
            subPriceEl.style.opacity = '0';
            setTimeout(() => {
                subPriceEl.innerText = newPrice;
                subPriceEl.style.opacity = '1';
            }, 200);
        });
    }

    // --- EXIT-INTENT MODAL ---
    const exitIntentModal = document.getElementById('exit-intent-modal');
    let exitIntentShown = false;
    document.body.addEventListener('mouseleave', (e) => {
        if (e.clientY <= 0 && !exitIntentShown) {
            exitIntentShown = true;
            openModal(exitIntentModal);
        }
    });
    const exitIntentForm = document.getElementById('exit-intent-form');
    const exitIntentSuccess = document.getElementById('exit-intent-success');
    exitIntentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        exitIntentForm.style.display = 'none';
        exitIntentSuccess.style.display = 'block';
         setTimeout(closeModal, 3000);
    });

    // --- NEWSLETTER FORM ---
    const notifyForm = document.getElementById('notify-form');
    const notifySuccess = document.getElementById('notify-success');
    notifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        notifySuccess.style.display = 'block';
        notifyForm.querySelector('input').value = '';
        setTimeout(() => { notifySuccess.style.display = 'none'; }, 4000);
    });

    // --- TESTIMONIAL MARQUEE ---
    const testimonialTrack = document.querySelector('.testimonial-marquee-track');
    if (testimonialTrack) {
        testimonialTrack.innerHTML += testimonialTrack.innerHTML;
    }

    // --- "AS SEEN IN" MARQUEE & TOOLTIP ---
    const mediaTrack = document.querySelector('.media-marquee-track');
    if (mediaTrack) {
        mediaTrack.innerHTML += mediaTrack.innerHTML;
    }
    const mediaQuoteTooltip = document.getElementById('media-quote-tooltip');
    const mediaLogoItems = document.querySelectorAll('.media-logo-item');
    mediaLogoItems.forEach(item => {
        const quote = item.dataset.quote;
        item.addEventListener('mouseenter', () => {
            if (quote) {
                mediaQuoteTooltip.innerHTML = quote;
                mediaQuoteTooltip.classList.add('visible');
            }
        });
        item.addEventListener('mouseleave', () => {
            mediaQuoteTooltip.classList.remove('visible');
        });
        item.addEventListener('mousemove', (e) => {
            let x = e.clientX + 15;
            let y = e.clientY + 15;
            if (x + mediaQuoteTooltip.offsetWidth > window.innerWidth - 15) {
                x = e.clientX - mediaQuoteTooltip.offsetWidth - 15;
            }
            if (y + mediaQuoteTooltip.offsetHeight > window.innerHeight - 15) {
                y = e.clientY - mediaQuoteTooltip.offsetHeight - 15;
            }
            mediaQuoteTooltip.style.left = `${x}px`;
            mediaQuoteTooltip.style.top = `${y}px`;
        });
    });


    // --- COUNTDOWN TIMER ---
    const initCountdown = () => {
        const mainCountdownEl = document.getElementById('countdown');
        const heroCountdownEl = document.getElementById('hero-countdown');
        const dropStatusIndicator = document.getElementById('drop-status-indicator');
        const statusText = dropStatusIndicator ? dropStatusIndicator.querySelector('.status-text') : null;

        if (!mainCountdownEl && !heroCountdownEl) {
            return;
        }

        if (dropStatusIndicator) {
            dropStatusIndicator.classList.add('status-anticipating');
            statusText.textContent = 'Anticipating';
        }

        // Set countdown to 30 seconds from now for demonstration
        const countDownDate = new Date().getTime() + 30000;

        const interval = setInterval(() => {
            const distance = countDownDate - new Date().getTime();

            if (distance < 0) {
                clearInterval(interval);
                if (mainCountdownEl) mainCountdownEl.innerHTML = "<span class='text-pink-400'>The Drop Is Live!</span>";
                if (heroCountdownEl) heroCountdownEl.style.display = 'none';

                if (dropStatusIndicator) {
                    dropStatusIndicator.classList.remove('status-anticipating');
                    dropStatusIndicator.classList.add('status-live');
                    if (statusText) statusText.textContent = 'Drop is Live!';
                }
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if (mainCountdownEl) {
                document.getElementById('days').innerText = String(days).padStart(2, '0');
                document.getElementById('hours').innerText = String(hours).padStart(2, '0');
                document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
                document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
            }

            if (heroCountdownEl) {
                document.getElementById('hero-days').innerText = String(days).padStart(2, '0');
                document.getElementById('hero-hours').innerText = String(hours).padStart(2, '0');
                document.getElementById('hero-minutes').innerText = String(minutes).padStart(2, '0');
                document.getElementById('hero-seconds').innerText = String(seconds).padStart(2, '0');
            }
        }, 1000);
    };
    
    initCountdown();


    // --- FAQ ACCORDION ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            faqItems.forEach(i => {
                i.classList.remove('active');
                i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
                i.querySelector('.faq-answer').style.maxHeight = null;
                i.querySelector('.faq-icon i').classList.replace('fa-minus', 'fa-plus');
            });

            if (!isActive) {
                item.classList.add('active');
                question.setAttribute('aria-expanded', 'true');
                const answer = item.querySelector('.faq-answer');
                answer.style.maxHeight = answer.scrollHeight + 'px';
                const icon = item.querySelector('.faq-icon i');
                icon.classList.replace('fa-plus', 'fa-minus');
            }
        });
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });

    // --- FAQ AUTO-EXPAND ON SCROLL ---
    const faqSection = document.getElementById('faq');
    if (faqSection) {
        const faqObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const firstFaqQuestion = faqSection.querySelector('.faq-question');
                    if (firstFaqQuestion && !firstFaqQuestion.closest('.faq-item').classList.contains('active')) {
                        firstFaqQuestion.click();
                    }
                    observer.unobserve(faqSection);
                }
            });
        }, { threshold: 0.5 });
        faqObserver.observe(faqSection);
    }


    // --- BACKGROUND PARTICLES ---
    const particlesContainer = document.querySelector('.particles-bg');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            const size = Math.random() * 7 + 2;
            particle.style.cssText = `width:${size}px; height:${size}px; left:${Math.random()*100}%; top:${Math.random()*100}%; animation-duration:${Math.random()*10+10}s; animation-delay:${Math.random()*5}s;`;
            particlesContainer.prepend(particle);
        }
    }

    // --- FLOUR PARTICLES ---
    const flourContainer = document.getElementById('flour-particles-container');
    if(flourContainer) {
        const particleCount = 30;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'flour-particle';
            
            const size = Math.random() * 4 + 1; // 1px to 5px
            const randomDelay = Math.random() * 10;
            const randomDuration = Math.random() * 10 + 8; // 8s to 18s
            const randomLeft = Math.random() * 100;

            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${randomLeft}%`;
            particle.style.animationDelay = `${randomDelay}s`;
            particle.style.animationDuration = `${randomDuration}s`;

            flourContainer.appendChild(particle);
        }
    }

    // --- CUSTOM CURSOR ---
    const cursor = document.getElementById('custom-cursor');
    if (cursor) {
        window.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .ingredient-spotlight, .faq-question, .instagram-post, .media-logo-item').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
        });
    }
    
    // --- TIMELINE SHINE ANIMATION ---
    const initShineAnimation = () => {
        const timeline = document.getElementById('timeline');
        const shineElement = document.getElementById('shine-element');
        const stepIcons = [
            document.getElementById('step-icon-1'),
            document.getElementById('step-icon-2'),
            document.getElementById('step-icon-3')
        ];

        if (!timeline || !shineElement || !stepIcons.every(Boolean)) return;

        let animationInterval;

        const checkShinePosition = () => {
            const shineRect = shineElement.getBoundingClientRect();
            
            stepIcons.forEach((icon) => {
                const iconRect = icon.getBoundingClientRect();
                const triggerPoint = iconRect.left + (iconRect.width / 2);

                if (shineRect.right >= triggerPoint && shineRect.left <= triggerPoint) {
                    if (!icon.dataset.flashed) {
                        icon.classList.add('flash');
                        icon.dataset.flashed = 'true';
                        setTimeout(() => {
                            icon.classList.remove('flash');
                        }, 500);
                    }
                }
            });
        };

        shineElement.addEventListener('animationiteration', () => {
            stepIcons.forEach(icon => {
                icon.dataset.flashed = '';
            });
        });
        
        const timelineObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    shineElement.style.opacity = '1';
                    shineElement.style.animationPlayState = 'running';
                    if (!animationInterval) {
                        animationInterval = setInterval(checkShinePosition, 50);
                    }
                } else {
                    shineElement.style.animationPlayState = 'paused';
                     if (animationInterval) {
                        clearInterval(animationInterval);
                        animationInterval = null;
                    }
                }
            });
        }, { threshold: 0.5 });

        timelineObserver.observe(timeline);
    };

    initShineAnimation();

    // --- TIME-BASED GREETING ---
    const greetingEl = document.getElementById('time-based-greeting');
    if (greetingEl) {
        const allGreetings = [
            "Good morning.", "A sweet start to your day.", "Rise and indulge.",
            "Good afternoon.", "A sweet afternoon awaits.", "Your midday treat is calling.",
            "Good evening.", "Indulgence awaits.", "The perfect end to your day.",
            "Sweet dreams await.", "Late night cravings?", "The night is sweet."
        ];

        let greetingIndex = 0;

        function updateGreeting() {
            greetingEl.style.opacity = '0';
            setTimeout(() => {
                greetingEl.innerText = allGreetings[greetingIndex];
                greetingEl.style.opacity = '1';
                greetingIndex = (greetingIndex + 1) % allGreetings.length;
            }, 500);
        }

        greetingIndex = Math.floor(Math.random() * allGreetings.length);
        updateGreeting(); 
        setInterval(updateGreeting, 5000);
    }

});
