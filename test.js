// Модуль тестирования

function setupTesting() {
    // Кнопка начала теста
    const startTestBtn = document.getElementById('start-test-btn');
    if (startTestBtn) {
        startTestBtn.addEventListener('click', startTest);
    }
    
    // Кнопка следующего вопроса
    const nextQuestionBtn = document.getElementById('next-question-btn');
    if (nextQuestionBtn) {
        nextQuestionBtn.addEventListener('click', nextQuestion);
    }
    
    // Выбор типа теста
    const testTypeSelect = document.getElementById('test-type');
    if (testTypeSelect) {
        testTypeSelect.addEventListener('change', function() {
            AppState.testState.config.type = this.value;
        });
    }
    
    // Выбор количества вопросов
    const questionCountSelect = document.getElementById('question-count');
    if (questionCountSelect) {
        questionCountSelect.addEventListener('change', function() {
            AppState.testState.config.questionCount = parseInt(this.value);
        });
    }
    
    // Выбор сложности
    const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
    difficultyRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            if (this.checked) {
                AppState.testState.config.difficulty = this.value;
            }
        });
    });
}

// Начало теста
function startTest() {
    // Сброс состояния теста
    AppState.testState.inProgress = true;
    AppState.testState.currentQuestion = 0;
    AppState.testState.score = 0;
    AppState.testState.startTime = new Date();
    AppState.testState.questions = [];
    AppState.testState.userAnswers = [];
    
    // Генерация вопросов
    generateTestQuestions();
    
    // Обновление интерфейса
    document.getElementById('test-instructions').style.display = 'none';
    document.getElementById('quiz-container').style.display = 'block';
    document.getElementById('start-test-btn').disabled = true;
    document.getElementById('next-question-btn').disabled = true;
    
    // Обновление счетчика вопросов
    updateQuestionCounter();
    
    // Показать первый вопрос
    showQuestion();
    
    // Показать уведомление
    showNotification('Тест начат! Удачи!', 'info');
}

// Генерация вопросов для теста
function generateTestQuestions() {
    const { type, questionCount, difficulty } = AppState.testState.config;
    let availableCountries = [...CountriesData];
    
    // Если быстрый тест по конкретному флагу
    if (AppState.testState.quickTestFlag) {
        const country = getCountryByFlag(AppState.testState.quickTestFlag);
        if (country) {
            availableCountries = [country];
            // Создаем вопросы на основе этой страны
            for (let i = 0; i < questionCount; i++) {
                const allNames = CountriesData.map(c => c.name);
                const options = generateOptions(country.name, allNames);
                
                AppState.testState.questions.push({
                    type: 'flag-to-country',
                    flag: country.flag,
                    correctAnswer: country.name,
                    options: options,
                    countryId: country.id
                });
            }
            return;
        }
    }
    
    // Фильтрация по сложности
    if (difficulty === 'easy') {
        // Используем только популярные страны (первые 10)
        availableCountries = availableCountries.slice(0, 10);
    } else if (difficulty === 'hard') {
        // Используем все страны
    }
    
    // Если выбран тест по региону
    if (type === 'region-test') {
        // Случайный регион
        const regionKeys = Object.keys(Regions).filter(key => key !== 'all');
        const randomRegion = regionKeys[Math.floor(Math.random() * regionKeys.length)];
        availableCountries = getCountriesByRegion(randomRegion);
        AppState.testState.config.region = randomRegion;
        
        // Ограничение количества вопросов, если стран меньше
        if (availableCountries.length < questionCount) {
            AppState.testState.config.questionCount = availableCountries.length;
        }
    }
    
    // Перемешивание стран
    availableCountries = shuffleArray(availableCountries);
    
    // Создание вопросов
    for (let i = 0; i < AppState.testState.config.questionCount; i++) {
        const country = availableCountries[i];
        let question;
        
        if (type === 'flag-to-country' || type === 'region-test') {
            // Получение вариантов ответов
            const allNames = availableCountries.map(c => c.name);
            const options = generateOptions(country.name, allNames);
            
            question = {
                type: 'flag-to-country',
                flag: country.flag,
                correctAnswer: country.name,
                options: options,
                countryId: country.id
            };
        } else if (type === 'country-to-flag') {
            const allFlags = availableCountries.map(c => c.flag);
            const options = generateOptions(country.flag, allFlags);
            
            question = {
                type: 'country-to-flag',
                country: country.name,
                correctAnswer: country.flag,
                options: options,
                countryId: country.id
            };
        } else if (type === 'mixed') {
            // Случайный выбор типа вопроса
            const questionTypes = ['flag-to-country', 'country-to-flag'];
            const randomType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            
            if (randomType === 'flag-to-country') {
                const allNames = availableCountries.map(c => c.name);
                const options = generateOptions(country.name, allNames);
                
                question = {
                    type: 'flag-to-country',
                    flag: country.flag,
                    correctAnswer: country.name,
                    options: options,
                    countryId: country.id
                };
            } else {
                const allFlags = availableCountries.map(c => c.flag);
                const options = generateOptions(country.flag, allFlags);
                
                question = {
                    type: 'country-to-flag',
                    country: country.name,
                    correctAnswer: country.flag,
                    options: options,
                    countryId: country.id
                };
            }
        }
        
        AppState.testState.questions.push(question);
    }
}

