function createArray(length) {
    const values = [];
    for (let i = 0; i < length; i++) {
        values.push(i);
    }
    return values;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i >= 1; i--) {
        let index = Math.floor(Math.random() * i);
        swapTiles(i, index, arr);
    }
}

function swapTiles(index1, index2, arr) {
    let temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
}

function countInversions(arr) {
    let count = 0;
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === 0) {
            continue;
        }
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j] && arr[j] !== 0) {
                count++;
            }
        }
    }
    return count;
}

function isSolvable(arr) {
    let inversions = countInversions(arr);
    if (inversions % 2 === 0) {
        return true;
    }
    return false;
}

function makeSolvable(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] === 0) {
            continue;
        }
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] > arr[j] && arr[j] !== 0) {
                swapTiles(i, j, arr);
                break;
            }
        }
    }
}