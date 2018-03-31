var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var obstacklesPassed = 0; // init
var speed = 0; // init
var groundHight = yScreenSize / 1.5; // height of the ground (note: higher Y is lower on screen, y0 is on the top)
var obstacles = []; // list where obstacles are stored
var animTime = 7; // time it takes for an animation to play
var clock = 0; // variable that increments every time draw wat executed
var breathSpeed = 25; // ticks for one breath (edited in draw)
var playerSize = yScreenSize / 10; // size of the player
var breathSize = playerSize / 10; // size of breaths
var jumpSpeed = yScreenSize / -40; // start momentum on jump
var gravity = playerSize / 100; // change of momentum during jump
var stage = 'ingame'; // stage
var maxJumps = 2; // max double jumps
var enableRegen = false; // enamble health to regen after time
var regenDelay = 500; // time it takes for regen to kick in after last hit by obstackle (if enableRegen is true)
var regenIterations = 500; // time it takes to regen (if regen is enabled)
var regenGoalHP = 50; // max HP after regen
var playerStartHealth = 100; // health of player after init
var defColors = []; // list where default Colors for objects are stored
var images = []; // list where images for onjects are stored.
var pointsOnObstacleOutOfScreen = false; // if true gives points if a obstackle reaches the end of the schreen without being hit/hiting the player
var healthBarMargin = 10;
var distanceRun = 0;
var healthBarSize = yScreenSize/20;
var deathScreenTime = 0;
var Hscore = 0;

var playedEarlier = localStorage.getItem("playedEarlier"); // checks if game was played earlier
if (playedEarlier != "yes"){
  localStorage.setItem("playedEarlier", "yes"); // set local storage to default
  localStorage.setItem("H_score", 0);
  localStorage.setItem("obstackleImg", '');
}
Hscore = localStorage.getItem("H_score"); // gets highscore from localStorage

function isPosit(x) { // returns true if x is 0 or higher
  return (x>=0);
}

function posit(x) { // returns positive number
  if (isPosit(x)) {return(x)};
  return(x*-1);
}

function distance(ob1,ob2) { // returns distances between 2 objects (objects need .x and .y properties for this to work)
  var dx = ob1.x-ob2.x;
  var dy = ob1.y-ob2.y;
  return(sqrt(dx*dx+dy*dy));
}

function collides(ob1,ob2) { // if (collides(this, otherOb)) {}    returns true if the 2 given rect objets collide. objects need .x, .y, .xSize and .ySize properties for this to work
  var dx = ob2.x-ob1.x;
  var dy = ob2.y-ob1.y;
  return((posit(dx) < (ob1.xSize/2)+(ob2.xSize/2)) && (posit(dy) < (ob1.ySize/2)+(ob2.ySize/2)));
}

function smoothChange(now, goal, iterations) { // a = smoothChange(a, 10, 10)   smoothens change of a variable
  return(now+((goal-now)/iterations));
}

function obstacle(size, y) { // obstacle object. this is what the player needs to avoid/jump on top of
  this.x = xScreenSize + size; // spawn just outside of screen
  this.y = y; // spawn at y value
  this.xSize = size; // size
  this.ySize = size;
  this.tick = function(i) { // do calculations
    this.x -= speed; // move
    if (collides(this, Player)) { // if collision with player
      // stage = 'death';
      if (Player.ySpeed > 1 && this.y > Player.y) { // player going down && lower then player == good
        Player.ySpeed = jumpSpeed/2; // player jumps slightly
        Player.jumpsDone = 0; // player can doublejump again
        obstacklesPassed += 1; // points
      } else { // obstackle hits player == bad
        Player.health -= 10; // decrease health
        Player.timeSinceLastHit = 0; // reset regen timer
      }
      obstacles.splice(i, 1); // remove myself (on any type of hit)
      return (0); // do not increment main loop and stop function
    }
    if (this.x < 0 - this.xSize) { // if out of screen
      obstacles.splice(i, 1); // delete myself
      if (pointsOnObstacleOutOfScreen) { // if can earn points
        obstacklesPassed += 1; // add to score
      }
      return (0); // do not incremetn mail loop and stop function
    }
    return (1); // do increment loop and stop function
  }
  this.render = function () {
    rectMode(CENTER); // set rect render mode
    noStroke(); // no stroke
    if (images.obstacle !== undefined) {
      imageMode(CENTER);
      image(images.obstacle, this.x,this.y,this.xSize,this.ySize);
    } else {
      fill(defColors.obstacle); // get correct color
      rect(this.x,this.y,this.xSize,this.ySize); // draw rect
    }
  }
}

