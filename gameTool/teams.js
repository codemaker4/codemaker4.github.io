class team{
  constructor(_name, _color) {
    this.name = _name;
    this.color = _color;
    if (lightness(this.color) > 30) {
      this.textColor = 0;
    } else {
      this.textColor = 255;
    }
    this.members = [];
    this.score = 0;
  }
  renderBar(barX, barY, barW, barH) {
    fill(this.color);
    noStroke();
    rect(barX, barY, barW, barH);

    var teamText = this.name + ". Score: " + this.score.toString() + ". Members: ";
    if (this.members.length != 0) {
      for (var i = 0; i < this.members.length; i ++) {
        teamText += this.members[i]
        if (i < this.members.length-1) {
          teamText += ", "
        }
      }
    }
    fill(this.textColor);
    textSize(50);
    text(teamText, barX, barY, barW-barH, barH);

    fill(255,255,255);
    stroke(0);
    strokeWeight(10);
    if (button(barX+barW-(barH/2), barY, barH/2, barH, imgOptions)) {
      state = "team settings";
      viewing = this.name;
    }
    fill(0,255,0);
    if (button(barX+barW-barH, barY, barH/2, barH/2, imgAdd)) {
      this.score += 1;
    }
    fill(255,0,0);
    if (button(barX+barW-barH, barY+(barH/2), barH/2, barH/2, imgRemove)) {
      this.score -= 1;
    }
  }
  renderSettings() {
    background(this.color);

    fill(this.textColor);
    noStroke();
    textSize(50);
    var teamText = this.name + ". Score: " + this.score.toString() + ". Members: ";
    if (this.members.length != 0) {
      for (var i = 0; i < this.members.length; i ++) {
        teamText += this.members[i]
        if (i < this.members.length-1) {
          teamText += ", "
        }
      }
    }
    text(teamText,0,0,xScreenSize,yScreenSize-(xScreenSize));

    fill(0,255,0);
    stroke(0);
    strokeWeight(10);
    if (button(0, yScreenSize-xScreenSize, xScreenSize/2, xScreenSize/2, imgAdd)) {
      this.score += 1;
    }
    fill(255,0,0);
    if (button(xScreenSize/2, yScreenSize-xScreenSize, xScreenSize/2, xScreenSize/2, imgRemove)) {
      this.score -= 1;
    }
    fill(255);
    if (button(0, yScreenSize-(xScreenSize/2), xScreenSize/2, xScreenSize/2, imgBack)) {
      state = "teams overview";
    }
    fill(0,0,255);
    if (button(xScreenSize/2, yScreenSize-(xScreenSize/2), xScreenSize/2, xScreenSize/2, imgMembers)) {
      var newName = prompt("Anter a name here:");
      if (newName !== null) {
        this.members[this.members.length] = newName;
      }
    }
  }
}
