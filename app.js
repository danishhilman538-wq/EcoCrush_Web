// Global variable to store the current user's name
let currentUser = "";

// Function triggered when user clicks Save Profile
function saveProfile() {
    let name = document.getElementById("profileName").value;
    let email = document.getElementById("profileEmail").value;
    let phone = document.getElementById("profilePhone").value;

    // RULE: Enforce that all details are filled before proceeding!
    if(name === "" || email === "" || phone === "") {
        document.getElementById("profileStatus").innerText = "⚠️ Please fill all details first!";
        document.getElementById("profileStatus").style.color = "red";
        return;
    }

    currentUser = name; // Store it so we can filter records later!

    // 1. Hide the input fields and button
    document.getElementById("profileName").disabled = true;
    document.getElementById("profileEmail").disabled = true;
    document.getElementById("profilePhone").disabled = true;
    document.getElementById("saveProfileBtn").style.display = "none";
    
    document.getElementById("profileStatus").innerText = "✅ Profile Saved!";
    document.getElementById("profileStatus").style.color = "green";

    // 2. Reveal the Dashboard with stats
    document.getElementById("dashboard").style.display = "block";
    
    // 3. Save the profile to Firebase so the Python script can read it!
    fetch("https://firestore.googleapis.com/v1/projects/ecocrush-53d12/databases/(default)/documents/users/latest_session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            fields: {
                name: { stringValue: name },
                email: { stringValue: email },
                phone: { stringValue: phone },
                timestamp: { timestampValue: new Date().toISOString() }
            }
        })
    });

    // 4. Load the Machine Stats and GPS Location from Firebase immediately...
    loadStatsFromFirebase();
    
    // 5. ...and keep polling Firebase every 3 seconds for REAL-TIME updates!
    setInterval(loadStatsFromFirebase, 3000);
}

// Function to fetch Date, Time, GPS, and Points from Firebase
function loadStatsFromFirebase() {
    let url = "https://firestore.googleapis.com/v1/projects/ecocrush-53d12/databases/(default)/documents/records";
    
    fetch(url)
    .then(response => response.json())
    .then(data => {
        let history = document.getElementById("history");
        history.innerHTML = ""; // clear loading text
        
        let totalPoints = 0;
        let bottles = 0;
        
        if (data.documents) {
            // Loop through all records in Firebase
            data.documents.forEach(doc => {
                let fields = doc.fields;
                
                // ONLY process records that belong to the current user!
                let recordName = fields.name ? fields.name.stringValue : "";
                
                if (fields && recordName === currentUser) {
                    bottles += 1;
                    let pts = parseInt(fields.total_points ? fields.total_points.integerValue : "0");
                    totalPoints += pts;
                    
                    let gps = fields.gps_location ? fields.gps_location.stringValue : "Unknown GPS";
                    let timeRaw = fields.timestamp ? fields.timestamp.timestampValue : new Date().toISOString();
                    
                    // Format Date and Time nicely
                    let dateObj = new Date(timeRaw);
                    let formattedTime = dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();

                    // Create the Recent Activity List Item
                    let item = document.createElement("li");
                    item.innerHTML = `<strong>+${pts} Point</strong> <br><small>📍 ${gps} <br>🕒 ${formattedTime}</small>`;
                    history.prepend(item);
                }
            });
        }
        
        if (bottles === 0) {
            history.innerHTML = "<li>No bottles recycled yet</li>";
        }
        
        // Update the big numbers on the dashboard
        document.getElementById("points").innerText = totalPoints;
        document.getElementById("cans").innerText = bottles;

        let percentage = (totalPoints / 50) * 100;
        if (percentage > 100) { percentage = 100; }
        
        document.getElementById("progress").style.width = percentage + "%";
        document.getElementById("current").innerText = totalPoints;
    })
    .catch(err => {
        document.getElementById("history").innerHTML = "<li>Error loading data from Firebase</li>";
    });
}
