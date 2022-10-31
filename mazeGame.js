function rand(max){
    return Math.floor(Math.random() * max);
}
// thuat toan sap xep cot
function shuffle(a){
    for (let i = a.length - 1; i > 0; i-- ){
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    console.log(a);
    return a;
}
function changeBrightness(factor, sprite){
    var virtCanvas = document.createElement("canvas");
    virtCanvas.width = 500;
    virtCanvas.height = 500;
    var context = virtCanvas.getContext("2d");
    context.drawImage(sprite, 0, 0, 500, 500);
    
    var imgData = context.getImageData(0, 0, 500, 500);

    for (let i = 0; i < imgData.data.length; i += 4){
        imgData.data[i] = imgData.data[i] * factor;
        imgData.data[i + 1] = imgData.data[i + 1] * factor;
        imgData.data[i + 2] = imgData.data[i + 2] * factor;
    }
    context.putImageData(imgData, 0, 0);

    var spriteOutput = new Image();
    spriteOutput.src = virtCanvas.toDataURL();
    virtCanvas.remove();
    return spriteOutput;
}

// hien thi sau khi tro choi ket thuc
function displayVictoryMess(moves){
    var tt =  document.getElementById("timer").innerHTML ;
    document.getElementById("moves").innerHTML = "You Moved " + moves + " Steps.";
    document.getElementById("tim").innerHTML = tt;
    clearInterval(timer);
    toggleVisablity("Message-Container");
}

function toggleVisablity(id){
    //thong bao hien thi an di 
    if (document.getElementById(id).style.visibility == "visible"){
        document.getElementById(id).style.visibility = "hidden";
    }
    // thong bao dang hien thi an di
    else{
        document.getElementById(id).style.visibility = "visible";
    }
}

// tao ra me cung
function Maze (Width, Height){
    var mazeMap;
    var width = Width;
    var height = Height;
    var startCoord, endCoord;
    var dirs = ["n", "s","e" ,"w"];// huong di
    var modDir = {
        n:{
            y: -1,
            x: 0,
            o: "s"
        },
        s: {
            y: 1, 
            x: 0, 
            o: "n"
        },
        e: {
            y: 0,
            x: 1,
            o: "w"
        },
        w: {
            y: 0,
            x: -1,
            o: "e",
        }
    };

    this.map = function(){
        return mazeMap;
    };
    this.startCoord = function(){
        return startCoord;
    };
    this.endCoord = function(){
        return endCoord;
    };

    function genMap(){
        mazeMap = new Array(height);
        for(y = 0; y < height; y++){
            mazeMap[y] = new Array(width);
            for(x = 0; x < width; ++x){
                mazeMap[y][x] = {
                    n: false,
                    s: false,
                    e: false,
                    w: false,
                    visited: false,
                    priorPos: null
                };
            }
        }
    }

   
    function defineMaze(){
        var isComp = false;
        var move = false;
        var cellsVisited = 1;
        // var numLoops = 0;
        // var maxLoops = 0;
        var pos = {
            x: 0,
            y: 0
        };
        var numCells = width * height; //so  o vuong
         
        while(!isComp){
            move = false;
            mazeMap[pos.x][pos.y].visited = true; //check qua xem o vi tri nao
            
            
            // if (numLoops >= maxLoops){
            shuffle(dirs);
            //     maxLoops = Math.round(rand(height / 100));
            //     numLoops = 0;
            // }
            // numLoops++;

            for (index = 0; index < dirs.length; index++){
                var direction = dirs[index];
                console.log("direction",direction);
                var nx = pos.x + modDir[direction].x;
                var ny = pos.y + modDir[direction].y;
                console.log("modDir", modDir[direction]);

                if (nx >=0 && nx < width && ny >= 0 && ny < height){
                    // Check if title is already visited
                    if (!mazeMap[nx][ny].visited){
                        // Caver though walls from this to next
                        mazeMap[pos.x][pos.y][direction] = true;
                        mazeMap[nx][ny][modDir[direction].o] = true;

                        console.log("pos.x",pos.x,"pos.y",pos.y);
                        console.log("nx",nx,"ny",ny);
                        //Set Currentcell as next cells Prior visited
                        mazeMap[nx][ny].priorPos = pos;
                        console.log(pos);
                        //Update cell position to newly visited location
                        pos = {
                            x : nx,
                            y : ny
                        }
                        cellsVisited++;
                        //Recursively call this method on tile
                        move = true;
                        break;
                    }
                }
            }

            if (!move){
                // If it failed to find a diretion,
                //move the current position back to the prior cell and recall the method.
                // goi vat di chuyen  lai
                pos = mazeMap[pos.x][pos.y].priorPos;
            }
            if (numCells == cellsVisited){
                isComp = true;
            }
        }
    }

    // vi tri dat noi bat dau va noi ket thuc
    function defineStartEnd(){
        switch(rand(4)){
            case 0:
                startCoord = {
                    x: 0,
                    y: 0,
                };
                endCoord = {
                    x: height - 1,
                    y: width - 1
                };
                break;
            case 1:
                startCoord = {
                    x: 0,
                    y: width - 1,
                }
                endCoord = {
                    x: height - 1,
                    y: 0
                }
                break;
            case 2:
                startCoord = {
                    x : height - 1,
                    y : 0
                }
                endCoord = {
                    x : 0,
                    y: width - 1,
                }
                break;
            case 3:
                startCoord = {
                    x : height - 1,
                    y : width - 1, 
                }
                endCoord = {
                    x : 0,
                    y : 0
                }
                break;
        }
    }

    genMap();
    defineStartEnd()
    defineMaze();
}

// ve me cung
function DrawMaze(Maze, ctx, cellsize, endSprite = null){
    var map = Maze.map();
    var cellSize = cellsize;
    var drawEndMethod;
    ctx.lineWidth = cellSize / 40 ; //mat do day cac o trong me cung

    // ve lai me cung
    this.redrawMaze = function(size){
        cellSize = size;
        ctx.lineWidth = cellSize / 50;
        drawMap();
        drawEndMethod();
    };
    //ve cac o 
    function drawCell(xCord, yCord, cell){
        var x = xCord * cellSize;
        var y = yCord * cellSize;
        // tren
        if (cell.n === false){
            ctx.beginPath();//tao duong dan moi
            ctx.moveTo(x,y);// di chuyen den toa do duoc chi dinh
            ctx.lineTo(x + cellSize, y);// tao 2 diem o noi chi dinh
            ctx.stroke();//ve duong thang tu hai diem duoc chi dinh
        }
        //duoi
        if (cell.s === false){
            ctx.beginPath();
            ctx.moveTo(x,y + cellSize);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke()
        }
        //phai
        if (cell.e === false){
            ctx.beginPath();
            ctx. moveTo(x + cellSize, y);
            ctx.lineTo(x + cellSize, y + cellSize);
            ctx.stroke();
        }
        // trai
        if (cell.w === false){
            ctx.beginPath();
            ctx.moveTo(x,y);
            ctx.lineTo(x , y + cellSize);
            ctx.stroke();
        }
    }

    // ve map
    function drawMap (){
        for (x = 0; x < map.length; x++){
            for( y = 0; y < map[x].length; y++){
                drawCell(x, y, map[x][y]);
            }
        }
    }

    // ve diem ket thuc
    function drawEndFlag(){
        var coord = Maze .endCoord();
        var gridSize = 4;
        var fraction = cellSize/ gridSize - 2;
        var colorSwap = true;

        for (let y = 0; y < gridSize; y++) {
            if (gridSize % 2 == 0){
                colorSwap = !colorSwap;
            }
            for (let x = 0; x < gridSize; x++ ){
                ctx.beginPath();
                ctx.rect(
                    coord.x * cellSize + x * fraction + 4.5,
                    coord.y * cellSize + y * fraction + 4.5,
                    fraction,
                    fraction
                );
                if (colorSwap) {
                    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
                  } else {
                    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
                  }
                  ctx.fill();
                  colorSwap = !colorSwap;
            }
        }
    }

    // ve diem ket thuc
    function drawEndSprite(){
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        var coord = Maze.endCoord();
        ctx.drawImage(
            endSprite,
            2, 
            2,
            endSprite.width,
            endSprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight 
        );
    }

    // xoa ban do
    function clear(){
        var canvasSize = cellSize * map.length;
        ctx.clearRect(0, 0, canvasSize, canvasSize);
        // thoi gian
    }

    if(endSprite != null){
        drawEndMethod = drawEndSprite;
    }
    else{
        drawEndMethod = drawEndFlag;
    }

    clear();
    drawMap();
    drawEndMethod();
}

function Player (maze, c, _cellsize, onComplete, sprite = null){
    var ctx = c.getContext("2d");
    var drawSprite;
    var moves = 0;
    drawSprite = drawSpriteCircle;
    if ( sprite != null){
        drawSprite = drawSpriteImg ;
    }
    var player = this;
    var map = maze.map();
    var cellCoords = {
        x: maze.startCoord().x,
        y: maze.startCoord().y
    }
    var cellSize = _cellsize;
    var halfCellSize = cellSize / 2;

    this.redrawPlayer = function(_cellsize){
        cellSize = _cellsize;
        drawSpriteImg(cellCoords);
    };

    function drawSpriteCircle (coord){
        ctx.beginPath();
        ctx.arc(
            (coord.x) * cellSize - halfCellSize,
            (coord.y) * cellSize - halfCellSize,
            halfCellSize - 2,
            0,
            2 * Math.PI
        );
        ctx.fill();
        if(coord.x === maze.endCoord().x && coord.y === maze.endCoord().y){//1
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function drawSpriteImg(img, coord){
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.drawImage(
            img,
            0,
            0,
            sprite.width,
            sprite.height,
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetRight,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
        if (coord.x === maze.endCoord().x && coord.y === maze.endCoord().y){//1
            onComplete(moves);
            player.unbindKeyDown();
        }
    }

    function removeSprite(coord){
        var offsetLeft = cellSize / 50;
        var offsetRight = cellSize / 25;
        ctx.clearRect(
            coord.x * cellSize + offsetLeft,
            coord.y * cellSize + offsetLeft,
            cellSize - offsetRight,
            cellSize - offsetRight
        );
    }

    //doi tuong di chuyen
    function check(e){
        var cell = map[cellCoords.x][cellCoords.y];
        moves++;
        switch (e.keyCode){
            case 65://a
            case 37: //west (Tay) trai
                if( cell.w == true){
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x - 1,
                        y: cellCoords.y
                    };
                    drawSprite(spriteW, cellCoords);
                }
                break;
            case 87://w
            case 38://north(Bac) len
                if (cell.n == true) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x ,
                        y: cellCoords.y - 1
                    };
                    drawSprite(sprite, cellCoords);
                }
                break;
            case 68://d
            case 39:// east(Dong) phai
                if (cell.e == true){
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x + 1,
                        y: cellCoords.y
                    };
                    drawSprite (spriteE, cellCoords);
                }
                break;
            case 83://s
            case 40:// south (Nam) xuong
                if (cell.s) {
                    removeSprite(cellCoords);
                    cellCoords = {
                        x: cellCoords.x,
                        y: cellCoords.y + 1
                    };
                    drawSprite(spriteS, cellCoords);
                }
                break;
        }
    }

    this.bindKeyDown = function(){
        window.addEventListener("keydown", check, false)
    };

    this.unbindKeyDown = function() {
        window.removeEventListener("keydown", check, false);
    };

    drawSprite(sprite,maze.startCoord());

    this.bindKeyDown();
}

