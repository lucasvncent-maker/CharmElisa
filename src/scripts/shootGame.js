import { shootingGameAssets } from "./asset-loader.js";
import { showScene } from "./story-dialogue.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 500;

let enemies = [];
let friends = [];
let bullets = [];
let particles = [];
let grass = [];
let shotEffects = [];
let score = 0;
let running = true;

const horse = {
  x: canvas.width / 2,
  y: 60,
  size: 20
};

let cursor = { x: 0, y: 0 };

let isAiming = false;

// Track mouse/touch position globally with proper scaling
document.addEventListener("mousemove", (e) => {
  if (!running) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;
  
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const canvasX = e.clientX - rect.left;
  const canvasY = e.clientY - rect.top;
  
  if (canvasX >= 0 && canvasX <= rect.width && canvasY >= 0 && canvasY <= rect.height) {
    cursor.x = canvasX * scaleX;
    cursor.y = canvasY * scaleY;
    isAiming = true;
  }
});

document.addEventListener("touchmove", (e) => {
  if (!running) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;
  
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  
  const canvasX = e.touches[0].clientX - rect.left;
  const canvasY = e.touches[0].clientY - rect.top;
  
  if (canvasX >= 0 && canvasX <= rect.width && canvasY >= 0 && canvasY <= rect.height) {
    cursor.x = canvasX * scaleX;
    cursor.y = canvasY * scaleY;
  }
});

document.addEventListener("pointerdown", () => {
  if (!running) return;
  shot();
});

function shot() {
  for (let i = 0; i < 6; i++) {
    particles.push({
      x: cursor.x,
      y: cursor.y,
      vx: (Math.random() - 0.5) * 4,
      vy: (Math.random() - 0.5) * 4,
      life: 20
    });
  }

  shotEffects.push({
    x: cursor.x,
    y: cursor.y,
    life: 10
  });

  bullets.push({
    x: cursor.x,
    y: cursor.y,
    radius: 5
  });
}

// 👿 spawn ennemis
function spawnEnemy() {
  const side = Math.random() < 0.5 ? "left" : "right";
  const offset = Math.random() * (canvas.width * 0.1);

  enemies.push({
    x: side === "left" ? offset : canvas.width - offset,
    y: canvas.height,
    size: 12,
    speed: Math.random() * 2 + 1
  });
}

// 😊 spawn alliés
function spawnFriend() {
  const side = Math.random() < 0.5 ? "left" : "right";
  const offset = Math.random() * (canvas.width * 0.1);

  friends.push({
    x: side === "left" ? offset : canvas.width - offset,
    y: canvas.height,
    size: 12,
    speed: Math.random() * 2 + 1
  });
}

function update() {
    if (!running) return;

    particles.forEach((p, i) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;

    if (p.life <= 0) particles.splice(i, 1);
    });

    // spawn
    if (Math.random() < 0.02) spawnEnemy();
    if (Math.random() < 0.01) spawnFriend();

    // ennemis
    enemies.forEach((e, i) => {

    const dx = horse.x - e.x;
    const dy = horse.y - e.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    e.x += (dx / dist) * e.speed + (Math.random() - 0.5) * 3;
    e.y += (dy / dist) * e.speed + (Math.random()) * 0.9;

    // atteint le cheval
    if (dist < horse.size) {
        loseGame("Un ennemi a atteint le cheval 😱");
    }

    // animation herbe
    grass.forEach(g => {
      g.sway += 0.05;
    });

    // collision tir
    bullets.forEach((b, bi) => {
      const dx = e.x - b.x;
      const dy = e.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < e.size) {
        enemies.splice(i, 1);
        bullets.splice(bi, 1);
        score++;
      }
    });
  });

  // alliés
  friends.forEach((f, i) => {

  const dx = horse.x - f.x;
  const dy = horse.y - f.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  f.x += (dx / dist) * f.speed;
  f.y += (dy / dist) * f.speed;

  if (dist < horse.size) {
  spawnHearts(f.x, f.y);
  friends.splice(i, 1);
 }

  // collision tir
});

  // nettoyer bullets
  bullets = [];

  if (score >= 10) winGame();
}

function spawnHearts(x, y) {
  for (let i = 0; i < 8; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * -2 - 1,
      life: 60
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🌿 fond herbe
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#3a7d44");
  gradient.addColorStop(1, "#2e5e2e");
  const greens = ["#4caf50", "#66bb6a", "#388e3c"];

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // anim shot
  shotEffects.forEach(s => {
    const radius = (10 - s.life) * 2;

    ctx.globalAlpha = s.life / 10;

    // cercle flash
    ctx.beginPath();
    ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "yellow";
    ctx.stroke();

    // petit centre
    ctx.beginPath();
    ctx.arc(s.x, s.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = "white";
    ctx.fill();
  });

  ctx.globalAlpha = 1;

  // anim grass
  grass.forEach(g => {
    const offset = Math.sin(g.sway) * 2;

    ctx.strokeStyle = greens[Math.floor(Math.random() * greens.length)];
    ctx.beginPath();
    ctx.moveTo(g.x, g.y);
    ctx.lineTo(g.x + offset, g.y - g.size);
    ctx.stroke();
  });

  // cheval 🐴
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.arc(horse.x, horse.y, horse.size, 0, Math.PI * 2);
  ctx.fill();

  // ennemis 👿
  ctx.fillStyle = "red";
  enemies.forEach(e => {
    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // alliés 😊
  ctx.fillStyle = "green";
  friends.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
    ctx.fill();
  });

  // curseur 🎯
  ctx.strokeStyle = "yellow";
  ctx.beginPath();
  ctx.arc(cursor.x, cursor.y, 15, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
    ctx.moveTo(cursor.x - 12, cursor.y);
    ctx.lineTo(cursor.x + 12, cursor.y);
    ctx.moveTo(cursor.x, cursor.y - 12);
    ctx.lineTo(cursor.x, cursor.y + 12);
  ctx.stroke();

  // score
  ctx.fillStyle = "gold";
  ctx.font = "14px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // particules
  particles.forEach(p => {
  ctx.globalAlpha = p.life / 60;
  ctx.drawImage(
    shootingGameAssets.heart,
    p.x,
    p.y,
    10,
    10
  );
});
ctx.globalAlpha = 1;
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function loseGame(message) {
  running = false;
  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";
  showScene(message, "src/assets/images/uncle-noel.png");
}

function winGame() {
  running = false;
  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";
  showScene(
    "Bravo ! Tu as défendu le guerrier !",
    "src/assets/images/Ares.png",
    () => {
      showScene(
        "Tu as conquis le coeur d'Elisa !",
        "src/assets/images/background.jpg",
      );
    },
  );
}

export function startShootGame() {
  canvas.style.display = "block";
  document.getElementById("sceneImage").style.display = "none";
  document.getElementById("choices").innerHTML = "";
  document.getElementById("dialogue").innerText = "";

  // Reset game state
  enemies = [];
  friends = [];
  bullets = [];
  particles = [];
  grass = [];
  shotEffects = [];
  score = 0;
  running = true;

  for (let i = 0; i < 25; i++) {
    const baseX = Math.random() * canvas.width;
    const baseY = Math.random() * canvas.height;

    const groupSize = 4 + Math.floor(Math.random() * 2);

    for (let j = 0; j < groupSize; j++) {
      grass.push({
        x: baseX + (Math.random() - 0.5) * 10,
        y: baseY + (Math.random() - 0.5) * 5,
        size: Math.random() * 6 + 6,
        sway: Math.random() * Math.PI
      });
    }
  }

  gameLoop();
}
