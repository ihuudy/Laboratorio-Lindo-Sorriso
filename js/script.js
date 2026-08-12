document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Header Scroll Effect & Active Link Highlighting
    const header = document.querySelector('header');
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 5px 20px rgba(0,0,0,0.5)';
        } else {
            header.style.boxShadow = 'none';
        }

        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });
    });

    // Intersection Observer for scroll animations (Fade In)
    const fadeElements = document.querySelectorAll('.fade-in');
    
    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion) {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // If reduced motion is preferred, make everything visible immediately
        fadeElements.forEach(el => {
            el.classList.add('visible');
            el.style.opacity = '1';
            el.style.transform = 'none';
            el.style.transition = 'none';
        });
    }

    // Form Submission to WhatsApp
    const form = document.getElementById('contatoForm');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nome = document.getElementById('nome').value;
        const email = document.getElementById('email').value;
        const telefone = document.getElementById('telefone').value;
        const motivo = document.getElementById('motivo').value;

        // Validation for required fields is handled by HTML5 'required' attribute
        
        const message = `*Nova mensagem pelo site Lindo Sorriso*\n\n` +
                        `*Nome:* ${nome}\n` +
                        `*Email:* ${email}\n` +
                        `*Telefone:* ${telefone}\n` +
                        `*Motivo do contato:*\n${motivo}`;

        const encodedMessage = encodeURIComponent(message);
        // The requested WhatsApp number: 55+ (11)95976-6131 -> 5511959766131
        const whatsappNumber = '5511959766131'; 
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        form.reset();
    });

    // Drag-to-scroll for Deflex Carousel on Desktop
    const deflexCarousel = document.querySelector('.deflex-carousel');
    let isDown = false;
    let startX;
    let scrollLeft;

    deflexCarousel.addEventListener('mousedown', (e) => {
        isDown = true;
        deflexCarousel.style.cursor = 'grabbing';
        startX = e.pageX - deflexCarousel.offsetLeft;
        scrollLeft = deflexCarousel.scrollLeft;
    });
    deflexCarousel.addEventListener('mouseleave', () => {
        isDown = false;
        deflexCarousel.style.cursor = 'grab';
    });
    deflexCarousel.addEventListener('mouseup', () => {
        isDown = false;
        deflexCarousel.style.cursor = 'grab';
    });
    deflexCarousel.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - deflexCarousel.offsetLeft;
        const walk = (x - startX) * 2; // scroll-fast
        deflexCarousel.scrollLeft = scrollLeft - walk;
    });

    // Infinite Continuous Carousel for Deflex on Mobile
    if (window.innerWidth <= 768 && !deflexCarousel.classList.contains('is-cloned')) {
        deflexCarousel.classList.add('is-cloned');
        const originalCards = Array.from(deflexCarousel.children);
        
        // Append 4 more sets to have 15 cards total (5 sets of 3)
        for (let i = 0; i < 4; i++) {
            originalCards.forEach(card => {
                deflexCarousel.appendChild(card.cloneNode(true));
            });
        }
        
        // Disable scroll snap for continuous movement
        deflexCarousel.style.scrollSnapType = 'none';
        
        let isTouching = false;
        
        deflexCarousel.addEventListener('touchstart', () => isTouching = true, {passive: true});
        deflexCarousel.addEventListener('touchend', () => isTouching = false);
        
        function autoScroll() {
            if (!isTouching) {
                deflexCarousel.scrollLeft += 1;
            }
            
            if (deflexCarousel.children.length > 0) {
                const cardWidth = deflexCarousel.children[0].offsetWidth;
                const gap = 20; 
                const setWidth = (cardWidth + gap) * originalCards.length;
                
                // Loop check: if scrolled to 4th set, silently jump back to 3rd set
                if (deflexCarousel.scrollLeft >= setWidth * 3) {
                    deflexCarousel.scrollLeft -= setWidth;
                } else if (deflexCarousel.scrollLeft <= setWidth) { // if scrolled back to 2nd set
                    deflexCarousel.scrollLeft += setWidth;
                }
            }
            
            requestAnimationFrame(autoScroll);
        }
        
        setTimeout(() => {
            if (deflexCarousel.children.length > 0) {
                const cardWidth = deflexCarousel.children[0].offsetWidth;
                const gap = 20; 
                const setWidth = (cardWidth + gap) * originalCards.length;
                // Start at the third set (index 2)
                deflexCarousel.scrollLeft = setWidth * 2;
                autoScroll();
            }
        }, 100);
    }
});
