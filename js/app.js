var canvas;
var ctx;
var bounds;
var requestAnimationFrame;

var mouseXPos;
var mouseYPos;

var startButton;
var isMouseDown = false;
var hasStarted = false;


var enemies = [];
var circles = [];
var player;

var speed = {x: -2, y: 1.5};
var time = 0;

window.onload = function() {
requestAnimationFrame = window.requestAnimationFrame || 
                        window.mozRequestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.msRequestAnimationFrame;

canvas = document.getElementById('myCanvas');
ctx = canvas.getContext("2d"); //get reference to the drawing context
bounds = canvas.getBoundingClientRect(); //get reference to bounds
startButton = document.getElementById("startButton");
timer = document.getElementById("timer");
//creates mouse input listeners
document.addEventListener("mousemove", mouseMoveFunction, false);
document.addEventListener("mousedown", mouseDownFunction, false);
document.addEventListener("mouseup", mouseUpFunction, false);

startButton.addEventListener("click", startButtonFunction, false);

player = new Player();

setInterval(evaluator, 1000 / 60);
};

function startButtonFunction(event) {
  event.preventDefault();

  if(hasStarted === false) {
    hasStarted = true;
    var aud = document.getElementById("song");
    aud.load();
    aud.play();
    aud.volume = 0.5; 

    rules.style.display = "none";
    gg.innerHTML = "";


    enemies = [];
    player.userPiece = [];
    
    player.position.x = mouseXPos;
    player.position.y = mouseYPos;

    time = new Date().getTime();
  }
}

function mouseMoveFunction(event) {
  mouseXPos = event.clientX - bounds.left;
  mouseYPos = event.clientY - bounds.top;
}

function mouseDownFunction(event) {
  isMouseDown = true;
  console.log(mouseXPos, mouseYPos);
}

function mouseUpFunction(event) {
  isMouseDown = false;
}

function gameOver() {
  hasStarted = false;
  rules.style.display="block";
  gg.innerHTML = "Game Over!!";
}

function evaluator() {
  
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  var i;
  
  if(hasStarted) {

    //This adjusts the delay of the mouse. Increasing the multipler will decrease delay.
    player.position.x += (mouseXPos - player.position.x) * 0.5;
    player.position.y += (mouseYPos - player.position.y) * 0.5;

    player.userPiece.push(new Coordinates(player.position.x, player.position.y));

    //draws the tail
    ctx.beginPath();
    ctx.strokeStyle = "darkgrey";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgb(255, 255, 255)';

    for(i=0; i<player.userPiece.length; i++) {
      circle = player.userPiece[i];
      ctx.lineTo(circle.position.x, circle.position.y);
      circle.position.x += speed.x;
      circle.position.y += speed.y;
    }

    ctx.stroke();
    ctx.closePath();
  
    //Ensures that the length of the array never exceeds 35
    if(player.userPiece.length > 50) {
      player.userPiece.shift();
    }
    
    //draws the head
    ctx.beginPath();
    ctx.fillStyle = "darkgrey";
    ctx.arc(player.position.x, player.position.y, 5, 0, Math.PI*2, true);
    ctx.fill();

  }

  //Player loses if he leaves the bounds of the screen
  if(hasStarted && (player.position.x < 0 || player.position.y < 0 ||
                    player.position.x > canvas.width || player.position.y > canvas.height)) {
    gameOver();
  }



  //Creates enemies
  for(i=0; i < enemies.length; i++) {
    circle = enemies[i];

    //Checks for collisions
    // if(hasStarted) {
    //   if(circle.distanceTo(player.position) < (player.size + circle.size)/2) {
    //      gameOver();
    //   }
    // }

    //Enemy movement
    ctx.beginPath();
    ctx.fillStyle = "#7DCDE8";
    ctx.shadowBlur = 10;
    ctx.shadowColor = 'rgb(255, 255, 255)';
    ctx.arc(circle.position.x, circle.position.y, circle.size/2, 0, Math.PI*2, true);
    ctx.fill();

    circle.position.x += speed.x * circle.movement;
    circle.position.y += speed.y * circle.movement;

    if(circle.position.x < 0 || circle.position.y > canvas.height) {
      enemies.splice(i, 1);
      i--;
    } 
  }

  //Continues to generate enemies as they leave canvas
  if(enemies.length < 40) {
    enemies.push(randomizeCircle(new Enemy()));
  }

  if(hasStarted) {
    counter = "Time: <span>" + Math.floor(((new Date().getTime() - time) / 1000 ) * 100) / 100 + "</span>";
    timer.innerHTML = counter;
  }
}


