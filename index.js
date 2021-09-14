/*
    3) look up algorithm to shuffle tiles * need to adjust algorithm

    Eventually
    1) let a user set a grid size
    2) choose an image
    3) maybe add a timing feature
        a) once you beat it, get a url that you can send to your friends so they get the same set up
        and can compete with them
*/
const up = 87;
const down = 83;
const left = 65;
const right = 68;
const scoresMap = new Map();
scoresMap.set(3, {});
scoresMap.set(5, {});
scoresMap.set(7, {});

let tileWidth;
let tileHeight;
let rows = 3;
let cols = 3;

const directionCodes = [up, down, left, right];
let started = false;
let timerID;
const h1 = document.getElementById('win-message');
const container = document.querySelector('#container');
const resetButton = document.querySelector('#buttons button');
const submitButton = document.querySelector('#new-highscore button');
const newHighScoreForm = document.querySelector('#new-highscore');
const select = document.querySelector('select');
const inputName = document.querySelector('input');
const scores = document.querySelector('#scores');
const stopWatch = new StopWatch(document.querySelector('h3'));
let playerGrid = new Grid(rows, cols);

playerGrid.buildShuffledGrid();
document.body.addEventListener("keyup", onKeyUp);
document.body.addEventListener("click", onClick);
submitButton.addEventListener("click", onSubmitName);
setUpCSS();
renderGrid();
renderHighScores();

function renderHighScores() {
    scores.innerHTML = `
    <h2>High Scores</h2>
    <hr>`;
    if (Object.keys(scoresMap.get(3)).length !== 0) {
        scores.innerHTML += `
        <h3>3 x 3</h3>
        <h4>${scoresMap.get(3)['name']} - ${stopWatch.toTime()}</h4 >
        <hr>`;
    }
    if (Object.keys(scoresMap.get(5)).length !== 0) {
        scores.innerHTML += `
        <h3>5 x 5</h3>
        <h4>${scoresMap.get(5)['name']} - ${stopWatch.toTime()}</h4 >
        <hr>`;
    }
    if (Object.keys(scoresMap.get(7)).length !== 0) {
        scores.innerHTML += `
        <h3>7 x 7</h3>
        <h4>${scoresMap.get(7)['name']} - ${stopWatch.toTime()}</h4 >
        `;
    }
}

function onSubmitName(e) {
    let name = inputName.value;
    if (name.length === 0) {
        name = "-";
    }
    if (playerGrid.gridRows === 3) {
        scoresMap.set(3, { name: name, score: getScore() });
    }

    if (playerGrid.gridRows === 5) {
        scoresMap.set(5, { name: name, score: getScore() });
    }

    if (playerGrid.gridRows === 7) {
        scoresMap.set(7, { name: name, score: getScore() });
    }
    newHighScoreForm.classList.toggle('hide');
    resetButton.classList.toggle('hide');
    select.classList.toggle('hide');
    h1.innerText = "";
    renderHighScores();
}

select.addEventListener('input', (e) => {
    h1.innerText = "";
    container.innerHTML = "";
    let value = e.target.value;
    rows = cols = value;
    playerGrid = new Grid(rows, cols);
    playerGrid.buildShuffledGrid();
    setUpCSS();
    renderGrid();
    document.body.removeEventListener("keyup", onKeyUp);
    document.body.addEventListener("keyup", onKeyUp);
    started = false;
    stopWatch.pause();
    stopWatch.reset();
});

resetButton.addEventListener("click", () => {
    container.innerHTML = "";
    playerGrid = new Grid(rows, cols);
    playerGrid.buildShuffledGrid();
    h1.innerText = "";
    document.body.removeEventListener("keyup", onKeyUp);
    document.body.addEventListener("keyup", onKeyUp);
    document.body.removeEventListener("click", onClick);
    document.body.addEventListener("click", onClick);
    renderGrid();
    started = false;
    stopWatch.pause();
    stopWatch.reset();
});


function setUpCSS() {
    container.style.gridTemplateColumns = `repeat(${playerGrid.gridRows},${100 / playerGrid.gridRows}%)`;
}

function renderGrid() {
    const htmlGrid = getHtmlGrid(playerGrid);
    container.innerHTML = htmlGrid;
}

function getHtmlGrid(grid) {
    let htmlGrid = "";
    for (let i = 0; i < grid.gridRows; i++) {
        for (let j = 0; j < grid.gridCols; j++) {
            let div;
            if (grid.getGrid()[i][j] === "") {
                div = `<div class="blank">${grid.getGrid()[i][j]}</div>`;
            } else {
                div = `<div class="tile">${grid.getGrid()[i][j]}</div>`;
            }
            htmlGrid += div;
        }
    }
    return htmlGrid;
}

function setDirectionValue(row, col) {
    if (playerGrid.isDirectionValid(row, col)) {
        return playerGrid.getGrid()[row][col];
    } else {
        return -1;
    }
}

