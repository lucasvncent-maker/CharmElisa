const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 500;

let basket = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 50,
  width: 60,
  height: 20
};

let objects = [];
let score = 0;

// 🎯 Créer objets
function spawnObject() {
  objects.push({
    x: Math.random() * (canvas.width - 20),
    y: 0,
    size: 20,
    speed: 2 + Math.random() * 2
  });
}

// 🎮 Déplacement tactile
canvas.addEventListener("touchmove", (e) => {
  const rect = canvas.getBoundingClientRect();
  basket.x = e.touches[0].clientX - rect.left - basket.width / 2;
});

// 🎮 Déplacement souris (utile PC)
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  basket.x = e.clientX - rect.left - basket.width / 2;
});

// 🔄 Update
function update() {
  if (Math.random() < 0.03) spawnObject();

  objects.forEach((obj, index) => {
    obj.y += obj.speed;

    // collision
    if (
      obj.y + obj.size > basket.y &&
      obj.x < basket.x + basket.width &&
      obj.x + obj.size > basket.x
    ) {
      objects.splice(index, 1);
      score++;
      document.getElementById("score").innerText = "Score : " + score;

      if (score === 10) {
        document.getElementById("message").innerText =
          "🎉 Bravo mon amour ❤️ (suite bientôt 😏)";
      }
    }

    // hors écran
    if (obj.y > canvas.height) {
      objects.splice(index, 1);
    }
  });
}

// 🎨 Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // panier
  ctx.fillStyle = "#ff4d6d";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  // objets (cœurs simplifiés)
  ctx.fillStyle = "red";
  objects.forEach((obj) => {
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });
}

// 🔁 Loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();