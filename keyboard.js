document.addEventListener('keyup', function (event) {
    if (game.state == "starting") {
        return;
    }
    if (event.defaultPrevented) {
        return;
    }
    var key = event.key || event.keyCode;

    if (key === "c") {
        startGame();
    }
    if (key === "f") {
        goFaster();
    }
});

document.addEventListener('keyup', function (event) {
    if (event.defaultPrevented) {
        return;
    }
    var key = event.key || event.keyCode;
    if (key === "p") {
        startScreen = document.getElementById("start-screen");
        startScreen.style.display = 'none';
        startScreen.parentNode.removeChild(startScreen);

        gameScreen = document.getElementById("game-screen");
        gameScreen.style.display = 'block';
        startGame();
    }
});
