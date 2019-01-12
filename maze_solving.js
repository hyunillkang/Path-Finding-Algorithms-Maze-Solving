

function Cell(status) {
    this.status = status;
    this.parent = undefined;
}


function Queue() {

    var queue = [];

    this.enqueue = function (item) {
        if (item == undefined) {
            return;
        }
        for (var i = 0; i < queue.length; i++) {
            if (queue[i].row == item.row && queue[i].col == item.col) {
                queue.splice(i, 1);
                break;
            }
        }

        queue.push(item);
    }

    this.dequeue = function () {
        var item = queue[0];
        queue.shift();
        return item;
    }
}

function Stack() {

    var stack = [];

    this.push = function (item) {
        if (item == undefined) {
            return;
        }
        for (var i = 0; i < stack.length; i++) {
            if (stack[i].row == item.row && stack[i].col == item.col) {
                stack.splice(i, 1);
                break;
            }
        }
        console.log("stack push");
        stack.push(item);
    }

    this.pop = function () {
        var item = stack[stack.length - 1];
        stack.pop();
        return item;
    }
}

/*
 0: empty
 1: block
 2: start
 3: destination
 4: ongoing
 5: found
*/
var canvas = document.getElementById("canvas");
console.log(canvas);
var ctx = canvas.getContext("2d");

var selectedMode = 'start';

var grid;
var rows = 20;
var cols = 20;
var cellSize = 25;

var timerSwitch = true;

var mousePosition = {
    x: 0,
    y: 0,
}

createMaze();


function createMaze() {
    grid = [];
    for (var i = 0; i < rows; i++) {
        var temp = [];
        for (var j = 0; j < cols; j++) {
            var cell = new Cell(0);
            temp.push(cell);
        }
        grid.push(temp);
    }


    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            ctx.strokeRect(i * cellSize, j * cellSize, cellSize, cellSize);
        }
    }

}

function selectMazeMode(mode) {
    selectedMode = mode;
}


canvas.addEventListener('mousemove', function (e) {
    var bbox = canvas.getBoundingClientRect();
    var x = e.clientX - bbox.left;
    var y = e.clientY - bbox.top;

    mousePosition.x = x;
    mousePosition.y = y;

});

canvas.addEventListener('click', function (e) {

    var x = mousePosition.x;
    var y = mousePosition.y;

    var col = Math.floor(x / cellSize);
    var row = Math.floor(y / cellSize);


    switch (selectedMode) {
        case 'start':
            setStartPoint(row, col);
            break;
        case 'destination':
            setDestinationPoint(row, col);
            break;
        case 'wall_cell':
            if (grid[row][col].status == 1) {
                removeWall(row, col);
            } else {
                createWall(row, col);
            }
            break;
        case 'wall_row':
            if (grid[row][col].status == 1) {
                for (var i = 0; i < cols; i++) {
                    removeWall(row, i)
                }
            } else {
                for (var i = 0; i < cols; i++) {
                    createWall(row, i);
                }
            }
            break;
        case 'wall_col':
            if (grid[row][col].status == 1) {
                for (var i = 0; i < rows; i++) {
                    removeWall(i, col)
                }
            } else {
                for (var i = 0; i < rows; i++) {
                    createWall(i, col);
                }
            }
            break;
    }
});


function createWall(row, col) {

    grid[row][col].status = 1;
    ctx.fillStyle = '#ccc';
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
}

function removeWall(row, col) {
    grid[row][col].status = 0;
    ctx.fillStyle = '#fff';
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
}

function setStartPoint(row, col) {

    var oldRow;
    var oldCol;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j].status == 2) {
                oldRow = i;
                oldCol = j;
                grid[i][j].status = 0;
            }
        }
    }

    ctx.fillStyle = '#fff';
    ctx.fillRect(oldCol * cellSize, oldRow * cellSize, cellSize, cellSize);
    ctx.strokeRect(oldCol * cellSize, oldRow * cellSize, cellSize, cellSize);

    grid[row][col].status = 2;
    ctx.fillStyle = 'green';
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
}

