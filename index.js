const upCode = 87;
const downCode = 83;
const leftCode = 65;
const rightCode = 68;
const smallestGridLength = 3;
const mediumGridLength = 5;
const largestGridLength = 7;
const delay = 200;
const scoresMap = new Map();
scoresMap.set(smallestGridLength, {});
scoresMap.set(mediumGridLength, {});
scoresMap.set(largestGridLength, {});

let tileWidth;
let tileHeight;
let rows = smallestGridLength;
let cols = smallestGridLength;

const directionCodes = [upCode, downCode, leftCode, rightCode];
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
document.body.addEventListener("keyup", onKeyupCode);
document.body.addEventListener("click", onClick);
submitButton.addEventListener("click", onSubmitName);
setupCodeCSS();
renderGrid();
renderHighScores();

function getHtmlHighScore(gridLength) {
    if (Object.keys(scoresMap.get(gridLength)).length !== 0) {
        scores.innerHTML += `
        <h3>${gridLength} x ${gridLength}</h3>
        <h4>${scoresMap.get(gridLength)['name']} - ${stopWatch.parseTime(scoresMap.get(gridLength)['score'])}</h4 >
        <hr>`;
    }
}

function renderHighScores() {
    scores.innerHTML = `
    <h2>High Scores</h2>
    <hr>`;
    getHtmlHighScore(smallestGridLength);
    getHtmlHighScore(mediumGridLength);
    getHtmlHighScore(largestGridLength);
}

function saveHighScore(gridLength, name) {
    scoresMap.set(gridLength, { name: name, score: getScore() });
}

function onSubmitName(e) {
    let name = inputName.value;
    if (name.length === 0) {
        name = "Anonymous";
    }
    if (playerGrid.gridRows === smallestGridLength) {
        saveHighScore(smallestGridLength, name);
    }
    if (playerGrid.gridRows === mediumGridLength) {
        saveHighScore(mediumGridLength, name);
    }
    if (playerGrid.gridRows === largestGridLength) {
        saveHighScore(largestGridLength, name);
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
    let value = parseInt(e.target.value);
    rows = cols = value;
    playerGrid = new Grid(rows, cols);
    playerGrid.buildShuffledGrid();
    setupCodeCSS();
    renderGrid();
    document.body.removeEventListener("keyup", onKeyupCode);
    document.body.addEventListener("keyup", onKeyupCode);
    started = false;
    stopWatch.pause();
    stopWatch.reset();
});

resetButton.addEventListener("click", () => {
    container.innerHTML = "";
    playerGrid = new Grid(rows, cols);
    playerGrid.buildShuffledGrid();
    h1.innerText = "";
    document.body.removeEventListener("keyup", onKeyupCode);
    document.body.addEventListener("keyup", onKeyupCode);
    document.body.removeEventListener("click", onClick);
    document.body.addEventListener("click", onClick);
    renderGrid();
    started = false;
    stopWatch.pause();
    stopWatch.reset();
});


function setupCodeCSS() {
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

function startSlidingAnimation(htmlElement, isMovingVertical, distance) {
    htmlElement.style.transition = `transform .2s ease-in`;
    if (isMovingVertical) {
        htmlElement.style.transform = `translateY(${distance}px)`;
    } else {
        htmlElement.style.transform = `translateX(${distance}px)`;
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
            let up = setDirectionValue(currentRow - 1, currentCol);
            let down = setDirectionValue(currentRow + 1, currentCol);
            let left = setDirectionValue(currentRow, currentCol - 1);
            let right = setDirectionValue(currentRow, currentCol + 1);
            let values = [up, down, left, right];
            let index = values.indexOf(clickValue);
            let nextRow, nextCol;
            if (index !== -1) {
                if (index === 0) {
                    startSlidingAnimation(e.target, true, tileHeight);
                    nextRow = currentRow - 1;
                    nextCol = currentCol;
                }
                if (index === 1) {
                    startSlidingAnimation(e.target, true, -tileHeight);
                    nextRow = currentRow + 1;
                    nextCol = currentCol;
                }
                if (index === 2) {
                    startSlidingAnimation(e.target, false, tileWidth);
                    nextRow = currentRow;
                    nextCol = currentCol - 1;
                }
                if (index === 3) {
                    startSlidingAnimation(e.target, false, -tileWidth);
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
                        if (Object.keys(scoresMap.get(playerGrid.gridRows)).length === 0 || currentScore < scoresMap.get(playerGrid.gridRows)['score']) {
                            h1.innerText = "New High Score!";
                            newHighScoreForm.classList.toggle('hide');
                            resetButton.classList.toggle('hide');
                            select.classList.toggle('hide');
                        } else {
                            h1.innerText = "Did not beat high score :(";
                        }
                        document.body.removeEventListener("keyup", onKeyupCode);
                        document.body.removeEventListener("click", onClick);
                        container.classList.add('spin');
                        setTimeout(() => {
                            container.classList.remove('spin');
                        }, 1000);
                    }
                }, delay);

            }
        }
    }
}

