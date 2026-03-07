const sounds = {
  bgm: new Audio("/assets/sound/background.wav"),
  correct: new Audio("/assets/sound/correct.wav"),
  wrong: new Audio("/assets/sound/wrong.mp3"),
  win: new Audio("/assets/sound/win.wav"),
  lose: new Audio("/assets/sound/lose.wav"),
};

sounds.bgm.loop = true;
sounds.bgm.volume = 0.25;

let bgmPlaying = false;

export function playSound(name) {
  if (!sounds[name]) return;

  sounds[name].currentTime = 0;
  sounds[name].play();
}

export function playBGM() {

  if (bgmPlaying) return;   // 🔥 chặn play lại

  sounds.bgm.play().catch(()=>{});
  bgmPlaying = true;
}

export function stopBGM() {
  sounds.bgm.pause();
  bgmPlaying = false;
}