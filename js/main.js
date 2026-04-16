const isMobile = false; 
let projectSwipers = []; // Выносим в глобальную область
let currentLanguage = "ru";

const LANGUAGE_STORAGE_KEY = "siteLanguage";

const PAGE_TRANSLATIONS = {
    ru: {
        html: {
            "#portfolio h2 a": "Мои <span class=\"text-primary\">Проекты</span>",
            "#showcase h2 a": "Крайний <span class=\"text-primary\">Проект</span>",
            "#about h2 a": "Обо <span class=\"text-primary\">Мне</span>",
            "#contact h2 a": "Остаемся на <span class=\"text-primary\">Связи</span>",
            "header nav.hidden.lg\\:flex a[href='news.html']": "<i class=\"ri-news-line\"></i> Новости",
            ".mobile-menu a[href='news.html']": "<i class=\"ri-news-line\"></i> Новости",
            ".project-card[data-project-id='2'] .project-overlay h3:first-of-type": "<span class=\"text-primary\">< в разработке ></span>",
            "#showcase .featured-project .absolute.bottom-0.left-0.p-12 h3:first-child": "<span class=\"text-primary\">< в разработке ></span>",
            "#modal-project-2 .absolute.bottom-0.left-0.p-8 h3:first-child": "<span class=\"text-primary\">< в разработке ></span>",
            "#showcase .featured-project .absolute.bottom-0.left-0.p-12 .flex a:nth-child(2) span": "Ссылка <i class=\"ri-temp-cold-line text-white text-xl\"></i>",
            "#modal-project-1 .absolute.bottom-0.left-0.p-8 .flex a:last-child span": "Где-то я это видел... <i class=\"ri-movie-2-line text-white text-xl\"></i>"
        },
        text: {
            "header nav.hidden.lg\\:flex a[href='#portfolio']": "Портфолио",
            "header nav.hidden.lg\\:flex a[href='#showcase']": "Новое",
            "header nav.hidden.lg\\:flex a[href='#about']": "Обо мне",
            "header nav.hidden.lg\\:flex a[href='#contact']": "Контакты",
            ".mobile-menu a[href='#portfolio']": "Портфолио",
            ".mobile-menu a[href='#showcase']": "Новое",
            ".mobile-menu a[href='#about']": "Обо мне",
            ".mobile-menu a[href='#contact']": "Контакты",
            "#hero p": "Developing your ideas",
            ".project-card[data-project-id='2'] .project-overlay h3:nth-of-type(2)": "СТУДИЯ 16/9",
            ".project-card[data-project-id='2'] .project-overlay p": "Сайт студии видеопроизводства",
            ".project-card[data-project-id='1'] .project-overlay p": "Сайт портфолио продюсера / режиссёра монтажа.",
            "#showcase .featured-project .absolute.bottom-0.left-0.p-12 p": "Интернет магазин обогревательных котлов для загородной недвижимости.",
            "#about .mt-12.md\\:mt-16 h3": "Рабочее пространство",
            "#about .grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div:first-child h4": "Софт",
            "#about .grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div:last-child h4": "Железо",
            "#contact .grid > div:nth-child(1) h4": "Локация",
            "#contact .grid > div:nth-child(1) p": "Россия, Москва",
            "#contact .grid > div:nth-child(2) h4": "Почта",
            "#contact .grid > div:nth-child(3) h4": "Telegram",
            "footer a[href='source/privacy-policy.pdf']": "Политика конфиденциальности",
            "footer a[href='https://policies.google.com/terms?hl=ru']": "Условия использования",
            "#modal-project-2 .p-8 > p": "Студия видеопроизводства предлагает полный спектр услуг по созданию высококачественного видеоконтента, от разработки концепции до финального монтажа.",
            "#modal-project-2 .absolute.bottom-0.left-0.p-8 h3:nth-of-type(2)": "СТУДИЯ 16/9",
            "#modal-project-2 .p-8 .grid p:first-of-type": "Удобная навигация, которая позволяет легко найти информацию о всех услугах, и подробное портфолио с примерами работ, демонстрирующее опыт и креативность студии.",
            "#modal-project-2 .p-8 .grid p:last-of-type": "На сайте есть простая и более подробная форма обратной связи для быстрой консультации и заказа проекта.",
            "#modal-project-1 .p-8 .grid p:first-of-type": "Удобная навигация и подробное портфолио, демонстрирующее опыт и креативность автора.",
            "#modal-project-1 .p-8 .grid p:last-of-type": "Невероятно красивый.",
            "#modal-project-99 .absolute.bottom-0.left-0.p-8 h3": "Ой, тут так пусто",
            "#modal-project-99 .p-8 > p": "Скоро здесь появится новый проект, на который можно будет взглянуть.",
            "#modal-project-99 .p-8 .grid p:first-of-type": "Можете посмотреть мои прошлые работы, вдруг что понравится.",
            "#modal-project-99 .p-8 .grid p:last-of-type": "Можете связаться со мной, если у вас возникла идея."
        },
        listText: {
            ".project-card[data-project-id='99'] h3": ["Скоро", "Скоро"],
            ".project-card[data-project-id='99'] p": ["Новый проект в разработке", "Новый проект в разработке"],
            "#showcase .grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div > h4": ["Технологии", "Особенности"],
            "#showcase .grid.grid-cols-2.gap-4 h5": ["Дизайн", "Анимации"],
            "#modal-project-2 .p-8 .grid > div > h4": ["Особенности", "А также"],
            "#modal-project-2 .p-8 .grid > div > p": ["Удобная навигация, которая позволяет легко найти информацию о всех услугах, и подробное портфолио с примерами работ, демонстрирующее опыт и креативность студии.", "На сайте есть простая и более подробная форма обратной связи для быстрой консультации и заказа проекта."],
            "#modal-project-1 .p-8 .grid > div > h4": ["Особенности", "А также"],
            "#modal-project-1 .p-8 .grid > div > p": ["Удобная навигация и подробное портфолио, демонстрирующее опыт и креативность автора.", "Невероятно красивый."],
            "#modal-project-99 .p-8 .grid > div > h4": ["Пока что...", "А еще!"],
            "#modal-project-99 .p-8 .grid > div > p": ["Можете посмотреть мои прошлые работы, вдруг что понравится.", "Можете связаться со мной, если у вас возникла идея."],
            "#modal-project-99 .absolute.bottom-0.left-0.p-8 .flex span": ["хорошо", "хоть", "не"],
            "#about .grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div:last-child ul li": ["RTX 5060 Ti 8GB", "Ryzen 5 5600", "RAM 32GB", "2+ TB Data Storage", "Macbook Air M1"]
        }
    },
    en: {
        html: {
            "#portfolio h2 a": "My <span class=\"text-primary\">Projects</span>",
            "#showcase h2 a": "Latest <span class=\"text-primary\">Project</span>",
            "#about h2 a": "About <span class=\"text-primary\">Me</span>",
            "#contact h2 a": "Stay in <span class=\"text-primary\">Touch</span>",
            "header nav.hidden.lg\\:flex a[href='news.html']": "<i class=\"ri-news-line\"></i> News",
            ".mobile-menu a[href='news.html']": "<i class=\"ri-news-line\"></i> News",
            ".project-card[data-project-id='2'] .project-overlay h3:first-of-type": "<span class=\"text-primary\">< in development ></span>",
            "#showcase .featured-project .absolute.bottom-0.left-0.p-12 h3:first-child": "<span class=\"text-primary\">< in development ></span>",
            "#modal-project-2 .absolute.bottom-0.left-0.p-8 h3:first-child": "<span class=\"text-primary\">< in development ></span>",
            "#showcase .featured-project .absolute.bottom-0.left-0.p-12 .flex a:nth-child(2) span": "Link <i class=\"ri-temp-cold-line text-white text-xl\"></i>",
            "#modal-project-1 .absolute.bottom-0.left-0.p-8 .flex a:last-child span": "Looks familiar... <i class=\"ri-movie-2-line text-white text-xl\"></i>"
        },
        text: {
            "header nav.hidden.lg\\:flex a[href='#portfolio']": "Portfolio",
            "header nav.hidden.lg\\:flex a[href='#showcase']": "Latest",
            "header nav.hidden.lg\\:flex a[href='#about']": "About",
            "header nav.hidden.lg\\:flex a[href='#contact']": "Contact",
            ".mobile-menu a[href='#portfolio']": "Portfolio",
            ".mobile-menu a[href='#showcase']": "Latest",
            ".mobile-menu a[href='#about']": "About",
            ".mobile-menu a[href='#contact']": "Contact",
            "#hero p": "Developing your ideas",
            ".project-card[data-project-id='2'] .project-overlay h3:nth-of-type(2)": "STUDIO 16/9",
            ".project-card[data-project-id='2'] .project-overlay p": "Video production studio website",
            ".project-card[data-project-id='1'] .project-overlay p": "Portfolio website of a producer/editor.",            
            "#showcase .featured-project .absolute.bottom-0.left-0.p-12 p": "Online store for heating boilers for country homes.",
            "#about .mt-12.md\\:mt-16 h3": "Workspace",
            "#about .grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div:first-child h4": "Software",
            "#about .grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div:last-child h4": "Hardware",
            "#contact .grid > div:nth-child(1) h4": "Location",
            "#contact .grid > div:nth-child(1) p": "Russia, Moscow",
            "#contact .grid > div:nth-child(2) h4": "Email",
            "#contact .grid > div:nth-child(3) h4": "Telegram",
            "footer a[href='source/privacy-policy.pdf']": "Privacy Policy",
            "footer a[href='https://policies.google.com/terms?hl=ru']": "Terms of Use",
            "#modal-project-2 .p-8 > p": "The video production studio offers a full range of services for creating high-quality video content, from concept development to final editing.",
            "#modal-project-2 .absolute.bottom-0.left-0.p-8 h3:nth-of-type(2)": "STUDIO 16/9",
            "#modal-project-2 .p-8 .grid p:first-of-type": "Convenient navigation helps visitors quickly find service information, and a detailed portfolio showcases the studio's experience and creativity.",
            "#modal-project-2 .p-8 .grid p:last-of-type": "The site includes both a quick and a detailed contact form for fast consultations and project requests.",
            "#modal-project-1 .p-8 .grid p:first-of-type": "Convenient navigation and a detailed portfolio that demonstrates the author's experience and creativity.",
            "#modal-project-1 .p-8 .grid p:last-of-type": "Incredibly beautiful.",
            "#modal-project-99 .absolute.bottom-0.left-0.p-8 h3": "Oops, it is empty here",
            "#modal-project-99 .p-8 > p": "A new project will appear here soon.",
            "#modal-project-99 .p-8 .grid p:first-of-type": "You can check out my previous work in the meantime.",
            "#modal-project-99 .p-8 .grid p:last-of-type": "Feel free to contact me if you have an idea."
        },
        listText: {
            ".project-card[data-project-id='99'] h3": ["Soon", "Soon"],
            ".project-card[data-project-id='99'] p": ["A new project is in development", "A new project is in development"],
            "#showcase .grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div > h4": ["Technologies", "Features"],
            "#showcase .grid.grid-cols-2.gap-4 h5": ["Design", "Animations"],
            "#modal-project-2 .p-8 .grid > div > h4": ["Features", "Also"],
            "#modal-project-2 .p-8 .grid > div > p": ["Convenient navigation helps visitors quickly find service information, and a detailed portfolio showcases the studio's experience and creativity.", "The site includes both a quick and a detailed contact form for fast consultations and project requests."],
            "#modal-project-1 .p-8 .grid > div > h4": ["Features", "Also"],
            "#modal-project-1 .p-8 .grid > div > p": ["Convenient navigation and a detailed portfolio that demonstrates the author's experience and creativity.", "Incredibly beautiful."],
            "#modal-project-99 .p-8 .grid > div > h4": ["For now...", "And one more thing!"],
            "#modal-project-99 .p-8 .grid > div > p": ["You can check out my previous work in the meantime.", "Feel free to contact me if you have an idea."],
            "#modal-project-99 .absolute.bottom-0.left-0.p-8 .flex span": ["good", "at least", "not"],
            "#about .grid.grid-cols-1.md\\:grid-cols-2.gap-6 > div:last-child ul li": ["RTX 5060 Ti 8GB", "Ryzen 5 5600", "RAM 32GB", "2+ TB Data Storage", "Macbook Air M1"]
        }
    }
};

