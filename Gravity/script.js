var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
r = 30;
A = Math.Pi * r * r / 10000;
grav = 9.81;
mass = 0.5;
width = 800;
height = 800;

//Calculate velocity using Velocity Verlet Integration, accounting for air resistance
function Circle (x,y,ay,vy,fy,radius) {
  this.x = x;
  this.y = y;
  this.fy = fy;
  this.radius = radius;
  this.vy = vy;
  this.ay = ay;
 
  //Update function (draw next)
  this.update = function()
  {
    // weight force
    this.fy += grav* mass; 
    // air resistance force
    this.fy += -1 *0.5 * 1.20*0.44*this.vy**2; 
    // y-component of vector
    dy = this.vy * 0.02 + ( 0.42 * this.ay * 0.02 ** 2);
    
    this.y += dy *100;
    
    //Calcuate new acceleration
    new_accel= this.fy / m;
    //Caclulate average acceleration
    avg_accel = 0.5 * (new_accel + this.ay);
    //Calculate new velocity
    this.vy += avg_accel * 0.02;    
    
    //Check if circle has reached the bottom
    if (this.y + this.radius > height && this.vy > 0)
      {
       this.vy *= -0.02;
       this.y = height-this.radius;
      }
       this.draw(); 
  }
  
  //Draw the object
  this.draw = function() {
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
  }
}

//create ball loop
var circle;
function createCircle () {
circle = new Circle(width/2,0,0,0,0,r,'orange');
}

//animate loop
function animate()
{
  ctx.clearRect(0,0,width,height);
  requestAnimationFrame(animate);
  circle.update(); 
}

//Run the program
createCircle();
animate();
