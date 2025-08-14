
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
let loadclicked = 0;
let time = new Date();
const day =  time.getDate();
const Month =  time.getMonth() + 1;
const Year = time.getFullYear();

//Calendar_Settings:
const startDay = 21;
const startMonth = 7;
const startWeek = 0; // 0=A, 1=B

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
    if (gss(1)==1){getel("load_heading").hidden="true";getel("loadC").hidden="true"}
    buildCalendar();
    let colorButtons = document.querySelectorAll(".colorChange");
    colorButtons.forEach((btn, index) => {
    btn.addEventListener("click", () => {
        selectedColor = index + 1;
        colorButtons.forEach(b => b.classList.remove("toggled"));
        btn.classList.add("toggled");
    });
    });
    const green = getel("color-green");
    green.classList.add("toggled");
    TimerText = getel("Timer")
    TimerText.setAttribute("seconds", 0);
    TimerText.setAttribute("minutes", 0);
    TimerText.setAttribute("clicked", "0");
    STelement = getel("STime");

    if (gss(3)!=0) {getel("LoggedIn").innerText = "Logged in!"}
    if (gss(1)==1) {getel("LoggedIn").innerText = "In Test Mode"}

    loadTDL();
    Loop();
});

////UPDATE////
function Loop() {
    if (hasUnsavedChanges) {
        getel("saveWarning").innerText = "!!";
        getel("saveEvent").style.backgroundColor = "#dddddd";
    }
    else {
        getel("saveWarning").innerText = "";
        getel("saveEvent").style.backgroundColor = "#b3b3b3";
    }
    if (!hasLoaded) {getel("STime").innerText = "Study Time: None"} else {
    getel("STime").innerText = `Study Time: ${Math.round(dayStates["studyTime"])}m`}
    if (hasLoaded && TimerText.getAttribute("clicked") == "1") {
        time = new Date();
        if (TimerDetectSec != time.getSeconds()) {TimerDetectSec = time.getSeconds();TimeCounter()}
    }
    if (dayStates["studyTime"] < 0) {
        STelement.style.color = "#ffffff"
        STelement.innerHTML =`Overtime: <span id="colored">${0-dayStates["studyTime"]}m</span>`
        getel("colored").style.color = "#00ee00";
    } else {STelement.style.color = "#ffffff"}
    if (getel("LogInput").value!=""){getel("LogIn").setAttribute("Ready","1")}
    else {getel("LogIn").setAttribute("Ready","0")}
    setTimeout(Loop, 500)
}

////KEY PRESSED////
document.addEventListener('keydown', function(event) {
    if (event.key == "2" && !hasLoaded && gss(2)==1) {getel("loadC").style.cursor = "wait";document.body.style.cursor = "wait";newLoadDays()}
    if (event.key == "?") {c(dayStates)}
    if (event.key == "|") {c(TDList)}
    if (event.key == "Control") {pressingControl = 1}
    if (event.key == "`") {pressingBacktick = 1}
    if (event.key == "1" && pressingBacktick) {sss(2, 1);getel("LoggedIn").innerText = "Welcome back Riley";sss(3,"Admin")}
    //c(event.key)
}); document.addEventListener('keyup', function(event) {
    if (event.key == "Control") {pressingControl = 0}
    if (event.key == "`") {pressingBacktick = 0}
});



///LOAD///
window.StartLoad = StartLoad;
function StartLoad() {
    if (gss(3)!=0||gss(3)!="0") {getel("loadC").style.cursor = "wait";document.body.style.cursor = "wait";newLoadDays()}
    else {getel("LogInBg").hidden = false; loadclicked = 1}
}
function newLoadDays() {
    getel("loadC").style.cursor = "wait";
    document.body.style.cursor = "wait";

    const dbRef = ref(db);
    get(child(dbRef, `${gss(3)}/Calendar`)).then((snapshot) => {
        if (snapshot.exists()) {
            const newdata = snapshot.val()
            dayStates = snapshot.val();
            dayStates["studyTime"] = Math.round(dayStates["studyTime"] || 0);
            hasLoaded = 1;
            if(gss(2)==1){getel("STimeAdd").hidden=false;getel("TimeB").hidden=false;getel("STime").hidden=false;getel("Timer").hidden=false}
            getel("load_heading").hidden=true;getel("loadC").hidden=true;
            buildCalendar();
            PrevSTime = dayStates["studyTime"];
            getel("loadC").style.backgroundColor = "#b3b3b3";
            getel("loadC").style.cursor = "default";
            getel("STimeAdd").style.backgroundColor = '#bbbbbb';
            document.body.style.cursor = "default";
            getel("load_message").innerText = ""
        } else {
            console.error("No data available");
            getel("load_message").innerText = "Creating a new profile..."
            set(ref(db, gss(3)), {
                Calendar: {
                    studyTime: 0},
                Games: {
                    Snake_Score: 0},
                Profile: {
                    createdAt: (day.toString()+"-"+Month.toString()+"-"+Year.toString())}
            });
            setTimeout(newLoadDays, 100);
        }
    }).catch((error) => {
        console.error("Error loading data:", error);
        getel("load_message").innerText = "Failed to load"
    });
    get(child(dbRef, `${gss(3)}/TDL`)).then((snapshot) => {
        if (snapshot.exists()) {
            TDList = snapshot.val();
            if (TDList == null) {TDList = []}
            loadTDL();
        } else {
            console.error("No TDL data available");
            TDList = [];
        }
    })
}

