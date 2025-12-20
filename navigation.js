// Навигация по приложению

function setupNavigation() {
    // Навигационные ссылки
    const navLinks = document.querySelectorAll('.nav-link[data-page]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('data-page');
            switchPage(pageId);
            
            // Обновление активного пункта меню
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Логотип - переход на главную
    const logoLink = document.getElementById('logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            switchPage('home');
            
            // Обновление активного пункта меню
            navLinks.forEach(navLink => navLink.classList.remove('active'));
            document.querySelector('.nav-link[data-page="home"]').classList.add('active');
        });
    }
    
    // Кнопки быстрого перехода на главной
    const quickLinks = document.querySelectorAll('a[data-page]');
    quickLinks.forEach(link => {
        if (!link.classList.contains('nav-link')) {
            link.addEventListener('click', function(e) {
                if (this.hasAttribute('data-page')) {
                    e.preventDefault();
                    const pageId = this.getAttribute('data-page');
                    switchPage(pageId);
                    
                    // Обновление активного пункта меню
                    navLinks.forEach(navLink => navLink.classList.remove('active'));
                    document.querySelector(`.nav-link[data-page="${pageId}"]`).classList.add('active');
                }
            });
        }
    });
}

// Переключение страниц
function switchPage(pageId) {
    // Скрыть все страницы
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
        page.style.display = 'none';
    });
    
    // Показать выбранную страницу
    const targetPage = document.getElementById(`${pageId}-page`);
    if (targetPage) {
        targetPage.style.display = 'block';
        setTimeout(() => {
            targetPage.classList.add('active');
        }, 10);
        AppState.currentPage = pageId;
        
        // При переключении на определенные страницы выполнить дополнительные действия
        switch(pageId) {
            case 'knowledge':
                displayFlags('all');
                break;
            case 'results':
                updateResultsPage();
                break;
        }
        
        // Прокрутка вверх
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}