// BackgroundSystem.js
import { gameState } from "../state/gameState.js";
import { backgroundConfig } from "./backgroundConfig.js";

export function applyBackground(container) {
    const bgData = backgroundConfig[gameState.bossIndex];

    if (!bgData) return;

    container.style.backgroundImage = `url(${bgData.image})`;
    container.style.backgroundSize = "cover";
    container.style.backgroundPosition = "center";
}