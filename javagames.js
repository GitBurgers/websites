const c = console.log
const TickSpeed = 1000/60
let CurrentGame = 0
let inputs = []
let deleteInput = 0

////KEY PRESSED////
document.addEventListener('keydown', function(event) {
    if (event.key == "/") {c(`headx=${headX} heady=${headY} xposes=${xPoses} yposes=${yPoses} inputs=${inputs}`)}
    if (event.key == "?") {c(CurrentGame)}
    if (CurrentGame == 1) {
        if (event.key == "ArrowUp"&&!inputs.includes(1)) {inputs.push(1);inputs=inputs.filter(item => item != 3)}
        if (event.key == "ArrowRight"&&!inputs.includes(2)) {inputs.push(2);inputs=inputs.filter(item => item != 4)}
        if (event.key == "ArrowDown"&&!inputs.includes(3)) {inputs.push(3);inputs=inputs.filter(item => item != 1)}
        if (event.key == "ArrowLeft"&&!inputs.includes(4)) {inputs.push(4);inputs=inputs.filter(item => item != 2)}
    }
    if (event.key == " " && CurrentGame == -1) {CurrentGame = 1;GameStart_Snake()}
    //c(event.key)
});
////KEY UP////
document.addEventListener('keyup', function(event) {
    if (event.key == "/") {c(`headx=${headX} heady=${headY} xposes=${xPoses} yposes=${yPoses} inputs=${inputs}`)}
    if (event.key == "|") {}
    if (CurrentGame == 1) {
        if (event.key == "ArrowUp"&&direction!=3) {inputs=inputs.filter(item => item != 1)}
        if (event.key == "ArrowRight"&&direction!=4) {inputs=inputs.filter(item => item != 2)}
        if (event.key == "ArrowDown"&&direction!=1) {inputs=inputs.filter(item => item != 3)}
        if (event.key == "ArrowLeft"&&direction!=2) {inputs=inputs.filter(item => item != 4)}
    }
    //c(event.key + " up")
});

////DOC LOADED////
document.addEventListener("DOMContentLoaded", () => {
    ResetData_Snake()
    Snake_drawSquares()
});

