/*
    1) set up a grid
    2) how to move tiles
    3) look up algorithm to shuffle tiles
    4) how to render the grid
        a) how to add an animation

    Eventually
    1) let a user set a grid size
    2) choose an image
    3) maybe add a timing feature
        a) once you beat it, get a url that you can send to your friends so they get the same set up
        and can compete with them
*/
const gridRows = 4;
const gridCols = 4;
const grid = buildGrid(gridRows, gridCols);
// const finishedGrid = buildGrid();

let [currentRow, currentCol] = shuffleGrid(grid, gridRows - 1, gridCols - 1, []);

renderGrid();

function swapTile(blankRow, blankCol, otherRow, otherCol) {
    const blank = grid[blankRow][blankCol];
    grid[blankRow][blankCol] = grid[otherRow][otherCol];
    grid[otherRow][otherCol] = blank;
    currentRow = otherRow;
    currentCol = otherCol;
}

document.body.addEventListener("keyup", (e) => {
    console.log(e.keyCode);
    if (e.keyCode === 38) {
        if (isDirectionValid(currentRow - 1, currentCol)) {
            swapTile(currentRow, currentCol, currentRow - 1, currentCol);
            renderGrid();
        }
        console.log("up");
    }

    if (e.keyCode === 40) {
        if (isDirectionValid(currentRow + 1, currentCol)) {
            swapTile(currentRow, currentCol, currentRow + 1, currentCol);
            renderGrid();
        }
        console.log("down");
    }

    if (e.keyCode === 37) {
        if (isDirectionValid(currentRow, currentCol - 1)) {
            swapTile(currentRow, currentCol, currentRow, currentCol - 1);
            renderGrid();
        }
        console.log("left");
    }

    if (e.keyCode === 39) {
        if (isDirectionValid(currentRow, currentCol + 1)) {
            swapTile(currentRow, currentCol, currentRow, currentCol + 1);
            renderGrid();
        }
        console.log("right");
    }
});

function renderGrid() {
    const htmlGrid = getHtmlGrid();
    const container = document.querySelector('#container');
    container.innerHTML = htmlGrid;
}

function getHtmlGrid() {
    let htmlGrid = "";
    for (let i = 0; i < gridRows; i++) {
        for (let j = 0; j < gridCols; j++) {
            const div = `<div class="tile">${grid[i][j]}</div>`;
            htmlGrid += div;
        }
    }
    return htmlGrid;
}

function shuffleGrid(grid, blankRow, blankCol, visitedDirections) {
    const maxRows = grid.length;
    const maxCols = grid[0].length;
    let currentRow = blankRow;
    let currentCol = blankCol;

    for (let i = 0; i < maxRows * maxCols; i++) {
        const up = [currentRow - 1, currentCol, "up"];
        const down = [currentRow + 1, currentCol, "down"];
        const left = [currentRow, currentCol - 1, "left"];
        const right = [currentRow, currentCol + 1, "right"];
        const directions = [up, down, left, right];
        const validDirections = getValidDirections(directions, maxRows, maxCols);
        shuffleDirections(validDirections);
        // pick the first direction
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
