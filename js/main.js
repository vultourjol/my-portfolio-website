const isMobile = false; 
let projectSwipers = []; // Выносим в глобальную область

function deferNonEssentialScripts() {
    if (isMobile) {
        window.addEventListener("load", initializeParallaxEffects);
    } else {
        initializeParallaxEffects();
    }
}

function initializeParallaxEffects() {
    const parallaxElements = document.querySelectorAll(".parallax");
    window.addEventListener("scroll", function() {
        if (window.innerWidth <= 640) return; 
        
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = element.offsetTop;
            const distance = (scrollPosition - elementPosition) * 0.1;
                
            if (scrollPosition > elementPosition - window.innerHeight && 
                scrollPosition < elementPosition + element.offsetHeight) {
                element.style.transform = `translateY(${distance}px)`;
            }
        });
    });
}

deferNonEssentialScripts();

function copyToClipboard(text, element) {
    navigator.clipboard.writeText(text).then(function() {
        const originalText = element.innerHTML;
        element.innerHTML = '<span class="text-primary">Скопировано! <i class=\"ri-check-line ml-2 text-lg\"></i></span>';

        setTimeout(function() {
            element.innerHTML = originalText;
        }, 2000);
    }).catch(function(err) {
        console.error('Ошибка копирования: ', err);
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        
        const originalText = element.innerHTML;
        element.innerHTML = '<span class="text-primary">Скопировано! <i class=\"ri-check-line ml-2 text-lg\"></span>';
        
        setTimeout(function() {
            element.innerHTML = originalText;
        }, 2000);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const header = document.querySelector("header");
    window.addEventListener("scroll", function() {
        if (window.scrollY > 100) {
            header.classList.add("bg-black", "shadow-lg");
        } else {
            header.classList.remove("bg-black", "shadow-lg");
        }
    });
            
    const hamburger = document.querySelector(".hamburger-menu");
    const mobileMenu = document.querySelector(".mobile-menu");
            
    hamburger.addEventListener("click", function() {
        hamburger.classList.toggle("active");
        
        if (mobileMenu.classList.contains("translate-x-full")) {
            mobileMenu.classList.remove("translate-x-full");
            document.body.classList.add("overflow-hidden");
        } else {
            mobileMenu.classList.add("translate-x-full");
            document.body.classList.remove("overflow-hidden");
        }
    });

    const mobileLinks = document.querySelectorAll(".mobile-menu a");
    mobileLinks.forEach(link => {
        link.addEventListener("click", function() {
            hamburger.classList.remove("active");
            mobileMenu.classList.add("translate-x-full");
            document.body.classList.remove("overflow-hidden");
        });
    });
            
    document.querySelectorAll("a[href^=\"#\"]").forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            e.preventDefault();
                    
            const targetId = this.getAttribute("href");
            if (targetId === "#") return;
                    
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: "smooth"
                });
            }
        });
    });

    const backToTop = document.querySelector(".back-to-top");
    if (backToTop) {
        backToTop.addEventListener("click", function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    const parallaxElements = document.querySelectorAll(".parallax");
    window.addEventListener("scroll", function() {
        parallaxElements.forEach(element => {
            const scrollPosition = window.pageYOffset;
            const elementPosition = element.offsetTop;
            const distance = (scrollPosition - elementPosition) * 0.1;
                    
            if (scrollPosition > elementPosition - window.innerHeight && 
                scrollPosition < elementPosition + element.offsetHeight) {
                element.style.transform = `translateY(${distance}px)`;
            }
        });
    });

    const modalBackdrop = document.getElementById("modal-backdrop");
    const modalOverlay = document.getElementById("modal-overlay");
    const body = document.body;

    function closeAllModals() {
    const openModals = document.querySelectorAll(".project-modal-content:not(.hidden), .team-modal-content:not(.hidden)");
    
    if (openModals.length === 0) return; 
    
    if (modalBackdrop) {
        modalBackdrop.classList.add("closing");
        modalBackdrop.classList.remove("show");
    }
    
    openModals.forEach(modal => {
        modal.classList.remove("opacity-100", "scale-100");
    });
    
    setTimeout(() => {
        openModals.forEach(modal => {
            modal.classList.add("hidden");
        });
        
        if (modalBackdrop) {
            modalBackdrop.classList.add("hidden");
            modalBackdrop.classList.remove("opacity-100", "closing");
        }
        
        body.classList.remove("overflow-hidden");
    }, 1000); 
}

    document.querySelectorAll(".modal-close").forEach(button => {
        button.addEventListener("click", closeAllModals);
    });

    if (modalOverlay) {
        modalOverlay.addEventListener("click", closeAllModals);
    }

   document.addEventListener("keydown", function(e) {
        if (e.key === "Escape") closeAllModals();
    });

    document.querySelectorAll(".project-card").forEach((card) => {
        card.addEventListener("click", function() {
            const projectId = card.getAttribute("data-project-id");
            const modalId = `modal-project-${projectId}`;
            const modal = document.getElementById(modalId);
            if (modal) {
                closeAllModals(); 
                modalBackdrop.classList.remove("hidden");
                modal.classList.remove("hidden");
                body.classList.add("overflow-hidden");
                setTimeout(() => {
                    modalBackdrop.classList.add("opacity-100", "show"); 
                    modal.classList.add("opacity-100", "scale-100");
                }, 10);
            }
        });
    });

    const swiperConfig = {
        slidesPerView: 'auto',
        spaceBetween: 12,
        loop: true,
        breakpoints: {
            640: { slidesPerView: 1, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 20 }
        },
        pagination: {
            el: ".swiper-pagination",
            clickable: true,
        },
        navigation: {
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
        },
        keyboard: {
            enabled: false,
            onlyInViewport: true,
            pageUpDown: false
        },
        mousewheel: {
            enabled: false,          
            forceToAxis: true,       
            releaseOnEdges: true,    
            sensitivity: 1
        }
    };

    projectSwipers = Array.from(document.querySelectorAll(".project-swiper"))
        .map(el => new Swiper(el, swiperConfig));

    function activateSwiper(swiperInstance) {
        projectSwipers.forEach(sw => {
            sw.keyboard.disable();
            if (sw.mousewheel) sw.mousewheel.disable();
        });
        if (swiperInstance) {
            if (swiperInstance.keyboard) swiperInstance.keyboard.enable();
            if (swiperInstance.mousewheel) swiperInstance.mousewheel.enable();
        }
    }

    projectSwipers.forEach(sw => {
    ['mouseenter','touchstart','focusin'].forEach(evt => {
        sw.el.addEventListener(evt, () => activateSwiper(sw));
    });
    
    // Добавляем обработчики для деактивации
    ['mouseleave','blur'].forEach(evt => {
        sw.el.addEventListener(evt, () => {
            if (sw.keyboard) sw.keyboard.disable();
            if (sw.mousewheel) sw.mousewheel.disable();
        });
    });
    
    if (!sw.el.hasAttribute('tabindex')) {
        sw.el.setAttribute('tabindex', '0');
    }
});

    // Галереи и обработчик клавиш
    const galleries = [];

    document.querySelectorAll('.showcase-images').forEach(imagesContainer => {
        const root = imagesContainer.closest('[data-gallery]') || imagesContainer.parentElement;
        const images = imagesContainer.querySelectorAll('.showcase-image');
        const dots = root.querySelectorAll('.showcase-dot');
        const prevBtn = root.querySelector('.showcase-prev');
        const nextBtn = root.querySelector('.showcase-next');

        let currentIndex = Array.from(images).findIndex(img => img.classList.contains('active'));
        if (currentIndex < 0) currentIndex = 0;

        function showImage(index) {
            images.forEach(img => img.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            if (images[index]) images[index].classList.add('active');
            if (dots[index]) dots[index].classList.add('active');
            currentIndex = index;
        }

        function nextImage() {
            if (!images.length) return;
            const newIndex = (currentIndex + 1) % images.length;
            showImage(newIndex);
        }

        function prevImage() {
            if (!images.length) return;
            const newIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(newIndex);
        }

        if (nextBtn) nextBtn.addEventListener('click', nextImage);
        if (prevBtn) prevBtn.addEventListener('click', prevImage);
        dots.forEach((dot, index) => dot.addEventListener('click', () => showImage(index)));

        showImage(currentIndex);

        galleries.push({ root, nextImage, prevImage });
    });

    // Обработчик клавиш
    document.addEventListener('keydown', function(e) {
        if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
        
        const modalBackdrop = document.getElementById('modal-backdrop');
        const modalOpen = modalBackdrop && !modalBackdrop.classList.contains('hidden');
        
        // Если модальное окно открыто, обрабатываем только галерею в модальном окне
        if (modalOpen) {
            const modalImages = document.querySelector('#modal-backdrop .project-modal-content:not(.hidden) .showcase-images');
            if (modalImages) {
                const modalRoot = modalImages.closest('[data-gallery]') || modalImages.parentElement;
                const gallery = galleries.find(g => g.root === modalRoot);
                if (gallery) {
                    if (e.key === 'ArrowLeft') gallery.prevImage();
                    if (e.key === 'ArrowRight') gallery.nextImage();
                    e.preventDefault();
                }
            }
            return;
        }
        
        // Если модальное окно закрыто, проверяем активный свайпер
        const activeSwiper = projectSwipers.find(sw => 
            sw.keyboard && sw.keyboard.enabled
        );
        
        if (activeSwiper) {
            // Позволяем свайперу обработать клавиши - не блокируем
            return;
        }
        
        // Если нет активного свайпера, обрабатываем основную галерею
        const gallery = galleries[0];
        if (gallery) {
            if (e.key === 'ArrowLeft') gallery.prevImage();
            if (e.key === 'ArrowRight') gallery.nextImage();
            e.preventDefault();
        }
    });

    window.addEventListener("orientationchange", function() {
        const hamburger = document.querySelector(".hamburger-menu");
        const mobileMenu = document.querySelector(".mobile-menu");
        
        if (hamburger.classList.contains("active")) {
            hamburger.classList.remove("active");
            mobileMenu.classList.add("translate-x-full");
            document.body.classList.remove("overflow-hidden");
        }
    });
    
    if (window.innerWidth <= 640) {
        const projectSwiperInstance = document.querySelector(".project-swiper");
        if (projectSwiperInstance && projectSwiperInstance.swiper) {
            projectSwiperInstance.swiper.params.slidesPerView = 1;
            projectSwiperInstance.swiper.params.spaceBetween = 10;
            projectSwiperInstance.swiper.update();
        }
    }
});

window.addEventListener("scroll", function() {
    const header = document.querySelector("header");
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        header.classList.remove("-translate-y-full");
        header.classList.add("translate-y-0");
    } else {
        header.classList.add("-translate-y-full");
        header.classList.remove("translate-y-0");
    }
});