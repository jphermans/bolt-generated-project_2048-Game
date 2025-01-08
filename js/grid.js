export class Grid {
  constructor() {
    this.size = 4;
    this.cells = Array(this.size * this.size).fill(null);
    this.lastMoveScore = 0;
    this.gameBoard = document.getElementById('game-board');
    this.initializeBoard();
    this.addRandomTile();
    this.addRandomTile();
  }

  initializeBoard() {
    this.gameBoard.innerHTML = '';
    for (let i = 0; i < this.size * this.size; i++) {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      this.gameBoard.appendChild(tile);
    }
    this.tiles = Array.from(this.gameBoard.children);
  }

  addRandomTile() {
    const emptyCells = this.cells.reduce((acc, cell, index) => {
      if (!cell) acc.push(index);
      return acc;
    }, []);
    
    if (emptyCells.length) {
      const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const value = Math.random() < 0.9 ? 2 : 4;
      this.cells[randomIndex] = value;
      this.updateDisplay();
    }
  }

  move(direction) {
    this.lastMoveScore = 0;
    const oldCells = [...this.cells];
    
    switch (direction) {
      case 'ArrowLeft': this.moveLeft(); break;
      case 'ArrowRight': this.moveRight(); break;
      case 'ArrowUp': this.moveUp(); break;
      case 'ArrowDown': this.moveDown(); break;
    }

    const moved = JSON.stringify(oldCells) !== JSON.stringify(this.cells);
    if (moved) this.updateDisplay();
    return moved;
  }

  moveLeft() {
    for (let row = 0; row < this.size; row++) {
      const rowCells = this.getRow(row).filter(cell => cell !== null);
      const mergedRow = this.mergeCells(rowCells);
      while (mergedRow.length < this.size) mergedRow.push(null);
      this.setRow(row, mergedRow);
    }
  }

  moveRight() {
    for (let row = 0; row < this.size; row++) {
      const rowCells = this.getRow(row).filter(cell => cell !== null).reverse();
      const mergedRow = this.mergeCells(rowCells).reverse();
      while (mergedRow.length < this.size) mergedRow.unshift(null);
      this.setRow(row, mergedRow);
    }
  }

  moveUp() {
    for (let col = 0; col < this.size; col++) {
      const colCells = this.getColumn(col).filter(cell => cell !== null);
      const mergedCol = this.mergeCells(colCells);
      while (mergedCol.length < this.size) mergedCol.push(null);
      this.setColumn(col, mergedCol);
    }
  }

  moveDown() {
    for (let col = 0; col < this.size; col++) {
      const colCells = this.getColumn(col).filter(cell => cell !== null).reverse();
      const mergedCol = this.mergeCells(colCells).reverse();
      while (mergedCol.length < this.size) mergedCol.unshift(null);
      this.setColumn(col, mergedCol);
    }
  }

  mergeCells(cells) {
    const merged = [];
    for (let i = 0; i < cells.length; i++) {
      if (i < cells.length - 1 && cells[i] === cells[i + 1]) {
        merged.push(cells[i] * 2);
        this.lastMoveScore += cells[i] * 2;
        i++;
      } else {
        merged.push(cells[i]);
      }
    }
    return merged;
  }

  getRow(row) {
    return Array(this.size).fill().map((_, i) => this.cells[row * this.size + i]);
  }

  setRow(row, values) {
    values.forEach((value, i) => {
      this.cells[row * this.size + i] = value;
    });
  }

  getColumn(col) {
    return Array(this.size).fill().map((_, i) => this.cells[i * this.size + col]);
  }

  setColumn(col, values) {
    values.forEach((value, i) => {
      this.cells[i * this.size + col] = value;
    });
  }

  updateDisplay() {
    this.cells.forEach((value, index) => {
      const tile = this.tiles[index];
      tile.textContent = value || '';
      tile.dataset.value = value || '';
    });
  }

  getLastMoveScore() {
    return this.lastMoveScore;
  }

  isGameOver() {
    if (this.cells.includes(null)) return false;
    
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size - 1; j++) {
        if (this.cells[i * this.size + j] === this.cells[i * this.size + j + 1]) return false;
        if (this.cells[j * this.size + i] === this.cells[(j + 1) * this.size + i]) return false;
      }
    }
    return true;
  }
}
