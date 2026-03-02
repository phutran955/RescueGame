export function showBuffPopup(onSelect) {
  const overlay = document.createElement("div");
  overlay.className = "popup-overlay";

  const popup = document.createElement("div");
  popup.className = "popup";

  popup.innerHTML = `
    <h2>🎁 Chọn phần thưởng</h2>
    <button data-buff="5050">50 / 50</button>
    <button data-buff="life">+1 mạng</button>
    <button data-buff="double">x2 sát thương</button>
  `;

  popup.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
      overlay.remove();
      onSelect(btn.dataset.buff);
    };
  });

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
}