const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const gulpSound = new Audio('audio/gulp.mp3');
const gameOverSound = new Audio('audio/gameover.mp3');

const appleImg = new Image();
appleImg.src = 'img/apple.png';

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;

let snakeParts = [];
let tailLength = 2;

let appleX = Math.floor(Math.random() * tileCount);
let appleY = Math.floor(Math.random() * tileCount);

let velocityX = 0;
let velocityY = 0;

let score = 0;
let bestScore = localStorage.getItem('bestScore') ? localStorage.getItem('bestScore') : 0;

let timeout = null;
let windowKeyDown = null;

function initialState(gameOver) {
  clearGame();
  clearTimeout(timeout);

  timeout = null;
  speed = 7;
  headX = 10;
  headY = 10;
  appleX = Math.floor(Math.random() * tileCount);
  appleY = Math.floor(Math.random() * tileCount);
  velocityX = 0;
  velocityY = 0;
  score = 0;
  tailLength = 2;
  snakeParts.length = 0;

  removeEventListener('keydown', windowKeyDown)

  drawGame();
  return !gameOver;
}

function drawGame() {
  changeSnakePosition();
  let result = isGameOver();

  if (result) return;

  clearGame();
  checkAppleCollision();

  drawApple();
  drawSnake();
  drawBestScore();
  drawScore();

  timeout = setTimeout(drawGame, 1000 / speed);
}

function isGameOver() {
  let gameOver = false;

  if (velocityY === 0 && velocityX === 0) return false;

  if (headX < 0) {
    gameOver = true;
  } else if (headX === tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY === tileCount) {
    gameOver = true;
  }

  snakeParts.forEach((tailPart, i) => {
    if (tailPart.x === headX && tailPart.y === headY) {
      gameOver = true;
      return !gameOver;
    }
  });

  if (gameOver) {
    ctx.fillStyle = 'rgba(255, 182, 85, 1)';

    ctx.font = '50px Verdana';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width / 2, canvas.height / 2.2);

    ctx.font = '20px Verdana';
    ctx.fillText(`Your Score: ${score}`, canvas.width / 2, canvas.height / 1.85);
    ctx.fillText(`Best Score: ${bestScore}`, canvas.width / 2, canvas.height / 1.64);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '12px Verdana';
    ctx.fillText(`Press key ENTER or SPACE`, canvas.width / 2, canvas.height / 1.45);

    ctx.textAlign = 'left';

    if (bestScore < score) {
      bestScore = score;
      localStorage.setItem('bestScore', bestScore);
    }

    gameOverSound.play();

    windowKeyDown = function (event) {
      if (event.keyCode === 32 || event.keyCode === 13) {
        gameOver = initialState(gameOver);
      }
    }

    window.addEventListener('keydown', windowKeyDown);

  }

  return gameOver;
}

function clearGame() {
  ctx.fillStyle = '#1f2b5f';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawSnake() {
  ctx.fillStyle = 'darkgreen';

  snakeParts.forEach(item => ctx.fillRect(item.x * tileCount, item.y * tileCount, tileSize, tileSize));
  snakeParts.push(new SnakePart(headX, headY));

  while (snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  ctx.fillStyle = 'darkred';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function drawApple() {
  ctx.drawImage(appleImg, appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function drawScore() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '12px Verdana';
  ctx.fillText(`Score ${score}`, canvas.width - 60, 15);

}

function drawBestScore() {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.font = '12px Verdana';
  ctx.fillText(`Best Score ${bestScore}`, 10, 15);
}

function checkAppleCollision() {
  if (appleX === headX && appleY === headY) {
    appleX = Math.floor(Math.random() * tileCount);
    appleY = Math.floor(Math.random() * tileCount);
    tailLength++;
    score++;

    updateSpeed(score);

    gulpSound.play();
  }
}

function updateSpeed(score) {
  if (score % 2 === 0) speed += 0.5;

  return speed;
}

function changeSnakePosition() {
  headX += velocityX;
  headY += velocityY;
}

document.addEventListener('keydown', keyDown);

function keyDown(event) {
  // Left
  if (event.keyCode === 37) {
    if (velocityX === 1) return;
    velocityY = 0;
    velocityX = -1;
  }
  // Up
  if (event.keyCode === 38) {
    if (velocityY === 1) return;
    velocityY = -1;
    velocityX = 0;
  }
  // Right
  if (event.keyCode === 39) {
    if (velocityX === -1) return;
    velocityY = 0;
    velocityX = 1;
  }
  // Down
  if (event.keyCode === 40) {
    if (velocityY === -1) return;
    velocityY = 1;
    velocityX = 0;
  }
}

function logger() {
  console.log('speed =>', speed, 1000 / speed);
  console.log('timeout =>', timeout)
  console.log('headX =>', headX)
  console.log('headY =>', headY)
  console.log('appleX =>', appleX)
  console.log('appleY =>', appleY)
  console.log('velocityX =>', velocityX)
  console.log('velocityY =>', velocityY)
  console.log('score =>', score)
  console.log('snakeParts =>', snakeParts)
}

drawGame();