// object requirements:   if an object has at leats these properties, all global functions will work correctly.
// function newObject() {
//   this.x = 0;
//   this.y = 0;
//   this.xSize = 0;
//   this.ySize = 0;
//   this.tick = function() {
//
//   }
//   this.render = function() {
//
//   }
// }

function player() {
  this.x = xScreenSize / 10; // set x just in the screen
  this.y = groundHight; // set y on ground
  this.xSize = playerSize; // set size
  this.ySize = playerSize;
  this.ySpeed = 0;  // y momentum
  this.health = playerStartHealth; // health
  this.timeSinceLastHit = 0; // health regen start timer
  this.ticksSinceGrounHit = animTime; // reset timer for landing animations
  this.onGround = true; // only false when jumpng && in air.
  this.jumpsDone = 0; // doubleJump variable
  this.jumpPressed = false; // for onkeyDown detection
  this.tick = function() { // calculations
    var goalXSize = playerSize; // temp var's for calculating the new shape of the player.
    var goalYSize = playerSize;
    breathSpeed = 50/(speed/10) // set breath anim speed
    if (clock % (breathSpeed * 2) < breathSpeed) { // set default to breath animation.
      goalXSize += breathSize; // flat
      goalYSize -= breathSize;
    } else {
      goalXSize -= breathSize; // tall
      goalYSize += breathSize;
    }
    if (this.y >= groundHight - (this.ySize / 2)) { // of on/under ground
      if (this.ySpeed > 1 && !this.onGround) { // true on the tick of landing on the ground. (moving down while toutching the ground.)
        this.ticksSinceGrounHit = 0; // reset
        this.onGround = true; // landed
        this.jumpsDone = 0; // resetDoubleJump
      }
      if (this.ticksSinceGrounHit < animTime*2) { // squish on fall down
        goalXSize = playerSize * 2; // flat
        goalYSize = playerSize / 2;
        this.y = groundHight - (this.ySize / 2) + 3; // pushed in ground to avoid jumping animation
        this.ySpeed = 0;
      } else {
        this.y = groundHight - (this.ySize / 2) + 1; // stay on ground
        this.ySpeed = 0; // reset y momentum
      }
    } else if (this.ySpeed < 0) { // moving up
      goalXSize = playerSize / 2; // flat, vertical
      goalYSize = playerSize * 2;
    }
    if ((keyIsDown(32) || keyIsDown(38) || mouseIsPressed) && (this.jumpsDone < maxJumps) && !this.jumpPressed) { // space or arrow_up
      this.jumpPressed = true; // onKeyDown detector
      this.ySpeed = jumpSpeed; // jumpspeed
      this.onGround = false; // jumped
      this.jumpsDone += 1; // doubleJump counter
    }
    if (!(keyIsDown(32) || keyIsDown(38) || mouseIsPressed)) {
      this.jumpPressed = false; // ouKeyUpdetector
    }
    if (keyIsDown(40)) { // down arrow
      goalXSize = playerSize * 2; // flat
      goalYSize = playerSize / 2;
      this.ySpeed += 5; // accelerate down
    }
    if (this.timeSinceLastHit > regenDelay && this.health < regenGoalHP && enableRegen) { // long time since last hit and can heal
      this.health = smoothChange(this.health,regenGoalHP,regenIterations); // health regen slower when near max regen health
    }
    if (this.health <= 0) {
      stage = 'death';
    }
    this.y += this.ySpeed;  // movement
    this.ySpeed += gravity; // gravity
    this.xSize = smoothChange(this.xSize, goalXSize, animTime); // change shape
    this.ySize = smoothChange(this.ySize, goalYSize, animTime);
    this.ticksSinceGrounHit += 1; // timers
    this.timeSinceLastHit += 1;
  }
  this.render = function() {
    noStroke();
    rectMode(CENTER);
    fill(defColors.player);
    rect(this.x, this.y, this.xSize, this.ySize + 1); // player
    // fill(0,0,0,0);
    // stroke(127);
    // strokeWeight(1);
    // rect(this.x, this.y, this.xSize, this.ySize); // hitbox
    rectMode(CORNER);
    fill(127,127,127,255);
    rect(healthBarMargin,healthBarMargin,((xScreenSize-(healthBarMargin*2))/100)*this.health,healthBarSize); // health bar
    textSize(healthBarSize);
    fill(200,200,200,255);
    textAlign(LEFT, BOTTOM);
    text(round(distanceRun).toString() + ' M, ' + obstacklesPassed.toString() + ' obstackles passed', healthBarMargin, healthBarMargin + healthBarSize);
  }
}

