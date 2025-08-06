document.addEventListener('DOMContentLoaded', function() {
    const toggles = document.querySelectorAll(".toggle");
    const contents = document.querySelectorAll(".category-content");
    const groupTitles = document.querySelectorAll(".group-title.collapsible");

    const hashToGroup = {
        'architecture': { group: 'architecture', firstToggle: 'communication' },
        'supervision': { group: 'supervision', firstToggle: 'certification' },
        'construction': { group: 'construction', firstToggle: 'construction-management' },
        'design': { group: 'design', firstToggle: 'site-analysis' }
    };


    function openGroup(groupData) {
        const { group, firstToggle } = groupData;

        groupTitles.forEach(title => {
            const targetGroup = title.dataset.group;
            const subCategories = document.getElementById(`${targetGroup}-sub`);
            const icon = title.querySelector('.toggle-icon');

            if (targetGroup === group) {
                subCategories.classList.remove('collapsed');
                title.classList.add('active');
                icon.textContent = '−';
            } else {
                subCategories.classList.add('collapsed');
                title.classList.remove('active');
                icon.textContent = '+';
            }
        });

        toggles.forEach(toggle => toggle.classList.remove('active'));
        contents.forEach(content => content.classList.remove('active'));

        const targetToggle = document.querySelector(`[data-target="${firstToggle}"]`);
        const targetContent = document.getElementById(firstToggle);

        if (targetToggle && targetContent) {
            targetToggle.classList.add('active');
            setTimeout(() => {
                targetContent.classList.add('active');
            }, 100);
        }
    }

    function handleInitialHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash && hashToGroup[hash]) {
            openGroup(hashToGroup[hash]);
        } else {
            openGroup(hashToGroup['architecture']);
        }
    }

    toggles.forEach(toggle => {
        toggle.addEventListener("click", () => {
            const clickedTarget = toggle.dataset.target;

            toggles.forEach(btn => btn.classList.remove("active"));
            toggle.classList.add("active");

            contents.forEach(c => c.classList.remove("active"));
           setTimeout(() => {
                const targetContent = document.getElementById(clickedTarget);
                if (targetContent) {
                    targetContent.classList.add("active");
                }

                const defaultMessage = document.getElementById("default-message");
                if (defaultMessage) {
                    defaultMessage.classList.remove("active");
                }
            }, 50);

        });
    });

    groupTitles.forEach(groupTitle => {
        groupTitle.addEventListener("click", () => {
            const targetGroup = groupTitle.dataset.group;
            const subCategories = document.getElementById(`${targetGroup}-sub`);
            const icon = groupTitle.querySelector('.toggle-icon');

            if (!subCategories || !icon) return;

            if (subCategories.classList.contains('collapsed')) {
                subCategories.classList.remove('collapsed');
                groupTitle.classList.add('active');
                icon.textContent = '−';

                const firstToggleInGroup = subCategories.querySelector('.toggle');
                if (firstToggleInGroup) {
                    toggles.forEach(btn => btn.classList.remove("active"));
                    firstToggleInGroup.classList.add('active');

                    contents.forEach(c => c.classList.remove("active"));
                    const targetContent = document.getElementById(firstToggleInGroup.dataset.target);
                    if (targetContent) {
                        setTimeout(() => {
                            targetContent.classList.add("active");
                            const defaultMessage = document.getElementById("default-message");
                            if (defaultMessage) {
                                defaultMessage.classList.remove("active");
                            }
                        }, 100);
                    }
                }
            } else {
                subCategories.classList.add('collapsed');
                groupTitle.classList.remove('active');
                icon.textContent = '+';

                const groupToggles = subCategories.querySelectorAll('.toggle');
                groupToggles.forEach(toggle => toggle.classList.remove('active'));

                groupToggles.forEach(toggle => {
                    const contentId = toggle.dataset.target;
                    const content = document.getElementById(contentId);
                    if (content && content.classList.contains('active')) {
                        content.classList.remove('active');
                    }
                });

                setTimeout(() => {
                    const activeContent = document.querySelector('.category-content.active');
                    if (!activeContent) {
                        const openGroup = document.querySelector('.group-title.active');
                        if (openGroup) {
                            const openGroupId = openGroup.dataset.group;
                            const openSubCategories = document.getElementById(openGroupId);
                            const firstAvailableToggle = openSubCategories?.querySelector('.toggle');
                            if (firstAvailableToggle) {
                                firstAvailableToggle.classList.add('active');
                                const targetContent = document.getElementById(firstAvailableToggle.dataset.target);
                                if (targetContent) {
                                    targetContent.classList.add('active');
                                }
                            }
                        } else {
                            showDefaultMessage();
                        }
                    }
                }, 150);
            }
        });
    });

    function showDefaultMessage() {
        contents.forEach(c => c.classList.remove("active"));
        toggles.forEach(t => t.classList.remove("active"));

        let defaultMessage = document.getElementById('default-message');
        if (!defaultMessage) {
            defaultMessage = document.createElement('div');
            defaultMessage.id = 'default-message';
            defaultMessage.className = 'category-content active'; // importante: empieza activa
            defaultMessage.innerHTML = `
                <div class="service-header">
                    <h2>Servicios de Arquitectura</h2>
                </div>
                <div class="service-description">
                    <p>Selecciona una categoría del menú lateral para conocer en detalle nuestros servicios profesionales.</p>
                    <p>Ofrecemos servicios integrales que abarcan desde el desarrollo del proyecto arquitectónico hasta la dirección completa de obra, siempre con una mirada contemporánea y sensible al entorno.</p>
                </div>
            `;
            const serviceContent = document.querySelector('.service-content');
            if (serviceContent) {
                serviceContent.appendChild(defaultMessage);
            }
        } else {
            defaultMessage.classList.add("active"); // mostrar si ya existe
        }
    }


    // Inicialización
    handleInitialHash();
    setTimeout(() => {
        const activeContent = document.querySelector('.category-content.active');
        const activeToggle = document.querySelector('.toggle.active');

        if (activeToggle && !activeContent) {
            const targetContent = document.getElementById(activeToggle.dataset.target);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        }

        if (!activeContent && !activeToggle) {
            showDefaultMessage();
        }
    }, 100);
});