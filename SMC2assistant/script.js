var VA1, V1td, VA2, V2l, V2n;

window.addEventListener("DOMContentLoaded", function() {
  VA1 = document.getElementById("VA1");
  VA1.onchange = function() {
    document.getElementById("TVva").innerHTML = this.selectedIndex.toString();
  }
  V1l = document.getElementById("V1l");
  V1l.onchange = function () {
    changeBinaryValue(this.selectedIndex);
  }
  V1n.onchange = function () {
    if (this.value > 255) {
      this.value = 255;
      alert("The value is 8 bit, so it cant be higher than 63.");
    } else if (this.value < 0) {
      this.value = 0;
      alert("The value is unsigned, so it cant be negative.");
    }
    changeBinaryValue(this.value);
  }
  VA2 = document.getElementById("VA2");
  VA2.onchange = function() {
    document.getElementById("TAar").innerHTML = this.selectedIndex.toString();
  }
  V2l = document.getElementById("V2l");
  V2l.onchange = function () {
    changeBinaryAddress(this.selectedIndex);
  }
  V2n = document.getElementById("V2n");
  V2n.onchange = function () {
    if (this.value > 63) {
      this.value = 63;
      alert("The address is 6 bit, so it cant be higher than 63.");
    } else if (this.value < 0) {
      this.value = 0;
      alert("The address is unsigned, so it cant be negative.");
    }
    changeBinaryAddress(this.value);
  }
}, false);

function changeBinaryAddress(address) {
  var binString = parseInt(address).toString(2);
  console.log(binString);
  for (var i = binString.length; i < 6; i++) {
    binString = "0" + binString;
  }
  for (var i = 5; i >= 0; i--) {
    document.getElementById("TAb" + (i+1).toString()).innerHTML = binString[-i+5];
  }
  if (address < 16) {
    V2l.selectedIndex = address;
  } else {
    V2l.selectedIndex = 16;
  }
  V2n.value = address;
}

function changeBinaryValue(value) {
  var binString = parseInt(value).toString(2);
  console.log(binString);
  for (var i = binString.length; i < 8; i++) {
    binString = "0" + binString;
  }
  for (var i = 7; i >= 0; i--) {
    document.getElementById("TVb" + (i+1).toString()).innerHTML = binString[-i+7];
  }
  if (value < 16) {
    V1l.selectedIndex = value;
  } else {
    V1l.selectedIndex = 16;
  }
  V1n.value = value;
}
