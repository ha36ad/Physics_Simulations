function generateRand(min, max) {
  return min + Math.random() * (max - min);
}

function distance(x1,y1,x2,y2)
{
  const x_dist = x2-x1;
  const y_dist = y2-y1;
  return Math.sqrt(Math.pow(x_dist,2) + Math.pow(y_dist,2));
}

function vector_Rand(minX,minY,maxX,maxY){
     return new Vector(
      generateRand(minX, maxX),
      generateRand(minY, maxY)
    );
}

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  static add(vector1, vector2) {
    return new Vector(vector1.x + vector2.x, vector1.y + vector2.y);
  }
  
  static sub(vector1, vector2) {
    return new Vector(vector1.x - vector2.x, vector1.y - vector2.y);
  }
  
  static mult(vector, scalar) {
    return new Vector(vector.x * scalar, vector.y * scalar);
  } 
}

class Ball {
  constructor(x, y,radius) {
    this.pos = new Vector(x, y);
    this.vel = vector_Rand(-1,-1,1,1);
    this.acc = new Vector(0, 0);
    this.radius =radius;
  }
  update() {
    this.pos = Vector.add(this.pos, this.vel);
    this.vel = Vector.add(this.vel, this.acc);
    this.acc = Vector.mult(this.acc, 0);
  }
  
  edges_col(width,height){
    if  (this.pos.x - this.radius <=0 || this.pos.x + this.radius >= width){
      this.vel.x = -this.vel.x;
    } else if (this.pos.y- this.radius <=0 || this.pos.y + this.radius >=  height){
      this.vel.y = -this.vel.y;
    }
  }
  }

class Canvas {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');

    document.body.appendChild(this.canvas);

    this.canvas.width = 800;
    this.canvas.height = 800;
    this.setup();

    requestAnimationFrame(() => this.update());
  }
  setup() {
    const ball_num = 2;
    this.ball_arr = [];

    for (let i = 0; i < ball_num; i++) {
      let radius = generateRand(0,50);
      let x = generateRand(radius, this.canvas.width-radius);
      let y = generateRand(radius, this.canvas.height-radius);
      
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
  
  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

   for (let ball of this.ball_arr) {
     ball.update();
     ball.edges_col(this.canvas.width,this.canvas.height);

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

    requestAnimationFrame(() => this.update());
  }
}

new Canvas();