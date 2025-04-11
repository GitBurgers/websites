const now = new Date();
const today = now.getDate
console.log(now.toString + today.toString)

function click1() {
    let theme = localStorage.getItem("name");
    document.getElementById("top").innerText = theme;
}

function showText() {
    // Get the input box value
    const userText = document.getElementById("textInput").value;

    // Show it in the output area
    document.getElementById("outputArea").textContent = "You wrote: " + userText;
    localStorage.setItem("name", userText);
}

document.addEventListener("DOMContentLoaded", () => {
const container = document.querySelector(".calendar-grid");
for (let i = 1; i <= 14; i++) {
    const box = document.createElement("div");
    box.className = "day-box";
    box.textContent = i;
    box.dataset.day = i;
      // Check localStorage
    const saved = localStorage.getItem("day-" + i);
    if (saved === "true") {
        box.classList.add("active");
    }
      // Toggle state on click
    box.addEventListener("click", () => {
        const isActive = box.classList.toggle("active");
        localStorage.setItem("day-" + i, isActive);
    });  
    container.appendChild(box);
}
    const enterEvent = document.createElement("input");
    enterEvent.className = "eventInput"
});
