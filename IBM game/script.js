var xScreenSize = innerWidth - 4; // canvas size
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
var enemyHP = 5;
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


function posit(a) {
  return(sqrt(a*a));
}

function isPosit(a) {
  return(a >= 0);
}

if (typeof(Storage) !== "undefined") {
    // Retrieve
    Hscore = localStorage.getItem("Highscore");
    // Store
    //localStorage.setItem("Highscore", Hscore);
} else {
    Console.log("Can not store to localStorage");
}

var eerder = localStorage.getItem("eerder");
if (eerder != "ja"){
  localStorage.setItem("eerder", "ja");
  localStorage.setItem("H_score", 0);
}
Hscore = localStorage.getItem("H_score");

function setup() {
  // create random walls
  for (j = 0; j < aantal_muren; j++){
    walls[walls.length] = new wall(random(0 - xScreenSize/2, xScreenSize-20), random(0 - yScreenSize/2, yScreenSize-20), 20);
  }
  createCanvas(xScreenSize, yScreenSize);
  player_img = loadImage("images/pon.png");
  barricade_img = loadImage("images/barriecade.png");
  enemy_img = loadImage("images/enemy.png");
  bullet_img = loadImage("images/bullets.png");
  angleMode(RADIANS); // Change the mode to RADIANS for Math.sin() and Math.cos() witch use radians.
}

function soundLoud(thisob) {
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
  while (i < walls.length) {
    if ((walls[i].xPos - cameraX <= -xScreenSize*2) || (walls[i].xPos - cameraX >= xScreenSize + xScreenSize*2) || (walls[i].yPos - cameraY <= -yScreenSize*2) || (walls[i].yPos - cameraY >= yScreenSize + yScreenSize*2)){
      amount_of_walls_deleted += 1;
      walls.splice(i, 1);
      i -= 1;
    }
    if (amount_of_walls_deleted >= 5) {
//      console.log(amount_of_walls_deleted);
      randint = Math.floor(random(0,359));
      this.newX = Math.sin(randint) * 1000 + Player.xPos;
      this.newY = Math.cos(randint) * 1000 + Player.yPos;
      this.newDirection = Math.floor(random(0, 2));
      b = 0;
      if (newDirection == 0) {
        while (b < 5) {
          walls[walls.length] = new wall(this.newX + (b*20), this.newY, 20);
          b += 1;
        }
      } else {
        while (b < 5) {
          walls[walls.length] = new wall(this.newX, this.newY + (b*20), 20);
          b += 1;
        }
      }
      amount_of_walls_deleted -= 5;
    }
    i += 1;
  }
}

function wall(X,Y,size) {
  this.xPos = X;
  this.yPos = Y;
  this.size = size;
  this.health = 3;
  // hitbox aBullets
  // render
  this.render = function() {
    rectMode(CENTER);
    fill(255);
    image(barricade_img, this.xPos - (size/2) - cameraX, this.yPos - (size/2) - cameraY, this.size, this.size);
  }
}

