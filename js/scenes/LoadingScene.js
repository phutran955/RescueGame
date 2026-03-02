import { router } from "../router.js";
import { quizService } from "../services/quizService.js";
import QuizScene from "./QuizScene.js";
import StartScene from "./StartScene.js";

export default function LoadingScene(allQuestions = null, startIndex = 0, level = null) {
    const div = document.createElement("div");
    div.className = "loading-scene";

    div.innerHTML = `
    <div class="loading-box">
      <p>Đang tải câu hỏi...</p>
      <div class="loading-bar">
        <div class="loading-fill">
          <div class="loading-sprite"></div>
        </div>
      </div>
      <p class="loading-percent">0%</p>
    </div>
  `;

    // ===== UI =====
    const fill = div.querySelector(".loading-fill");
    const percentText = div.querySelector(".loading-percent");

    let fakeProgress = 0;
    const fakeTimer = setInterval(() => {
        fakeProgress += 10;
        if (fakeProgress > 90) fakeProgress = 90;
        fill.style.width = fakeProgress + "%";
        percentText.innerText = fakeProgress + "%";
    }, 200);

async function load() {
  try {
    // chỉ fetch 1 lần
    if (!window.questions) {
      window.questions = await quizService.getQuestions();
    }

    const allQuestions = window.questions;

    clearInterval(fakeTimer);
    fill.style.width = "100%";
    percentText.innerText = "100%";
    await new Promise((r) => setTimeout(r, 300));

    if (!allQuestions || allQuestions.length === 0) {
      showError("⚠️ Không có câu hỏi");
      return;
    }

    router.navigate(() => QuizScene());

  } catch (err) {
    console.error(err);
    showError("❌ Lỗi tải dữ liệu");
  }
}

    function showError(message) {
        clearInterval(fakeTimer);
        div.innerHTML = `
      <div class="error-popup">
        <p>${message}</p>
        <button id="back">Về trang chủ</button>
      </div>
    `;

        div.querySelector("#back").onclick = () =>
            router.navigate(() => StartScene());
    }

    load();
    return div;
}
