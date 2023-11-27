const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const rows = Math.floor(window.innerHeight / 20);
const columns = 14;

let playerPosition = { x: 0, y: 0 };
let map = [];
let score = 0;
let isPlayerAlive = true;

function createInitialMap() {
    map = [];
    for (let i = 0; i < rows; i++) {
        let row = '';
        for (let j = 0; j < columns; j++) {
            
            if ( j === 0 || j === columns - 1) {
                row += '#';
            } else {
                row += '.';
            }
        }
        map.push(row);
    }
}


function placePlayerRandomly() {
    const randomRow = Math.floor(Math.random() * (rows - 2)) + 1; 
    const randomColumn = Math.floor(Math.random() * (columns - 2)) + 1; 
    playerPosition.x = randomColumn;
    playerPosition.y = randomRow;
    map[randomRow] = map[randomRow].substring(0, randomColumn) + '@' + map[randomRow].substring(randomColumn + 1);
    
}

function generateRandomSymbol() {
    const randomColumn = Math.floor(Math.random() * (columns - 2)) + 1; // Hindari pinggir peta untuk simbol jatuh
    map[0] = map[0].substring(0, randomColumn) + '*' + map[0].substring(randomColumn + 1);
}

function drawMap() {
    const  symbolSize = Math.min(window.innerWidth / columns, window.innerHeight / rows);
    canvas.width = columns * symbolSize;
    canvas.height = rows * symbolSize;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const symbol = map[y][x];
            ctx.fillText(symbol, x * symbolSize, y * symbolSize);
        }
    }
}

document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key === 'ArrowUp' || key === 'w') {
        movePlayer('up');
    } else if (key === 'ArrowDown' || key === 's') {
        movePlayer('down');
    } else if (key === 'ArrowLeft' || key === 'a') {
        movePlayer('left');
    } else if (key === 'ArrowRight' || key === 'd') {
        movePlayer('right');
    }
});

function movePlayer(direction) {
    if (!isPlayerAlive) return; // Jika pemain sudah tidak hidup, hentikan fungsi

    let newX = playerPosition.x;
    let newY = playerPosition.y;

    if (direction === 'up') {
        newY -= 1;
    } else if (direction === 'down') {
        newY += 1;
    } else if (direction === 'left') {
        newX -= 1;
    } else if (direction === 'right') {
        newX += 1;
    }

    if (newX >= 0 && newX < map[0].length && newY >= 0 && newY < map.length) {
        if (map[newY][newX] !== '#') {
            map[playerPosition.y] = map[playerPosition.y].substr(0, playerPosition.x) + '.' + map[playerPosition.y].substr(playerPosition.x + 1);
            playerPosition.x = newX;
            playerPosition.y = newY;

            if (map[playerPosition.y][playerPosition.x] === '*') {
                console.log('Pemain Mati!');
                isPlayerAlive = false;
            } else {
                map[playerPosition.y] = map[playerPosition.y].substr(0, playerPosition.x) + '@' + map[playerPosition.y].substr(playerPosition.x + 1);
                drawMap();
            }
        }
    }
}

function moveSymbolsDown() {
    for (let y = rows - 1; y >= 0; y--) {
        for (let x = 0; x < columns; x++) {
            if (map[y][x] === '*' && y < rows - 1) {
                map[y + 1] = map[y + 1].substring(0, x) + '*' + map[y + 1].substring(x + 1);
                map[y] = map[y].substring(0, x) + '.' + map[y].substring(x + 1);
            }
        }
    }

    if (map[playerPosition.y][playerPosition.x] === '*') {
        console.log('Pemain Mati!');
        isPlayerAlive = false;
    }
    drawMap();
    generateRandomSymbol();
}

setInterval(moveSymbolsDown, 500);

createInitialMap();
placePlayerRandomly();
drawMap();