function onClick(e) {
    if (!timerID) {
        const { currentRow, currentCol } = playerGrid;
        tileWidth = container.querySelector('div').clientWidth;
        tileHeight = container.querySelector('div').clientHeight;

        let clickValue;
        if (e.target.className === 'tile') {
            if (!started) {
                started = true;
                stopWatch.start();
            }
            clickValue = parseInt(e.target.innerText);
            let upValue = setDirectionValue(currentRow - 1, currentCol);
            let downValue = setDirectionValue(currentRow + 1, currentCol);
            let leftValue = setDirectionValue(currentRow, currentCol - 1);
            let rightValue = setDirectionValue(currentRow, currentCol + 1);
            let values = [upValue, downValue, leftValue, rightValue];
            let index = values.indexOf(clickValue);
            let nextRow, nextCol;
            if (index !== -1) {
                if (index === 0) {
                    e.target.style.transition = `transform .3s ease-in`;
                    e.target.style.transform = `translateY(${tileHeight}px)`;
                    nextRow = currentRow - 1;
                    nextCol = currentCol;
                }
                if (index === 1) {
                    e.target.style.transition = `transform .3s ease-in`;
                    e.target.style.transform = `translateY(${-tileHeight}px)`;
                    nextRow = currentRow + 1;
                    nextCol = currentCol;
                }
                if (index === 2) {
                    e.target.style.transition = `transform .3s ease-in`;
                    e.target.style.transform = `translateX(${tileWidth}px)`;
                    nextRow = currentRow;
                    nextCol = currentCol - 1;
                }
                if (index === 3) {
                    e.target.style.transition = `transform .3s ease-in`;
                    e.target.style.transform = `translateX(${-tileWidth}px)`;
                    nextRow = currentRow;
                    nextCol = currentCol + 1;
                }

                timerID = setTimeout(() => {
                    timerID = null;
                    e.target.style.transition = ``;
                    e.target.style.transform = ``;

                    playerGrid.moveTile(nextRow, nextCol);
                    renderGrid();
                    if (playerGrid.isSolved()) {
                        stopWatch.pause();
                        document.body.removeEventListener("click", onClick);
                        let currentScore = getScore();
                        if (Object.keys(scoresMap.get(playerGrid.gridRows)).length === 0 || currentScore < scoresMap.get(playerGrid.gridRows)) {
                            h1.innerText = "New High Score!";
                            newHighScoreForm.classList.toggle('hide');
                            resetButton.classList.toggle('hide');
                            select.classList.toggle('hide');
                        } else {
                            h1.innerText = "Did not beat high score :(";
                        }
                        document.body.removeEventListener("keyup", onKeyUp);
                        document.body.removeEventListener("click", onClick);
                        container.classList.add('spin');
                        setTimeout(() => {
                            container.classList.remove('spin');
                        }, 1000);
                    }
                }, 300);

            }
        }
    }
}

function onKeyUp(e) {
    tileWidth = container.querySelector('div').clientWidth;
    tileHeight = container.querySelector('div').clientHeight;
    if (directionCodes.includes(e.keyCode)) {
        if (!started) {
            started = true;
            stopWatch.start();
        }
        let playTileAnimation = false;
        let index;
        let nextRow, nextCol;
        if (!timerID) {
            const divs = container.querySelectorAll('div');
            let direction;
            if (e.keyCode === up) {
                nextRow = playerGrid.currentRow + 1;
                nextCol = playerGrid.currentCol;
                playTileAnimation = playerGrid.isDirectionValid(nextRow, nextCol);
                index = nextRow * playerGrid.gridRows + nextCol;
                if (playTileAnimation) {
                    divs[index].style.transition = `transform .3s ease-in`;
                    divs[index].style.transform = `translateY(${-tileHeight}px)`;
                }
            }

            if (e.keyCode === down) {
                nextRow = playerGrid.currentRow - 1;
                nextCol = playerGrid.currentCol;
                playTileAnimation = playerGrid.isDirectionValid(nextRow, nextCol);
                index = nextRow * playerGrid.gridRows + nextCol;
                if (playTileAnimation) {
                    divs[index].style.transition = `transform .3s ease-in`;
                    divs[index].style.transform = `translateY(${tileHeight}px)`;

                }
            }

            if (e.keyCode === left) {
                nextRow = playerGrid.currentRow;
                nextCol = playerGrid.currentCol + 1;
                playTileAnimation = playerGrid.isDirectionValid(nextRow, nextCol);
                index = nextRow * playerGrid.gridRows + nextCol;
                if (playTileAnimation) {
                    divs[index].style.transition = `transform .3s ease-in`;
                    divs[index].style.transform = `translateX(${-tileWidth}px)`;
                }
            }

            if (e.keyCode === right) {
                nextRow = playerGrid.currentRow;
                nextCol = playerGrid.currentCol - 1;
                playTileAnimation = playerGrid.isDirectionValid(playerGrid.currentRow, nextCol);
                index = nextRow * playerGrid.gridRows + nextCol;
                if (playTileAnimation) {
                    divs[index].style.transition = `transform .3s ease-in`;
                    divs[index].style.transform = `translateX(${tileWidth}px)`;
                }
            }
            if (playTileAnimation) {
                timerID = setTimeout(() => {
                    timerID = null;
                    divs[index].style.transition = ``;
                    divs[index].style.transform = ``;

                    playerGrid.moveTile(nextRow, nextCol);
                    renderGrid();
                    if (playerGrid.isSolved()) {
                        stopWatch.pause();
                        document.body.removeEventListener("keyup", onKeyUp);
                        let currentScore = getScore();
                        if (Object.keys(scoresMap.get(playerGrid.gridRows)).length === 0 || currentScore < scoresMap.get(playerGrid.gridRows)) {
                            h1.innerText = "New High Score!";
                            newHighScoreForm.classList.toggle('hide');
                            resetButton.classList.toggle('hide');
                            select.classList.toggle('hide');
                        } else {
                            h1.innerText = "Did not beat high score :(";
                        }
                        document.body.removeEventListener("keyup", onKeyUp);
                        document.body.removeEventListener("click", onClick);
                        container.classList.add('spin');
                        setTimeout(() => {
                            container.classList.remove('spin');
                        }, 1000);
                    }
                }, 300);
            }
        }
    }
}

function getScore() {
    let time = stopWatch.toTime();
    let values = time.split(":");
    let score = parseInt(values[0] * 100) + parseInt(values[1]);
    return score;
}

