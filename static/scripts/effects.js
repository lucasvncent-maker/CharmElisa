export function shake(intensity = 5, duration = 300) {
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