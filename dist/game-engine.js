// player undefine
// solve for gift 
// map score and colors.

const gameLength = 10;
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

var grid = 16;
var count = 0;

var game = {
    status: "starting"
}
var player = {
    score: 0,
    timeLeft: gameLength,
    lastCollected: "None"
};

var player = {
    x: 160,
    y: 160,

    // player velocity. moves one grid length every frame in either the x or y direction
    dx: grid,
    dy: 0,

    // keep track of all grids the snake body occupies
    cells: [],

    // length of the snake. grows when eating an apple
    maxCells: 1
};

const redColor = "red";
const whiteColor = "white";
const camieColor = "#ffd59a";

function startGame() {
    player.score = 0;
    player.timeLeft = 2000;
    player.lastCollected = "None";
    triggerDisplay(player);
    if (game.status == "starting")
        game.status = "started";
    else
        console.log("this should not happen");
    loop();
}
function stopGame() {
    if (game.status = "started") {
        game.status = "stopped";
    } else
        console.log("this should not happen");
}

function triggerDisplay(player) {
    document.getElementById('score').innerHTML = player.score;
    document.getElementById('last-collected').innerHTML = player.lastCollected;
}

const petal = [
    [
        [0, 0],
        [0.3, -1],
        [0.7, -1],
        [1, 0],
        [0.7, 1],
        [0.3, 1],
        [0, 0]
    ],
    [
        [0, 0],
        [1, 0]
    ],
];

let randomGift = getRandomGift();
let scoreRandomGift = getGiftScore(randomGift);
var apple = {
    x: 320,
    y: 320,
    gift: randomGift,
    score: scoreRandomGift
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomGift() {
    let gifts = ["rose", "white rose", "rose",
        "white rose", "white rose", "white rose", "white rose", "white rose", "camie"];
    let randomIndex = getRandomInt(0, gifts.length);
    return gifts[randomIndex];
}

function getRandomGiftColor() {
    if (gift == "white rose")
        return whiteColor;
    else if (gift == "rose")
        return redColor;
    else {
        return camieColor //max;
    }
}

function getGiftScore(gift) {
    if (gift == "white")
        return 1;
    else if (gift == "red")
        return 5;
    else {
        return 20 //max;
    }
}

function isGiftCollected(playerX, playerY, giftX, giftY, toleranceInterval) {
    xDiff = Math.abs(playerX - giftX);
    yDiff = Math.abs(playerY - giftY);
    distancePlayerGift = Math.hypot(xDiff, yDiff);
    return toleranceInterval >= distancePlayerGift;
}

// game loop
function loop() {
    player.timeLeft = player.timeLeft - 1;
    if (player.timeLeft < 0) {
        stopGame();
        return;
    }
    requestAnimationFrame(loop);

    // slow game loop to 15 fps instead of 60 (60/15 = 4)
    if (++count < 4) {
        return;
    }

    count = 0;
    context.clearRect(0, 0, canvas.width, canvas.height);

    // move snake by it's velocity
    snake.x += snake.dx;
    snake.y += snake.dy;

    // wrap snake position horizontally on edge of screen
    if (snake.x < 0) {
        snake.x = canvas.width - grid;
    }
    else if (snake.x >= canvas.width) {
        snake.x = 0;
    }

    // wrap snake position vertically on edge of screen
    if (snake.y < 0) {
        snake.y = canvas.height - grid;
    }
    else if (snake.y >= canvas.height) {
        snake.y = 0;
    }

    // keep track of where snake has been. front of the array is always the head
    snake.cells.unshift({ x: snake.x, y: snake.y });

    // remove cells as we move away from them
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // draw apple
    //context.fillStyle = 'green';
    //context.fillRect(apple.x, apple.y, grid - 1, grid - 1);
    function drawPetal(path, width, height) {
        var i = 0;
        do { // loop through paths
            const p = path[i];
            let j = 0;
            context.moveTo(p[j][0] * width, p[j++][1] * height);
            while (j < p.length - 1) {
                context.lineTo(p[j][0] * width, p[j++][1] * height);
            }
            if (p[j][0] === p[0][0] && p[j][1] === p[0][1]) { // is the path closed ?
                context.closePath();
            } else {
                context.lineTo(p[j][0] * width, p[j][1] * height)
            }
        } while (++i < path.length);
    }

    function drawPetals(x, y, count, startAt, petal, width, height) {
        const step = (Math.PI * 2) / count;
        context.setTransform(1, 0, 0, 1, x, y);
        context.rotate(startAt);
        for (var i = 0; i < count; i += 1) {
            drawPetal(petal, width, height);
            context.rotate(step);
        }
        context.setTransform(1, 0, 0, 1, 0, 0); // restore default
    }

    function drawFlower(col, lineWidth, fitScale, petalCount) {
        context.strokeStyle = col;
        context.lineWidth = lineWidth;
        const size = grid - 2;
        context.beginPath();

        drawPetals(apple.x, apple.y, 5, -Math.PI / 2, petal, size, size * 0.2);
        context.stroke();
        context.beginPath();
        context.arc(apple.x, apple.y, size * 0.15, 0, Math.PI * 2);
        context.fillStyle = col;
        context.fill();
    }
    drawFlower(apple.gift, 1, 0.95, 20);



    // draw the heart
    context.fillStyle = 'red';
    position = snake.cells[0];
    context.fillRect(position.x, position.y, grid - 1, grid - 1);

    snake.cells.forEach(function (cell, index) {
        // snake ate apple;
        if (isGiftCollected(cell.x, cell.y, apple.x, apple.y, grid)) {
            if (player.lastCollected == "None") // First eat.
            //Launch timer.
            {
                game.state = "started";
                var date = new Date();
                date.setSeconds(date.getSeconds() + 32);
                var countDownDate = date.getTime();
                // Update the count down every 1 second
                var timer = setInterval(function () {

                    // Get today's date and time
                    var now = new Date().getTime();

                    // Find the distance between now and the count down date
                    var distance = countDownDate - now;

                    // Time calculations for days, hours, minutes and seconds
                    var seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    // Output the result in an element with id="demo"
                    document.getElementById("timer").innerHTML = "Time remaining:" +
                        seconds + "s ";

                    // If the count down is over, write some text 

                    if (distance < 0) {
                        clearInterval(timer);
                        document.getElementById("timer").innerHTML = "GAME OVER!";
                        setTimeout(() => {
                            document.getElementById("timer").innerHTML = "PRESS C to play again!";
                        }, 3000);

                    }
                }, 1000);

            }
            apple.score = getGiftScore(apple.gift);
            player.score = player.score + apple.score;
            player.lastCollected = apple.gift;
            // trigger display
            triggerDisplay(player);
            // play sound
            var audio = new Audio('hans.mp3');
            audio.play();

            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
            apple.gift = getRandomGift();
        }

        // check collision with all cells after this one (modified bubble sort)
        for (var i = index + 1; i < snake.cells.length; i++) {

            // snake occupies same space as a body part. reset game
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;

                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });

}

// listen to keyboard events to move the snake
document.addEventListener('keydown', function (e) {
    // prevent snake from backtracking on itself by checking that it's 
    // not already moving on the same axis (pressing left while moving
    // left won't do anything, and pressing right while moving left
    // shouldn't let you collide with your own body)

    // left arrow key
    if (e.which === 37 && snake.dx === 0) {
        snake.dx = -grid;
        snake.dy = 0;
    }
    // up arrow key
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // right arrow key
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // down arrow key
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

// start the game
requestAnimationFrame(loop);
