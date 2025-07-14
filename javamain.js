window.Testmode = 1
window.ISADMIN = 0
window.User = 0
if (Testmode){ISADMIN=1; User="Admin"}else{ISADMIN=0}

let TopBar
let TopBar1
let TopBar2
let TopBar3

////CONTENT LOADED////
document.addEventListener("DOMContentLoaded", () => {
    const headline = document.getElementById("headline-1");
    //TopDiv = document.getElementById("topDiv");
    TopBar = document.createElement("div");
    TopBar.className = "TopBar"
    document.body.appendChild(TopBar);

    headline.addEventListener("mouseenter", () => {
        TopBar1 = document.createElement("div");
        TopBar2 = document.createElement("div");
        TopBar3 = document.createElement("div");
        
        TopBar1.innerHTML = '<b><a class="TopA" href="index.html">&nbsp;Term 3 Calendar</a></b>';
        TopBar1.className = "TopBarEl";
        TopBar1.id = "TopBar1";
        TopBar2.innerHTML = '<b><a class="TopA" href="Games.html">&nbsp &nbsp &nbsp &nbsp &nbspGames &nbsp &nbsp &nbsp &nbsp &nbsp</a></b>';
        TopBar2.className = "TopBarEl";
        TopBar2.id = "TopBar2";
        if (ISADMIN) {
            TopBar3.innerHTML = '<b><a class="TopA" href="Games.html">&nbsp &nbsp &nbsp &nbsp &nbsp Music &nbsp &nbsp &nbsp &nbsp &nbsp</a></b>';
            TopBar3.className = "TopBarEl";
            TopBar3.id = "TopBar3";
        }
        if (window.location.pathname.split("/").pop() == "index.html")
            {TopBar1.id="TopBar1";TopBar2.id="TopBar2";TopBar3.id="TopBar3";}
        else if (window.location.pathname.split("/").pop() == "Games.html")
            {TopBar1.id="TopBar2";TopBar2.id="TopBar1";TopBar3.id="TopBar3";}
        else {TopBar1.id="TopBar2";TopBar2.id="TopBar3";TopBar3.id="TopBar1";}
        TopBar.appendChild(TopBar1);
        TopBar.appendChild(TopBar2);
        TopBar.appendChild(TopBar3);
        TopBar.addEventListener("mouseleave", () => {
            TopBar1.remove();
            TopBar2.remove();
            TopBar3.remove();
        });
    });
});
