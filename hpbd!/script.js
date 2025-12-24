// Preload
window.addEventListener("load", () => {
  const p = document.getElementById("preload");
  p.classList.add("hide");

  setTimeout(() => {
    p.remove();
  }, 3100);
});

// Rotate lock + video auto-play fix
(function(){
  const lock = document.getElementById("rotate-lock");
  const v = document.getElementById("bg");

  function isMobile(){
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function checkOrientation(){
    if (!isMobile()){
      lock.classList.remove("active");
      document.body.style.overflow = "";
      if (v.paused) v.play().catch(()=>{});
      return;
    }

    if (window.innerHeight > window.innerWidth){
      lock.classList.add("active");
      document.body.style.overflow = "hidden";
      v.pause();
    } else {
      lock.classList.remove("active");
      document.body.style.overflow = "";
      if (v.paused) v.play().catch(()=>{});
    }
  }

  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
  document.addEventListener("DOMContentLoaded", checkOrientation);
})();

// Input blur on mobile
(function(){
  const input = document.querySelector(".input-field input");
  const btn = document.querySelector(".send-btn");

  function isMobile(){
    return window.matchMedia("(max-width: 768px)").matches;
  }

  btn.addEventListener("click", () => {
    if (isMobile()) input.blur();
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && isMobile()) {
      setTimeout(() => input.blur(), 50);
    }
  });
})();

// Erase and type-wave effect
function eraseText(el, base = 55) {
  return new Promise(resolve => {
    const iv = setInterval(() => {
      el.value = el.value.slice(0, -1);
      if (!el.value) {
        clearInterval(iv);
        resolve();
      }
    }, base + Math.random() * 30);
  });
}

function typeWave(container, text, speed = 85){
  container.innerHTML = "";
  let i = 0;

  const step = () => {
    if (i < text.length){
      const span = document.createElement("span");
      span.innerHTML = text[i] === " " ? "&nbsp;" : text[i];
      span.className = "strong";
      container.appendChild(span);

      const spans = container.querySelectorAll("span");
      if (spans.length >= 2) spans[spans.length - 2].className = "soft";
      if (spans.length >= 3) spans[spans.length - 3].className = "normal";

      i++;
      setTimeout(step, speed);
    } else {
      const spans = container.querySelectorAll("span");
      if (spans.length >= 1) setTimeout(() => spans[spans.length - 1].className = "soft", speed);
      if (spans.length >= 2) setTimeout(() => spans[spans.length - 2].className = "normal", speed * 2);
    }
  };

  step();
}

// Form handling
const form = document.querySelector(".input-wrap");
const input = document.querySelector("input[name='msg']");
const btn = document.querySelector("button[type='submit']");

const WORKER_URL = "https://hpbd.lthsiucutio.workers.dev/";

let ready = false;
let redirectUrl = "";

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (ready) {
    window.location.href = redirectUrl;
    return;
  }

  const key = input.value.trim().toLowerCase();
  if (!key) return;

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key })
    });

    const text = await res.text();
    let data;

    try {
      data = JSON.parse(text);
    } catch {
      console.error("Worker trả không phải JSON:", text);
      throw new Error("INVALID_JSON");
    }

    if (!data.ok) {
      input.value = "";
      input.placeholder = "nhập sai code rồi!!!";
      input.classList.add("shake");
      setTimeout(() => input.classList.remove("shake"), 400);
      return;
    }

    const fake = document.querySelector(".fake-text");
    redirectUrl = data.url;

    await eraseText(input);

    input.value = "";
    input.placeholder = "";
    input.disabled = true;
    input.blur();

    typeWave(fake, data.msg);

    ready = true;
    btn.classList.add("ready");
    btn.title = "nhấn lần nữa để mở";

  } catch (err) {
    console.error(err);
    input.placeholder = "Er rỏ er rỏ rồi!!";
  }
});

// Set video playback rate
const v = document.getElementById("bg");
v.playbackRate = 0.95;
