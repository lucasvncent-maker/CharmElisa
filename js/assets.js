export const images = {
  imgSaucisson: load("images/saucisson.png"),
  imgBanane: load("images/banane.png"),
  imgConcombre: load("images/concombre.png"),
  imgHeart: load("images/heart.png")
};

function load(src) {
  const img = new Image();
  img.src = src;
  return img;
}