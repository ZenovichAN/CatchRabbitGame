const rabbit = document.getElementById('rabbit');
const gameArea = document.getElementById('game-container');
const scoreDisplay = document.getElementById('scoreDisplay');
let score = 0;
let rabbitX = 100;
let rabbitY = 100;

// Инициализация
function init() {
    updateRabbitPosition();
    animateRabbit();
    moveRabbit();
    rabbit.addEventListener('click', catchRabbit);
    
    // Обработка изменения размера окна
    window.addEventListener('resize', updateRabbitPosition);
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

// Прыжок кролика
function moveRabbit() {
    const gameRect = gameArea.getBoundingClientRect();
    const rabbitWidth = rabbit.offsetWidth;
    const rabbitHeight = rabbit.offsetHeight;
    
    const maxX = gameRect.width - rabbitWidth;
    const maxY = gameRect.height - rabbitHeight;
    
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    
    rabbitX = Math.max(0, Math.min(newX, maxX));
    rabbitY = Math.max(0, Math.min(newY, maxY));
    
    updateRabbitPosition();
    
    // Случайный интервал прыжка: 1-2 секунды
    setTimeout(moveRabbit, 1000 + Math.random() * 1000);
}

// Ловим кролика
function catchRabbit() {
    score++;
    scoreDisplay.textContent = `How many times you catched this fuckin rabbit: ${score}`;
    
    // Анимация при клике
    rabbit.style.transform = 'scale(1.1)';
    setTimeout(() => rabbit.style.transform = 'scale(1)', 200);
    
    // Сразу прыгает дальше
    moveRabbit();
}

// Запуск игры когда DOM загружен
document.addEventListener('DOMContentLoaded', init);