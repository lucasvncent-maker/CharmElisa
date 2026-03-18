import { shake } from "./effects.js";
import { startFlappyGame } from "./flappy-game.js";
import { startMiniGame } from "./mini-game.js";
import { startShootGame } from "./shootGame.js";

let isTyping = false;
let currentAction = null;

document.addEventListener("pointerdown", () => {
  if (isTyping) {
    return;
  } else if (currentAction) {
    let action = currentAction;
    currentAction = null;

    setTimeout(() => {
      action();
    }, 50);
  }
});

export function showScene(text, image, next = null, choices = []) {
  const sceneImage = document.getElementById("sceneImage");
  sceneImage.style.display = "block";
  sceneImage.src = image;

  const choicesEl = document.getElementById("choices");
  choicesEl.innerHTML = "";

  currentAction = null;

  typeText(text, () => {
    if (choices.length > 0) {
      choices.forEach((choice) => {
        const btn = document.createElement("button");
        btn.innerText = choice.text;
        btn.onclick = choice.action;
        choicesEl.appendChild(btn);
      });
    } else {
      currentAction = next;
    }
  });
}

function typeText(text, callback) {
  isTyping = true;

  const dialogueEl = document.getElementById("dialogue");
  dialogueEl.innerText = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
      // Character by character reveal with slight delay for typing effect
      dialogueEl.innerHTML += text[i] === " " ? " " : text[i];
      i++;
      setTimeout(typing, 25);
    } else {
      isTyping = false;
      if (callback) callback();
    }
  }

  typing();
}

export function startStory() {
  showScene("...", "src/assets/images/background.jpg", step1);
}

function step1() {
  showScene("Réveille-toi !!!", "src/assets/images/background.jpg", step2);
  setTimeout(() => {
    shake(10, 400);
  }, 100);
}

function step2() {
  showScene(
    "Flemmard, arrête de dormir !!!",
    "src/assets/images/background.jpg",
    step3,
  );
}

function step3() {
  showScene(
    "Bonjour, jeune homme, je suis tonton Noël, ton fidèle conseiller.",
    "src/assets/images/uncle-noel.png",
    step4,
  );
}

function step4() {
  showScene(
    "Aujourd'hui, tu vas devoir CONQUÉRIR LE COEUR D'ELISA !!!",
    "src/assets/images/uncle-noel.png",
    null,
    [
      { text: "Allons-y !", action: chooseYes },
      { text: "Pourquoi la conquérir ?", action: chooseNo },
    ],
  );
}

function chooseYes() {
  showScene(
    "Concentre-toi bien, c'est la femme LA PLUS PARFAITE DE L'UNIVERS.",
    "src/assets/images/uncle-noel.png",
    startFirstMission,
  );
}

function chooseNo() {
  showScene(
    "Parce que c'est la femme LA PLUS PARFAITE DE L'UNIVERS gros NIGAUD !!!",
    "src/assets/images/uncle-noel.png",
    startFirstMission,
  );
}

function startFirstMission() {
  showScene(
    "Ramasse uniquement ce qu'elle aime... fais attention !",
    "src/assets/images/uncle-noel.png",
    startMiniGame,
  );
}

export function step5() {
  showScene(
    "OUAF OUAF !!",
    "src/assets/images/fayou.jpeg",
    introduceFayouProblem,
  );
}

function introduceFayouProblem() {
  showScene(
    "Oh non, quelqu'un a renversé du chocolat de partout, il faut protéger Fayou !!",
    "src/assets/images/fayou.jpeg",
    startSecondMission,
  );
}

function startSecondMission() {
  showScene(
    "Vite !! Sauve-le !!",
    "src/assets/images/fayou.jpeg",
    startFlappyGame,
  );
}

export function step6() {
  showScene(
    "Ares notre guerrier attend l'aide !",
    "src/assets/images/Ares.png",
    introduceAresProblem,
  );
}

function introduceAresProblem() {
  showScene(
    "Des ennemis attaquent ! Il faut le protéger !",
    "src/assets/images/Ares.png",
    startThirdMission,
  );
}

function startThirdMission() {
  showScene(
    "Défends le guerrier !!!",
    "src/assets/images/Ares.png",
    startShootGame,
  );
}