// Показать текущий вопрос
function showQuestion() {
    const question = AppState.testState.questions[AppState.testState.currentQuestion];
    const questionText = document.getElementById('question-text');
    const questionFlag = document.getElementById('question-flag');
    const optionsContainer = document.getElementById('options-container');
    const feedback = document.getElementById('feedback');
    
    // Сброс состояния
    optionsContainer.innerHTML = '';
    feedback.style.display = 'none';
    
    // Установка вопроса
    if (question.type === 'flag-to-country') {
        questionText.textContent = 'Какой стране принадлежит этот флаг?';
        questionFlag.innerHTML = `
            <img src="${question.flag}" 
                 alt="Флаг для угадывания" 
                 style="height: 120px; width: auto; border: 2px solid #ddd; border-radius: 8px;">
        `;
        questionFlag.style.display = 'block';
        questionFlag.className = 'mb-4';
    } else if (question.type === 'country-to-flag') {
        questionText.textContent = `Какой флаг у страны ${question.country}?`;
        questionFlag.style.display = 'none';
    }
    
    // Добавление вариантов ответов
    question.options.forEach((option, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6';
        
        const optionBtn = document.createElement('button');
        optionBtn.className = 'option-btn w-100 h-100 p-3 text-start';
        optionBtn.setAttribute('data-index', index);
        
        if (question.type === 'country-to-flag') {
            const country = getCountryByFlag(option);
            optionBtn.innerHTML = `
                <div class="d-flex align-items-center">
                    <div class="me-3" style="width: 60px; height: 40px;">
                        <img src="${option}" 
                             alt="Вариант флага" 
                             style="width: 100%; height: 100%; object-fit: contain; border: 1px solid #ddd; border-radius: 4px;">
                    </div>
                    <div>${country ? country.name : ''}</div>
                </div>
            `;
        } else {
            optionBtn.textContent = option;
        }
        
        optionBtn.addEventListener('click', () => selectAnswer(option, question.correctAnswer));
        col.appendChild(optionBtn);
        optionsContainer.appendChild(col);
    });
    
    // Обновление прогресс-бара
    updateProgressBar();
}

