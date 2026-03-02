export const gameState = {
    playerLives: 2,

    bossIndex: 0,
    bossLives: 3,

    buffs: {
        fiftyFifty: false,
        doubleDamage: false,
    },

    resetGame() {
        this.playerLives = 2;
        this.bossIndex = 0;
        this.bossLives = 3;
        this.buffs.fiftyFifty = false;
        this.buffs.doubleDamage = false;
    },

    damageBoss() {
        let damage = 1;

        if (this.buffs.doubleDamage) {
            damage = 2;
            this.buffs.doubleDamage = false;
        }

        this.bossLives -= damage;
    },

    damagePlayer() {
        this.playerLives--;
    },

    nextBoss() {
        this.bossIndex++;
        this.bossLives = 3;
        this.buffs.fiftyFifty = false;
    },

    addLife() {
        this.playerLives++;
    },

    activate5050() {
        this.buffs.fiftyFifty = true;
    },

    activateDoubleDamage() {
        this.buffs.doubleDamage = true;
    }
};