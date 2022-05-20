var rhit = rhit || {};
rhit.variableName = "";

const uid = localStorage.getItem("uid")
var eventList = []
var registeredTeams = []

var createdEvents = []

var selectedEvent = null;

const db = firebase.firestore();
const eventRef = db.collection("events")
const usersRef = db.collection("users").doc(uid)
 
function htmlToElement(html) {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;
    return template.content.firstChild;
}

function createCard(data) {
    return htmlToElement(`
    <div class="card" style="width: 40rem;">
        <img class="card-img-top" style="height: 20rem;" src="${data.icon}">
        <div class="card-body">
        <h5 class="card-title">${data.name}</h5>
        <p class="card-text">${data.description}</p>
        </div>
    </div>
    `)
}

rhit.Join = class {
    constructor() {
        this.getEvents();
        this.getRegisteredTeams();
        document.getElementById("submit").onclick = (event) => {
            console.log("joining team")
            this.joinTeam()
        }
    }
    joinTeam() {
        const id = selectedEvent.name;
        const registered = selectedEvent.registered || [];
        registeredTeams.push(id);
        registered.push(uid);
        db.collection("events").doc(id).set({
                name: selectedEvent.name,
                date: selectedEvent.date,
                time: selectedEvent.time,
                location: selectedEvent.location,
                email: selectedEvent.email,
                description: selectedEvent.description,
                icon: selectedEvent.icon,
                registered: registered,
                createdBy: selectedEvent.createdBy
            }).then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
        db.collection("users").doc(uid).set({
                createdEvents: createdEvents || [],
                registeredTeams: registeredTeams
            }).then(() => {
                console.log("Document successfully written!");
                window.location.reload();
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
    }
    getEvents() {
        eventRef.get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    eventList.push(doc.data());
                });
                this.updateEvents()
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
    getRegisteredTeams() {
        usersRef.get().then((doc) => {
            if (doc.exists) {
                registeredTeams = doc.data().registeredTeams
                createdEvents = doc.data().createdEvents
                console.log(registeredTeams);
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

    }
    updateEvents() {
        console.log(eventList);
        const newList = htmlToElement(`<div id="eventListContainer"></div>`);
        for (var i = 0; i < eventList.length; i++) {
            createCard(eventList[i])
            const mq = eventList[i]
            const newCard = createCard(mq);
            newCard.onclick = (event) => {
                selectedEvent = mq;
                $('#joinConfirm').modal('show');
            }
            newList.appendChild(newCard);
            const oldList = document.querySelector("#eventListContainer");
            // oldList.removeAttribute("id");
            // oldList.hidden = true;
            oldList.parentElement.appendChild(newList);
            oldList.parentElement.children[0].hidden = false
        }
    }
}

rhit.main = function () {
    console.log("Using Join page");
    new rhit.Join()
}

rhit.data = class {

    constructor(eventName, eventDescription, eventImage) {
        this.name = eventName;
        this.description = eventDescription;
        this.icon = eventImage;
    }
}

rhit.main();