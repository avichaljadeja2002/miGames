/**
 * @fileoverview
 * Provides the JavaScript interactions for teams page
 *
 * @author 
 * Charles Yang and Avichal Jadeja
 */
 import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
 import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";


var rhit = rhit || {};
rhit.variableName = "";

const uid = localStorage.getItem("uid")
const teamsList = null;
console.log(uid);

// Initialize Firebase
const db = firebase.firestore();

const usersRef = db.collection("users").doc(uid);

rhit.Teams = class {
    constructor() {
        this.getTeams();
    }
    getTeams() {
        usersRef.get().then((doc) => {
            if (doc.exists) {
                console.log("Document data:", doc.data().createdEvents);
                teamsList = doc.data().createdEvents;
            } else {
                // doc.data() will be undefined in this case
                console.log("No such document!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });

        var tag = document.createElement("div");

    }
}

rhit.main = function () {
    console.log("Using Teams page");
    new rhit.Teams()
}

rhit.main();