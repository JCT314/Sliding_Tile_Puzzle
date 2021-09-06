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

const grid = buildGrid(4, 4);

function buildGrid(rows, columns) {
    let counter = 0;
    const grid = new Array(rows);

    for (let i = 0; i < rows; i++) {
        grid[i] = [];
        for (let j = 0; j < columns; j++) {
            if (i === 0 && j === 0) {
                grid[i][j] = "";
            } else {
                grid[i][j] = counter;
            }
            counter++;
        }
    }
    return grid;
}
