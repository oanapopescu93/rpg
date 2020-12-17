import React from 'react';
import $ from 'jquery';
import image from "./img/tileset.png";

var game;
var ctx = null;
var gameMap = [
	0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
	0, 2, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 0,
	0, 2, 3, 4, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 2, 2, 0,
	0, 2, 3, 1, 4, 4, 1, 1, 2, 2, 2, 2, 1, 1, 2, 2, 2, 2, 2, 0,
	0, 2, 3, 1, 1, 4, 4, 1, 2, 3, 3, 2, 1, 1, 2, 1, 0, 0, 0, 0,
	0, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 2, 2, 2, 2, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 2, 4, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 0,
	0, 1, 1, 1, 1, 2, 4, 4, 4, 4, 4, 1, 1, 1, 2, 2, 2, 2, 1, 0,
	0, 1, 1, 1, 1, 2, 3, 2, 1, 1, 4, 1, 1, 1, 1, 3, 3, 2, 1, 0,
	0, 1, 2, 2, 2, 2, 1, 2, 1, 1, 2, 1, 1, 1, 1, 1, 3, 2, 1, 0,
	0, 1, 2, 3, 3, 2, 1, 2, 1, 1, 4, 4, 4, 4, 4, 4, 4, 2, 4, 4,
	0, 1, 2, 3, 3, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 0,
	0, 1, 2, 3, 4, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 0,
	0, 3, 2, 3, 4, 4, 1, 2, 2, 2, 2, 2, 2, 2, 1, 0, 1, 2, 1, 0,
	0, 3, 2, 3, 4, 4, 3, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 3, 0,
	0, 3, 2, 3, 4, 1, 3, 2, 1, 3, 1, 1, 1, 2, 1, 1, 1, 2, 3, 0,
	0, 1, 2, 2, 2, 2, 2, 2, 3, 3, 3, 1, 1, 2, 2, 2, 2, 2, 3, 0,
	0, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3, 3, 1, 1, 1, 1, 1, 1, 4, 0,
	0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
];
var tileset = null;
var floorTypes = {
	solid	: 0,
	path	: 1,
	water	: 2
};
var tileTypes = {
	0 : { colour:"#685b48", floor:floorTypes.solid, sprite:[{x:0,y:0,w:40,h:40}]	},
	1 : { colour:"#5aa457", floor:floorTypes.path,	sprite:[{x:40,y:0,w:40,h:40}]	},
	2 : { colour:"#e8bd7a", floor:floorTypes.path,	sprite:[{x:80,y:0,w:40,h:40}]	},
	3 : { colour:"#286625", floor:floorTypes.solid,	sprite:[{x:120,y:0,w:40,h:40}]	},
	4 : { colour:"#678fd9", floor:floorTypes.water,	sprite:[{x:160,y:0,w:40,h:40}]	}
};
var tileW = 40, tileH = 40;
var mapW = 20, mapH = 20;
var currentSecond = 0, frameCount = 0, framesLastSecond = 0, lastFrameTime = 0;
var keysDown = {37:false, 38:false, 39:false, 40:false}
var nr = 10

var viewport = {
	screen		: [0,0],
	startTile	: [nr,nr],
	endTile		: [nr,nr],
	offset		: [0,0],
	update		: function(px, py) {
		this.offset[0] = Math.floor((this.screen[0]/2) - px);
		this.offset[1] = Math.floor((this.screen[1]/2) - py);

        var tile = [ Math.floor(px/tileW), Math.floor(py/tileH) ];
        
        console.log('zzz', tile)

		this.startTile[0] = tile[0] - 1 - Math.ceil((this.screen[0]/2) / tileW);
		this.startTile[1] = tile[1] - 1 - Math.ceil((this.screen[1]/2) / tileH);

		if(this.startTile[0] < 0) { this.startTile[0] = 0; }
		if(this.startTile[1] < 0) { this.startTile[1] = 0; }

		this.endTile[0] = tile[0] + 1 + Math.ceil((this.screen[0]/2) / tileW);
		this.endTile[1] = tile[1] + 1 + Math.ceil((this.screen[1]/2) / tileH);

		if(this.endTile[0] >= mapW) { this.endTile[0] = mapW-1; }
		if(this.endTile[1] >= mapH) { this.endTile[1] = mapH-1; }
	}
};

