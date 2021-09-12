class Grid {

    constructor(gridRows, gridCols) {
        this.gridRows = gridRows;
        this.gridCols = gridCols;
    }

    isSolved() {
        const { gridRows, gridCols, correctGrid, grid } = this;
        for (let i = 0; i < gridRows; i++) {
            for (let j = 0; j < gridCols; j++) {
                if (correctGrid[i][j] !== grid[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    swapTiles(row, col, otherRow, otherCol) {
        const { grid, currentRow, currentCol } = this;
        const blank = grid[row][col];
        grid[row][col] = grid[otherRow][otherCol];
        grid[otherRow][otherCol] = blank;
        currentRow = otherRow;
        currentCol = otherCol;
    }

    moveTile(newRow, newCol) {
        const { currentRow, currentCol } = this;
        if (isDirectionValid(newRow, newCol)) {
            swapTiles(currentRow, currentCol, newRow, newCol);
            return true;
        }
        return false;
    }

    buildDefaultGrid() {
        let counter = 1;
        const grid = new Array(this.gridRows);
        const { gridRows, gridCols } = this;

        for (let i = 0; i < gridRows; i++) {
            grid[i] = [];
            for (let j = 0; j < gridCols; j++) {
                if (i === gridRows - 1 && j === gridCols - 1) {
                    grid[i][j] = "";
                } else {
                    grid[i][j] = counter;
                }
                counter++;
            }
        }
        return grid;
    }

    buildShuffledGrid() {
        const { gridRows, gridCols } = this;
        this.correctGrid = this.buildDefaultGrid(gridRows, gridCols);
        this.grid = this.buildDefaultGrid(gridRows, gridCols);
        const { grid } = this;

        const array = createArray(gridRows * gridCols);
        shuffleArray(array);
        if (!isSolvable(array)) {
            makeSolvable(array);
        }

        for (let i = 0; i < gridRows; i++) {
            for (let j = 0; j < gridCols; j++) {
                let value = array[i * gridRows + j];
                if (value === 0) {
                    grid[i][j] = "";
                    this.currentRow = i;
                    this.currentCol = j;
                } else {
                    grid[i][j] = value;
                }
            }
        }
    }

    isDirectionValid(row, col) {
        if (row >= 0 && row < this.gridRows && col >= 0 && col < this.gridCols) {
            return true;
        }
        return false;
    }

    getGrid() {
        return this.grid;
    }

    moveTile(nextRow, nextCol) {
        const { currentRow, grid, currentCol } = this;
        const temp = grid[currentRow][currentCol];
        grid[currentRow][currentCol] = grid[nextRow][nextCol];
        grid[nextRow][nextCol] = temp;
        this.currentRow = nextRow;
        this.currentCol = nextCol;
    }
}

