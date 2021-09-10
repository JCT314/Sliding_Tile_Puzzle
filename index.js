/*
    3) look up algorithm to shuffle tiles * need to adjust algorithm

    Eventually
    1) let a user set a grid size
    2) choose an image
    3) maybe add a timing feature
        a) once you beat it, get a url that you can send to your friends so they get the same set up
        and can compete with them
*/


const gridRows = 3;
const gridCols = 3;
const grid = buildGrid(gridRows, gridCols);
const correctGrid = buildGrid(gridRows, gridCols);
const up = 38;
const down = 40;
const left = 37;
const right = 39;
const directionCodes = [up, down, left, right];
const container = document.querySelector('#container');
const resetButton = document.querySelector('button');
let timerID;

let [currentRow, currentCol] = shuffleGrid(grid, gridRows - 1, gridCols - 1,);

renderGrid();

resetButton.addEventListener("click", () => {
    container.innerHTML = "";
    [currentRow, currentCol] = shuffleGrid(grid, currentRow, currentCol);
    renderGrid();
    console.log(currentRow, currentCol);
});

function didUserWin() {
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            if (correctGrid[i][j] !== grid[i][j]) {
                return false;
            }
        }
    }
    return true;
}

function swap(row, col, otherRow, otherCol) {
    const blank = grid[row][col];
    grid[row][col] = grid[otherRow][otherCol];
    grid[otherRow][otherCol] = blank;
    currentRow = otherRow;
    currentCol = otherCol;
}

function moveTile(newRow, newCol) {
    if (isDirectionValid(newRow, newCol)) {
        swap(currentRow, currentCol, newRow, newCol);
        return true;
    }
    return false;
}

function onKeyUp(e) {
    if (directionCodes.includes(e.keyCode)) {
        let tileMoved = false;
        let index;
        let nextRow;
        let nextCol;
        if (!timerID) {
            const divs = container.querySelectorAll('div');
            let direction;
            if (e.keyCode === up) {
                nextRow = currentRow + 1;
                nextCol = currentCol;
                tileMoved = isDirectionValid(nextRow, nextCol);
                index = nextRow * gridRows + nextCol;
                if (tileMoved) {
                    console.log(divs[index]);
                    divs[index].classList.toggle('moveUp');
                    direction = "up";
                }
            }

            if (e.keyCode === down) {
                nextRow = currentRow - 1;
                nextCol = currentCol;
                tileMoved = isDirectionValid(nextRow, nextCol);
                index = nextRow * gridRows + nextCol;
                if (tileMoved) {
                    console.log(divs[index]);
                    divs[index].classList.toggle('moveDown');
                    direction = "down";
                }
            }

            if (e.keyCode === left) {
                nextRow = currentRow;
                nextCol = currentCol + 1;
                tileMoved = isDirectionValid(nextRow, nextCol);
                index = nextRow * gridRows + nextCol;
                if (tileMoved) {
                    console.log(divs[index]);
                    divs[index].classList.toggle('moveLeft');
                    direction = "left";
                }
            }

            if (e.keyCode === right) {
                nextRow = currentRow;
                nextCol = currentCol - 1;
                tileMoved = isDirectionValid(currentRow, nextCol);
                index = nextRow * gridRows + nextCol;
                if (tileMoved) {
                    console.log(divs[index]);
                    divs[index].classList.toggle('moveRight');
                    direction = "right";
                }
            }
            if (tileMoved) {
                timerID = setTimeout(() => {
                    timerID = null;
                    if (direction === "up") {
                        divs[index].classList.toggle('moveUp');
                    }
                    if (direction === "down") {
                        divs[index].classList.toggle('moveDown');
                    }
                    if (direction === "left") {
                        divs[index].classList.toggle('moveLeft');
                    }
                    if (direction === "right") {
                        divs[index].classList.toggle('moveRight');
                    }

                    moveTile(nextRow, nextCol);
                    renderGrid();
                    if (didUserWin()) {
                        console.log('you win!');
                        document.body.removeEventListener("keyup", onKeyUp);
                        const h1 = document.getElementById('win-message');
                        h1.innerText = "You Win!";
                    }
                }, 300);
            }
        }
    }
}

document.body.addEventListener("keyup", onKeyUp);

function renderGrid() {
    const htmlGrid = getHtmlGrid();
    container.innerHTML = htmlGrid;
}

function getHtmlGrid() {
    let htmlGrid = "";
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            let div;
            if (grid[i][j] === "") {
                div = `<div class="blank">${grid[i][j]}</div>`;
            } else {
                div = `<div class="tile">${grid[i][j]}</div>`;
            }
            htmlGrid += div;
        }
    }
    return htmlGrid;
}

function shuffleGrid(grid, blankRow, blankCol) {
    let currentRow = blankRow;
    let currentCol = blankCol;

    for (let i = 0; i < gridRows * gridCols; i++) {
        const up = [currentRow - 1, currentCol, "up"];
        const down = [currentRow + 1, currentCol, "down"];
        const left = [currentRow, currentCol - 1, "left"];
        const right = [currentRow, currentCol + 1, "right"];
        const directions = [up, down, left, right];
        const validDirections = getValidDirections(directions, gridRows, gridCols);
        shuffleDirections(validDirections);
        const [nextRow, nextCol] = validDirections[0];
        const blank = grid[currentRow][currentCol];
        grid[currentRow][currentCol] = grid[nextRow][nextCol];
        grid[nextRow][nextCol] = blank;
        currentRow = nextRow;
        currentCol = nextCol;
    }
    return [currentRow, currentCol];
}

function getValidDirections(directions, maxRows, maxCols) {
    const validDirections = [];
    for (const direction of directions) {
        const [row, col] = direction;
        if (row >= 0 && row < maxRows && col >= 0 && col < maxCols) {
            validDirections.push(direction);
        }
    }
    return validDirections;
}

function isDirectionValid(row, col) {
    if (row >= 0 && row < gridRows && col >= 0 && col < gridCols) {
        return true;
    }
    return false;
}



function shuffleDirections(directions) {
    for (let i = directions.length - 1; i > 0; i--) {
        const swapIndex = Math.floor(Math.random() * (i + 1));
        if (swapIndex !== i) {
            let temp = directions[swapIndex];
            directions[swapIndex] = directions[i];
            directions[i] = temp;
        }
    }
}

function buildGrid(rows, columns) {
    let counter = 1;
    const grid = new Array(rows);

    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < columns; j++) {
            if (i === rows - 1 && j === columns - 1) {
                grid[i][j] = "";
            } else {
                grid[i][j] = counter;
            }
            counter++;
        }
    }
    return grid;
}


// want to implement yates shuffling algo
// check inversions