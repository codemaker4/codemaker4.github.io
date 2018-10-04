var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var cameraX = 0;
var cameraY = 0;
var cameraFollows = 0;
var playerFriction = 0.7;
var playerHealth = 100;
var walkSpeed = 1;
var buletSpeed = 10;
var reloadTime = 30;
var bulletSpeed = 20;
var bulletAliveTime = 100;
var bulletSize = 10;
var playerSize = 50;
var playerSpawnSpread = 5000;

var grassTile;
var backGroundTileSize = 400;

var players = [];
var bullets = [];
var particles = [];

function isPosit(x) { // returns true if x is 0 or higher
  return (x>=0);
}

function SQdist(x1,y1,x2,y2) { // returns distances between 2 objects (objects need .x and .y properties for this to work)
  return(sq(x2-x1) + sq(y2-y1));
}

function smoothChange(now, goal, iterations) { // a = smoothChange(a, 10, 10)   smoothens change of a variable
  return(now+((goal-now)/iterations));
}

function newPlayer(xPos, yPos, hue) { // summons a new player
  players[players.length] = new player(xPos, yPos, hue);
}

function newPlayerInMap() {
  newPlayer(random(-playerSpawnSpread, playerSpawnSpread), random(-playerSpawnSpread, playerSpawnSpread), random(100));
}

function fireBullet(xPos, yPos, direction, hue) { // summons a new bullet
  bullets[bullets.length] = new bullet(xPos + sin(direction)*(playerSize/2), yPos + cos(direction)*(playerSize/2), direction + random(-0.2,0.2),  hue);
}

function spreadParticles(xPos, yPos, hue) { // summs 10 partices slowly moving away from the origin an dfading away
  for (var i = 0; i < 10; i++) {
    particles[particles.length] = new particle(xPos, yPos, random(TWO_PI), hue);
  }
}

function doCamera() { // calculates the camera
  if (players[cameraFollows] !== undefined) {
    cameraX = smoothChange(cameraX, players[cameraFollows].xPos - (xScreenSize/2) + sin(players[cameraFollows].fireDirection)*150, 40);
    cameraY = smoothChange(cameraY, players[cameraFollows].yPos - (yScreenSize/2) + cos(players[cameraFollows].fireDirection)*150, 40);
  } else {
    // cameraFollows = floor(random(players.length));
  }
  translate(-cameraX, -cameraY);
}

function drawBackground() { // renders the background tiles
  for (var x = cameraX-(cameraX%backGroundTileSize)-backGroundTileSize; x < cameraX+xScreenSize; x += backGroundTileSize) {
    for (var y = cameraY-(cameraY%backGroundTileSize)-backGroundTileSize; y < cameraY+yScreenSize; y += backGroundTileSize) {
      image(grassTile, x , y, backGroundTileSize, backGroundTileSize);
    }
  }
}

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  colorMode(HSL, 100, 100, 100, 100);
  rectMode(CENTER);
  noStroke();
  noSmooth();
  for (var i = 0; i < 100; i ++) {
    newPlayerInMap();
  }
  grassTile = loadImage("images/stoneTile.png");
}

function draw() { // loop
  doCamera(); // move camera
  // background(100);
  drawBackground(); // render backbround

  for (var i = 0; i < players.length; i ++) { // loop trought players
    players[i].tick(); // move player
    if (players[i].health <= 0) { // if player is dead
      spreadParticles(players[i].xPos, players[i].yPos, players[i].hue); // spread particles
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
      newPlayerInMap(); // summon new player to compensate for the killed one
      i -= 1; // shift loop variable to compensate for the deleted item
    } else {
      players[i].render();// if player did not die, render it
    }
  }

  for (var i = 0; i < bullets.length; i ++) { // loop trought bullets
    bullets[i].tick();  // move bullet
    if (bullets[i].timeLeft <= 0) { // if bullet si dead
      bullets.splice(i, 1); // delete it
      i -= 1; // shift loop variable to compensate for the deleted item
    } else {
      bullets[i].render(); // if bullet did not die, render it
    }
  }

  for (var i = 0; i < particles.length; i++) { // loop trought particles
    particles[i].draw(); // render+move partocles
    if (particles[i].timeLeft <= 0) { // if particle is done
      particles.splice(i,1); // delete it (particle is already renderd for this frame and will be shown)
      i --; // shift loop variable to compensate for the deleted item
    }
  }
  // fill(0);
  // rect(0,0,10,10);
}
