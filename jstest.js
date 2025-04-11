const binId = "67f8d1208a456b7966871d39"; // ← Replace this
const apiKey = "$2a$10$NKFzNwGZ2lEFGv2eFf1jzu73QKC.sFeuZgvgiofw1xzkpg4/dKyU6"; // ← Replace this
const url = `https://api.jsonbin.io/v3/b/${binId}`;
let dayStates = {}; // Store current states

function click1() {
    let theme = sessionStorage.getItem("name");
    document.getElementById("top").innerText = theme;
}

function showText() {
    const userText = document.getElementById("textInput").value;
    document.getElementById("outputArea").textContent = "You wrote: " + userText;
    sessionStorage.setItem("name", userText);
}

// Load day data from JSONBin
function loadDays() {
    fetch(url, {
        headers: { 'X-Master-Key': apiKey }
    })
    .then(res => res.json())
    .then(data => {
        dayStates = data.record.days;
        buildCalendar();
    })
    .catch(err => console.error("Error loading data:", err));
}

// Save day data back to JSONBin
function saveDays() {
    fetch(url, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey
        },
        body: JSON.stringify({ days: dayStates })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Data saved to JSONBin:", data);
    })
    .catch(err => console.error("Save error:", err));
}

// Build grid using data from JSONBin
function buildCalendar() {
    const container = document.querySelector(".calendar-grid");
    container.innerHTML = "";

    for (let i = 1; i <= 14; i++) {
        const box = document.createElement("div");
        box.className = "day-box";
        box.textContent = i;
        box.dataset.day = i;

        if (dayStates["day" + i]) {
            box.classList.add("active");
        }

        box.addEventListener("click", () => {
            box.classList.toggle("active");
            dayStates["day" + i] = box.classList.contains("active");
            saveDays();
        });

        container.appendChild(box);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadDays();
});
