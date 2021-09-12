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
let tileWidth;
let rows = 3;
let cols = 3;

const directionCodes = [up, down, left, right];
let timerID;
const h1 = document.getElementById('win-message');
const container = document.querySelector('#container');
const resetButton = document.querySelector('button');
const select = document.querySelector('select');
let playerGrid = new Grid(rows, cols);
playerGrid.buildShuffledGrid();
document.body.addEventListener("keyup", onKeyUp(playerGrid));

setUpCSS();
renderGrid();

select.addEventListener('input', (e) => {
    console.log(e);
    container.innerHTML = "";
    let value = e.target.value;
    console.log(e.target.value);
    rows = cols = value;
    console.log(rows, cols);
    playerGrid = new Grid(rows, cols);
    playerGrid.buildShuffledGrid();
    setUpCSS();
    renderGrid();
    document.removeEventListener("keyup", onKeyUp);
    document.body.addEventListener("keyup", onKeyUp(playerGrid));
    select.returnV
});

resetButton.addEventListener("click", () => {
    container.innerHTML = "";
    playerGrid = new Grid(rows, cols);
    playerGrid.buildShuffledGrid();
    h1.innerText = "";
    document.body.removeEventListener("keyup", onKeyUp);
    document.body.addEventListener("keyup", onKeyUp(playerGrid));
    renderGrid();
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

function onKeyUp() {
    return (e) => {
        tileWidth = container.querySelector('div').clientWidth;
        if (directionCodes.includes(e.keyCode)) {
            let tileMoved = false;
            let index;
            let nextRow;
            let nextCol;
            if (!timerID) {
                const divs = container.querySelectorAll('div');
                let direction;
                if (e.keyCode === up) {
                    nextRow = playerGrid.currentRow + 1;
                    nextCol = playerGrid.currentCol;
                    tileMoved = playerGrid.isDirectionValid(nextRow, nextCol);
                    index = nextRow * playerGrid.gridRows + nextCol;
                    if (tileMoved) {
                        divs[index].style.transition = `transform .3s ease-in`;
                        divs[index].style.transform = `translateY(${-tileWidth}px)`;
                    }
                }

                if (e.keyCode === down) {
                    nextRow = playerGrid.currentRow - 1;
                    nextCol = playerGrid.currentCol;
                    tileMoved = playerGrid.isDirectionValid(nextRow, nextCol);
                    index = nextRow * playerGrid.gridRows + nextCol;
                    if (tileMoved) {
                        divs[index].style.transition = `transform .3s ease-in`;
                        divs[index].style.transform = `translateY(${tileWidth}px)`;

                    }
                }

                if (e.keyCode === left) {
                    nextRow = playerGrid.currentRow;
                    nextCol = playerGrid.currentCol + 1;
                    tileMoved = playerGrid.isDirectionValid(nextRow, nextCol);
                    index = nextRow * playerGrid.gridRows + nextCol;
                    if (tileMoved) {
                        divs[index].style.transition = `transform .3s ease-in`;
                        divs[index].style.transform = `translateX(${-tileWidth}px)`;
                    }
                }

                if (e.keyCode === right) {
                    nextRow = playerGrid.currentRow;
                    nextCol = playerGrid.currentCol - 1;
                    tileMoved = playerGrid.isDirectionValid(playerGrid.currentRow, nextCol);
                    index = nextRow * playerGrid.gridRows + nextCol;
                    if (tileMoved) {
                        divs[index].style.transition = `transform .3s ease-in`;
                        divs[index].style.transform = `translateX(${tileWidth}px)`;
                    }
                }
                if (tileMoved) {
                    timerID = setTimeout(() => {
                        timerID = null;
                        divs[index].style.transition = ``;
                        divs[index].style.transform = ``;

                        playerGrid.moveTile(nextRow, nextCol);
                        renderGrid();
                        if (playerGrid.isSolved()) {
                            document.body.removeEventListener("keyup", onKeyUp);
                            h1.innerText = "You Win!";
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
}


// want to implement yates shuffling algo
// check inversions