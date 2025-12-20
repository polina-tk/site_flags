// Модуль результатов и статистики

function setupResults() {
    // Кнопка "Пройти еще раз"
    const retakeTestBtn = document.getElementById('retake-test');
    if (retakeTestBtn) {
        retakeTestBtn.addEventListener('click', () => {
            switchPage('test');
        });
    }
    
    // Кнопка "Поделиться"
    const shareResultsBtn = document.getElementById('share-results');
    if (shareResultsBtn) {
        shareResultsBtn.addEventListener('click', shareResults);
    }
}

// Обновление страницы результатов
function updateResultsPage() {
    const noResults = document.getElementById('no-results');
    const resultsContent = document.getElementById('results-content');
    
    if (AppState.results.length === 0) {
        noResults.style.display = 'block';
        resultsContent.style.display = 'none';
        return;
    }
    
    noResults.style.display = 'none';
    resultsContent.style.display = 'block';
    
    // Получение последнего результата
    const lastResult = AppState.results[AppState.results.length - 1];
    const scorePercent = Math.round((lastResult.score / lastResult.total) * 100);
    
    // Обновление круга с результатами
    updateScoreCircle(scorePercent, lastResult.score, lastResult.total);
    
    // Обновление статистических карточек
    updateStatCards(lastResult);
    
    // Обновление таблицы результатов
    updateResultsTable(lastResult);
    
    // Обновление общей статистики
    updateOverallStatistics();
    
    // Обновление достижений
    updateAchievements();
}

// Обновление круга с результатами
function updateScoreCircle(percent, score, total) {
    const scoreCircle = document.getElementById('score-circle');
    const scoreText = document.getElementById('score-text');
    const scorePercent = document.getElementById('score-percent');
    const scoreMessage = document.getElementById('score-message');
    
    // Установка процента для CSS градиента
    scoreCircle.style.setProperty('--score-percent', `${percent}%`);
    
    // Обновление текста
    scoreText.textContent = `${score}/${total}`;
    scorePercent.textContent = `${percent}%`;
    
    // Сообщение в зависимости от результата
    let message = '';
    let messageClass = '';
    
    if (percent >= 90) {
        message = 'Отличный результат! Вы настоящий эксперт по флагам! 🏆';
        messageClass = 'text-success';
    } else if (percent >= 70) {
        message = 'Хороший результат! Продолжайте в том же духе! 👍';
        messageClass = 'text-primary';
    } else if (percent >= 50) {
        message = 'Неплохо! Есть куда стремиться 💪';
        messageClass = 'text-warning';
    } else {
        message = 'Попробуйте еще раз! У вас обязательно получится! 🌟';
        messageClass = 'text-danger';
    }
    
    scoreMessage.textContent = message;
    scoreMessage.className = messageClass;
}

// Обновление статистических карточек
function updateStatCards(result) {
    document.getElementById('correct-answers').textContent = result.score;
    document.getElementById('wrong-answers').textContent = result.total - result.score;
    document.getElementById('time-spent').textContent = formatTime(result.timeSpent || 0);
}

// Обновление таблицы результатов
function updateResultsTable(result) {
    const resultsTable = document.getElementById('results-table');
    resultsTable.innerHTML = '';
    
    result.userAnswers.forEach((answer, index) => {
        const row = document.createElement('tr');
        
        // Вопрос
        let questionText = '';
        if (answer.question.type === 'flag-to-country') {
            questionText = `Флаг ${answer.question.flag}`;
        } else {
            questionText = `Страна ${answer.question.country}`;
        }
        
        // Правильный ответ
        let correctAnswerText = '';
        if (answer.question.type === 'country-to-flag') {
            correctAnswerText = `${answer.question.correctAnswer} ${getCountryNameByFlag(answer.question.correctAnswer)}`;
        } else {
            correctAnswerText = answer.question.correctAnswer;
        }
        
        // Ответ пользователя
        let userAnswerText = '';
        if (answer.question.type === 'country-to-flag') {
            userAnswerText = `${answer.selectedAnswer} ${getCountryNameByFlag(answer.selectedAnswer)}`;
        } else {
            userAnswerText = answer.selectedAnswer;
        }
        
        row.innerHTML = `
            <td>${questionText}</td>
            <td>${userAnswerText}</td>
            <td>${correctAnswerText}</td>
            <td>
                <span class="badge bg-${answer.isCorrect ? 'success' : 'danger'}">
                    ${answer.isCorrect ? 'Правильно' : 'Неправильно'}
                </span>
            </td>
        `;
        
        resultsTable.appendChild(row);
    });
}

// Обновление общей статистики
function updateOverallStatistics() {
    document.getElementById('total-tests').textContent = AppState.statistics.totalTests;
    document.getElementById('best-score').textContent = `${AppState.statistics.bestScore}%`;
    document.getElementById('average-score').textContent = `${AppState.statistics.averageScore}%`;
    document.getElementById('total-questions-done').textContent = AppState.statistics.totalQuestions;
}

// Обновление достижений
function updateAchievements() {
    const achievementsContainer = document.getElementById('achievements');
    const achievements = AppState.statistics.achievements || [];
    
    // Список всех возможных достижений
    const allAchievements = [
        { id: 'first-test', icon: 'bi-star', title: 'Первый тест', description: 'Пройдите свой первый тест' },
        { id: 'expert', icon: 'bi-trophy', title: 'Эксперт', description: 'Наберите 90% или выше' },
        { id: 'dedicated', icon: 'bi-lightning', title: 'Преданный', description: 'Пройдите 10 тестов' },
        { id: 'centurion', icon: 'bi-award', title: 'Сотник', description: 'Ответьте на 100 вопросов' }
    ];
    
    achievementsContainer.innerHTML = '';
    
    allAchievements.forEach(achievement => {
        const isUnlocked = achievements.includes(achievement.id);
        const col = document.createElement('div');
        col.className = 'col-4 text-center';
        
        col.innerHTML = `
            <div class="achievement ${isUnlocked ? 'unlocked' : 'locked'}">
                <i class="bi ${achievement.icon} fs-4 mb-2"></i>
                <div class="small">${achievement.title}</div>
            </div>
        `;
        
        // Добавление тултипа
        col.title = achievement.description;
        col.setAttribute('data-bs-toggle', 'tooltip');
        
        achievementsContainer.appendChild(col);
    });
    
    // Инициализация тултипов Bootstrap
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Поделиться результатами
function shareResults() {
    if (navigator.share) {
        const lastResult = AppState.results[AppState.results.length - 1];
        const scorePercent = Math.round((lastResult.score / lastResult.total) * 100);
        
        navigator.share({
            title: 'Мои результаты теста по флагам',
            text: `Я набрал ${scorePercent}% в тесте по флагам стран мира! Попробуйте и вы!`,
            url: window.location.href
        });
    } else {
        // Копирование в буфер обмена для старых браузеров
        const lastResult = AppState.results[AppState.results.length - 1];
        const scorePercent = Math.round((lastResult.score / lastResult.total) * 100);
        const text = `Я набрал ${scorePercent}% в тесте по флагам стран мира! Попробуйте и вы: ${window.location.href}`;
        
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Результат скопирован в буфер обмена!', 'success');
        });
    }
}