function particle(xp,yp,xs,ys,col,siz) {
  this.xPos = xp;
  this.yPos = yp;
  this.xSpeed = xs;
  this.ySpeed = ys;
  this.color = col;
  this.size = siz;
  this.tick = function() {
    this.xPos += this.xSpeed;
    this.yPos += this.ySpeed;
    this.size -= 0.1;
    if (this.size <= 0) {
      particles.splice(particles.indexOf(this), 1);
      a -= 1;
    }
  }
  this.render = function() {
    fill(this.color);
    ellipse(this.xPos - cameraX - (xScreenSize/2),this.yPos - cameraY - (yScreenSize/2),round(this.size),round(this.size));
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
  if (soundLoud(this)) {
   lazerSound.volume = soundLoud(this); // sets volume variable correct, but sound.play(); does not react to the vulume?
   this.lazerSound.play();
  }
  this.tick = function() {
    //move
    this.xPos += this.xSpeed;
    this.yPos += this.ySpeed;
    // hitbox walls
    b = 0;
    while (b < walls.length) {
      dx = walls[b].xPos - this.xPos;
      dy = walls[b].yPos - this.yPos;
      if ((posit(dx) < ((walls[b].size / 2) + (this.Dam*2.5))) && (posit(dy) < ((walls[b].size / 2) + (this.Dam*2.5)))) {
        walls[b].size -= 1;
        if (walls[b].size < 1) {
          var j = 0;
          while (j < 10) {
            particles[particles.length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[0,255,0],10);
            j += 1;
          }
          walls.splice(b, 1);
          if (soundLoud(this)) {
           explosionSound.volume = soundLoud(this);
           this.explosionSound.play();
          }
          b -= 1;
        }
        this.Dam -= 3;
      }
      b += 1;
    }
    //hitbox enemys
    //hitbox player
    if (this.xPos - cameraX > xScreenSize + xScreenSize || this.xPos - cameraX < 0 - xScreenSize || this.yPos - cameraY > yScreenSize + yScreenSize || this.yPos - cameraY < 0 - yScreenSize || this.Dam <= 0){
      aBullets.splice(aBullets.indexOf(this), 1);
    }
  }
  //render
  this.render = function() {
    fill(this.color);
    ellipse(this.xPos - cameraX,this.yPos - cameraY,this.Dam * 5,this.Dam * 5);
    //image(bullet_img, this.xPos - cameraX - this.Dam, this.yPos - cameraY - this.Dam, this.Dam * 2, this.Dam * 2);
  }
}

function enemy(X, Y, HP, REL) {
  this.xPos = X;
  this.yPos = Y;
  this.health = HP;
  this.reload = REL;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.size = 60;
  this.ai = function() {
    dx = Player.xPos - this.xPos;
    dy = Player.yPos - this.yPos;
    if (sqrt((dx*dx)+(dy*dy)) > 200) {
      this.xSpeed += Math.sin(Math.atan2(dx,dy)) * 1;
      this.ySpeed += Math.cos(Math.atan2(dx,dy)) * 1;
    } else {
      this.xSpeed -= Math.sin(Math.atan2(dx,dy)) * 1;
      this.ySpeed -= Math.cos(Math.atan2(dx,dy)) * 1;
    }
    this.xSpeed = this.xSpeed / 1.2;
    this.ySpeed = this.ySpeed / 1.2;
    b = 0;
    while (b < walls.length) {
      dx = walls[b].xPos - this.xPos;
      dy = walls[b].yPos - this.yPos;
      if ((posit(dx) < ((walls[b].size / 2) + (this.size/2))) && (posit(dy) < ((walls[b].size / 2) + (this.size/2)))) {
        if (posit(dx) > posit(dy)) {
          if (!(isPosit(dx))) {
            this.xPos = walls[b].xPos + (walls[b].size / 2) + (this.size/2) + 1;
            this.xSpeed = 0;
            if (isPosit(Player.yPos - this.yPos)) {
              this.ySpeed += 1;
            } else {
              this.ySpeed -= 1;
            }
          } else {
            this.xPos = walls[b].xPos - (walls[b].size / 2) - (this.size/2) - 1;
            this.xSpeed = 0;
            this.ySpeed = this.ySpeed / 5;
            if (isPosit(Player.yPos - this.yPos)) {
              this.ySpeed += 1;
            } else {
              this.ySpeed -= 1;
            }
          }
        } else {
          if (!(isPosit(dy))) {
            this.yPos = walls[b].yPos + (walls[b].size / 2) + (this.size/2) + 1;
            this.ySpeed = 0;
            if (isPosit(Player.xPos - this.xPos)) {
              this.xSpeed += 1;
            } else {
              this.xSpeed -= 1;
            }
          } else {
            this.yPos = walls[b].yPos - (walls[b].size / 2) - (this.size/2) - 1;
            this.ySpeed = 0;
            if (isPosit(Player.xPos - this.xPos)) {
              this.xSpeed += 1;
            } else {
              this.xSpeed -= 1;
            }
          }
        }
      }
      b += 1;
    }
    if (this.reload <= 0) {
      aBullets[aBullets.length] = new bullet((Math.sin(Math.atan2(Player.xPos - this.xPos, Player.yPos - this.yPos)) * (this.size + 10)) + this.xPos, (Math.cos(Math.atan2(Player.xPos - this.xPos, Player.yPos - this.yPos)) * (this.size + 10)) + this.yPos, Math.sin(Math.atan2(Player.xPos - this.xPos, Player.yPos - this.yPos)) * 20, Math.cos(Math.atan2(Player.xPos - this.xPos, Player.yPos - this.yPos)) * 20, 2, [255, 255, 0], 'enemy');
      this.reload = 50;
    }
    b = 0;
    while (b < aBullets.length) {
      dx = aBullets[b].xPos - this.xPos;
      dy = aBullets[b].yPos - this.yPos;
      if (sqrt((dx*dx)+(dy*dy)) < ((aBullets[b].Dam*10) + this.size) && aBullets[b].type != 'enemy') {
        this.health -= 1;
        particles[particles.length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,255,255],5);
        if (this.health <= 0) {
          var j = 0;
          while (j < 10) {
            particles[particles.length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,255,255],10);
            j += 1;
          }
          kills += 1;
          score += 50;
          difficulty += 0.1;
          enemies.splice(enemies.indexOf(this), 1);
          while (Math.floor(difficulty) > enemies.length) {
            randint = Math.floor(random(0,359));
            enemies[enemies.length] = new enemy(Math.sin(randint) * 1000 + Player.xPos,Math.cos(randint) * 2000 + Player.yPos,enemyHP,50);
            c -= 1;
          }
          a -= 1;
        }
      }
      b += 1;
    }
    this.xPos += this.xSpeed;
    this.yPos += this.ySpeed;
    this.reload -= 1;
  }
  this.render = function() {
  //  fill(0,0,255,255);
  //  ellipse(this.xPos - cameraX,this.yPos - cameraY,this.size,this.size);
    image(enemy_img, (this.xPos - cameraX) - 30, (this.yPos - cameraY) - 30, 60, 60);
  }
}

