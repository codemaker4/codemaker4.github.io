function playerRender(obToControll) {
  if (onScreen(obToControll)) {
    push();
      translate(cameraX + (obToControll.xPos - cameraX), cameraY + (obToControll.yPos - cameraY)); // move (0,0) to me
      rotate(-obToControll.fireDirection + PI); // rotate me
      tint(obToControll.hue, obToControll.health*2, 50);
      image(playerTextures[obToControll.playerLook], 0, -playerSize/2, playerSize, playerSize*2); // render me
    pop(); // leave render settings as if obToControll never happened
  }
}

class AIPlayer {
  constructor(_xPos, _yPos, _hue) {
    this.xPos = _xPos;
    this.yPos = _yPos;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.hue = _hue;
    this.reload = 0;
    this.health = playerHealth;
    this.turnDirection = HALF_PI;
    this.fireDirection = 0;
    this.nowTargeting = 0;
    this.closestPlayerSQDist = Infinity;
    this.playerLook = floor(random(0,playerTextures.length));
    this.frameOffset = floor(random(60));
    this.isPlayer = false;
  }
  tick() {
    if ((frameCount+this.frameOffset)%30 == 0) {
      this.closestPlayerSQDist = Infinity;
      for (var i = 0; i < players.length; i ++) {
        if (players[i] != this) {
          var nowSQDist = SQdist(this.xPos, this.yPos, players[i].xPos, players[i].yPos);
          if (nowSQDist < this.closestPlayerSQDist) {
            this.closestPlayerSQDist = nowSQDist;
            this.nowTargeting = i;
          }
        }
      }
      if (floor(random(10)) === 0) { // swap between moving left/right if randomness feels like doing so
        this.turnDirection = -this.turnDirection;
      }
    }
    var direction = atan2(players[this.nowTargeting].xPos - this.xPos, players[this.nowTargeting].yPos - this.yPos); // aim at it
    this.fireDirection = direction // remember its direction
    if (this.closestPlayerSQDist < sq(500)) { // if enemy is close
      direction += this.turnDirection; // move to the left/right instead
    }
    this.xSpeed += sin(direction)*walkSpeed; // move (accelerate)
    this.ySpeed += cos(direction)*walkSpeed;

    if (this.reload <= 0) { // if can fire
      fireBullet(this.xPos, this.yPos, this.fireDirection, this.hue); // fire bullet
      this.reload = reloadTime; // start reloading
    }

    if ((frameCount+this.frameOffset)%3 == 0) {
      for (var i = 0; i < bullets.length; i ++) { // loop trought bullets
        if (bullets[i].hue !== this.hue && SQdist(this.xPos, this.yPos, bullets[i].xPos, bullets[i].yPos) < sq(playerSize/2)) { // if bullet is not mine
          this.health -= 10; // take damage
          bullets[i].timeLeft = 0; // kill bullet
        }
      }
    }

    this.xPos += this.xSpeed; // move (step)
    this.yPos += this.ySpeed;
    this.xSpeed = this.xSpeed*playerFriction; // friction
    this.ySpeed = this.ySpeed*playerFriction;
    this.reload -= 1; // continue reloading
    // if (this.health < 100) { // regenerate
    //   this.health += 0.1;
    // }
  }
  render(){
    playerRender(this);
  }
}

class humanPlayer {
  constructor(_xPos, _yPos, _hue) {
    this.xPos = _xPos;
    this.yPos = _yPos;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.hue = _hue;
    this.reload = 0;
    this.health = playerHealth;
    this.fireDirection = 0;
    this.playerLook = floor(random(0,playerTextures.length));
    this.isPlayer = true;
  }
  tick() {
    if (keyIsDown(87)) { // W
      this.ySpeed -= walkSpeed;
    } else if (keyIsDown(83)) { // S
      this.ySpeed += walkSpeed;
    }
    if (keyIsDown(65)) { // A
      this.xSpeed -= walkSpeed;
    } else if (keyIsDown(68)) { // D
      this.xSpeed += walkSpeed;
    }

    this.fireDirection = atan2((mouseX*zoom)+cameraX-this.xPos, (mouseY*zoom)+cameraY-this.yPos);
    if (this.reload <= 0 && mouseIsPressed) { // if can fire
      fireBullet(this.xPos, this.yPos, this.fireDirection, this.hue); // fire bullet
      this.reload = reloadTime; // start reloading
    }

    for (var i = 0; i < bullets.length; i ++) { // loop trought bullets
      if (bullets[i].hue !== this.hue && SQdist(this.xPos, this.yPos, bullets[i].xPos, bullets[i].yPos) < sq(playerSize/2)) { // if bullet is not mine
        this.health -= 10; // take damage
        bullets[i].timeLeft = 0; // kill bullet
      }
    }

    this.xPos += this.xSpeed; // move (step)
    this.yPos += this.ySpeed;
    this.xSpeed = this.xSpeed*playerFriction; // friction
    this.ySpeed = this.ySpeed*playerFriction;
    this.reload -= 1; // continue reloading
    // if (this.health < 100) { // regenerate
    //   this.health += 0.1;
    // }
  }
  render(){
    playerRender(this);
  }
}

class bullet{
  constructor(_xPos, _yPos, direction, _hue) {
    this.xPos = _xPos;
    this.yPos = _yPos;
    this.xSpeed = sin(direction)*bulletSpeed;
    this.ySpeed = cos(direction)*bulletSpeed;
    this.hue = _hue
    this.timeLeft = bulletAliveTime;
  }
  tick() {
    this.xPos += this.xSpeed; // move
    this.yPos += this.ySpeed;
    this.timeLeft -= 1; // age
  }
  render() {
    if (onScreen(this)) {
      fill(this.hue,100,50,this.timeLeft); // render
      rect(this.xPos, this.yPos, bulletSize, bulletSize);
    }
  }
}

class particle{
  constructor(_xPos, _yPos, direction, _hue) {
    this.xPos = _xPos;
    this.yPos = _yPos;
    this.xSpeed = sin(direction);
    this.ySpeed = cos(direction);
    this.timeLeft = 100;
    this.hue = _hue;
  }
  draw() {
    this.xPos += this.xSpeed; // move
    this.yPos += this.ySpeed;
    this.timeLeft -= 1; // age
    if (onScreen(this)) {
      fill(this.hue, this.timeLeft, 50, this.timeLeft); // render
      rect(this.xPos, this.yPos, bulletSize, bulletSize);
    }
  }
}
