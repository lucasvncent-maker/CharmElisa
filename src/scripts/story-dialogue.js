import { shake } from "./effects.js";
import { startFlappyGame } from "./flappy-game.js";
import { startMiniGame } from "./mini-game.js";
import { startShootGame } from "./shoot-game.js";

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
  showScene("...", "src/assets/pictures/background.jpg", startShootGame);
}

function step1() {
  showScene("Réveille-toi !!!", "src/assets/pictures/background.jpg", step2);
  setTimeout(() => {
    shake(10, 400);
  }, 100);
}

function step2() {
  showScene(
    "Flemmard, arrête de dormir !!!",
    "src/assets/pictures/background.jpg",
    step3,
  );
}

function step3() {
  showScene(
    "Bonjour, jeune homme, je suis tonton Noël, ton fidèle conseiller.",
    "src/assets/pictures/uncle-noel.png",
    step4,
  );
}

function step4() {
  showScene(
    "Aujourd'hui, tu vas devoir CONQUÉRIR LE COEUR D'ELISA !!!",
    "src/assets/pictures/uncle-noel.png",
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
    "src/assets/pictures/uncle-noel.png",
    startFirstMission,
  );
}

function chooseNo() {
  showScene(
    "Parce que c'est la femme LA PLUS PARFAITE DE L'UNIVERS gros NIGAUD !!!",
    "src/assets/pictures/uncle-noel.png",
    startFirstMission,
  );
}

function startFirstMission() {
  showScene(
    "Ramasse uniquement ce qu'elle aime... fais attention !",
    "src/assets/pictures/uncle-noel.png",
    startMiniGame,
  );
}

export function step5() {
  showScene(
    "OUAF OUAF !!",
    "src/assets/pictures/fayou.jpeg",
    introduceFayouProblem,
  );
}

function introduceFayouProblem() {
  showScene(
    "Oh non, quelqu'un a renversé du chocolat de partout, il faut protéger Fayou !!",
    "src/assets/pictures/fayou.jpeg",
    startSecondMission,
  );
}

function startSecondMission() {
  showScene(
    "Vite !! Sauve-le !!",
    "src/assets/pictures/fayou.jpeg",
    startFlappyGame,
  );
}

export function step6() {
  showScene(
    "Merci d'avoir sauvé Fayou !",
    "src/assets/pictures/uncle-noel.png",
    step7,
  );
}

export function step7() {
  showScene(
    "Je te présente Arès, jeune homme",
    "src/assets/pictures/ares.png",
    step7_0,
  );
}

function step7_0() {
  showScene(
    "Tu le trouves pas magnifique ce gros bg ?",
    "src/assets/pictures/ares.png",
    null,
    [
      { text: "Oh que oui !", action: step8 },
      { text: "Bof ...", action: step7_1 },
    ],
  );
}

function step7_1() {
  showScene(
    "QUOI ??? Mais t'as quoi dans les yeux mon grand ????",
    "src/assets/pictures/uncle-hungry.jpg",
    step7,
  );
  setTimeout(() => {
    shake(30, 600);
  }, 20);
}

function step8() {
  showScene(
    "Tres bien, tu sais ce que Elisa déteste encore plus que les bananes ???",
    "src/assets/pictures/uncle-noel.png",
    null,
    [
      { text: "Les gens lents", action: step8_1 },
      { text: "La pluie", action: step8_1 },
      { text: "Les gens qui votent Zemmour", action: step8_2 },
      { text: "Les impôts", action: step8_1 },
      { text: "Les ZHOMMES", action: step9 },
    ],
  );
}

function step8_1() {
  showScene(
    "C'est pas faux, mais y'a quand même quelque chose qu'elle déteste ENCORE PLUS...",
    "src/assets/pictures/uncle-noel.png",
    step8,
  );
}

function step8_2() {
  showScene(
    "Ah non, je crois qu'elle a un petit kink là-dessus ... ;)",
    "src/assets/pictures/uncle-noel.png",
    step8,
  );
}

function step9() {
  showScene(
    "BINGO MON GARS !!! Et justement, j'en vois plein qui s'approchent d'Ares en ce moment même. Ta nouvelle mission sera donc...",
    "src/assets/pictures/uncle-noel.png",
    step10,
  );
  setTimeout(() => {
    shake(10, 400);
  }, 20);
}

function step10() {
  showScene(
    "DE LES ELIMINER",
    "src/assets/pictures/uncle-hungry.jpg",
    startThirdMission,
  );
  setTimeout(() => {
    shake(10, 400);
  }, 10);
}

function startThirdMission() {
  showScene(
    "Prends mon fusil à pompe et charge toi de ces zhommes dégoutants, mais attention, Elisa adore les filles aux gros seins, évite absolument de leur tirer dessus !",
    "src/assets/pictures/uncle-noel.png",
    startShootGame,
  );
  setTimeout(() => {
    shake(10, 400);
  }, 10);
}

export function step11() {
  showScene(
    "Bon, il est grand temps d'organiser votre rencontre, on va emmener Ares et Fayou avec nous.",
    "src/assets/pictures/uncle-noel.png"
  );
}
