// База знаний флагов

function setupKnowledgeBase() {
    // Кнопки фильтров
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const region = this.getAttribute('data-region');
            
            // Обновление активной кнопки
            filterButtons.forEach(button => button.classList.remove('active'));
            this.classList.add('active');
            
            // Отображение флагов
            displayFlags(region);
            AppState.currentRegion = region;
        });
    });
    
    // Поиск
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            filterFlagsBySearch(searchTerm);
        });
    }
}

// Отображение флагов
function displayFlags(region) {
    const flagsContainer = document.getElementById('flags-container');
    if (!flagsContainer) return;
    
    flagsContainer.innerHTML = '';
    
    let countries = getCountriesByRegion(region);
    
    if (countries.length === 0) {
        flagsContainer.innerHTML = `
            <div class="col-12">
                <div class="alert alert-info text-center">
                    <i class="bi bi-info-circle me-2"></i>
                    Страны не найдены
                </div>
            </div>
        `;
        return;
    }
    
    countries.forEach(country => {
        const regionInfo = Regions[country.region];
        const flagCard = document.createElement('div');
        flagCard.className = 'col-md-6 col-lg-4 col-xl-3';
        flagCard.innerHTML = `
            <div class="card flag-card h-100">
                <div class="card-body text-center p-4">
                    <div class="position-absolute top-0 end-0 p-3">
                        <span class="badge bg-${regionInfo.color}">${regionInfo.name}</span>
                    </div>
                    
                    <div class="flag-image mb-3 d-flex justify-content-center align-items-center" style="height: 100px;">
                        <img src="${country.flag}" 
                             alt="Флаг ${country.name}" 
                             class="h-100"
                             style="object-fit: contain; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    
                    <h3 class="h5 mb-2">${country.name}</h3>
                    
                    <div class="text-muted small mb-3">
                        <div class="mb-1">
                            <i class="bi bi-geo-alt me-1"></i>
                            Столица: ${country.capital}
                        </div>
                        <div>
                            <i class="bi bi-people me-1"></i>
                            Население: ${country.population}
                        </div>
                    </div>
                    
                    <div class="d-flex justify-content-center gap-2">
                        <button class="btn btn-sm btn-outline-primary" onclick="startQuickTest('${country.flag}')">
                            <i class="bi bi-question-circle me-1"></i>Тест
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="showCountryInfo(${country.id})">
                            <i class="bi bi-info-circle me-1"></i>Подробнее
                        </button>
                    </div>
                </div>
            </div>
        `;
        flagsContainer.appendChild(flagCard);
    });
}

// Фильтрация флагов по поиску
function filterFlagsBySearch(searchTerm) {
    const flagsContainer = document.getElementById('flags-container');
    if (!flagsContainer) return;
    
    const flagCards = flagsContainer.querySelectorAll('.col-md-6');
    flagCards.forEach(card => {
        const countryName = card.querySelector('h3').textContent.toLowerCase();
        if (countryName.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Быстрый тест по конкретному флагу
function startQuickTest(flagUrl) {
    // Переключение на страницу тестов
    switchPage('test');
    
    // Установка настроек для быстрого теста
    AppState.testState.config.type = 'flag-to-country';
    AppState.testState.config.questionCount = 5;
    
    // Сохраняем URL флага для использования в тесте
    AppState.testState.quickTestFlag = flagUrl;
    
    // Показ уведомления
    showNotification('Быстрый тест начат! Ответьте на 5 вопросов.', 'success');
    
    // Автоматический запуск теста через 1 секунду
    setTimeout(() => {
        startTest();
    }, 1000);
}

// Показать подробную информацию о стране
function showCountryInfo(countryId) {
    const country = CountriesData.find(c => c.id === countryId);
    if (!country) return;
    
    const regionInfo = Regions[country.region];
    
    // Создание модального окна с информацией
    const modalHtml = `
        <div class="modal fade" id="countryModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <span class="me-2">${country.emoji}</span>
                            ${country.name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <img src="${country.flag}" 
                                 alt="Флаг ${country.name}" 
                                 style="height: 120px; width: auto; border: 1px solid #ddd; border-radius: 6px;">
                        </div>
                        
                        <div class="row">
                            <div class="col-6">
                                <div class="mb-3">
                                    <h6 class="text-muted">Столица</h6>
                                    <p class="h5">${country.capital}</p>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="mb-3">
                                    <h6 class="text-muted">Регион</h6>
                                    <p class="h5">
                                        <span class="badge bg-${regionInfo.color}">
                                            ${regionInfo.name}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div class="mb-3">
                            <h6 class="text-muted">Население</h6>
                            <p class="h5">${country.population}</p>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Закрыть</button>
                        <button type="button" class="btn btn-primary" onclick="startQuickTest('${country.flag}')">
                            <i class="bi bi-question-circle me-1"></i>Пройти тест
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Добавление модального окна в DOM
    const modalContainer = document.createElement('div');
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);
    
    // Показ модального окна
    const modal = new bootstrap.Modal(document.getElementById('countryModal'));
    modal.show();
    
    // Удаление модального окна после закрытия
    document.getElementById('countryModal').addEventListener('hidden.bs.modal', function() {
        modalContainer.remove();
    });
}