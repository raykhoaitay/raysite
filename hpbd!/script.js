
(function(){
  const lock = document.getElementById("rotate-lock");

  function isMobile(){
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function checkOrientation(){
    if (!isMobile()){
      lock.classList.remove("active");
      return;
    }

    if (window.innerHeight > window.innerWidth){
      lock.classList.add("active");
      document.body.style.overflow = "hidden";
    } else {
      lock.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  window.addEventListener("resize", checkOrientation);
  window.addEventListener("orientationchange", checkOrientation);
  document.addEventListener("DOMContentLoaded", checkOrientation);
})();

(function(){
  const input = document.querySelector(".input-field input");
  const btn = document.querySelector(".send-btn");

  function isMobile(){
    return window.matchMedia("(max-width: 768px)").matches;
  }

  btn.addEventListener("click", () => {
    if (isMobile()) {
      input.blur();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && isMobile()) {
      setTimeout(() => input.blur(), 50);
    }
  });
})();

document.addEventListener("DOMContentLoaded", () => {
  const bg = document.querySelector(".bg");
  const glass = document.querySelector(".glass");
  const items = document.querySelectorAll(".fade-item");

  bg.classList.add("show");
  glass.classList.add("show");

  items.forEach((el, i) => {
    setTimeout(() => {
      el.classList.add("show");
    }, 400 + i * 200);
  });
});

const v = document.getElementById("bg");
v.playbackRate = .95;