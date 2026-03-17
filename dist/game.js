"use strict";
// Memory Game Class
class MemoryGame {
    constructor() {
        this.cards = [];
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
        this.matches = 0;
        this.totalPairs = 10;
        this.goodSound = new Audio("audio/good.mp3");
        this.failSound = new Audio("audio/fail.mp3");
        this.cardsContainer = document.getElementById("cards");
        this.progressBar = document.getElementById("progress");
        this.clickSound = new Audio("audio/flip.mp3");
        this.init();
        const backAudio = new Audio("audio/fulltrack.mp3");
        backAudio.play();
    }
    // Initialize Game
    init() {
        const images = [
            "./images/0.jpg",
            "./images/1.jpg",
            "./images/2.jpg",
            "./images/3.jpg",
            "./images/4.jpg",
            "./images/5.jpg",
            "./images/6.jpg",
            "./images/7.jpg",
            "./images/8.jpg",
            "./images/9.jpg"
        ];
        // Duplicate images (10 pairs = 20 cards)
        const duplicatedImages = [...images, ...images];
        // Create card objects
        this.cards = duplicatedImages.map((img, index) => ({
            id: index,
            image: img,
            isFlipped: false,
            isMatched: false
        }));
        this.shuffleCards();
        this.renderCards();
    }
    // Shuffle Cards (Fisher-Yates)
    shuffleCards() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }
    // Render Cards to DOM
    renderCards() {
        this.cardsContainer.innerHTML = "";
        this.cards.forEach((card) => {
            const col = document.createElement("div");
            col.className = "col-lg-2 col-md-3 col-4 mb-3";
            const cardElement = document.createElement("div");
            cardElement.className = "memory-card";
            cardElement.dataset.id = card.id.toString();
            cardElement.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <img src="./images/back.jpg" class="img-fluid w-100" />
        </div>
        <div class="card-back">
          <img src="${card.image}" class="img-fluid w-100" />
        </div>
      </div>
    `;
            cardElement.addEventListener("click", () => this.handleCardClick(card, cardElement));
            col.appendChild(cardElement);
            this.cardsContainer.appendChild(col);
        });
    }
    // Handle Card Click
    handleCardClick(card, element) {
        if (this.lockBoard || card.isFlipped || card.isMatched)
            return;
        this.playSound();
        this.flipCard(card, element);
        if (!this.firstCard) {
            this.firstCard = card;
            return;
        }
        this.secondCard = card;
        this.lockBoard = true;
        this.checkMatch();
    }
    // Flip Card
    flipCard(card, element) {
        card.isFlipped = true;
        element.classList.add("flipped");
    }
    // Check Match Logic
    checkMatch() {
        if (!this.firstCard || !this.secondCard)
            return; // Safety check
        if (this.firstCard.image === this.secondCard.image) {
            this.firstCard.isMatched = true;
            this.secondCard.isMatched = true;
            this.matches++;
            this.goodSound.play();
            this.updateProgress();
            this.resetTurn();
        }
        else {
            setTimeout(() => {
                this.failSound.play();
                this.unflipCards();
            }, 1000);
        }
    }
    // Unflip Cards
    unflipCards() {
        const cardElements = document.querySelectorAll(".memory-card");
        cardElements.forEach((el) => {
            const id = Number(el.dataset.id);
            const card = this.cards.find(c => c.id === id);
            if (card && !card.isMatched) {
                card.isFlipped = false;
                el.classList.remove("flipped");
            }
        });
        this.resetTurn();
    }
    // Reset Turn
    resetTurn() {
        this.firstCard = null;
        this.secondCard = null;
        this.lockBoard = false;
    }
    // Update Progress Bar
    updateProgress() {
        const progress = (this.matches / this.totalPairs) * 100;
        if (progress === 100) {
            setTimeout(() => {
                alert("Congratulations! You've matched all pairs!");
                const gameOver = new Audio("audio/game-over.mp3");
                gameOver.play();
            }, 500);
        }
        this.progressBar.style.width = `${progress}%`;
        this.progressBar.textContent = `${Math.round(progress)}%`;
    }
    // Play Audio
    playSound() {
        this.clickSound.currentTime = 0;
        this.clickSound.play();
    }
}
// Start Game
window.addEventListener("DOMContentLoaded", () => {
    new MemoryGame();
});
