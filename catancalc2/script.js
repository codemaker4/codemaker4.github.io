var inventory = [0,0,0,0,0,0];
var buildings = [0,0,0,0,0];
const names = ["hout", "graan", "baksteen", "schaap", "ijzer", "geld"];
const buildNames = ["bos", "weiland", "baksteenfabriek", "boederij", "mijn"];
const myID = prompt("Ga naar Thijs voor je ID");
var nextSendID = 0;
const recievedIDs = [];

var defBuilding = prompt("begingebouw?");
if (defBuilding) {
  buildings[parseInt(defBuilding)] += 1;
}

inventory[5] = parseInt(prompt("hoeveel geld"));

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
  if (parseInt(myID) < 5) {
    string += myID + ", spelleider<br>"
  } else {
    string += myID + "<br>";
  }
  string += "jouw score: " + calcScore().toString() + '<br>';
  string += "<h3>jouw grondstoffen:</h3><ul>";
  for (var i = 0; i < inventory.length; i++) {
    string += "<li>" + names[i] + ": " + inventory[i].toString() + "</li>";
  }
  string += "</ul><h3>jouw gebouwen:</h3><ul>";
  for (var i = 0; i < buildings.length; i++) {
    string += "<li>" + buildNames[i] + ": " + buildings[i].toString() + "</li>";
  }
  string += "</ul>"
  document.getElementById('mainDiv').innerHTML = string;
}

function doRound() {
  for (var i = 0; i < buildings.length-1; i++) {
    inventory[i] += buildings[i];
  }
  redrawInf();
}

setInterval(doRound, 3*60*1000) // ronde iedere 3 minuten

function give() {// myID.transID.otherID.transType.amount.all+%7
  var idToSendTo = prompt("Geeft de ID van het persoon waarnaar je dit stuurt. De ID staat op het scherm van de ontvanger, onder de geef knop");
  if (!idToSendTo) {
    alert("geannuleerd");
    return
  }
  idToSendTo = parseInt(idToSendTo);
  if (idToSendTo === NaN) {
    alert("Dat is geen getal. Het ID moet een getal zijn.")
    return
  }
  if (parseInt(myID) == idToSendTo) {
    alert("Je kan niks naar jezelf versturen. Voer het ID van de ander in.")
    return
  }
  var typeToSend = prompt("Wat wil je versturen? geef een getal:\n1:hout\n2:graan\n3:baksteen\n4:schaap\n5:erts\n6:munten\n7:bos\n8:weiland\n9:baksteenfabriek\n10:boederij\n11:mijn\n12:goudmijn");
  if (!typeToSend) {
    alert("geannuleerd");
    return
  }
  typeToSend = parseInt(typeToSend)
  if (typeToSend === NaN) {
    alert("Dat is geen getal. Voer een getal in. Geannuleerd.")
    return
  }
  if (typeToSend <= 0 || typeToSend > 11) {
    alert("Dat getal is niet een van de opties. Geannuleerd.")
    return;
  }
  if (typeToSend <=6) {
    var amount = prompt("Hoeveel " + names[typeToSend-1] + " wil je geven? ");
  } else {
    var amount = prompt("Hoeveel " + buildNames[typeToSend-7] + " wil je geven?");
  }
  if (!amount) {
    alert("geannuleerd");
    return
  }
  amount = parseInt(amount);
  if (amount === NaN) {
    alert("Dat is geen getal. Geannuleerd.");
    return
  }
  if (amount <= 0) {
    alert("Je mag niet 0 of minder dingen versturen. Als je iets wilt ontvangen moet je op ontvangen drukken, en moet de ander op geven drukken.")
    return
  }
  typeToSend -= 1;
  if (parseInt(myID) >= 5) {
    if (typeToSend < 6) {
      if (inventory[typeToSend] < amount) {
        alert("Je hebt niet genoeg " + names[typeToSend] + ". Geannuleerd");
        return
      }
      inventory[typeToSend] -= amount;
    } else {
      if (buildings[typeToSend-6] < amount) {
        alert("Je hebt niet genoeg " + buildNames[typeToSend-6] + ". Geannuleerd");
        return
      }
      buildings[typeToSend-6] -= amount;
    }
  } else {
    alert("spelleiderToegang");
  }
  var confNum = ((parseInt(myID)+nextSendID+idToSendTo+typeToSend+amount)%7).toString();
  var sendCode = myID + "." + nextSendID.toString() + "." + idToSendTo.toString() + "." + typeToSend.toString() + "." + amount.toString() + "." + confNum;
  alert("Dit is de code:\n" + sendCode + "\nDruk pas op ok wanneer het succesfol is ontvangen. De ander moet op ontvangen drukken en deze code invoeren. Als het niet lukt, ga naar Thijs.");
  nextSendID += 1;
  redrawInf();
}

function recieve() { // otherID.transID.myID.transType.amount.all+%7
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
    if (recievedList[i] === NaN) {
      alert("De code is ongeldig. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. de verzender moet NIET op annuleren drukken, maar gewoon de code houden. Als dit vaak niet wertk, ga dan naar Thijs")
      return
    }
    if (i < 5) {
      confNum += recievedList[i];
    }
  }
  if (recievedList[0].toString === myID) {
    alert("Het lijkt er op dat je iets aan jezelf prpbeert te geven. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. de verzender moet NIET op annuleren drukken, maar gewoon de code houden. Als dit vaak niet wertk, ga dan naar Thijs");
    return;
  }
  var fTransID = recievedList[0].toString()+";"+recievedList[1].toString()
  if (recievedIDs.includes(fTransID)) {
    alert("Deze code is al een keer ingevoerd. Er is niks ontvangen, probeer het opnieuw door opnieuw op ontvangen te drukken. de verzender moet NIET op annuleren drukken, maar gewoon de code houden. Als dit vaak niet wertk, ga dan naar Thijs")
    return;
  }
  if (recievedList[2] !== parseInt(myID)) {
    alert("Deze code is niet voor jouw bedoeld. De code is ongeldig. Probeer het nog een keer of ga naar Thijs");
    return;
  }
  if (recievedList[3] >= 12) {
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
  if (recievedList[3] < 6) { // als grondstof
    inventory[recievedList[3]] += recievedList[4];
    alert("Er is " + recievedList[4].toString() + " keer " + names[recievedList[3]] + " ontvangen.");
  } else { // als gebouw
    buildings[recievedList[3]-6] += recievedList[4];
    alert("Er is " + recievedList[4].toString() + " keer " + buildNames[recievedList[3]-6] + " ontvangen.");
  }
  recievedIDs.push(fTransID);
  redrawInf();
}

redrawInf();
