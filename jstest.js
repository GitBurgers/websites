const binId = "6811d2ea8960c979a59032a9";
const apiKey = "$2a$10$GU10NEpr.zl4cTGT3wAtXuxlTMrDfoRyeJ4Rsg22uYR6CngccpY6K";
const url = `https://api.jsonbin.io/v3/b/${binId}`;
let dayStates = {}; // Store event text per day
let hasUnsavedChanges = false;
let selectedColor = 1;
let totalStudyTime = 0;
let hasLoaded = 0;
let finalSTime = NaN;
let TimerText = NaN;
/* April(4): 30
May(5): 31
June(6): 30
*/
const time = new Date();
const day =  time.getDate();
const Month =  time.getMonth() + 1;
const startDay = 28;
const startMonth = 4;
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

////LOADED////
document.addEventListener("DOMContentLoaded", () => {
    buildCalendar();
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
    updateWarning();
    TimerText = document.getElementById("Timer")
    TimerText.setAttribute("seconds", 0);
    TimerText.setAttribute("minutes", 0);
    TimerText.setAttribute("clicked", "0");
});

////UPDATE////
async function updateWarning() {
    if (hasUnsavedChanges) {
        document.getElementById("saveWarning").innerText = "!!";
        document.getElementById("saveEvent").style.backgroundColor = "#dddddd";
    }
    else {
        document.getElementById("saveWarning").innerText = "";
        document.getElementById("saveEvent").style.backgroundColor = "#b3b3b3";
    }
    requestAnimationFrame(updateWarning);
}

////KEY PRESSED////
document.addEventListener('keydown', function(event) {
    //console.log(`Key pressed: ${event.key}`);
    if (event.key == " " && !hasLoaded) {document.body.style.cursor = "wait";loadDays()}
});

function StartLoad() {loadDays(); document.body.style.cursor = "wait";}
function loadDays() {
    dayStates["studyTime"] = Math.round(dayStates["studyTime"]);
    fetch(url, {
        headers: { 'X-Master-Key': apiKey }
    })
    .then(res => res.json())
    .then(data => {
        dayStates = data.record.days;
        hasLoaded = 1;
        buildCalendar();// BuildCalendar function is located here after data is taken
        document.body.style.cursor = null//"default";
        finalSTime = dayStates["studyTime"];
        //c("STime = " + (dayStates["studyTime"]+""))
        document.getElementById("loadC").style.backgroundColor = "#b3b3b3";
        UpdateSTime(0);
    })
    .catch(err => console.error("Error loading data:", err));
}

