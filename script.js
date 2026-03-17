const dialogueEl = document.getElementById("dialogue");
const choicesEl = document.getElementById("choices");
const sceneImage = document.getElementById("sceneImage");
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 350;
canvas.height = 500;

// =======================
// ✨ TYPEWRITER EFFECT
// =======================

let isTyping = false;
let fullText = "";
let currentAction = null;
let particles = [];

function shake(intensity = 5, duration = 300) {
  const game = document.getElementById("game");
  let start = Date.now();

  function animate() {
    let elapsed = Date.now() - start;

    if (elapsed < duration) {
      let x = (Math.random() - 0.5) * intensity;
      let y = (Math.random() - 0.5) * intensity;

      game.style.transform = `translate(${x}px, ${y}px)`;
      requestAnimationFrame(animate);
    } else {
      game.style.transform = "translate(0, 0)";
    }
  }

  animate();
}

function typeText(text, callback) {
  isTyping = true;
  fullText = text;
  dialogueEl.innerText = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      dialogueEl.innerHTML += text[i] === " " ? "&nbsp;" : text[i];
      i++;
      setTimeout(typing, 25);
    } else {
      isTyping = false;
      if (callback) callback();
    }
  }

  typing();
}

// clic pour skip ou continuer
document.addEventListener("pointerdown", () => {
  if (isTyping) {
    dialogueEl.innerText = fullText;
    isTyping = false;
  } else if (currentAction) {
    let action = currentAction;
    currentAction = null;

    setTimeout(() => {
      action();
    }, 50);
  }
});

// =======================
// 🎬 SYSTEME NARRATIF
// =======================

function showScene(text, image, next = null, choices = []) {
  canvas.style.display = "none";
  sceneImage.style.display = "block";
  sceneImage.src = image;

  choicesEl.innerHTML = "";

  // reset action
  currentAction = null;

  typeText(text, () => {
    if (choices.length > 0) {
      // afficher boutons
      choices.forEach(choice => {
        let btn = document.createElement("button");
        btn.innerText = choice.text;
        btn.onclick = choice.action;
        choicesEl.appendChild(btn);
      });
    } else {
      // autoriser le clic pour continuer
      currentAction = next;
    }
  });
}

// =======================
// 🎬 INTRO
// =======================

function startGame() {
  showScene("...", "images/black.jpg", step1);
}

function step1() {
  showScene("Réveille-toi !!!", "images/black.jpg", step2);

  setTimeout(() => {
    shake(10, 400);
  }, 100);
}

function step2() {
  showScene("Flemmard, arrête de dormir !!!", "images/black.jpg", step3);
}

function step3() {
  showScene(
    "Bonjour, jeune homme, je suis tonton Noël, ton fidèle conseiller.",
    "images/tonton.png",
    step4
  );
}

function step4() {
  showScene(
    "Aujourd'hui, tu vas devoir CONQUÉRIR LE COEUR D'ELISA !!!",
    "images/tonton.png",
    null,
    [
      { text: "Allons-y !", action: choix1 },
      { text: "Pourquoi la conquérir ?", action: choix2 }
    ]
  );
}

function choix1() {
  showScene(
    "Concentre-toi bien, c'est la femme LA PLUS PARFAITE DE L'UNIVERS.",
    "images/tonton.png",
    mission1
  );
}

function choix2() {
  showScene(
    "Parce que c'est la femme LA PLUS PARFAITE DE L'UNIVERS !!!",
    "images/tonton.png",
    mission1
  );
}

// =======================
// 🎯 MISSION
// =======================

function mission1() {
  showScene(
    "Ramasse uniquement ce qu'elle aime... fais attention !",
    "images/tonton.png",
    startMiniGame
  );
}

// =======================
// 🎮 MINI JEU
// =======================

let basket, objects, score, lives;
let running = false;

// images
const imgSaucisson = new Image();
imgSaucisson.src = "images/saucisson.jpg";

const imgHeart = new Image();
imgHeart.src = "images/heart.png";

const imgBanane = new Image();
imgBanane.src = "images/banane.png";

const imgConcombre = new Image();
imgConcombre.src = "images/concombre.jpg";

function startMiniGame() {
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

  // background dégradé
  let gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#ffd1dc");
  gradient.addColorStop(1, "#ffe6f0");
  ctx.fillStyle = gradient;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "bold 18px Arial";

  // panier
  ctx.fillStyle = "#ff4d6d";
  ctx.fillRect(basket.x, basket.y, basket.width, basket.height);

  // objets
  objects.forEach(obj => {
    let img;
    if (obj.type === "saucisson") img = imgSaucisson;
    if (obj.type === "banane") img = imgBanane;
    if (obj.type === "concombre") img = imgConcombre;

    ctx.drawImage(img, obj.x, obj.y, obj.size, obj.size);
  });

  // score stylé
  ctx.fillStyle = "rgba(255,255,255,0.7)";
    particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
    });
  ctx.font = "18px Arial";
  ctx.fillText("Score : " + score, 10, 25);

  // ❤️ vies animées
  for (let i = 0; i < lives; i++) {
    let size = 25 + Math.sin(Date.now() / 200) * 3;
    ctx.drawImage(imgHeart, 290 + i * 30, 5, size, size);
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
  showScene(
    "Ecoute mon p'tit gars, concentre-toi si tu veux conquérir cette immense frappe qu'est Elisa !",
    "images/tonton.png",
    startMiniGame
  );
}

function winGame() {
  running = false;
  showScene(
    "Bien joué beau gosse 😏 Tu as assez de saucissons !",
    "images/tonton.png",
    () => alert("Suite bientôt 😄")
  );
}

// START
startGame();