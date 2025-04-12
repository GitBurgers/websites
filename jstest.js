const binId = "67f8d1208a456b7966871d39";
const apiKey = "$2a$10$NKFzNwGZ2lEFGv2eFf1jzu73QKC.sFeuZgvgiofw1xzkpg4/dKyU6";
const url = `https://api.jsonbin.io/v3/b/${binId}`;
let dayStates = {}; // Stores text for each day

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

// Render tooltips and visual indicator
function renderTooltip(box, text) {
    box.title = text || "";
    if (text && text.trim() !== "") {
        box.classList.add("active");
    } else {
        box.classList.remove("active");
    }
}

// Build grid using text-based data
function buildCalendar() {
    const container = document.querySelector(".calendar-grid");
    container.innerHTML = "";

    for (let i = 1; i <= 14; i++) {
        const dayKey = "day" + i;
        const box = document.createElement("div");
        box.className = "day-box";
        box.dataset.day = i;

        const savedText = dayStates[dayKey] || "";
        renderTooltip(box, savedText);

        // Set the visible text inside the box
        box.textContent = savedText ? `${i}: ${savedText}` : `${i}`;

        box.addEventListener("click", () => {
            const input = document.getElementById("eventInput");
            const text = input.value.trim();

            if (text !== "") {
                dayStates[dayKey] = text;
            } else {
                dayStates[dayKey] = "";
            }

            // Update box text and tooltip
            box.textContent = text ? `${i}: ${text}` : `${i}`;
            renderTooltip(box, text);
            saveDays();
        });

        container.appendChild(box);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    loadDays();
});

function clearInput() {
    document.getElementById("eventInput").value = "";
}
