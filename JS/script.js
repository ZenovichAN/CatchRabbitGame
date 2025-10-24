const rabbit = document.getElementById('rabbit');
const gameArea = document.getElementById('game-container');
const scoreDisplay = document.getElementById('scoreDisplay');
let score = 0;
let rabbitX = 0;
let rabbitY = 0;
let isMoving = false;
let moveTimeout = null;

// Инициализация
function init() {
    console.log('Initializing game for mobile...');
    
    // Принудительно устанавливаем правильные размеры
    forceMobileViewport();
    
    // Устанавливаем начальную позицию
    updateGameRect();
    rabbitX = gameRect.width / 2;
    rabbitY = gameRect.height / 2;
    
    updateRabbitPosition();
    animateRabbit();
    
    // Запускаем движение после небольшой задержки
    setTimeout(() => {
        moveRabbit();
    }, 500);
    
    // Добавляем обработчики
    rabbit.addEventListener('click', catchRabbit);
    rabbit.addEventListener('touchstart', catchRabbit, { passive: false });
    
    // Обработка изменений
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    console.log('Mobile game ready');
}

// Принудительная установка viewport для мобильных
function forceMobileViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (window.innerWidth <= 768) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }
}

// Обновление размеров игровой области
function updateGameRect() {
    gameRect = gameArea.getBoundingClientRect();
    console.log('Game area size:', Math.round(gameRect.width), 'x', Math.round(gameRect.height));
}

// Обработка изменения ориентации
function handleOrientationChange() {
    console.log('Orientation change detected');
    // Даем время на перерисовку
    setTimeout(() => {
        forceMobileViewport();
        handleResize();
    }, 150);
}

// Обработка изменения размера
function handleResize() {
    console.log('Resize detected');
    if (moveTimeout) {
        clearTimeout(moveTimeout);
        moveTimeout = null;
    }
    
    updateGameRect();
    
    // Корректируем позицию кролика
    const rabbitWidth = rabbit.offsetWidth || 50;
    const rabbitHeight = rabbit.offsetHeight || 60;
    
    const maxX = gameRect.width - rabbitWidth / 2;
    const maxY = gameRect.height - rabbitHeight / 2;
    const minX = rabbitWidth / 2;
    const minY = rabbitHeight / 2;
    
    rabbitX = Math.max(minX, Math.min(rabbitX, maxX));
    rabbitY = Math.max(minY, Math.min(rabbitY, maxY));
    
    updateRabbitPosition();
    
    // Возобновляем движение
    if (!isMoving) {
        setTimeout(moveRabbit, 300);
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

// Прыжок кролика
function moveRabbit() {
    if (isMoving) return;
    
    isMoving = true;
    
    const rabbitWidth = rabbit.offsetWidth || 50;
    const rabbitHeight = rabbit.offsetHeight || 60;
    
    // Безопасная зона - 80% от видимой области
    const safeZonePadding = 0.1;
    const minX = rabbitWidth / 2 + gameRect.width * safeZonePadding;
    const maxX = gameRect.width - rabbitWidth / 2 - gameRect.width * safeZonePadding;
    const minY = rabbitHeight / 2 + gameRect.height * safeZonePadding;
    const maxY = gameRect.height - rabbitHeight / 2 - gameRect.height * safeZonePadding;
    
    // Генерируем новую позицию в безопасной зоне
    const newX = Math.random() * (maxX - minX) + minX;
    const newY = Math.random() * (maxY - minY) + minY;
    
    rabbitX = newX;
    rabbitY = newY;
    
    updateRabbitPosition();
    
    // Интервал прыжка: 0.8-1.3 секунды
    const nextMoveTime = 800 + Math.random() * 500;
    
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
    scoreDisplay.textContent = `Caught: ${score}`;
    
    // Анимация при клике
    rabbit.classList.add('rabbit-caught');
    setTimeout(() => {
        rabbit.classList.remove('rabbit-caught');
    }, 300);
    
    // Сразу прыгает дальше
    if (moveTimeout) {
        clearTimeout(moveTimeout);
        moveTimeout = null;
    }
    isMoving = false;
    moveRabbit();
}

// Предотвращаем нежелательные действия
rabbit.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Запуск игры
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting mobile game');
    // Задержка для стабильности на мобильных
    setTimeout(init, 100);
});

// Дополнительная инициализация
window.addEventListener('load', function() {
    console.log('Window fully loaded');
    // Переинициализация для надежности
    setTimeout(init, 200);
});