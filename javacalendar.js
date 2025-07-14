

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, set, get, child } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

// 🔑 Your Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyBVOC6RVvQw2V7YSN8MF24kM0p9N1tcfTo",
    authDomain: "calendar-5487e.firebaseapp.com",
    databaseURL: "https://calendar-5487e-default-rtdb.firebaseio.com",
    projectId: "calendar-5487e",
    storageBucket: "calendar-5487e.firebasestorage.app",
    messagingSenderId: "705086479682",
    appId: "1:705086479682:web:5511ad5b3e00921947bcdb",
    measurementId: "G-CGMRRC6B0B"
};

// 🔗 Initialize Firebase and get database
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);


const c = console.log;
let dayStates = {}; // Store event text per day
let hasUnsavedChanges = false;
let selectedColor = 1;
let totalStudyTime = 0;
let hasLoaded = 0;
let PrevSTime = NaN;
let TimerText = NaN;
let TimerDetectSec = 0;
let STelement = 0;

let pressingControl = 0;
let pressingBacktick = 0;
let time = new Date();
const day =  22//time.getDate();
const Month =  time.getMonth() + 1;
const Year = time.getFullYear();
const startDay = 21;
const startMonth = 7;
const monthDay = `${String(Month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
let tempWeekFind = day;
if (Month > 7) {
    tempWeekFind += 31;
}
if (Month > 8) {
    tempWeekFind += 31;
}
if (Month > 9) {
    tempWeekFind += 30;
} // To change the starting month, add more if() until it covers the whole calendar
const MonthList = ["January", "February", "March", "April", "May", "June", "July", "August", "September"]
const week = Math.ceil((tempWeekFind-startDay) / 7);
console.log(`${monthDay} is today`);
console.log(`${week} is this week`);

////CONTENT LOADED////
document.addEventListener("DOMContentLoaded", () => {
    if (Testmode){document.getElementById("load_heading").hidden="true";document.getElementById("loadC").hidden="true"}
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
    TimerText = document.getElementById("Timer")
    TimerText.setAttribute("seconds", 0);
    TimerText.setAttribute("minutes", 0);
    TimerText.setAttribute("clicked", "0");
    STelement = document.getElementById("STime");

    document.getElementById("STimeAdd").hidden=true;document.getElementById("TimeB").hidden = true
    Loop();
});

////UPDATE////
function Loop() {
    if (hasUnsavedChanges) {
        document.getElementById("saveWarning").innerText = "!!";
        document.getElementById("saveEvent").style.backgroundColor = "#dddddd";
    }
    else {
        document.getElementById("saveWarning").innerText = "";
        document.getElementById("saveEvent").style.backgroundColor = "#b3b3b3";
    }
    if (!hasLoaded) {document.getElementById("STime").innerText = "Study Time: None"} else {
    document.getElementById("STime").innerText = `Study Time: ${Math.round(dayStates["studyTime"])}m`}
    if (hasLoaded && TimerText.getAttribute("clicked") == "1") {
        time = new Date();
        if (TimerDetectSec != time.getSeconds()) {TimerDetectSec = time.getSeconds();TimeCounter()}
    }
    if (dayStates["studyTime"] < 0) {
        STelement.style.color = "#ffffff"
        STelement.innerHTML =`Overtime: <span id="colored">${0-dayStates["studyTime"]}m</span>`
        document.getElementById("colored").style.color = "#00ee00";
    } else {STelement.style.color = "#ffffff"}
    setTimeout(Loop, 200)
}

////KEY PRESSED////
document.addEventListener('keydown', function(event) {
    if (event.key == " " && !hasLoaded) {document.getElementById("loadC").style.cursor = "wait";document.body.style.cursor = "wait";newLoadDays()}
    if (event.key == "?") {c(dayStates["studyTime"].toString() + ";" + totalStudyTime.toString() + ";" + PrevSTime.toString())}
    if (event.key == "|") {}
    if (event.key == "Control") {pressingControl = 1}
    if (event.key == "`") {pressingBacktick = 1}
    if (event.key == "1" && pressingBacktick) {ISADMIN = 1}
    //c(event.key)
}); document.addEventListener('keyup', function(event) {
    if (event.key == "Control") {pressingControl = 0}
    if (event.key == "`") {pressingBacktick = 0}
});



