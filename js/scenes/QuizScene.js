import { gameState } from "../state/gameState.js";
import { router } from "../router.js";
import { showResultPopup } from "../components/ResultPopup.js";
import { showBuffPopup } from "../components/BuffPopup.js";
import LoadingScene from "./LoadingScene.js";
import StartScene from "./StartScene.js";

export default function QuizScene() {
    const div = document.createElement("div");
    div.className = "quiz-scene";

    const questions = window.questions;
    const totalQuestions = questions.length;

    const QUESTIONS_PER_BOSS = 3;

    const startIndex = gameState.bossIndex * QUESTIONS_PER_BOSS;
    const bossQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_BOSS);
    let currentQuestion = 0;

    render();

    // =============================
    // RENDER QUESTION
    // =============================
    function render() {
        const q = bossQuestions[currentQuestion];

        if (!q) return;

        div.innerHTML = `
      <div class="hud">
        <h2>👹 Boss ${gameState.bossIndex + 1}</h2>
        <p>❤️ Bạn: ${gameState.playerLives} | 🐲 Boss: ${gameState.bossLives}</p>
      </div>

      <div class="question-box">
        <h3>${q.question}</h3>
        ${q.img ? `<img class="question-img" src="${q.img}" />` : ""}
        <div id="answers"></div>
      </div>
    `;

        const answersDiv = div.querySelector("#answers");

        // ========= MULTIPLE CHOICE =========
        if (q.typeQuestion === 100) {
            let answersToShow = q.answers.map((a, i) => i);

            // áp dụng buff 50/50
            if (gameState.use5050) {
                const wrong = answersToShow.filter(i => i !== q.correctIndex);
                wrong.splice(0, wrong.length - 1);
                answersToShow = [q.correctIndex, ...wrong];
                gameState.use5050 = false;
            }

            answersToShow.forEach(i => {
                const btn = document.createElement("button");
                btn.className = "answer-btn";
                btn.textContent = q.answers[i];
                btn.onclick = () => answer(i === q.correctIndex);
                answersDiv.appendChild(btn);
            });
        }

        // ========= FILL BLANK =========
        if (q.typeQuestion === 200) {
            const wrapper = document.createElement("div");

            const text = document.createElement("p");
            text.textContent = q.fill.leftText + " _____ " + q.fill.rightText;

            const input = document.createElement("input");
            input.className = "fill-input";

            const btn = document.createElement("button");
            btn.textContent = "OK";

            btn.onclick = () => {
                const correct =
                    input.value.trim().toLowerCase() ===
                    q.fill.answerText.toLowerCase();

                answer(correct);
            };

            wrapper.appendChild(text);
            wrapper.appendChild(input);
            wrapper.appendChild(btn);

            answersDiv.appendChild(wrapper);
        }
    }

    // =============================
    // HANDLE ANSWER
    // =============================
    function answer(correct) {
        if (correct) {
            const damage = gameState.doubleDamage ? 2 : 1;
            gameState.bossLives -= damage;
            gameState.doubleDamage = false;
        } else {
            gameState.playerLives--;
        }

        // ===== PLAYER LOSE =====
        if (gameState.playerLives <= 0) {
            showResultPopup({
                win: false,
                onRestart: () => router.navigate(StartScene),
            });
            return;
        }

        // ===== BOSS DEFEATED =====
        if (gameState.bossLives <= 0) {

            const nextStartIndex = (gameState.bossIndex + 1) * QUESTIONS_PER_BOSS;

            // 👉 nếu không còn câu hỏi → WIN
            if (nextStartIndex >= totalQuestions) {
                showResultPopup({
                    win: true,
                    onRestart: () => router.navigate(StartScene),
                });
                return;
            }

            // 👉 còn câu hỏi → chọn buff và sang boss tiếp
            showBuffPopup((buff) => {
                if (buff === "5050") gameState.use5050 = true;
                if (buff === "life") gameState.playerLives++;
                if (buff === "double") gameState.doubleDamage = true;

                gameState.bossIndex++;
                gameState.bossLives = 3;

                router.navigate(() => LoadingScene());
            });

            return;
        }

        // NEXT QUESTION
        currentQuestion++;
        render();
    }

    return div;
}