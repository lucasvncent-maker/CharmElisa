import { shootingGameAssets } from "./asset-loader.js";
import { showScene, step11 } from "./story-dialogue.js";

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
  y: canvas.height - 60,
  size: 20,
};

let cursor = { x: 0, y: 0, size: 30};

// Track mouse/touch position globally with proper scaling
document.addEventListener("mousemove", (e) => {
  if (!running) return;
  const rect = canvas.getBoundingClientRect();
  if (rect.width === 0) return;

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const canvasX = e.clientX - rect.left;
  const canvasY = e.clientY - rect.top;

  if (
    canvasX >= 0 &&
    canvasX <= rect.width &&
    canvasY >= 0 &&
    canvasY <= rect.height
  ) {
    cursor.x = canvasX * scaleX;
    cursor.y = canvasY * scaleY;
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

  if (
    canvasX >= 0 &&
    canvasX <= rect.width &&
    canvasY >= 0 &&
    canvasY <= rect.height
  ) {
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
      life: 20,
    });
  }

  shotEffects.push({
    x: cursor.x,
    y: cursor.y,
    life: 10,
  });

  bullets.push({
    x: cursor.x,
    y: cursor.y,
    radius: 5,
  });
}

function getSpawnLocation() {
  return canvas.width * Math.random();
}

// 👿 spawn ennemis
function spawnEnemy() {
  const enemyImages = [
    shootingGameAssets.man1,
    shootingGameAssets.man2,
    shootingGameAssets.man3
  ];

  enemies.push({
    x: getSpawnLocation(),
    y: 0,
    size: 18,
    speed: Math.random() * 1.5 + 1.3,
    img: enemyImages[Math.floor(Math.random() * enemyImages.length)],
  });
}

// Helper function for distance-based collision
function getDistance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

// 😊 spawn alliés
function spawnFriend() {
  const friendsImages = [
    shootingGameAssets.woman1,
    shootingGameAssets.woman2,
    shootingGameAssets.woman3
  ];
  friends.push({
    x: getSpawnLocation(),
    y: 0,
    size: 18,
    speed: Math.random() * 1 + 0.5,
    img: friendsImages[Math.floor(Math.random() * friendsImages.length)],
  });
}

function update() {
  if (!running) return;

  // Update particles - use filter instead of splice for safety
  particles = particles.filter((p) => {
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    return p.life > 0;
  });

  // Update shot effects - clean up expired effects
  shotEffects = shotEffects.filter((s) => {
    s.life--;
    return s.life > 0;
  });

  // Spawn enemies and friends
  if (Math.random() < 0.01) spawnEnemy();
  if (Math.random() < 0.005) spawnFriend();

  // Update grass animation (moved outside enemy loop for efficiency)
  grass.forEach((g) => {
    g.sway += 0.15;
  });

  // Update enemies and check collision with horse
  enemies = enemies.filter((e) => {
    const dx = horse.x - e.x;
    const dy = horse.y - e.y;
    const dist = getDistance(e.x, e.y, horse.x, horse.y);

    // Prevent division by zero
    if (dist === 0) return true;

    e.x += (dx / dist) * e.speed + (Math.random() - 0.5) * 3;
    e.y += (dy / dist) * e.speed + Math.random() * 0.9;

    // Check if enemy reached the horse
    if (dist < horse.size + e.size) {
      loseGame("Un des zhommes a atteint Arès, Elisa DETESTE LES ZHOMMES il faut absolument les en empêcher !!!");
      return false;
    }

    return true;
  });

  // Check bullet-enemy and bullet-friends collisions
  bullets = bullets.filter((b) => {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      const dist = getDistance(e.x, e.y, b.x, b.y);

      if (dist < e.size) {
        enemies.splice(i, 1);
      }
    }
    
    for (let i = friends.length - 1; i >= 0; i--) {
      const f = friends[i];
      const dist = getDistance(f.x, f.y, b.x, b.y);

      if (dist < f.size) {
        friends.splice(i, 1);
        score=0;
      }
    }
  });

  // Update friends and check collision with horse
  friends = friends.filter((f) => {
    const dx = horse.x - f.x;
    const dy = horse.y - f.y;
    const dist = getDistance(f.x, f.y, horse.x, horse.y);

    // Prevent division by zero
    if (dist === 0) return true;

    f.x += (dx / dist) * f.speed;
    f.y += (dy / dist) * f.speed;

    if (dist < horse.size + f.size) {
      spawnHearts(f.x, f.y);
      score ++;
      return false;
    }

    return true;
  });

  if (score >= 10) winGame();
}