function setDestinationPoint(row, col) {
    var oldRow;
    var oldCol;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j].status == 3) {
                oldRow = i;
                oldCol = j;
                grid[i][j].status = 0;
            }
        }
    }

    ctx.fillStyle = '#fff';
    ctx.fillRect(oldCol * cellSize, oldRow * cellSize, cellSize, cellSize);
    ctx.strokeRect(oldCol * cellSize, oldRow * cellSize, cellSize, cellSize);

    grid[row][col].status = 3;
    ctx.fillStyle = 'red';
    ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
    ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
}

function selectMode(input) {
    mode = input.value;
}


function preparePathFinding() {
    var checkStartPoint = false;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j].status == 2) {
                checkStartPoint = true;
                break;
            }
        }
    }

    if (!checkStartPoint) {
        alert("Please set up start point");
        return;
    }

    var checkDestinationPoint = false;

    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j].status == 3) {
                checkDestinationPoint = true;
                break;
            }
        }
    }

    if (!checkDestinationPoint) {
        alert("Please set up destination point");
        return;
    }

    var solvingAlgorithms = document.getElementsByName("solvingAlgorithms");
    var selectedAlgorithm;
    for (var i = 0; i < solvingAlgorithms.length; i++) {
        if (solvingAlgorithms[i].checked) {
            selectedAlgorithm = solvingAlgorithms[i].value;
            break;
        }
    }

    for (var row = 0; i < grid.length; i++) {
        for (var col = 0; j < grid[0].length; j++) {
            if (grid[row][col].status == 4 || grid[row][col].status == 5) {
                grid[row][col].status == 0;
                ctx.fillStyle = '#fff';
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);

            }
        }
    }

    switch (selectedAlgorithm) {
        case 'bfs':
            console.log("bfs");
            findBFSPath();
            break;
        case 'dfs':
            console.log("dfs");
            findDFSPath();
            break;
        case 'bestFirst':
            console.log("bestFirst");
            findBestFirstPath();
            break;
    }


}


function findDFSPath() {

    var startPoint = findStartPoint();
    var destinationPoint = findDestinationPoint();

    var stack = new Stack();
    stack.push(startPoint);

    var timer = setInterval(function () {

        if (timerSwitch) {

            var item = stack.pop();

            var row = item.row;
            var col = item.col;

            if (row == destinationPoint.row && col == destinationPoint.col) {
                alert("target found!");
                clearInterval(timer);
                tracePath(row, col);
                return;
            }

            if (row == startPoint.row && col == startPoint.col) {

            } else {
                ctx.fillStyle = "blue";
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }



            var up = moveCursor(row, col, row - 1, col);
            stack.push(up);

            var left = moveCursor(row, col, row, col - 1);
            stack.push(left);

            var down = moveCursor(row, col, row + 1, col);
            stack.push(down);

            var right = moveCursor(row, col, row, col + 1);
            stack.push(right);

            var str = "";
            for (var i = 0; i < stack.length; i++) {
                str += "(" + stack[i].row + ", " + stack[i].col + ") "
            }

            var queueMsg = document.getElementById("queueMsg");
            queueMsg.textContent = str;

            if (stack.length == 0) {
                alert("Target can't be found!")
                clearInterval(timer);

                return;
            }
        }
    }, 200);
}

function findBFSPath() {

    var startPoint = findStartPoint();
    var destinationPoint = findDestinationPoint();




    var queue = new Queue();
    queue.enqueue(startPoint);

    var timer = setInterval(function () {

        if (timerSwitch) {

            var item = queue.dequeue();

            var row = item.row;
            var col = item.col;

            if (row == destinationPoint.row && col == destinationPoint.col) {
                alert("target found!");
                clearInterval(timer);
                tracePath(row, col);
                return;
            }

            if (row == startPoint.row && col == startPoint.col) {

            } else {
                ctx.fillStyle = "blue";
                ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
                ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
            }

            var up = moveCursor(row, col, row - 1, col);
            queue.enqueue(up);

            var left = moveCursor(row, col, row, col - 1);
            queue.enqueue(left);

            var down = moveCursor(row, col, row + 1, col);
            queue.enqueue(down);

            var right = moveCursor(row, col, row, col + 1);
            queue.enqueue(right);




            var str = "";
            for (var i = 0; i < queue.length; i++) {
                str += "(" + queue[i].row + ", " + queue[i].col + ") "
            }

            var queueMsg = document.getElementById("queueMsg");
            queueMsg.textContent = str;

            if (queue.length == 0) {
                alert("Target can't be found!")
                clearInterval(timer);

                return;
            }
        }
    }, 200);

}

