var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var stage = 0; // 0 = ingame
var walls = []; // lsit with all wall objects
var aBullets = []; // list with all bullet objects
var player_img; // image of player
var barricade_img; // image for wall
var enemy_img; // image for enemy
var bullet_img;
var aantal_muren = 30; // aantal muren in het begin
var a = 0; // loop counter
var b = 0;
var c = 0;
var dx = 0; // disnatce X and Y used in many onjects in hitboxing
var dy = 0;
var reload = 0; // reload variable, if <= 0 player can fire
var cameraX = 0; // cameraX and Y, X and Y position of camera.
var cameraY = 0;
var i; // loop variable
var amount_of_walls_deleted = 50;
var enemies = [];
var randint;
var enemyHP = 4;
var kills = 0;
var playerMaxHP = 100;
var score = 0;
var Hscore = 0;
var difficulty = 1;
var particles = [];
var explosionSound = new Audio('music/Explosion.mp3');
// explosionSound.play();
// this.explosionSound = new Audio('music/Explosion.mp3');
// this.explosionSound.play();
var lazerSound = new Audio('music/LAZER.mp3');
// lazerSound.play();
// this.lazerSound = new Audio('music/LAZER.mp3');
// this.lazerSound.play();
var tickRate = 50;
var moveSpeed = 1;// *moveSpeed
var allObjects = [[],[],[],[]]; // [walls,bullets,enemies,particles]


function posit(a) { // returns positive version of a (simply remove the - symbol)
  return(sqrt(a*a));
}

function isPosit(a) { // returns true if a is positive (>=0)
  return(a >= 0);
}

var SGeerder = localStorage.getItem("SGeerder"); // checks if game was played earlier
if (SGeerder != "ja"){
  localStorage.setItem("SGeerder", "ja"); // set local storage to default
  localStorage.setItem("SGH_score", 0);
}
Hscore = localStorage.getItem("SGH_score"); // gets highscore from localStorage

function Onscreen(object, mySize) {
  return(object.xPos-cameraX > mySize*-1 && object.xPos-cameraX < xScreenSize+mySize && object.yPos-cameraY > mySize*-1 && object.yPos-cameraY < yScreenSize + mySize);
}
// if (Onscreen(this, 10)) {}

function setTickRate(newTickRate) {
  tickRate = newTickRate;
  moveSpeed = 50/newTickRate;
}

function setup() { // p5 setup
  // create random walls
  for (j = 0; j < aantal_muren; j++){
    allObjects[0][allObjects[0].length] = new wall(random(0 - xScreenSize/2, xScreenSize-20), random(0 - yScreenSize/2, yScreenSize-20), 20);
  }
  createCanvas(xScreenSize, yScreenSize);
  player_img = loadImage("images/pon.png");
  barricade5 = loadImage("images/barecade/barriecade round.png");
  barricade4 = loadImage("images/barecade/barriecade round (1).png");
  barricade3 = loadImage("images/barecade/barriecade round (2).png");
  barricade2 = loadImage("images/barecade/barriecade round (3).png");
  barricade1 = loadImage("images/barecade/barriecade round (4).png");
  enemy_img = loadImage("images/enemy.png");
  angleMode(RADIANS); // Change the mode to RADIANS for Math.sin() and Math.cos() witch use radians.
}

function ticksPassed(oldDate) {
  if ((new Date().getTime() - oldDate)/1000*tickRate < 10) { // no lag detection
    return((new Date().getTime() - oldDate)/1000*tickRate);
  }
  return(1); // in extreme lag situations
}

// this.oldDate = new Date().getTime();
// *ticksPassed(this.oldDate)

function soundLoud(thisob) { // returns the loudness of sounds
  this.dx = thisob.xPos - Player.xPos;
  this.dy = thisob.yPos - Player.yPos;
  this.distance = sqrt((dx*dx)+(dy*dy));
  if (this.distance <= 2000) {
    return(((this.distance*-1)+2000)/2000);
  }
  return(false);
}

