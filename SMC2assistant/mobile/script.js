function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

var Prgmstr = getUrlVars()["prgm"]
var Prgm = []

for (var i = 0; i < Prgmstr.length; i+=2) {
  var binStr = parseInt(Prgmstr.substr(i,2), 16).toString(2);
  binStr = "0".repeat(8-binStr.length) + binStr;
  Prgm.push(binStr);
}

var lineAt = 0;

function showLine(lineN) {
  for (var i = 0; i < 8; i++) {
    document.getElementById("dig"+i.toString()).innerHTML = Prgm[lineN][i]
    if (Prgm[lineN][i] == "0") {
      document.getElementById("dig"+i.toString()).style.backgroundColor = "#F00";
    } else {
      document.getElementById("dig"+i.toString()).style.backgroundColor = "#0F0";
    }
  }
}

showLine(0);

function showNextLine() {
  lineAt += 1;
  if (lineAt >= Prgm.length) {
    lineAt = 0;
  }
  showLine(lineAt);
  document.getElementById("nextButton").innerHTML = lineAt.toString() + " next line";
}
