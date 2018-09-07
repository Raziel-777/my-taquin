import {Component, OnInit} from '@angular/core';
import {TaquinArray} from '../taquinArray';
import {TaquinCell} from '../taquinCell';
import {PatternService} from '../index/pattern.service';
import {a} from '@angular/core/src/render3';

@Component({
  selector: 'app-taquin',
  templateUrl: './taquin.component.html',
  styleUrls: ['./taquin.component.css']
})

// --- MAIN COMPONENT TAQUIN --- //
export class TaquinComponent implements OnInit {
  private taquinArray = new TaquinArray();
  public taquinDisplay = this.taquinArray.taquinArray;
  public swapNumber = 1;
  public iterSwap;
  public solvency = null;
  private movements = [];
  private emptyCase = [];
  private flag;
  private voidCellValue = this.taquinDisplay.length * this.taquinDisplay[1].length;
  private initial = {'1': [0, 0], '2': [0, 1], '3': [0, 2], '4': [1, 0], '5': [1, 1], '6': [1, 2], '7': [2, 0], '8': [2, 1], '9': [2, 2]};

  constructor(private patternService: PatternService) {
    patternService.changePattern$.subscribe(pattern => {
      this.changePattern(pattern);
    });
  }

  ngOnInit() {
  }

  // Method to swap swapNumber cells
  change(): void {
    this.solvency = null;
    // array of moves
    const moves = [1, 2, 3, 4]; // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
    const self = this;
    // SWAP with delay
    (function theLoop(i) {
      setTimeout(function () {
        const x = Math.floor(Math.random() * self.taquinDisplay.length);
        const y = Math.floor(Math.random() * self.taquinDisplay.length);
        const move = moves[Math.floor(Math.random() * moves.length)];
        const cell = [x, y];
        if ((move === 1 && x === 0) || (move === 2 && x === 2) || (move === 3 && y === 2) || (move === 4 && y === 0)) {
          console.log('CAN\'T MOVE');
        } else {
          self.taquinArray.swap(cell, move);
        }
        if (--i) {          // If i > 0, keep going
          theLoop(i);       // Call the loop again, and pass it the current value of i
        }
      }, 10);
    })(self.swapNumber);
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

  // Auto sort 2D taquin
  sort(): void {
    this.solvency = null;
    this.iterSwap = this.taquinArray.sort();
  }

  // Method to switch voidCell with one good cell to switch (taquin classic)
  switch(cellToSwitch: TaquinCell): void {
    // Coordinates x = vertical array, y = horizontal array
    const voidCoordinates = this.findCoordinates(this.taquinDisplay, this.voidCellValue);
    const xVoid = voidCoordinates[0];
    const yVoid = voidCoordinates[1];
    // Four movements condition for voidCell = cellToSwitch
    if (xVoid + 1 in this.taquinDisplay
      && this.taquinDisplay[xVoid + 1][yVoid] === cellToSwitch) {
      this.taquinArray.swap([xVoid, yVoid], 2);
    } else if (xVoid - 1 in this.taquinDisplay
      && this.taquinDisplay[xVoid - 1][yVoid] === cellToSwitch) {
      this.taquinArray.swap([xVoid, yVoid], 1);
    } else if (yVoid + 1 in this.taquinDisplay[xVoid]
      && this.taquinDisplay[xVoid][yVoid + 1] === cellToSwitch) {
      this.taquinArray.swap([xVoid, yVoid], 3);
    } else if (yVoid - 1 in this.taquinDisplay[xVoid]
      && this.taquinDisplay[xVoid][yVoid - 1] === cellToSwitch) {
      this.taquinArray.swap([xVoid, yVoid], 4);
    }
  }

  changePattern(pattern: string): void {
    for (const entries of this.taquinDisplay) {
      for (const entry of entries) {
        entry.changePattern(pattern);
      }
    }
  }

  solvencyTaquin(): void {
    // Find void Cell coordinates and calculate number of moves to set at initial position
    const voidCell = this.findCoordinates(this.taquinDisplay, this.voidCellValue);
    const initVoidCell = [this.taquinDisplay.length - 1, this.taquinDisplay[1].length - 1];
    const xVoidMove = initVoidCell[0] - voidCell[0];
    const yVoidMove = initVoidCell[1] - voidCell[1];
    const voidMove = xVoidMove + yVoidMove;
    let moves = 0;
    // Calculate number of transposition of cells adjacent or not, including voidCell, to solve the taquin
    // Array of initial position in natural order [value, index]
    const initArray = {'0': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6, '6': 7, '7': 8, '8': 9};
    // Build one dimensional array with initial cellsArray
    const cellsFinal = [];
    for (const entries of this.taquinDisplay) {
      for (const entry of entries) {
        cellsFinal.push(entry);
      }
    }
    for (let i = cellsFinal.length - 1; i >= 0; i--) {
      if (initArray[i] !== cellsFinal[i].value) {
        moves++;
        const tempCell = cellsFinal[i];
        const u = cellsFinal.findIndex(function (element) {
          return element.value === initArray[i];
        });
        cellsFinal[i] = cellsFinal[u];
        cellsFinal[u] = tempCell;
      }
    }
    // If parity of voidCell moves = parity of total moves for others cells, solvency is true (cf: https://fr.wikipedia.org/wiki/Taquin)
    this.solvency = (moves + voidMove) % 2 === 0;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //            MAIN METHOD FOR RESOLVE TAQUIN        /////////////////////////////////////////////////////////////////////////
  resolve() {
    // Clone taquin before processing resolve
    const cellsArray = this.taquinDisplay.map(x => Object.assign([], x));
    let coordinates = [];
    let value;
    for (let i = 0; i < cellsArray.length - 2; i++) {
      for (let j = 0; j < cellsArray[i].length - 2; j++) {
        value = i * cellsArray.length + j * cellsArray[i].length + 1;
        coordinates = this.findCoordinates(cellsArray, value);
        if (coordinates !== this.initial[value]) {
          this.voidCellPositioning(cellsArray, value);
          this.movement(cellsArray, value, this.initial[value]);
        }
      }
      // Coordinates of two last cells of 2 lines
      const coord1 = [i, cellsArray[i].length - 1];
      const coord2 = [i + 1, cellsArray[i + 1].length - 1];
      // Value of two last cells in the taquin
      const val1 = cellsArray[coord1[0]][coord1[1]].value;
      const val2 = cellsArray[coord2[0]][coord2[1]].value;
      // Value of two last cells of 2 lines // WARNING natural value start at 0, but in my taquin value start at 1, so we add 1
      const initVal1 = i * cellsArray.length + cellsArray[i].length - 1;
      const initVal2 = i * cellsArray.length + cellsArray[i].length;
      if (val1 === initVal1 && val2 === initVal2) {
        this.move(cellsArray, 1, 3);
        this.move(cellsArray, 1, 2);
      } else {
        // Value of the last cell and his coordinates, this cell must not be at three bad position
        // This is initVal2
        // Value of three bad position
        // This is val1, val2 and val3
        const val3 = cellsArray[coord2[0]][coord2[1] - 1].value;
        if (initVal2 === val1 || initVal2 === val2 || initVal2 === val3) {
          this.voidCellPositioning(cellsArray, initVal2);
          this.movement(cellsArray, initVal2, [coord2[0], coord2[1] - 2]);
        }
        if (cellsArray[coord1[0]][coord1[1]].value !== initVal1) {
          this.voidCellPositioning(cellsArray, initVal1);
          this.movement(cellsArray, initVal1, [coord1[0], coord1[1]]);
        }
        if (cellsArray[coord2[0]][coord2[1]].value !== initVal2) {
          this.voidCellPositioning(cellsArray, initVal2);
          this.movement(cellsArray, initVal2, [coord2[0], coord2[1]]);
        }
        this.lastHook(cellsArray);
      }
    }
    // Case vide mise tout à gauche
    for (let i = 0; i < cellsArray[cellsArray.length - 2].length - 1; i++) {
      this.move(cellsArray, 1, 4);
    }
    for (let i = 0; i < cellsArray[cellsArray.length - 2].length - 2; i++) {
      const val1 = cellsArray[cellsArray.length - 2].length * (cellsArray.length - 2) + i + 1; // +1 because value start 1
      const val2 = cellsArray[cellsArray.length - 2].length * (cellsArray.length - 2) +
        cellsArray[cellsArray.length - 2].length + i + 1; // +1 because value start 1
      const val3 = val1 + 1;
      const val4 = val2 + 1;
      // Coordinates
      const coord1 = this.findCoordinates(cellsArray, val1);
      const coord2 = this.findCoordinates(cellsArray, val2);
      const initCoord1 = this.initial[val1];
      const initCoord2 = this.initial[val2];
      const initCoord3 = this.initial[val3];
      const initCoord4 = this.initial[val4];
      if (coord1 === initCoord1 && coord2 === initCoord2) {
        this.move(cellsArray, 1, 2);
        this.move(cellsArray, 1, 3);
        this.move(cellsArray, 1, 1);
      } else {
        if (coord2 === initCoord2 || coord2 === initCoord3 || coord2 === initCoord4) {
          this.voidCellPositioning(cellsArray, val2);
          this.movement(cellsArray, val2, this.initial[val1 + 2]);
        }
        if (cellsArray[cellsArray.length - 1][i].value !== val1) {
          this.voidCellPositioning(cellsArray, val1);
          this.movement(cellsArray, val1, this.initial[val2]);
        }
        if (cellsArray[cellsArray.length - 1][i + 1].value !== val2) {
          this.voidCellPositioning(cellsArray, val2);
          this.movement(cellsArray, val2, this.initial[val2 + 1]);
        }
        this.hook(cellsArray);
      }
    }
    this.final(cellsArray);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //            MOVEMENTS        //////////////////////////////////////////////////////////////////////////////////////////////
  // Method to move cell at his initial position with this.initial when voidCell is positioning
  movement(array: Array<Array<TaquinCell>>, value: number, finalCoordinates: Array<number>) {
    let coordinates = this.findCoordinates(array, value);
    let diffVert = coordinates[0] - finalCoordinates[0];
    let diffHori = coordinates[1] - finalCoordinates[1];
    if (diffVert > 0 && diffHori > 0 && this.flag === 1) {
      this.upRight(array, diffVert);
      this.movingLeftByDown(array, diffHori);
    } else if (diffVert > 0 && diffHori === 0 && this.flag === 1) {
      this.upRight(array, diffVert);
    } else if (diffVert > 0 && diffHori > 0 && this.flag === -1) {
      this.upLeft(array, diffVert);
      this.move(array, 1, 3);
      this.movingLeftByDown(array, diffHori - 1);
    } else if (diffVert > 0 && diffHori === 0 && this.flag === -1) {
      if (coordinates[1] === array[coordinates[0]].length - 1) {
        this.upLeft(array, diffVert);
      } else if (coordinates[1] < array[coordinates[0]].length - 1) {
        if (coordinates[0] === array.length - 1) {
          this.hookUp(array);
          this.upRight(array, diffVert);
        } else if (coordinates[0] < array.length - 1) {
          this.hookDown(array);
          this.upRight(array, diffVert);
        }
      }
    } else if (diffVert > 0 && diffHori < 0 && this.flag === 1) {
      if (coordinates[0] === array.length - 1) {
        this.move(array, 1, 4);
        this.movingRightByTop(array, -diffHori - 1);
        coordinates = this.findCoordinates(array, value);
        diffVert = coordinates[0] - finalCoordinates[0];
        if (coordinates[1] < array[coordinates[0]].length - 1) {
          this.hookUp(array);
          this.upRight(array, diffVert);
        } else if (coordinates[1] === array[coordinates[0]].length - 1) {
          this.upLeft(array, diffVert);
        }
      } else if (coordinates[0] < array.length - 1) {
        this.move(array, 1, 4);
        this.movingRightByDown(array, -diffHori - 1);
        coordinates = this.findCoordinates(array, value);
        diffVert = coordinates[0] - finalCoordinates[0];
        if (coordinates[1] < array[coordinates[0]].length - 1) {
          this.hookDown(array);
          this.upLeft(array, diffVert);
        } else if (coordinates[1] === array[coordinates[0]].length - 1) {
          this.upLeft(array, diffVert);
        }
      }
    } else if (diffVert > 0 && diffHori < 0 && this.flag === -1) {
      if (coordinates[0] === array.length - 1) {
        this.movingRightByTop(array, -diffHori);
        coordinates = this.findCoordinates(array, value);
        diffVert = coordinates[0] - finalCoordinates[0];
        if (coordinates[1] < array[coordinates[0]].length - 1) {
          this.hookUp(array);
          this.upRight(array, diffVert - 1);
        } else if (coordinates[1] === array[coordinates[0]].length - 1) {
          this.upLeft(array, diffVert);
        }
      } else if (coordinates[0] < array.length - 1) {
        this.movingRightByDown(array, -diffHori);
        coordinates = this.findCoordinates(array, value);
        diffVert = coordinates[0] - finalCoordinates[0];
        if (coordinates[1] < array[coordinates[0]].length - 1) {
          this.hookDown(array);
          this.upRight(array, diffVert);
        } else if (coordinates[1] === array[coordinates[0]].length - 1) {
          this.upLeft(array, diffVert);
        }
      }
    } else if (diffVert === 0 && diffHori < 0 && this.flag === 1) {
      if (coordinates[1] === array.length - 1) {
        this.move(array, 1, 4);
        this.movingRightByTop(array, -diffHori - 1);
      } else if (coordinates[1] < array.length - 1) {
        this.move(array, 1, 4);
        this.movingRightByDown(array, -diffHori - 1);
      }
    } else if (diffVert === 0 && diffHori < 0 && this.flag === -1) {
      if (coordinates[1] === array.length - 1) {
        this.movingRightByTop(array, -diffHori);
      } else if (coordinates[1] === array.length - 1) {
        this.movingRightByDown(array, -diffHori);
      }
    } else if (diffVert === 0 && diffHori > 0 && this.flag === 1) {
      if (coordinates[1] === array.length - 1) {
        this.movingLeftByTop(array, diffHori);
      } else if (coordinates[1] < array.length - 1) {
        this.movingLeftByDown(array, diffHori);
      }
    } else if (diffVert === 0 && diffHori > 0 && this.flag === -1) {
      if (coordinates[1] === array.length - 1) {
        this.move(array, 1, 3);
        this.movingLeftByTop(array, diffHori - 1);
      } else if (coordinates[1] < array.length - 1) {
        this.move(array, 1, 3);
        this.movingLeftByDown(array, diffHori - 1);
      }
    } else if (diffVert < 0 && diffHori > 0 && this.flag === 1) {
      this.downRight(array, -diffVert);
      coordinates = this.findCoordinates(array, value);
      diffHori = coordinates[1] - finalCoordinates[1];
      if (coordinates[1] < array.length - 1) {
        this.movingLeftByDown(array, diffHori);
      } else if (coordinates[1] === array.length - 1) {
        this.movingLeftByTop(array, diffHori);
      }
    } else if (diffVert < 0 && diffHori > 0 && this.flag === -1) {
      this.downLeft(array, -diffVert);
      coordinates = this.findCoordinates(array, value);
      diffHori = coordinates[1] - finalCoordinates[1];
      if (coordinates[1] < array.length - 1) {
        this.move(array, 1, 3);
        this.movingLeftByDown(array, diffHori - 1);
      } else if (coordinates[1] < array.length - 1) {
        this.move(array, 1, 3);
        this.movingLeftByTop(array, diffHori - 1);
      }
    } else if (diffVert < 0 && diffHori < 0 && this.flag === 1) {
      this.downRight(array, -diffVert);
      this.move(array, 1, 4);
      this.movingRightByTop(array, -diffHori - 1);
    } else if (diffVert < 0 && diffHori < 0 && this.flag === -1) {
      this.downLeft(array, -diffVert);
      this.movingRightByTop(array, -diffHori);
    } else if (diffVert < 0 && diffHori === 0 && this.flag === 1) {
      this.downRight(array, -diffVert);
    } else if (diffVert < 0 && diffHori === 0 && this.flag === -1) {
      this.downLeft(array, -diffVert);
    }
  }

  // Hook
  hook(array: Array<Array<TaquinCell>>) {
    this.move(array, 1, 1);
    this.move(array, 1, 4);
    this.move(array, 1, 4);
    this.move(array, 1, 2);
    this.move(array, 1, 3);
    this.move(array, 1, 1);
  }

  // Last hook of each line
  lastHook(array: Array<Array<TaquinCell>>) {
    this.move(array, 1, 1);
    this.move(array, 1, 3);
    this.move(array, 1, 2);
  }

  // Final cycle
  final(array: Array<Array<TaquinCell>>) {
    this.move(array, 1, 3);
    // Calculate value of cell to check (N-2 and P-2)
    // Value of three check cells for final cycle
    const val1 = (array.length - 2) * array[array.length - 2].length + array[array.length - 2].length - 1;
    const val2 = val1 + 1;
    const val3 = val1 + array[array.length - 2].length;
    // Coordinates of multiple value
    const coord1 = this.findCoordinates(array, val1);
    const coord2 = this.findCoordinates(array, val2);
    const coord3 = this.findCoordinates(array, val3);
    const coordInit = this.initial[val1];
    if (coord1 === coordInit) {
      this.move(array, 1, 2);
    } else if (coord2 === coordInit) {
      this.move(array, 1, 4);
      this.move(array, 1, 2);
      this.move(array, 1, 3);
    } else if (coord3 === coordInit) {
      this.move(array, 1, 2);
      this.move(array, 1, 4);
      this.move(array, 1, 1);
      this.move(array, 1, 3);
      this.move(array, 1, 2);
    }
  }

  // Position the voidCell at right or left of the cellToMove (prefer right except when ycellToMove = max y)
  // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  voidCellPositioning(array: Array<Array<TaquinCell>>, value: number) {
    this.emptyCase = this.findCoordinates(array, this.voidCellValue); // [x, y] voidCell
    const coordCell = this.findCoordinates(array, value); // [x, y] cellToMove
    const diffVert = this.emptyCase[0] - coordCell[0]; // =0 same line >0 void under cell <0 upper
    const diffHori = this.emptyCase[1] - coordCell[1]; // =0 same column >0 at right <0 at left
    if (diffVert >= 0 && diffHori > 0) {
      this.move(array, diffVert, 1);
      this.move(array, diffHori - 1, 4);
      this.flag = 1;
    } else if (diffVert > 0 && diffHori === 0) {
      this.move(array, diffVert - 1, 1);
      if (this.emptyCase[1] < array[this.emptyCase[0]].length - 1) {
        this.move(array, 1, 3);
        this.move(array, 1, 1);
        this.flag = 1;
      } else if (this.emptyCase[1] === array[this.emptyCase[0]].length - 1) {
        this.move(array, 1, 4);
        this.move(array, 1, 1);
        this.flag = -1;
      }
    } else if (diffVert > 0 && diffHori < 0) {
      this.move(array, -diffHori, 3);
      this.move(array, diffVert - 1, 1);
      if (this.emptyCase[1] < array[this.emptyCase[0]].length - 1) {
        this.move(array, 1, 3);
        this.move(array, 1, 1);
        this.flag = 1;
      } else if (this.emptyCase[1] === array[this.emptyCase[0]].length - 1) {
        this.move(array, 1, 4);
        this.move(array, 1, 1);
        this.flag = -1;
      }
    } else if (diffVert === 0 && diffHori > 0) {
      this.move(array, diffHori - 1, 4);
      this.flag = 1;
    } else if (diffVert === 0 && diffHori < 0) {
      this.move(array, -diffHori - 1, 3);
      this.flag = -1;
    } else if (diffVert < 0 && diffHori > 0) {
      this.move(array, -diffVert, 2);
      this.move(array, diffHori - 1, 4);
      this.flag = 1;
    } else if (diffVert < 0 && diffHori === 0) {
      this.move(array, -diffVert - 1, 2);
      if (this.emptyCase[1] < array[this.emptyCase[0]].length - 1) {
        this.move(array, 1, 3);
        this.move(array, 1, 2);
        this.flag = 1;
      } else if (this.emptyCase[1] === array[this.emptyCase[0]].length - 1) {
        this.move(array, 1, 4);
        this.move(array, 1, 2);
        this.flag = -1;
      }
    } else if (diffVert < 0 && diffHori < 0) {
      this.move(array, -diffHori - 1, 3);
      this.move(array, -diffVert, 2);
      this.flag = -1;
    }
  }

  // CLIMB OR DOWN ONE CELL
  // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  // VoidCell at left of the cellToUp
  upLeft(array: Array<Array<TaquinCell>>, x: number) {
    for (let i = 0; i < x; i++) {
      this.move(array, 1, 1);
      this.move(array, 1, 3);
      this.move(array, 1, 2);
      this.move(array, 1, 4);
      this.move(array, 1, 1);
    }
  }

  downLeft(array: Array<Array<TaquinCell>>, x: number) {
    for (let i = 0; i < x; i++) {
      this.move(array, 1, 2);
      this.move(array, 1, 3);
      this.move(array, 1, 1);
      this.move(array, 1, 4);
      this.move(array, 1, 2);
    }
  }

  // VoidCell at right of the cellToUp
  upRight(array: Array<Array<TaquinCell>>, x: number) {
    for (let i = 0; i < x; i++) {
      this.move(array, 1, 1);
      this.move(array, 1, 4);
      this.move(array, 1, 2);
      this.move(array, 1, 3);
      this.move(array, 1, 1);
    }
  }

  downRight(array: Array<Array<TaquinCell>>, x: number) {
    for (let i = 0; i < x; i++) {
      this.move(array, 1, 2);
      this.move(array, 1, 4);
      this.move(array, 1, 1);
      this.move(array, 1, 3);
      this.move(array, 1, 2);
    }
  }

  // MOVING LEFT OR RIGHT ONE CELL
  // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  // Moving from top
  movingLeftByTop(array: Array<Array<TaquinCell>>, x: number) {
    for (let i = 0; i < x; i++) {
      this.move(array, 1, 1);
      this.move(array, 1, 4);
      this.move(array, 1, 4);
      this.move(array, 1, 2);
      this.move(array, 1, 3);
    }
  }

  movingRightByTop(array: Array<Array<TaquinCell>>, x: number) {
    for (let i = 0; i < x; i++) {
      this.move(array, 1, 1);
      this.move(array, 1, 3);
      this.move(array, 1, 3);
      this.move(array, 1, 2);
      this.move(array, 1, 4);
    }
  }

  // Moving from down
  movingLeftByDown(array: Array<Array<TaquinCell>>, x: number) {
    for (let i = 0; i < x; i++) {
      this.move(array, 1, 2);
      this.move(array, 1, 4);
      this.move(array, 1, 4);
      this.move(array, 1, 1);
      this.move(array, 1, 3);
    }
  }

  movingRightByDown(array: Array<Array<TaquinCell>>, x: number) {
    for (let i = 0; i < x; i++) {
      this.move(array, 1, 2);
      this.move(array, 1, 3);
      this.move(array, 1, 3);
      this.move(array, 1, 1);
      this.move(array, 1, 4);
    }
  }

  // Hook for move cellVoid around cell to move (up or down and right)
  hookUp(array: Array<Array<TaquinCell>>) {
    this.move(array, 1, 1);
    this.move(array, 1, 3);
    this.move(array, 1, 3);
    this.move(array, 1, 2);
  }

  hookDown(array: Array<Array<TaquinCell>>) {
    this.move(array, 1, 2);
    this.move(array, 1, 3);
    this.move(array, 1, 3);
    this.move(array, 1, 1);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //            UTILITIES        //////////////////////////////////////////////////////////////////////////////////////////////
  // Find coordinates of cell with his value
  findCoordinates(array: Array<Array<TaquinCell>>, x: number): Array<number> {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j].value === x) {
          return [i, j];
        }
      }
    }
  }

  move(array: Array<Array<TaquinCell>>, diff: number, destination: number) {
    for (let i = 0; i < diff; i++) {
      this.emptyCase = this.findCoordinates(array, this.voidCellValue);
      this.movements.push(destination);
      const tempCell = array[this.emptyCase[0]][this.emptyCase[1]];
      switch (destination) {
        case 1:
          array[this.emptyCase[0]][this.emptyCase[1]] = array[this.emptyCase[0] - 1][this.emptyCase[1]];
          array[this.emptyCase[0] - 1][this.emptyCase[1]] = tempCell;
          break;
        case 2:
          array[this.emptyCase[0]][this.emptyCase[1]] = array[this.emptyCase[0] + 1][this.emptyCase[1]];
          array[this.emptyCase[0] + 1][this.emptyCase[1]] = tempCell;
          break;
        case 3:
          array[this.emptyCase[0]][this.emptyCase[1]] = array[this.emptyCase[0]][this.emptyCase[1] + 1];
          array[this.emptyCase[0]][this.emptyCase[1] + 1] = tempCell;
          break;
        case 4:
          array[this.emptyCase[0]][this.emptyCase[1]] = array[this.emptyCase[0]][this.emptyCase[1] - 1];
          array[this.emptyCase[0]][this.emptyCase[1] - 1] = tempCell;
          break;
      }
    }
  }

  goMove() {
    const self = this;
    setTimeout(() => {
      const firstElement = self.movements[0];
      if (firstElement) {
        self.taquinArray.swap(firstElement['coordinates'], firstElement['destination']);
        self.movements.splice(0, 1);
      }
      self.goMove();
    }, 100);
  }
}