var mazeCanvas = document.getElementById("mazeCanvas");
var ctx = mazeCanvas.getContext("2d");
var spriteE, spriteS, sprite, spriteW;
var redE,redS,redN,redW,greenE,greenS,greenN,greenW;
var finishSprite;
var maze, draw, player;
var cellSize;
var difficulty;
// chon vat
function create(){
    spriteE = new Image();
    spriteS = new Image();
    sprite = new Image();
    spriteW = new Image();

    redE = new Image();
    redS = new Image();
    redN = new Image();
    redW = new Image();

    greenE = new Image();
    greenN = new Image();
    greenS = new Image();
    greenW = new Image();

    redE.src = "https://i.ibb.co/CQ5s6Hf/1p.png";
    redS.src = "https://i.ibb.co/wLW5gP9/1x.png";
    redW.src = "https://i.ibb.co/qg1mSwv/1t.png";
    redN.src = "https://i.ibb.co/mH6TbFB/1l.png";
    
    greenE.src = "https://i.ibb.co/8sDhKNy/4p.png";
    greenN.src = "https://i.ibb.co/qnq4gzL/4l.png";
    greenS.src = "https://i.ibb.co/1vXgFWw/4x.png";
    greenW.src = "https://i.ibb.co/jgRBzhz/4t.png";
    

    var image = document.getElementById("icon").value;
    switch (image) {
        case "red": 
            spriteE = redE;
            spriteS = redS;
            sprite = redN;
            spriteW = redW;
            break;
        case "green":
            spriteE = greenE;
            spriteS = greenS;
            sprite = greenN;
            spriteW = greenW;
            break;
    } 
    
}
function application(){

    
    var completeOne = false;
    var completeTwo = false;
    var isComplete = () =>{
        if(completeOne === true && completeTwo === true)
        {
             makeMaze();
        }
    };

    create(); 

    // ket thuc
    finishSprite = new Image();
        finishSprite.src = "https://image.ibb.co/b9wqnJ/i_Q7m_U25_Imgur.png" + "?" + new Date().getTime();
        finishSprite.setAttribute("crossOrigin", " ");
        finishSprite.onload = function() {
            finishSprite = changeBrightness(1.1, finishSprite);
            completeTwo = true;
            console.log(completeTwo);
            isComplete();
        }; 
}
  

