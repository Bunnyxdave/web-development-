const cube = document.getElementById("cube");

let rotateX = 0;
let rotateY = 0;
let targetX = 0;
let targetY = 0;

// Apply rotation with smooth easing
function updateRotation() {
  rotateX += (targetX - rotateX) * 0.1; // easing factor (0.1 = smooth & slow)
  rotateY += (targetY - rotateY) * 0.1;
  cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  requestAnimationFrame(updateRotation);
}
updateRotation();

// Handle scroll
window.addEventListener("wheel", (e) => {
  const step = 3; // smaller = less sensitive (try 15° or 20° per scroll)
  
  if (e.deltaY > 0) {
    // Scroll down → tilt cube up
    targetX -= step;
  } else if (e.deltaY < 0) {
    // Scroll up → tilt cube down
    targetX += step;
  }

  if (e.deltaX > 0) {
    // Scroll right → rotate cube left
    targetY -= step;
  } else if (e.deltaX < 0) {
    // Scroll left → rotate cube right
    targetY += step;
  }
});

const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

document.addEventListener("click", (e) => {
  const spark = document.createElement("div");
  spark.className = "spark";
  spark.style.left = e.clientX + "px";
  spark.style.top = e.clientY + "px";
  document.body.appendChild(spark);
  setTimeout(() => spark.remove(), 500);
});