function drawSetSpeed() {
  speed = (obstacklesPassed) + 5;
  if (speed > 30) {
    speed = 30;
  }
}

function drawObstackleTick() {
  var i = 0;
  while (i < obstacles.length) {
    i += obstacles[i].tick(i);
  }
}

function drawObstackleRender() {
  for (var i = 0; i < obstacles.length; i++) {
    obstacles[i].render();
  }
}

function drawRenderGround() {
  // stroke(defColors.ground);
  // line(0, groundHight, xScreenSize, groundHight);
  fill(defColors.ground);
  noStroke();
  rectMode(CORNER);
  rect(0, groundHight, xScreenSize, groundHight);
}

function drawSpawnObstackles() {
  if (round(random(0, (100/((obstacklesPassed/50)+1)))) == 0 || obstacles.length == 0) {
    obstacles[obstacles.length] = new obstacle(playerSize, ((yScreenSize / 1.5) - playerSize/2) - (random(0,obstacklesPassed*10) % groundHight));
  }
}

function mouseClicked() {
  if (stage == 'death') {
    stage = 'gamestart';
  }
}

function keyPressed() {
  if (keyIsDown(79)) {
    console.log('link vragen');
    var newImgLink = prompt('Set the image of an enemy by using the link if an image.', 'test');
    // var newImgLink = 'C:/Users/thijs/school/coderclass/JSrunner/8f2c614788cb9e472680e99e93ae663e--donald-trump-caricature-donald-trunp.jpg';
    console.log('link ontvangen');
    loadImage(newImgLink, function(img) {
      images.obstacle = img;
      localStorage.setItem("obstackleImg", newImgLink);
      console.log('correct geladen en opgeslagen');
    }, function(img) {console.log('niet geladen');});
  }
}

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  defColors.player = color(0);
  defColors.obstacle = color(100);
  defColors.ground = color(50);
  defColors.sky = color(255);
  images.obstacle = undefined;
  loadImage(localStorage.getItem("obstackleImg"), function(img) {
    images.obstacle = img;
  });
  Player = new player();
}

function draw() {
  if (stage == 'ingame') {
    translate(0,0);
    background(defColors.sky);
    drawSetSpeed();
    Player.tick();
    drawObstackleTick();
    Player.render();
    drawObstackleRender();
    drawRenderGround();
    drawSpawnObstackles();
    distanceRun += speed/200;
  } else if (stage == 'gamestart') {
    obstacles = [];
    distanceRun = 0;
    obstacklesPassed = 0;
    Player = new player();
    stage = 'ingame';
    deathScreenTime = 0;
  } else if (stage == 'death') {
    // console.log('death');
    // alert('you died');
    if (obstacklesPassed > Hscore) {
      Hscore = obstacklesPassed;
      localStorage.setItem("H_score", Hscore);
    }
    Player.x = -playerSize*2;
    background(127,127,127,deathScreenTime/10);
    fill(255,0,0,255);
    textSize(yScreenSize/5);
    textAlign(CENTER, CENTER);
    text('You Died!',xScreenSize/2,(yScreenSize/2)-(yScreenSize/10));
    fill(0,0,0,255);
    textSize(yScreenSize/10);
    text('Score: ' + obstacklesPassed.toString() + ', High score: ' + Hscore.toString(),xScreenSize/2,(yScreenSize/2)+(yScreenSize/10))
    text('Click to continue.',xScreenSize/2,(yScreenSize/2)+(yScreenSize/4));
    speed += 0.05;
    if (speed > 30) {
      speed = 30;
    }
    deathScreenTime += 1;
  }
  clock += 1;
}