function create_walls(){
  i = 0;
  while (i < allObjects[0].length) { // deletes old walls and counts the deleted walss
    if ((allObjects[0][i].xPos - cameraX <= -xScreenSize*2) || (allObjects[0][i].xPos - cameraX >= xScreenSize + xScreenSize*2) || (allObjects[0][i].yPos - cameraY <= -yScreenSize*2) || (allObjects[0][i].yPos - cameraY >= yScreenSize + yScreenSize*2)){
      amount_of_walls_deleted += 1;
      allObjects[0].splice(i, 1);
      i -= 1;
    }
    if (amount_of_walls_deleted >= 5) { // if 5 walls where deleted, make a new wall
//      console.log(amount_of_walls_deleted);
      randint = Math.floor(random(0,359));
      this.newX = Math.sin(randint) * 1000 + Player.xPos; // set new x and y
      this.newY = Math.cos(randint) * 1000 + Player.yPos;
      this.newDirection = Math.floor(random(0, 2));
      b = 0;
      if (newDirection == 0) { // chose direction
        while (b < 5) {
          allObjects[0][allObjects[0].length] = new wall(this.newX + (b*20), this.newY, 20); // create walls
          b += 1;
        }
      } else {
        while (b < 5) {
          allObjects[0][allObjects[0].length] = new wall(this.newX, this.newY + (b*20), 20); // create walls
          b += 1;
        }
      }
      amount_of_walls_deleted -= 5;
    }
    i += 1;
  }
}

function distanceTo(object1, object2) {
  this.x1 = object1.xPos;
  this.x2 = object2.xPos;
  this.y1 = object1.yPos;
  this.y2 = object2.yPos;
  this.dx = this.x2-this.x1;
  this.dy = this.y2-this.y1;
  return(sqrt((dx*dx)+(dy*dy)));
}

// distanceTo(this, otherObject)

function wallHitbox(object, mySize, damage, canBeMoved) {
  this.loopvar = 0;
  this.object = object;
  this.mySize = mySize;
  this.damage = damage;
  this.hasCollided = false;
  while (this.loopvar < allObjects[0].length) {
    if (distanceTo(this.object, allObjects[0][this.loopvar]) < this.mySize + allObjects[0][this.loopvar].mySize/2) {
      if (canBeMoved) {
        this.direction = Math.atan2(this.object.xPos - allObjects[0][this.loopvar].xPos, this.object.yPos - allObjects[0][this.loopvar].yPos);
        this.object.xPos += Math.sin(this.direction) * ((distanceTo(this.object, allObjects[0][this.loopvar])-(this.mySize + allObjects[0][this.loopvar].mySize/2))*-1);
        this.object.yPos += Math.cos(this.direction) * ((distanceTo(this.object, allObjects[0][this.loopvar])-(this.mySize + allObjects[0][this.loopvar].mySize/2))*-1);
        this.object.xSpeed = this.object.xSpeed/2;
        this.object.ySpeed = this.object.ySpeed/2;
      }
      this.hasCollided = true;
      allObjects[0][this.loopvar].health -= this.damage;
      this.b = 0;
      while (this.b < this.damage) {
        allObjects[3][allObjects[3].length] = new particle(allObjects[0][this.loopvar].xPos,allObjects[0][this.loopvar].yPos,random(-2,2),random(-2,2),[0,255,0],10);
        this.b += 1;
      }
    }
    this.loopvar += 1;
  }
  return(hasCollided);
}

//wallHitbox(this, 10, 0, true);

function wall(X,Y,mySize) {
  this.xPos = X;
  this.yPos = Y;
  this.mySize = mySize;
  this.health = 5;
  this.tick = function() {
    if (this.health <= 0) {
      a -= 1;
      allObjects[0].splice(allObjects[0].indexOf(this), 1);
    }
  }
  // render
  this.render = function() {
    if (Onscreen(this, this.mySize)) {
      if (Math.ceil(this.health) >= 5) {
        image(barricade5, this.xPos - (mySize/2) - cameraX, this.yPos - (mySize/2) - cameraY, this.mySize, this.mySize);
      } else if (Math.ceil(this.health) >= 4) {
        image(barricade4, this.xPos - (mySize/2) - cameraX, this.yPos - (mySize/2) - cameraY, this.mySize, this.mySize);
      } else if (Math.ceil(this.health) >= 3) {
        image(barricade3, this.xPos - (mySize/2) - cameraX, this.yPos - (mySize/2) - cameraY, this.mySize, this.mySize);
      } else if (Math.ceil(this.health) >= 2) {
        image(barricade2, this.xPos - (mySize/2) - cameraX, this.yPos - (mySize/2) - cameraY, this.mySize, this.mySize);
      } else if (Math.ceil(this.health) >= 1) {
        image(barricade1, this.xPos - (mySize/2) - cameraX, this.yPos - (mySize/2) - cameraY, this.mySize, this.mySize);
      } // if health is 0, wall will not be renderd
    }
  }
}

