export function showResultPopup({ win, onRestart }) {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";

    const popup = document.createElement("div");
    popup.className = "popup";

    popup.innerHTML = `
    <h2>${win ? "👑 Bạn đã cứu công chúa!" : "💀 Bạn đã thua!"}</h2>
    <button id="restartBtn">Chơi lại</button>
  `;

    popup.querySelector("#restartBtn").onclick = () => {
        overlay.remove();
        onRestart();
    };

    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}