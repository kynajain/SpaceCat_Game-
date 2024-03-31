//Aim is to make the cat hit the bricks and not fall below the paddle
let playerPaddle;
let ball;
let bricks;
let score;
let img;
let cat;
let font;

//preloading the images and fonts
function preload() {
  background_img = loadImage("space.jpg");
  cat = loadImage("cat.png");
  font = loadFont("Pixeltype.ttf");
}

function setup() {
  frameRate(144);

  createCanvas(400, 900);

  // loading the sound
  song = loadSound("background_sound.mp3", loaded);
  song.setVolume(0.5);

  let colors = createColors();

  //instance of paddle class with the paddle slighlty elevated from the end of the screen
  playerPaddle = new Paddle(height - 50);

  //instance of ball class
  ball = new Ball();

  //instance of ball class with x position
  score = new Score(width / 2);

  bricks = createBricks(colors);
}

// callback function to play the sound
function loaded() {
  song.play();
  song.loop();
}

//function to generate random colours for the bricks
function createColors() {
  const colors = [];
  for (let i = 0; i < 15; i++) {
    colors.push(color(random(0, 255), random(0, 255), random(0, 255)));
  }
  return colors;
}

//creating a 10 brick matrix with a width of 25
function createBricks(colors) {
  const bricks = [];
  const rows = 10;
  const bricksPerRow = 10;
  const brickWidth = width / bricksPerRow;
  for (let row = 0; row < rows; row++) {
    for (let i = 0; i < bricksPerRow; i++) {
      var brick = new Brick(
        createVector(brickWidth * i, 25 * row),
        brickWidth,
        25,
        colors[floor(random(0, colors.length))]
      );
      bricks.push(brick);
    }
  }
  return bricks;
}

function draw() {
  background(0);

  push();
  tint(255, 120); // reducing the opacity of the background_img
  image(background_img, 0, 0, 900, 900);
  pop();

  // calling all the functions
  playerPaddle.display();
  playerPaddle.update();

  score.display();

  ball.update();
  ball.display();
  ball.hasHitPlayer(playerPaddle);

  // to end game if the sprite has gone below the paddle
  if (ball.belowBottom()) {
    background(0);
    textSize(60);
    fill(255, 0,0);
    text('You lose! Try Again!', width / 2, height / 2);
    score.display ()
    noLoop()
    }

  len_bricks = bricks.length - 1;
  
  // deleting bricks if sprite collides with bricks
  for (let i = len_bricks; i >= 0; i--) {
    const brick = bricks[i];
    if (brick.isColliding(ball)) {
      ball.ySpeed = -ball.ySpeed; // reversing the direction of sprite movement
      bricks.splice(i, 1);
    } else {
      brick.display();
    }
  }
}

function keyPressed() {
  if (keyCode == LEFT_ARROW) {
    playerPaddle.isLeft = true;
  } else if (keyCode == RIGHT_ARROW) {
    playerPaddle.isRight = true;
  }
}

function keyReleased() {
  if (keyCode == LEFT_ARROW) {
    playerPaddle.isLeft = false;
  } else if (keyCode == RIGHT_ARROW) {
    playerPaddle.isRight = false;
  }
}

class Ball {
  constructor() {
    // r is the radius of the circle
    this.r = 10;
    this.reset();
  }

  update() {
    if (this.x < this.r || this.x > width - this.r) {
      this.xSpeed = -this.xSpeed;
    }

    if (this.y > height + this.r) {
      this.reset();
    } else if (this.y < this.r) {
      this.ySpeed = -this.ySpeed;
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;

    this.xSpeed = random(3, 4);
    this.ySpeed = random(1, 3);
  }

  display() {
    // displaying the sprite cat
    tint(255, 255);
    image(cat, this.x, this.y, this.r * 5, this.r * 5);
    tint(255, 255);
  }

  hasHitPlayer(player) {
    if (this.y - this.r <= player.y + player.height && this.y > player.y) {
      if (this.isSameHeight(player)) {
        this.ySpeed = -this.ySpeed;
        score.increment();
      }
    }
  }

  isSameHeight(player) {
    return this.x >= player.x && this.x <= player.x + player.width;
  }
  // to check if the sprite has gone below the paddle
  belowBottom() {
    return this.y - this.r > height;
  }
}

class Brick {
  constructor(location, width, height, colour) {
    this.location = location;
    this.width = width;
    this.height = height;
    this.colour = colour;
    this.points = 1;
  }

  display() {
    fill(this.colour);
    rect(this.location.x, this.location.y, this.width, this.height);
  }

  isColliding(ball) {
    if (
      ball.y - ball.r <= this.location.y + this.height &&
      ball.y + ball.r >= this.location.y &&
      ball.x + ball.r >= this.location.x &&
      ball.x - ball.r <= this.location.y + this.width
    ) {
      return true;
    }
  }
}

class Paddle {
  constructor(y) {
    this.x = length / 2;
    this.y = y;
    this.width = 80;
    this.height = 20;

    this.isLeft = false;
    this.isRight = false;
  }

  display() {
    fill(255);
    rect(this.x, this.y, this.width, this.height);
    }

  left() {
    if (this.x > 0) {
      this.x -= 3;
    }
  }

  right() {
    if (this.x < width - this.width) {
      this.x += 3;
    }
  }

  update() {
    if (this.isLeft) {
      this.left();
    } else if (this.isRight) {
      this.right();
    }
  }
}

// to calculate and display the score
class Score {
  constructor(x) {
    this.x = x;
    this.score = 0;
  }

  display() {
    textSize(30);
    textAlign(CENTER);
    textFont(font);
    fill(255, 255, 255, 250);
    text("Score:", this.x, 550 - 20);
    text(this.score, this.x, 550);
  }

  increment() {
    this.score++;
  }
}
