var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var barSize = 200;
var colors = [];
var scrollVal = 0;

var imgAdd;
var imgRemove;
var imgMembers;
var imgOptions;
var imgBack;

var state = "teams overview";
var viewing = 0;

var teams = {};
var mouseWasClicked = false;
var screenUpdateNeeded = true;
var newScreenUpdate = false;

function button(butX, butY, butW, butH, img) {
  if (screenUpdateNeeded) {
    rect(butX, butY, butW, butH);
    noSmooth();
    image(img, butX+((butW-20)/2)+10, butY+((butH-20)/2)+10, min(butW-20, butH-20), min(butW-20, butH-20));
    smooth();
  }
  if (mouseWasClicked && mouseX > butX && mouseX < butX+butW && mouseY > butY && mouseY < butY+butH) {
    mouseWasClicked = false;
    newScreenUpdate = true;
    return true;
  }
  return false;
}

function renderOverview() {
  var yToDraw = scrollVal;
  for (var team in teams) {
    teams[team].renderBar(0,yToDraw,xScreenSize,barSize);
    yToDraw += barSize+10;
  }

  fill(0,255,0);
  if (button(0,yToDraw,xScreenSize,barSize,imgAdd)) {
    teamName = prompt("Enter a name here:");
    if (teamName !== null && !(teamName in teams)) {
      addTeam(teamName, colors[Object.keys(teams).length%6]);
    }
  }
  yToDraw += barSize+10;

  if (yToDraw < yScreenSize) {
    scrollVal = yScreenSize+scrollVal-yToDraw;
  }
  if (scrollVal > 0) {
    scrollVal = 0;
  }
}

function addTeam(teamName, teamColor) {
  teams[teamName] = new team(teamName, teamColor);
}

function mouseClicked() {
  mouseWasClicked = true;
}

function mouseDragged(event) {
  scrollVal += mouseY-pmouseY;
  if (scrollVal > 0) {
    scrollVal = 0;
  }
  screenUpdateNeeded = true;
}

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  imageMode(CENTER)
  colors = [color(255,0,0), color(255,255,0), color(0,255,0), color(0,255,255), color(0,0,255), color(255,0,255)];

  imgAdd = loadImage("images/add.png", function(){newScreenUpdate = true;});
  imgBack = loadImage("images/back.png", function(){newScreenUpdate = true;});
  imgMembers = loadImage("images/members.png", function(){newScreenUpdate = true;});
  imgOptions = loadImage("images/options.png", function(){newScreenUpdate = true;});
  imgRemove = loadImage("images/remove.png", function(){newScreenUpdate = true;});

  // for (var i = 0; i < 10; i++) {
  //   addTeam(Object.keys(teams).length.toString(), colors[Object.keys(teams).length%6]);
  // }

}

function draw() {
  screenUpdateNeeded = newScreenUpdate;

  if (screenUpdateNeeded) {
    background(0);
  }
  if (state == "teams overview") {
    renderOverview();
  } else if (state = "team settings") {
    teams[viewing].renderSettings();
  } else {
    fill(255);
    textSize(50);
    text("error",0,0,xScreenSize,yScreenSize);
  }

  screenUpdateNeeded = false;
  mouseWasClicked = false;
}
