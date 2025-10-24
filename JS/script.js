const rabbit = document.getElementById('rabbit');
const gameArea = document.getElementById('game-container');
const scoreDisplay = document.getElementById('scoreDisplay');
let score = 0;
let rabbitX = 0;
let rabbitY = 0;
let isMoving = false;
let moveTimeout = null;
let gameRect = null;

// Инициализация
function init() {
    console.log('Initializing game...');
    
    // Получаем актуальные размеры игровой области
    updateGameRect();
    
    // Устанавливаем начальную позицию в центре
    rabbitX = gameRect.width / 2;
    rabbitY = gameRect.height / 2;
    
    updateRabbitPosition();
    animateRabbit();
    moveRabbit();
    
    // Добавляем обработчики событий
    rabbit.addEventListener('click', catchRabbit);
    rabbit.addEventListener('touchstart', catchRabbit, { passive: false });
    
    // Обработка изменения размера и ориентации
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    console.log('Game initialized successfully');
}

// Обновление размеров игровой области
function updateGameRect() {
    gameRect = gameArea.getBoundingClientRect();
    console.log('Game area:', gameRect.width, 'x', gameRect.height);
}

// Обработка изменения ориентации
function handleOrientationChange() {
    console.log('Orientation changed');
    // Даем время на перерисовку
    setTimeout(() => {
        handleResize();
    }, 100);
}

// Обработка изменения размера
function handleResize() {
    console.log('Window resized');
    if (moveTimeout) clearTimeout(moveTimeout);
    
    updateGameRect();
    
    // Ограничиваем позицию кролика новыми границами
    const rabbitWidth = rabbit.offsetWidth;
    const rabbitHeight = rabbit.offsetHeight;
    
    const maxX = gameRect.width - rabbitWidth / 2;
    const maxY = gameRect.height - rabbitHeight / 2;
    const minX = rabbitWidth / 2;
    const minY = rabbitHeight / 2;
    
    rabbitX = Math.max(minX, Math.min(rabbitX, maxX));
    rabbitY = Math.max(minY, Math.min(rabbitY, maxY));
    
    updateRabbitPosition();
    
    // Возобновляем движение
    if (!isMoving) {
        moveRabbit();
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
    
    const rabbitWidth = rabbit.offsetWidth;
    const rabbitHeight = rabbit.offsetHeight;
    
    // Безопасная зона - 85% от видимой области
    const safeZonePadding = 0.075;
    const minX = rabbitWidth / 2 + gameRect.width * safeZonePadding;
    const maxX = gameRect.width - rabbitWidth / 2 - gameRect.width * safeZonePadding;
    const minY = rabbitHeight / 2 + gameRect.height * safeZonePadding;
    const maxY = gameRect.height - rabbitHeight / 2 - gameRect.height * safeZonePadding;
    
    // Генерируем новую позицию
    const newX = Math.random() * (maxX - minX) + minX;
    const newY = Math.random() * (maxY - minY) + minY;
    
    rabbitX = newX;
    rabbitY = newY;
    
    updateRabbitPosition();
    
    // Быстрый интервал прыжка: 0.7-1.2 секунды
    const nextMoveTime = 700 + Math.random() * 500;
    
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
    if (moveTimeout) clearTimeout(moveTimeout);
    isMoving = false;
    moveRabbit();
}

// Предотвращаем контекстное меню и масштабирование
rabbit.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Запуск игры
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded');
    // Небольшая задержка для стабильности на мобильных
    setTimeout(init, 300);
});

// Дополнительная инициализация при полной загрузке
window.addEventListener('load', function() {
    console.log('Window loaded');
});