///LOAD///
window.StartLoad = StartLoad;
function StartLoad() {document.getElementById("loadC").style.cursor = "wait";document.body.style.cursor = "wait";newLoadDays()}
function newLoadDays() {
    document.getElementById("loadC").style.cursor = "wait";
    document.body.style.cursor = "wait";

    const dbRef = ref(db);
    get(child(dbRef, "Admin/Calendar")).then((snapshot) => {
        if (snapshot.exists()) {
            const newdata = snapshot.val()
            dayStates = snapshot.val();
            dayStates["studyTime"] = Math.round(dayStates["studyTime"] || 0);
            hasLoaded = 1;
            document.getElementById("STimeAdd").hidden=true;document.getElementById("TimeB").hidden = true;
            document.getElementById("load_heading").hidden=true;document.getElementById("loadC").hidden=true;
            buildCalendar();
            PrevSTime = dayStates["studyTime"];
            document.getElementById("loadC").style.backgroundColor = "#b3b3b3";
            document.getElementById("loadC").style.cursor = "default";
            document.getElementById("STimeAdd").style.backgroundColor = '#bbbbbb';
            document.body.style.cursor = "default";
        } else {
            console.error("No data available");
        }
    }).catch((error) => {
        console.error("Error loading data:", error);
    });
}

