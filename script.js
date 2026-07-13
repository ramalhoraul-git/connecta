/* ============================================
   CONNECTA - Landing Page Scripts
   Consultoria & Contabilidade Digital
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    /* ---- NAVBAR SCROLL ---- */
    var navbar = document.getElementById('navbar');
    var backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function () {
        var scrollY = window.scrollY;
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        if (scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    /* ---- MENU MOBILE ---- */
    var hamburger = document.getElementById('hamburger');
    var navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
        link.addEventListener('click', function () {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    /* ---- PARTÍCULAS ---- */
    var particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (var i = 0; i < 30; i++) {
            var particle = document.createElement('div');
            particle.classList.add('particle');
            var size = Math.random() * 8 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particlesContainer.appendChild(particle);
        }
    }

    /* ---- CARROSSEL DEPOIMENTOS ---- */
    var testimonialsTrack = document.getElementById('testimonialsTrack');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var dotsContainer = document.getElementById('carouselDots');

    if (testimonialsTrack) {
        var cards = testimonialsTrack.querySelectorAll('.testimonial-card');
        var currentIndex = 0;
        var cardsPerView = getCardsPerView();

        function getCardsPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function getTotalSlides() {
            return Math.max(1, cards.length - cardsPerView + 1);
        }

        function createDots() {
            dotsContainer.innerHTML = '';
            var total = getTotalSlides();
            for (var i = 0; i < total; i++) {
                var dot = document.createElement('div');
                dot.classList.add('dot');
                if (i === 0) dot.classList.add('active');
                (function (index) {
                    dot.addEventListener('click', function () { goToSlide(index); });
                })(i);
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            var cardWidth = cards[0].offsetWidth + 16;
            testimonialsTrack.style.transform = 'translateX(-' + (currentIndex * cardWidth) + 'px)';
            var dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(function (dot, i) {
                dot.classList.toggle('active', i === currentIndex);
            });
        }

        function goToSlide(index) {
            currentIndex = Math.max(0, Math.min(index, getTotalSlides() - 1));
            updateCarousel();
        }

        function nextSlide() {
            currentIndex = (currentIndex + 1) % getTotalSlides();
            updateCarousel();
        }

        function prevSlide() {
            currentIndex = (currentIndex - 1 + getTotalSlides()) % getTotalSlides();
            updateCarousel();
        }

        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        createDots();

        var autoPlay = setInterval(nextSlide, 5000);
        testimonialsTrack.addEventListener('mouseenter', function () { clearInterval(autoPlay); });
        testimonialsTrack.addEventListener('mouseleave', function () { autoPlay = setInterval(nextSlide, 5000); });

        var touchStartX = 0;
        testimonialsTrack.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        testimonialsTrack.addEventListener('touchend', function (e) {
            var diff = touchStartX - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
            }
        }, { passive: true });

        window.addEventListener('resize', function () {
            cardsPerView = getCardsPerView();
            createDots();
            currentIndex = Math.min(currentIndex, getTotalSlides() - 1);
            updateCarousel();
        });
    }

    /* ---- CARROSSEL BLOG ---- */
    var blogTrack = document.getElementById('blogTrack');
    var blogPrev = document.getElementById('blogPrev');
    var blogNext = document.getElementById('blogNext');

    if (blogTrack) {
        var blogCards = blogTrack.querySelectorAll('.blog-card');
        var blogIndex = 0;

        function getBlogPerView() {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        }

        function getBlogTotalSlides() {
            return Math.max(1, blogCards.length - getBlogPerView() + 1);
        }

        function updateBlog() {
            var cardWidth = blogCards[0].offsetWidth + 24;
            blogTrack.style.transform = 'translateX(-' + (blogIndex * cardWidth) + 'px)';
        }

        blogNext.addEventListener('click', function () {
            blogIndex = (blogIndex + 1) % getBlogTotalSlides();
            updateBlog();
        });

        blogPrev.addEventListener('click', function () {
            blogIndex = (blogIndex - 1 + getBlogTotalSlides()) % getBlogTotalSlides();
            updateBlog();
        });

        var blogTouchStart = 0;
        blogTrack.addEventListener('touchstart', function (e) {
            blogTouchStart = e.changedTouches[0].screenX;
        }, { passive: true });

        blogTrack.addEventListener('touchend', function (e) {
            var diff = blogTouchStart - e.changedTouches[0].screenX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) blogIndex = (blogIndex + 1) % getBlogTotalSlides();
                else blogIndex = (blogIndex - 1 + getBlogTotalSlides()) % getBlogTotalSlides();
                updateBlog();
            }
        }, { passive: true });

        window.addEventListener('resize', function () {
            blogIndex = Math.min(blogIndex, getBlogTotalSlides() - 1);
            updateBlog();
        });
    }

    /* ---- FAQ ACORDEÃO ---- */
    var faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(function (item) {
        var question = item.querySelector('.faq-question');
        var answer = item.querySelector('.faq-answer');

        question.addEventListener('click', function () {
            var isActive = item.classList.contains('active');
            faqItems.forEach(function (fi) {
                fi.classList.remove('active');
                fi.querySelector('.faq-answer').style.maxHeight = null;
            });
            if (!isActive) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });

    /* ---- FORMULÁRIO → WHATSAPP ---- */
    var contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var name = document.getElementById('name').value.trim();
            var phone = document.getElementById('phone').value.trim();
            var service = document.getElementById('service').value;
            var message = document.getElementById('message').value.trim();

            var msg = 'Olá Erilma! Vim pelo site da CONNECTA.%0A%0A';
            msg += '*Nome:* ' + encodeURIComponent(name) + '%0A';
            msg += '*WhatsApp:* ' + encodeURIComponent(phone) + '%0A';
            msg += '*Serviço:* ' + encodeURIComponent(service) + '%0A';
            if (message) {
                msg += '*Mensagem:* ' + encodeURIComponent(message) + '%0A';
            }
            msg += '%0AEstou aguardando seu retorno! 😊';

            window.open('https://wa.me/5534998847279?text=' + msg, '_blank');
        });
    }

    /* ---- ANIMAÇÕES ON SCROLL (AOS Custom) ---- */
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                var delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(function () {
                    entry.target.classList.add('aos-animate');
                }, parseInt(delay));
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('[data-aos]').forEach(function (el) {
        observer.observe(el);
    });

    /* ---- SMOOTH SCROLL ---- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    /* ---- MÁSCARA TELEFONE ---- */
    var phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function (e) {
            var value = e.target.value.replace(/\D/g, '');
            if (value.length > 11) value = value.slice(0, 11);
            if (value.length > 7) {
                value = '(' + value.slice(0, 2) + ') ' + value.slice(2, 7) + '-' + value.slice(7);
            } else if (value.length > 2) {
                value = '(' + value.slice(0, 2) + ') ' + value.slice(2);
            } else if (value.length > 0) {
                value = '(' + value;
            }
            e.target.value = value;
        });
    }

    /* ---- NAV LINK ATIVO NO SCROLL ---- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function () {
        var current = '';
        sections.forEach(function (section) {
            var sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(function (link) {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });

});
