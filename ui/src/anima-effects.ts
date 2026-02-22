/**
 * ANIMA Visual Effects Layer
 *
 * Injects film grain canvas, ambient glow orbs,
 * and mouse-tracking card glow into the page.
 */

// ── Film Grain ──
function initGrain(): void {
  const canvas = document.createElement("canvas");
  canvas.id = "anima-grain";
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w = 0;
  let h = 0;
  let frame = 0;

  function resize(): void {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // Render grain at reduced framerate for perf (every 3rd frame)
  function renderGrain(): void {
    frame++;
    if (frame % 3 === 0 && ctx) {
      const imgData = ctx.createImageData(w, h);
      const d = imgData.data;
      // Use typed array for speed
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
    }
    requestAnimationFrame(renderGrain);
  }
  renderGrain();
}

// ── Ambient Glow Orbs ──
function initGlows(): void {
  const emerald = document.createElement("div");
  emerald.id = "anima-glow-emerald";
  document.body.appendChild(emerald);

  const purple = document.createElement("div");
  purple.id = "anima-glow-purple";
  document.body.appendChild(purple);
}

// ── Mouse-Tracking Card Glow ──
function initMouseGlow(): void {
  document.addEventListener("mousemove", (e: MouseEvent) => {
    const cards = document.querySelectorAll<HTMLElement>(
      ".card, .anima-card, .callout",
    );
    for (const card of cards) {
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`);
    }
  });
}

// ── Init ──
if (typeof window !== "undefined") {
  // Delay to not block first paint
  requestAnimationFrame(() => {
    initGlows();
    initGrain();
    initMouseGlow();
  });
}
