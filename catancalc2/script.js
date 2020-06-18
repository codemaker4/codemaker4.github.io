//soort wachtwoord
var pWEntered = prompt("Ga naar Thijs")
if (pWEntered === "ibt") {
  while (true) { //  als goed convert codes om andere gebruikers te unlocken
    var num = parseInt(prompt("geef de code"));
    if (num === 1000) {
      alert("gestopt");
      break;
    }
    alert((((num*1353463)%2342)*174598)%1000);
  }
} else { // als neit goed heb je een code nodig
  var startupConfNum = Math.floor(Math.random()*1000)
  while (prompt("geef de code voor " + startupConfNum.toString() + ":") !== ((((startupConfNum*1353463)%2342)*174598)%1000).toString()) {
    alert("Code incorrect, probeer opnieuw.");
  }
}

// initialisatie
var inventory = [0,0,0,0,0]; // hoeveelheid grondstoffen per grondstof.
var buildings = [0,0,0,0,0]; // heoveelheid gebouwen
const Names = ["hout", "graan", "baksteen", "schaap", "ijzer"]; // namen van grondstoffen
const BuildNames = ["bos", "weiland", "baksteenfabriek", "boederij", "mijn"]; // namen van gebouwen
const AllNames = Names.concat(BuildNames); // namen van alle dingen bij elkaar.
const BuildPrices = [[4,1],[1,0],[3,4],[2,3],[0,2]]; // type grondstoffen nodig per gebouw
const PriceAmount = 2; // hoeveelheid grondstoffen nodig per grondstof voor een gebouw op het begin
var MyID = prompt("Ga naar Thijs voor je ID"); // id initialisatie
while (isNaN(parseInt(MyID)) || MyID <0) { // id moet een gat zijn, en 0 of hoger. Als een id tussen 0 (inclusief) en <SpelleiderHoeveelheid> (explusief) zit, is het een spelleider
  MyID = prompt("Dat is geen geldig ID. Ga naar Thijs voor je ID."); // als het ID verkeerd is ingevoerd, wordt er opnieuw gevraagd
}
var nextSendID = 0; // dit is nodig om een unieke code te maken voor iedere verzending. Telt op met 1 voor iedere geef transactie.
var recievedIDs = []; // dit zijn alle ontavngen transacties. ze zijn als ["<geverID>;<geverSnedID>", "<geverID>;<geverSnedID>", .....]
var openedChests = []; // dit zijn alle kistID's die zijn geopend.
const SpelleiderHoeveelheid = 5; // dit is het aantal spelleiders. Zie de code voor MyID initialisatie
const TotalThingCount = Names.length+BuildNames.length; // dit is een getal voor het totaal aantal type dingen (grondstypen + gebouwtypen)
const ConfNumDepth = 6; // seed for random num generator.
const Version = "1.4";
const RoundLength = 2;

// startGebouw initialisatie
var defBuilding = prompt("begingebouw?" + BuildNames);
while (defBuilding && (isNaN(parseInt(defBuilding)) || parseInt(defBuilding) < 0 || parseInt(defBuilding) >= BuildNames.length)) {
  defBuilding = prompt("dat is geen begingebouw. begingebouw?" + BuildNames);
}
if (defBuilding) { // false als er niks is ingevoerd of er op annuleren is gedrukt, true als er wat staat en het uit de voorige loop is gekomen.
  buildings[parseInt(defBuilding)] += 1;
}

// calculates the confnum for a given sum
function getConfNum(num, depth) {
  if (depth <= 0) {
    return (num*num)%53;
  }
  return ((num*getConfNum(num+depth+7224, depth-1)*533)+(depth+(num*123)+924))%9;
}

// confNum randomness test
// var stats = [0,0,0,0,0,0,0,0,0];
// for (var i = 0; i < 100000; i++) {
//   var num = getConfNum(i, ConfNumDepth);
//   if (i < 50) {
//     console.log(i, num);
//   }
//   stats[num] += 1;
// }
// console.log(stats);

// returnt de score van de speler.
function calcScore() {
  var score = 0;
  for (var i = 0; i < inventory.length-1; i++) {
    score += inventory[i]*25; // voor iedere grondstof 25 punten
  }
  for (var i = 0; i < buildings.length; i++) {
    score += buildings[i]*200; // voor ieder gebouw 200 punten
  }
  return score;
}

