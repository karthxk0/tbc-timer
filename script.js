console.log("Script Loaded");


const firebaseConfig = {
  apiKey: "AIzaSyBiU-q-eQmOazt3kzLzzfxjqLjwOYyVZ34",
  authDomain: "flip-clock-timer.firebaseapp.com",
  databaseURL: "https://flip-clock-timer-default-rtdb.firebaseio.com",
  projectId: "flip-clock-timer",
  storageBucket: "flip-clock-timer.appspot.com",
  messagingSenderId: "123043916705",
  appId: "1:123043916705:web:fa661b4cba492c0028f9e0"
};


firebase.initializeApp(firebaseConfig);
const database = firebase.database();


const hoursTop = document.querySelector(".hours-top");
const minutesTop = document.querySelector(".minutes-top");
const secondsTop = document.querySelector(".seconds-top");
const hoursBottom = document.querySelector(".hours-bottom");
const minutesBottom = document.querySelector(".minutes-bottom");
const secondsBottom = document.querySelector(".seconds-bottom");


const adminButton = document.getElementById("open-admin");
const adminModal = document.getElementById("admin-modal");
const closeModal = document.getElementById("close-modal");
const submitPasskey = document.getElementById("submit-passkey");
const adminPasskey = document.getElementById("admin-passkey");
const timerSettings = document.getElementById("timer-settings");


const setHours = document.getElementById("set-hours");
const setMinutes = document.getElementById("set-minutes");
const setSeconds = document.getElementById("set-seconds");
const startTimerButton = document.getElementById("start-timer");


adminButton.addEventListener("click", () => adminModal.style.display = "block");
closeModal.addEventListener("click", () => adminModal.style.display = "none");

// Passkey submission
submitPasskey.addEventListener("click", () => {
    if (adminPasskey.value === "12345") {  
        timerSettings.style.display = "block";
    } else {
        alert("Incorrect passkey!");
    }
});


startTimerButton.addEventListener("click", () => {
    const hours = parseInt(setHours.value) || 0;
    const minutes = parseInt(setMinutes.value) || 0;
    const seconds = parseInt(setSeconds.value) || 0;
    const duration = (hours * 3600 + minutes * 60 + seconds) * 1000;
    database.ref("timer").set({
        running: true,
        startTime: Date.now(),
        duration: duration
    });
    adminModal.style.display = "none";
});


function updateClock(startTime, duration) {
    const now = Date.now();
    const remainingTime = duration - (now - startTime);
    if (remainingTime < 0) {
        clearInterval(timerInterval);
        return;
    }

    const hours = Math.floor(remainingTime / 3600000);
    const minutes = Math.floor((remainingTime % 3600000) / 60000);
    const seconds = Math.floor((remainingTime % 60000) / 1000);

    flipUpdate(hoursTop, hoursBottom, String(hours).padStart(2, '0'));
    flipUpdate(minutesTop, minutesBottom, String(minutes).padStart(2, '0'));
    flipUpdate(secondsTop, secondsBottom, String(seconds).padStart(2, '0'));
}


function flipUpdate(topElement, bottomElement, newValue) {
    if (topElement.textContent !== newValue) {
        bottomElement.textContent = newValue;
        topElement.parentElement.style.transform = 'rotateX(-180deg)';
        setTimeout(() => {
            topElement.textContent = newValue;
            topElement.parentElement.style.transform = 'rotateX(0deg)';
        }, 300);
    }
}


let timerInterval;
database.ref("timer").on("value", (snapshot) => {
    const timerData = snapshot.val();
    if (timerData && timerData.running) {
        clearInterval(timerInterval);
        timerInterval = setInterval(() => updateClock(timerData.startTime, timerData.duration), 1000);
    }
});
