import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";

import {
  getFirestore,
  doc,
  onSnapshot,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHEgcEs2ie9ngjEF7wEG9PYKcYD27pj0k",
  authDomain: "ecocrush-53d12.firebaseapp.com",
  projectId: "ecocrush-53d12",
  storageBucket: "ecocrush-53d12.firebasestorage.app",
  messagingSenderId: "343689598728",
  appId: "1:343689598728:web:cdee26349ed6768af0febd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const userRef = doc(db, "users", "user1");

onSnapshot(userRef, (docSnap) => {

  if (!docSnap.exists()) {
    console.log("No user data found");
    return;
  }

  const data = docSnap.data();

  const points = data.points ?? 0;
  const cans = data.cans ?? 0;

  document.getElementById("points").innerText = points;
  document.getElementById("cans").innerText = cans;

  let progress = (points / 50) * 100;
  if (progress > 100) progress = 100;

  document.getElementById("progress").style.width = progress + "%";
  document.getElementById("current").innerText = points;

  const nameInput = document.getElementById("profileName");
  const emailInput = document.getElementById("profileEmail");
  const phoneInput = document.getElementById("profilePhone");

  if (document.activeElement !== nameInput) {
    nameInput.value = data.name ?? "";
  }
  if (document.activeElement !== emailInput) {
    emailInput.value = data.email ?? "";
  }
  if (document.activeElement !== phoneInput) {
    phoneInput.value = data.phone ?? "";
  }
});

async function saveProfile() {
  const name = document.getElementById("profileName").value.trim();
  const email = document.getElementById("profileEmail").value.trim();
  const phone = document.getElementById("profilePhone").value.trim();
  const status = document.getElementById("profileStatus");

  if (!name || !email || !phone) {
    status.innerText = "Please fill in all fields.";
    return;
  }

  try {
    await setDoc(userRef, { name, email, phone }, { merge: true });
    status.innerText = "Profile saved ✅";
  } catch (err) {
    console.error("Error saving profile:", err);
    status.innerText = "Error saving profile.";
  }
}

document.getElementById("saveProfileBtn").addEventListener("click", saveProfile);
