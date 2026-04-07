const authOverlay = document.getElementById("auth-overlay");
const authForm = document.getElementById("auth-form");
const authUsername = document.getElementById("auth-username");
const authPassword = document.getElementById("auth-password");
const rememberMe = document.getElementById("remember-me");
const authError = document.getElementById("auth-error");
const introOverlay = document.getElementById("intro-overlay");
const openButton = document.getElementById("open-button");
const content = document.getElementById("content");
const nameCycle = document.getElementById("name-cycle");
const revealEls = document.querySelectorAll(".reveal");
const heartsLayer = document.getElementById("hearts-layer");
const canvas = document.getElementById("particle-canvas");
const ctx = canvas.getContext("2d");
const leftA = document.getElementById("fade-img-left-a");
const leftB = document.getElementById("fade-img-left-b");
const rightA = document.getElementById("fade-img-right-a");
const rightB = document.getElementById("fade-img-right-b");

const names = ["Tori", "Yumi", "Wife"];
let nameIndex = 0;
let isOpen = false;
let leftActiveA = true;
let rightActiveA = true;
const lockedUsername = "Dk_Yv";
const lockedPassword = "1yearanniversary";
const rememberKey = "anniversaryRemember";
const photos = [
  "photos/VRChat_2025-11-07_00-51-54.407_1920x1080.png",
  "photos/VRChat_2025-11-13_06-31-33.720_1920x1080.png",
  "photos/VRChat_2025-11-13_06-32-25.672_1920x1080.png",
  "photos/VRChat_2025-11-23_20-55-38.135_1080x1920.png",
  "photos/VRChat_2026-02-14_14-59-55.644_1920x1080.png",
  "photos/VRChat_2026-02-14_15-00-13.899_1920x1080.png",
  "photos/VRChat_2026-02-26_20-06-49.758_1080x1920.png",
  "photos/VRChat_2026-03-19_17-09-34.633_1920x1080.png",
  "photos/VRChat_2026-04-01_21-51-19.799_1920x1080.png",
  "photos/VRChat_2026-04-04_10-36-24.275_1920x1080.png",
  "photos/VRChat_2026-04-06_12-17-34.420_1080x1920.png",
  "photos/VRChat_2026-04-06_12-18-39.506_1080x1920.png"
];

function typeInElement(el, speed = 48) {
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

function tryStartSpotifyAudio() {
  const spotifyFrame = document.querySelector('iframe[src*="open.spotify.com/embed/track"]');
  if (spotifyFrame) {
    const base = "https://open.spotify.com/embed/track/28sawWzfucjbahooUtyrZx";
    spotifyFrame.src = `${base}?utm_source=generator&autoplay=1`;
  }
}

function unlockAuthGate() {
  authError.textContent = "";
  authOverlay.classList.add("hidden");
  introOverlay.classList.remove("hidden");
  tryStartSpotifyAudio();
}

function triggerReveals() {
  revealEls.forEach((el, idx) => {
    setTimeout(() => {
      el.classList.add("show");
      const textNodes = el.querySelectorAll("h1, h2, p");
      textNodes.forEach((node, textIdx) => {
        setTimeout(() => {
          typeInElement(node, 52);
        }, textIdx * 500);
      });
    }, 400 + idx * 600);
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
    if (rememberMe && rememberMe.checked) {
      localStorage.setItem(
        rememberKey,
        JSON.stringify({ user: enteredUser, pass: enteredPass, remember: true })
      );
    } else {
      localStorage.removeItem(rememberKey);
    }
    unlockAuthGate();
    authForm.reset();
    if (rememberMe) rememberMe.checked = false;
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
  startPhotoFades();
  burstParticles();
});

cycleNames();

try {
  const saved = JSON.parse(localStorage.getItem(rememberKey) || "null");
  if (
    saved &&
    saved.remember === true &&
    saved.user === lockedUsername &&
    saved.pass === lockedPassword
  ) {
    unlockAuthGate();
  } else if (saved && saved.remember === true) {
    authUsername.value = saved.user || "";
    authPassword.value = saved.pass || "";
    if (rememberMe) rememberMe.checked = true;
  }
} catch (error) {
  localStorage.removeItem(rememberKey);
}

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

function shuffle(list) {
  const arr = [...list];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomPhoto(exceptSrc = "") {
  if (!photos.length) return "";
  let next = photos[Math.floor(Math.random() * photos.length)];
  let guard = 0;
  while (next === exceptSrc && guard < 12) {
    next = photos[Math.floor(Math.random() * photos.length)];
    guard += 1;
  }
  return next;
}

function startPhotoFades() {
  if (!leftA || !leftB || !rightA || !rightB) return;

  const firstSet = shuffle(photos);
  leftA.src = firstSet[0] || photos[0];
  rightA.src = firstSet[1] || photos[1] || photos[0];
  leftB.src = randomPhoto(leftA.src);
  rightB.src = randomPhoto(rightA.src);

  setInterval(() => {
    const visible = leftActiveA ? leftA : leftB;
    const hidden = leftActiveA ? leftB : leftA;
    hidden.src = randomPhoto(visible.src);
    hidden.classList.add("show");
    visible.classList.remove("show");
    leftActiveA = !leftActiveA;
  }, 4200);

  setInterval(() => {
    const visible = rightActiveA ? rightA : rightB;
    const hidden = rightActiveA ? rightB : rightA;
    hidden.src = randomPhoto(visible.src);
    hidden.classList.add("show");
    visible.classList.remove("show");
    rightActiveA = !rightActiveA;
  }, 5000);
}
