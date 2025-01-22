export function vignetteFade(duration = 2000) {
  const vignette = document.createElement("div");
  vignette.className = "vignette";
  document.body.appendChild(vignette);

  // Override the duration of the animation
  vignette.style.animationDuration = `${duration}ms`;

  // Trigger the fade-in anim, then remove delete the vignette after some time
  vignette.classList.add("vignette-anim");
  setTimeout(() => {
    vignette.remove();
  }, duration);
}
