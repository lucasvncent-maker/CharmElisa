export const images = {
  imgSaucisson: load("images/saucisson.jpg"),
  imgBanane: load("images/banane.png"),
  imgConcombre: load("images/concombre.jpg"),
  imgHeart: load("images/heart.png")
};

function load(src) {
  const img = new Image();
  img.src = src;
  return img;
}