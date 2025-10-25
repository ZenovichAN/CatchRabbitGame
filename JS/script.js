const rabbit = document.getElementById('rabbit');
const gameArea = document.getElementById('game-container');
const scoreDisplay = document.getElementById('scoreDisplay');
const scoreValue = document.getElementById('scoreValue');
let score = 0;
let rabbitX = 0;
let rabbitY = 0;
let isMoving = false;
let moveTimeout = null;

// Создаем элемент для сообщения
const messageElement = document.createElement('div');
messageElement.style.cssText = `
    position: fixed;
    bottom: 50px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 20px 30px;
    border-radius: 15px;
    font-size: min(4vw, 18px);
    text-align: center;
    z-index: 1000;
    backdrop-filter: blur(10px);
    border: 2px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
    opacity: 0;
    transition: opacity 0.5s ease;
    max-width: 90%;
    word-wrap: break-word;
    line-height: 1.4;
`;
document.body.appendChild(messageElement);

// Установка переменной высоты для мобильных
function setVhVariable() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

// Функция показа сообщения
function showMessage() {
    messageElement.textContent = "Australia thanks for your assistance, all rabbits are fed and sent home";
    messageElement.style.opacity = '1';
    
    // Сообщение исчезает через 3 секунды (время прочтения)
    setTimeout(() => {
        messageElement.style.opacity = '0';
    }, 3000);
}

// Инициализация
function init() {
    console.log('🚀 Initializing game for Android...');
    
    // Устанавливаем переменную высоты
    setVhVariable();
    
    // Принудительная установка viewport для Android
    forceAndroidViewport();
    
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
    }, 300); // уменьшил задержку старта
    
    // Добавляем обработчики
    rabbit.addEventListener('click', catchRabbit);
    rabbit.addEventListener('touchstart', catchRabbit, { passive: false });
    
    // Обработка изменений размера
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);
    
    console.log('✅ Android game ready');
}

// Фикс для Android
function forceAndroidViewport() {
    const viewport = document.querySelector('meta[name="viewport"]');
    viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, shrink-to-fit=no');
}

// Обновление размеров игровой области с фиксом для Android
function updateGameRect() {
    gameRect = {
        width: window.innerWidth,
        height: window.innerHeight,
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight
    };
    console.log('📐 Viewport size:', Math.round(gameRect.width), 'x', Math.round(gameRect.height));
}

// Обработка изменения ориентации
function handleOrientationChange() {
    console.log('🔄 Orientation change detected');
    setTimeout(() => {
        setVhVariable();
        forceAndroidViewport();
        handleResize();
        rabbitX = gameRect.width / 2;
        rabbitY = gameRect.height / 2;
        updateRabbitPosition();
    }, 300); // уменьшил задержку
}

// Обработка изменения размера
function handleResize() {
    console.log('📏 Resize detected');
    if (moveTimeout) {
        clearTimeout(moveTimeout);
        moveTimeout = null;
    }
    
    setVhVariable();
    updateGameRect();
    
    // Фиксированные размеры кролика для Android
    const rabbitWidth = 60;
    const rabbitHeight = 70;
    
    // Жесткие границы
    const maxX = gameRect.width - (rabbitWidth / 2);
    const maxY = gameRect.height - (rabbitHeight / 2);
    const minX = rabbitWidth / 2;
    const minY = rabbitHeight / 2;
    
    // Принудительно ограничиваем позицию
    rabbitX = Math.max(minX, Math.min(rabbitX, maxX));
    rabbitY = Math.max(minY, Math.min(rabbitY, maxY));
    
    updateRabbitPosition();
    
    if (!isMoving) {
        setTimeout(moveRabbit, 200); // уменьшил задержку
    }
}

// Обновление позиции кролика
function updateRabbitPosition() {
    rabbit.style.left = `${rabbitX}px`;
    rabbit.style.top = `${rabbitY}px`;
}

// Анимация спрайта
function animateRabbit() {
    rabbit.style.animation = 'runRabbit 0.5s steps(7) infinite'; // ускорил анимацию
}

// Прыжок кролика - УСКОРЕНО
function moveRabbit() {
    if (isMoving) return;
    
    isMoving = true;
    
    const rabbitWidth = 60;
    const rabbitHeight = 70;
    
    // Безопасная зона
    const safeZonePadding = 0.05;
    const minX = (rabbitWidth / 2) + (gameRect.width * safeZonePadding);
    const maxX = gameRect.width - (rabbitWidth / 2) - (gameRect.width * safeZonePadding);
    const minY = (rabbitHeight / 2) + (gameRect.height * safeZonePadding);
    const maxY = gameRect.height - (rabbitHeight / 2) - (gameRect.height * safeZonePadding);
    
    const newX = Math.random() * (maxX - minX) + minX;
    const newY = Math.random() * (maxY - minY) + minY;
    
    rabbitX = Math.max(minX, Math.min(newX, maxX));
    rabbitY = Math.max(minY, Math.min(newY, maxY));
    
    updateRabbitPosition();
    
    // УСКОРИЛ ПРЫЖКИ: 400-700 мс вместо 700-1200
    const nextMoveTime = 400 + Math.random() * 300;
    
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
    scoreValue.textContent = score;
    
    // Проверяем каждые 20 пойманных кроликов
    if (score % 20 === 0) {
        showMessage();
    }
    
    rabbit.classList.add('rabbit-caught');
    setTimeout(() => {
        rabbit.classList.remove('rabbit-caught');
    }, 200); // ускорил анимацию
    
    if (moveTimeout) {
        clearTimeout(moveTimeout);
        moveTimeout = null;
    }
    isMoving = false;
    
    moveRabbit();
}

// Предотвращаем контекстное меню
rabbit.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Запуск игры
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 DOM loaded - starting game');
    setTimeout(init, 300); // уменьшил задержку
});

window.addEventListener('load', function() {
    console.log('🎯 Window fully loaded');
});