enemies = [new enemy(0,0,enemyHP,50)];

function restart() {
  explosionSound.volume = 1;
  explosionSound.play();
  alert("you lost");
  localStorage.setItem("H_score", Hscore);
  walls = []; // lsit with all wall objects
  aBullets = []; // list with all bullet objects
  reload = 0; // reload variable, if <= 0 player can fire
  amount_of_walls_deleted = 50;
  enemies = [new enemy(0,0,enemyHP,50)];
  kills = 0;
  score = 0;
  Player = new player();
  difficulty = 1;
  for (j = 0; j < aantal_muren; j++){
    walls[walls.length] = new wall(random(0 - xScreenSize/2, xScreenSize-20), random(0 - yScreenSize/2, yScreenSize-20), 20);
  }
}

function player() {
  this.xPos = 100;
  this.yPos = 100;
  this.xSpeed = 0;
  this.ySpeed = 0;
  this.rot = 0;
  this.health = playerMaxHP;
  this.lastHitTime = 0;
  // controls
  this.controls = function() {
    this.rot = atan2((mouseX - (xScreenSize / 2)) * -1,(mouseY - (yScreenSize / 2)) * -1) * -1;
    if (keyIsDown(65)) { //a
        this.xSpeed -= 1 / 1.5;
    }
    if (keyIsDown(68)) { //d
      this.xSpeed += 1 / 1.5
    }
    if (keyIsDown(87)) { //w
      this.ySpeed -= 1 / 1.5;
    }
    if (keyIsDown(83)) { //s
      this.ySpeed += 1 / 1.5;
    }
    b = 0;
    //hitboxing walls
    while (b < walls.length) {
      dx = walls[b].xPos - this.xPos; // dx = distance X
      dy = walls[b].yPos - this.yPos;
      if ((posit(dx) < ((walls[b].size / 2) + (70/2))) && (posit(dy) < ((walls[b].size / 2) + (70/2)))) { // if collision
        if (sqrt((this.xSpeed*this.xSpeed)+(this.ySpeed*this.ySpeed)) > 7) {
          this.health -= 3;
          this.lastHitTime = 500;
          particles[particles.length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,128,0],10);
        }
        if (posit(dx) > posit(dy)) { // check side of collision step 1
          if (!(isPosit(dx))) { // check side of collision step 2
            this.xPos = walls[b].xPos + (walls[b].size / 2) + (70/2); // do Xpos
            this.xSpeed = 0; // stop xspeed
            this.ySpeed = this.ySpeed / 1; // slow down y speed (friction)
          } else { //check side of collision step 2
            this.xPos = walls[b].xPos - (walls[b].size / 2) - (70/2);
            this.xSpeed = 0;
//            this.rot -= this.ySpeed / 70;
            this.ySpeed = this.ySpeed / 1;
          }
        } else { // check side of collision step 1
          if (!(isPosit(dy))) { // check side of collision step 2
            this.yPos = walls[b].yPos + (walls[b].size / 2) + (70/2);
            this.ySpeed = 0;
//            this.rot -= this.xSpeed / 70;
            this.xSpeed = this.xSpeed / 1;
          } else { // check side of collision step 2
            this.yPos = walls[b].yPos - (walls[b].size / 2) - (70/2);
            this.ySpeed = 0;
//            this.rot += this.xSpeed / 70;
            this.xSpeed = this.xSpeed / 1;
          }
        }
      }
      b += 1;
    }
    b = 0;
    while (b < aBullets.length) {
      dx = aBullets[b].xPos - this.xPos;
      dy = aBullets[b].yPos - this.yPos;
      if (sqrt((dx*dx)+(dy*dy)) < ((70/2) + (aBullets[b].Dam * 2.5)) && aBullets[b].type != 'player') {
        aBullets[b].Dam -= 1;
        this.health -= 1;
        this.lastHitTime = 500;
        particles[particles.length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,128,0],10);
      }
      b += 1;
    }
    if (this.health <= 0) {
      restart();
      var j = 0;
      while (j < 10) {
        particles[particles.length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,128,0],15);
        j += 1;
      }
      var j = 0;
      while (j < 10) {
        particles[particles.length] = new particle(this.xPos,this.yPos,random(-2,2),random(-2,2),[255,0,0],15);
        j += 1;
      }
    }
    if (this.lastHitTime <= 0 && this.health < playerMaxHP) {
      this.health += 0.25;
    }
    if (score > Hscore) {
      Hscore = score;
    }
    if (count%5 == 0) {
      particles[particles.length] = new particle(Player.xPos + (Math.sin(Player.rot + Math.PI) * 30),Player.yPos + (Math.cos(Player.rot + Math.PI) * -30),random(-0.5,0.5),random(-0.5,0.5),[128,128,255],5);
    }
    this.lastHitTime -= 1;
    this.xPos += this.xSpeed; // update xpos
    this.yPos += this.ySpeed;
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
  }
}

