/**
 * @fileoverview
 * Provides the JavaScript interactions for teams page
 *
 * @author 
 * Charles Yang and Avichal Jadeja
 */

var rhit = rhit || {};
rhit.variableName = "";

const uid = localStorage.getItem("uid")
var teamsList = null;
var createdEvents = null;
console.log(uid);

// Initialize Firebase
const db = firebase.firestore();

const usersRef = db.collection("users").doc(uid);

function htmlToElement(html) {
	var template = document.createElement('template');
	html = html.trim();
	template.innerHTML = html;
	return template.content.firstChild;
}

function createCard(teamName) {
    return htmlToElement(`<div class="card">
    <div class="card-body">
      <h5 class="card-title">${teamName}</h5>
    </div>
  </div>`)
}



rhit.Teams = class {
    constructor() {
        this.getTeams();
        document.getElementById("submit").addEventListener("click", function() {
            console.log("CREATING EVENT!");
            const events = db.collection("events");
            const name = document.getElementById("eventName").value;
            const date = document.getElementById("date").value;
            const time = document.getElementById("time").value;
            const location = document.getElementById("location").value;
            const email = document.getElementById("email").value;
            const description = document.getElementById("description").value;
            const icon = document.getElementById("icon").value

            createdEvents.push(name);
        
            events.doc(name).set({
                name: name,
                date: date,
                time: time,
                location: location,
                email: email,
                description: description,
                icon: icon,
                createdBy: uid
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                // alert("Error creating event. Please try again later")
            });

            usersRef.set({
                createdEvents: createdEvents
            }).then(() => {
                console.log("Document successfully written!");
                $('#createEventModal').modal('hide');    
            })
            .catch((error) => {
                // alert("Error creating event. Please try again later")
            });
            // window.location.reload()
        })
    }

    getTeams() {
        usersRef.get().then((doc) => {
            if (doc.exists) {
                console.log(doc.data());
                teamsList = doc.data().currentTeams || [];
                createdEvents = doc.data().createdEvents || [];
                this.updateList();
                this.updateTeams()
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    }

    updateList(){
        const newList = htmlToElement(`<div id="teamListContainer"></div>`);
        for (let i = 0; i < teamsList.length; i++) {
			const mq = teamsList[i]
			const newCard = createCard(mq);
			newCard.onclick = (event) => {
				// rhit.storage.setMovieQuoteId(mq.id);
				// window.location.href = `/moviequote.html?id=${mq.id}`;
			}
			newList.appendChild(newCard);
            console.log(newList);
            const oldList = document.querySelector("#teamListContainer");
            oldList.removeAttribute("id");
            // oldList.hidden = true;
            oldList.parentElement.appendChild(newList);
            oldList.parentElement.children[0].hidden = false
		}
    }
    updateTeams(){
        const newList = htmlToElement(`<div id="createdEvents"></div>`);
        for (let i = 0; i < createdEvents.length; i++) {
			const mq = createdEvents[i]
			const newCard = createCard(mq);
			newCard.onclick = (event) => {
				// rhit.storage.setMovieQuoteId(mq.id);
				// window.location.href = `/moviequote.html?id=${mq.id}`;
			}
			newList.appendChild(newCard);
            console.log(newList);
            const oldList = document.querySelector("#createdEvents");
            // oldList.removeAttribute("id");
            // oldList.hidden = true;
            oldList.parentElement.appendChild(newList);
            oldList.parentElement.children[0].hidden = false
		}
    }
}

rhit.main = function () {
    console.log("Using Teams page");
    new rhit.Teams()
}

rhit.main();