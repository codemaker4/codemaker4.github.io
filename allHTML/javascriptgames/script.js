var xScreenSize = innerWidth - 20;
var yScreenSize = innerHeight - 50;
var cameraX = 0;
var cameraY = 0;
var bal;
var ballen = [];

function setup() {
  createCanvas(xScreenSize, yScreenSize);
}

function mod(n, m) {
        return(((n % m) + m) % m);
}

function positive(numb) {
  if (numb < 0) {
    return(numb * -1)
  }
  return(numb)
}

function biggestBall() {
  var c = 0;
  biggestBallA = 0;
  while (c < ballen.length) {
    if (ballen[c].radius > ballen[biggestBallA].radius) {
      biggestBallA = c;
    }
    c += 1;
  }
  return(biggestBallA);
}

function MoveCamera() {
  cameraX = ballen[biggestBall()].xPos - (xScreenSize / 2);
  cameraY = ballen[biggestBall()].yPos - (yScreenSize / 2);
}

function nieuw() {
  bal = new Bal(ballen[biggestBall()].xPos,ballen[biggestBall()].yPos + Math.floor((Math.random() * 400) + 100),2,ballen[biggestBall()].xSpeed + 5,ballen[biggestBall()].ySpeed,false,Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255));
  ballen.push(bal);
}

function Bal(X, Y, R, XS, YS, FP, RC, GC, BC) {
  this.xPos = X;
  this.yPos = Y;
  this.radius = R;
  this.xSpeed = XS;
  this.ySpeed = YS;
  this.isFixed = FP;
  this.red = RC;
  this.green = GC;
  this.blue = BC;

  this.teken = function() {
    fill(this.red, this.green, this.blue);
    noStroke();
//    ellipse((this.xPos - cameraX) / zoom, (this.yPos - cameraY) / zoom, 2*this.radius / zoom, 2*this.radius / zoom);
    ellipse((this.xPos - cameraX), (this.yPos - cameraY), 2*this.radius, 2*this.radius);
  }

  this.updateSnelheid = function(A) {
    b = 0;
    if (Math.sqrt(ballen[biggestBall()].xPos - this.xPos ^ 2 + ballen[biggestBall()].yPos - this.yPos ^ 2) > 10000) {
      ballen.splice(A, 1);
    } else {
      while (b < ballen.length) {
        if (ballen[b] != this){
          var dx = ballen[b].xPos - this.xPos;
          var dy = ballen[b].yPos - this.yPos;
          if (Math.sqrt(dx*dx + dy*dy) <= this.radius + ballen[b].radius){
            this.xSpeed = (this.xSpeed + ballen[b].xSpeed) / 2;
            this.ySpeed = (this.ySpeed + ballen[b].ySpeed) / 2;
            this.radius += ballen[b].radius;
            this.red = ((this.red * this.radius) + (ballen[b].red * ballen[b].radius)) / (this.radius + ballen[b].radius);
            this.green = ((this.green * this.radius) + (ballen[b].green * ballen[b].radius)) / (this.radius + ballen[b].radius);
            this.blue = ((this.blue * this.radius) + (ballen[b].blue * ballen[b].radius)) / (this.radius + ballen[b].radius);
            ballen.splice(b, 1);
//            nieuw();
          } else if (Math.sqrt(dx*dx + dy*dy) < 1000) {
            this.xSpeed += dx / (Math.sqrt(dx*dx + dy*dy) / (ballen[b].radius / 100));
            this.ySpeed += dy / (Math.sqrt(dx*dx + dy*dy) / (ballen[b].radius / 100));
          }
        }
        b += 1;
      }
    }
  }

  this.beweeg = function(){
    if (this.isFixed != true) {
      this.xPos += this.xSpeed;
      this.yPos += this.ySpeed;
    }
  }
}

ballen = [new Bal(0,0,10,0,0,false,255,255,100)]

//var a = 0;
//while (a < 100) {
//  ballen[a] = new Bal(Math.floor(Math.random() * xScreenSize),Math.floor(Math.random() * yScreenSize),2,0,0,false,Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255))
//  a += 1;
//}

stars = []
var a = 0;
while (a < 100) {
  stars[a] = [Math.floor(Math.random() * xScreenSize), Math.floor(Math.random() * yScreenSize)];
  a += 1;
}

function draw() {
  background(0,0,100);
  MoveCamera();
  stroke(255,255,100);
  var a = 0;
  while (a < stars.length) {
    point(mod((stars[a][0] - cameraX), xScreenSize), mod((stars[a][1] - cameraY), yScreenSize));
    a += 1;
  }
  noStroke();
  var a = 0;
  while (a < ballen.length) {
    ballen[a].updateSnelheid(a);
    a += 1;
  }
  var a = 0;
  while (a < ballen.length) {
    ballen[a].beweeg();
    ballen[a].teken();
    a += 1;
  }
}
