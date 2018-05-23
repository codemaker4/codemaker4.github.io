var xScreenSize = innerWidth - 5; // canvas size
var yScreenSize = innerHeight - 5;
var pixelWorld = []; // stores the world heights and shadows as a list
var chunks = []; // stores chunks, containing an image, an position and oter info
var chunksDone = []; // stores what chunks have been generated and their index in the cunks list. called as: (chunks[chunksDone[x][y]]), X and Y refer to the RealWorld position of the Top left of the chunk/chunkSize
var resToCalc = 5;
var chunkSize = 100;
var viewX = 0;
var viewY = 0;
var lowresChunksExist = true;
var pixSizeSteps = [20,10,5,1,0.5,0.1,0.05];
var beginTickTime = new Date().getTime();
var tickRate = 60;
var mouseDownX = 0;
var mouseDownY = 0;
var mouseDownViewX = 0;
var mouseDownViewY = 0;
var calculationString = "return x+y"
var calculation = new Function("x", "y", calculationString);
var notAllowedInCalculationString = ['creen','inner','pix','Pix','world','hunk','view','ick','ouse','calc','Calc','setup','anvas','Date','ge','Index','getXY','isDone','background','mage','move','buttonWasPressed','key','draw','text','stroke','fill','clear','color','arc','ellipse','line','point','quad','rect','triabgle','mooth','bezier','curve','begin','end','ertex','plane','box','sphere','cylinder','cone','ellipsoid','torus','loop','load','pop','push','redraw','ursor','display','window','width','height','Density','URL','Element','raphics','atrix','rotate','scale','shear','translate','tint','Tint','blend','copy','filter','get','set','http','save','day','hour','minute','millis','month','second','year','ector'];

var neededInCalculationString = ['return'];

document.addEventListener('contextmenu', event => event.preventDefault()); // prevent rightclick menu to make rihtclick control less annoying to use.

function setup() { // p5 setup
  createCanvas(xScreenSize, yScreenSize);
  noSmooth();
}

function calcPixel(x,y) {
  var doneCalc = calculation(x, -y); // vertical flip, if not flipped graphs will be upsideDown.
  if (typeof doneCalc === 'boolean') {
    if (doneCalc) {
      return([255,255,255]);
    }
    return([0,0,0]);
  } if (!isNaN(doneCalc)) { // 'if notnot a number' is the same as 'if a number' ;)
    return([doneCalc,doneCalc,doneCalc]);
  } if (typeof doneCalc === 'object') {// array
    return(doneCalc)
  }
  return([NaN,NaN,NaN]);
}

function setCalculation() {
  calculationString = prompt('enter JavaScript calculation here, using variables "x" and "y":', calculationString)
  var evaluatedCalculation = evaluateCalculation();
  while (evaluatedCalculation !== true) {
    calculationString = prompt(evaluatedCalculation, calculationString)
    evaluatedCalculation = evaluateCalculation();
  }
  calculation = new Function("x", "y", calculationString);
  chunks = [];
  chunksDone = [];
  pixelWorld = [];
  viewX = 0;
  viewY = 0;
}

function evaluateCalculation() {
  if (calculationString.indexOf('//F') !== -1) {
    return(true);
  }
  for (var i = 0; i < neededInCalculationString.length; i++) {
    if (calculationString.indexOf(neededInCalculationString[i]) === -1) {
      return('Your formula returns nothing. To return the awnser of your formula, use "return [formulaAwnser]". If you want to view the formula anyway, add "//F" to the end of the formula.');
    }
  }
  for (var i = 0; i < notAllowedInCalculationString.length; i++) {
    if (calculationString.indexOf(notAllowedInCalculationString[i]) !== -1) {
      console.log('"' + notAllowedInCalculationString[i] + '" is not allowed.');
      return('There is a chance that you are using a variable/function that, when changed/called, can crash the program. make sure all your own variables begin with "my" or rename them completely. If you want to view the formula anyway, add "//F" to the end of the formula.');
    }
  }
  return(true);
}

function mouseInArea(x,y,x2,y2) {
  return(mouseX >= x && mouseX <= x2 && mouseY >= y && mouseY <= y2);
}

function setTickRate(newTickRate) {
  tickRate = newTickRate;
  moveSpeed = 50/newTickRate;
}

function ticksPassed(oldDate) {
  if ((new Date().getTime() - oldDate)/1000*tickRate < 10) { // no lag detection
    return((new Date().getTime() - oldDate)/1000*tickRate);
  }
  return(1); // in extreme lag situations
}

