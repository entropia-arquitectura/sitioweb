document.addEventListener('DOMContentLoaded', function () {
    const lightboxOverlay = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');

    if (!lightboxOverlay || !lightboxImage || !lightboxCaption || !lightboxClose || !lightboxPrev || !lightboxNext) {
        console.error('Elementos del lightbox no encontrados en el DOM');
        return;
    }
    lightboxOverlay.style.display = 'none';
    lightboxOverlay.classList.remove('active');

    let galleryImages = [];
    let currentImageIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let isLightboxOpen = false;

    function initGallery() {
        const galleryItems = document.querySelectorAll('.gallery-item img');
        galleryImages = [];

        galleryItems.forEach((img, index) => {
            galleryImages.push({
                src: img.src,
                alt: img.alt,
                caption: img.parentElement.querySelector('.image-caption')?.textContent || img.alt
            });

            img.addEventListener('click', (e) => {
                e.preventDefault();
                currentImageIndex = index;
                openLightbox();
            });

            img.style.cursor = 'pointer';
            img.setAttribute('tabindex', '0');

            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    currentImageIndex = index;
                    openLightbox();
                }
            });
        });

        console.log(`Galería inicializada con ${galleryImages.length} imágenes`);
    }

    function openLightbox(index) {
        isLightboxOpen = true;
        lightboxOverlay.style.display = 'flex';
        lightboxOverlay.classList.add("active");
        document.body.style.overflow = 'hidden';
        updateLightboxContent(index);
    }

    function closeLightbox() {
        isLightboxOpen = false;
        lightboxOverlay.classList.remove('active');
        setTimeout(() => {
            lightboxOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);

        const currentImg = document.querySelectorAll('.gallery-item img')[currentImageIndex];
        if (currentImg) currentImg.focus();
    }

    // Si querés cerrar con tecla Escape:
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") {
            closeLightbox();
        }
    });

    function updateLightboxContent() {
        if (!galleryImages[currentImageIndex]) return;

        const currentImage = galleryImages[currentImageIndex];
        lightboxImage.classList.add('loading');

        const newImg = new Image();
        newImg.onload = function () {
            lightboxImage.src = currentImage.src;
            lightboxImage.alt = currentImage.alt;
            lightboxImage.classList.remove('loading');
        };
        newImg.src = currentImage.src;

        lightboxCaption.textContent = currentImage.caption;

        const showNavigation = galleryImages.length > 1;
        lightboxPrev.style.display = showNavigation ? 'flex' : 'none';
        lightboxNext.style.display = showNavigation ? 'flex' : 'none';

        preloadAdjacentImages();
    }

    function preloadAdjacentImages() {
        const preloadIndexes = [
            (currentImageIndex - 1 + galleryImages.length) % galleryImages.length,
            (currentImageIndex + 1) % galleryImages.length
        ];

        preloadIndexes.forEach(index => {
            const img = new Image();
            img.src = galleryImages[index].src;
        });
    }

    function previousImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxContent();
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxContent();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightboxPrev.addEventListener('click', previousImage);
    lightboxNext.addEventListener('click', nextImage);

    lightboxOverlay.addEventListener('click', (e) => {
        if (e.target === lightboxOverlay) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (!isLightboxOpen) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox(); break;
            case 'ArrowLeft':
                previousImage(); break;
            case 'ArrowRight':
                nextImage(); break;
            case 'Home':
                currentImageIndex = 0;
                updateLightboxContent(); break;
            case 'End':
                currentImageIndex = galleryImages.length - 1;
                updateLightboxContent(); break;
        }
    });

    lightboxOverlay.addEventListener('touchmove', (e) => {
        e.preventDefault();
    }, { passive: false });

    lightboxOverlay.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    lightboxOverlay.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            diff > 0 ? nextImage() : previousImage();
        }
    }

    lightboxImage.addEventListener('error', function () {
        console.error('Error al cargar la imagen:', galleryImages[currentImageIndex]?.src);
        lightboxCaption.textContent = 'Error al cargar la imagen';
        lightboxImage.classList.remove('loading');
    });

    let resizeTimeout;
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (isLightboxOpen) {
                updateLightboxContent();
            }
        }, 250);
    });

    // Inicializar galería al cargar
    initGallery();
});