function onKeyupCode(e) {
    tileWidth = container.querySelector('div').clientWidth;
    tileHeight = container.querySelector('div').clientHeight;
    if (directionCodes.includes(e.keyCode)) {
        if (!started) {
            started = true;
            stopWatch.start();
        }
        let playTileAnimation = false;
        let index;
        let nextRow, nextCol, tile;
        if (!timerID) {
            const divs = container.querySelectorAll('div');
            let direction;
            if (e.keyCode === upCode) {
                nextRow = playerGrid.currentRow + 1;
                nextCol = playerGrid.currentCol;
                tile = getTileElement(divs, nextRow, nextCol);
                if (tile !== null) {
                    playTileAnimation = true;
                    startSlidingAnimation(tile, true, -tileHeight);
                }
            }

            if (e.keyCode === downCode) {
                nextRow = playerGrid.currentRow - 1;
                nextCol = playerGrid.currentCol;
                tile = getTileElement(divs, nextRow, nextCol);
                if (tile !== null) {
                    playTileAnimation = true;
                    startSlidingAnimation(tile, true, tileHeight);
                }
            }

            if (e.keyCode === leftCode) {
                nextRow = playerGrid.currentRow;
                nextCol = playerGrid.currentCol + 1;
                tile = getTileElement(divs, nextRow, nextCol);
                if (tile !== null) {
                    playTileAnimation = true;
                    startSlidingAnimation(tile, false, -tileWidth);
                }
            }

            if (e.keyCode === rightCode) {
                nextRow = playerGrid.currentRow;
                nextCol = playerGrid.currentCol - 1;
                tile = getTileElement(divs, nextRow, nextCol);
                if (tile !== null) {
                    playTileAnimation = true;
                    startSlidingAnimation(tile, false, tileWidth);
                }
            }
            if (playTileAnimation) {
                timerID = setTimeout(() => {
                    timerID = null;
                    tile.style.transition = ``;
                    tile.style.transition = ``;

                    playerGrid.moveTile(nextRow, nextCol);
                    renderGrid();
                    if (playerGrid.isSolved()) {
                        stopWatch.pause();
                        document.body.removeEventListener("keyup", onKeyupCode);
                        let currentScore = getScore();
                        if (Object.keys(scoresMap.get(playerGrid.gridRows)).length === 0 || currentScore < scoresMap.get(playerGrid.gridRows)['score']) {
                            h1.innerText = "New High Score!";
                            newHighScoreForm.classList.toggle('hide');
                            resetButton.classList.toggle('hide');
                            select.classList.toggle('hide');
                        } else {
                            h1.innerText = "Did not beat high score :(";
                        }
                        document.body.removeEventListener("keyup", onKeyupCode);
                        document.body.removeEventListener("click", onClick);
                        container.classList.add('spin');
                        setTimeout(() => {
                            container.classList.remove('spin');
                        }, 1000);
                    }
                }, delay);
            }
        }
    }
}

function getTileElement(divs, row, col) {
    isValid = playerGrid.isDirectionValid(row, col);
    index = row * playerGrid.gridRows + col;
    if (isValid) {
        return divs[index];
    }
    return null;
}

function getScore() {
    let time = stopWatch.toTime();
    let values = time.split(":");
    let score = parseInt(values[0] * 100) + parseInt(values[1]);
    return score;
}

console.log('s');

