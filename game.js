const btnUp = document.querySelector('.btnUp');
const btnLeft = document.querySelector('.btnLeft');
const btnRight = document.querySelector('.btnRight');
const btnDown = document.querySelector('.btnDown');
const canvas = document.querySelector('.juego');
const game = canvas.getContext('2d'); //para que sea de 2d

let canvasSize;
let elementoSize;
let level = 0; //contador en 0 de los niveles
let lives = 3; //vidas

const playerPosition = {
    x: undefined,
    y: undefined,
};

const giftPosition = {
    x: undefined,
    y: undefined,
};
let enemyPositions = [];

window.addEventListener('load', setCanvasSize); //Para que cargue la paguina antes de empezar a jugar
window.addEventListener('resize', setCanvasSize); //Para que resize la pantalla del canvas en todo tamallo del dispositivo 

function setCanvasSize(){
    if(window.innerHeight > window.innerWidth){//calcular el tamaño 10*10 para que sea un cuadrado perfecto
        canvasSize = (window.innerWidth * 0.65);
    }
    else{
        canvasSize = window.innerHeight * 0.65;
    }
    canvas.setAttribute('width', canvasSize)
    canvas.setAttribute('height', canvasSize)//---------------------------------------------------------------------------------------------------

    elementoSize = ((canvasSize) / 10);//divide la pnlanilla entre 10 para tener la medida donde estara contenida cada elemento

    startGame()
}

function startGame() {

    game.font = (elementoSize - 10) + 'px Verdana'; //darle el tamaño del elemento
    game.textAlign = 'end'; //de donde hicia la posicion 

    //se crea un arreglo de arreglos entre filas y columnas bidimencioanl
    const map = maps[level];

    if(!map){//cuando se acaba todos los mapas
        gameWin();
        return
    }

    const mapRows = map.trim().split('\n'); //1. sacamos el mapa del array 2. quitamos los espacios en blanco del inicio y del final 3. creamos un arreglo cuando el inicio y el fiaml apartir de cada salto de linea
    const mapRowsCols = mapRows.map(row => row.trim().split(''))//1. se crea un arreglo donde por cada fila se vuelva un arreglo donde cada letra es un elemnto
    
    enemyPositions = [];//limpiando el arreglo
    game.clearRect(0, 0, canvasSize, canvasSize);//antes de hacer cada uno de los renders se esta borrando todo

    mapRowsCols.forEach((row, rowIndex) => row.forEach((col, colIndex) => {//hace lo mismo que el metodo tradicional del for
        const imprimirEmoji = emojis[col];
        const posX = elementoSize * (colIndex + 1);
        const posY = elementoSize * (rowIndex + 1);

        if(col == 'O'){//condicional para poner al jugador en el punto de inicio
           if(!playerPosition.x && !playerPosition.y){//si ninguno de estos elemenros no tienen nada  entonces se asigna una posicion
            playerPosition.x = posX;
            playerPosition.y = posY;
           }
        }else if(col == 'I'){//la posiion de regalo
            giftPosition.x = posX;
            giftPosition.y = posY;
            console.log(posX, posY)
        }else if(col == 'X'){//la posocion de los obstaculos
            enemyPositions.push({
                x: posX,
                y: posY,
            });
        }
        game.fillText(imprimirEmoji, posX, posY -10);
    }));
    movePlayer()
    // for (let row = 1; row <= 10; row++){
    //     for (let col = 1; col <= 10; col++){
    //         game.fillText(emojis[mapRowsCols[row - 1][col - 1]], ((elementoSize) * col), ((elementoSize) * row));//ciclos para organizar las posiciones entre filas y colummnas con el respectivo tamaño llando a cada elento segun su posicion y restandole 1 porque el ciclo comezo en 1
    //     }
    // }
}

function movePlayer(){//para que tenga movilidad
    const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);//le quitamos 3 decimales a las posiciones par que conincidan entre decinales
    const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
    const giftCollision = giftCollisionX && giftCollisionY;
    console.log(giftCollision)
    if(giftCollision){//si colicionan subes de nivel
        levelWin();
    }

    const enemyCollision = enemyPositions.find(enemy => {
        const enemyCollisionX =enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
        const enemyCollisionY =enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
        return enemyCollisionX && enemyCollisionY
    });

    if(enemyCollision){
        levelFail();
    }
    game.fillText(emojis['PLAYER'], playerPosition.x + 5, playerPosition.y - 10)
}

function levelWin(){//para informar que se gano y sumarle el siguiente nivel
    console.log('subiste de nivel');
    level++;
    startGame();
}

function levelFail(){//perdiendo vidas
    console.log('chocaste contra un enemigo');
    lives--;
    if(lives <= 0){
        level = 0;
        lives = 3;
    }    
    playerPosition.x = undefined;
    playerPosition.y = undefined;
    startGame();
    

}

function gameWin(){
    console.log('terinaste el juego');
}

//activar las teclas
window.addEventListener('keydown', moveByKeys)//cuando se mantenga abako el boton de teclado
//activar los botones
btnUp.addEventListener('click', moveUp)
btnLeft.addEventListener('click', moveLeft)
btnRight.addEventListener('click', moveRight)
btnDown.addEventListener('click', moveDown)

function moveByKeys(event){
    if(event.key == 'ArrowUp') moveUp();
    else if(event.key == 'ArrowLeft') moveLeft();
    else if(event.key == 'ArrowRight') moveRight(); 
    else if(event.key == 'ArrowDown') moveDown();
}
function moveUp() {//condicionales que da el movimiento y el limite de movilidad
    if(((playerPosition.y - elementoSize) + 1) < elementoSize){
        console.log('OUT')
    }
    else{
        playerPosition.y = playerPosition.y - elementoSize;
        startGame()
    } 
}
function moveLeft() {
    if(((playerPosition.x - elementoSize) + 1) < elementoSize){
        console.log('OUT')
    }
    else{
        playerPosition.x -= elementoSize;
        startGame()
    } 
}
function moveRight() {
    if(((playerPosition.x + elementoSize)) > (canvasSize + 1)){
        console.log('OUT')
        console.log((playerPosition.x + elementoSize), (playerPosition.x - canvasSize) + 1, canvasSize);
    }
    else{
        playerPosition.x += elementoSize;
        console.log(((playerPosition.x + elementoSize)), (playerPosition.x - canvasSize) + 1, canvasSize);
        startGame() 
    }
}
function moveDown() {
    if(((playerPosition.y + elementoSize)) > (canvasSize + 1)){
        console.log('OUT')
        console.log((playerPosition.y));
    }
    else{
        playerPosition.y += elementoSize;
        console.log((playerPosition.y));
        startGame() 
    }
}