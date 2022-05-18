var rhit = rhit || {};
rhit.variableName = "";

const uid = localStorage.getItem("uid")
var teamsList = null;
var createdEvents = null;

// Initialize Firebase
const db = firebase.firestore();

const usersRef = db.collection("users").doc(uid);

const name = localStorage.getItem("name");
const description = localStorage.getItem("description");
const image = localStorage.getItem("image");
const eventLocation = localStorage.getItem("location");
const createdBy = localStorage.getItem("createdBy");
const date = localStorage.getItem("date");
const time = localStorage.getItem("time");
const resultsList = localStorage.getItem("results").split(",");
const registered = localStorage.getItem("registered").split(",")

const eventRef = db.collection("events").doc(name)



function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function createHeading() {
    const oldList = document.querySelector("#eventHeading");
    oldList.appendChild(htmlToElement(`   
    <div id="eventDetails">
    <h2>${name}</h2>
    <h5>${description}</h5>
    <h5>Date of event:  ${date}</h5>
    </div>`))
}

function createCard(i) {
    return htmlToElement(`            
    <div class="card w-100" style="width: 18rem;">
      <div class="card-body">
        <h5 class="card-title">${i}</h5>
      </div>
    </div>`)
}

function updateStats() {
    const newList = htmlToElement(`<div id="eventDetails"></div>`);
    for (var i = 0; i < resultsList.length; i++) {
        if(resultsList[i] == 'undefined') continue;
        const mq = resultsList[i]
        const newCard = createCard(resultsList[i]);
        newList.appendChild(newCard);
        const oldList = document.querySelector("#eventDetails");
        // oldList.removeAttribute("id");
        // oldList.hidden = true;
        oldList.parentElement.appendChild(newList);
        oldList.parentElement.children[0].hidden = false
    }
}

function addResultButton() {
    if (uid === createdBy || createdBy == "undefined") {
        const oldList = document.querySelector("#addStats");
        oldList.appendChild(htmlToElement(`   
        <button type="button" id="statsAdd" class="btn btn-primary" >Add result</button>`))
        document.querySelector("#statsAdd").onclick = (event) => {
            $('#addStatModal').modal('show');
            populateModal("team1");
            populateModal("team2");
        }
        document.getElementById("save").onclick = (event) => {
            const temp = document.getElementById("team1").value + " beat " + document.getElementById("team2").value
            resultsList.push(temp);
            eventRef.update({
                "results": resultsList
            }).then(() => {
                console.log("Document successfully updated!");
                $('#addStatModal').modal('hide');
                localStorage.setItem("results", resultsList)
                window.location.reload();
            });
        }
    }
}

function populateModal(team) {
    for (var i = 0; i < registered.length; i++) {
        var optn = registered[i];
        var el = document.createElement("option");
        el.textContent = optn;
        el.value = optn;
        document.getElementById(team).appendChild(el);
    }
}

rhit.Stats = class {
    constructor() {
        createHeading();
        updateStats();
        addResultButton();
    }
}

rhit.main = function () {
    console.log("Using stats specific page");
    new rhit.Stats()
}

rhit.main();