function particle(xp,yp,xs,ys,col,siz) {
  this.oldDate = new Date().getTime();
  this.xPos = xp;
  this.yPos = yp;
  this.xSpeed = xs;
  this.ySpeed = ys;
  this.color = col;
  this.mySize = siz;
  this.oldGameTime = new Date().getTime();
  this.tick = function() {
    this.mySize -= 0.1;
    if (this.mySize <= 0) {
      allObjects[3].splice(allObjects[3].indexOf(this), 1);
      a -= 1;
    }
  }
  this.render = function() {
    this.xPos += this.xSpeed*ticksPassed(this.oldGameTime)*moveSpeed;
    this.yPos += this.ySpeed*ticksPassed(this.oldGameTime)*moveSpeed;
    this.oldGameTime = new Date().getTime();
    if (Onscreen(this, this.mySize)) {
      fill(this.color);
      ellipse(this.xPos - cameraX,this.yPos - cameraY,this.mySize,this.mySize);
// ellipse(this.xPos - cameraX - (xScreenSize/2),this.yPos - cameraY - (yScreenSize/2),round(this.mySize),round(this.mySize)); suddenly stopped working?????
    }
  }
}

function bullet(X,Y,XS,YS,Damage,COL,aType) {
  this.xPos = X;
  this.yPos = Y;
  this.xSpeed = XS;
  this.ySpeed = YS;
  this.Dam = Damage;
  this.color = COL;
  this.type = aType
  this.explosionSound = new Audio('music/Explosion.mp3');
  this.lazerSound = new Audio('music/LAZER.mp3');
  this.oldGameTime = new Date().getTime();
  if (soundLoud(this)) {
   lazerSound.volume = soundLoud(this); // sets volume variable correct, but sound.play(); does not react to the volume?
   this.lazerSound.play();
  }
  this.tick = function() {
    // hitbox walls
    if (wallHitbox(this, this.Dam*2.5, 1, false)) { // calling wallhitbox also does the nowmal hitbox stuff.
      this.Dam += -5;
    }
    if (this.xPos - cameraX > xScreenSize + xScreenSize || this.xPos - cameraX < 0 - xScreenSize || this.yPos - cameraY > yScreenSize + yScreenSize || this.yPos - cameraY < 0 - yScreenSize || this.Dam <= 0){
      allObjects[1].splice(allObjects[1].indexOf(this), 1);
      a -= 1;
    }
  }
  //render
  this.render = function() {
    // move
    this.xPos += this.xSpeed*ticksPassed(this.oldGameTime)*moveSpeed;
    this.yPos += this.ySpeed*ticksPassed(this.oldGameTime)*moveSpeed;
    this.oldGameTime = new Date().getTime();
    if (Onscreen(this, this.Dam*2.5)) {
      fill(this.color);
      ellipse(this.xPos - cameraX,this.yPos - cameraY,this.Dam * 5,this.Dam * 5);
    }
  }
}