{ //SNAKE BEGINS//
let xPoses = []
let yPoses = []
let xPoses2 = []
let yPoses2 = []
let headX
let headY
let appleX
let appleY
let direction
let Progress

function GameStart_Snake() {
    ResetData_Snake()
    document.getElementById("Play-Snake").hidden = true;
    xPoses2 = xPoses
    yPoses2 = yPoses
    Snake_drawSquares()
    Snake_loop()
    c(`game ${CurrentGame}`)
}

function ResetData_Snake() {
    CurrentGame = 1
    xPoses = [6,5,4]
    yPoses = [7,7,7]
    xPoses2 = xPoses
    yPoses2 = yPoses
    inputs = []
    headX = 6
    headY = 7
    direction = 0
    Progress = 1
    appleX = Math.round(Math.random()*11)+1
    appleY = Math.round(Math.random()*3)+1
}

function Snake_loop() {
    Snake_drawSquares()
    Progress++
    if (Progress > 10) {
        Progress = 1
        headX = Math.round(headX)
        headY = Math.round(headY)
        xPoses2 = xPoses.map(n => Math.round(n*100) / 100)
        yPoses2 = yPoses.map(n => Math.round(n*100) / 100)
        
        if (inputs[inputs.length-1] != null && !Number.isNaN(inputs[inputs.length-1])) {
            let temp = inputs[inputs.length-1]
            function setdir(dir) {direction = dir}
            switch (direction) {
                case 1: {if(temp!=3){setdir(temp)}else if(inputs.length==2){setdir(inputs[0])}; break;}
                case 2: {if(temp!=4){setdir(temp)}else if(inputs.length==2){setdir(inputs[0])}; break;}
                case 3: {if(temp!=1){setdir(temp)}else if(inputs.length==2){setdir(inputs[0])}; break;}
                case 4: {if(temp!=2){setdir(temp)}else if(inputs.length==2){setdir(inputs[0])}; break;}
                default: {if(temp!=4){direction=temp};break}
            }
        }
        if (Math.round(headX)==appleX && Math.round(headY)==appleY) {
            xPoses.push(xPoses[xPoses.length-1])
            yPoses.push(yPoses[yPoses.length-1])
            xPoses2 = xPoses.map(n => Math.round(n*100) / 100)
            yPoses2 = yPoses.map(n => Math.round(n*100) / 100)
            let placeapple = 1
            while (placeapple) {
                let xPoses3 = xPoses.map(n => Math.round(n));let yPoses3 = yPoses.map(n => Math.round(n))
                appleX = Math.floor(Math.random() * 12) + 1
                appleY = Math.floor(Math.random() * 12) + 1
                placeapple = 0
                for (i=0;i<xPoses3.length;i++) {
                    if ((appleX == xPoses3[i] && appleY == yPoses3[i])  ||  (appleX==headX && appleY==appleY)) {
                        placeapple = 1
                        break;
                    }
                }
            }
        }
        {   let xPoses3 = xPoses.map(n => Math.round(n));let yPoses3 = yPoses.map(n => Math.round(n))
            xPoses3.splice(0,2)
            yPoses3.splice(0,2)
            for (i=0;i<xPoses3.length;i++) {
                if (Math.round(headX) == xPoses3[i] && Math.round(headY) == yPoses3[i]) {
                    Snake_dead(1)
                    break;
                }
            }
        }
    }

    if (direction != 0) {
        let prevHeadX = headX
        let prevHeadY = headY
        switch (direction) {
            case 1: {headY = Math.round((headY - 0.1)*10) / 10; break;}
            case 2: {headX = Math.round((headX + 0.1)*10) / 10; break;}
            case 3: {headY = Math.round((headY + 0.1)*10) / 10; break;}
            case 4: {headX = Math.round((headX - 0.1)*10) / 10; break;} 
        }
        if (headY < 1 || headX > 12 || headY > 12 || headX < 1) {
            headX = prevHeadX
            headY = prevHeadY
            Snake_dead()}

        xPoses[0] = xPoses[0] + (headX - xPoses2[0])*0.1
        yPoses[0] = yPoses[0] + (headY - yPoses2[0])*0.1
        for (i=xPoses.length-1; i>0; i--) {
            xPoses[i] = Math.round((xPoses[i] + (xPoses2[i-1] - xPoses2[i])*0.1)*1000)/1000
            yPoses[i] = Math.round((yPoses[i] + (yPoses2[i-1] - yPoses2[i])*0.1)*1000)/1000
        }
    }

    if (CurrentGame==1){requestAnimationFrame(Snake_loop)}
}

function Snake_drawSquares() {
    document.getElementById("SnakeGrid").innerHTML = ""

    for (i=xPoses.length-1; i>=0; i--) {
        let SnakeSquare = document.createElement("div")
        SnakeSquare.style.left = `${(xPoses[i]*50)-50}px`
        SnakeSquare.style.top = `${(yPoses[i]*50)-50}px`
        SnakeSquare.className = "SnakeSquare"
        if(CurrentGame==-1){SnakeSquare.style.backgroundColor = `rgb(220, 0, 0)`}else{
            SnakeSquare.style.backgroundColor = `rgb(0, ${Math.max(130, 240 - i * 3)}, 0)`}
        document.getElementById("SnakeGrid").appendChild(SnakeSquare)
    }
    let SnakeAppleSquare = document.createElement("div")
    SnakeAppleSquare.style.left = `${appleX*50-50}px`
    SnakeAppleSquare.style.top = `${appleY*50-50}px`
    SnakeAppleSquare.className = "SnakeAppleSquare"
    document.getElementById("SnakeGrid").appendChild(SnakeAppleSquare)

    let SnakeHeadSquare = document.createElement("div")
    SnakeHeadSquare.style.left = `${headX*50-50}px`
    SnakeHeadSquare.style.top = `${headY*50-50}px`
    SnakeHeadSquare.className = "SnakeHeadSquare"
    if(CurrentGame==-1){SnakeHeadSquare.style.backgroundColor = `rgb(220, 0, 0)`}else{
        SnakeHeadSquare.style.backgroundColor = `#00ff30`}
    document.getElementById("SnakeGrid").appendChild(SnakeHeadSquare)

    let Snake_Score = document.createElement("div")
    Snake_Score.id = "Snake_Score"
    Snake_Score.innerText = xPoses.length - 3
    document.getElementById("SnakeGrid").appendChild(Snake_Score)
}

function Snake_dead(d) {
    c(d)
    CurrentGame = -1
    Snake_drawSquares()
    document.getElementById("Play-Snake").hidden = false;
}}//SNAKE END// 190-39 = 151