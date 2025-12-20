// Данные о странах и флагах (теперь с URL изображений флагов)
const CountriesData = [
    { 
        id: 1, 
        name: "Россия", 
        capital: "Москва", 
        region: "europe", 
        flag: "img/image.png", 
        emoji: "🇷🇺",
        population: "146 млн" 
    },
    { 
        id: 2, 
        name: "США", 
        capital: "Вашингтон", 
        region: "america", 
        flag: "img/сша.jpg", 
        emoji: "🇺🇸",
        population: "331 млн" 
    },
    { 
        id: 3, 
        name: "Германия", 
        capital: "Берлин", 
        region: "europe", 
        flag: "img/германия.png", 
        emoji: "🇩🇪",
        population: "83 млн" 
    },
    { 
        id: 4, 
        name: "Франция", 
        capital: "Париж", 
        region: "europe", 
        flag: "img/Франция.png", 
        emoji: "🇫🇷",
        population: "67 млн" 
    },
    { 
        id: 5, 
        name: "Италия", 
        capital: "Рим", 
        region: "europe", 
        flag: "img/Италия.png", 
        emoji: "🇮🇹",
        population: "60 млн" 
    },
    { 
        id: 6, 
        name: "Великобритания", 
        capital: "Лондон", 
        region: "europe", 
        flag: "img/англия.jpg", 
        emoji: "🇬🇧",
        population: "67 млн" 
    },
    { 
        id: 7, 
        name: "Япония", 
        capital: "Токио", 
        region: "asia", 
        flag: "img/япония.png", 
        emoji: "🇯🇵",
        population: "126 млн" 
    },
    { 
        id: 8, 
        name: "Китай", 
        capital: "Пекин", 
        region: "asia", 
        flag: "img/китай.avif", 
        emoji: "🇨🇳",
        population: "1.4 млрд" 
    },
    { 
        id: 9, 
        name: "Индия", 
        capital: "Нью-Дели", 
        region: "asia", 
        flag: "img/индия.png", 
        emoji: "🇮🇳",
        population: "1.38 млрд" 
    },
    { 
        id: 10, 
        name: "Бразилия", 
        capital: "Бразилиа", 
        region: "america", 
        flag: "img/бразилия.png", 
        emoji: "🇧🇷",
        population: "213 млн" 
    },
    { 
        id: 11, 
        name: "Канада", 
        capital: "Оттава", 
        region: "america", 
        flag: "img/канада.avif", 
        emoji: "🇨🇦",
        population: "38 млн" 
    },
    { 
        id: 12, 
        name: "Австралия", 
        capital: "Канберра", 
        region: "oceania", 
        flag: "img/австралия.jpg", 
        emoji: "🇦🇺",
        population: "25 млн" 
    },
    { 
        id: 13, 
        name: "Мексика", 
        capital: "Мехико", 
        region: "america", 
        flag: "img/мекика.png", 
        emoji: "🇲🇽",
        population: "126 млн" 
    },
    { 
        id: 14, 
        name: "Испания", 
        capital: "Мадрид", 
        region: "europe", 
        flag: "img/испания.png", 
        emoji: "🇪🇸",
        population: "47 млн" 
    },
    { 
        id: 15, 
        name: "Южная Корея", 
        capital: "Сеул", 
        region: "asia", 
        flag: "img/южная корея.png", 
        emoji: "🇰🇷",
        population: "52 млн" 
    },
    { 
        id: 16, 
        name: "Египет", 
        capital: "Каир", 
        region: "africa", 
        flag: "img/египет.png", 
        emoji: "🇪🇬",
        population: "102 млн" 
    },
    { 
        id: 17, 
        name: "ЮАР", 
        capital: "Претория", 
        region: "africa", 
        flag: "img/юар.jpg", 
        emoji: "🇿🇦",
        population: "59 млн" 
    },
    { 
        id: 18, 
        name: "Аргентина", 
        capital: "Буэнос-Айрес", 
        region: "america", 
        flag: "img/аргентина.png", 
        emoji: "🇦🇷",
        population: "45 млн" 
    },
    { 
        id: 19, 
        name: "Новая Зеландия", 
        capital: "Веллингтон", 
        region: "oceania", 
        flag: "img/нз.jpg", 
        emoji: "🇳🇿",
        population: "5 млн" 
    },
    { 
        id: 20, 
        name: "Швеция", 
        capital: "Стокгольм", 
        region: "europe", 
        flag: "img/швеция.avif", 
        emoji: "🇸🇪",
        population: "10 млн" 
    }
];

// Регионы для фильтрации
const Regions = {
    all: { name: "Все страны", icon: "bi-globe", color: "primary" },
    europe: { name: "Европа", icon: "bi-building", color: "info" },
    asia: { name: "Азия", icon: "bi-mountain", color: "success" },
    africa: { name: "Африка", icon: "bi-sun", color: "warning" },
    america: { name: "Америка", icon: "bi-globe-americas", color: "danger" },
    oceania: { name: "Океания", icon: "bi-water", color: "secondary" }
};

// Типы тестов
const TestTypes = {
    'flag-to-country': 'Флаг → Страна',
    'country-to-flag': 'Страна → Флаг',
    'region-test': 'Тест по региону',
    'mixed': 'Смешанный тест'
};

// Получение стран по региону
function getCountriesByRegion(region) {
    if (region === 'all') return CountriesData;
    return CountriesData.filter(country => country.region === region);
}

// Получение случайной страны
function getRandomCountry(exclude = []) {
    const availableCountries = CountriesData.filter(country => 
        !exclude.includes(country.id)
    );
    return availableCountries[Math.floor(Math.random() * availableCountries.length)];
}

// Получение названия страны по URL флага
function getCountryNameByFlag(flagUrl) {
    const country = CountriesData.find(c => c.flag === flagUrl);
    return country ? country.name : '';
}

// Получение страны по URL флага
function getCountryByFlag(flagUrl) {
    return CountriesData.find(c => c.flag === flagUrl);
}

// Получение страны по эмодзи (для обратной совместимости)
function getCountryByEmoji(emoji) {
    return CountriesData.find(c => c.emoji === emoji);
}