function updateLanguageButtons(lang) {
    const languageLabel = lang === "en" ? "EN" : "РУ";
    const desktopToggle = document.getElementById("lang-toggle");
    const mobileToggle = document.getElementById("mobile-lang-toggle");

    if (desktopToggle) {
        desktopToggle.innerHTML = `<i class="ri-earth-line"></i> ${languageLabel}`;
    }

    if (mobileToggle) {
        mobileToggle.innerHTML = `<i class="ri-earth-line"></i> ${languageLabel}`;
    }
}

function applyLanguage(lang) {
    const selectedLanguage = PAGE_TRANSLATIONS[lang] ? lang : "ru";
    const dictionary = PAGE_TRANSLATIONS[selectedLanguage];

    Object.entries(dictionary.text).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.textContent = value;
        }
    });

    Object.entries(dictionary.html).forEach(([selector, value]) => {
        const element = document.querySelector(selector);
        if (element) {
            element.innerHTML = value;
        }
    });

    Object.entries(dictionary.listText).forEach(([selector, values]) => {
        const elements = document.querySelectorAll(selector);
        values.forEach((value, index) => {
            if (elements[index]) {
                elements[index].textContent = value;
            }
        });
    });

    currentLanguage = selectedLanguage;
    document.documentElement.lang = selectedLanguage;
    updateLanguageButtons(selectedLanguage);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, selectedLanguage);
}

function getCopySuccessText() {
    return currentLanguage === "en" ? "Copied!" : "Скопировано!";
}

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
        element.innerHTML = `<span class="text-primary">${getCopySuccessText()} <i class=\"ri-check-line ml-2 text-lg\"></i></span>`;

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
        element.innerHTML = `<span class="text-primary">${getCopySuccessText()} <i class=\"ri-check-line ml-2 text-lg\"></span>`;
        
        setTimeout(function() {
            element.innerHTML = originalText;
        }, 2000);
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY) || "ru";
    applyLanguage(savedLanguage);

    const languageToggles = [
        document.getElementById("lang-toggle"),
        document.getElementById("mobile-lang-toggle")
    ];

    languageToggles.forEach(toggle => {
        if (!toggle) return;
        toggle.addEventListener("click", function(e) {
            e.preventDefault();
            const nextLanguage = currentLanguage === "ru" ? "en" : "ru";
            applyLanguage(nextLanguage);
        });
    });

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