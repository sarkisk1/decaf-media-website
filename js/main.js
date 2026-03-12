/* ============================================
   DECAF MEDIA — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // Mark JS as ready — enables animation initial states via CSS
    document.querySelector('.hero-content').classList.add('js-ready');

    // --- Smooth Scroll (Lenis) ---
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // --- Loader ---
    const loader = document.getElementById('loader');
    const tl = gsap.timeline();

    tl.to(loader, {
        opacity: 0,
        duration: 0.5,
        delay: 2.2,
        ease: 'power2.inOut',
        onComplete: () => {
            loader.style.display = 'none';
            document.body.style.overflow = '';
            animateHero();
        }
    });

    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');
    const cursorText = document.getElementById('cursorText');
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    if (window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            gsap.set(cursor, { x: mouseX - 4, y: mouseY - 4 });
        });

        function updateFollower() {
            followerX += (mouseX - followerX) * 0.1;
            followerY += (mouseY - followerY) * 0.1;
            gsap.set(follower, { x: followerX - 20, y: followerY - 20 });
            requestAnimationFrame(updateFollower);
        }
        updateFollower();

        // Default hover for links & buttons
        const hoverTargets = document.querySelectorAll('a, button, .filter-btn');
        hoverTargets.forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });

        // Custom cursor text for data-cursor elements
        const cursorTextTargets = document.querySelectorAll('[data-cursor]');
        cursorTextTargets.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.classList.add('expanded');
                follower.classList.add('hidden');
                cursorText.textContent = el.dataset.cursor;
                gsap.set(cursor, {
                    x: mouseX - 40,
                    y: mouseY - 40
                });
            });
            el.addEventListener('mousemove', (e) => {
                gsap.set(cursor, {
                    x: e.clientX - 40,
                    y: e.clientY - 40
                });
            });
            el.addEventListener('mouseleave', () => {
                cursor.classList.remove('expanded');
                follower.classList.remove('hidden');
                cursorText.textContent = '';
            });
        });

        // --- Magnetic buttons ---
        const magneticBtns = document.querySelectorAll('.magnetic');
        magneticBtns.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                gsap.to(btn, {
                    x: x * 0.3,
                    y: y * 0.3,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            });
            btn.addEventListener('mouseleave', () => {
                gsap.to(btn, {
                    x: 0,
                    y: 0,
                    duration: 0.6,
                    ease: 'elastic.out(1, 0.5)'
                });
            });
        });
    }

    // --- Navigation ---
    const nav = document.getElementById('nav');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });

    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menuBtn');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuLinks = menuOverlay.querySelectorAll('.menu-link');

    menuBtn.addEventListener('click', () => {
        const isOpen = menuOverlay.classList.contains('open');
        menuBtn.classList.toggle('active');
        menuOverlay.classList.toggle('open');
        if (!isOpen) {
            lenis.stop();
        } else {
            lenis.start();
        }
    });

    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            menuOverlay.classList.remove('open');
            lenis.start();
        });
    });

    // --- Hero Animation ---
    function animateHero() {
        const heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        heroTl
            .to('.hero-logo', {
                opacity: 1,
                y: 0,
                duration: 1
            })
            .to('.hero-line-inner', {
                y: '0%',
                duration: 1.2,
                stagger: 0.15,
                ease: 'power4.out'
            }, '-=0.6')
            .to('.hero-meta', {
                opacity: 1,
                y: 0,
                duration: 0.8
            }, '-=0.5')
            .to('.hero-scroll', {
                opacity: 1,
                duration: 0.6
            }, '-=0.3');
    }

    // --- Hero Parallax ---
    gsap.to('.hero-bg', {
        scale: 0.92,
        opacity: 0.3,
        scrollTrigger: {
            trigger: '.hero',
            start: 'top top',
            end: 'bottom top',
            scrub: 1.5
        }
    });

    // --- Generic scroll animations ---
    const fadeUpElements = document.querySelectorAll('.anim-fade-up');
    fadeUpElements.forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                once: true
            }
        });
    });

    // --- Showreel scroll animation ---
    gsap.from('.showreel-player', {
        scale: 0.95,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.showreel-player',
            start: 'top 85%',
            once: true
        }
    });

    // --- Showreel Play/Close ---
    const showreelPoster = document.getElementById('showreelPoster');
    const showreelVideo = document.getElementById('showreelVideo');
    const showreelIframe = document.getElementById('showreelIframe');
    const showreelClose = document.getElementById('showreelClose');
    // Placeholder Vimeo showreel — replace with Decaf Media's actual showreel URL
    const showreelUrl = 'https://player.vimeo.com/video/824804225?autoplay=1&title=0&byline=0&portrait=0';

    showreelPoster.addEventListener('click', () => {
        showreelPoster.style.display = 'none';
        showreelVideo.style.display = 'block';
        showreelIframe.src = showreelUrl;
    });

    showreelClose.addEventListener('click', (e) => {
        e.stopPropagation();
        showreelVideo.style.display = 'none';
        showreelIframe.src = '';
        showreelPoster.style.display = 'block';
    });

    // --- Work items stagger ---
    const workItems = document.querySelectorAll('.work-item');
    workItems.forEach((item, i) => {
        gsap.from(item, {
            opacity: 0,
            y: 80,
            duration: 1,
            delay: i * 0.08,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: item,
                start: 'top 90%',
                once: true
            }
        });
    });

    // --- Portfolio Filter ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const allWorkItems = document.querySelectorAll('.work-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;

            allWorkItems.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    gsap.to(item, {
                        opacity: 1,
                        scale: 1,
                        duration: 0.5,
                        ease: 'power2.out',
                        display: 'block'
                    });
                } else {
                    gsap.to(item, {
                        opacity: 0,
                        scale: 0.95,
                        duration: 0.3,
                        ease: 'power2.in',
                        onComplete: () => { item.style.display = 'none'; }
                    });
                }
            });
        });
    });

    // --- Service cards stagger ---
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, i) => {
        gsap.from(card, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: i * 0.1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                once: true
            }
        });
    });

    // --- Stats Counter ---
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
        const target = parseInt(stat.dataset.count);
        ScrollTrigger.create({
            trigger: stat,
            start: 'top 85%',
            once: true,
            onEnter: () => {
                gsap.to({ val: 0 }, {
                    val: target,
                    duration: 2,
                    ease: 'power2.out',
                    onUpdate: function () {
                        stat.textContent = Math.round(this.targets()[0].val);
                    }
                });
            }
        });
    });

    // --- About image parallax ---
    gsap.to('.about-image img', {
        y: -40,
        scrollTrigger: {
            trigger: '.about-image',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1
        }
    });

    // --- Contact Form ---
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-primary span');
        const originalText = btn.textContent;
        btn.textContent = 'Sent!';

        gsap.fromTo(contactForm.querySelector('.btn-primary'), {
            scale: 0.95
        }, {
            scale: 1,
            duration: 0.4,
            ease: 'elastic.out(1, 0.5)'
        });

        setTimeout(() => {
            btn.textContent = originalText;
            contactForm.reset();
        }, 2500);
    });

    // --- Smooth scroll anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const target = document.querySelector(href);
            if (target) {
                // If this link has a filter category, activate that filter immediately
                const filterCategory = this.dataset.filterLink;
                if (filterCategory) {
                    const filterBtn = document.querySelector(`.filter-btn[data-filter="${filterCategory}"]`);
                    if (filterBtn) filterBtn.click();
                }

                lenis.scrollTo(target, {
                    offset: -80,
                    duration: 1.5
                });
            }
        });
    });

    // --- Parallax for showreel on scroll ---
    gsap.to('.showreel-player', {
        y: -30,
        scrollTrigger: {
            trigger: '.showreel',
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
        }
    });

    // --- Footer animation ---
    gsap.from('.footer-large-text a', {
        opacity: 0,
        y: 60,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
            trigger: '.footer-large-text',
            start: 'top 90%',
            once: true
        }
    });

    gsap.from('.footer-grid > div', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        scrollTrigger: {
            trigger: '.footer-grid',
            start: 'top 90%',
            once: true
        }
    });
});
