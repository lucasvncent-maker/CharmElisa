import { shake } from "./effects.js";
import { showScene } from "./dialogue.js";
import { images } from "./assets.js";

let basket, objects, score, lives;
let running = false;
let particles = [];

const dialogueEl = document.getElementById("dialogue");
const choicesEl = document.getElementById("choices");
const sceneImage = document.getElementById("sceneImage");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 500;

export function startMiniGame() {
  canvas.style.display = "block";
  sceneImage.style.display = "none";
  choicesEl.innerHTML = "";
  dialogueEl.innerText = "";

  basket = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 60,
    width: 80,
    height: 20
  };

  objects = [];
  score = 0;
  lives = 3;
  running = true;

  gameLoop();
}

// contrôles
canvas.addEventListener("touchmove", (e) => {
  const rect = canvas.getBoundingClientRect();
  basket.x = e.touches[0].clientX - rect.left - basket.width / 2;
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  basket.x = e.clientX - rect.left - basket.width / 2;
});

function spawnObject() {
  const rand = Math.random();

  let type;
  if (rand < 0.5) type = "saucisson";
  else if (rand < 0.75) type = "banane";
  else type = "concombre";

  objects.push({
    x: Math.random() * (canvas.width - 40),
    y: 0,
    size: 40,
    speed: 2 + Math.random() * 2,
    type: type
  });
}

function update() {
  if (Math.random() < 0.1) {
  particles.push({
    x: Math.random() * canvas.width,
    y: canvas.height,
    size: Math.random() * 3,
    speed: 1 + Math.random()
  });
}

  particles.forEach((p, i) => {
    p.y -= p.speed;
    if (p.y < 0) particles.splice(i, 1);
  });

  if (Math.random() < 0.04) spawnObject();

  objects.forEach((obj, index) => {
    obj.y += obj.speed;

    if (
      obj.y + obj.size > basket.y &&
      obj.x < basket.x + basket.width &&
      obj.x + obj.size > basket.x
    ) {
      if (obj.type === "saucisson") {
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
  // background dégradé
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#ffd1dc");
  gradient.addColorStop(1, "#ffe6f0");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.font = "bold 18px Arial";

  // panier
  ctx.fillStyle = "#ff4d6d";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  // objets
  objects.forEach(obj => {
    let img;
    if (obj.type === "saucisson") img = images.imgSaucisson;
    if (obj.type === "banane") img = images.imgBanane;
    if (obj.type === "concombre") img = images.imgConcombre;

    ctx.drawImage(img, obj.x, obj.y, obj.size, obj.size);
  });

  // particules
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    });
  
  // score
  ctx.font = "bold 24px Verdana";   // plus grande et lisible
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.strokeText("Score : " + score, 10, 50);


  // ❤️ vies animées
  for (let i = 0; i < lives; i++) {
    let size = 25 + Math.sin(Date.now() / 200) * 3;
    ctx.drawImage(images.imgHeart, 250 + i * 30, 5, size, size);
  }
}

function gameLoop() {
  if (!running) return;

  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// =======================
// 🏆 RESULTATS
// =======================

function loseGame() {
  running = false;
  canvas.style.display = "none";
  sceneImage.style.display = "block";

  showScene(
    "Ecoute mon p'tit gars, concentre-toi si tu veux conquérir cette immense frappe qu'est Elisa !",
    "images/tonton.png",
    startMiniGame
  );
}

function winGame() {
  running = false;
  canvas.style.display = "none";
  sceneImage.style.display = "block";

  showScene(
    "Bien joué beau gosse 😏 Tu as assez de saucissons !",
    "images/tonton.png",
    () => alert("Suite bientôt 😄")
  );
}