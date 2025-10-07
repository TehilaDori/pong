// HTML interaksjon -----------------------------------------------------------
const canvas = document.getElementById("canvas"); // GI meg et ark
const brush = canvas.getContext("2d"); // Gi meg en malekost.

const pitchImage = new Image();
pitchImage.src = "https://wallpapers.com/images/hd/hello-kitty-indie-kid-esychajk01zz6pis.jpg";

// GAME VARIABLES -------------------------------------------------------------
const MIN_SPEED = 2;
const MAX_SPEED = 4;

const MIN_BALL_RADIUS = 5;
const MAX_BALL_RADIUS = 60;

const PADDLE_PADDING = 10;
const PADDLE_WIDTH = 20;
const PADDLE_HEIGHT = 75;

const NPC_SPEED = 3;

const CENTER = canvas.width / 2;
const RIGHT_BORDER = canvas.width;
const LEFT_BORDER = 0;

let playerScore = 0;
let npcScore = 0;

let gameRunning = true;
let timeLeft = 90;

let frozenNPC = false;

const ball = {
  x: CENTER - 10,
  y: canvas.height / 2 - 10,
  radius: 10,
  color: "#480d70ff",
  speedX: 0,
  speedY: 0,
};

const paddle = {
  x: PADDLE_PADDING,
  y: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#b10d78ff",
};

const npcPaddle = {
  x: canvas.width - PADDLE_PADDING - PADDLE_WIDTH,
  y: 0,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  color: "#b10d78ff",
};

const pitch = {
  x: 0,
  y: 0,
  width: canvas.width,
  height: canvas.height,
  //image: pitchImage,
};


// GAME ENGINE ----------------------------------------------------------------
function update() {
moveBall(ball);
if (!frozenNPC){
    movePaddle(npcPaddle);
}
  keepBallOnPitch(ball);
  dealWithCollision(paddle, ball);
  dealWithCollision(npcPaddle, ball);
  draw();
  requestAnimationFrame(update);
}

function draw() {
  clearCanvas();
  drawPitch(pitch);
  drawBall(ball);
  drawPaddle(paddle);
  drawPaddle(npcPaddle);
  drawScore();
  drawTimeLeft();
  if (!gameRunning) {
    endGame();
  }
}

function init() {
  centerVerticallyItemIn(paddle, canvas);
  centerVerticallyItemIn(npcPaddle, canvas);
  giveBallRandomSpeed(ball);
  update();
}

init();

// GAME FUNCTIONS -------------------------------------------------------------

function movePaddle(paddle) {
  //paddle.y = ball.y - paddle.height * 0.5;

  let delta = ball.y - (paddle.y + paddle.height * 0.5);
  if (delta < 0) {
    paddle.y -= NPC_SPEED;
  } else {
    paddle.y += NPC_SPEED;
  }
}

function keepBallOnPitch(ball) {
  const leftBorder = ball.radius;
  const rightBorder = canvas.width - ball.radius;
  const topBorder = 0 + ball.radius;
  const bottomBorder = canvas.height - ball.radius;

  /*if (ball.x < leftBorder || ball.x > rightBorder) {
    // MÅL!!!!!!
    putBallInCenterOfPitch(ball);
    giveBallRandomSpeed(ball);
  }*/

if (ball.x < leftBorder) {
  putBallInCenterOfPitch(ball);
  giveBallRandomSpeed(ball);
  npcScore += 1;
} else if (ball.x > rightBorder) {
  putBallInCenterOfPitch(ball);
  giveBallRandomSpeed(ball);
  playerScore += 1;
}

  if (ball.y <= topBorder || ball.y >= bottomBorder) {
    ball.speedY = ball.speedY * -1;
  }
}

function putBallInCenterOfPitch(ball) {
  ball.x = (canvas.width - ball.radius * 2) * 0.5;
  ball.y = (canvas.height - ball.radius * 2) / 2;
}

function giveBallRandomSpeed(ball) {
  ball.speedX = randomNumberBetween(MAX_SPEED, MIN_SPEED);
  ball.speedY = randomNumberBetween(MAX_SPEED, MIN_SPEED);

  if (Math.random() > 0.5) {
    ball.speedX = ball.speedX * -1;
  }
  if (Math.random() > 0.5) {
    ball.speedY = ball.speedY * -1;
  }
}