function enemy(X, Y, HP, REL) {
  this.xPos = X;
  this.yPos = Y;
  this.health = HP;
  this.reload = REL;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.goalXSpeed = 0;
  this.goalYSpeed = 0;
  this.mySize = 60;
  this.oldGameTime = new Date().getTime();
  this.tick = function() {
    this.goalXSpeed = 0;
    this.goalYSpeed = 0;
    if (distanceTo(this, Player) > 200) { // if far from player:
      this.goalXSpeed += Math.sin(Math.atan2(dx,dy)) * 1; // go to player
      this.goalYSpeed += Math.cos(Math.atan2(dx,dy)) * 1;
    } else {                            // esle:
      this.goalXSpeed += Math.sin(Math.atan2(dx,dy)+(Math.PI/2)) * 1; // circle around player
      this.goalYSpeed += Math.cos(Math.atan2(dx,dy)+(Math.PI/2)) * 1;
    }
    wallHitbox(this, this.mySize/2, 0, true); // wall hitbox
    this.b = 0;
    while (this.b < allObjects[2].length) {
      if (allObjects[2] != this) {
        this.direction = Math.atan2(this.xPos - allObjects[0][this.loopvar].xPos, this.yPos - allObjects[0][this.loopvar].yPos);
        this.object.xPos += Math.sin(this.direction) * ((distanceTo(this.object, allObjects[0][this.loopvar])-(this.mySize + allObjects[0][this.loopvar].mySize/2))*-1);
        this.object.yPos += Math.cos(this.direction) * ((distanceTo(this.object, allObjects[0][this.loopvar])-(this.mySize + allObjects[0][this.loopvar].mySize/2))*-1);
        this.object.xSpeed = this.object.xSpeed/2;
        this.object.ySpeed = this.object.ySpeed/2;
      }
    }
    this.b = 0; // setup for go away from closest wall
    this.distanceToWall = 100; //max distance from wall
    this.closestWall = false;  // true if any wall is the closest
    while (this.b < allObjects[0].length) {
      if (distanceTo(this, allObjects[0][this.b]) < this.distanceToWall) { // check if this wall is closest
        this.closestWall = this.b; // remember new id
        this.distanceToWall = distanceTo(this, allObjects[0][this.b]); // save distance
      }
      this.b += 1;
    }
    if (this.closestWall !== false) { // if any wall found
      dx = allObjects[0][this.closestWall].xPos - this.xPos; // calc distance
      dy = allObjects[0][this.closestWall].yPos - this.yPos;
      this.goalXSpeed += Math.sin(Math.atan2(dx,dy)+(Math.PI/2)) * 1; // move away from wall
      this.goalXSpeed += Math.cos(Math.atan2(dx,dy)+(Math.PI/2)) * 1;
    }
    if (this.reload <= 0) {
      allObjects[1][allObjects[1].length] = new bullet((Math.sin(Math.atan2(Player.xPos - this.xPos, Player.yPos - this.yPos)) * (this.mySize/2 + 10)) + this.xPos, (Math.cos(Math.atan2(Player.xPos - this.xPos, Player.yPos - this.yPos)) * (this.mySize/2 + 10)) + this.yPos, Math.sin(Math.atan2(Player.xPos - this.xPos, Player.yPos - this.yPos)) * 20, Math.cos(Math.atan2(Player.xPos - this.xPos, Player.yPos - this.yPos)) * 20, 2, [255, 255, 0], 'enemy');
      this.reload = 50/moveSpeed;
    }
    b = 0;
    while (b < allObjects[1].length) {
      dx = allObjects[1][b].xPos - this.xPos;
      dy = allObjects[1][b].yPos - this.yPos;
      if (sqrt((dx*dx)+(dy*dy)) < ((allObjects[1][b].Dam*10) + this.mySize/2) && allObjects[1][b].type != 'enemy') {
        this.health -= 1;
        allObjects[3][allObjects[3].length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,255,255],5);
        if (this.health <= 0) {
          var j = 0;
          while (j < 10) {
            allObjects[3][allObjects[3].length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,255,255],10);
            j += 1;
          }
          kills += 1;
          score += 50;
          difficulty += 0.1;
          allObjects[2].splice(allObjects[2].indexOf(this), 1);
          a -= 1;
        }
      }
      b += 1;
    }
    this.goalDirection = Math.atan2(this.goalXSpeed/1000,this.goalYSpeed/1000);
    this.xSpeed += Math.sin(this.goalDirection);
    this.ySpeed += Math.cos(this.goalDirection);
    this.xSpeed = this.xSpeed / 1.2; // slow down
    this.ySpeed = this.ySpeed / 1.2;
    this.reload -= 1;
  }
  this.render = function() {
    // move
    this.xPos += this.xSpeed*ticksPassed(this.oldGameTime)*moveSpeed;
    this.yPos += this.ySpeed*ticksPassed(this.oldGameTime)*moveSpeed;
    this.oldGameTime = new Date().getTime();
    if (Onscreen(this, 30)) {
      image(enemy_img, (this.xPos - cameraX) - 30, (this.yPos - cameraY) - 30, 60, 60);
    }
  }
}

allObjects[2] = [new enemy(0,0,enemyHP,50)];

