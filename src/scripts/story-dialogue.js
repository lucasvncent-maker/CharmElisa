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
  showScene("...", "src/assets/pictures/background.jpg", step1);
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
    "Elisa t'en sera très reconnaissante !! Bon, j'ai quelqu'un d'autre de très important pour elle à te montrer...",
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
    "src/assets/pictures/uncle-noel.png",
    step12
  );
}

function step12_0() {
  showScene(
      "MAIS TU VIENS DE FAIRE N'IMPORTE QUOI !!! Reconcentre toi et retournes-y !!!",
      "src/assets/pictures/uncle-hungry.jpg",
      step12
    );
    setTimeout(() => {
      shake(30, 600);
    }, 20);
}

function step12() {
  showScene(
      "Allez mon gars, elle arrive, prépare toi à la draguer, fais très attention à ce que tu dis et ce que tu fais, t'as pas intérêt à tout gâcher maintenant !",
      "src/assets/pictures/uncle-noel.png",
      step13
    );
}


function step13() {
  showScene(
      "Oh, salut toi !",
      "src/assets/pictures/elisa-hoody.jpeg",
      null,
      [
        { text: "Donner les saucissons", action: step14 },
        { text: "Lui cracher dessus", action: step12_0 },
      ],
    );
}


function step14() {
  showScene(
      "",
      "src/assets/pictures/elisa-smile.jpeg",
      step15
    );
}

function step15() {
  showScene(
      "C'est bien mon p'tit gars, elle sourit, c'est bon signe !!! Propose-lui un date maintenant !!",
      "src/assets/pictures/uncle-noel.png",
      step16
    );
}

function step16() {
  showScene(
      "",
      "src/assets/pictures/elisa-smile.jpeg",
      null, 
      [
        { text: "Date au ski pour flexer ton talent", action: step16_1 },
        { text: "Faire des crepes", action: step17 },
        { text: "Date manif anti avortement", action: step12_0 },
      ],
    );
}

function step16_1() {
  showScene(
      "Elle a pas l'air d'être très impressionnée par ton niveau d'andouille...",
      "src/assets/pictures/elisa-ski.jpeg",
      step12_0
    );
}

function step17() {
  showScene(
      "",
      "src/assets/pictures/elisa-crepes.jpeg",
      step18
    );
}

function step18() {
  showScene(
      "Très bonne idée ça mon poulain !!! Les plus belles histoires d'amour commencent toujours avec des crêpes !!! Allez, tu y es presque !!!",
      "src/assets/pictures/uncle-noel.png",
      step20
    );
}

function step20() {
  showScene(
      "",
      "src/assets/pictures/elisa-smile.jpeg",
      null, 
      [
        { text: "Lui dire qu'elle a un beau sourire", action: step20_1 },
        { text: "L'embrasser", action: step20_2 },
        { text: "Lui dire qu'elle a des genoux magnifiques", action: step20_3 },
        { text: "Se baver dessus en regardant ses biceps", action: step21 },
        { text: "Sortir le paff", action: step12_0 },
      ],
    );
}

function step20_1() {
  showScene(
      "Très bonne idée ça mon poulain !!! Surtout si c'est pour ressembler a tous les autres BLAIREAUX qui la draguent h24, sois ORIGINAL UN PEU !!!!",
      "src/assets/pictures/uncle-noel.png",
      step12_0
    );
  setTimeout(() => {
    shake(30, 600);
  }, 80);
}

function step20_2() {
  showScene(
      "Oula mon gars, je t'ai pas élevé comme ça, on embrasse pas quelqu'un comme ça !!!",
      "src/assets/pictures/uncle-hungry.jpg",
      step12_0
    );
}

function step20_3() {
  showScene(
      "BeEeEEEEeEeURK c'est quoi ces genoux HORRIBLES ???",
      "src/assets/pictures/uncle-hungry.jpg",
      step12_0
    );
}

function step21() {
  showScene(
      "Elle a l'air d'aimer ton regard sur ses gros bras...",
      "src/assets/pictures/elisa-biceps.jpeg",
      step22
  );
}

function step22() {
  showScene(
      "Fiston, je crois bien que tu as réussi... Je suis fier de toi, maintenant, tu peux vivre ton histoire avec elle sans moi :)",
      "src/assets/pictures/uncle-noel.png",
      step23
    );
}

function step23() {
  showScene(
      "Fin du jeu, bravo !",
      "src/assets/pictures/elisa-mirror.jpeg",
      step24
    );
}

function step24() {
  showScene(
      "Joyeux anniversaire, Elisa <3",
      "src/assets/pictures/elisa-tshirt.jpeg",
      step25
    );
}

function step25() {
  showScene(
      "",
      "src/assets/pictures/elisa-2smiles.jpeg",
      step26
    );
}

function step26() {
  showScene(
      "20/03/2026 (merci Ethan pour l'aide)",
      "src/assets/pictures/elisa-hugs.png",
      step27
    );
}

function step27() {
  showScene(
      "T'es trop belle <3",
      "src/assets/pictures/elisa-cute.jpeg",
      end
    );
}

function end() {
  showScene(
      "",
      "",
      null
    );
}