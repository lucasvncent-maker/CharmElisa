function loadImage(src) {
  const img = new Image();
  img.onerror = () => console.error(`Failed to load image: ${src}`);
  img.src = src;
  return img;
}

export const miniGameAssets = {
  sausage: loadImage("src/assets/images/sausage.png"),
  banana: loadImage("src/assets/images/banana.png"),
  cucumber: loadImage("src/assets/images/cucumber.png"),
  heart: loadImage("src/assets/images/heart.png"),
  fayou: loadImage("src/assets/images/fayou.jpeg"),
};

export const flappyGameAssets = {
  dog: loadImage("src/assets/images/dog.png"),
  chocolate: loadImage("src/assets/images/chocolate.png"),
};

export const shootingGameAssets = {
  heart: loadImage("src/assets/images/heart.png"),
  ares: loadImage("src/assets/images/ares.png"),
};
