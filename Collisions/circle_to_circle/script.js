
//Generate random number between a range
function generateRand(min, max) {
  return min + Math.random() * (max - min);
}

//Calculate distance between two points
function distance(x1,y1,x2,y2)
{
  const x_dist = x2-x1;
  const y_dist = y2-y1;
  return Math.sqrt(Math.pow(x_dist,2) + Math.pow(y_dist,2));
}

// Generate a random vector within a certain range of x and y values
function vector_Rand(minX,minY,maxX,maxY){
     return new Vector(
      generateRand(minX, maxX),
      generateRand(minY, maxY)
    );
}

//Vector class
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  
  //Vector addition
  static add(vector1, vector2) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
  }
  
  //Vector subtraction
  static sub(vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
  }
  
  //Calculate magnitude of a vector
  mag (){
    return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y,2));
  }
  
  //Vector multiplication
  static mult(vector, num) {
    return new Vector(vector.x * num, vector.y *num);
  }
  
  //Calculate a vector's tangent
  Tangent() {
    return new Vector(-this.y, this.x);
  }
  
  //Calculate dot product between two vectors
  dot_product(vector) {
    return this.x * vector.x + this.y * vector.y;
  }
  
  //Divison of a vector by a scalar value
  static divide (vector,num){
    return new Vector(vector.x / num, vector.y / num);
  }
  
  //Calculate a vector's unit vector
  static unit (vector){
    return Vector.divide(vector,vector.mag())
  }
  
}

//Ball class
class Ball {
  constructor(x, y,radius) {
    //Initialize position, velocity, acceleration
    this.pos = new Vector(x, y);
    this.vel = vector_Rand(-2,-2,2,2);
    this.acc = new Vector(0, 0);
    this.radius = radius;
  }
  
  //Update function that creates movement
  update() {
    this.pos = Vector.add(this.pos, this.vel);
    this.vel = Vector.add(this.vel, this.acc);
    this.acc = Vector.mult(this.acc, 0);
  }
  
  // In the event of a ball collision
  ball_coll(ball) {
    const vec = Vector.sub(this.pos, ball.pos);
    const distance = vec.mag();
    
    //Ball collision work with vectors
    if (distance <= this.radius + ball.radius) {
      const unit_norm = Vector.unit(vec);
      const unit_tan = unit_norm.Tangent();
      
      //Account for grouping of balls
      const correction = Vector.mult(unit_norm, this.radius + ball.radius);
      const correct_vector = Vector.add(ball.pos, correction);
      this.pos = correct_vector;
      
      const input_vec = this.vel;
      const ball_vec = ball.vel;

      const vector_norm = input_vec.dot_product(unit_norm);
      const ball_norm = ball_vec.dot_product(unit_norm);
      const vector_tan = input_vec.dot_product(unit_tan);
      const ball_tan = ball_vec.dot_product(unit_tan);

      const vector_norm_final = (vector_norm * (this.radius - ball.radius) +
        2 * ball.radius * ball_norm) / (this.radius + ball.radius);
      const ball_norm_final = (ball_norm * (ball.radius - this.radius) + 
        2 * this.radius * vector_norm) / (this.radius + ball.radius);

      const new_vector_norm = Vector.mult(unit_norm,vector_norm_final);
      const new_ball_norm = Vector.mult(unit_norm, ball_norm_final);
      const new_vector_tan = Vector.mult(unit_tan, vector_tan);
      const new_ball_tan = Vector.mult(unit_tan, ball_tan);

      const vector_final = Vector.add(new_vector_norm , new_vector_tan);
      const ball_final = Vector.add(new_ball_norm, new_ball_tan);
      
      //After collision velocities
      this.vel = vector_final;
      ball.vel = ball_final;
    }
  }
  
  //Detect edge collisions
  edges_col(width,height){
    if  (this.pos.x - this.radius <=0 || this.pos.x + this.radius >= width){
      this.vel.x = -this.vel.x;
    } else if (this.pos.y- this.radius <=0 || this.pos.y + this.radius >=  height){
      this.vel.y = -this.vel.y;
    }
  }
  }

//Canvas class
class Canvas {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    document.body.appendChild(this.canvas);
    this.canvas.width = 800;
    this.canvas.height = 800;
    this.main();
    
    //Update frame
    requestAnimationFrame(() => this.update());
  }
  
  //Function to create an array of balls
  main() {
    const ball_num = 100;
    this.ball_arr = [];
    
    //Generate balls of different radii and positions
    for (let i = 0; i < ball_num; i++) {
      let radius = generateRand(0,50);
      let x = generateRand(radius, this.canvas.width-radius);
      let y = generateRand(radius, this.canvas.height-radius);
      
      //Ensure that the balls do not overlap when generated
      if (i!==0){
           for (let j = 0; j < this.ball_arr.length; j++){
          if (distance (x,y,this.ball_arr[j].x, this.ball_arr[j].y) - radius * 2 < 0){
            x = generateRand(radius, this.canvas.width - radius);
            y = generateRand(radius, this.canvas.height - radius);
            j = -1;
          }
        }
      }   
      this.ball_arr.push(new Ball( x, y, radius));
    }
  }
  
  //Clear frame and draw the balls
  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  
   // Check for collisions
   for (let i = 0; i < this.ball_arr.length; i++){
     const current = this.ball_arr[i];
     const rest_arr = this.ball_arr.slice(i+1);
     
    for (let b of rest_arr){
      b.ball_coll(current);
    }
   }
  
    //Check for edge collisions
   for (let ball of this.ball_arr) {
     ball.update();
     ball.edges_col(this.canvas.width,this.canvas.height);
      
     //Draw the balls
      this.ctx.fillStyle = 'orange';
      this.ctx.beginPath();
      this.ctx.arc(
       ball.pos.x, 
       ball.pos.y,
       ball.radius,
        0, 
        2 * Math.PI
      );
      this.ctx.fill();
    }
    //Update frame
    requestAnimationFrame(() => this.update());
  }
}

//Run simulation
new Canvas();