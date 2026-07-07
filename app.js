let points = 0;
let cans = 0;

function recycleCan() {

    let history = document.getElementById("history");

    if (history.innerHTML.includes("No activity yet")) {
        history.innerHTML = "";
    }

    cans += 1;
    points += 5;

    document.getElementById("points").innerText = points;
    document.getElementById("cans").innerText = cans;

    let percentage = (points / 50) * 100;

    if (percentage > 100) {
        percentage = 100;
    }

    document.getElementById("progress").style.width = percentage + "%";

    document.getElementById("current").innerText = points;

    let item = document.createElement("li");

    let time = new Date().toLocaleTimeString();

    item.innerText = "♻️ Can recycled +5 points (" + time + ")";

    history.prepend(item);
}