///SAVE///
window.storeDays = storeDays;
function storeDays() {
    document.body.style.cursor = "wait";
    document.getElementById("saveEvent").style.cursor = "wait";

    set(ref(db, "calendar"), dayStates)
    .then(() => {
        hasUnsavedChanges = false;
        document.body.style.cursor = "default";
        document.getElementById("saveEvent").style.cursor = "default";
    })
    .catch((error) => {
        console.error("Save error:", error);
    });
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
    for (let i = 1; i <= 70; i++) {
        if (i % 7 == 1) {
            const weekDiv = document.createElement("div");
            weekDiv.textContent = Math.ceil(i / 7)
            weekDiv.className = "weekDiv";
            if (Math.ceil(i/7) % 2 == 0) {
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
        let tempMonth = startMonth
        let displayDay = i+startDay-1
        //Adjust this when changing the calendar starting month
        if (displayDay > 31 && tempMonth == 7) {
            displayDay -= 31;
            tempMonth++;
        }
        if (displayDay > 31 && tempMonth == 8) {
            displayDay -= 31;
            tempMonth++;
        }
        if (displayDay > 30 && tempMonth == 9) {
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
        if (savedText[0] == "#") {
            let trimmed = savedText.slice(3, -2);
            box.innerHTML = savedText
            ? `<div class="day-num">${displayDay}</div><div class="event-text">${trimmed}</div>`
            : `<div class="day-num">${displayDay}</div>`;
            box.setAttribute("priority", (savedText[1]+savedText[2]));
        }
        box.setAttribute("data-date", `${String(tempMonth).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`);
        box.setAttribute("dayNum", displayDay)
        if (monthDay == box.getAttribute("data-date")) { //If the box is today//
            box.setAttribute("today", "true");
            if (box.getAttribute("boxColor") == "thursday") {
                document.getElementById("quickText").textContent = "Today: Piano/Tennis"
            } else if (box.getAttribute("boxColor") == "friSports") {
                document.getElementById("quickText").textContent = "Today: Sport/PE, bring Sport Shoes"
            } else {
                document.getElementById("quickText").textContent = ""
            }
        }
        box.addEventListener("click", () => {
            if (!pressingControl) {
            const input = document.getElementById("eventInput");
            let text = input.value.trim();
            if (input.value != "") {
                switch(selectedColor) {
                    case 2: {text = (text+"")+"/o";break;}
                    case 3: {text = (text+"")+"/r";break;}
                    case 4: {text = (text+"")+"/g";break;}
                    case 5: {text = (text+"")+"/p";break;}
                    case 6: {text = (text+"")+"/c";break;}
                }}
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
        }});
        container.appendChild(box);
        box.addEventListener("mouseenter", () => {
            let dayAdd = "";
            if ((i-1+startDay)-tempWeekFind >= 0) {
                dayAdd = ("+" + ((i-1+startDay)-tempWeekFind) + "");
            }else{
                dayAdd = (((i-1+startDay)-tempWeekFind) + "");
            }
            if (dayAdd.includes("+0")){dayAdd = "Today"}
            dayAdd += `, ${MonthList[tempMonth-1]} ${displayDay} ${Year}`//`, ${displayDay}/${tempMonth}/${Year}`
            box.setAttribute("title", dayAdd)
        });
    }
    const scrollFrame = document.getElementById("calendarScroll");
    scrollFrame.scrollTo({ top: ((week-1)*86)-65, behavior: "smooth" });
    modifyEvents();
    if (hasLoaded) dueWorkList();
}

function modifyEvents() {
    let getText = document.querySelectorAll(".event-text");
    getText.forEach(el => {
        /*let lines = el.innerHTML.split("<br>").length;
        console.log("Logical lines:", lines); */
        let fontSize = 25 - (el.textContent.length / 1.5);
        fontSize = Math.max(fontSize, 14)
        el.style.fontSize = fontSize + "px";
        let text = el.innerHTML;
        // Replace '//' with <br>
        let formatted = 0
        if (!text.includes("https://")) {formatted = text.split("//").map(part => part.trim()).join("<br>")
            el.innerHTML = formatted;
        }
    });
}

window.clearInput = clearInput;
function clearInput() {
    document.getElementById("eventInput").value = "";
}

function dueWorkList() {
    let daysList = []
    let priorityList = []
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
                    if (newDue.textContent.includes("#")) {
                        c(dayStates[tempKey][1].toString()+dayStates[tempKey][2].toString());
                        priorityList.push(Number(dayStates[tempKey][1].toString()+dayStates[tempKey][2].toString()));
                        newDue.textContent = dayDifference(i)+": "+dayStates[tempKey].slice(3,-2);
                    } else {priorityList.push(15)}
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
    c(priorityList)
    for (let j=0;j<daysList.length;j++) {totalStudyTime = totalStudyTime + Math.max(0, priorityList[j]-daysList[j]);}
    totalStudyTime = Math.pow(totalStudyTime, 3/4) * 15;
    (time.getDay() == 6 || time.getDay() == 0) && (totalStudyTime *= 1.5);
    (time.getDay() == 3) && (totalStudyTime *= 0.8)
    totalStudyTime -= taskList.length*5;
    totalStudyTime -= urgentTaskList.length*10;
    if (0 < totalStudyTime && totalStudyTime < 20) {totalStudyTime = 20}
    totalStudyTime = Math.round(totalStudyTime);
    totalStudyTime = Math.max(totalStudyTime, 0);
    c("todays ST: "+(Math.round(totalStudyTime)+""));
}

function dayDifference(Target) {
    return((Target-1+startDay)-tempWeekFind);
}

window.STimeC = STimeC;
function STimeC() {
    //let tempTime = dayStates["studyTime"] + Math.round(totalStudyTime);
    const GenTime = document.getElementById("STimeAdd");
    const isAdded = GenTime.getAttribute("added") === "true";
    if (!isAdded) {
        //STelement.innerText = `Study Time: ${tempTime}m`;
        //PrevSTime = tempTime;
        dayStates["studyTime"] += totalStudyTime
        GenTime.innerText = "Remove";
        GenTime.setAttribute("added", "true");
    } else {
        //let newTempTime = tempTime - Math.round(totalStudyTime);
        //PrevSTime = newTempTime;
        dayStates["studyTime"] -= totalStudyTime
        //document.getElementById("STime").innerText = `Study Time: ${newTempTime}m`;
        GenTime.innerText = "Generate Time";
        GenTime.setAttribute("added", "false");
    }
}

window.Studying = Studying;
function Studying() {
    if (hasLoaded) {
        if (TimerText.getAttribute("clicked") == "0") {
            let findInput = document.getElementById("eventInput").value;
            let findInputType = typeof Number(findInput);
            if (findInput != "" && findInputType == "number") {dayStates["studyTime"] = findInput;clearInput()} else {
                TimerText.setAttribute("clicked", "1");
                PrevSTime = dayStates["studyTime"];
                time = new Date();
                TimerDetectSec = time.getSeconds();
                TimerText.innerText = (TimerText.getAttribute("minutes").toString().padStart(2, '0') + ":" + TimerText.getAttribute("seconds").toString().padStart(2, '0'))
            }
        } else {
            TimerText.setAttribute("clicked", "0");
            TimerText.innerText = "";
        }
    }
}

////The Study Counter Function////
function TimeCounter() {
    let mins = TimerText.getAttribute("minutes");
    let secs = TimerText.getAttribute("seconds");
    if (TimerText.getAttribute("clicked") == "0") {
        hasUnsavedChanges = 1
        return;
    }
    secs++;
    if (secs > 59) {
        dayStates["studyTime"] -= 1
        secs = 0;
        mins++;
    }
    TimerText.setAttribute("seconds", secs);
    TimerText.setAttribute("minutes", mins);
    TimerText.innerText = (mins.toString().padStart(2, '0') + ":" + secs.toString().padStart(2, '0'));
    document.getElementById("Title").textContent = 
    (Math.round(dayStates["studyTime"]).toString() + ":" + (59 - secs).toString().padStart(2,"0") + " / " + PrevSTime.toString());
}
