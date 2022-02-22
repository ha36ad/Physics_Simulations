const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const ParticlesArray = [];
let hue = 0;
const mouse = {
  x: undefined,
  y: undefined
};

class Particle {
  constructor() {
    this.x = mouse.x;
    this.y = mouse.y;
    this.size = Math.random() * 5 + 1;
  }

  update() {
    this.x += Math.floor(Math.random() * 5 + 1);
    this.y += Math.floor(Math.random() * 5 + 1);
    if (this.size > 0.1) {
      this.size -= 0.1;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = "hsl(" + hue + " , 100%, 50%)";
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

window.addEventListener("resize", function () {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

canvas.addEventListener("mousemove", function (event) {
  mouse.x = event.x;
  mouse.y = event.y;
  for (let i = 0; i < 10; ++i) {
    ParticlesArray.push(new Particle());
  }
});

function UpdateParticles() {
  for (let i = 0; i < ParticlesArray.length; ++i) {
    ParticlesArray[i].update();
    ParticlesArray[i].draw();
    if (ParticlesArray[i].size <= 0) {
      ParticlesArray.splice(i, 1);
      --i;
    }
  }
}

function animate() {
  ctx.fillStyle = "rgba(0,0,0,0,0.3)";
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  UpdateParticles();
  hue += 0.5;
  requestAnimationFrame(animate);
}

animate();
