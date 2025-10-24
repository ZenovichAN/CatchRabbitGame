const rabbit = document.getElementById('rabbit');
const gameArea = document.getElementById('game-container');
const scoreDisplay = document.getElementById('scoreDisplay');
const scoreValue = document.getElementById('scoreValue');
let score = 0;
let rabbitX = 0;
let rabbitY = 0;
let isMoving = false;
let moveTimeout = null;
let gameRect = null;

// Инициализация
function init() {
    console.log('🚀 Initializing game...');
    
    // Устанавливаем правильные размеры
    updateGameRect();
    
    // Устанавливаем начальную позицию строго в центре видимой области
    rabbitX = gameRect.width / 2;
    rabbitY = gameRect.height / 2;
    
    updateRabbitPosition();
    animateRabbit();
    
    // Запускаем движение сразу
    setTimeout(() => {
        moveRabbit();
    }, 300);
    
    // Добавляем обработчики
    rabbit.addEventListener('click', catchRabbit);
    rabbit.addEventListener('touchstart', catchRabbit, { passive: false });
    
    // Обработка изменений размера
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    console.log('✅ Game ready - rabbit will ALWAYS stay in viewport');
}

// Обновление размеров игровой области
function updateGameRect() {
    gameRect = gameArea.getBoundingClientRect();
    console.log('📐 Viewport size:', Math.round(gameRect.width), 'x', Math.round(gameRect.height));
}

// Обработка изменения ориентации
function handleOrientationChange() {
    console.log('🔄 Orientation change detected');
    // Даем время на полную перерисовку
    setTimeout(() => {
        handleResize();
        // Принудительно перемещаем кролика в центр после смены ориентации
        rabbitX = gameRect.width / 2;
        rabbitY = gameRect.height / 2;
        updateRabbitPosition();
    }, 200);
}

// Обработка изменения размера
function handleResize() {
    console.log('📏 Viewport resize detected');
    if (moveTimeout) {
        clearTimeout(moveTimeout);
        moveTimeout = null;
    }
    
    updateGameRect();
    
    // СИЛЬНАЯ КОРРЕКЦИЯ: гарантируем, что кролик останется в видимой области
    const rabbitWidth = rabbit.offsetWidth || 50;
    const rabbitHeight = rabbit.offsetHeight || 60;
    
    // Жесткие границы - кролик не может выйти за эти пределы
    const maxX = gameRect.width - (rabbitWidth / 2);
    const maxY = gameRect.height - (rabbitHeight / 2);
    const minX = rabbitWidth / 2;
    const minY = rabbitHeight / 2;
    
    // Принудительно ограничиваем позицию
    rabbitX = Math.max(minX, Math.min(rabbitX, maxX));
    rabbitY = Math.max(minY, Math.min(rabbitY, maxY));
    
    updateRabbitPosition();
    
    // Немедленно возобновляем движение
    if (!isMoving) {
        setTimeout(moveRabbit, 200);
    }
}

// Обновление позиции кролика
function updateRabbitPosition() {
    rabbit.style.left = `${rabbitX}px`;
    rabbit.style.top = `${rabbitY}px`;
}

// Анимация спрайта
function animateRabbit() {
    rabbit.style.animation = 'runRabbit 0.7s steps(7) infinite';
}

// Прыжок кролика - ГАРАНТИЯ что он всегда в видимой области
function moveRabbit() {
    if (isMoving) return;
    
    isMoving = true;
    
    const rabbitWidth = rabbit.offsetWidth || 50;
    const rabbitHeight = rabbit.offsetHeight || 60;
    
    // ОЧЕНЬ БЕЗОПАСНАЯ ЗОНА: 95% от видимой области (всего 2.5% отступ от краев)
    const safeZonePadding = 0.025;
    const minX = (rabbitWidth / 2) + (gameRect.width * safeZonePadding);
    const maxX = gameRect.width - (rabbitWidth / 2) - (gameRect.width * safeZonePadding);
    const minY = (rabbitHeight / 2) + (gameRect.height * safeZonePadding);
    const maxY = gameRect.height - (rabbitHeight / 2) - (gameRect.height * safeZonePadding);
    
    // Генерируем новую позицию СТРОГО в безопасной зоне
    let newX, newY;
    
    // Гарантируем, что позиция валидна
    do {
        newX = Math.random() * (maxX - minX) + minX;
        newY = Math.random() * (maxY - minY) + minY;
    } while (isNaN(newX) || isNaN(newY));
    
    // Жесткое ограничение позиции
    rabbitX = Math.max(minX, Math.min(newX, maxX));
    rabbitY = Math.max(minY, Math.min(newY, maxY));
    
    updateRabbitPosition();
    
    // Очень короткий интервал прыжка: 0.6-0.9 секунды (часто появляется)
    const nextMoveTime = 600 + Math.random() * 300;
    
    moveTimeout = setTimeout(() => {
        isMoving = false;
        moveRabbit();
    }, nextMoveTime);
}

// Ловим кролика
function catchRabbit(event) {
    if (event.type === 'touchstart') {
        event.preventDefault();
        event.stopPropagation();
    }
    
    score++;
    // Меняем ТОЛЬКО число, название остается прежним
    scoreValue.textContent = score;
    
    // Анимация при клике
    rabbit.classList.add('rabbit-caught');
    setTimeout(() => {
        rabbit.classList.remove('rabbit-caught');
    }, 300);
    
    // Сразу прыгает дальше (остается в видимой области)
    if (moveTimeout) {
        clearTimeout(moveTimeout);
        moveTimeout = null;
    }
    isMoving = false;
    
    // Немедленный прыжок
    moveRabbit();
}

// Предотвращаем контекстное меню
rabbit.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Запуск игры когда DOM загружен
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded - starting game');
    setTimeout(init, 100);
});

// Дополнительная инициализация при полной загрузке
window.addEventListener('load', function() {
    console.log('🎯 Window fully loaded');
});