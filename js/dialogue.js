import { startMiniGame } from "./minigame.js";
import { shake } from "./effects.js";
import { startFlappyGame } from "./flappyGame.js";


let isTyping = false;
let fullText = "";
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
  //canvas.style.display = "none";
  sceneImage.style.display = "block";
  sceneImage.src = image;

  const choicesEl = document.getElementById("choices");
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

function typeText(text, callback) {
  isTyping = true;
  fullText = text;

  const dialogueEl = document.getElementById("dialogue");
  dialogueEl.innerText = "";
  let i = 0;

  function typing() {
    if (i < text.length) {
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
  showScene("...", "images/bg.jpg", step1);
}

function step1() {
  showScene("Réveille-toi !!!", "images/bg.jpg", step2);

  setTimeout(() => {
    shake(10, 400);
  }, 100);
}

function step2() {
  showScene("Flemmard, arrête de dormir !!!", "images/bg.jpg", step3);
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
    "Parce que c'est la femme LA PLUS PARFAITE DE L'UNIVERS gros NIGAUD !!!",
    "images/tonton.png",
    mission1
  );
}

function mission1() {
  showScene(
    "Ramasse uniquement ce qu'elle aime... fais attention !",
    "images/tonton.png",
    startMiniGame
  );
  step5();
}

function step5() {
  showScene(
    "OUAF OUAF !!",
    "images/fayou.png"
  );
  step6();
}

function step6() {
  showScene(
    "Oh non, Fayou est en danger, il faut le sauver !!",
    "images/fayouDANGER.png"
  );
  mission2();
}

export function mission2() {
  showScene(
    "Vite !! Sauve le chien !!",
    "images/dog.png",
    startFlappyGame
  );
}