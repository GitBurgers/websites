const binId = "67f8d1208a456b7966871d39";
const apiKey = "$2a$10$NKFzNwGZ2lEFGv2eFf1jzu73QKC.sFeuZgvgiofw1xzkpg4/dKyU6";
const url = `https://api.jsonbin.io/v3/b/${binId}`;
let dayStates = {}; // Store event text per day
let hasUnsavedChanges = false;
/* April(4): 30
May(5): 31
June(6): 30
*/
const time = new Date();
const day = 28//time.getDate();
const Month = 4//time.getMonth()
const startDay = 28
const startMonth = 4
const monthDay = `${String(Month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
const c = console.log;
let tempWeekFind = day;
if (Month > 4) {
    tempWeekFind += 30;
}
if (Month > 5) {
    tempWeekFind += 31;
}
if (Month > 6) {
    tempWeekFind += 30;
}
const week = Math.ceil((tempWeekFind-startDay) / 7);
console.log(`${monthDay} is today`);
console.log(`${week} is this week`);
////
let selectedColor = 1;
////
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
        hasUnsavedChanges = false;
    })
    .catch(err => console.error("Save error:", err));
}

// Show saved event in tooltip and visual style
function renderTooltip(box, text) {
    box.title = text || "";
    if (text && text.trim() !== "") {
        box.classList.add("active");
    } else {
        box.classList.remove("active");
    }
}

// Build the 14-day grid
function buildCalendar() {
    const container = document.querySelector(".calendar-grid");
    container.innerHTML = "";
    for (let i = 1; i <= 63; i++) {
        if (i % 7 == 1) {
            const weekDiv = document.createElement("div");
            weekDiv.textContent = Math.ceil(i / 7)
            weekDiv.className = "weekDiv";
            if (Math.ceil(i/7) % 2 == 1) {
                weekDiv.setAttribute("weekType", "a");
            } else {
                weekDiv.setAttribute("weekType", "b");
            }
            container.appendChild(weekDiv);
        }
        const dayKey = "day" + i;
        const box = document.createElement("div");
        box.className = "day-box";
        box.dataset.day = i;
        
        if (i % 7 == 0 || i % 7 == 6) {
            box.setAttribute("boxColor", "weekend")
        }
        if (i % 7 == 4) {
            box.setAttribute("boxColor", "thursday")
        }
        if (i % 7 == 5 && Math.ceil(i/7) % 2 == 0) {
            box.setAttribute("boxColor", "friSports")
        }
        const savedText = dayStates[dayKey] || "";
        renderTooltip(box, savedText);
        let tempMonth = 4
        let displayDay = i+startDay-1
        if (displayDay > 30 && tempMonth == 4) {
            displayDay -= 30;
            tempMonth++;
        }
        if (displayDay > 31 && tempMonth == 5) {
            displayDay -= 31;
            tempMonth++;
        }
        if (displayDay > 30 && tempMonth == 6) {
            displayDay -= 30;
            tempMonth++;
        }
        box.setAttribute("week", Math.ceil(displayDay / 7));
        if (savedText.includes("/r")) {
            let trimmed = savedText.slice(0, -2);
            box.innerHTML = savedText
            ? `<div class="day-num">${displayDay}</div><div class="event-text">${trimmed}</div>`
            : `<div class="day-num">${displayDay}</div>`;
            box.setAttribute("boxEventColor", "red")
        } else if (savedText.includes("/o")) {
            let trimmed = savedText.slice(0, -2);
            box.innerHTML = savedText
            ? `<div class="day-num">${displayDay}</div><div class="event-text">${trimmed}</div>`
            : `<div class="day-num">${displayDay}</div>`;
            box.setAttribute("boxEventColor", "or");
        } else if (savedText.includes("/g")) {
            let trimmed = savedText.slice(0, -2);
            box.innerHTML = savedText
            ? `<div class="day-num">${displayDay}</div><div class="event-text">${trimmed}</div>`
            : `<div class="day-num">${displayDay}</div>`;
            box.setAttribute("boxEventColor", "grey");
        } else {
            box.innerHTML = savedText
            ? `<div class="day-num">${displayDay}</div><div class="event-text">${savedText}</div>`
            : `<div class="day-num">${displayDay}</div>`;      
        }
        box.setAttribute("data-date", `${String(tempMonth).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`);
        box.setAttribute("dayNum", displayDay)
        if (monthDay == box.getAttribute("data-date")) {
            box.setAttribute("today", "true");
        }
        box.addEventListener("click", () => {
            const input = document.getElementById("eventInput");
            let text = input.value.trim();
            if (selectedColor == 2 && input.value != "") {
                text = (text+"")+"/o"
            } if (selectedColor == 3 && input.value != "") {
                text = (text+"")+"/r"
            } if (selectedColor == 4 && input.value != "") {
                text = (text+"")+"/g"
            } 
                // Save or clear local data
            if (text !== "") {
                dayStates[dayKey] = text;
            } else {
                dayStates[dayKey] = "";
            }

            if (text.includes("/r")) {
                let trimmed2 = text.slice(0, -2);
                box.innerHTML = `<div class="day-num">${box.getAttribute("dayNum")}</div><div class="event-text">${trimmed2}</div>`
                box.setAttribute("boxEventColor", "red")
            } else if (text.includes("/o")){
                let trimmed2 = text.slice(0, -2);
                box.innerHTML = `<div class="day-num">${box.getAttribute("dayNum")}</div><div class="event-text">${trimmed2}</div>`
                box.setAttribute("boxEventColor", "or")
            }
            else if (text.includes("/g")){
                let trimmed2 = text.slice(0, -2);
                box.innerHTML = `<div class="day-num">${box.getAttribute("dayNum")}</div><div class="event-text">${trimmed2}</div>`
                box.setAttribute("boxEventColor", "grey")
            } else {
                box.innerHTML = `<div class="day-num">${box.getAttribute("dayNum")}</div><div class="event-text">${text}</div>`
            }
            renderTooltip(box, text);
            input.value = "";
            hasUnsavedChanges = true;
            modifyEvents()
        });
        container.appendChild(box);
        box.addEventListener("mouseenter", () => {
            let dayAdd = "";
            if ((i-1+startDay)-tempWeekFind >= 0) {
                dayAdd = ("+" + ((i-1+startDay)-tempWeekFind) + "");
            }else{
                dayAdd = (((i-1+startDay)-tempWeekFind) + "");
            }
            box.setAttribute("title", dayAdd)
        });
    }
    const scrollFrame = document.getElementById("calendarScroll");
    scrollFrame.scrollTo({ top: (week-1)*92, behavior: "smooth" });
    modifyEvents();
    dueWorkList();
}

// Optionally save on page unload
window.addEventListener("beforeunload", () => {
    if (hasUnsavedChanges) {
        saveDays();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    loadDays();
    let colorButtons = document.querySelectorAll(".colorChange");
    colorButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        selectedColor = index + 1;
        colorButtons.forEach(b => b.classList.remove("toggled"));
        btn.classList.add("toggled");
});
});
    const green = document.getElementById("color-green");
    green.classList.add("toggled");
});
function modifyEvents() {
    let getText = document.querySelectorAll(".event-text");
    getText.forEach(el => {
        /*let lines = el.innerHTML.split("<br>").length;
        console.log("Logical lines:", lines); */
        let fontSize = 25 - (el.textContent.length / 1.5);
        fontSize = Math.max(fontSize, 15)
        el.style.fontSize = fontSize + "px";
        let text = el.innerHTML;
        // Replace '//' with <br>
        let formatted = text.split("//").map(part => part.trim()).join("<br>");
        el.innerHTML = formatted;
    });
}

function clearInput() {
    document.getElementById("eventInput").value = "";
}

function dueWorkList() {
    const dueContainer = document.getElementById("dueList");
    dueContainer.innerHTML = "<h3>📚 Due Work</h3>"; // Clear and reset heading
    for (let i = 1; i <= 100; i++) {
        let tempKey = "day" + i;
        if (dayStates[tempKey] && dayStates[tempKey].trim() !== "") {
            let newDue = document.createElement("p");
            newDue.className = ("newDue")
            newDue.textContent = `Day ${i}: ${dayStates[tempKey]}`;
            if (!newDue.textContent.includes("/g")) {
                if (newDue.textContent.includes("/o")) {
                    newDue.setAttribute("dueColor", "or")
                    newDue.textContent = newDue.textContent.slice(0, -2)
                } else if (newDue.textContent.includes("/r")) {
                    newDue.setAttribute("dueColor", "red")
                    newDue.textContent = newDue.textContent.slice(0, -2)
                }
                dueContainer.appendChild(newDue);
            }
    }
    }
}
