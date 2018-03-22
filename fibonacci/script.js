var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var reeks = [[1],[1]];
var guldenSnede = 0;
var listOffset = 0;
var state = 0;
var zoom = 1;
var offX = 0;
var offY = 0;
var renderStep = 0;
var listOffsetNum1 = 22;
var listOffsetNum2 = 80;
var textSizeA = 40;
var lastKeyDownTime = 0;
var leftTextAlignment = false;

function setup() {
  createCanvas(xScreenSize, yScreenSize);
  while (verlengReeks()) {
    var nothing = 0
  }
}

function myAdd(inA, inB) {
  var returnVariab = [];
  var add1 = 0;
  var add2 = 0;
  var anwser = 0;
  var awnserList = [];
  var carry = 0;
  var i = 1;
  while ((inA[inA.length-i] !== undefined) || (inB[inB.length-i] !== undefined) || (carry > 0)) {
    if (inA[inA.length-i] === undefined) {
      add1 = 0;
    } else {
      add1 = inA[inA.length-i];
    }
    if (inB[inB.length-i] === undefined) {
      add2 = 0;
    } else {
      add2 = inB[inB.length-i];
    }
    anwser = add1 + add2 + carry;
    if (anwser >= 10) {
      carry = 1;
      anwser = anwser - 10;
    } else {
      carry = 0;
    }
    awnserList[awnserList.length] = anwser;

    i += 1;
  }
  for (var i = awnserList.length-1; i >= 0; i -= 1) {
    returnVariab[returnVariab.length] = awnserList[i]
  }
  return (returnVariab);
}

function smoothChange(now, goal, iterations) {
  return(now+((goal-now)/iterations));
}

function listToString(inA) {
  var returnVariab = '';
  for (var i = 0; i < inA.length; i++) {
    returnVariab += inA[i].toString();
  }
  return (returnVariab);
}

function listToInt(inA) {
  var returnVariab = 0;
  for (var i = 0; i < inA.length; i++) {
    returnVariab += inA[inA.length-i-1]*Math.pow(10, i);
  }
  return (returnVariab);
}

//listToString(reeks[i])

// function verlengReeks() {
//   if (reeks[reeks.length-2] + reeks[reeks.length-1] !== Infinity) {
//     reeks[reeks.length] = (reeks[reeks.length-2] + reeks[reeks.length-1]);
//     guldenSnede = reeks[reeks.length-1] / reeks[reeks.length-2];
//     return(true);
//   } return(false);
// }

function verlengReeks() {
  if (listToInt(myAdd(reeks[reeks.length-2], reeks[reeks.length-1])) !== Infinity) {
    reeks[reeks.length] = myAdd(reeks[reeks.length-2], reeks[reeks.length-1]);
    guldenSnede = listToInt(reeks[reeks.length-1]) / listToInt(reeks[reeks.length-2]);
    return(true);
  } return(false);
}

function Spaces(amount) {
  var returnVariab = ''
  for (var j = 0; j < amount; j++) {
    returnVariab += ' ';
  }
  return returnVariab;
}

