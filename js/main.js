document.addEventListener("DOMContentLoaded", () => {
    // Cargar header
    fetch("/partials/header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header-container").innerHTML = data;
            setupHeaderScroll();
            setupActiveMenuItem();
            setupMobileMenu();
        });
    // Cargar footer
    fetch("/partials/footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer-container").innerHTML = data;
        });
});

function setupHeaderScroll() {
    const header = document.getElementById("header");
    if (!header) return;
    
    function handleScroll() {
        if (window.scrollY > 10) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
    
    window.addEventListener("scroll", handleScroll);
    handleScroll();
}

function setupActiveMenuItem() {
    const links = document.querySelectorAll(".nav-link");
    if (!links.length) return;

    let hasUserScrolled = false;

    function clearActiveLinks() {
        links.forEach(link => link.classList.remove("active"));
    }

    function getCurrentSectionByScroll() {
        if (window.scrollY === 0) {
            return '#home';
        }

        const sections = document.querySelectorAll("section[id]");
        for (let section of sections) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom > 100) {
                return `#${section.id}`;
            }
        }
        return '#home';
    }

    function updateActiveLink() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;

        clearActiveLinks();

        // Página principal con scroll y/o hash
        if (currentPath === "/" || currentPath.includes("index.html")) {
            let targetHash;

            if (!hasUserScrolled && currentHash) {
                // Si no se ha hecho scroll, usar el hash original
                targetHash = currentHash;
            } else {
                // Si ya hubo scroll, usar sección visible
                targetHash = getCurrentSectionByScroll();
            }

            // Inicio
            if (targetHash === '#home') {
                const homeLink = document.querySelector('a.nav-link[href="/"], a.nav-link[href*="index.html"]');
                if (homeLink) homeLink.classList.add("active");
                return;
            }

            const activeLink = document.querySelector(`a.nav-link[href$="${targetHash}"]`);
            if (activeLink) activeLink.classList.add("active");

            return;
        }

        // Otras rutas (como antes)
        if (currentPath.startsWith("/projects")) {
            const projectLink = document.querySelector('a.nav-link[href*="#projects"]');
            if (projectLink) projectLink.classList.add("active");
            return;
        }

        if (currentPath.startsWith("/services")) {
            const servicesLink = document.querySelector('a.nav-link[href*="#services"]');
            if (servicesLink) servicesLink.classList.add("active");
            return;
        }

        if (currentPath.startsWith("/competitions")) {
            const competitionsLink = document.querySelector('a.nav-link[href*="#competitions"]');
            if (competitionsLink) competitionsLink.classList.add("active");
            return;
        }

        if (currentPath.startsWith("/about")) {
            const competitionsLink = document.querySelector('a.nav-link[href*="#about"]');
            if (competitionsLink) competitionsLink.classList.add("active");
            return;
        }
    }

    // Marcar cuando el usuario hace scroll
    window.addEventListener("scroll", () => {
        hasUserScrolled = true;
        updateActiveLink();
    });

    window.addEventListener("hashchange", updateActiveLink);
    window.addEventListener("load", updateActiveLink);

    setTimeout(updateActiveLink, 100);
}

function setupMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const body = document.body;
    
    if (!mobileMenuToggle || !mobileMenu) return;
    
    // Toggle del menú móvil
    mobileMenuToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // Evitar que se propague el evento
        
        mobileMenuToggle.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        
        // Prevenir scroll del body cuando el menú está abierto
        if (mobileMenu.classList.contains('active')) {
            body.style.overflow = 'hidden';
        } else {
            body.style.overflow = '';
        }
    });
    
    // Cerrar menú al hacer clic en un enlace
    const mobileMenuLinks = mobileMenu.querySelectorAll('.nav-link');
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', function() {
            closeMobileMenu();
        });
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (mobileMenu.classList.contains('active') && 
            !mobileMenu.contains(event.target) && 
            !mobileMenuToggle.contains(event.target)) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú al presionar Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Cerrar menú al cambiar el tamaño de ventana (si pasa a desktop)
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991 && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });
    
    // Función helper para cerrar el menú
    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        body.style.overflow = '';
    }
}