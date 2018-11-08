var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var cameraX = 0;
var cameraY = 0;
var cameraFollows = 0;
var playerFriction = 0.7;
var playerHealth = 100;
var walkSpeed = 1.5;
var buletSpeed = 10;
var reloadTime = 30;
var bulletSpeed = 20;
var bulletAliveTime = 100;
var bulletSize = 20;
var playerSize = 100;
var playerSpawnSpread = 5000;
var humanPlayerSpawnRequest = false;
var nowFramerate = 0;
var myNowPixelDensity = 1;
var nowBackgroundHue = 0;
var framesSinceLastKill = 0;
var averageFPS = 60;
var fastMode = false;

var grassTile;
var stoneTile;
var playerTextures = [];
var backGroundTileSize = 750;

var players = [];
var bullets = [];
var particles = [];

var zoom = 2;

function SQdist(x1,y1,x2,y2) { // returns distances between 2 objects (objects need .x and .y properties for this to work)
  return(sq(x2-x1) + sq(y2-y1));
}

function smoothChange(now, goal, iterations) { // a = smoothChange(a, 10, 10)   smoothens change of a variable
  return(now+((goal-now)/iterations));
}

function onScreen(obToCheck) {
  return(obToCheck.xPos > cameraX-playerSize && obToCheck.xPos < cameraX+xScreenSize+playerSize && obToCheck.yPos > cameraY-playerSize && obToCheck.yPos < cameraY+yScreenSize+playerSize);
}

function newAIPlayer(xPos, yPos, hue) { // summons a new player
  players[players.length] = new AIPlayer(xPos, yPos, hue);
}

function newHumanPlayer(xPos, yPos, hue) {
  players[players.length] = new humanPlayer(xPos, yPos, hue);
  humanPlayerSpawnRequest = false;
  cameraFollows = players.length-1;
  cameraX = xPos - xScreenSize/2/zoom;
  cameraY = yPos - yScreenSize/2/zoom;
}

function newPlayerInMap() {
  if (humanPlayerSpawnRequest === true) {
    newHumanPlayer(random(-playerSpawnSpread, playerSpawnSpread), random(-playerSpawnSpread, playerSpawnSpread), random(100));
  } else {
    newAIPlayer(random(-playerSpawnSpread, playerSpawnSpread), random(-playerSpawnSpread, playerSpawnSpread), random(100));
  }
}

function fireBullet(xPos, yPos, direction, hue) { // summons a new bullet
  bullets[bullets.length] = new bullet(xPos + sin(direction)*(playerSize/2), yPos + cos(direction)*(playerSize/2), direction + random(-0.2,0.2),  hue);
}

function spreadParticles(xPos, yPos, hue) { // summs 10 partices slowly moving away from the origin an dfading away
  if (fastMode) {
    for (var i = 0; i < 5; i++) {
      particles[particles.length] = new particle(xPos, yPos, random(TWO_PI), hue);
    }
  } else {
    for (var i = 0; i < 20; i++) {
      particles[particles.length] = new particle(xPos, yPos, random(TWO_PI), hue);
    }
  }
}

function doCamera() { // calculates the camera
  if (players[cameraFollows] !== undefined) {
    cameraX = smoothChange(cameraX, players[cameraFollows].xPos - (xScreenSize/2) + sin(players[cameraFollows].fireDirection)*150 + players[cameraFollows].xSpeed*50, 100);
    cameraY = smoothChange(cameraY, players[cameraFollows].yPos - (yScreenSize/2) + cos(players[cameraFollows].fireDirection)*150 + players[cameraFollows].ySpeed*50, 100);
  } else {
    // cameraFollows = floor(random(players.length));
  }
  translate(-cameraX, -cameraY);
}

