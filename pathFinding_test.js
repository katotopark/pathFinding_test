var matrixSize = 5;
var locations = new Array(matrixSize);
var locBool = new Array(matrixSize);

//unit stuff
var unitSize = 40;
var units_a = []
var units_b;

function setup() {
 	createCanvas(windowWidth, windowHeight, WEBGL);

	//3D array of location vectors & booleans
	for(var i = 0; i < locations.length; i++){
		locations[i] = new Array(matrixSize);
		locBool[i] = new Array(matrixSize);
		for(var j = 0; j < locations[i].length; j++){
			locations[i][j] = new Array(matrixSize);
			locBool[i][j] = new Array(matrixSize);
			for(var k = 0; k < locations[i][j].length; k++){
				locations[i][j][k] = 
				createVector(i*unitSize, j*unitSize, k*unitSize);
				locBool[i][j][k] = false;
			}
		}
	}

	//base units
	var threshold = 2; //decides on the percentage to be initialized
	for (var i = 0; i < matrixSize; i++) {
		for(var j = 0; j < matrixSize; j++){
			for(var k = 0; k < matrixSize; k++){
				stateRndm = random(10);
				if(stateRndm <= threshold){
					state = 1;
					locBool[i][j][k] = true;
				}else{
					state = 0
				}
				units_a.push(new UnitOne(
					i*unitSize,j*unitSize,k*unitSize, state));
			}
		}
	}
	units_b = new UnitTwo(); 
}

function draw() {
	background(20);
	ambientLight(235);
	orbitControl();
	rotateX(10);
	rotateY(-10);
	rotateZ(0);

	//center the window and display the units
	push();
	translate(-unitSize*matrixSize/2, -unitSize*matrixSize/2, 0);
	for(var i = 0; i < units_a.length; i++){
		units_a[i].display();
	}
	units_b.display();
	units_b.update();
	units_b.move();
	pop();
}

function UnitOne (x, y, z, state){
	this.x = x;
	this.y = y;
	this.z = z;
	this.state = state;

	//this.img = loadImage("assets/tex_1.jpg");

	//basic movement parameters
	this.acceleration = createVector();
	this.velocity = createVector();
	this.location = createVector(this.x, this.y, this.z);


	this.update = function(){
		this.velocity.add(this.acceleration);
		this.location.add(this.velocity);
		this.acceleration.mult(0);
	}

	this.display = function(){
		if(this.state == 1){
			push();
			scale(1);
			//texture(this.img);
			ambientMaterial(50, 200, 100, 20);
			translate(this.x, this.y, this.z);
			box(unitSize);
			pop();
		}
	}
}

function UnitTwo() {
	//assign random initial location
	this.selector;
	for(var i = 0; i < locations.length; i++){
		for(var j = 0; j < locations[i].length; j++){
			for(var k = 0; k < locations[i][j].length; k++){
				this.selector = createVector(
					floor(random(i))*unitSize, 
					floor(random(j))*unitSize, 
					floor(random(k))*unitSize);
			}
		}
	}
	print(this.selector);

	//assign random target 
	this.targetSelector;
	for(var i = 0; i < locations.length; i++){
		for(var j = 0; j < locations[i].length; j++){
			for(var k = 0; k < locations[i][j].length; k++){
				this.targetSelector = createVector(
					floor(random(i))*unitSize, 
					floor(random(j))*unitSize, 
					floor(random(k))*unitSize);
			}
		}
	}
	print(this.targetSelector);

	//basic movement parameters
	this.location = createVector(
					this.selector.x,
					this.selector.y,
					this.selector.z);
	this.acceleration = createVector();
	this.velocity = createVector();

	this.maxSpeed = 1;
	this.maxForce = 2;

	//this.img = loadImage("assets/tex_2.jpg");

	this.display = function(){
		push();
		//texture(this.img);
		ambientMaterial(200, 100, 40);
		translate(this.location.x, 
				this.location.y, this.location.z);
		scale(1);
		box(unitSize);
		pop();
	}

	this.update = function(){
		this.velocity.add(this.acceleration);
		this.location.add(this.velocity);
		this.acceleration.mult(0);
	}
}

UnitTwo.prototype.move = function(){
	var target = createVector(this.targetSelector.x,
							  this.targetSelector.y,
							  this.targetSelector.z);
	var desired = p5.Vector.sub(target, this.location);

	var d = desired.mag();

	//check the distance to slow down
	if (d < unitSize/2)
		desired.setMag(this.maxSpeed/2);
	else
		desired.setMag(this.maxSpeed);
	
	var steer = p5.Vector.sub(desired, this.velocity);
	steer.limit(this.maxForce);
	this.acceleration.add(steer);
}
