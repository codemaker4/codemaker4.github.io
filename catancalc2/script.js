var inventory = [0,0,0,0,0,0];
var buildings = [0,0,0,0,0];
const Names = ["hout", "graan", "baksteen", "schaap", "ijzer", "geld"];
const BuildNames = ["bos", "weiland", "baksteenfabriek", "boederij", "mijn"];
const BuildPrices = [[1,4],[0,1],[3,4],[2,3],[0,2]];
const PriceAmount = 2;
var MyID = prompt("Ga naar Thijs voor je ID");
while (isNaN(parseInt(MyID)) || MyID <0) {
  MyID = prompt("Dat is geen geldig ID. Ga naar Thijs voor je ID.");
}
var nextSendID = 0;
var recievedIDs = [];
const SpelleiderHoeveelheid = 5;
const TotalThingCount = Names.length+BuildNames.length;

var defBuilding = prompt("begingebouw?");
if (defBuilding) {
  buildings[parseInt(defBuilding)] += 1;
}

inventory[5] = parseInt(prompt("hoeveel geld"));
while (isNaN(inventory[5]) || inventory[5] <0) {
  inventory[5] = parseInt(prompt("Dat is geen getal lol, hoeveel geld?"));
}

function calcScore() {
  var score = 0;
  for (var i = 0; i < inventory.length-1; i++) {
    score += inventory[i]*25;
  }
  for (var i = 0; i < buildings.length; i++) {
    score += buildings[i]*200;
  }
  return score;
}

function redrawInf() {
  var string = "Jouw ID: "
  if (parseInt(MyID) < SpelleiderHoeveelheid) {
    string += MyID + ", spelleider<br>"
  } else {
    string += MyID + "<br>";
  }
  string += "jouw score: " + calcScore().toString() + '<br>';
  string += "<h3>jouw grondstoffen:</h3><ul>";
  for (var i = 0; i < inventory.length; i++) {
    string += "<li>" + Names[i] + ": " + inventory[i].toString() + "</li>";
  }
  string += "</ul><h3>jouw gebouwen:</h3><ul>";
  for (var i = 0; i < buildings.length; i++) {
    string += "<li>" + BuildNames[i] + ": " + buildings[i].toString() + "</li>";
  }
  string += "</ul><h3>instellingen:</h3>"
  document.getElementById('mainDiv').innerHTML = string;
}

function doRound() {
  for (var i = 0; i < buildings.length-1; i++) {
    inventory[i] += buildings[i];
  }
  redrawInf();
}

setInterval(doRound, 3*60*1000) // ronde iedere 3 minuten

function give() {// MyID.transID.otherID.transType.amount.all+%7
  var idToSendTo = prompt("Geeft de ID van het persoon waarnaar je dit stuurt. De ID staat op het scherm van de ontvanger, onder de geef knop");
  if (!idToSendTo) {
    alert("geannuleerd");
    return
  }
  idToSendTo = parseInt(idToSendTo);
  if (isNaN(idToSendTo) || idToSendTo < 0) {
    alert("Dat is geen getal. Het ID moet een getal zijn.")
    return
  }
  if (parseInt(MyID) == idToSendTo) {
    alert("Je kan niks naar jezelf versturen. Voer het ID van de ander in.")
    return
  }
  var typeToSend = prompt("Wat wil je versturen? geef een getal:\n1:hout\n2:graan\n3:baksteen\n4:schaap\n5:ijzer\n6:geld\n7:bos\n8:weiland\n9:baksteenfabriek\n10:boederij\n11:mijn");
  if (!typeToSend) {
    alert("geannuleerd");
    return
  }
  typeToSend = parseInt(typeToSend)
  if (isNaN(typeToSend)) {
    alert("Dat is geen getal. Voer een getal in. Geannuleerd.")
    return
  }
  if (typeToSend <= 0 || typeToSend > TotalThingCount) {
    alert("Dat getal is niet een van de opties. Geannuleerd.")
    return;
  }
  if (typeToSend <=Names.length) {
    var amount = prompt("Hoeveel " + Names[typeToSend-1] + " wil je geven? ");
  } else {
    var amount = prompt("Hoeveel " + BuildNames[typeToSend-7] + " wil je geven?");
  }
  if (!amount) {
    alert("geannuleerd");
    return
  }
  amount = parseInt(amount);
  if (isNaN(amount)) {
    alert("Dat is geen getal. Geannuleerd.");
    return
  }
  if (amount <= 0) {
    alert("Je mag niet 0 of minder dingen versturen. Als je iets wilt ontvangen moet je op ontvangen drukken, en moet de ander op geven drukken.")
    return
  }
  typeToSend -= 1;
  if (parseInt(MyID) >= SpelleiderHoeveelheid) {
    if (typeToSend < Names.length) {
      if (inventory[typeToSend] < amount) {
        alert("Je hebt niet genoeg " + Names[typeToSend] + ". Geannuleerd");
        return
      }
      inventory[typeToSend] -= amount;
    } else {
      if (buildings[typeToSend-Names.length] < amount) {
        alert("Je hebt niet genoeg " + BuildNames[typeToSend-Names.length] + ". Geannuleerd");
        return
      }
      buildings[typeToSend-Names.length] -= amount;
    }
  } else {
    alert("spelleiderToegang");
  }
  var confNum = ((parseInt(MyID)+nextSendID+idToSendTo+typeToSend+amount)%7).toString();
  var sendCode = MyID + "." + nextSendID.toString() + "." + idToSendTo.toString() + "." + typeToSend.toString() + "." + amount.toString() + "." + confNum;
  alert("Dit is de code:\n" + sendCode + "\nDruk pas op ok wanneer het succesfol is ontvangen. De ander moet op ontvangen drukken en deze code invoeren. Als het niet lukt, ga naar Thijs.");
  nextSendID += 1;
  redrawInf();
}

