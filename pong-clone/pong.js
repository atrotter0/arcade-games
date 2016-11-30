
/* * * * * * * * * * * * * * */
/*                           */
/*        Pong Clone         */
/*                           */
/* * * * * * * * * * * * * * */


//control canvas, ball, and speed
var canvas; //handle dimensions
var canvasContext; //draw images
var pongBallX = 50; //movement
var pongBallY = 50; //movement
var pongBallXSpeed = 10; //acceleration
var pongBallYSpeed = 4; //acceleration

//score controls
var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

//player paddles
var paddle1Y = 250; //starting position
var paddle2Y = 250; //starting position
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;

//follow mouse position
function calculateMousePos(evt) {
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = evt.clientX - rect.left - root.scrollLeft;
  var mouseY = evt.clientY - rect.top - root.scrollTop;
  return {
    x:mouseX,
    y:mouseY
  };
}

//mouse click resets win screen
function handleMouseClick() {
  if(showingWinScreen) {
    player1Score = 0;
    player2Score = 0;
    showingWinScreen = false;
  }
}

//start game once page loads
window.onload = function() {
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');

  var framesPerSecond = 30;
  setInterval(function() {
    moveEverything();
    drawEverything();
  }, 1000/framesPerSecond); //motion every second

  canvas.addEventListener('mousedown', handleMouseClick);

  //event listener for mouse position
  canvas.addEventListener('mousemove', 
    function(evt) {
      var mousePos = calculateMousePos(evt);
      paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
  });
}

//reset balls position, and move ball randomly
function ballReset() {
  if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE) {
    showingWinScreen = true;
  } 

  pongBallXSpeed = -pongBallXSpeed;
  pongBallX = canvas.width / 2;
  pongBallY = canvas.height / 2;
}

//AI controls
function computerMovement() {
  var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
  if(paddle2YCenter < pongBallY - 35) {
    paddle2Y += 6;
  } else if (paddle2YCenter > pongBallY + 35) {
    paddle2Y -= 6;
  }
}

//animate the game
function moveEverything() {
  computerMovement();

  pongBallX += pongBallXSpeed; //movement + speed
  pongBallY += pongBallYSpeed; //movement + speed

  //check to see if ball touches left side
  if(pongBallX < 0) {

    //if ball touches left paddle, reflect ball, else reset ball
    if(pongBallY > paddle1Y && pongBallY < paddle1Y + PADDLE_HEIGHT) {
      pongBallXSpeed = -pongBallXSpeed;

      //adjust ball movement & speed based on angle of paddle hit
      var deltaY = pongBallY - (paddle1Y + PADDLE_HEIGHT / 2);
      pongBallYSpeed = deltaY * 0.35;
    } else {
      player2Score++; //keep before ballReset
      ballReset();
    }
  }

  //check to see if ball touches right side
  if(pongBallX > canvas.width) {

    //if ball touches right paddle, reflect ball, else reset ball
    if(pongBallY > paddle2Y && pongBallY < paddle2Y + PADDLE_HEIGHT) {
      pongBallXSpeed = -pongBallXSpeed;
    } else {
      player1Score++; //keep before ballReset
      ballReset();
    }
  }

  //bounce ball if it touches top or bottom of canvas
  if(pongBallY > canvas.height || pongBallY < 0) {
    pongBallYSpeed = -pongBallYSpeed; //maintain speed
  }
}

//method for drawing objects
function colorRect(leftX, topY, width, height, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.fillRect(leftX, topY, width, height);  
}

//draw our net
function drawNet() {
  for(var i = 0; i < canvas.height; i += 40) {
    colorRect(canvas.width / 2 - 1, i, 2, 20, 'white');
  }
}

//draw our graphics on page
function drawEverything() {

  //next line covers the canvas with black background
  colorRect(0, 0, canvas.width, canvas.height, 'black');

  //check to see if a player has won
  if(showingWinScreen) {
    canvasContext.fillStyle = 'white';
    
    if(player1Score >= WINNING_SCORE) {
      canvasContext.fillText("P1 WINS!", 392, 200);
    } else if (player2Score >= WINNING_SCORE) {
      canvasContext.fillText("P2 WINS!", 392, 200);
    } 
    
    canvasContext.fillText("Click to continue", 380, 250)
    return;
  }

  //create our net
  drawNet();

  //left player paddle
  colorRect(1, paddle1Y, PADDLE_WIDTH, 100, 'white');

  //right AI paddle
  colorRect(canvas.width - 1 - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, 100, 'white');

  //draw ball
  colorCircle(pongBallX, pongBallY, 10, 'red');

  //draw scores
  canvasContext.fillText("P1", 250, 30);
  canvasContext.fillText(player1Score, 250, 50);
  canvasContext.fillText("P2", canvas.width - 250, 30);
  canvasContext.fillText(player2Score, canvas.width - 250, 50);
}

//draw pong ball
function colorCircle(centerX, centerY, radius, drawColor) {
  canvasContext.fillStyle = drawColor;
  canvasContext.beginPath();
  canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true)
  canvasContext.fill();
}
