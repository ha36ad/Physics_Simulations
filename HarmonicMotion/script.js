const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

window.addEventListener("resize", function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});


class Circle {
  constructor(){
    this.size = 20;
    this.x = canvas.width - this.size;
    this.y = canvas.height - 200;
    this.mass = 10;
    this.velocity = 0.0;
    this.acceleration = 0.0;
  }
  draw() {
    ctx.beginPath();
    ctx.strokeStyle = "black";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.moveTo(this.x, 0);
    ctx.lineTo(this.x, this.y - this.size);
    ctx.lineWidth = 3;
    ctx.stroke();
  }
  // Acceleration calculation
  AccelCalc(position, spring) {
    return -( spring / this.mass) * position;
  }
  // Velocity calculation
  VelCalc(acceleration, time){
    return this.velocity + time * acceleration;
  }
  // New position
  UpdatePosition(time){
    return this.x + time * this.velocity;
  }
  update(time, spring){
    var accel = this.AccelCalc(this.x, spring);
    this.velocity = this.VelCalc(accel, time);
    this.x = this.UpdatePosition(time);
    if (this.x < 0 || this.y > canvas.height) {
      this.velocity *= -1;
    }
    if (this.x + this.size > canvas.width) {
      this.velocity *= -1;
      console.log(this.x);
    }
  }
}

function animate(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  circle.draw();
  circle.update(InitialTime, SpringConst);
  requestAnimationFrame(animate);
}

const circle = new Circle();
var InitialTime = 0.0024;
var SpringConst = 100.00;

function main(){
  animate();
}

main();