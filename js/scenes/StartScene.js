import { router } from "../router.js";
import { gameState } from "../state/gameState.js";
import LoadingScene from "./LoadingScene.js";

export default function StartScene() {
  const div = document.createElement("div");

  div.innerHTML = `
    <h1>👑 Giải cứu công chúa 👑</h1>
    <button id="startBtn">Bắt đầu</button>
  `;

  div.querySelector("#startBtn").onclick = () => {
    gameState.resetGame();
    router.navigate(LoadingScene);
  };

  return div;
}