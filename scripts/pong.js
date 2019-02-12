var canvas = null;
var context = null;
var img = null;
var gBall = null;
var gLPaddle = null;
var gRPaddle = null;

var lastFrameTimeMs = 0;
var maxFPS = 60;
var timestep = 1.0 / maxFPS;
var delta = 0;

//\===================================================================
// Paddle class -- using prototype inheritance
//      Here a function is declared that has private functions with
//      the use of the 'this' keyword.
//      This function can have additional functions added to it's
//      prototype that can be called from an instance
//\===================================================================
function Paddle( a_x, a_y, a_w, a_h, a_fillColour, a_upKey, a_downKey){
    this.x = a_x;
    this.y = a_y;
    this.width = a_w;
    this.height = a_h;
    this.upKey = a_upKey;
    this.downKey = a_downKey;
    this.fillColour = a_fillColour;
    this.speed = 2.0;

 }

 Paddle.prototype.draw = function(){
    var halfWidth = this.width * 0.5;
    var halfHeight = this.height * 0.5;

    context.fillStyle = this.fillColour;
    context.beginPath();
    context.fillRect(this.x - halfWidth, this.y - halfHeight, this.width, this.height);
 }

 Paddle.prototype.update = function(deltaTime){
    var halfHeight = this.height * 0.5;

    if(Key.isDown(this.upKey)){
        var tempYPos = this.y - this.speed;
        if( tempYPos - halfHeight > 0){
            this.y = tempYPos;
        }
    }
    if(Key.isDown(this.downKey))
    {
        var tempYPos = this.y + this.speed;
        if( tempYPos + halfHeight < canvas.height){
            this.y = tempYPos;
        }
    }
 }
//\===================================================================
// Ball Class
//\===================================================================
class Ball
{
    constructor(a_x, a_y, a_radius, a_fillColour){
        this.x = a_x;
        this.xDir = 0;
        this.yDir = 0;
        this.y = a_y;
        this.radius = a_radius;
        this.velocity = 100.0;
        this.fillColour = a_fillColour;
    }

    init(){
        this.xDir = 0;
	    while( this.xDir === 0 ){
	        this.xDir = Math.floor((Math.random() * 3) - 1);
	    }
	    this.yDir = 0;
	    while( this.yDir === 0 ){
	        this.yDir = Math.floor((Math.random() * 3) - 1);
	    }
    }

    reset(){
        this.x = canvas.width * 0.5;
        this.y = canvas.height * 0.5;
        this.init();
    }

    draw(){
        context.fillStyle = this.fillColour;
        context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
		context.closePath();
		context.fill();
    }

    update(deltaTime){
        this.x += this.velocity * deltaTime * this.xDir;
        this.y += this.velocity * deltaTime * this.yDir;
        if( this.x >= canvas.width || this.x <= 0){
            this.reset();
        }
        if(this.y  > canvas.height || this.y < 0){
            this.yDir = -this.yDir;
        }

    }

    collisionTest( a_ux, a_uy, a_lx, a_ly){
        var halfWidth = this.width * 0.5;
        var halfHeight = this.height * 0.5;

        if( this.x - this.radius < a_lx && this.x + this.radius > a_ux){
            if( this.y - this.radius < a_ly && this.y + this.radius > a_uy){
                this.xDir = -this.xDir;
            }
        }
    }
}
//\===================================================================

function main(){
    setup();

    img = new Image();
    img.onload = onImageLoad;
    img.src = "./images/arknoid_pster_720x.jpg"
}

function onImageLoad(){
    console.log("Image Loaded!");
    context.drawImage(img, 10,10);
    requestAnimationFrame(mainloop);
}

function setup(){
    canvas = document.getElementById("main_canvas");
    context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 720;
    canvas.style = "border:1px solid #000000;";

    gBall = new Ball( canvas.width*0.5, canvas.height*0.5,20,"#000000");
    gBall.init();

    gLPaddle = new Paddle( 10,canvas.height*0.5,10,120,"#FF0000", Key.W, Key.S);
    gRPaddle = new Paddle( canvas.width -10,canvas.height*0.5,10,120,"#0000FF", Key.UP, Key.DOWN);
}

function mainloop( timestamp )
{
    delta = (timestamp - lastFrameTimeMs) * 0.001;
    lastFrameTimeMs = timestamp;

    gLPaddle.update(delta);
    gRPaddle.update(delta);
    gBall.update(delta);

    var halfWidth = gLPaddle.width * 0.5;
    var halfHeight = gLPaddle.height * 0.5;
    gBall.collisionTest(gLPaddle.x-halfWidth, gLPaddle.y-halfHeight, gLPaddle.x+halfWidth, gLPaddle.y+halfHeight);

    var halfWidth = gRPaddle.width * 0.5;
    var halfHeight = gRPaddle.height * 0.5;
    gBall.collisionTest(gRPaddle.x-halfWidth, gRPaddle.y-halfHeight, gRPaddle.x+halfWidth, gRPaddle.y+halfHeight);

    context.clearRect(0,0,canvas.width, canvas.height);
    gBall.draw();
    gLPaddle.draw();
    gRPaddle.draw();
    requestAnimationFrame(mainloop);
}

 //key handling for input
 var Key = {
    _pressed: {},

      W: 87,
      S: 83,  
      UP: 38,
      DOWN: 40,

      isDown: function(keyCode) {
        return this._pressed[keyCode];
      },

      onKeydown: function(event) {
        this._pressed[event.keyCode] = true;
      },

      onKeyup: function(event) {
        delete this._pressed[event.keyCode];
      }
};

window.addEventListener('keyup', function(event) { Key.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { Key.onKeydown(event); }, false);