import { flappyGameAssets } from "./asset-loader.js";
import { shake } from "./effects.js";
import { showScene, step6 } from "./story-dialogue.js";

let bird, pipes, running, score;
let windParticles = [];
let lastTime = 0;
const DT_TARGET = 16.67; // Target 60fps

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 500;

document.addEventListener("pointerdown", () => {
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
    opacity: Math.random() * 0.5 + 0.2,
  }));

  bird = {
    x: 80,
    y: 200,
    velocity: 0,
    gravity: 500, // pixels per second squared
    lift: -200, // pixels per second
    size: 60,
  };

  pipes = [];
  score = 0;
  running = true;

  gameLoop();
}

function spawnPipe() {
  const gap = 200; // Space between top and bottom pipe
  const topHeight = Math.random() * 200 + 50;

  let width = 200;
  pipes.push({
    x: canvas.width,
    width: width,
    offset: 0.13 * width,
    top: topHeight,
    bottom: topHeight + gap,
    passed: false,
  });
}

function getMaxPipeX(pipesList) {
  let max = 0;
  for (let pipe of pipesList) {
    if (pipe.x > max) {
      max = pipe.x;
    }
  }
  return max;
}

function update(dt) {
  bird.velocity += (bird.gravity / 1000) * dt; // Apply gravity
  bird.y += (bird.velocity / 1000) * dt;

  if (getMaxPipeX(pipes) < canvas.width * 0.2) {
    if (Math.random() < 0.01) spawnPipe();
  }

  pipes.forEach((pipe, index) => {
    pipe.x -= (200 / 1000) * dt; // 200 pixels per second

    // AABB collision detection: check if bird overlaps pipe boundaries
    if (
      bird.x < pipe.x + pipe.width - pipe.offset &&
      bird.x + bird.size > pipe.x + pipe.offset &&
      (bird.y < pipe.top || bird.y + bird.size > pipe.bottom)
    ) {
      loseGame();
    }

    if (!pipe.passed && pipe.x + pipe.width < bird.x) {
      // Track score only once when bird successfully passes a pipe
      pipe.passed = true;
      score++;
    }

    if (pipe.x + pipe.width < 0) {
      pipes.splice(index, 1);
    }
  });

  if (bird.y > canvas.height || bird.y < 0) {
    loseGame();
  }

  windParticles.forEach((p) => {
    p.x -= p.speed;
    // Wrap particle back to right side for infinite scrolling effect
    if (p.x < 0) {
      p.x = canvas.width;
      p.y = Math.random() * canvas.height;
    }
  });

  if (score >= 20) winGame();
}

function gameLoop(now) {
  if (lastTime === 0) lastTime = now;
  const deltaTime = Math.min(now - lastTime, 50);
  lastTime = now;

  update(deltaTime);
  draw();
  if (running) {
    requestAnimationFrame(gameLoop);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#1e3c72");
  gradient.addColorStop(1, "#2a5298");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  windParticles.forEach((p) => {
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = "white";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.globalAlpha = 1;

  pipes.forEach((pipe) => {
    // Draw top pipe by vertically flipping the chocolate image
    ctx.save();
    ctx.scale(1, -1);
    ctx.drawImage(
      flappyGameAssets.chocolate,
      pipe.x,
      -pipe.top,
      pipe.width,
      pipe.top + 20,
    );
    ctx.restore();

    ctx.drawImage(
      flappyGameAssets.chocolate,
      pipe.x,
      pipe.bottom,
      pipe.width,
      canvas.height - pipe.bottom + 20,
    );
  });

  // Draw dog or fallback to circle if image not loaded
  if (flappyGameAssets.dog.complete) {
    ctx.drawImage(flappyGameAssets.dog, bird.x, bird.y, bird.size, bird.size);
  } else {
    ctx.fillStyle = "#FFD700";
    ctx.beginPath();
    ctx.arc(bird.x + bird.size / 2, bird.y + bird.size / 2, bird.size / 2, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = "gold";
  ctx.font = "bold 28px Arial";
  ctx.fillText(score, canvas.width / 2 - 10, 50);
}

function loseGame() {
  running = false;
  shake(10, 300);

  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";

  showScene(
    "Non ! Fayou a mangé du chocolat ! C'est toxique pour les chiens...",
    "src/assets/images/uncle-noel.png",
    startFlappyGame,
  );
}

function winGame() {
  running = false;

  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";

  showScene(
    "Incroyable ! Tu as sauvé Fayou !",
    "src/assets/images/uncle-noel.png",
    step6,
  );
}
