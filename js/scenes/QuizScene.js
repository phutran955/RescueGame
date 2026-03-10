import { gameState } from "../state/gameState.js";
import { router } from "../router.js";
import { showResultPopup } from "../components/ResultPopup.js";
import { showBuffPopup } from "../components/BuffPopup.js";
import LoadingScene from "./LoadingScene.js";
import StartScene from "./StartScene.js";
import { applyBackground } from "../config/BackgroundSystem.js";
import Mascot from "../components/Mascot/Mascot.js";
import { playSound, playBGM } from "../components/SoundManager.js";

export default function QuizScene() {
    const div = document.createElement("div");
    div.className = "quiz-scene";

    playBGM();

    applyBackground(div);

    // layer UI riêng
    const uiLayer = document.createElement("div");
    uiLayer.className = "ui-layer";

    // 🎮 mascots
    const player = Mascot({
        mascotName: "cat",
        role: "player",
    });

    const enemy = Mascot({
        mascotName: "dog",
        role: "enemy",
    });

    const princess = Mascot({
        mascotName: "princess",
        role: "princess",
    });

    // append theo thứ tự
    div.appendChild(player.el);
    div.appendChild(enemy.el);
    div.appendChild(princess.el);
    div.appendChild(uiLayer);

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

        // 🔥 nếu không còn câu hỏi → win luôn
        if (!q) {
            showResultPopup({
                win: true,
                onRestart: () => {
                    gameState.resetGame();
                    router.navigate(StartScene);
                },
            });
            return;
        }

        uiLayer.innerHTML = `
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

        const answersDiv = uiLayer.querySelector("#answers");
        if (!answersDiv) return;

        // ========= MULTIPLE CHOICE =========
        if (q.typeQuestion === 100) {
            let answersToShow = q.answers.map((a, i) => i);

            // áp dụng buff 50/50
            if (gameState.buffs.fiftyFifty) {
                const wrong = answersToShow.filter(i => i !== q.correctIndex);
                wrong.splice(0, wrong.length - 1);
                answersToShow = [q.correctIndex, ...wrong];
                gameState.buffs.fiftyFifty = false;
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
    async function answer(correct) {
        if (correct) {
            showFloatingText("🎉 GIỎI LẮM!", true);

            playSound("correct");

            await player.attack();

            enemy.el.classList.add("hit-effect");

            setTimeout(() => {
                enemy.el.classList.remove("hit-effect");
            }, 250);

            await enemy.sad();

            gameState.damageBoss();

        } else {
            showFloatingText("😅 SAI RỒI!", false);

            playSound("wrong");

            await enemy.attack();

            player.el.classList.add("hit-effect");

            setTimeout(() => {
                player.el.classList.remove("hit-effect");
            }, 250);

            await player.sad();

            gameState.playerLives--;
        }

        // ===== PLAYER LOSE =====
        if (gameState.playerLives <= 0) {
            playSound("lose");
            await player.dead();
            showResultPopup({
                win: false,
                onRestart: () => router.navigate(StartScene),
            });
            return;
        }

        // ===== BOSS DEFEATED =====
        if (gameState.bossLives <= 0) {
            await enemy.dead();

            const nextStartIndex = (gameState.bossIndex + 1) * QUESTIONS_PER_BOSS;

            // 👉 nếu không còn câu hỏi → WIN
            if (nextStartIndex >= totalQuestions) {
                await enemy.dead();
                playSound("win");
                showResultPopup({
                    win: true,
                    onRestart: () => router.navigate(StartScene),
                });
                return;
            }

            // 👉 còn câu hỏi → chọn buff và sang boss tiếp
            showBuffPopup((buff) => {
                if (buff === "5050") gameState.activate5050();
                if (buff === "life") gameState.addLife();
                if (buff === "double") gameState.activateDoubleDamage();

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

    function showFloatingText(text, good) {
        const el = document.createElement("div");
        el.className = "damage";

        el.style.color = good ? "#2ecc71" : "#ff3b3b";
        el.innerText = text;

        document.body.appendChild(el);

        el.style.left = "50%";
        el.style.top = "35%";
        el.style.transform = "translateX(-50%)";

        setTimeout(() => el.remove(), 800);
    }

    return div;
}