function buyBuilding() {
  var priceText = "Welk gebouw wil je kopen? Geeft het getal voor het gebouw.\n";
  for (var i = 0; i < BuildNames.length; i++) {
    priceText += (i+1).toString() +": "+ BuildNames[i] +", kost: "+ PriceAmount.toString() +" "+ Names[BuildPrices[i][0]] +", "+ PriceAmount.toString() +" "+ Names[BuildPrices[i][1]] +"\n";
  }
  var buildingToBuy = prompt(priceText);
  if (!buildingToBuy) {
    alert("Geannuleerd.");
    return
  }
  buildingToBuy = parseInt(buildingToBuy)
  if (isNaN(buildingToBuy)) {
    alert("Dat is geen getal. Geef een getal om aan te geven welk gebouw je wilt kopen. Geannuleerd");
    return
  }
  if (buildingToBuy <= 0 || buildingToBuy > BuildNames.length) {
    alert("Dat was niet een van de opties. Geef een getal om aan te geven welk gebouw je wilt kopen. Geannuleerd")
    return
  }
  buildingToBuy -= 1;
  if (parseInt(MyID) >= SpelleiderHoeveelheid) {
    if (inventory[BuildPrices[buildingToBuy][0]] < PriceAmount) {
      alert("Je hebt niet genoeg "+ Names[BuildPrices[buildingToBuy][0]] +" om een "+ BuildNames[buildingToBuy] +" te kopen. Geannuleerd");
      return
    }
    if (inventory[BuildPrices[buildingToBuy][1]] < PriceAmount) {
      alert("Je hebt niet genoeg "+ Names[BuildPrices[buildingToBuy][1]] +" om een "+ BuildNames[buildingToBuy] +" te kopen. Geannuleerd");
      return
    }
    inventory[BuildPrices[buildingToBuy][0]] -= PriceAmount;
    inventory[BuildPrices[buildingToBuy][1]] -= PriceAmount;
  }
  buildings[buildingToBuy] += 1;
  alert("Er is een "+ BuildNames[buildingToBuy] +" gekocht.");
  redrawInf();
}