//Generates a position for new enemies
function randomizeCircle(circle) {
  if(Math.random() > 0.5) {
    circle.position.x = Math.random() * canvas.width;
    circle.position.y = -20;
  } else {
    circle.position.x = canvas.width + 20;
    circle.position.y = (-canvas.height *0.2) + (Math.random() * canvas.height * 1.5);
  }

  return circle;
}

//Keeps track of current positions
function Coordinates(x, y) {
  this.position = {x: x, y: y};
}

//calculate distance between points
Coordinates.prototype.distanceTo = function(circle) {
  var distX = circle.x-this.position.x;
  var distY = circle.y=this.position.y;
  return Math.sqrt(distX^2 + distY^2);
};

//player attributes
function Player() {
  this.position = {x: 0, y: 0};
  this.size = 8;
  this.userPiece = [];
}
Player.prototype = new Coordinates();

//enemy attributes
function Enemy() {
  this.position = {x: 0, y: 0};
  this.size = 6 + (Math.random() * 5);
  this.movement = 1 + (Math.random() * 0.5);
}
Enemy.prototype = new Coordinates();




//if game has started (mousedown/mousemove) --check boolean
//keep track of mouse position
//generate circles and animate circles

//draw mouse movement using sin/cos curves (quadraticCurveTo)
//instead of draw and clear to animate, establish a path using mouse position
//and append position into an array that creates a line of set length
    //create new array to store position of mouse
    //for loop to iterate through position array
    //if length of array gets too high, "shift" to pop off first index
    //this will create a short line segment without having to animate
    //functions beginPath, stroke, closePath to initiate sequence of drawing line
    //use arc, fill to color the line and give it a flowing movement


//if mouse goes off canvas, game over
    //coordinates for canvas are 0,0
    //if mouse has negative coordinate == game over





//if mouse position == enemy position, game over






















// //circle constructor
// function Circle(radius, speed, width, xPos, yPos) {
//   this.radius = radius;
//   this.speed = speed;
//   this.width = width;
//   this.xPos = xPos;
//   this.yPos = yPos;

//   this.counter = 0;

//   var signHelper = Math.random();

//   if(signHelper > 0.5) {
//     this.sign = -1;
//   } else {
//     this.sign = 1;
//   }
// }

// //circle object methods
// Circle.prototype.update = function() {
//   this.counter += this.sign * this.speed;
//   ctx.beginPath();
//   ctx.arc(this.xPos + Math.cos(this.counter / 100) * this.radius,
//           this.yPos + Math.sin(this.counter / 100) * this.radius,
//           this.width,
//           0,
//           Math.PI * 2,
//           false);
//   ctx.closePath();
//   ctx.fillStyle = 'rgb(0, 0, 0)';
//   ctx.fill();
// };


//makes the circles
// function createCircles() {
//   for (var i=0; i<200; i++) {
//     var randomX = Math.round(-200 + Math.random() * 1000);
//     var randomY = Math.round(-200 + Math.random() * 800);
//     var speed = 0.2 + Math.random() * 3;
//     var size = 5;

//     var circle = new Circle(100, speed, size, randomX, randomY);
//     circles.push(circle);
//   }
//   draw();
// }
// createCircles();

// function draw() {
//   ctx.clearRect(0, 0, 800, 600); //overwrites pointer
//   for(var i=0; i<circles.length; i++) {
//     var myCircle = circles[i];
//     myCircle.update();
//   }
//   requestAnimationFrame(draw);
// }