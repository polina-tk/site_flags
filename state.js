// Глобальное состояние приложения
const AppState = {
    currentPage: 'home',
    currentRegion: 'all',
    
    // Состояние тестирования
    testState: {
        inProgress: false,
        currentQuestion: 0,
        score: 0,
        startTime: null,
        endTime: null,
        questions: [],
        userAnswers: [],
        config: {
            type: 'flag-to-country',
            questionCount: 10,
            difficulty: 'easy',
            region: null
        }
    },
    
    // Результаты и статистика
    results: [],
    statistics: {
        totalTests: 0,
        bestScore: 0,
        averageScore: 0,
        totalQuestions: 0,
        achievements: []
    }
};

// Сохранение состояния в localStorage
function saveState() {
    const state = {
        results: AppState.results,
        statistics: AppState.statistics
    };
    localStorage.setItem('flagsAppState', JSON.stringify(state));
}

// Загрузка состояния из localStorage
function loadState() {
    const savedState = localStorage.getItem('flagsAppState');
    if (savedState) {
        const state = JSON.parse(savedState);
        AppState.results = state.results || [];
        AppState.statistics = state.statistics || {
            totalTests: 0,
            bestScore: 0,
            averageScore: 0,
            totalQuestions: 0,
            achievements: []
        };
        updateStatistics();
    }
}

// Обновление статистики
function updateStatistics() {
    if (AppState.results.length === 0) {
        AppState.statistics.totalTests = 0;
        AppState.statistics.bestScore = 0;
        AppState.statistics.averageScore = 0;
        AppState.statistics.totalQuestions = 0;
        return;
    }
    
    const totalTests = AppState.results.length;
    let totalScore = 0;
    let bestScore = 0;
    let totalQuestions = 0;
    
    AppState.results.forEach(result => {
        const scorePercent = Math.round((result.score / result.total) * 100);
        totalScore += scorePercent;
        totalQuestions += result.total;
        
        if (scorePercent > bestScore) {
            bestScore = scorePercent;
        }
    });
    
    AppState.statistics.totalTests = totalTests;
    AppState.statistics.bestScore = bestScore;
    AppState.statistics.averageScore = Math.round(totalScore / totalTests);
    AppState.statistics.totalQuestions = totalQuestions;
    
    // Проверка достижений
    checkAchievements();
}

// Проверка достижений
function checkAchievements() {
    const achievements = [];
    
    // Первый тест
    if (AppState.results.length >= 1) {
        achievements.push('first-test');
    }
    
    // Результат 90% и выше
    if (AppState.statistics.bestScore >= 90) {
        achievements.push('expert');
    }
    
    // 10 пройденных тестов
    if (AppState.statistics.totalTests >= 10) {
        achievements.push('dedicated');
    }
    
    // 100 правильных ответов
    if (AppState.statistics.totalQuestions >= 100) {
        achievements.push('centurion');
    }
    
    AppState.statistics.achievements = achievements;
}