function recieve() { // otherID.transID.MyID.transType.amount.all+%7
  var recievedString = prompt("Om iets te ontvangen drukt de ander op 'geef' en krijgt een code. Voer die code hier in.", "1.2.3.4.5.6");
  if (!recievedString) {
    alert("geannuleerd");
    return;
  }
  var recievedList = recievedString.split(".");
  if (recievedList.length !== 6) {
    alert("de code heeft te weinig of te veel punten '.' . Het moet lijken op bijvoorbeeld '1.2.3.4.5.6' . Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. de verzender moet NIET op annuleren drukken, maar gewoon de code houden. Als dit vaak niet wertk, ga dan naar Thijs")
    return;
  }
  var confNum = 0;
  for (var i = 0; i < recievedList.length; i++) {
    recievedList[i] = parseInt(recievedList[i]);
    if (isNaN(recievedList[i])) {
      alert("De code is ongeldig. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. de verzender moet NIET op annuleren drukken, maar gewoon de code houden. Als dit vaak niet wertk, ga dan naar Thijs")
      return
    }
    if (i < 5) {
      confNum += recievedList[i];
    }
  }
  if (recievedList[0].toString === MyID) {
    alert("Het lijkt er op dat je iets aan jezelf prpbeert te geven. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. de verzender moet NIET op annuleren drukken, maar gewoon de code houden. Als dit vaak niet wertk, ga dan naar Thijs");
    return;
  }
  var fTransID = recievedList[0].toString()+";"+recievedList[1].toString()
  if (recievedIDs.includes(fTransID)) {
    alert("Deze code is al een keer ingevoerd. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. de verzender moet NIET op annuleren drukken, maar gewoon de code houden. Als dit vaak niet wertk, ga dan naar Thijs")
    return;
  }
  if (recievedList[2] !== parseInt(MyID)) {
    alert("Deze code is niet voor jouw bedoeld. De code is ongeldig. Probeer het nog een keer of ga naar Thijs");
    return;
  }
  if (recievedList[3] > TotalThingCount) {
    alert("Er wordt iets verkocht dat niet bestaat. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. de verzender moet NIET op annuleren drukken, maar gewoon de code houden. Als dit vaak niet wertk, ga dan naar Thijs")
    return;
  }
  confNum = confNum%7;
  if (confNum != recievedList[5]) {
    console.log(confNum, recievedList[5]);
    alert("De code is ongeldig. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. de verzender moet NIET op annuleren drukken, maar gewoon de code houden. Als dit vaak niet wertk, ga dan naar Thijs")
    return;
  }
  console.log(recievedList);
  console.log(confNum);

  // de code is geldig.
  if (recievedList[3] < Names.length) { // als grondstof
    inventory[recievedList[3]] += recievedList[4];
    alert("Er is " + recievedList[4].toString() + " keer " + Names[recievedList[3]] + " ontvangen.");
  } else { // als gebouw
    buildings[recievedList[3]-6] += recievedList[4];
    alert("Er is " + recievedList[4].toString() + " keer " + BuildNames[recievedList[3]-Names.length] + " ontvangen.");
  }
  recievedIDs.push(fTransID);
  redrawInf();
}

redrawInf();

var nowStyle = 1
function changeStyle() {
  if (nowStyle == 0) {
    nowStyle = 1;
    document.getElementById("mainBody").style["background-color"] = "#fff";
    document.getElementById("mainBody").style["color"] = "#000";
    document.getElementById("give").style["background-color"] = "#22F";
    document.getElementById("give").style["color"] = "#000";
    document.getElementById("buyBuilding").style["background-color"] = "#2FF";
    document.getElementById("buyBuilding").style["color"] = "#000";
    document.getElementById("recieve").style["background-color"] = "#2F2";
    document.getElementById("recieve").style["color"] = "#000";
    document.getElementById("mainDiv").style["background-color"] = "#FFF";
    document.getElementById("mainDiv").style["color"] = "#000";
    document.getElementById("changeStyle").style["background-color"] = "#CCC";
    document.getElementById("changeStyle").style["color"] = "#000";
    setTimeout(function() {
      document.getElementById("changeStyle").innerHTML = "Donker thema";
    }, 300);
  } else {
    nowStyle = 0;
    document.getElementById("mainBody").style["background-color"] = "#000";
    document.getElementById("mainBody").style["color"] = "#FFF";
    document.getElementById("give").style["background-color"] = "#008";
    document.getElementById("give").style["color"] = "#FFF";
    document.getElementById("buyBuilding").style["background-color"] = "#088";
    document.getElementById("buyBuilding").style["color"] = "#FFF";
    document.getElementById("recieve").style["background-color"] = "#080";
    document.getElementById("recieve").style["color"] = "#FFF";
    document.getElementById("mainDiv").style["background-color"] = "#000";
    document.getElementById("mainDiv").style["color"] = "#FFF";
    document.getElementById("changeStyle").style["background-color"] = "#222";
    document.getElementById("changeStyle").style["color"] = "#FFF";
    setTimeout(function() {
      document.getElementById("changeStyle").innerHTML = "Licht thema";
    }, 300);
  }
}
