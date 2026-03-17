import { showScene } from "./dialogue.js";
import { images2 } from "./assets.js";
import { shake } from "./effects.js";

let bird, pipes, running, score;
let windParticles = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 500;

canvas.addEventListener("pointerdown", () => {
  if (!running) return;
  bird.velocity = bird.lift;
});

export function startFlappyGame() {
  canvas.style.display = "block";
  document.getElementById("sceneImage").style.display = "none";
  document.getElementById("choices").innerHTML = "";
  document.getElementById("dialogue").innerText = "";

  windParticles = Array.from({ length: 40 }, () => ({
  x: Math.random() * canvas.width,
  y: Math.random() * canvas.height,
  speed: Math.random() * 2 + 1,
  size: Math.random() * 2 + 1,
  opacity: Math.random() * 0.5 + 0.2
  }));

  bird = {
    x: 80,
    y: 200,
    velocity: 0,
    gravity: 0.4,
    lift: -6,
    size: 60
  };

  pipes = [];
  score = 0;
  running = true;

  gameLoop();
}

function spawnPipe() {
  const gap = 200;
  const topHeight = Math.random() * 200 + 50;

  pipes.push({
    x: canvas.width,
    width: 200,
    top: topHeight,
    bottom: topHeight + gap,
    passed: false
  });
}

function get_max_x(pipes)  {
  let max_x = 0;
  for (let pipe of pipes) {
    if (pipe.x > max_x) {
      max_x = pipe.x;
    }
  }

  return max_x;
}


function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // spawn pipes
  if (get_max_x(pipes) < canvas.width*0.2) {
    if (Math.random() < 0.02) spawnPipe();
  }
  
  pipes.forEach((pipe, index) => {
    pipe.x -= 5;

    // collision
    if (
      bird.x < pipe.x + pipe.width &&
      bird.x + bird.size > pipe.x &&
      (bird.y < pipe.top || bird.y + bird.size > pipe.bottom)
    ) {
      loseGame();
    }

    // score
    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      pipe.passed = true;
      score++;
    }

    // remove
    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
    }
  });

  // sol / plafond
  if (bird.y > canvas.height || bird.y < 0) {
    loseGame();
  }

  // vent
  windParticles.forEach(p => {
  p.x -= p.speed;

  if (p.x < 0) {
    p.x = canvas.width;
    p.y = Math.random() * canvas.height;
  }
});

  if (score >= 20) winGame();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🌅 background (EN PREMIER)
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1e3c72");
  gradient.addColorStop(1, "#2a5298");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🌪️ effet traînée (léger)
  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 🌬️ particules
  windParticles.forEach(p => {
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = "white";

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;

  // 🍫 pipes
  pipes.forEach(pipe => {

    // 🔼 haut
    ctx.save();
    ctx.scale(1, -1);

    ctx.drawImage(
      images2.imgChocolate,
      pipe.x,
      -pipe.top,
      pipe.width,
      pipe.top + 20
    );

    ctx.restore();

    // 🔽 bas
    ctx.drawImage(
      images2.imgChocolate,
      pipe.x,
      pipe.bottom,
      pipe.width,
      canvas.height - pipe.bottom + 20
    );
  });

  // 🐶 chien
  ctx.drawImage(
    images2.imgDog,
    bird.x,
    bird.y,
    bird.size,
    bird.size
  );

  // ✨ score
  ctx.fillStyle = "gold";
  ctx.font = "bold 28px Arial";
  ctx.fillText(score, canvas.width / 2 - 10, 50);
}

function gameLoop() {
  if (!running) return;

  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function loseGame() {
  running = false;
  shake(10, 300);

  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";

  showScene(
    "NOOOOON 😭 Fayou a mangé du chocolat !! C'est toxique pour les chiens...",
    "static/pictures/tonton.png",
    startFlappyGame
  );
}

function winGame() {
  running = false;

  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";

  showScene(
    "INCROYABLE 😍 Tu as sauvé Fayou !!",
    "static/pictures/tonton.png",
    () => alert("Suite bientôt 😄")
  );
}