import {Component, OnInit} from '@angular/core';
import {TaquinArray} from '../taquinArray';
import {TaquinCell} from '../taquinCell';

@Component({
  selector: 'app-taquin',
  templateUrl: './taquin.component.html',
  styleUrls: ['./taquin.component.css']
})
export class TaquinComponent implements OnInit {
  private taquinArray = new TaquinArray();
  public cellsArray = this.taquinArray.taquinArray;
  public swapNumber = 1;
  public iterSwap;

  change(): void {
    // array of moves
    const moves = [1, 2, 3, 4]; // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
    const _this = this;
    // SWAP with delay
    (function theLoop(i) {
      setTimeout(function () {
        const x = Math.floor(Math.random() * _this.cellsArray.length);
        const y = Math.floor(Math.random() * _this.cellsArray.length);
        const move = moves[Math.floor(Math.random() * moves.length)];
        const cell = [x, y];
        if ((move === 1 && x === 0) || (move === 2 && x === 2) || (move === 3 && y === 2) || (move === 4 && y === 0)) {
          console.log('MOUVEMENT IMPOSSIBLE');
        } else {
          _this.taquinArray.swap(cell, move);
        }
        if (--i) {          // If i > 0, keep going
          theLoop(i);       // Call the loop again, and pass it the current value of i
        }
      }, 10);
    })(_this.swapNumber);
    // SWAP without delay
    // for (let i = 0; i < this.swapNumber;) {
    //   const x = Math.floor(Math.random() * _this.cellsArray.length);
    //   const y = Math.floor(Math.random() * _this.cellsArray.length);
    //   const move = moves[Math.floor(Math.random() * moves.length)];
    //   const cell = [x, y];
    //   if ((move === 1 && x === 0) || (move === 2 && x === 2) || (move === 3 && y === 2) || (move === 4 && y === 0)) {
    //     console.log('MOUVEMENT IMPOSSIBLE');
    //   } else {
    //     i ++;
    //     _this.taquinArray.swap(cell, move);
    //   }
    // }
  }

  sort(): void {
    this.iterSwap = this.taquinArray.sort();
  }

  switch(cellToSwitch: TaquinCell): void {
    // Coordinates x = vertical array, y = horizontal array
    const voidCoordinates = this.findVoidCell(9);
    const xVoid = voidCoordinates[0];
    const yVoid = voidCoordinates[1];
    // Four movements condition for voidCell = cellToSwitch
    if (xVoid + 1 in this.cellsArray
      && this.cellsArray[xVoid + 1][yVoid] === cellToSwitch) {
      this.taquinArray.swap([xVoid, yVoid], 2);
    } else if (xVoid - 1 in this.cellsArray
      && this.cellsArray[xVoid - 1][yVoid] === cellToSwitch) {
      this.taquinArray.swap([xVoid, yVoid], 1);
    } else if (yVoid + 1 in this.cellsArray[xVoid]
      && this.cellsArray[xVoid][yVoid + 1] === cellToSwitch) {
      this.taquinArray.swap([xVoid, yVoid], 3);
    } else if (yVoid - 1 in this.cellsArray[xVoid]
      && this.cellsArray[xVoid][yVoid - 1] === cellToSwitch) {
      this.taquinArray.swap([xVoid, yVoid], 4);
    }
  }

  findVoidCell(x: number): Array<number> {
    for (let i = 0; i < this.cellsArray.length; i++) {
      for (let j = 0; j < this.cellsArray[i].length; j++) {
        if (this.cellsArray[i][j].value === x) {
          return [i, j];
        }
      }
    }
  }

  pattern(img: string): void {
    for (const entries of this.cellsArray) {
      for (const entry of entries) {
        entry.changePattern(img);
      }
    }
  }

  solvencyTaquin(): boolean {
    const voidCell = this.findVoidCell(9);
    const initVoidCell = [2, 2];
    const xMove = initVoidCell[0] - voidCell[0];
    const ymove = initVoidCell[1] - voidCell[1];
    const finalMove = xMove + ymove;
    let moves = 0;
    const initArrayX = {'1': 0, '2': 0, '3': 0, '4': 1, '5': 1, '6': 1, '7': 2, '8': 2, '9': 2};
    const initArrayY = {'1': 0, '2': 1, '3': 2, '4': 0, '5': 1, '6': 2, '7': 0, '8': 1, '9': 2};
    let x;
    let y;

    for (const entries of this.cellsArray) {
      for (const entry of entries) {
        const u = entries.indexOf(entry);
        console.log(u);
        if (u > -1) {
          x = Math.abs(initArrayX[entry.value] - entries.indexOf(entry));
          y = Math.abs(initArrayY[entry.value] - this.cellsArray.indexOf(entries));
          console.log(entries.indexOf(entry));
          console.log(initArrayX[entry.value]);
          console.log(initArrayY[entry.value]);
          console.log(this.cellsArray.indexOf(entries));
        }
        moves += (x + y);
      }
    }
    console.log(moves);
    console.log(finalMove);
    return true;
  }

  constructor() {
  }

  ngOnInit() {
  }
}

