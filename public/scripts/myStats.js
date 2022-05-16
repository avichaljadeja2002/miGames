var rhit = rhit || {};
rhit.variableName = "";

const uid = localStorage.getItem("uid")

var eventList = []
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
    <div class="card w-100" style="width: 18rem;">
        <div class="card-body">
            <h5 class="card-title">${data.name}</h5>
            <h6 class="card-subtitle mb-2 text-muted"${data.description}</h6>
            <p class="card-text">Created By: ${data.createdBy}</p>
        </div>
    </div>
    `)
}

rhit.Stats = class {
    constructor() {
        this.getEvents();
        // document.getElementById("submit").onclick = (event) => {
        //     console.log("joining team")
        //     this.joinTeam()
        // }
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
    updateEvents() {
        const newList = htmlToElement(`<div id="eventListContainer"></div>`);
        console.log(eventList);
        for (var i = 0; i < eventList.length; i++) {
            createCard(eventList[i])
            const mq = eventList[i]
            const newCard = createCard(mq);
            newCard.onclick = (event) => {
                selectedEvent = mq;
                localStorage.setItem("name", selectedEvent.name);
                localStorage.setItem("description", selectedEvent.description);
                localStorage.setItem("image", selectedEvent.icon);
                localStorage.setItem("location", selectedEvent.location);
                localStorage.setItem("createdBy", selectedEvent.createdBy);
                localStorage.setItem("date", selectedEvent.date);
                localStorage.setItem("time", selectedEvent.time);
                localStorage.setItem("results", selectedEvent.results)
                localStorage.setItem("registered", selectedEvent.registered)
                window.location.href = "/stats.html"
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
    console.log("Using myStats page");
    new rhit.Stats()
}

rhit.data = class {
    constructor(eventName, eventDescription, eventImage) {
        this.name = eventName;
        this.description = eventDescription;
        this.icon = eventImage;
    }
}

rhit.main();