// ververst de tekst met info over de splere, de score, de grondstoffen en de geouwen. AANgeroepen aan het begin van het spel, wanneer er is gehandeld en na een ronde.
function redrawInf() {
  var string = "Jouw ID: " // begint met het verversen van de ID
  if (parseInt(MyID) < SpelleiderHoeveelheid) { // als spelleider
    string += MyID + ", spelleider<br>"
  } else { // als gewone speler
    string += MyID + "<br>";
  }
  string += "jouw score: " + calcScore().toString() + '<br>'; // score berekening en laten zien
  string += "<h3>jouw grondstoffen:</h3><ul>"; // begin grondstoffen lijst
  for (var i = 0; i < inventory.length; i++) {
    string += "<li>" + Names[i] + ": " + inventory[i].toString() + "</li>"; // geef de grondstoffen aan
  }
  string += "</ul><h3>jouw gebouwen:</h3><ul>"; // begin gebouwen lijst
  for (var i = 0; i < buildings.length; i++) {
    string += "<li>" + BuildNames[i] + ": " + buildings[i].toString() + "</li>"; // geef de gebouwen aan
  }
  string += "</ul><h3 style='margin-bottom:3vw;'>instellingen:</h3>" // titel voor de instellingen knoppen onderaan het scherm
  string += "<p style='font-size:3vw;margin:0;'><b>versie: " + Version + "</b></p>"
  document.getElementById('mainDiv').innerHTML = string; // update de HTML
}

// zorgt ervoor dat alle gebouwen worden geupdated
function doRound() {
  for (var i = 0; i < buildings.length; i++) {
    inventory[i] += buildings[i];
  }
  redrawInf();
}
//
// var startRoundCount = prompt("hoeveel rondes starten we?")
// while (isNaN(parseInt(startRoundCount)) || parseInt(startRoundCount) < 0) {
//   startRoundCount = prompt("Dat is geen geldig aantal rondes. Geef een geldig getal");
// }
//
// for (var i = 0; i < startRoundCount; i++) {
//   doRound();
// }

alert("Je telefoon is ingesteld. Druk pas op OK wanneer iedereen start.")

setInterval(doRound, RoundLength*60*1000) // ronde