function reeksRender(size) {
  if (keyIsDown(38)) { //up
    listOffset += size;
  } else if (keyIsDown(40)) { // down
    listOffset -= size;
  }
  textAlign(LEFT,BOTTOM);
  rectMode(CORNERS);
  fill(0);
  textSize(size);
  for (var i = 0; i < reeks.length; i++) {
    var yPos = listOffset+(i*-size);
    if ((yPos > 0) && (yPos < yScreenSize+size)) {
      var textToDisplay = (i+1).toString();
      textToDisplay += Spaces(((textToDisplay.length-listOffsetNum1)*-1));
      if (reeks[i].length > listOffsetNum2-listOffsetNum1-5) {
        textToDisplay += listToInt(reeks[i]).toString();
        textToDisplay += Spaces(((textToDisplay.length-listOffsetNum2)*-1));
      } else if (leftTextAlignment) {
        textToDisplay += Spaces((((textToDisplay.length-listOffsetNum2)+(listToString(reeks[i]).length+5))*-1));
        textToDisplay += listToString(reeks[i]);
        textToDisplay += '     '
      } else {
        textToDisplay += listToString(reeks[i]);
        textToDisplay += Spaces(((textToDisplay.length-listOffsetNum2)*-1));
      }
      if (i != 0) {
        textToDisplay += listToInt(reeks[i]) / listToInt(reeks[i-1]).toString();
      }
      // textToDisplay += Spaces(((textToDisplay.length-65)*-1));
      // textToDisplay += 'a';
      textFont('Courier New');
      text(textToDisplay, 0, listOffset+(i*-size));
    }
  }
  fill(255,255,255,222);
  stroke(0);
  rect(0,-5,xScreenSize,(size+5)*2)
  fill(0);
  var textToDisplay = ' reeks index';
  textToDisplay += Spaces(((textToDisplay.length-listOffsetNum1+1)*-1));
  textToDisplay += '| reeks getal';
  textToDisplay += Spaces(((textToDisplay.length-listOffsetNum2+1)*-1));
  textToDisplay += '| phi berekend met reeks getallen';
  text(textToDisplay,0,size);
  fill(0);
  var textToDisplay = 'beste berekend: ' + (reeks.length-1+1).toString();
  textToDisplay += Spaces(((textToDisplay.length-listOffsetNum1)*-1));
  textToDisplay += listToInt(reeks[reeks.length-1]).toString();
  textToDisplay += Spaces(((textToDisplay.length-listOffsetNum2)*-1));
  textToDisplay += guldenSnede.toString();
  text(textToDisplay,0,size*2);
  stroke(0);
  if (!keyIsDown(88)){ //not x
    listOffset += 1;
  }
  if (listOffset > (reeks.length*size)+yScreenSize) {
    listOffset = 0;
  }
}