function prepWorldPixel(x,y) { // prepares worldPixel at spicific location to stop undefined errors. returns true if new pixels where prepared, else returns false.
  if (pixelWorld[x] === undefined) {
    pixelWorld[x] = [];
  }
  if (pixelWorld[x][y] === undefined) {
    pixelWorld[x][y] = [undefined, undefined];
    return(true);
  }
  return(false);
}

function getWorldPixel(x,y) { // returns the data from the selected worldPixel and makes a new pixel if needed
  prepWorldPixel(x,y);
  return(pixelWorld[x][y])
}

function setWorldPixel(x, y, data) { // sets the selected world pixel. returns true if a new pixel was made
  var madeNew = prepWorldPixel(x,y);
  pixelWorld[x][y] = data;
  return(madeNew);
}

function getWorldHeight(x,y) { // returns the world height and generates the pixel if nessesary
  if (getWorldPixel(x,y)[0] === undefined) {
    pixelWorld[x][y][0] = calcPixel(x,y);
  }
  return(pixelWorld[x][y][0]);
}

function setWorldPixels(xPos,yPos, width,height, data) { // sets a rectangle of worldpixels to the same given value
  for (var x = xPos; x < xPos+width; x++) {
    for (var y = yPos; y < yPos+height; y++) {
      setWorldPixel(x,y,data);
    }
  }
}

function onScreen(x,y) {
  return(x>=-chunkSize && x<xScreenSize+chunkSize && y>=-chunkSize && y<yScreenSize+chunkSize);
}

function getIndex(x,y,width) {
  return(x+y*width);
}

function getXY(index, width) {
  return([index%width,Math.floor(index/width)]);
}

function chunk(initX, initY, xSize, ySize) {
  this.xPos = initX;
  this.yPos = initY;
  this.xSize = xSize;
  this.ySize = ySize;
  this.nexChunkImgPixSizeStep = 0
  this.nextChunkImgPixSize = pixSizeSteps[this.nexChunkImgPixSizeStep];
  this.nextChunkImgGenIteration = 0;
  this.chunkImg = createImage(1,1);
  this.nextChunkImg = createImage(Math.ceil(this.xSize/this.nextChunkImgPixSize), Math.ceil(this.ySize/this.nextChunkImgPixSize));
  this.isDone = false;

  this.genPartChunk = function (startIteration, iterations){
    if (this.isDone) {
      return([false, false]);
    }
    this.nextChunkImg.loadPixels();

    var i = startIteration;
    while (ticksPassed(beginTickTime) < 1) {
    // for (var i = 0; i < 10000; i+=4) {
      if (i >= this.nextChunkImg.pixels.length || i >= startIteration + iterations) {
        this.nextChunkImgGenIteration = i;
        break;
      }
      var currentPos = getXY(i/4, Math.ceil(this.xSize/this.nextChunkImgPixSize));
      var data = getWorldHeight(currentPos[0]*this.nextChunkImgPixSize+this.xPos,currentPos[1]*this.nextChunkImgPixSize+this.yPos);
      this.nextChunkImg.pixels[i] = data[0];
      this.nextChunkImg.pixels[i+1] = data[1];
      this.nextChunkImg.pixels[i+2] = data[2];
      this.nextChunkImg.pixels[i+3] = 255;
      i+=4;
    }

    this.nextChunkImg.updatePixels();

    if (this.nextChunkImgGenIteration == this.nextChunkImg.pixels.length) {
      this.chunkImg = this.nextChunkImg;
      this.nexChunkImgPixSizeStep += 1;
      if (this.nexChunkImgPixSizeStep > pixSizeSteps.length) {
        this.nexChunkImgPixSizeStep = pixSizeSteps.length-1;
        this.isDone = true;
      }
      this.nextChunkImgPixSize = pixSizeSteps[this.nexChunkImgPixSizeStep];
      this.nextChunkImgGenIteration = 0;
      this.nextChunkImg = createImage(Math.ceil(this.xSize/this.nextChunkImgPixSize), Math.ceil(this.ySize/this.nextChunkImgPixSize));
      return([true, true]);
    }
    return([true, false]);
    // return(chunkImg);
  }
}