window.onload = function(){
    application();
};

window.onresize = function() {
    if (player != null) {
        draw.redrawMaze(cellSize);
        player.redrawPlayer(cellSize);
      }
}

var totalTime = 0;
var timer;
function Timer(){
    
    totalTime ++;
    var tmp;
    var h = 0;
    var m = 0;
    var s = 0;
    tmp = totalTime % 3600;
    h = ( totalTime - tmp ) / 3600;
    tmp = ( totalTime - h * 3600 ) % 60;
    m = ( totalTime - h * 3600 - tmp ) / 60;
    s = totalTime - ( h * 3600 + m * 60 );
    if( h < 10 ) h = '0' + h;
    if( m < 10 ) m = '0' + m;
    if( s < 10 ) s = '0' + s;
    $('#timer').html('Timer   ' + h + ' : ' + m + ' : ' + s);
}

function start(){
    clearInterval(timer);
    totalTime = 0;
    timer = setInterval(Timer, 1000);
}

function color(){
    var wathcolor = document.getElementById("wallPath").value;
    switch(wathcolor){
        case "yellow":
            ctx.strokeStyle = "yellow";
            break;
        case "white":
            ctx.strokeStyle = "white";
            break;
        case "red":
            ctx.strokeStyle = "red";
            break;
        case "orange":
            ctx.strokeStyle = "orange";
            break;
    }
}

function makeMaze() {
    create();
    if (player != undefined) {
      player.unbindKeyDown();
      player = null;
    }
    color();
    var e = document.getElementById("diffSelect");
    difficulty = e.options[e.selectedIndex].value;
    cellSize = mazeCanvas.width / difficulty;
    maze = new Maze(difficulty, difficulty);
    draw = new DrawMaze(maze, ctx, cellSize, finishSprite);
    player = new Player(maze, mazeCanvas, cellSize, displayVictoryMess, sprite);
    if (document.getElementById("mazeContainer").style.opacity < "100") {
      document.getElementById("mazeContainer").style.opacity = "100";
    }
    start();
}