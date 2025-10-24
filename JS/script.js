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
    
    // Устанавливаем правильные размеры
    updateGameRect();
    
    // Устанавливаем начальную позицию в центре видимой области
    rabbitX = gameRect.width / 2;
    rabbitY = gameRect.height / 2;
    
    updateRabbitPosition();
    animateRabbit();
    
    // Запускаем движение
    setTimeout(() => {
        moveRabbit();
    }, 500);
    
    // Добавляем обработчики
    rabbit.addEventListener('click', catchRabbit);
    rabbit.addEventListener('touchstart', catchRabbit, { passive: false });
    
    // Обработка изменений
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    console.log('Game ready - rabbit will stay in viewport');
}

// Обновление размеров игровой области
function updateGameRect() {
    gameRect = gameArea.getBoundingClientRect();
    console.log('Viewport size:', Math.round(gameRect.width), 'x', Math.round(gameRect.height));
}

// Обработка изменения ориентации
function handleOrientationChange() {
    console.log('Orientation change detected');
    setTimeout(() => {
        handleResize();
    }, 100);
}

// Обработка изменения размера
function handleResize() {
    console.log('Viewport resize detected');
    if (moveTimeout) {
        clearTimeout(moveTimeout);
        moveTimeout = null;
    }
    
    updateGameRect();
    
    // Немедленно корректируем позицию кролика чтобы он остался в видимой области
    const rabbitWidth = rabbit.offsetWidth || 50;
    const rabbitHeight = rabbit.offsetHeight || 60;
    
    const maxX = gameRect.width - rabbitWidth / 2;
    const maxY = gameRect.height - rabbitHeight / 2;
    const minX = rabbitWidth / 2;
    const minY = rabbitHeight / 2;
    
    // Гарантируем, что кролик останется в видимой области
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

// Прыжок кролика - ГАРАНТИРУЕМ что он останется в видимой области
function moveRabbit() {
    if (isMoving) return;
    
    isMoving = true;
    
    const rabbitWidth = rabbit.offsetWidth || 50;
    const rabbitHeight = rabbit.offsetHeight || 60;
    
    // Безопасная зона - 90% от видимой области (очень близко к краям)
    const safeZonePadding = 0.05; // Всего 5% отступ от краев
    const minX = rabbitWidth / 2 + gameRect.width * safeZonePadding;
    const maxX = gameRect.width - rabbitWidth / 2 - gameRect.width * safeZonePadding;
    const minY = rabbitHeight / 2 + gameRect.height * safeZonePadding;
    const maxY = gameRect.height - rabbitHeight / 2 - gameRect.height * safeZonePadding;
    
    // Генерируем новую позицию СТРОГО в безопасной зоне
    const newX = Math.random() * (maxX - minX) + minX;
    const newY = Math.random() * (maxY - minY) + minY;
    
    rabbitX = Math.max(minX, Math.min(newX, maxX));
    rabbitY = Math.max(minY, Math.min(newY, maxY));
    
    updateRabbitPosition();
    
    // Короткий интервал прыжка: 0.7-1.0 секунды (чаще появляется)
    const nextMoveTime = 700 + Math.random() * 300;
    
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
    scoreDisplay.textContent = `How many times you catched this fuckin rabbit: ${score}`;
    
    // Анимация при клике
    rabbit.classList.add('rabbit-caught');
    setTimeout(() => {
        rabbit.classList.remove('rabbit-caught');
    }, 300);
    
    // Сразу прыгает дальше (но остается в видимой области)
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

// Запуск игры
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded - starting game');
    setTimeout(init, 100);
});

// Дополнительная инициализация
window.addEventListener('load', function() {
    console.log('Window fully loaded');
    setTimeout(init, 200);
});