function saveDays() {
    dayStates["studyTime"] = Math.round(finalSTime);
    document.body.style.cursor = "wait";
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
        hasUnsavedChanges = false;
        document.body.style.cursor = "default";
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

function buildCalendar() {
    const container = document.querySelector(".calendar-grid");
    container.innerHTML = "";
    for (let i = 1; i <= 63; i++) {
        if (i % 7 == 1) {
            const weekDiv = document.createElement("div");
            weekDiv.textContent = Math.ceil(i / 7)
            weekDiv.className = "weekDiv";
            if (Math.ceil(i/7) % 2 == 1) {
                weekDiv.setAttribute("weekType", "b");
            } else {
                weekDiv.setAttribute("weekType", "a");
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
        if ((i % 7 == 5 && Math.ceil(i/7) % 2 == 1) || (i % 7 == 2 && Math.ceil(i/7) % 2 == 1)) {
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
        } else if (savedText.includes("/p")) {
            let trimmed = savedText.slice(0, -2);
            box.innerHTML = savedText
            ? `<div class="day-num">${displayDay}</div><div class="event-text">${trimmed}</div>`
            : `<div class="day-num">${displayDay}</div>`;
            box.setAttribute("boxEventColor", "purple");
        } else if (savedText.includes("/c")){
            let trimmed = savedText.slice(0, -2);
            box.innerHTML = savedText
            ? `<div class="day-num">${displayDay}</div><div class="event-text">${trimmed}</div>`
            : `<div class="day-num">${displayDay}</div>`;
            box.setAttribute("boxEventColor", "clear");
        } else {
            box.innerHTML = savedText
            ? `<div class="day-num">${displayDay}</div><div class="event-text">${savedText}</div>`
            : `<div class="day-num">${displayDay}</div>`;
            box.setAttribute("boxEventColor", "green");    
        }
        box.setAttribute("data-date", `${String(tempMonth).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`);
        box.setAttribute("dayNum", displayDay)
        if (monthDay == box.getAttribute("data-date")) {
            box.setAttribute("today", "true");
            if (box.getAttribute("boxColor") == "thursday") {
                document.getElementById("quickText").textContent = "Today: Piano"
            } else if (box.getAttribute("boxColor") == "friSports") {
                document.getElementById("quickText").textContent = "Today: Sport/PE"
            } else {
                document.getElementById("quickText").textContent = ""
            }
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
            } if (selectedColor == 5 && input.value != "") {
                text = (text+"")+"/p"
            } if (selectedColor == 6 && input.value != "") {
                text = (text+"")+"/c"
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
            } else if (text.includes("/g")){
                let trimmed2 = text.slice(0, -2);
                box.innerHTML = `<div class="day-num">${box.getAttribute("dayNum")}</div><div class="event-text">${trimmed2}</div>`
                box.setAttribute("boxEventColor", "grey")
            } else if (text.includes("/p")){
                let trimmed2 = text.slice(0, -2);
                box.innerHTML = `<div class="day-num">${box.getAttribute("dayNum")}</div><div class="event-text">${trimmed2}</div>`
                box.setAttribute("boxEventColor", "purple")
            } else if (text.includes("/c")){
                let trimmed2 = text.slice(0, -2);
                box.innerHTML = `<div class="day-num">${box.getAttribute("dayNum")}</div><div class="event-text">${trimmed2}</div>`
                box.setAttribute("boxEventColor", "clear")
            } else {
                box.innerHTML = `<div class="day-num">${box.getAttribute("dayNum")}</div><div class="event-text">${text}</div>`
                box.setAttribute("boxEventColor", "green")
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
    scrollFrame.scrollTo({ top: ((week-1)*90)-110, behavior: "smooth" }); /////////////////////////////////////////////////////////////////////
    modifyEvents();
    if (hasLoaded) dueWorkList();
}

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
    let daysList = []
    let taskList = []
    let urgentTaskList = []
    const dueContainer = document.getElementById("dueList");
    for (let i = 1; i <= 100; i++) {
        let tempKey = "day" + i;
        if (dayStates[tempKey] && dayStates[tempKey].trim() !== "") {
            let newDue = document.createElement("p");
            newDue.className = ("newDue")
            newDue.textContent = `${dayDifference(i)}: ${dayStates[tempKey]}`;
            if (!newDue.textContent.includes("/g") && !newDue.textContent.includes("/p") && !newDue.textContent.includes("/c")) {
                if (newDue.textContent.includes("/o")) {
                    newDue.setAttribute("dueColor", "or")
                    newDue.textContent = newDue.textContent.slice(0, -2);
                } else if (newDue.textContent.includes("/r")) {
                    newDue.setAttribute("dueColor", "red")
                    newDue.textContent = newDue.textContent.slice(0, -2);
                    daysList.push(dayDifference(i));
                } else {
                    if (dayDifference(i) < 3) {
                        newDue.textContent = ("!!"+newDue.textContent);
                        taskList.push(dayDifference(i));
                    } else if (dayDifference(i) < 5) {
                        newDue.textContent = ("!"+newDue.textContent);
                        urgentTaskList.push(dayDifference(i));
                    }
                }
                dueContainer.appendChild(newDue);
            }}}
    for (let j=0;j<daysList.length;j++) {totalStudyTime = totalStudyTime+Math.max(0,15-daysList[j]);}
    totalStudyTime = Math.pow(totalStudyTime, 3/4) * 12;
    (time.getDay() == 6 || time.getDay() == 0) && (totalStudyTime *= 1.5);
    totalStudyTime -= taskList.length*10;
    totalStudyTime -= urgentTaskList.length*15;
    totalStudyTime = Math.round(totalStudyTime);
    //totalStudyTime = Math.min(totalStudyTime, 0)
    c("todays ST: "+(Math.round(totalStudyTime)+""));
}

function dayDifference(Target) {
    return((Target-1+startDay)-tempWeekFind);
}

function STimeC() {
    let tempTime = dayStates["studyTime"] + Math.round(totalStudyTime);
    const GenTime = document.getElementById("STimeAdd");
    const isAdded = GenTime.getAttribute("added") === "true";
    if (!isAdded) {
        document.getElementById("STime").innerText = `Study Time: ${tempTime}m`;
        finalSTime = tempTime;
        GenTime.innerText = "Remove";
        GenTime.setAttribute("added", "true");
    } else {
        let newTempTime = tempTime - Math.round(totalStudyTime);
        finalSTime = newTempTime;
        document.getElementById("STime").innerText = `Study Time: ${newTempTime}m`;
        GenTime.innerText = "Generate Time";
        GenTime.setAttribute("added", "false");
    }
}

function Studying() {
    if (hasLoaded) {
        if (TimerText.getAttribute("clicked") == "0") {
            TimerText.setAttribute("clicked", "1");
            let newTText = (TimerText.getAttribute("seconds").toString().padStart(2, '0') + ":" + TimerText.getAttribute("minutes").toString().padStart(2, '0'));
            TimerText.innerText = (newTText + " / " + dayStates["studyTime"].toString() + ":00");

            expected = Date.now() + 1000;
            TimeCounter();
        } else {
            TimerText.setAttribute("clicked", "0");
            TimerText.innerText = "";
        }
    }
}

let expected = 0;
let count = 0;
function TimeCounter() {
    const now = Date.now();
    const drift = now - expected;
    if (drift > 1000) {console.warn('Timer is behind by', drift, 'ms');}

    let mins = TimerText.getAttribute("minutes");
    let secs = TimerText.getAttribute("seconds");
    if (TimerText.getAttribute("clicked") == "0") {
        dayStates["studyTime"] -= (secs > 29 ? Number(mins) + 1 : Number(mins));
        TimerText.setAttribute("seconds", 0);
        TimerText.setAttribute("minutes", 0);
        UpdateSTime(1);
        return;
    }
    secs++;
    if (secs > 59) {
        secs = 0;
        mins++;
    }
    TimerText.setAttribute("seconds", secs);
    TimerText.setAttribute("minutes", mins);
    TimerText.innerText = (mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0') + " / " + dayStates["studyTime"].toString() + ":00")
    document.getElementById("Title").textContent = 
    ("Term 2 Calendar "+mins.toString().padStart(2, '0')+":"+secs.toString().padStart(2, '0') + "/" + dayStates["studyTime"].toString())

    expected += 1000;
    count++;
    if (count < 3) {setTimeout(TimeCounter, 1000);c("be")}
    else {setTimeout(TimeCounter, Math.max(0, 1 - drift));}
}

function UpdateSTime(save) {
    document.getElementById("STime").innerText = `Study Time: ${Math.round(dayStates["studyTime"])}m`;
    if (save) {hasUnsavedChanges=1}
}
