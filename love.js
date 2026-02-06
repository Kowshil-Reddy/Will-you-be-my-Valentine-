// love.js (COMPLETE) — paste the whole file
// Works with your setup:
// - NO starts next to YES (normal layout)
// - On first hover/touch: NO becomes absolute and runs (never off-screen)
// - YES changes title + teddy gif + confetti
// - Floating emojis + hearts canvas included
// - No volume button needed (music code safely optional)

const title = document.getElementById("title");
const teddy = document.getElementById("teddy");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const responseText = document.getElementById("responseText");

const bgMusic = document.getElementById("bgMusic");       // optional
const musicBtn = document.getElementById("musicBtn");     // optional (you can remove from HTML)
const floatLayer = document.getElementById("floatLayer"); // optional

/* ===================== MUSIC (OPTIONAL) ===================== */
/* If you removed bgMusic/musicBtn from HTML, this section just does nothing. */
let musicOn = false;

function startMusic() {
  if (!bgMusic) return;
  bgMusic.volume = 0.55;
  bgMusic.play().then(() => {
    musicOn = true;
    if (musicBtn) musicBtn.textContent = "🔊";
  }).catch(() => {});
}

function toggleMusic() {
  if (!bgMusic) return;
  if (!musicOn) startMusic();
  else {
    bgMusic.pause();
    musicOn = false;
    if (musicBtn) musicBtn.textContent = "🔇";
  }
}

if (musicBtn) musicBtn.addEventListener("click", toggleMusic);

// Start music on first click anywhere (browser gesture rule)
document.addEventListener("click", () => {
  if (!musicOn) startMusic();
}, { once: true });

/* ===================== YES CLICK ===================== */
if (yesBtn) {
  yesBtn.addEventListener("click", () => {
    if (responseText) responseText.textContent = " Love You!!! 💖💞";
    if (title) title.textContent = "You light up my world ✨";

    // switch to 2nd GIF
    if (teddy) {
      teddy.src = "https://media.tenor.com/5zixOVyrBIsAAAAM/brown-bear-cony.gif";
      teddy.alt = "Brown Bear & Cony";
    }

    // hide buttons
    yesBtn.style.display = "none";
    if (noBtn) noBtn.style.display = "none";

    // confetti
    if (typeof confetti === "function") {
      confetti({
        particleCount: 180,
        spread: 95,
        origin: { y: 0.6 }
      });
    }
  });
}

/* ===================== NO BUTTON (STARTS NEXT TO YES, THEN RUNS — NEVER OFFSCREEN) ===================== */
/*
  IMPORTANT for CSS:
  - Do NOT set position:absolute on #noBtn in CSS.
  - body should have position: relative; overflow: hidden;
  - .buttons can be normal (flex). NO starts in normal flow.
*/
let noActivated = false;

function viewportSize() {
  // more reliable than window.innerWidth on some browsers/zoom
  return {
    vw: document.documentElement.clientWidth,
    vh: document.documentElement.clientHeight
  };
}

function activateNoAbsoluteKeepingPosition() {
  // Convert to absolute, but keep its current visible spot
  // We anchor absolute to BODY (body is position: relative in your CSS)
  const r = noBtn.getBoundingClientRect();

  noBtn.style.position = "absolute";
  noBtn.style.margin = "0";
  noBtn.style.transform = "none";
  noBtn.style.zIndex = "9999";

  // place at the same location relative to the viewport (body fills viewport)
  noBtn.style.left = `${r.left}px`;
  noBtn.style.top = `${r.top}px`;
}