var directions = {
	up		: 0,
	right	: 1,
	down	: 2,
	left	: 3
};

function rpg_game(props){
    var self = this;
    var player = new Character();
	
	this.ready = function(){
        self.createCanvas();
    }

    this.createCanvas = function(){
        ctx = document.getElementById('game').getContext("2d");
        requestAnimationFrame(drawGame);
        ctx.font = "bold 10pt sans-serif";

        window.addEventListener("keydown", function(e) {
            if(e.keyCode>=37 && e.keyCode<=40) { 
                keysDown[e.keyCode] = true; 
            }
        });
        window.addEventListener("keyup", function(e) {
            if(e.keyCode>=37 && e.keyCode<=40) { 
                keysDown[e.keyCode] = false; 
            }
        });

        viewport.screen = [document.getElementById('game').width, document.getElementById('game').height]; 
    }

    function drawGame(){
        if(ctx==null) { 
            return; 
        }

        var currentFrameTime = Date.now();
        var timeElapsed = currentFrameTime - lastFrameTime;
        var sec = Math.floor(Date.now()/1000);

        if(sec!=currentSecond){
            currentSecond = sec;
            framesLastSecond = frameCount;
            frameCount = 1;
        } else { 
            frameCount++; 
        }   

        if(!player.processMovement(currentFrameTime)){
            if(keysDown[38] && player.canMoveUp()){ 
                player.moveUp(currentFrameTime); 
            } else if(keysDown[40] && player.canMoveDown()){ 
                player.moveDown(currentFrameTime); 
            } else if(keysDown[37] && player.canMoveLeft()){ 
                player.moveLeft(currentFrameTime); 
            } else if(keysDown[39] && player.canMoveRight()){ 
                player.moveRight(currentFrameTime); 
            }
        }   

        // for(var y = 0; y < mapH; ++y){
        //     for(var x = 0; x < mapW; ++x){
        //         ctx.fillStyle = tileTypes[gameMap[toIndex(x,y)]].colour;
        //         ctx.fillRect( x*tileW, y*tileH, tileW, tileH);
        //     }
        // }
        
        viewport.update(player.position[0] + (player.dimensions[0]/2),	player.position[1] + (player.dimensions[1]/2));

        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, viewport.screen[0], viewport.screen[1]); 
        
        // console.log('viewport', viewport)

	    for(var y = viewport.startTile[1]; y <= viewport.endTile[1]; ++y){
		    for(var x = viewport.startTile[0]; x <= viewport.endTile[0]; ++x){
                // ctx.fillStyle = tileTypes[gameMap[toIndex(x,y)]].colour;
                // ctx.fillRect( viewport.offset[0] + (x*tileW), viewport.offset[1] + (y*tileH), tileW, tileH);
                var tile = tileTypes[gameMap[toIndex(x,y)]];
                ctx.drawImage(
                    tileset,
                    tile.sprite[0].x, tile.sprite[0].y, tile.sprite[0].w, tile.sprite[0].h,
                    viewport.offset[0] + (x*tileW), viewport.offset[1] + (y*tileH),
                    tileW, tileH
                );
            }
        }

        var sprite = player.sprites[player.direction];
        ctx.drawImage(
                tileset,
                sprite[0].x, sprite[0].y, sprite[0].w, sprite[0].h,
                viewport.offset[0] + player.position[0], viewport.offset[1] + player.position[1],
                player.dimensions[0], player.dimensions[1]
            );

        // ctx.fillStyle = "#ff0000";
        // ctx.fillText("FPS: " + framesLastSecond, 10, 20);

        // ctx.fillStyle = "#0000ff";
        // ctx.fillRect(player.position[0], player.position[1], player.dimensions[0], player.dimensions[1]);
        
        requestAnimationFrame(drawGame);
    }

    function Character(){
        var self = this;
        self.tileFrom	= [10,10];
        self.tileTo		= [10,10];
        self.timeMoved	= 0;
        self.dimensions	= [30,30];
        self.position	= [nr * tileW + 5, nr * tileH + 5];
        self.delayMove	= 100;

        self.placeAt = function(x, y){
            self.tileFrom = [x,y];
            self.tileTo	= [x,y];
            self.position = [
                ((tileW*x)+((tileW-self.dimensions[0])/2)),
                ((tileH*y)+((tileH-self.dimensions[1])/2))
            ];
        }

        self.processMovement = function(t){
            if(self.tileFrom[0]==self.tileTo[0] && self.tileFrom[1]==self.tileTo[1]) { 
                // console.log('aaa01')
                return false; 
            }
            if((t-self.timeMoved) >= self.delayMove){
                // console.log('aaa02', t, self.delayMove)
		        self.placeAt(self.tileTo[0], self.tileTo[1]);
	        } else {
                // console.log('aaa03')
                self.position[0] = (self.tileFrom[0] * tileW) + ((tileW-self.dimensions[0])/2);
                self.position[1] = (self.tileFrom[1] * tileH) + ((tileH-self.dimensions[1])/2);

                if(self.tileTo[0] != self.tileFrom[0]){
                    var diff = (tileW / self.delayMove) * (t-self.timeMoved);
                    self.position[0]+= (self.tileTo[0]<self.tileFrom[0] ? 0 - diff : diff);
                }
                if(self.tileTo[1] != self.tileFrom[1]){
                    var diff = (tileH / self.delayMove) * (t-self.timeMoved);
                    self.position[1]+= (self.tileTo[1]<self.tileFrom[1] ? 0 - diff : diff);
                }
                self.position[0] = Math.round(self.position[0]);
		        self.position[1] = Math.round(self.position[1]);
            }
            return true;
        }

        self.canMoveTo = function(x, y){
            console.log('tileTypes', tileTypes[gameMap[toIndex(x,y)]].floor, floorTypes.path)
            if(x < 0 || x >= mapW || y < 0 || y >= mapH) { 
                return false; 
            }
            if(tileTypes[gameMap[toIndex(x,y)]].floor!=floorTypes.path) { 
                return false; 
            }
            return true;
        }

        self.canMoveUp		= function() { return self.canMoveTo(self.tileFrom[0], self.tileFrom[1]-1); };
        self.canMoveDown 	= function() { return self.canMoveTo(self.tileFrom[0], self.tileFrom[1]+1); };
        self.canMoveLeft 	= function() { return self.canMoveTo(self.tileFrom[0]-1, self.tileFrom[1]); };
        self.canMoveRight 	= function() { return self.canMoveTo(self.tileFrom[0]+1, self.tileFrom[1]); };

        self.moveLeft	= function(t) { self.tileTo[0]-=1; self.timeMoved = t; self.direction = directions.left;};
        self.moveRight	= function(t) { self.tileTo[0]+=1; self.timeMoved = t; self.direction = directions.right;};
        self.moveUp     = function(t) { self.tileTo[1]-=1; self.timeMoved = t; self.direction = directions.up;};
        self.moveDown	= function(t) { self.tileTo[1]+=1; self.timeMoved = t; self.direction = directions.down;};

        self.direction	= directions.down;
        self.sprites = {};
        self.sprites[directions.up]		= [{x:0,y:120,w:30,h:30}];
        self.sprites[directions.right]	= [{x:0,y:150,w:30,h:30}];
        self.sprites[directions.down]	= [{x:0,y:180,w:30,h:30}];
        self.sprites[directions.left]	= [{x:0,y:210,w:30,h:30}];
    }

    function toIndex(x, y){
        return((y * mapW) + x);
    }
}

function Rpg() { 
    $( document ).ready(function() {
        // tileset = $('#my_tiles');
        // console.log('tileset1', tileset)
        // tileset.onload = function(){
        //     console.log('tileset2', tileset) 
        // }

        tileset = new Image();
        tileset.onload = function () {
            game = new rpg_game();
		    game.ready();
        }
        tileset.src = image;

        // game = new rpg_game();
		// game.ready();
    });

    return (
        <div className="rpg_container">
            <canvas id="game" width="600" height="400"></canvas>
            <img style={{display:'none'}} id="my_tiles" src={image} alt="image" />
        </div>
    );
  }
  
  export default Rpg;
  