function dealWithCollision(paddle, ball) {
  const paddleTop = paddle.y;
  const paddleBottom = paddle.y + paddle.height;
  let paddleBorder = paddle.x + paddle.width + ball.radius;
  let isRightSide = false;
  let isLeftSide = false;

  if (ball.x > CENTER && paddle.x > CENTER) {
    isRightSide = true;
    paddleBorder = paddle.x - ball.radius;
  } else if (ball.x < CENTER && paddle.x < CENTER) {
    isLeftSide = true;
  }

  let changeVector = false;
  if (inBounds(ball.y, paddleTop, paddleBottom)) {
    changeVector =
      (isRightSide && ball.x >= paddleBorder) ||
      (isLeftSide && ball.x <= paddleBorder);
  }

  /*if (changeVector) {
    ball.speedX = ball.speedX * -1.05;
    ball.speedY = ball.speedY * -1.05;

    console.log(ball.speedX);
  }*/

    if (changeVector) {
      if (ball.y <= paddleBottom / 5 || ball.y >= paddleBottom / 1.25) {
    ball.speedX *= -1.75;
    ball.speedY *= -1.75;
      } else if (ball.y <= paddleBottom / 2.5 || paddleBottom >= 5 / 3) {
    ball.speedX *= -1.25;
    ball.speedY *= -1.25;
      } else {
    ball.speedX *= -1.05;
    ball.speedY *= -1.05;
      }
    }
}

function moveBall(ball) {
  ball.x = ball.x + ball.speedX;
  ball.y = ball.y + ball.speedY;
}

function drawBall(ball) {
  brush.beginPath();
  brush.fillStyle = ball.color;
  brush.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
  brush.fill();
}

function drawPaddle(paddle) {
  brush.fillStyle = paddle.color;
  brush.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

function drawPitch(pitch) {
  //brush.fillStyle = pitch.color;
  brush.drawImage(pitchImage, pitch.x, pitch.y, pitch.width, pitch.height);

  brush.fillStyle = "white";
  brush.fillRect(pitch.width * 0.5, 0, 4, pitch.height);
}

function drawScore() {
  brush.font = "50px serif";
  brush.fillStyle = "#b10d78ff";
  brush.fillText(playerScore, CENTER - CENTER / 2, 50);
  brush.fillText(npcScore, CENTER + CENTER / 2, 50);
}

function drawTimeLeft() {
  brush.font = "20px serif";
  brush.fillStyle = "white";
  brush.fillText("Time: " + timeLeft + " s", canvas.width - 90, 25);
}

function drawEndGame() {
  brush.font = "100px serif";
  brush.fillStyle = "#b10d78ff";
  brush.fillText("GAME OVER", canvas.width / 21, 200);
  if (playerScore > npcScore){
    brush.font = "80px serif";
  brush.fillText("YOU WIN!!!!", canvas.width / 6, 300);
  } else if (playerScore == npcScore){
    brush.font = "50px serif";
  brush.fillText("just as good as a computer!", canvas.width / 12, 300);
  } else {
    brush.font = "20px serif";
    brush.fillStyle = "pink";
  brush.fillText("loser", 10, canvas.height - 20)
  }
}

function countdown() {
if (timeLeft > 0 ) {
  timeLeft -= 1;
} else {
  gameRunning = false;
}
}

setInterval(countdown, 1000);

function endGame() {
  drawEndGame()
  ball.speedX = 0;
  ball.speedY = 0;
  NPC_SPEED = 0;
}

// UTILITY FUNCTIONS ----------------------------------------------------------

canvas.addEventListener("mousemove", onMouseMove);

document.addEventListener("keydown", cheatKeys);

function onMouseMove(event) {
  paddle.y = event.offsetY;
}

function cheatKeys(event){
  if (event.key === "L" || event.key === "l"){
   frozenNPC = true;
   setTimeout(() => {
    frozenNPC = false;
  }, 2000);
  } else if (event.key === "C" || event.key === "c"){
    paddle.y = ball.y - paddle.height * 0.5;
  } else if (event.key === "+"){
    if (ball.radius < MAX_BALL_RADIUS){
      ball.radius += 5;
    }
  } else if (event.key === "-"){
    if (ball.radius > MIN_BALL_RADIUS){
       ball.radius -= 5;
    }
  }
}

function randomNumberBetween(max, min) {
  return Math.round(Math.random() * (max - min)) + min;
}

function centerVerticallyItemIn(item, target) {
  item.y = target.height * 0.5 - item.height * 0.5;
}

function clearCanvas() {
  brush.clearRect(0, 0, canvas.width, canvas.height);
}

function inBounds(value, min, max) {
  return value >= min && value <= max;
}
