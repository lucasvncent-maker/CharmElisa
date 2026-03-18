function loadImage(src) {
  const img = new Image();
  img.onerror = () => console.error(`Failed to load image: ${src}`);
  img.src = src;
  return img;
}

export const miniGameAssets = {
  sausage: loadImage("src/assets/pictures/sausage.png"),
  banana: loadImage("src/assets/pictures/banana.png"),
  cucumber: loadImage("src/assets/pictures/cucumber.png"),
  heart: loadImage("src/assets/pictures/heart.png"),
  fayou: loadImage("src/assets/pictures/fayou.jpeg"),
};

export const flappyGameAssets = {
  dog: loadImage("src/assets/pictures/dog.png"),
  chocolate: loadImage("src/assets/pictures/chocolate.png"),
};

export const shootingGameAssets = {
  heart: loadImage("src/assets/pictures/heart.png"),
  ares: loadImage("src/assets/pictures/ares.png"),
  horse: loadImage("src/assets/pictures/ares.png"),
};
