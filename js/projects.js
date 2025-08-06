document.addEventListener('DOMContentLoaded', function() {
    
    // Elementos del DOM
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsCounter = document.getElementById('projects-counter');
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    // Variables para paginación
    let currentFilter = 'all';
    let visibleProjects = 6; // Mostrar todos inicialmente
    const projectsPerLoad = 3;
    
    console.log('=== INICIANDO PROJECTS.JS ===');
    console.log('Proyectos encontrados:', projectCards.length);
    console.log('Botones de filtro:', filterButtons.length);
    console.log('Contador elemento:', projectsCounter);
    console.log('Botón cargar más:', loadMoreBtn);
    
    /**
     * Inicializar página
     */
    function init() {
        // Asegurar que todos los proyectos estén visibles al inicio
        resetAllProjects();
        
        // Configurar eventos
        setupFilters();
        setupLoadMore();
        
        // Actualizar contador inicial
        updateProjectsCounter('all');
        
        // Mostrar proyectos iniciales
        setTimeout(() => {
            showAllProjects();
        }, 100);
    }
    
    /**
     * Resetear todos los proyectos a estado visible
     */
    function resetAllProjects() {
        projectCards.forEach(card => {
            card.style.display = 'block';
            card.classList.remove('hidden', 'animate-out');
            card.classList.add('animate-in');
        });
        console.log('Todos los proyectos reseteados a visible');
    }
    
    /**
     * Mostrar todos los proyectos con animación
     */
    function showAllProjects() {
        projectCards.forEach((card, index) => {
            setTimeout(() => {
                card.style.display = 'block';
                card.classList.remove('hidden', 'animate-out');
                card.classList.add('animate-in');
            }, index * 100);
        });
        console.log('Mostrando todos los proyectos con animación');
    }
    
    /**
     * Configurar filtros
     */
    function setupFilters() {
        filterButtons.forEach((button, index) => {
            console.log(`Configurando filtro ${index}:`, button.getAttribute('data-filter'));
            
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const filter = this.getAttribute('data-filter');
                console.log('Filtro seleccionado:', filter);
                
                // Actualizar botón activo
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Actualizar filtro actual
                currentFilter = filter;
                
                // Resetear paginación
                visibleProjects = 3;
                
                // Filtrar proyectos
                filterProjects(filter);
            });
        });
    }
    
    /**
     * Filtrar proyectos por categoría
     */
    function filterProjects(filter) {        
        // Obtener proyectos que coinciden con el filtro
        const filteredCards = [];
        
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            
            if (filter === 'all' || category === filter) {
                filteredCards.push(card);
            }
        });
        
        // Ocultar todos primero
        projectCards.forEach(card => {
            card.style.display = 'none';
            card.classList.add('hidden');
            card.classList.remove('animate-in');
        });
        
        // Mostrar proyectos filtrados
        filteredCards.forEach((card, index) => {
            if (index < visibleProjects) {
                setTimeout(() => {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                    card.classList.add('animate-in');
                    console.log('Mostrando proyecto:', index);
                }, index * 150);
            }
        });
        
        // Actualizar contador y botón
        setTimeout(() => {
            updateProjectsCounter(filter);
            updateLoadMoreButton(filter);
        }, 500);
    }
    
    /**
     * Configurar botón "Cargar más"
     */
    function setupLoadMore() {
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Clic en cargar más');
                loadMoreProjects();
            });
        }
    }
    
    /**
     * Cargar más proyectos
     */
    function loadMoreProjects() {
        
        const filteredCards = getFilteredCards(currentFilter);
        const currentlyVisible = getCurrentlyVisibleCount();
        
        const toShow = Math.min(projectsPerLoad, filteredCards.length - currentlyVisible);
        let shown = 0;
        
        filteredCards.forEach((card, index) => {
            if (index >= currentlyVisible && shown < toShow) {
                setTimeout(() => {
                    card.style.display = 'block';
                    card.classList.remove('hidden');
                    card.classList.add('animate-in');
                    console.log('Mostrando proyecto adicional:', index);
                }, shown * 150);
                shown++;
            }
        });
        
        // Actualizar contador de proyectos visibles
        visibleProjects += shown;
        
        // Actualizar botón
        setTimeout(() => {
            updateLoadMoreButton(currentFilter);
        }, 500);
    }
    
    /**
     * Obtener count de proyectos actualmente visibles
     */
    function getCurrentlyVisibleCount() {
        let count = 0;
        projectCards.forEach(card => {
            if (card.style.display !== 'none' && !card.classList.contains('hidden')) {
                count++;
            }
        });
        return count;
    }
    
    /**
     * Obtener tarjetas filtradas
     */
    function getFilteredCards(filter = currentFilter) {
        const filtered = [];
        projectCards.forEach(card => {
            const category = card.getAttribute('data-category');
            if (filter === 'all' || category === filter) {
                filtered.push(card);
            }
        });
        return filtered;
    }
    
    /**
     * Actualizar contador de proyectos
     */
    function updateProjectsCounter(filter = currentFilter) {
        const filteredCards = getFilteredCards(filter);
        const count = filteredCards.length;
                
        if (projectsCounter) {
            projectsCounter.textContent = count;
        }
    }
    
    /**
     * Actualizar botón cargar más
     */
    function updateLoadMoreButton(filter = currentFilter) {
        if (!loadMoreBtn) return;
        
        const filteredCards = getFilteredCards(filter);
        const visibleCount = getCurrentlyVisibleCount();
                
        if (visibleCount >= filteredCards.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'inline-block';
        }
    }
    
  
    // Inicializar
    init();

    // Hacer funciones disponibles globalmente para debug
    window.debugProjects = debugProjects;
    window.resetAllProjects = resetAllProjects;
    window.showAllProjects = showAllProjects;
    
});

/**
 * Función auxiliar para compartir proyectos en redes sociales
 */
function shareProject(platform, url, title) {
    const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    };
    
    if (shareUrls[platform]) {
        window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
}

/**
 * Mostrar notificación temporal
 */
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #c5a572;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        z-index: 9999;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animar entrada
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}