function moveNoButtonClamped() {
  if (!noBtn) return;

  if (!noActivated) {
    noActivated = true;
    activateNoAbsoluteKeepingPosition();
  }

  const pad = 10;
  const { vw, vh } = viewportSize();

  // size after we set absolute (use rect for accuracy)
  const rect = noBtn.getBoundingClientRect();
  const btnW = rect.width || noBtn.offsetWidth || 80;
  const btnH = rect.height || noBtn.offsetHeight || 40;

  const maxX = Math.max(pad, vw - btnW - pad);
  const maxY = Math.max(pad, vh - btnH - pad);

  const x = pad + Math.random() * (maxX - pad);
  const y = pad + Math.random() * (maxY - pad);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;

  // final safety clamp (handles rounding/zoom)
  requestAnimationFrame(() => {
    const r2 = noBtn.getBoundingClientRect();
    const { vw: vw2, vh: vh2 } = viewportSize();

    let left = parseFloat(noBtn.style.left) || 0;
    let top = parseFloat(noBtn.style.top) || 0;

    left = Math.min(Math.max(left, pad), vw2 - r2.width - pad);
    top = Math.min(Math.max(top, pad), vh2 - r2.height - pad);

    noBtn.style.left = `${left}px`;
    noBtn.style.top = `${top}px`;
  });
}

// Desktop hover
if (noBtn) noBtn.addEventListener("mouseover", moveNoButtonClamped);

// Mobile touch
if (noBtn) {
  noBtn.addEventListener("touchstart", (e) => {
    e.preventDefault();
    moveNoButtonClamped();
  }, { passive: false });
}

// If somehow clicked
if (noBtn) {
  noBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (responseText) responseText.textContent = "Nice try 😏";
    moveNoButtonClamped();
  });
}

/* ===================== FLOATING KISSES / HEARTS (OPTIONAL) ===================== */
if (floatLayer) {
  const EMOJIS = ["😘", "🥰", "💋", "💖", "💕", "💞", "💘", "😍"];
  const floaters = [];

  function createFloater() {
    const el = document.createElement("div");
    el.className = "floater";
    el.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
    floatLayer.appendChild(el);

    const f = {
      el,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() * 0.6 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
      vy: (Math.random() * 0.6 + 0.2) * (Math.random() > 0.5 ? 1 : -1),
      wobble: Math.random() * 1000,
      size: Math.random() * 12 + 22
    };

    el.style.fontSize = `${f.size}px`;
    return f;
  }

  for (let i = 0; i < 10; i++) floaters.push(createFloater());

  function animateFloaters() {
    for (const f of floaters) {
      f.wobble += 0.02;
      f.x += f.vx;
      f.y += f.vy;

      if (f.x < 0 || f.x > window.innerWidth - 20) f.vx *= -1;
      if (f.y < 0 || f.y > window.innerHeight - 20) f.vy *= -1;

      const wobX = Math.sin(f.wobble) * 8;
      const wobY = Math.cos(f.wobble) * 8;

      f.el.style.transform = `translate(${f.x + wobX}px, ${f.y + wobY}px)`;
    }
    requestAnimationFrame(animateFloaters);
  }
  requestAnimationFrame(animateFloaters);
}

/* ===================== HEARTS CANVAS ===================== */
const canvas = document.getElementById("heartsCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

if (canvas && ctx) {
  const hearts = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Heart {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : -50;
      this.size = Math.random() * 20 + 10;
      this.speed = Math.random() * 2 + 1;
      this.color = Math.random() > 0.5 ? "#ff6f61" : "#ff3b2f";
    }
    draw() {
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.bezierCurveTo(
        this.x - this.size / 2, this.y - this.size / 4,
        this.x - this.size,     this.y + this.size / 2,
        this.x,                 this.y + this.size
      );
      ctx.bezierCurveTo(
        this.x + this.size,     this.y + this.size / 2,
        this.x + this.size / 2, this.y - this.size / 4,
        this.x,                 this.y
      );
      ctx.closePath();
      ctx.fillStyle = this.color;
      ctx.fill();
    }
    update() {
      this.y += this.speed;
      if (this.y > canvas.height + 20) {
        this.y = -50;
        this.x = Math.random() * canvas.width;
      }
      this.draw();
    }
  }

  function init() {
    hearts.length = 0;
    for (let i = 0; i < 50; i++) hearts.push(new Heart());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach(h => h.update());
    requestAnimationFrame(animate);
  }

  init();
  animate();
}
