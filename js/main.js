document.addEventListener("DOMContentLoaded", () => {
  // Cargar header
  fetch("/partials/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;
      setupHeaderScroll();
      setupActiveMenuItem();
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
  
  const pathToHash = {
    'home': '#home',
    'services': '#services',
    'projects': '#projects',
    'competitions': '#competitions',
    'about': '#about',
    'contact': '#contact',
  };
  
  function getTargetHash(currentPath, currentPage) {
    // Buscar coincidencia exacta por nombre de archivo
    if (pathToHash[currentPage]) {
      return pathToHash[currentPage];
    }
    
    // Buscar por patrón en la ruta completa
    const path = currentPath.toLowerCase();
    for (const [pattern, hash] of Object.entries(pathToHash)) {
      if (path.includes(pattern)) {
        return hash;
      }
    }
    
    return null;
  }
  
  function updateActiveLink() {
    const currentPath = window.location.pathname;
    const currentHash = window.location.hash;
    const currentPage = currentPath.split("/").pop() || "index.html";
    
    // Limpiar todas las clases activas
    links.forEach(link => link.classList.remove("active"));
    
    // CASO 1: Páginas dedicadas (no index.html)
    if (currentPage !== "index.html" && currentPage !== "") {
      const targetHash = getTargetHash(currentPath, currentPage);
      
      if (targetHash) {
        const targetLink = document.querySelector(`a[href$="${targetHash}"]`);
        if (targetLink) {
          targetLink.classList.add("active");
          return;
        }
      }
    }
    
    // CASO 2: Index.html con detección por scroll o hash
    if (currentPage === "index.html" || currentPage === "") {
      if (currentHash) {
        // Activar enlace por hash específico
        const hashLink = document.querySelector(`a[href$="${currentHash}"]`);
        if (hashLink) {
          hashLink.classList.add("active");
          return;
        }
      }
      
      // Detectar sección activa por scroll
      detectActiveSection();
    }
  }
  
  function detectActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    let activeSection = 'home';
    
    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.top + rect.height > 100) {
        activeSection = section.id;
      }
    });
    
    const activeLink = document.querySelector(`a[href$="#${activeSection}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }
  
  // Eventos condicionales
  if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '') {
    console.log('index.html');
    //funciona pero al scrollear no se actualiza la seccion
    window.addEventListener("scroll", updateActiveLink);
    window.addEventListener("hashchange", updateActiveLink);
  }
  
  window.addEventListener("load", updateActiveLink);
  setTimeout(updateActiveLink, 100);
}