let TDList = ["ph bd 9th", "Science", "RD"]
///SAVE///
window.storeDays = storeDays;
function storeDays() {
    let TDLInputs = getel("TDL").querySelectorAll("label input[type='checkbox']");
    document.getElementById
    TDLInputs.forEach(item => {
        c(item.checked);
        if(item.checked) {
            TDList.splice(TDList.indexOf(item.value), 1);
            updateData({ id: 1, TDL: TDList })
            //item.parentElement.remove();
            loadTDL();
        }
    })
    document.body.style.cursor = "wait";
    getel("saveEvent").style.cursor = "wait";

    set(ref(db, `${gss(3)}/Calendar`), dayStates)
        .then(() => {
            hasUnsavedChanges = false;
            //document.body.style.cursor = "default";
            getel("saveEvent").style.cursor = "default";
        })
        .catch((error) => {
            console.error("Save error with calendar:", error);
        });
    set(ref(db, `${gss(3)}/TDL`), TDList)
        .then(() => {
            document.body.style.cursor = "default";
        })
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
            if (Math.ceil(i/7) % 2 == startWeek) {
                weekDiv.setAttribute("weekType", "b");
                weekDiv.setAttribute("title", "Week B")
            } else {
                weekDiv.setAttribute("weekType", "a");
                weekDiv.setAttribute("title", "Week A")
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
        if (gss(2)==1 || gss(1)==1) {
            if (i % 7 == 4) {
                box.setAttribute("boxColor", "thursday")
            }}
            if ((i % 7 == 5 && Math.ceil(i/7) % 2 == startWeek) || (i % 7 == 2 && Math.ceil(i/7) % 2 == startWeek)) {
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
        
        function savetrimmed() {
            let trimmed = savedText.slice(0, -2);
            box.innerHTML = savedText
            ? `<div class="day-num">${displayDay}</div><div class="event-text">${trimmed}</div>`
            : `<div class="day-num">${displayDay}</div>`;
        }
        if (savedText.includes("/r")) {
            savetrimmed()
            box.setAttribute("boxEventColor", "red")
        } else if (savedText.includes("/o")) {
            savetrimmed()
            box.setAttribute("boxEventColor", "or");
        } else if (savedText.includes("/g")) {
            savetrimmed()
            box.setAttribute("boxEventColor", "grey");
        } else if (savedText.includes("/p")) {
            savetrimmed()
            box.setAttribute("boxEventColor", "purple");
        } else if (savedText.includes("/c")){
            savetrimmed()
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
        } else {
            box.setAttribute("priority", 14);
        }
        box.setAttribute("data-date", `${String(tempMonth).padStart(2, '0')}-${String(displayDay).padStart(2, '0')}`);
        box.setAttribute("dayNum", displayDay)
        if (monthDay == box.getAttribute("data-date")) { //Change quick text if the box is today//
            box.setAttribute("today", "true");
            if (gss(2)=="1") {
                if (box.getAttribute("boxColor") == "thursday") {
                    getel("quickText").textContent = "Today: Piano/Tennis"
                } else if (box.getAttribute("boxColor") == "friSports") {
                    getel("quickText").textContent = "Today: Sport/PE, bring Sport Shoes"
                } else {
                    getel("quickText").textContent = "Today: No events"
                }
            } else {
                getel("quickText").textContent = ""
            }
        }
        box.addEventListener("click", () => {
            if (!pressingControl) {
            const input = getel("eventInput");
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
                if (text[0] == "#") {
                    trimmed2 = trimmed2.slice(3);
                }
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
            setTimeout(dueWorkList, 300)
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
            dayAdd += `, ${MonthList[tempMonth-1]} ${displayDay} ${Year}`
            box.setAttribute("title", dayAdd)
        });
    }
    const scrollFrame = getel("calendarScroll");
    scrollFrame.scrollTo({ top: ((week-1)*86)-65, behavior: "smooth" });
    modifyEvents();
    if (hasLoaded) dueWorkList();
}

function modifyEvents() {
    let getText = document.querySelectorAll(".event-text");
    getText.forEach(el => {
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
    getel("eventInput").value = "";
}

function dueWorkList() {
    let daysList = []
    let priorityList = []
    let taskList = []
    let urgentTaskList = []
    const dueContainer = getel("dueList");
    dueContainer.querySelectorAll(".newDue").forEach(el => el.remove());
    for (let i = 1; i < 100; i++) {
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
                        newDue.textContent = ("!"+newDue.textContent);
                        taskList.push(dayDifference(i));
                    }/* else if (dayDifference(i) < 5) {
                        newDue.textContent = ("!"+newDue.textContent); // Give a warning if the task is close
                        urgentTaskList.push(dayDifference(i));
                    }*/
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
    const GenTime = getel("STimeAdd");
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
        //getel("STime").innerText = `Study Time: ${newTempTime}m`;
        GenTime.innerText = "Generate Time";
        GenTime.setAttribute("added", "false");
    }
}

window.Studying = Studying;
function Studying() {
    if (hasLoaded) {
        if (TimerText.getAttribute("clicked") == "0") {
            let findInput = getel("eventInput").value;
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
    getel("Title").textContent = 
    (Math.round(dayStates["studyTime"]).toString() + ":" + (59 - secs).toString().padStart(2,"0") + " / " + PrevSTime.toString());
}

window.NotLoggedIn = NotLoggedIn;
function NotLoggedIn() {
    if (gss(3)==0) {
        getel("LogInBg").hidden = false
    }
}
window.LogIn = LogIn;
function LogIn() {
    let uservalue = getel("LogInput").value
    if (uservalue != "Admin" && uservalue != "") {
    getel("LogInBg").hidden = true
    sss(3, getel("LogInput").value)
    getel("LoggedIn").innerText = "Logged in!"
    if (loadclicked) {
        StartLoad()
    }
}}
window.CancelLogIn = CancelLogIn;
function CancelLogIn() {
    getel("LogInBg").hidden = true
}

let adding_TDL = 0;
window.TLD_add_start = TLD_add_start;
function TLD_add_start() {
    if (adding_TDL == 0) {
        getel("TDLInput").hidden = false;
        getel("TDLInput").value = "";
        getel("TDLInput2").value = "0";
        getel("TDLInput").focus();
        getel("TDLInput2").hidden = false;
        getel("TDLAddEnd").hidden = false;
        adding_TDL = 1;
    } else {
        getel("TDLInput").hidden = true;
        getel("TDLInput2").hidden = true;
        getel("TDLAddEnd").hidden = true;
        adding_TDL = 0;
    }
}

window.TLD_add = TLD_add;
function TLD_add() {
    getel("TDLInput").hidden = true;
    getel("TDLInput2").hidden = true;
    getel("TDLAddEnd").hidden = true;
    adding_TDL = 0;
    TDList.splice(getel("TDLInput2").value, 0, getel("TDLInput").value);
    //localStorage.setItem("TDL", JSON.stringify(TDList));
    loadTDL();
}

function loadTDL() {
    let TDLInputs2 = getel("TDL").querySelectorAll("label input[type='checkbox']");
    TDLInputs2.forEach(item => {
        item.parentElement.remove();
    })

    //TDList = JSON.parse(localStorage.getItem("TDL") || "[]");
    for (let i in TDList) {
        let TDLabel = document.createElement("label");
        TDLabel.className = "checkbox-container";
        TDLabel.innerHTML = `<input type="checkbox" class="checkbox" id="TDLCheck${i}" value="${TDList[i]}"><span class="custom-text">${TDList[i]}</span>`;
        getel("TDL").appendChild(TDLabel);
    }
}
/*
// Open (or create) a database named "GameDB" with version 1
const request = indexedDB.open("GameDB", 1);

// Global variables
let db2;
let addData, getData, updateData, deleteData;
let TDLReturn;

// This runs only the first time or when you upgrade the DB version
request.onupgradeneeded = function (event) {
    const db = event.target.result;

    // Create a store called "players", using 'id' as the unique key
    const store = db.createObjectStore("players", { keyPath: "id" });
};

// When DB successfully opens
request.onsuccess = function (event) {
    db2 = event.target.result;

    addData = function (player) {
        const tx = db2.transaction("players", "readwrite");
        const store = tx.objectStore("players");
        store.add(player);
    };

    getData = function (id) {
        return new Promise((resolve, reject) => {
        const tx = db2.transaction("players", "readonly");
        const store = tx.objectStore("players");
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
        });
    };

    updateData = function (id) {
        const tx = db2.transaction("players", "readwrite");
        const store = tx.objectStore("players");
        store.put(id);
    };

    deleteData = function (id) {
        const tx = db2.transaction("players", "readwrite");
        const store = tx.objectStore("players");
        store.delete(id);
    };
}

request.onerror = function () {
    console.error("Failed to open IndexedDB");
};

async function getTDLData(id2) {
    TDLReturn = await getData(id2);
}

setTimeout(() => {
    //deleteData(1); // Delete player with ID 1 if exists
    if(1) {
        c("Adding default player data...");
        addData({ id: 1, TDL: JSON.parse(localStorage.getItem("TDL")) || []});
    }
}, 400);

setTimeout(() => {
    getTDLData(1).then(() => {
        TDLReturn = TDLReturn.TDL || [];
        c("TDL data loaded: ", TDLReturn);
        loadTDL();
    })
}, 800);


// ✅ EXAMPLE USAGE:
addData({ id: 1, name: "Riley", score: 100 });
getData(1);
updateData({ id: 1, name: "Riley", score: 200 });
deleteData(1);

(async () => {
        let player = await getData(1);
        console.log("Player: ", player);
        console.log("TDL: ", player.TDL);
    })();
*/


