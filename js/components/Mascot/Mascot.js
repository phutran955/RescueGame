import { playAnimation } from "./animator.js";

export default function Mascot({
  mascotName,
  role = "player",
}) {
  const div = document.createElement("div");
  div.className = `mascot mascot-${role}`;

  const img = document.createElement("img");
  img.draggable = false;

  // enemy và princess cùng hướng
  if (role === "enemy" || role === "princess") {
    img.style.transform = "scaleX(-1)";
  }

  div.appendChild(img);

  let currentAnim = null;
  let currentState = "idle";

  function stopCurrent() {
    if (currentAnim) currentAnim.stop();
    currentAnim = null;
  }

  function idle() {
    stopCurrent();
    currentState = "idle";

    currentAnim = playAnimation({
      img,
      path: `/assets/mascots/${mascotName}/idle`,
      loop: true,
      totalFrames: mascotName === "princess" ? 16 : undefined,
    });
  }

  function happy() {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "happy";

      currentAnim = playAnimation({
        img,
        path: `/assets/mascots/${mascotName}/happy`,
        loop: false,
        totalFrames: mascotName === "princess" ? 30 : undefined,
        onEnd: () => {
          idle();
          resolve();
        },
      });
    });
  }

  function sad() {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "sad";

      currentAnim = playAnimation({
        img,
        path: `/assets/mascots/${mascotName}/sad`,
        loop: false,
        onEnd: () => {
          idle();
          resolve();
        },
      });
    });
  }

  function dead() {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "dead";

      currentAnim = playAnimation({
        img,
        path: `/assets/mascots/${mascotName}/dead`,
        loop: false,
        onEnd: () => resolve(),
      });
    });
  }

  function attack() {
    return new Promise(resolve => {
      stopCurrent();
      currentState = "attack";

      currentAnim = playAnimation({
        img,
        path: `/assets/mascots/${mascotName}/attack`,
        loop: false,
        totalFrames: 13,
        onEnd: () => {
          idle();
          resolve();
        },
      });
    });
  }

  idle();

  return {
    el: div,
    role,
    idle,
    happy,
    sad,
    dead,
    attack,
    getState: () => currentState,
  };
}