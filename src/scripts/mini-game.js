import { miniGameAssets } from "./asset-loader.js";
import { shake } from "./effects.js";
import { showScene, step5 } from "./story-dialogue.js";

let basket, objects, score, lives;
let running = false;
let particles = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 500;

// Track mouse position globally
document.addEventListener("mousemove", (e) => {
  if (!running) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;

  // Calculate position within canvas bounds
  const canvasX = e.clientX - rect.left;
  if (canvasX >= 0 && canvasX <= rect.width) {
    // Scale from visual to logical coordinates
    const scaleX = canvas.width / rect.width;
    const logicalX = canvasX * scaleX;
    basket.x = Math.max(
      0,
      Math.min(logicalX - basket.width / 2, canvas.width - basket.width),
    );
  }
});

document.addEventListener("touchmove", (e) => {
  if (!running) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;

  // Calculate position within canvas bounds
  const canvasX = e.touches[0].clientX - rect.left;
  if (canvasX >= 0 && canvasX <= rect.width) {
    // Scale from visual to logical coordinates
    const scaleX = canvas.width / rect.width;
    const logicalX = canvasX * scaleX;
    basket.x = Math.max(
      0,
      Math.min(logicalX - basket.width / 2, canvas.width - basket.width),
    );
  }
});

export function startMiniGame() {
  canvas.style.display = "block";
  document.getElementById("sceneImage").style.display = "none";
  document.getElementById("choices").innerHTML = "";
  document.getElementById("dialogue").innerText = "";

  basket = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 60,
    width: 80,
    height: 20,
  };

  objects = [];
  score = 0;
  lives = 3;
  running = true;

  gameLoop();
}

function spawnObject() {
  const rand = Math.random();
  let type;

  // Distribution: 50% sausage (good), 25% banana (bad), 25% cucumber (bad)
  if (rand < 0.5) {
    type = "sausage";
  } else if (rand < 0.75) {
    type = "banana";
  } else {
    type = "cucumber";
  }

  objects.push({
    x: Math.random() * (canvas.width - 40),
    y: 0,
    size: 40,
    speed: 4 + Math.random() * 3,
    type: type,
  });
}

function update() {
  if (Math.random() < 0.1) {
    particles.push({
      x: Math.random() * canvas.width,
      y: canvas.height,
      size: Math.random() * 3,
      speed: 1 + Math.random(),
    });
  }

  particles.forEach((p, i) => {
    p.y -= p.speed;
    if (p.y < 0) particles.splice(i, 1);
  });

  if (Math.random() < 0.08) spawnObject();

  objects.forEach((obj, index) => {
    obj.y += obj.speed;

    // AABB collision detection: check if object is caught by basket
    if (
      obj.y + obj.size > basket.y &&
      obj.x < basket.x + basket.width &&
      obj.x + obj.size > basket.x &&
      obj.y < basket.y + basket.height
    ) {
      if (obj.type === "sausage") {
        score++;
      } else {
        lives--;
        shake(8, 200);
      }
      objects.splice(index, 1);
    }

    if (obj.y > canvas.height) {
      objects.splice(index, 1);
    }
  });

  if (score >= 20) winGame();
  if (lives <= 0) loseGame();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#ffd1dc");
  gradient.addColorStop(1, "#ffe6f0");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ff4d6d";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  objects.forEach((obj) => {
    let img;
    if (obj.type === "sausage") img = miniGameAssets.sausage;
    else if (obj.type === "banana") img = miniGameAssets.banana;
    else if (obj.type === "cucumber") img = miniGameAssets.cucumber;

    ctx.drawImage(img, obj.x, obj.y, obj.size, obj.size);
  });

  particles.forEach((p) => {
    ctx.fillStyle = "#ff69b4";
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.font = "bold 24px Verdana";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.strokeText("Score: " + score, 20, 20);

  for (let i = 0; i < lives; i++) {
    // Animate heart size using sine wave for pulsing effect
    const size = 25 + Math.sin(Date.now() / 200) * 3;
    ctx.drawImage(miniGameAssets.heart, 250 + i * 30, 5, size, size);
  }
}

function gameLoop() {
  update();
  draw();
  if (running) {
    requestAnimationFrame(gameLoop);
  }
}

function loseGame() {
  running = false;
  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";

  showScene(
    "Ecoute mon p'tit gars, concentre-toi si tu veux conquérir cette immense frappe qu'est Elisa !",
    "src/assets/images/uncle-noel.png",
    startMiniGame,
  );
}

function winGame() {
  running = false;
  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";

  showScene(
    "Bien joué beau gosse ! Tu as assez de saucissons !",
    "src/assets/images/uncle-noel.png",
    step5,
  );
}