function spawnHearts(x, y) {
  for (let i = 0; i < 8; i++) {
    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2,
      vy: Math.random() * -2 - 1,
      life: 60,
    });
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 🌿 fond herbe
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#3a7d44");
  gradient.addColorStop(1, "#2e5e2e");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // anim shot
  shotEffects.forEach((s) => {
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
  grass.forEach((g) => {
    const offset = Math.sin(g.sway) * 2;

    ctx.strokeStyle = g.color;
    ctx.beginPath();
    ctx.moveTo(g.x, g.y);
    ctx.lineTo(g.x + offset, g.y - g.size);
    ctx.stroke();
  });

  // cheval 🐴
  ctx.fillStyle = "white";
  ctx.beginPath();
  ctx.drawImage(
    shootingGameAssets.horse,
    horse.x - horse.size,
    horse.y - horse.size,
    horse.size * 2,
    horse.size * 4
);
  ctx.fill();

  // ennemis 👿
  enemies.forEach((e) => {
    ctx.drawImage(e.img, e.x - e.size,e.y - e.size, e.size * 2, e.size * 3);
  });

  // alliés 😊
  friends.forEach((f) => {
    ctx.drawImage(f.img, f.x - f.size, f.y - f.size, f.size * 2, f.size * 3);  
  });

  // curseur 🎯
  ctx.drawImage(shootingGameAssets.cursorImage, cursor.x - (cursor.size/2), cursor.y - (cursor.size/2), cursor.size, cursor.size);

  // score
  ctx.fillStyle = "gold";
  ctx.font = "14px Arial";
  ctx.fillText("Score: " + score, 10, 30);

  // particules
  particles.forEach((p) => {
    ctx.globalAlpha = p.life / 60;
    ctx.drawImage(shootingGameAssets.heart, p.x, p.y, 10, 10);
  });
  ctx.globalAlpha = 1;
}

function gameLoop() {
  update();
  draw();
  if (running) {
    requestAnimationFrame(gameLoop);
  }
}

function loseGame(message) {
  running = false;
  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";
  showScene(message, "src/assets/pictures/uncle-noel.png", startShootGame);
}

function winGame() {
  running = false;
  canvas.style.display = "none";
  document.getElementById("sceneImage").style.display = "block";
  showScene(
    "Super travail, tu t'es bien occupé de ces saletés d'italiens !! Euh je veux dire, de ces vilains p'tits gars !",
    "src/assets/pictures/uncle-noel.png",
    step11
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

  const greens = ["#4caf50", "#66bb6a", "#388e3c"];

  for (let i = 0; i < 25; i++) {
    const baseX = Math.random() * canvas.width;
    const baseY = Math.random() * canvas.height;

    const groupSize = 6 + Math.floor(Math.random() * 6);
    const groupColor = greens[Math.floor(Math.random() * greens.length)];
    for (let j = 0; j < groupSize; j++) {
      grass.push({
        x: baseX + (Math.random() - 0.5) * 10,
        y: baseY + (Math.random() - 0.5) * 5,
        color: groupColor,
        size: Math.random() * 6 + 6,
        sway: Math.random() * Math.PI,
      });
    }
  }

  gameLoop();
}