function summonEnemies() {
  while (Math.floor(difficulty) > allObjects[2].length) {
    randint = Math.floor(random(0,359));
    allObjects[2][allObjects[2].length] = new enemy(Math.sin(randint) * 1000 + Player.xPos,Math.cos(randint) * 2000 + Player.yPos,enemyHP,50);
    c -= 1;
  }
}

function restart() {
  gameTickCount = 0;
  explosionSound.volume = 1;
  explosionSound.play();
  alert("you lost");
  localStorage.setItem("SGH_score", Hscore);
  allObjects[0] = []; // lsit with all wall objects
  allObjects[1] = []; // list with all bullet objects
  reload = 0; // reload variable, if <= 0 player can fire
  amount_of_walls_deleted = 50;
  allObjects[2] = [new enemy(0,0,enemyHP,50)];
  kills = 0;
  score = 0;
  Player = new player();
  difficulty = 1;
  for (j = 0; j < aantal_muren; j++){
    allObjects[0][allObjects[0].length] = new wall(random(0 - xScreenSize/2, xScreenSize-20), random(0 - yScreenSize/2, yScreenSize-20), 20);
  }
  stage = 1;
}

function player() {
  this.xPos = 100;
  this.yPos = 100;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.rot = 0;
  this.health = playerMaxHP;
  this.lastHitTime = 0;
  this.reload = 0;
  this.speed = 0.5;
  this.reloadTime = 50;
  this.inventorySlotCount = 1;
  this.inventoryCount = [0];
  this.inventoryType = [''];
  this.oldGameTime = new Date().getTime();
  // controls
  this.controls = function() {
    this.rot = atan2((mouseX - (xScreenSize / 2)) * -1,(mouseY - (yScreenSize / 2)) * -1) * -1;
    if (keyIsDown(65)) { //a
        this.xSpeed -= this.speed;
    }
    if (keyIsDown(68)) { //d
      this.xSpeed += this.speed;
    }
    if (keyIsDown(87)) { //w
      this.ySpeed -= this.speed;
    }
    if (keyIsDown(83)) { //s
      this.ySpeed += this.speed;
    }
    if (keyIsDown(27)) {
      stage = 1;
      background(0,0,25,200);
    }
    //hitboxing walls
    wallHitbox(this, 35, 0, true);
    b = 0;
    while (b < allObjects[1].length) {
      dx = allObjects[1][b].xPos - this.xPos;
      dy = allObjects[1][b].yPos - this.yPos;
      if (sqrt((dx*dx)+(dy*dy)) < ((70/2) + (allObjects[1][b].Dam * 2.5)) && allObjects[1][b].type != 'player') {
        allObjects[1][b].Dam -= 1;
        this.health -= 1;
        this.lastHitTime = 500;
        allObjects[3][allObjects[3].length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,128,0],10);
      }
      b += 1;
    }
    if (this.health <= 0) {
      restart();
      var j = 0;
      while (j < 10) {
        allObjects[3][allObjects[3].length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,128,0],15);
        j += 1;
      }
      var j = 0;
      while (j < 10) {
        allObjects[3][allObjects[3].length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,0,0],15);
        j += 1;
      }
    }
    if (this.lastHitTime <= 0 && this.health < playerMaxHP) {
      this.health += 0.25;
    }
    if (score > Hscore) {
      Hscore = score;
    }
    if (gameTickCount%5 == 0) {
      allObjects[3][allObjects[3].length] = new particle(Player.xPos + (Math.sin(Player.rot + Math.PI) * 30),Player.yPos + (Math.cos(Player.rot + Math.PI) * -30),random(-0.5,0.5),random(-0.5,0.5),[128,128,255],5);
    }
    this.lastHitTime -= 1;
    this.reload += -1;
    this.xSpeed = this.xSpeed * 0.95; // slow down slightly
    this.ySpeed = this.ySpeed * 0.95;
  }
  // hitboxing bullets
  // hitboxing enemys
  // render
  this.render = function() {
    translate(this.xPos - cameraX,this.yPos - cameraY); // rotation
    push(); // rotation
    rotate(this.rot); // rotation
    rectMode(CENTER); // image
    image(player_img, -37.5, -37.5, 75, 75); // image
    pop(); // rotation
    rectMode(CORNER);
    fill(255,0,0,128);
    rect(xScreenSize/-2 + 10,yScreenSize/-2 + 10,((xScreenSize-20)/playerMaxHP)*Player.health,yScreenSize/75,20);
    fill(0,255,0,128);
    rect(xScreenSize/-2 + 10,yScreenSize/-2 + 20 + (yScreenSize/75),((xScreenSize-20)/Hscore)*score,yScreenSize/75,20);
    textSize(32);
    textAlign(LEFT);
    text('Score:' + score.toString() + ' / Highscore:' + Hscore.toString(),xScreenSize/-2 + 10,yScreenSize/-2 + 40 + ((yScreenSize/75) * 3));
    // move
    this.xPos += this.xSpeed*ticksPassed(this.oldGameTime)*moveSpeed; // update xpos
    this.yPos += this.ySpeed*ticksPassed(this.oldGameTime)*moveSpeed;
    this.oldGameTime = new Date().getTime();
  }
}

