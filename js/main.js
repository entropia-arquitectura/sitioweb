document.addEventListener("DOMContentLoaded", () => {
  // Cargar header
  fetch("partials/header.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("header-container").innerHTML = data;
      setupHeaderScroll();
      setupActiveMenuItem();
    });
  // Cargar footer
  fetch("partials/footer.html")
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

  function clearActiveLinks() {
    links.forEach(link => link.classList.remove("active"));
  }

  function getCurrentSectionByScroll() {
    const sections = document.querySelectorAll("section[id]");
    let closestSection = sections[0].id;

    sections.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= 100 && rect.top + rect.height > 100) {
        closestSection = section.id;
      }
    });

    return `#${closestSection}`;
  }

  function getTargetHash(currentPath, currentPage) {
    if (pathToHash[currentPage]) return pathToHash[currentPage];

    const path = currentPath.toLowerCase();
    for (const [pattern, hash] of Object.entries(pathToHash)) {
      if (path.includes(pattern)) return hash;
    }

    return null;
  }

  function updateActiveLink() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split("/").pop() || "index.html";
    let targetHash = null;

    if (currentPage === "index.html" || currentPage === "" || currentPath === "/") {
      // Página principal – detectar sección activa por scroll
      targetHash = getCurrentSectionByScroll();
    } else {
      // Otras páginas
      targetHash = getTargetHash(currentPath, currentPage);
    }

    if (!targetHash) return;

    clearActiveLinks();

    const activeLink = document.querySelector(`a[href$="${targetHash}"]`);
    if (activeLink) {
      activeLink.classList.add("active");
    }
  }

  // Activar en scroll, carga y hash change
  window.addEventListener("scroll", updateActiveLink);
  window.addEventListener("hashchange", updateActiveLink);
  window.addEventListener("load", updateActiveLink);
  setTimeout(updateActiveLink, 100);
}