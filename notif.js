const notificationButton = document.getElementById("enableNotifications");
let swRegistration = null;
const TokenElem = document.getElementById("token");
const ErrElem = document.getElementById("err");

// Initialize Firebase
// TODO: Replace with your project's customized code snippet
const config = {
    apiKey: "AIzaSyBJJRQfybH5jZwmEBY_CamY9fRd32jZyWs",
    authDomain: "projecterrika.firebaseapp.com",
    projectId: "projecterrika",
    storageBucket: "projecterrika.appspot.com",
    messagingSenderId: "616101713197",
    appId: "1:616101713197:web:65f2272f1c8a242843efa4",
    measurementId: "G-27E6BVW829"
  };
firebase.initializeApp(config);
const messaging = firebase.messaging();
initializeApp();

function initializeApp() {
  if ("serviceWorker" in navigator && "PushManager" in window) {
    console.log("Service Worker and Push is supported");
    initializeUi();
    initializeFCM();

    //Register the service worker
    navigator.serviceWorker
      .register("/sw.js")
      .then(swReg => {
        console.log("Service Worker is registered", swReg);
        swRegistration = swReg;
      })
      .catch(error => {
        console.error("Service Worker Error", error);
      });
    navigator.serviceWorker.ready.then(function(registration) {
      console.log("A service worker is active:", registration.active);

      // At this point, you can call methods that require an active
      // service worker, like registration.pushManager.subscribe()
    });
  } else {
    console.warn("Push messaging is not supported");
    notificationButton.textContent = "Push Not Supported";
  }
}

function initializeUi() {
  notificationButton.addEventListener("click", () => {
    displayNotification();
  });
}

function initializeFCM() {
  messaging
    .requestPermission()
    .then(() => {
      console.log("Notification permission granted.");

      // get the token in the form of promise
      return messaging.getToken();
    })
    .then(token => {
      TokenElem.innerHTML = "token is : " + token;
    })
    .catch(err => {
      ErrElem.innerHTML = ErrElem.innerHTML + "; " + err;
      console.log("Unable to get permission to notify.", err);
    });
}

function displayNotification() {
  if (window.Notification && Notification.permission === "granted") {
    notification();
  }
 
  else if (window.Notification && Notification.permission !== "denied") {
    Notification.requestPermission(status => {
      if (status === "granted") {
        notification();
      } else {
        alert("You denied or dismissed permissions to notifications.");
      }
    });
  } else {
    // If the user refuses to get notified
    alert(
      "You denied permissions to notifications. Please go to your browser or phone setting to allow notifications."
    );
  }
}

function notification() {
  const options = {
    body: "Selamat Datang",
    icon: "/assets/bg.jpg"
  };
  swRegistration.showNotification("PWA Notification!", options);
}