var Player = new player();

var count = 0;

function playerFire() {
  if (mouseIsPressed || keyIsDown(32)) { // spacebar
    if (reload <= 0) {
      aBullets[aBullets.length] = new bullet(Player.xPos, Player.yPos, Math.sin(Player.rot + Math.PI) * -20, Math.cos(Player.rot + Math.PI) * 20, 2, [255, 0, 0],'player');
      reload = 50;
    }
  }
  if (keyIsDown(16) && keyIsDown(8)) { //shift + backspace
    if (reload <= 0) {
      aBullets[aBullets.length] = new bullet(Player.xPos, Player.yPos, Math.sin(Player.rot + Math.PI) * -20, Math.cos(Player.rot + Math.PI) * 20, 10, [255, 0, 0],'player');
      reload = 10;
    }
  }
}

function Pause() {
  textAlign(CENTER);
  textSize(32);
  fill(255,255,255,255)
  text('PAUSED', xScreenSize/2, yScreenSize/2);
  textSize(16);
  text('Press SPACE to continue.', xScreenSize/2, (yScreenSize/2)+100);
  if (keyIsDown(32)) {
    stage = 0;
  }
}

function draw() {
  create_walls(); // wall algorithim
  if (stage == 0){ // ingame
    background(0,0,25,255); // darkblue
    fill(0, 255, 0);
    noStroke();
    playerFire();
    a = 0; // bullets tick
    while (a < aBullets.length) {
      if (aBullets[a] !== undefined) {
        aBullets[a].tick();
      }
      a += 1;
    }
    a = 0; // enemies tick/AI
    while (a < enemies.length) {
      if (enemies[a] !== undefined) {
        enemies[a].ai();
      }
      a += 1;
    }
    a = 0;
    while (a < particles.length) {
      if (particles[a] !== undefined) {
        particles[a].tick();
      }
      a += 1;
    }
    Player.controls(); // player tick/controls
    cameraX = Player.xPos - (xScreenSize / 2);
    cameraY = Player.yPos - (yScreenSize / 2);
    a = 0; // wall render
    while (a < walls.length) {
      walls[a].render();
      a += 1;
    }
    a = 0; // enemies render
    while (a < enemies.length) {
      enemies[a].render();
      a += 1;
    }
    a = 0; // bullets render
    while (a < aBullets.length) {
      aBullets[a].render();
      a += 1;
    }
    Player.render(); // player renders on top
    a = 0;
    while (a < particles.length) {
      particles[a].render();
      a += 1
    }
    if (keyIsDown(27)) {
      stage = 1;
      background(0,0,25,200); // dark blue, slowly fading old ingame frame away.
    }
  } else if (stage == 1){ // paused/menu
    Pause();
  }
  count += 1; // keep count of loop (now unused)
  reload -= 1; // reload cooldown, if < 0, the allow fire
}
