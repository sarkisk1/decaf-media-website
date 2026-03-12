/* ============================================
   DECAF MEDIA — Project Page
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    gsap.registerPlugin(ScrollTrigger);

    // --- Get project from URL hash ---
    const slug = window.location.hash.replace('#', '') || PROJECTS[0].slug;
    const projectIndex = PROJECTS.findIndex(p => p.slug === slug);
    const project = PROJECTS[projectIndex] || PROJECTS[0];

    // --- Set page title ---
    document.title = `${project.title} — Decaf Media`;

    // --- Populate content ---
    document.getElementById('projectHeroImg').src = project.image;
    document.getElementById('projectHeroImg').alt = project.title;
    document.getElementById('projectCategory').textContent = project.categoryLabel;
    document.getElementById('projectTitle').textContent = project.title;
    document.getElementById('projectClient').textContent = project.client;
    document.getElementById('projectType').textContent = project.categoryLabel;
    document.getElementById('projectYear').textContent = project.year;
    document.getElementById('projectRole').textContent = project.role;
    document.getElementById('projectDescription').textContent = project.description;

    // --- Gallery ---
    const galleryEl = document.getElementById('projectGallery');
    project.gallery.forEach(src => {
        const img = document.createElement('img');
        img.src = src;
        img.alt = project.title;
        img.loading = 'lazy';
        galleryEl.appendChild(img);
    });

    // --- Prev / Next ---
    const prevIndex = projectIndex > 0 ? projectIndex - 1 : PROJECTS.length - 1;
    const nextIndex = projectIndex < PROJECTS.length - 1 ? projectIndex + 1 : 0;

    const prevProject = PROJECTS[prevIndex];
    const nextProject = PROJECTS[nextIndex];

    document.getElementById('projectPrev').href = `project.html#${prevProject.slug}`;
    document.getElementById('prevTitle').textContent = prevProject.title;
    document.getElementById('projectNext').href = `project.html#${nextProject.slug}`;
    document.getElementById('nextTitle').textContent = nextProject.title;

    // --- Animations ---
    gsap.from('.project-hero-img', {
        scale: 1.1,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.out'
    });

    gsap.from('.project-header', {
        opacity: 0,
        y: 40,
        duration: 0.8,
        delay: 0.3,
        ease: 'power2.out'
    });

    gsap.from('.project-body', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 0.5,
        ease: 'power2.out'
    });

    const galleryImages = galleryEl.querySelectorAll('img');
    galleryImages.forEach((img, i) => {
        gsap.from(img, {
            opacity: 0,
            y: 50,
            duration: 0.8,
            delay: 0.6 + i * 0.15,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: img,
                start: 'top 88%',
                once: true
            }
        });
    });

    gsap.from('.project-nav', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        scrollTrigger: {
            trigger: '.project-nav',
            start: 'top 90%',
            once: true
        }
    });

    // --- Custom Cursor ---
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursor-follower');

    if (window.innerWidth > 768) {
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;

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

        document.querySelectorAll('a, button').forEach(el => {
            el.addEventListener('mouseenter', () => follower.classList.add('hover'));
            el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
        });
    }

    // --- Mobile Menu ---
    const menuBtn = document.getElementById('menuBtn');
    const menuOverlay = document.getElementById('menuOverlay');

    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('active');
        menuOverlay.classList.toggle('open');
    });

    menuOverlay.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('active');
            menuOverlay.classList.remove('open');
        });
    });
});
