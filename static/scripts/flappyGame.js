import { showScene } from "./dialogue.js";
import { images } from "./assets.js";
import { shake } from "./effects.js";

let bird, pipes, running, score;

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

  bird = {
    x: 80,
    y: 200,
    velocity: 0,
    gravity: 0.5,
    lift: -8,
    size: 40
  };

  pipes = [];
  score = 0;
  running = true;

  gameLoop();
}

function spawnPipe() {
  const gap = 120;
  const topHeight = Math.random() * 200 + 50;

  pipes.push({
    x: canvas.width,
    width: 50,
    top: topHeight,
    bottom: topHeight + gap,
    passed: false
  });
}

function update() {
  bird.velocity += bird.gravity;
  bird.y += bird.velocity;

  // spawn pipes
  if (Math.random() < 0.02) spawnPipe();

  pipes.forEach((pipe, index) => {
    pipe.x -= 3;

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

  if (score >= 10) winGame();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background ciel
  ctx.fillStyle = "#87CEEB";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // pipes
  ctx.fillStyle = "#4CAF50";
  pipes.forEach(pipe => {
    ctx.fillRect(pipe.x, 0, pipe.width, pipe.top);
    ctx.fillRect(pipe.x, pipe.bottom, pipe.width, canvas.height);
  });

  // chien 🐶
  ctx.drawImage(images.imgDog, bird.x, bird.y, bird.size, bird.size);

  // score stylé ✨
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
    "NOOOOON 😭 Le chien est tombé !!",
    "static/pictures/tonton.png",
    startFlappyGame
  );
}

function winGame() {
  running = false;

  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";

  showScene(
    "INCROYABLE 😍 Tu as sauvé le chien !!",
    "static/pictures/tonton.png",
    () => alert("Suite bientôt 😄")
  );
}