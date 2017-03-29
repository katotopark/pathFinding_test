function removeFromArray(arr, elt){
	for(var i = arr.length - 1 ; i >= 0 - 1; i--){
		if(arr[i] == elt){
			arr.splice(i, 1);
		}
	}
}
function heuristic(a, b){
	var d = createVector(a.i - b.i, a.j - b.j, a.k - b.k);
	return d;
}


var matrixSize = 7;

//unit stuff
var unitSize = 40;
var units_a = []
var units_b;
var img1, img2, img3;

var grid  = [];
var openSet = [];
var closedSet = [];
var start, end;
var path = [];

var a = 0;

function Unit(i, j, k){
	this.i = i;
	this.j = j;
	this.k = k;

	this.f = 0;
	this.g = 0;
	this.h = 0;

	this.neighbors = [];
	this.previous = undefined;


	this.show = function(col_){
		push();
		translate(i*unitSize, j*unitSize, k*unitSize);
		//texture(tex);
		ambientMaterial(col_);
		scale(1);
		box(unitSize);
		pop();
	}
	this.addNeighbors = function(grid){
		var i = this.i;
		var j = this.j;
		var k = this.k;

		if(i > 0)
			this.neighbors.push(grid[i-1][j][k]);
		if(i < matrixSize-1)
			this.neighbors.push(grid[i+1][j][k]);
		if(j > 0)
			this.neighbors.push(grid[i][j-1][k]);
		if(j < matrixSize-1)
		this.neighbors.push(grid[i][j+1][k]);
		if(k > 0)
			this.neighbors.push(grid[i][j][k-1]);
		if(k < matrixSize-1)
			this.neighbors.push(grid[i][j][k+1]);
	}
}

function setup() {
 	createCanvas(windowWidth, windowHeight, WEBGL);
 	frameRate(25);

	img1 = loadImage("assets/tex_base.jpg");
	img2 = loadImage("assets/texture2.jpg");//red
	img3 = loadImage("assets/texture3.jpg");//green

	for(var i = 0; i < matrixSize; i++){
		grid[i] = new Array(matrixSize);
		for(var j = 0; j < matrixSize; j++){
			grid[i][j] = new Array(matrixSize);
			for(var k = 0; k < matrixSize; k++){
				grid[i][j][k] = false;
			}
		}
	}

	for(var i = 0; i < matrixSize; i++){
		for(var j = 0; j < matrixSize; j++){
			for(var k = 0; k < matrixSize; k++){
				grid[i][j][k] = new Unit(i, j, k);
			}
		}
	}

	for(var i = 0; i < matrixSize; i++){
		for(var j = 0; j < matrixSize; j++){
			for(var k = 0; k < matrixSize; k++){
				grid[i][j][k].addNeighbors(grid);
			}
		}
	}

	start = grid[floor(random(matrixSize-1))][floor(random(matrixSize-1))][floor(random(matrixSize-1))];
	end = grid[floor(random(matrixSize-1))][floor(random(matrixSize-1))][floor(random(matrixSize-1))];

	openSet.push(start);
}

function draw() {
	background(20);
	ambientLight(235);
	orbitControl();
	rotateX(0);
	rotateY(a+=0.01);
	rotateZ(1);

	if(openSet.length > 0){
		//keep going
		var winner = 0;
		for(var i = 0; i < openSet.length; i++){
			if(openSet[i].f < openSet[winner].f){
				winner = i;
			}
		}
		var current = openSet[winner];

		//Find the path
		path = [];
		var temp = current;
		path.push(temp);
		while(temp.previous){
			path.push(temp.previous);
			temp = temp.previous;
		}

		if(current === end){
			//noLoop();
			console.log("DONE!");
		}

		removeFromArray(openSet, current);
		closedSet.push(current);

		var neighbors = current.neighbors;
		for(var i = 0; i < neighbors.length; i++){
			var neighbor = neighbors[i];

			if(!closedSet.includes(neighbor)){
				var tempG = current.g + 1;

				if(openSet.includes(neighbor)){
					if(tempG < neighbor.g){
						neighbor.g = tempG;
					}
				}else{
					neighbor.g = tempG;
					openSet.push(neighbor);
				}

				neighbor.h = heuristic(neighbor, end);
				neighbor.f = neighbor.g + neighbor.h;
				neighbor.previous = current;
			}
		}
	}else{
		console.log("FIN");
	}

	//raw grid
	for(var i = 0; i < matrixSize; i++){
		for(var j = 0; j < matrixSize; j++){
			for(var k = 0; k < matrixSize; k++){
				grid[i][j][k].show(color(150, 5));
			}
		}
	}

	//closed - red
	for(var i = 0; i < closedSet.length; i++){
		closedSet[i].show(color(255, 0, 100, 5));
	}

	//open - green
	for(var i = 0; i < openSet.length; i++){
		openSet[i].show(color(0, 255, 0, 20));
	}

	//path - blue
	for(var i = 0; i < path.length; i++){
		path[i].show(color(0, 100, 255, 120));
	}
}
