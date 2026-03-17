export const images = {
  imgSaucisson: load("static/pictures/saucisson.png"),
  imgBanane: load("static/pictures/banane.png"),
  imgConcombre: load("static/pictures/concombre.png"),
  imgHeart: load("static/pictures/heart.png"),
  imgDog: load("static/pictures/fayou.jpeg"),

};

function load(src) {
  const img = new Image();
  img.src = src;
  return img;
}