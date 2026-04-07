const authOverlay = document.getElementById("auth-overlay");
const authForm = document.getElementById("auth-form");
const authUsername = document.getElementById("auth-username");
const authPassword = document.getElementById("auth-password");
const authError = document.getElementById("auth-error");
const introOverlay = document.getElementById("intro-overlay");
const openButton = document.getElementById("open-button");
const content = document.getElementById("content");
const music = document.getElementById("bg-music");
const nameCycle = document.getElementById("name-cycle");
const revealEls = document.querySelectorAll(".reveal");
const heartsLayer = document.getElementById("hearts-layer");
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");

const names = ["Tori", "Yumi", "Wife"];
let nameIndex = 0;
let isOpen = false;
const lockedUsername = "Dk_Yv";
const lockedPassword = "1yearanniversary";

function typeInElement(el, speed = 18) {
  const original = el.innerHTML;
  const tmp = document.createElement("div");
  tmp.innerHTML = original;
  const plainText = tmp.textContent || "";
  el.textContent = "";

  let i = 0;
  const interval = setInterval(() => {
    el.textContent += plainText[i] || "";
    i += 1;
    if (i > plainText.length) {
      clearInterval(interval);
      el.innerHTML = original;
    }
  }, speed);
}

function triggerReveals() {
  revealEls.forEach((el, idx) => {
    setTimeout(() => {
      el.classList.add("show");
      const heading = el.querySelector("h1, h2, p");
      if (heading) typeInElement(heading, 14);
    }, 280 + idx * 320);
  });
}

function cycleNames() {
  setInterval(() => {
    nameCycle.style.opacity = "0";
    nameCycle.style.transform = "translateY(6px)";
    setTimeout(() => {
      nameIndex = (nameIndex + 1) % names.length;
      nameCycle.textContent = names[nameIndex];
      nameCycle.style.opacity = "1";
      nameCycle.style.transform = "translateY(0)";
    }, 240);
  }, 2500);
}

authForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const enteredUser = authUsername.value.trim();
  const enteredPass = authPassword.value;

  if (enteredUser === lockedUsername && enteredPass === lockedPassword) {
    authError.textContent = "";
    authOverlay.classList.add("hidden");
    introOverlay.classList.remove("hidden");
    authForm.reset();
    return;
  }

  authError.textContent = "That combo is not right. Try again, love.";
});

openButton.addEventListener("click", async () => {
  if (isOpen) return;
  isOpen = true;

  introOverlay.classList.add("hidden");
  content.classList.remove("hidden");
  triggerReveals();
  burstParticles();

  try {
    await music.play();
  } catch (err) {
    // Browser autoplay rules can block this; user can tap play later.
    console.warn("Audio play blocked:", err);
  }
});

cycleNames();

let lastHeartTime = 0;
window.addEventListener("pointermove", (event) => {
  const now = Date.now();
  if (now - lastHeartTime < 40) return;
  lastHeartTime = now;
  createHeart(event.clientX, event.clientY);
});

function createHeart(x, y) {
  const heart = document.createElement("span");
  heart.className = "float-heart";
  heart.style.left = `${x - 6}px`;
  heart.style.top = `${y - 6}px`;
  heart.style.setProperty("--dx", `${(Math.random() - 0.5) * 24}px`);
  heartsLayer.appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 820);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

const particles = [];
const particleCount = 90;

for (let i = 0; i < particleCount; i += 1) {
  particles.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vx: (Math.random() - 0.5) * 0.35,
    vy: (Math.random() - 0.5) * 0.35,
    r: Math.random() * 2.4 + 1,
    a: Math.random() * 0.45 + 0.15
  });
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const p of particles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < -5) p.x = canvas.width + 5;
    if (p.x > canvas.width + 5) p.x = -5;
    if (p.y < -5) p.y = canvas.height + 5;
    if (p.y > canvas.height + 5) p.y = -5;

    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 214, 241, ${p.a})`;
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(animateParticles);
}

animateParticles();

function burstParticles() {
  const burstCount = 24;
  for (let i = 0; i < burstCount; i += 1) {
    const angle = (Math.PI * 2 * i) / burstCount;
    const x = canvas.width / 2 + Math.cos(angle) * 8;
    const y = canvas.height / 2 + Math.sin(angle) * 8;
    createHeart(x, y);
  }
}