function rechthoekRender() {
  var iterations = 50; // max dingen laten zien
  if (renderStep <= iterations) {
      iterations = Math.floor(renderStep);
  }
  if (reeks.length < iterations) {
    iterations = reeks.length;
  }
  if (keyIsDown(187)) { // +
    zoom = zoom * 1.05;
  } else if (keyIsDown(189)) { // -
    zoom = zoom * 0.95;
  }
  if (keyIsDown(37)) { // left
    offX += 5;
  } else if (keyIsDown(39)) { // right
    offX -= 5;
  }
  if (keyIsDown(38)) { // UP
    offY += 5;
  } else if (keyIsDown(40)) { // DOWN
    offY -= 5;
  }
  if (keyIsDown(221)) { // ]
    renderStep += 1;
  } else if (keyIsDown(219)) { // [
    renderStep -= 1;
    if (renderStep < 0) {
      renderStep = 0;
    }
  }
  if (keyIsDown(67)) { // c
    offX = 0;
    offY = 0;
  }
  if (keyIsDown(86) || (lastKeyDownTime > 50)) { // v
    offX = smoothChange(offX, 0, 5);
    offY = smoothChange(offY, 0, 5);
  }
  translate(xScreenSize/2 + offX,yScreenSize/2 + offY);
  rectMode(CORNERS);
  ellipseMode(RADIUS);
  stroke(0);
  noFill();
  var lastX = 0;
  var lastY = 0;
  var nowX = 0;
  var nowY = 0;
  for (var i = 0; i < iterations; i++) {
//    listToInt(reeks[i])
    if (i % 4 < 2) {
      nowX -= listToInt(reeks[i])*zoom;
    } else {
      nowX += listToInt(reeks[i])*zoom;
    }
    if ((i+1) % 4 < 2) {
      nowY -= listToInt(reeks[i])*zoom;
    } else {
      nowY += listToInt(reeks[i])*zoom;
    }
    noFill();
    rectMode(CORNERS);
    stroke(0);
    rect(lastX,lastY,nowX,nowY);
    if (i%2 == 0) {
      arc(nowX, lastY, listToInt(reeks[i])*zoom, listToInt(reeks[i])*zoom, (HALF_PI*3) - (HALF_PI*(i % 4)), (HALF_PI*4) - (HALF_PI*(i % 4)));
    } else {
      arc(lastX, nowY, listToInt(reeks[i])*zoom, listToInt(reeks[i])*zoom, (HALF_PI*3) - (HALF_PI*(i % 4)), (HALF_PI*4) - (HALF_PI*(i % 4)));
    }
    textSize(listToInt(reeks[i])*zoom/3);
    noStroke();
    fill(0,0,200,255);
    rectMode(CENTER);
    text((listToInt(reeks[i])).toString(), (lastX+nowX)/2, (lastY+nowY)/2);
    lastX = nowX;
    lastY = nowY;
  }
  if (iterations % 4 < 2) {
    nowX -= listToInt(reeks[iterations])*zoom;
  } else {
    nowX += listToInt(reeks[iterations])*zoom;
  }
  if ((iterations+1) % 4 < 2) {
    nowY -= listToInt(reeks[iterations])*zoom;
  } else {
    nowY += listToInt(reeks[iterations])*zoom;
  }
  noFill();
  stroke(0,0,0,(renderStep%1)*255);
  rectMode(CORNERS);
  rect(lastX,lastY,nowX,nowY);
  if (true) {
    if (iterations%2 == 0) {
      arc(nowX, lastY, listToInt(reeks[iterations])*zoom, listToInt(reeks[iterations])*zoom, (HALF_PI*4) - (HALF_PI*(i % 4)) - (((renderStep)%1)*HALF_PI), (HALF_PI*0) - (HALF_PI*(i % 4)));
    } else {
      arc(lastX, nowY, listToInt(reeks[iterations])*zoom, listToInt(reeks[iterations])*zoom, (HALF_PI*4) - (HALF_PI*(i % 4)) - (((renderStep)%1)*HALF_PI), (HALF_PI*0) - (HALF_PI*(i % 4)));
    }
  }
  textSize(listToInt(reeks[iterations])*zoom/3);
  rectMode(CENTER);
  noStroke();
  fill(0,0,200,(renderStep%1)*255);
  textAlign(CENTER,CENTER);
  text((listToInt(reeks[iterations])).toString(), (lastX+nowX)/2, (lastY+nowY)/2);
  // console.log((HALF_PI*-1) - (HALF_PI*(i % 4)) + (((0.5+renderStep)%1)*PI));
  // lastX = nowX;
  // lastY = nowY;
  if (!keyIsDown(88)){ //not x
    if (state != 3){renderStep += 0.01;}
    renderStep += 0.01;
  }
}

function keyPressed() {
  if (keyIsDown(32)) {// spaceBar
    state = state+1;
    if (state > 3) {
      state = 0;
    }
  } else if (keyIsDown(76)) { // l
    leftTextAlignment = !leftTextAlignment;
  }
}

function animatie(animType) {
  if (!keyIsDown(88)) {
    if (animType == 0) {
      if (animState == 0) {
        if (listOffset > yScreenSize*3.5) {
          animState = 1;
          renderStep = 1;
        }
      } else if (animState == 1) {
        if (renderStep > 9) {
          if (zoom < 0.005) {
            animState = 0;
          }
          zoom = zoom * 0.99;
        } else {
          zoom = 13;
        }
      } else {
        state = 0;
      }
      stateA(animState);
    } else if (animType == 1) {
      zoom = 25;
      stateA(1);
      if (renderStep > 10) {
        renderStep = 0;
      }
    }
  }
}

function stateA(nowState) {
  if (nowState == 0) {
    background(255,255,255,255);
    // verlengReeks();
    reeksRender(textSizeA/2); // max to fit on screen = 40;
    renderStep = 10;
    zoom = 1;
    offX = 0;
    offY = 0
  } else {
    // verlengReeks();
    background(255);
    rechthoekRender();
    listOffset = yScreenSize/2;
  }
}

var animState = 0;

function draw() {
  if (state == 0) {
    stateA(0);
  } else if (state == 1) {
    stateA(1);
  } else if (state == 2) {
    animatie(0);
  } else if (state == 3) {
    animatie(1);
  }
  if (keyIsPressed === true) {
    lastKeyDownTime = 0;
  }
  lastKeyDownTime += 1;
}