var Player = new player();

var count = 0;
var gameTickCount = 0;
var oldGameTime = new Date().getTime();

function playerFire() {
  if (mouseIsPressed) {
    if (Player.reload <= 0) {
      allObjects[1][allObjects[1].length] = new bullet(Player.xPos, Player.yPos, Math.sin(Player.rot + Math.PI) * -20, Math.cos(Player.rot + Math.PI) * 20, 2, [255, 0, 0],'player');
      Player.reload = Player.reloadTime/moveSpeed;
    }
  }
  if (keyIsDown(16) && keyIsDown(8)) { //shift + backspace
    if (Player.reload <= 0) {
      allObjects[1][allObjects[1].length] = new bullet(Player.xPos, Player.yPos, Math.sin(Player.rot + Math.PI) * -20, Math.cos(Player.rot + Math.PI) * 20, 10, [255, 0, 0],'player');
      Player.reload = 10/moveSpeed;
    }
  }
}

function Pause() {
  textAlign(CENTER);
  textSize(32);
  fill(127,255,127);
  text('PAUSED', xScreenSize/2, yScreenSize/2);
  textSize(16);
  text('Press SPACE to continue.', xScreenSize/2, (yScreenSize/2)+100);
  if (keyIsDown(32)) {
    stage = 0;
  }
}

function CraftMenu() {
  textAlign(LEFT);
  fill(127,255,127);
  textSize(20);
  this.textY = 25;
  for (i = 0; i < Player.inventoryType.length; i++) {
    text(Player.inventoryType[i] + ':' + Player.inventoryCount[i].toString(),0,this.textY);
    this.textY -= 30;
  }
  textAlign(CENTER);
  text('Presst SPACE to go back to game',xScreenSize/2,yScreenSize-50);
  if (keyIsDown(32)) {
    stage = 0;
  }
}

function gameTick() {
  noStroke();
  playerFire();
  this.tickLoop = 0;
  while (this.tickLoop < allObjects.length) {
    a = 0;
    while (a < allObjects[this.tickLoop].length) {
      if (allObjects[this.tickLoop][a] !== undefined) {
        allObjects[this.tickLoop][a].tick();
      }
      a += 1;
    }
    this.tickLoop += 1;
  }
  Player.controls(); // player tick/controls
  gameTickCount += 1;
}

function gameRender() {
  background(0,0,25,255); // darkblue
  cameraX = Player.xPos - (xScreenSize / 2);
  cameraY = Player.yPos - (yScreenSize / 2);
  this.renderLoop = 0;
  while (this.renderLoop < allObjects.length) {
    a = 0
    while (a < allObjects[this.renderLoop].length) {
      allObjects[this.renderLoop][a].render();
      a += 1;
    }
    this.renderLoop += 1;
  }
  Player.render(); // player renders on top
}

// this.oldGameTime = new Date().getTime();
// *ticksPassed(this.oldGameTime)

function draw() {
  create_walls(); // wall algorithim
  if (stage == 0){ // ingame
    if (ticksPassed(oldGameTime) >= 1) {
      gameTick();
      gameTickCount += 1;
      oldGameTime = new Date().getTime();
    }
    if (stage == 0) { // check if stage changed
      gameRender();
    }
  } else if (stage == 1) { // paused/menu
    Pause();
  }
  count += 1; // keeps count of the amount of ticks that have passed
}
