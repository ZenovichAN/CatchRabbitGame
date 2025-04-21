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

//Прыжок кролика
function moveRabbit() {
  const newX = Math.random() * (gameArea.clientWidth - 60);
  const newY = Math.random() * (gameArea.clientHeight - 60);
  
  // Плавное движение (можно заменить на параболическое)
  rabbit.style.transition = 'left 0.5s, top 0.5s';
  rabbitX = newX;
  rabbitY = newY;
  updateRabbitPosition();
  
  // Случайный интервал прыжка: 1-2 секунды
  setTimeout(moveRabbit, 1000 + Math.random() * 1000);
}

// Ловим кролика
function catchRabbit() {
  score++;
  scoreDisplay.textContent = `Daria catched rabbit: ${score}`;
  
  // Анимация при клике
  rabbit.style.transform = 'scale(1.1)';
  setTimeout(() => rabbit.style.transform = 'scale(1)', 200);
  
  // Сразу прыгает дальше
  moveRabbit();
}

// Запуск игры
init();