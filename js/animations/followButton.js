const strength = 50;
const magnetBtn = document.querySelector(".play-btn, .play-video");

magnetBtn.addEventListener("mousemove", moveMagnet);
magnetBtn.addEventListener("mouseout", resetMagnet);

function moveMagnet(event) {
  const bounding = magnetBtn.getBoundingClientRect();
  const xOffset =
    (event.clientX - bounding.left - bounding.width / 2) *
    (strength / bounding.width);
  const yOffset =
    (event.clientY - bounding.top - bounding.height / 2) *
    (strength / bounding.height);

  magnetBtn.style.transform = `translate(${xOffset}px, ${yOffset}px) scale(1.2)`;
}

function resetMagnet() {
  magnetBtn.style.transform = "translate(0, 0) scale(1)";
}