function give() {// MyID.transID.otherID.transType.amount.all+%7
  var idToSendTo = prompt("Geef de ID van het persoon waarnaar je iets wilt sturen. De ID staat op het scherm van de ontvanger, vlak onder de ontvang knop.");
  if (!idToSendTo) {
    alert("geannuleerd");
    return
  }
  idToSendTo = parseInt(idToSendTo);
  if (isNaN(idToSendTo) || idToSendTo < 0) {
    alert("Dat is geen geldig getal. Een ID moet een geldig getal zijn.")
    return
  }
  if (parseInt(MyID) == idToSendTo) {
    alert("Je kan niet iets naar jezelf versturen. Voer de ID in van de speler die jij iets wilt geven.")
    return
  }
  var typeToSend = prompt("Wat wil je versturen? geef het getal:\n1:hout\n2:graan\n3:baksteen\n4:schaap\n5:ijzer\n6:bos\n7:weiland\n8:baksteenfabriek\n9:boederij\n10:mijn");
  if (!typeToSend) {
    alert("geannuleerd");
    return
  }
  typeToSend = parseInt(typeToSend)
  if (isNaN(typeToSend)) {
    alert("Dat is geen getal. Voer een getal in. Er is niks verzonden.")
    return
  }
  if (typeToSend <= 0 || typeToSend > TotalThingCount) {
    alert("Dat getal is niet een van de opties. Er is niks verzonden.")
    return;
  }
  if (typeToSend <=Names.length) {
    var amount = prompt("Hoeveel " + Names[typeToSend-1] + " wil je geven? ");
  } else {
    var amount = prompt("Hoeveel " + BuildNames[typeToSend-Names.length-1] + " wil je geven?");
  }
  if (!amount) {
    alert("geannuleerd");
    return
  }
  amount = parseInt(amount);
  if (isNaN(amount)) {
    alert("Dat is geen getal. Er is niks verzonden.");
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
  // var confNum = ((parseInt(MyID)+nextSendID+idToSendTo+typeToSend+amount)%7).toString();
  var confNum = getConfNum(parseInt(MyID)+nextSendID+idToSendTo+typeToSend+amount, ConfNumDepth).toString();
  var sendCode = MyID + "." + nextSendID.toString() + "." + idToSendTo.toString() + "." + typeToSend.toString() + "." + amount.toString() + "." + confNum;
  alert("Dit is de code:\n" + sendCode + "\nDruk pas op ok wanneer het succesfol is ontvangen. De ander moet op ontvangen drukken en deze code invoeren.");
  nextSendID += 1;
  addToTransLog("Er is "+ amount.toString() +" "+ AllNames[typeToSend] +"verzonden. De code was: '"+ sendCode +"'.");
  redrawInf();
}

function buyBuilding() {
  var priceText = "Welk gebouw wil je kopen? Geeft het getal.\n";
  for (var i = 0; i < BuildNames.length; i++) {
    var nowBuildPrice = (PriceAmount + buildings[i]).toString()
    priceText += (i+1).toString() +": "+ BuildNames[i] +", kost: "+ nowBuildPrice +" "+ Names[BuildPrices[i][0]] +", "+ nowBuildPrice +" "+ Names[BuildPrices[i][1]] +"\n";
  }
  var buildingToBuy = prompt(priceText);
  if (!buildingToBuy) {
    alert("geannuleerd");
    return
  }
  buildingToBuy = parseInt(buildingToBuy)
  if (isNaN(buildingToBuy)) {
    alert("Dat is geen getal. Geef een getal om aan te geven welk gebouw je wilt kopen.");
    return
  }
  if (buildingToBuy <= 0 || buildingToBuy > BuildNames.length) {
    alert("Dat was niet een van de opties. Geef een getal om aan te geven welk gebouw je wilt kopen.")
    return
  }
  buildingToBuy -= 1;
  if (parseInt(MyID) >= SpelleiderHoeveelheid) {
    var price = PriceAmount+buildings[buildingToBuy]
    if (inventory[BuildPrices[buildingToBuy][0]] < price) {
      alert("Je hebt niet genoeg "+ Names[BuildPrices[buildingToBuy][0]] +" om een "+ BuildNames[buildingToBuy] +" te kopen.");
      return
    }
    if (inventory[BuildPrices[buildingToBuy][1]] < price) {
      alert("Je hebt niet genoeg "+ Names[BuildPrices[buildingToBuy][1]] +" om een "+ BuildNames[buildingToBuy] +" te kopen.");
      return
    }
    inventory[BuildPrices[buildingToBuy][0]] -= price;
    inventory[BuildPrices[buildingToBuy][1]] -= price;
  }
  buildings[buildingToBuy] += 1;
  alert("Er is succesfol een "+ BuildNames[buildingToBuy] +" gekocht.");
  addToTransLog("Er is succesfol een "+ BuildNames[buildingToBuy] +" gekocht.");
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
    alert("De code heeft een verkeer aantal getallen. Het moet lijken op bijvoorbeeld '1.2.3.4.5.6'. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. De verzender moet NIET op annuleren drukken, maar gewoon de code houden.")
    return;
  }
  var confNum = 0;
  for (var i = 0; i < recievedList.length; i++) {
    recievedList[i] = parseInt(recievedList[i]);
    if (isNaN(recievedList[i])) {
      alert("De code is ongeldig. Er is niks ontvangen. Probeer het opnieuw door opnieuw op ontvangen te drukken. De verzender moet NIET op annuleren drukken, maar gewoon de code houden.")
      return
    }
    if (i < 5) {
      confNum += recievedList[i];
    }
  }
  if (recievedList[0].toString === MyID) {
    alert("Het lijkt er op dat je iets aan jezelf probeert te geven. Er is niks ontvangen. Probeer het opnieuw door opnieuw op ontvangen te drukken. De verzender moet NIET op annuleren drukken, maar gewoon de code houden.");
    return;
  }
  var fTransID = recievedList[0].toString()+";"+recievedList[1].toString()
  if (recievedIDs.includes(fTransID)) {
    alert("Deze code is al een keer ingevoerd. Er is niks ontvangen. Probeer het opnieuw door opnieuw op ontvangen te drukken. De verzender moet NIET op annuleren drukken, maar gewoon de code houden.")
    return;
  }
  if (recievedList[2] !== parseInt(MyID)) {
    alert("Het lijkt er op dat deze code niet voor jouw gemaakt is. Probeer het opniew.");
    return;
  }
  if (recievedList[3] < 0 || recievedList[3] >= TotalThingCount) {
    alert("Er wordt iets verkocht dat niet bestaat. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. De verzender moet NIET op annuleren drukken, maar gewoon de code houden.")
    return;
  }
  confNum = getConfNum(confNum, ConfNumDepth);
  if (confNum != recievedList[5]) {
    console.log(confNum, recievedList[5]);
    alert("De code is ongeldig. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. De verzender moet NIET op annuleren drukken, maar gewoon de code houden.")
    return;
  }
  console.log(recievedList);
  console.log(confNum);

  // de code is geldig.
  if (recievedList[3] < Names.length) { // als grondstof
    inventory[recievedList[3]] += recievedList[4];
    // alert("Er is " + recievedList[4].toString() + " keer " + Names[recievedList[3]] + " ontvangen.");
  } else { // als gebouw
    buildings[recievedList[3]-Names.length] += recievedList[4];
    // alert("Er is " + recievedList[4].toString() + " keer " + BuildNames[recievedList[3]-Names.length] + " ontvangen.");
  }
  alert("Er is " + recievedList[4].toString() + " keer " + AllNames[recievedList[3]] + " ontvangen.");
  addToTransLog("Er is " + recievedList[4].toString() + " keer " + AllNames[recievedList[3]] + " ontvangen.")
  recievedIDs.push(fTransID);
  redrawInf();
}

