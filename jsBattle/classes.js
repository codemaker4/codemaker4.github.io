class player {
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
  }
  tick() {
    var closestPlayerID = undefined; // find closest enemy
    var closestPlayerSQDist = Infinity;
    for (var i = 0; i < players.length; i ++) {
      if (players[i] != this) {
        var nowSQDist = SQdist(this.xPos, this.yPos, players[i].xPos, players[i].yPos);
        if (nowSQDist < closestPlayerSQDist) {
          closestPlayerSQDist = nowSQDist;
          closestPlayerID = i;
        }
      }
    }
    if (closestPlayerID !== undefined) { // if enemy exists
      var direction = atan2(players[closestPlayerID].xPos - this.xPos, players[closestPlayerID].yPos - this.yPos); // aim at it
      this.fireDirection = direction // remember its direction
      if (closestPlayerSQDist < sq(500)) { // if enemy is close
        direction += this.turnDirection; // move to the left/right instead
      }
      this.xSpeed += sin(direction)*walkSpeed; // move (accelerate)
      this.ySpeed += cos(direction)*walkSpeed;

      if (this.reload <= 0) { // if can fire
        fireBullet(this.xPos, this.yPos, this.fireDirection, this.hue); // fire bullet
        this.reload = reloadTime; // start reloading
      }
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
    if (floor(random(500)) === 0) { // swap between moving left/right if randomness feels like doing so
      this.turnDirection = -this.turnDirection;
    }
  }
  render(){
    if (this.xPos + playerSize - cameraX > 0 && this.yPos + playerSize - cameraY > 0 && this.xPos - playerSize - cameraX < xScreenSize && this.yPos - playerSize - cameraY < yScreenSize) {
      push();
        translate(cameraX + (this.xPos - cameraX), cameraY + (this.yPos - cameraY)); // move (0,0) to me
        rotate(-this.fireDirection); // rotate me
        fill(this.hue, this.health, 50); // pick my color
        rect(0, 0, playerSize, playerSize); // render me
      pop(); // leave render settings as if this never happened
    }
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
    if (this.xPos + bulletSize - cameraX > 0 && this.yPos + bulletSize - cameraY > 0 && this.xPos - bulletSize - cameraX < xScreenSize && this.yPos - bulletSize - cameraY < yScreenSize) {
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
    if (this.xPos + bulletSize - cameraX > 0 && this.yPos + bulletSize - cameraY > 0 && this.xPos - bulletSize - cameraX < xScreenSize && this.yPos - bulletSize - cameraY < yScreenSize) {
      fill(this.hue, this.timeLeft, 50, this.timeLeft); // render
      rect(this.xPos, this.yPos, bulletSize, bulletSize);
    }
  }
}
