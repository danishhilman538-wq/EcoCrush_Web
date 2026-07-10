let points = 0;
let cans = 0;
function saveProfile() {
    let name = document.getElementById("profileName").value;
    let email = document.getElementById("profileEmail").value;
    let phone = document.getElementById("profilePhone").value;
    if(name === "" || email === "" || phone === "") {
        document.getElementById("profileStatus").innerText = "⚠️ Please fill all fields!";
        document.getElementById("profileStatus").style.color = "red";
        return;
    }
    // 1. Hide the input fields and button
    document.getElementById("profileName").disabled = true;
    document.getElementById("profileEmail").disabled = true;
    document.getElementById("profilePhone").disabled = true;
    document.getElementById("saveProfileBtn").style.display = "none";
    
    document.getElementById("profileStatus").innerText = "✅ Profile Saved! Waiting for bottle...";
    document.getElementById("profileStatus").style.color = "green";
    // 2. Reveal the Dashboard with stats
    document.getElementById("dashboard").style.display = "block";
}
// Function to update stats (called when a bottle is crushed)
function updateStats(newPoints, newCans) {
    let history = document.getElementById("history");
    if (history.innerHTML.includes("No activity yet")) {
        history.innerHTML = "";
    }
    cans = newCans;
    points = newPoints;
    document.getElementById("points").innerText = points;
    document.getElementById("cans").innerText = cans;
    let percentage = (points / 50) * 100;
    if (percentage > 100) { percentage = 100; }
    document.getElementById("progress").style.width = percentage + "%";
    document.getElementById("current").innerText = points;
    let item = document.createElement("li");
    let time = new Date().toLocaleTimeString();
    item.innerText = "🌱 Bottle recycled! (" + time + ")";
    history.prepend(item);
}
