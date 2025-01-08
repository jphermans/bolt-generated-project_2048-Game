import { Grid } from './grid.js';

export class Game {
  constructor() {
    this.grid = new Grid();
    this.score = 0;
    this.bestScore = parseInt(localStorage.getItem('bestScore')) || 0;
    this.setupEventListeners();
    this.updateScore();
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const moved = this.grid.move(e.key);
        if (moved) {
          this.score += this.grid.getLastMoveScore();
          this.updateScore();
          this.grid.addRandomTile();
          if (this.grid.isGameOver()) {
            alert('Game Over!');
          }
        }
      }
    });
  }

  updateScore() {
    document.getElementById('score').textContent = this.score;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem('bestScore', this.bestScore);
      document.getElementById('best-score').textContent = this.bestScore;
    }
  }
}
