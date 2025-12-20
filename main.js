// Главный файл приложения

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Приложение "Флаги Мира" загружается...');
    
    // Загрузка сохраненного состояния
    loadState();
    
    // Инициализация модулей
    setupNavigation();
    setupKnowledgeBase();
    setupTesting();
    setupResults();
    
    // Начальная загрузка данных
    displayFlags('all');
    
    // Инициализация Bootstrap компонентов
    initBootstrapComponents();
    
    console.log('Приложение успешно загружено!');
});

// Инициализация Bootstrap компонентов
function initBootstrapComponents() {
    // Включение всех тултипов
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Включение всех поповеров
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
}

// Глобальные функции для использования в HTML
window.startQuickTest = startQuickTest;
window.showCountryInfo = showCountryInfo;