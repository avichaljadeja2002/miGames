/**
 * @fileoverview
 * Provides the JavaScript interactions for all pages.
 *
 * @author 
 * Charles Yang and Avichal Jadeja
 */

/** namespace. */
var rhit = rhit || {};
// rhit.storage = rhit.storage || {};

/** globals */
rhit.variableName = "";
const firebaseData = firebase.firestore();
const usersReference = firebaseData.collection("users")

/** function and class syntax examples */
rhit.functionName = function () {
	/** function body */
};

rhit.fbAuthManager = null;

rhit.LoginPageController = class {
	constructor() {
		rhit.fbAuthManager.classicSignIn();
		document.querySelector("#rosefireButton").onclick = (event) => {
			rhit.fbAuthManager.signIn();
		};

	}
}

rhit.FbAuthManager = class {
	constructor() {
		this._user = null;
		this._name = "";
		this._photoUrl = "";
	}

	classicSignIn(){
		const inputEmailEl = document.querySelector("#inputEmail");
		const inputPasswordEl = document.querySelector("#inputPassword");

		document.querySelector("#createAccountButton").onclick = (event) => {
			console.log(`Create account for email: ${inputEmailEl.value}  password: ${inputPasswordEl.value}`);

			firebase.auth().createUserWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("Create user error", errorCode, errorMessage);
				return;
			});
			usersReference.doc(inputEmailEl.value).set({
				createdEvents: [],
				registeredTeams: [],
				emailId: inputEmailEl.value,
				userName: inputEmailEl.value
			})
			localStorage.setItem("uid", inputEmailEl.value);
			console.log("written to users doc")
		};

		document.querySelector("#logInButton").onclick = (event) => {
			console.log(`Log in to existing account for email: ${inputEmailEl.value}  password: ${inputPasswordEl.value}`);
			firebase.auth().signInWithEmailAndPassword(inputEmailEl.value, inputPasswordEl.value).catch(function (error) {
				var errorCode = error.code;
				var errorMessage = error.message;
				console.log("Log in existing user error", errorCode, errorMessage);
				return;
			});
			localStorage.setItem("uid", inputEmailEl.value);
		};
	}

	beginListening(changeListener) {
		firebase.auth().onAuthStateChanged((user) => {
			this._user = user;
			// localStorage.setItem("uid", this._user.uid);
			// db.collection("users").doc(_user).set({
			// 	createdEvents: []
			// })
			changeListener();
		});
	}

	signIn() {
		console.log("Sign in using Rosefire");
		Rosefire.signIn("3d313cb1-86ca-4d0f-899a-6084e16ec9d0", (err, rfUser) => {
			if (err) {
				console.log("Rosefire error!", err);
				return;
			}
			console.log("Rosefire success!", rfUser);
			this._name = rfUser.name;
			firebase.auth().signInWithCustomToken(rfUser.token).catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === 'auth/invalid-custom-token') {
					alert('The token you provided is not valid.');
				} else {
					console.error("Custom auth error", errorCode, errorMessage);
				}
			});
		});

	}

	signOut() {
		firebase.auth().signOut().catch((error) => {
			console.log("Sign out error");
		});
	}

	

	get isSignedIn() {
		return !!this._user;
	}

	get uid() {
		return this._user.uid;
	}

	get name() {
		return this._name || this._user.displayName;
	}

	get photoUrl() {
		return this._photoUrl || this._user.photoURL;
	}
}

rhit.checkForRedirects = function () {
	if (document.querySelector("#loginPage") && rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/join.html";
	}
	if (!document.querySelector("#loginPage") && !rhit.fbAuthManager.isSignedIn) {
		window.location.href = "/";
	}
};

rhit.SideNavController = class {	
	constructor() {
		const menuShowJoinPage = document.querySelector("#menuShowJoinPage");
		if (menuShowJoinPage) {
			menuShowJoinPage.addEventListener("click", (event) => {
				window.location.href = "/mainPage.html";
			});
		}
		const menuShowMyEvents = document.querySelector("#menuShowMyEvents");
		if (menuShowMyEvents) {
			menuShowMyEvents.addEventListener("click", (event) => {
				window.location.href = `/list.html?uid=${rhit.fbAuthManager.uid}`;
			});
		}
		const menuSignOutItem = document.querySelector("#logout");
		if (menuSignOutItem) {
			console.log(menuSignOutItem);
			menuSignOutItem.addEventListener("click", (event) => {
				rhit.fbAuthManager.signOut();
			});
		}
	}
}

rhit.initializePage = function () {
	const urlParams = new URLSearchParams(window.location.search);
	new rhit.SideNavController();

	if (document.querySelector("#loginPage")) {
		console.log("You are on the login page.");
		new rhit.LoginPageController();
	}
};

/* Main */
/** function and class syntax examples */
rhit.main = function () {
	console.log("Ready");
	rhit.fbAuthManager = new rhit.FbAuthManager();
	rhit.fbAuthManager.beginListening(() => {
		console.log("isSignedIn = ", rhit.fbAuthManager.isSignedIn);
		rhit.checkForRedirects();
		rhit.initializePage();
	});
}

rhit.main();
