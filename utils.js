// Вспомогательные функции

// Форматирование времени
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Перемешивание массива
function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// Генерация вариантов ответов
function generateOptions(correctAnswer, allAnswers, count = 4) {
    const options = [correctAnswer];
    const wrongAnswers = allAnswers.filter(answer => answer !== correctAnswer);
    const shuffledWrongAnswers = shuffleArray([...wrongAnswers]);
    
    for (let i = 0; i < count - 1 && i < shuffledWrongAnswers.length; i++) {
        options.push(shuffledWrongAnswers[i]);
    }
    
    return shuffleArray(options);
}

// Получение названия страны по флагу
function getCountryNameByFlag(flagEmoji) {
    const country = CountriesData.find(c => c.flag === flagEmoji);
    return country ? country.name : '';
}

// Анимация появления элемента
function fadeIn(element, duration = 300) {
    element.style.opacity = 0;
    element.style.display = 'block';
    
    let start = null;
    function animate(timestamp) {
        if (!start) start = timestamp;
        const progress = timestamp - start;
        const opacity = Math.min(progress / duration, 1);
        element.style.opacity = opacity;
        
        if (progress < duration) {
            requestAnimationFrame(animate);
        }
    }
    requestAnimationFrame(animate);
}

// Показать уведомление
function showNotification(message, type = 'info') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '1050';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    document.body.appendChild(alertDiv);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 3000);
}