function drawBackground() { // renders the background tiles
  if (!fastMode) {
    nowBackgroundHue = hue(lerpColor(color(nowBackgroundHue, 100, 50), color(players[cameraFollows].hue, 100, 50), framesSinceLastKill/2000));
    tint(nowBackgroundHue, 100, 50);
  } else {
    noTint();
  }
  for (var x = cameraX-(cameraX%backGroundTileSize)-backGroundTileSize; x < cameraX+xScreenSize; x += backGroundTileSize) {
    for (var y = cameraY-(cameraY%backGroundTileSize)-backGroundTileSize; y < cameraY+yScreenSize; y += backGroundTileSize) {
      image(neonTile, x , y, backGroundTileSize, backGroundTileSize);
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    if (players[cameraFollows].isPlayer !== true) {
      humanPlayerSpawnRequest = true;
    }
  }
}

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  xScreenSize = xScreenSize*zoom;
  yScreenSize = yScreenSize*zoom;
  colorMode(HSL, 100, 100, 100, 100);
  rectMode(CENTER);
  noStroke();
  noSmooth();
  pixelDensity(1);
  playerTextures = [loadImage("images/players/BotPlayer.png"), loadImage("images/players/player_00.png"), loadImage("images/players/player_01.png"), loadImage("images/players/player_02.png"), loadImage("images/players/player_03.png"), loadImage("images/players/player_04.png"), loadImage("images/players/player_05.png"), loadImage("images/players/player_06.png"), loadImage("images/players/player_07.png"), loadImage("images/players/player_08.png"), loadImage("images/players/player_09.png")];
  for (var i = 0; i < 50; i ++) {
    newPlayerInMap();
  }
  neonTile = loadImage("images/neon background-1.png");
}

function draw() { // loop
  scale(1/zoom);
  doCamera(); // move camera
  // background(100);
  imageMode(CORNER);
  drawBackground(); // render backbround
  imageMode(CENTER);

  stroke(0);
  strokeWeight(2);
  for (var i = 0; i < bullets.length; i ++) { // loop trought bullets
    bullets[i].tick();  // move bullet
    if (bullets[i].timeLeft <= 0) { // if bullet si dead
      bullets.splice(i, 1); // delete it
      i -= 1; // shift loop variable to compensate for the deleted item
    } else {
      bullets[i].render(); // if bullet did not die, render it
    }
  }
  noStroke();

  for (var i = 0; i < players.length; i ++) { // loop trought players
    players[i].tick(); // move player
    if (players[i].health <= 0) { // if player is dead
      if (onScreen(players[i])) {
        spreadParticles(players[i].xPos, players[i].yPos, players[i].hue); // spread particles
      }
      players.splice(i, 1);// delete player object
      if (cameraFollows > i) { // shift camera follow ID if needed
        cameraFollows -= 1;
      } else if (cameraFollows == i) { // find new player to follow
        var closestID = 0;
        var closestSQDist = Infinity;
        for (var j = 0; j < players.length; j ++) { // find closest
          var nowDist = SQdist(cameraX+(xScreenSize/2),cameraY+(yScreenSize/2),players[j].xPos,players[j].yPos);
          if (nowDist < closestSQDist) {
            closestSQDist = nowDist
            closestID = j
          }
        }
        cameraFollows = closestID; // follow closest
      }
      for (var j = 0; j < players.length; j++) {
        if (players[j].nowTargeting > i) {
          players[j].nowTargeting -= 1;
        }
      }
      newPlayerInMap(); // summon new player to compensate for the killed one
      framesSinceLastKill = 0;
      i -= 1; // shift loop variable to compensate for the deleted item
    } else {
      players[i].render();// if player did not die, render it
    }
  }

  for (var i = 0; i < particles.length; i++) { // loop trought particles
    particles[i].draw(); // render+move partocles
    if (particles[i].timeLeft <= 0) { // if particle is done
      particles.splice(i,1); // delete it (particle is already renderd for this frame and will be shown)
      i --; // shift loop variable to compensate for the deleted item
    }
  }
  averageFPS = ((averageFPS*19)+frameRate())/20;
  if (averageFPS < 30) {
    fastMode = true;
  } else if (averageFPS > 59) {
    fastMode = false;
  }
  if (humanPlayerSpawnRequest) {
    console.log(frameCount);
    fill(frameCount%100,100,50);
    stroke(0);
    textSize(100);
    text("Waiting for a spot in the map...",cameraX,cameraY+100);
  }
  framesSinceLastKill += 1;
}
