var DefLink = "https://codemaker4.github.io/SMC2assistant/mobile/index.html?prgm=";

var Startaddress = parseInt(document.getElementById("lineStart").value);
function lineStartChange() {
  Startaddress = parseInt(document.getElementById("lineStart").value);
  compile(true);
};

var qrcode = new QRCode("qrcode", {
    text: "http://jindo.dev.naver.com/collie",
    width: 500,
    height: 500,
    colorDark : "#000000",
    colorLight : "#ffffff",
    correctLevel : QRCode.CorrectLevel.H
});


var oldUserText = ""

function compile(force) {
  var userTextStr = document.getElementById("userCode").value;
  if (oldUserText == userTextStr && !force) {
    return
  }
  oldUserText = userTextStr;
  localStorage.setItem('unCompiledCode', userTextStr);
  var userText = userTextStr.split("\n");

  document.getElementById("indexLines").value = ""
  var counter = Startaddress;
  for (var i = 0; i < userText.length; i++) {// line counts
    if (userText[i].includes(" = ")) {
      document.getElementById("indexLines").value += counter.toString() + "-" + (counter+1).toString() + "\n";
      counter += 2;
    } else {
      document.getElementById("indexLines").value += counter.toString() + "\n"
      counter += 1;
    }
  }

  var variables = {"aluA": 0, "aluB": 1, "aluMode": 2, "aluOut": 3, "jump": 4, "userIO": 5, "netOwnAddr": 6, "netSendAddr": 7, "netSendData": 8, "netGotData": 9, "netRecData": 10, "diskAddr": 11, "diskWriteData": 12, "diskReadData": 13, "stackWrite": 14, "stackRead": 15}
  // var variables = {};

  for (var i = 0; i < userText.length; i++) { // line splits
    if (userText[i].includes(" = ")) {
      userText.splice(i+1, 0, userText[i].split(" = ")[1])
      userText[i] = userText[i].split(" = ")[0]
      i += 1;
    }
  }

  for (var i = 0; i < userText.length; i++) { // variable definitions
    if (userText[i].includes("var ")) {
      variables[userText[i].substring(userText[i].indexOf("var ")+4).split(" ")[0].split(";")[0]] = (i+Startaddress).toString(2);
      userText[i] = userText[i].substring(userText[i].indexOf("var ")+4).split(" ")[0].split(";")[1];
    }
  }

  for (var i = 0; i < userText.length; i++) { // variable uses
    for (var varName in variables) {
      if (userText[i].includes("@" + varName)) {
        userText[i] = userText[i].replace("@"+varName, "%" + variables[varName].toString(2));
      }
    }
  }

  for (var i = 0; i < userText.length; i++) { // binary conversion
    if (userText[i].includes("#")) {
      var numFound = userText[i].substring(userText[i].indexOf("#")+1).split(" ")[0]
      userText[i] = userText[i].substring(0,userText[i].indexOf("#")) + "%" + parseInt(numFound).toString(2);
    }
  }

  for (var i = 0; i < userText.length; i++) { // binary convertion full
    if (userText[i].substring(0,1) == "!") {
      userText[i] = userText[i].substring(1);
      if (userText[i].substring(0,1) == "#") {
        userText[i] = "%" + parseInt(userText[i].substring(1)).toString(2);
      }
      if (userText[i].substring(0,1) == "%") {
        var bin = userText[i].substring(1);
        console.log(bin);
        bin = "0".repeat(8-bin.length) + bin;
        userText[i] = bin;
      }
    } else if (i%2 == 0) {
      var bin = ""
      if (userText[i].includes("$")) {
        bin += "1"
        userText[i] = userText[i].replace("$", "");
      } else {
        bin += "0"
      }
      if (userText[i+1].includes("$")) {
        bin += "1"
        userText[i+1] = userText[i+1].replace("$", "");
      } else {
        bin += "0"
      }
      if (userText[i].includes("%")) {
        userText[i] = userText[i].replace("%","");
      }
      bin += "0".repeat(6-userText[i].length) + userText[i];
      userText[i] = bin;
    } else if (i%2 == 1) {
      if (userText[i].includes("%")) {
        userText[i] = userText[i].replace("%","");
      }
      userText[i] = "0".repeat(8-userText[i].length) + userText[i];
    } else {
      userText[i] = "err"
    }
  }

  document.getElementById("compiledCode").value = ""; // show binary
  for (var i = 0; i < userText.length; i++) {
    document.getElementById("compiledCode").value += userText[i]+"\n"
  }

  var hexString = ""
  for (var i = 0; i < userText.length; i++) {
    var hex = parseInt(userText[i],2).toString(16);
    hex = "0".repeat(2-hex.length) + hex
    console.log(hex);
    hexString += hex;
  }
  console.log(DefLink + hexString);
  qrcode.makeCode(DefLink + hexString);
  document.getElementById("qrcode").onclick = function() {window.open(DefLink + hexString);};
  console.log(document.getElementById("qrcode").onclick);
}

document.getElementById("userCode").value = localStorage.getItem("unCompiledCode");

setInterval(compile, 100);

function loadProgram(prgmName) {
  document.getElementById("userCode").value = programLib[prgmName];
  compile(true);
}
