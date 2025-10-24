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
    // Устанавливаем начальную позицию в центре
    const gameRect = gameArea.getBoundingClientRect();
    rabbitX = gameRect.width / 2;
    rabbitY = gameRect.height / 2;
    
    updateRabbitPosition();
    animateRabbit();
    moveRabbit();
    rabbit.addEventListener('click', catchRabbit);
    rabbit.addEventListener('touchstart', catchRabbit, { passive: false });
    
    // Обработка изменения размера окна
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
}

// Обработка изменения размера
function handleResize() {
    if (moveTimeout) clearTimeout(moveTimeout);
    
    const gameRect = gameArea.getBoundingClientRect();
    const rabbitWidth = rabbit.offsetWidth;
    const rabbitHeight = rabbit.offsetHeight;
    
    // Ограничиваем позицию кролика новыми границами
    const maxX = gameRect.width - rabbitWidth / 2;
    const maxY = gameRect.height - rabbitHeight / 2;
    const minX = rabbitWidth / 2;
    const minY = rabbitHeight / 2;
    
    rabbitX = Math.max(minX, Math.min(rabbitX, maxX));
    rabbitY = Math.max(minY, Math.min(rabbitY, maxY));
    
    updateRabbitPosition();
    
    // Возобновляем движение после изменения размера
    if (!isMoving) {
        moveRabbit();
    }
}

// Обновление позиции
function updateRabbitPosition() {
    rabbit.style.left = `${rabbitX}px`;
    rabbit.style.top = `${rabbitY}px`;
}

// Анимация спрайта
function animateRabbit() {
    rabbit.style.animation = 'runRabbit 0.7s steps(7) infinite';
}

// Прыжок кролика - всегда в пределах видимой области
function moveRabbit() {
    if (isMoving) return;
    
    isMoving = true;
    const gameRect = gameArea.getBoundingClientRect();
    const rabbitWidth = rabbit.offsetWidth;
    const rabbitHeight = rabbit.offsetHeight;
    
    // Определяем безопасную зону (80% от видимой области)
    const safeZonePadding = 0.1; // 10% отступ от краев
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
    
    // Случайный интервал прыжка: 0.8-1.5 секунды (быстрее для лучшего геймплея)
    const nextMoveTime = 800 + Math.random() * 700;
    
    moveTimeout = setTimeout(() => {
        isMoving = false;
        moveRabbit();
    }, nextMoveTime);
}

// Ловим кролика
function catchRabbit(event) {
    if (event.type === 'touchstart') {
        event.preventDefault();
    }
    
    score++;
    scoreDisplay.textContent = `How many times you catched this fuckin rabbit: ${score}`;
    
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

// Предотвращаем контекстное меню на кролике (для мобильных)
rabbit.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// Запуск игры когда DOM загружен
document.addEventListener('DOMContentLoaded', init);

// Дополнительная инициализация когда все ресурсы загружены
window.addEventListener('load', () => {
    // Добавляем небольшую задержку для стабильности
    setTimeout(init, 100);
});