// Выбор ответа
function selectAnswer(selectedAnswer, correctAnswer) {
    const options = document.querySelectorAll('.option-btn');
    const feedback = document.getElementById('feedback');
    const feedbackMessage = document.getElementById('feedback-message');
    const nextQuestionBtn = document.getElementById('next-question-btn');
    
    // Отключение всех вариантов
    options.forEach(option => {
        option.disabled = true;
        option.style.cursor = 'not-allowed';
        
        // Определение, какой вариант был выбран
        let optionValue;
        const question = AppState.testState.questions[AppState.testState.currentQuestion];
        
        if (question.type === 'country-to-flag') {
            // Извлекаем URL из изображения
            const img = option.querySelector('img');
            optionValue = img ? img.src : '';
        } else {
            optionValue = option.textContent;
        }
        
        // Подсветка правильного и неправильного ответов
        if (optionValue === correctAnswer) {
            option.classList.add('correct');
        } else if (optionValue === selectedAnswer && selectedAnswer !== correctAnswer) {
            option.classList.add('incorrect');
        }
        
        // Подсветка выбранного варианта
        if (optionValue === selectedAnswer) {
            option.classList.add('selected');
        }
    });
    
    // Сохранение ответа пользователя
    const question = AppState.testState.questions[AppState.testState.currentQuestion];
    const isCorrect = selectedAnswer === correctAnswer;
    
    AppState.testState.userAnswers.push({
        question: question,
        selectedAnswer: selectedAnswer,
        isCorrect: isCorrect,
        time: new Date()
    });
    
    // Получение названия страны для отображения
    let displayAnswer = correctAnswer;
    if (question.type === 'country-to-flag') {
        const country = getCountryByFlag(correctAnswer);
        displayAnswer = country ? country.name : correctAnswer;
    }
    
    // Обновление счета
    if (isCorrect) {
        AppState.testState.score++;
        feedbackMessage.textContent = 'Правильно! ✓';
        feedbackMessage.className = 'alert alert-success';
    } else {
        feedbackMessage.textContent = `Неправильно. Правильный ответ: ${displayAnswer}`;
        feedbackMessage.className = 'alert alert-danger';
    }
    
    // Показ обратной связи
    feedback.style.display = 'block';
    
    // Активация кнопки "Следующий вопрос"
    nextQuestionBtn.disabled = false;
    
    // Автоматический переход через 2 секунды
    setTimeout(() => {
        if (nextQuestionBtn.disabled === false) {
            nextQuestion();
        }
    }, 2000);
}

// Следующий вопрос
function nextQuestion() {
    AppState.testState.currentQuestion++;
    
    // Если вопросы закончились
    if (AppState.testState.currentQuestion >= AppState.testState.questions.length) {
        finishTest();
        return;
    }
    
    // Показать следующий вопрос
    showQuestion();
    
    // Обновление счетчика
    updateQuestionCounter();
    
    // Деактивация кнопки "Следующий вопрос"
    document.getElementById('next-question-btn').disabled = true;
}

// Завершение теста
function finishTest() {
    AppState.testState.inProgress = false;
    AppState.testState.endTime = new Date();
    AppState.testState.quickTestFlag = null; // Сбрасываем флаг быстрого теста
    
    // Сохранение результатов
    const testResult = {
        date: new Date().toLocaleString(),
        score: AppState.testState.score,
        total: AppState.testState.questions.length,
        type: AppState.testState.config.type,
        difficulty: AppState.testState.config.difficulty,
        region: AppState.testState.config.region,
        timeSpent: Math.round((AppState.testState.endTime - AppState.testState.startTime) / 1000),
        userAnswers: [...AppState.testState.userAnswers]
    };
    
    AppState.results.push(testResult);
    updateStatistics();
    saveState();
    
    // Обновление интерфейса
    document.getElementById('quiz-container').style.display = 'none';
    document.getElementById('test-instructions').style.display = 'block';
    document.getElementById('start-test-btn').disabled = false;
    
    // Переход на страницу результатов
    switchPage('results');
    
    // Показать уведомление
    const scorePercent = Math.round((AppState.testState.score / AppState.testState.questions.length) * 100);
    showNotification(`Тест завершен! Ваш результат: ${scorePercent}%`, 'success');
}

// Обновление счетчика вопросов
function updateQuestionCounter() {
    document.getElementById('current-question').textContent = AppState.testState.currentQuestion + 1;
    document.getElementById('total-questions').textContent = AppState.testState.questions.length;
}

// Обновление прогресс-бара
function updateProgressBar() {
    const progressPercent = (AppState.testState.currentQuestion / AppState.testState.questions.length) * 100;
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.width = `${progressPercent}%`;
    }
}