// functie voor het looten van een lootchest.
function lootChest() {
  var chestCode = prompt("Welke code staat er in de kist?", "1.2.3.4"); // chestID, lootType, amount, confNum
  if (!chestCode) {
    alert("geannuleerd");
    return
  }
  chestCode = chestCode.split(".");
  if (chestCode.length != 4) {
    alert("Dat is geen geldige kistcode. Een kistcode heeft 4 getallen, zoals 1.2.3.4");
    return
  }
  var confNum = 0;
  for (var i = 0; i < chestCode.length-1; i++) {
    chestCode[i] = parseInt(chestCode[i])
    if (isNaN(chestCode[i])) {
      alert("Een of meer van de code delen is geen geldig getal. Let er op dat er geen spatie na de punt is toegevoegd en probeer het opnieuw.")
      return;
    }
    confNum += chestCode[i]
  }
  if (chestCode[3] != getConfNum(confNum, ConfNumDepth)) {
    alert("Een of meer van de getallen is verkeerd. Probeer het opnieuw.")
    return;
  }
  if (openedChests.includes(chestCode[0])) {
    alert("Je hebt deze kist al geopend. Iemand anders kan hem wel nog openen.");
    return
  }
  if (chestCode[1] < Names.length) {
    inventory[chestCode[1]] += chestCode[2];
    alert("De kist had " + chestCode[2].toString() + " " + AllNames[chestCode[1]] + ".");
  } else if (chestCode[1] < AllNames.length) {
    buildings[chestCode[1]-Names.length] += chestCode[2];
    alert("De kist had " + chestCode[2].toString() + " " + AllNames[chestCode[1]] + ".");
  } else {
    alert("De kist lijkt een niet bestaand item te hebben. Probeer het opnieuw.")
    return;
  }
  openedChests.push(chestCode[0]);
  addToTransLog("Er is " + chestCode[2].toString() + " keer " + AllNames[chestCode[1]] + " uit kist " + chestCode[0].toString() + " gehaald.")
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
    document.getElementById("lootChest").style["background-color"] = "#CC2";
    document.getElementById("lootChest").style["color"] = "#000";
    document.getElementById("mainDiv").style["background-color"] = "#FFF";
    document.getElementById("mainDiv").style["color"] = "#000";
    document.getElementById("changeStyle").style["background-color"] = "#CCC";
    document.getElementById("changeStyle").style["color"] = "#000";
    document.getElementById("transactions").style["background-color"] = "#FF2";
    document.getElementById("transactions").style["color"] = "#000";
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
    document.getElementById("lootChest").style["background-color"] = "#660";
    document.getElementById("lootChest").style["color"] = "#FFF";
    document.getElementById("mainDiv").style["background-color"] = "#000";
    document.getElementById("mainDiv").style["color"] = "#FFF";
    document.getElementById("changeStyle").style["background-color"] = "#222";
    document.getElementById("changeStyle").style["color"] = "#FFF";
    document.getElementById("transactions").style["background-color"] = "#880";
    document.getElementById("transactions").style["color"] = "#FFF";
    setTimeout(function() {
      document.getElementById("changeStyle").innerHTML = "Licht thema";
    }, 300);
  }
}

var transLog = ["start van het spel."]

function addToTransLog(trans) {
  transLog.push(trans);
}

function giveTransLog() {
  str = "Hier is een log van de "+ (transLog.length-1).toString() +" transacties.\n";
  for (var i = transLog.length-1; i >= 0; i--) {
    str += i.toString() +": "+ transLog[i] + "\n";
  }
  alert(str);
}