function findBestFirstPath() {
    var startPoint = findStartPoint();
    var destinationPoint = findDestinationPoint();

    var list = [startPoint];

    var timer =   setInterval(function() {

    var item = findShortestDistance(list, destinationPoint);

    var row = item.row;
    var col = item.col;

    if (row == destinationPoint.row && col == destinationPoint.col) {
        alert("target found!");
        clearInterval(timer);
        tracePath(row, col);
        return;
    }

    if (row == startPoint.row && col == startPoint.col) {

    } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);
    }

    var up = moveCursor(row, col, row - 1, col);
    if (up != undefined) {
        list.push(up);
    }

    var left = moveCursor(row, col, row, col - 1);
    if (left != undefined) {
        list.push(left);
    }

    var down = moveCursor(row, col, row + 1, col);
    if (down != undefined) {
        list.push(down);
    }

    var right = moveCursor(row, col, row, col + 1);
    if (right != undefined) {
        list.push(right);
    }

    var str = "";
    for (var i = 0; i < list.length; i++) {
        str += "(" + list[i].row + ", " + list[i].col + ") "
    }

    var queueMsg = document.getElementById("queueMsg");
    queueMsg.textContent = str;


        }, 200);
}


function moveCursor(row, col, newRow, newCol) {

    if (newRow >= 0 && newCol >= 0 && newRow < rows && newCol < cols) {
        if (grid[newRow][newCol].status == 0 || grid[newRow][newCol].status == 3) {
            grid[newRow][newCol].status = 4;
            grid[newRow][newCol].parent = { row: row, col: col };
            return { row: newRow, col: newCol };

        }
    }


}

function checkDuplicate(row, col, list) {
    for (var i = 0; i < list.length; i++) {
        if (list[i].row == row && list[i].col == col) {
            list.splice(i, 1);
            return;
        }
    }

}

function tracePath(row, col) {
    parentRow = grid[row][col].parent.row;
    parentCol = grid[row][col].parent.col;

    row = parentRow;
    col = parentCol;


    while (true) {
        if (grid[row][col].status == 2) {
            break;
        }

        grid[row][col].status = 5;
        ctx.fillStyle = 'cyan';
        ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        ctx.strokeRect(col * cellSize, row * cellSize, cellSize, cellSize);

        parentRow = grid[row][col].parent.row;
        parentCol = grid[row][col].parent.col;

        row = parentRow;
        col = parentCol;

    }

}

function clickPause() {
    timerSwitch = !timerSwitch;
}

function findStartPoint() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j].status == 2) {
                return startPoint = {
                    row: i,
                    col: j
                };
            }

        }
    }
}

function findDestinationPoint() {
    for (var i = 0; i < rows; i++) {
        for (var j = 0; j < cols; j++) {
            if (grid[i][j].status == 3) {
                return destinationPoint = {
                    row: i,
                    col: j
                };
            }
        }
    }
}

function findManhattanDistance(row1, col1, row2, col2) {
    return Math.abs(row2 - row1) + Math.abs(col2 - col1);
}

function findShortestDistance(list, destinationPoint) {

    var min = findManhattanDistance(list[0].row, list[0].col, destinationPoint.row, destinationPoint.col);
    for (var i = 1; i < list.length; i++) {
        var temp = findManhattanDistance(list[i].row, list[i].col, destinationPoint.row, destinationPoint.col);
        if (min > temp) {
            min = temp;
        }
    }

    for (var i = 0; i < list.length; i++) {
        var temp = findManhattanDistance(list[i].row, list[i].col, destinationPoint.row, destinationPoint.col);
        if (min == temp) {

            var item = {
                row: list[i].row,
                col: list[i].col
            };
            
            list.splice(i, 1);
            return item;
        }
    }
}