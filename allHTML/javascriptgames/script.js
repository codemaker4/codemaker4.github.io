var xScreenSize = innerWidth - 0;
var yScreenSize = innerHeight - 15;
var cameraX = 0;
var cameraY = 0;
var bal;
var ballen = [];
var reload = 0;
var counter = 0;

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
  cameraX = ballen[0].xPos - (xScreenSize / 2);
  cameraY = ballen[0].yPos - (yScreenSize / 2);
}

function nieuw() {
  var arandom = Math.floor(Math.random() * 360);
  ballen[ballen.length] = new Bal(Math.sin(arandom) * (100 + Math.floor(Math.random() * 200)), Math.cos(arandom) * (100 + Math.floor(Math.random() * 200)), 2, Math.sin(arandom + 90) * 3, Math.cos(arandom + 90) * 3, false, Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255));
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
            this.radius += 0; //ballen[b].radius;
            this.red = this.red //((this.red * this.radius) + (ballen[b].red * ballen[b].radius)) / (this.radius + ballen[b].radius);
            this.green = this.green//((this.green * this.radius) + (ballen[b].green * ballen[b].radius)) / (this.radius + ballen[b].radius);
            this.blue = this.blue//((this.blue * this.radius) + (ballen[b].blue * ballen[b].radius)) / (this.radius + ballen[b].radius);
            ballen.splice(b, 1);
            nieuw();
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
      this.xPos += this.xSpeed / 5;
      this.yPos += this.ySpeed / 5;
    }
  }
}

ballen = [new Bal(0,0,10,0,0,true,255,255,100)]



//var a = 0;
//while (a < 100) {
//  ballen[a] = new Bal(Math.floor(Math.random() * xScreenSize),Math.floor(Math.random() * yScreenSize),2,0,0,false,Math.floor(Math.random() * 255),Math.floor(Math.random() * 255),Math.floor(Math.random() * 255))
//  a += 1;
//}

stars = []
var a = 0;
while (a < 10) {
  stars[a] = [Math.floor(Math.random() * xScreenSize), Math.floor(Math.random() * yScreenSize)];
  a += 1;
}

nieuw();
nieuw();
nieuw();

function draw() {
  background(0,0,100,25);
  MoveCamera();
  stroke(255,255,100);
  if (keyIsDown(32) && reload <= 0) { //keyIsDown(32)
    nieuw();
    reload = 50;
  }
  stars[counter % 100] = [Math.floor(Math.random() * xScreenSize), Math.floor(Math.random() * yScreenSize)];
  var a = 0;
  while (a < stars.length) {
    point(mod((stars[a][0] - cameraX), xScreenSize), mod((stars[a][1] - cameraY), yScreenSize));
    a += 1;
  }
  noStroke();
  if (counter % 5 == 0) {
    var a = 0;
    while (a < ballen.length) {
      ballen[a].updateSnelheid(a);
      a += 1;
    }
  }
  var a = 0;
  while (a < ballen.length) {
    ballen[a].beweeg();
    ballen[a].teken();
    a += 1;
  }
  reload += -1;
  counter += 1;
}