function getChunk(x,y) {
  if (chunksDone[Math.floor(x/chunkSize)] === undefined) {
    chunksDone[Math.floor(x/chunkSize)] = [];
  } if (chunksDone[Math.floor(x/chunkSize)][Math.floor(y/chunkSize)] === undefined) {
    // chunksDone[Math.floor(x/chunkSize)][Math.floor(y/chunkSize)] = ;
    newChunk(x,y);
  }
  return(chunksDone[Math.floor(x/chunkSize)][Math.floor(y/chunkSize)]);
}

function prepChunk(x,y) {
  if (chunksDone[Math.floor(x/chunkSize)] === undefined) {
    chunksDone[Math.floor(x/chunkSize)] = [];
  } if (chunksDone[Math.floor(x/chunkSize)][Math.floor(y/chunkSize)] === undefined) {
    // chunksDone[Math.floor(x/chunkSize)][Math.floor(y/chunkSize)] = ;
    newChunk(x,y);
    return(true)
  }
  return(false);
}

function newChunk(x,y) {
  chunksDone[Math.floor(x/chunkSize)][Math.floor(y/chunkSize)] = chunks.length;
  chunks[chunks.length] = new chunk(Math.floor(x/chunkSize)*chunkSize, Math.floor(y/chunkSize)*chunkSize, chunkSize, chunkSize);
  lowresChunksExist = true;
}

function prepChunkArea(x,y,x2,y2) {
  for (var i = x; i < x2; i+= chunkSize) {
    for (var j = y; j < y2; j+= chunkSize) {
      prepChunk(i,j);
    }
  }
}

function renderChunks() {
  background(255);
  for (var i = 0; i < chunks.length; i++) {
    image(chunks[i].chunkImg,chunks[i].xPos+viewX,chunks[i].yPos+viewY,chunks[i].xSize,chunks[i].ySize);
  }
}

function genChunks() {
  var chunksUpdated = 0;
  for (var r = 0; r < pixSizeSteps.length && ticksPassed(beginTickTime) < 1; r++) {
    // pixSizeSteps[i]
    var i = 0;
    while (ticksPassed(beginTickTime) < 1) {
      if (onScreen(chunks[i].xPos+viewX, chunks[i].yPos+viewY) || onScreen(chunks[i].xPos+viewX+chunkSize, chunks[i].yPos+viewY+chunkSize)) {
        if (chunks[i].nextChunkImgPixSize >= pixSizeSteps[r]) { // priority
          var generated = chunks[i].genPartChunk(chunks[i].nextChunkImgGenIteration, 1000);
          if (generated[0]) {
            chunksUpdated += 1;
          }
        }
      }
      i ++;
      if (i >= chunks.length) {
        lowresChunksExist = false;
        break;
      }
    }
  }
}

function setCalculationButton() {
  stroke(0);
  fill(255);
  rect(0,0,50,50);
  noStroke();
  fill(0);
  rect(0,20,50,10);
  rect(20,0,10,50);
}

function move() {
  if (keyIsDown(87)) { // w
    viewY += 5;
  } else if (keyIsDown(83)) { // s
    viewY -= 5;
  } if (keyIsDown(65)) { // a
    viewX += 5;
  } else if (keyIsDown(68)) { // d
    viewX -= 5;
  }
}

var buttonWasPressed = false;

function mousePressed() {
  if (mouseInArea(0,0,50,50) && mouseIsPressed) {
    setCalculation();
    buttonWasPressed = true;
  } else {
    mouseDownX = mouseX;
    mouseDownY = mouseY;
    mouseDownViewX = viewX;
    mouseDownViewY = viewY;
    buttonWasPressed = false;
  }
}

function mouseDragged() {
  if (!buttonWasPressed) {
    viewX = mouseDownViewX + (mouseDownX-mouseX)*-1;
    viewY = mouseDownViewY + (mouseDownY-mouseY)*-1;
  }
}

function keyReleased() {
  buttonWasPressed = false;
}

function draw(){ // p5 loop
  beginTickTime = new Date().getTime();
  move();
  prepChunkArea(-viewX, -viewY, -viewX+xScreenSize, -viewY+yScreenSize);
  genChunks();
  renderChunks();
  setCalculationButton();
  textAlign(LEFT);
  fill(255);
  stroke(0);
  strokeWeight(2);
  textSize(50);
  text('x:' + (mouseX-viewX).toString(),0,100);
  text('y:' + -(mouseY-viewY).toString(),0,150);
  text('val:' + calcPixel(mouseX-viewX, mouseY-viewY).toString(),0,200);
}
