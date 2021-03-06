import {Component, OnInit} from '@angular/core';
import {TaquinArray} from '../taquinArray';
import {TaquinCell} from '../taquinCell';
import {PatternService} from '../index/pattern.service';

@Component({
  selector: 'app-taquin',
  templateUrl: './taquin.component.html',
  styleUrls: ['./taquin.component.css']
})

// --- MAIN COMPONENT TAQUIN --- //
export class TaquinComponent implements OnInit {
  private taquinObject: TaquinArray;
  public taquin;
  // Clone taquin before processing resolve
  private cellsArray: Array<Array<TaquinCell>>;
  public swapNumber = 1;
  public iterSwap;
  public solvency = null;
  private movements = [];
  private emptyCase = [];
  private flag;
  private voidCellValue;
  private initial;
  public failed = null;
  public cellsNumber = 3;

  constructor(private patternService: PatternService) {
    patternService.changePattern$.subscribe(pattern => {
      this.changePattern(pattern);
    });
  }

  ngOnInit() {
    this.taquinObject = new TaquinArray(3);
    this.taquin = this.taquinObject.taquinArray;
    this.cellsArray = this.taquin.map(x => Object.assign([], x));
    this.voidCellValue = this.taquinObject.voidCellValue;
    this.initial = this.taquinObject.naturalTaquin;
  }

  newTaquin() {
    this.solvency = null;
    this.movements = [];
    this.failed = null;
    this.taquinObject = new TaquinArray(this.cellsNumber);
    this.taquin = this.taquinObject.taquinArray;
    this.cellsArray = this.taquin.map(x => Object.assign([], x));
    this.voidCellValue = this.taquinObject.voidCellValue;
    this.initial = this.taquinObject.naturalTaquin;
  }

  // Method to swap swapNumber cells
  change(): void {
    this.failed = null;
    this.solvency = null;
    // array of moves
    const moves = [1, 2, 3, 4]; // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
    const self = this;
    // SWAP with delay
    (function theLoop(i) {
      setTimeout(function () {
        const x = Math.floor(Math.random() * self.taquin.length);
        const y = Math.floor(Math.random() * self.taquin.length);
        const move = moves[Math.floor(Math.random() * moves.length)];
        const cell = [x, y];
        if ((move === 1 && x === 0) || (move === 2 && x === 2) || (move === 3 && y === 2) || (move === 4 && y === 0)) {
          console.log('CAN\'T MOVE');
        } else {
          self.swap(self.taquin, cell, move);
        }
        if (--i) {          // If i > 0, keep going
          theLoop(i);       // Call the loop again, and pass it the current value of i
        }
      }, 10);
    })(self.swapNumber);
  }

  // Auto sort 2D taquin
  sort(): void {
    this.solvency = null;
    this.iterSwap = this.taquinObject.sort();
  }

  // Method to switch voidCell with one good cell to switch (taquin classic)
  switch(cellToSwitch: TaquinCell): void {
    // Coordinates x = vertical array, y = horizontal array
    const voidCoordinates = TaquinArray.findCoordinates(this.taquin, this.voidCellValue);
    const xVoid = voidCoordinates[0];
    const yVoid = voidCoordinates[1];
    // Four movements condition for voidCell = cellToSwitch
    if (xVoid + 1 in this.taquin && this.taquin[xVoid + 1][yVoid] === cellToSwitch) {
      this.swap(this.taquin, [xVoid, yVoid], 2);
    } else if (xVoid - 1 in this.taquin && this.taquin[xVoid - 1][yVoid] === cellToSwitch) {
      this.swap(this.taquin, [xVoid, yVoid], 1);
    } else if (yVoid + 1 in this.taquin[xVoid] && this.taquin[xVoid][yVoid + 1] === cellToSwitch) {
      this.swap(this.taquin, [xVoid, yVoid], 3);
    } else if (yVoid - 1 in this.taquin[xVoid] && this.taquin[xVoid][yVoid - 1] === cellToSwitch) {
      this.swap(this.taquin, [xVoid, yVoid], 4);
    }
  }

  changePattern(pattern: string): void {
    for (const entries of this.taquin) {
      for (const entry of entries) {
        entry.switchPattern(pattern);
      }
    }
  }

  // Movements // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  swap(array: Array<Array<TaquinCell>>, coordinates: Array<number>, movement: number): void {
    const tempCell = array[coordinates[0]][coordinates[1]];
    switch (movement) {
      case 1:
        array[coordinates[0]][coordinates[1]] = array[coordinates[0] - 1][coordinates[1]];
        array[coordinates[0] - 1][coordinates[1]] = tempCell;
        break;
      case 2:
        array[coordinates[0]][coordinates[1]] = array[coordinates[0] + 1][coordinates[1]];
        array[coordinates[0] + 1][coordinates[1]] = tempCell;
        break;
      case 3:
        array[coordinates[0]][coordinates[1]] = array[coordinates[0]][coordinates[1] + 1];
        array[coordinates[0]][coordinates[1] + 1] = tempCell;
        break;
      case 4:
        array[coordinates[0]][coordinates[1]] = array[coordinates[0]][coordinates[1] - 1];
        array[coordinates[0]][coordinates[1] - 1] = tempCell;
        break;
    }
  }

  solvencyTaquin(): void {
    // Find void Cell coordinates and calculate number of moves to set at initial position
    const voidCell = TaquinArray.findCoordinates(this.taquin, this.voidCellValue);
    const initVoidCell = [this.taquin.length - 1, this.taquin[1].length - 1];
    const xVoidMove = initVoidCell[0] - voidCell[0];
    const yVoidMove = initVoidCell[1] - voidCell[1];
    const voidMove = xVoidMove + yVoidMove;
    let moves = 0;
    const self = this;
    // Calculate number of transposition of cells adjacent or not, including voidCell, to solve the taquin
    // Build one dimensional array with taquin
    const oneDimArray = [];
    for (const entries of this.taquin) {
      for (const entry of entries) {
        oneDimArray.push(entry);
      }
    }
    for (let i = oneDimArray.length - 1; i >= 0; i--) {
      if (this.taquinObject.naturalArray[i] !== oneDimArray[i].value) {
        moves++;
        const tempCell = oneDimArray[i];
        // index of cell with which switch in onDimArray
        const switchCell = oneDimArray.findIndex(function (element) {
          return element.value === self.taquinObject.naturalArray[i];
        });
        oneDimArray[i] = oneDimArray[switchCell];
        oneDimArray[switchCell] = tempCell;
      }
    }
    // If parity of voidCell moves = parity of total moves for others cells, solvency is true (cf: https://fr.wikipedia.org/wiki/Taquin)
    this.solvency = (moves + voidMove) % 2 === 0;
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //            MAIN METHOD FOR RESOLVE TAQUIN        /////////////////////////////////////////////////////////////////////////
  resolve() {
    this.cellsArray = this.taquin.map(x => Object.assign([], x));
    const width = this.cellsArray[0].length;
    const deep = this.cellsArray.length;
    for (let i = 0; i < this.cellsArray.length - 2; i++) {
      for (let j = 0; j < this.cellsArray[i].length - 2; j++) {
        const value1 = this.cellsArray[i][j].value;
        const value2 = this.taquinObject.naturalTaquin[i][j].value;
        if (value1 !== value2) {
          this.voidCellPositioning(value2);
          this.movement(value2, [i, j]);
        }
      }
      // Two last cells of each line
      // Coordinates of two last cells of 2 lines
      const coord1 = [i, this.cellsArray[i].length - 1];
      const coord2 = [i + 1, this.cellsArray[i + 1].length - 1];
      // Value of two cells in the taquin
      const val1 = this.cellsArray[coord1[0]][coord1[1]].value;
      const val2 = this.cellsArray[coord2[0]][coord2[1]].value;
      // Value of two last cells of 2 lines
      const initVal1 = this.taquinObject.naturalTaquin[coord1[0]][coord1[1] - 1].value;
      const initVal2 = this.taquinObject.naturalTaquin[coord1[0]][coord1[1]].value;
      // Particular case when 0 is already placed
      const voidValue = this.cellsArray[i][this.cellsArray[i].length - 2].value;
      if (val1 === initVal1 && val2 === initVal2) {
        if (voidValue === this.voidCellValue) {
          this.move(1, 3);
          this.move(1, 2);
        } else {
          this.voidCellPositioning(0); // Go to position just after the first case
          this.move(1, 3);
          this.move(1, 2);
        }
      } else {
        // Value of the last cell and his coordinates, this cell must not be at three bad position
        // Value of three bad position this is val1, val2 and val3
        const val3 = this.cellsArray[coord2[0]][coord2[1] - 1].value;
        if (initVal2 === val1 || initVal2 === val2 || initVal2 === val3) {
          this.voidCellPositioning(initVal2);
          this.movement(initVal2, [coord2[0], coord2[1] - 2]);
        }
        if (this.cellsArray[coord1[0]][coord1[1]].value !== initVal1) {
          this.voidCellPositioning(initVal1);
          this.movement(initVal1, [coord1[0], coord1[1]]);
        }
        if (this.cellsArray[coord2[0]][coord2[1]].value !== initVal2) {
          this.voidCellPositioning(initVal2);
          this.movement(initVal2, [coord2[0], coord2[1]]);
        } else {
          this.move(1, 2);
        }
        this.lastHook();
      }
    }
    // Case vide mise tout à gauche
    for (let i = 0; i < width - 1; i++) {
      this.move(1, 4);
    }
    for (let i = 0; i < width - 2; i++) {
      // initial value
      const initVal1 = width * (deep - 2) + i;
      const initVal2 = width * (deep - 2) + width + i;
      // Values
      let val2 = this.cellsArray[deep - 1][i].value;
      const val3 = this.cellsArray[deep - 2][i + 1].value;
      let val4 = this.cellsArray[deep - 1][i + 1].value;
      if (val2 === initVal1 && val4 === initVal2) {
        this.move(1, 2);
        this.move(1, 3);
        this.move(1, 1);
      } else {
        if (val2 === initVal2 || val3 === initVal2 || val4 === initVal2) {
          this.voidCellPositioning(initVal2);
          this.movement(initVal2, [deep - 2, i + 2]);
        }
        val2 = this.cellsArray[deep - 1][i].value;
        if (val2 !== initVal1) {
          this.voidCellPositioning(initVal1);
          this.movement(initVal1, [deep - 1, i]);
        }
        val4 = this.cellsArray[deep - 1][i + 1].value;
        if (val4 !== initVal2) {
          this.voidCellPositioning(initVal2);
          this.movement(initVal2, [deep - 1, i + 1]);
        }
        this.hook();
      }
    }
    this.final();
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //            MOVEMENTS        //////////////////////////////////////////////////////////////////////////////////////////////
  // Method to move cell at his initial position with this.initial when voidCell is positioning
  // Value = cell to move, finalCoordinates = array of target position
  movement(value: number, finalCoordinates: Array<number>) {
    let cellToMove = TaquinArray.findCoordinates(this.cellsArray, value);
    let diffVert = cellToMove[0] - finalCoordinates[0];
    let diffHori = cellToMove[1] - finalCoordinates[1];
    if (diffVert > 0 && diffHori > 0 && this.flag === 1) {
      this.upRight(diffVert);
      this.strafeLeftByDown(diffHori);
    } else if (diffVert > 0 && diffHori === 0 && this.flag === 1) {
      this.upRight(diffVert);
    } else if (diffVert > 0 && diffHori > 0 && this.flag === -1) {
      this.upLeft(diffVert);
      this.move(1, 3);
      this.strafeLeftByDown(diffHori - 1);
    } else if (diffVert > 0 && diffHori === 0 && this.flag === -1) {
      if (cellToMove[1] === this.cellsArray[cellToMove[0]].length - 1) {
        this.upLeft(diffVert);
      } else if (cellToMove[1] < this.cellsArray[cellToMove[0]].length - 1) {
        if (cellToMove[0] === this.cellsArray.length - 1) {
          this.hookUp();
          this.upRight(diffVert);
        } else if (cellToMove[0] < this.cellsArray.length - 1) {
          this.hookDown();
          this.upRight(diffVert);
        }
      }
    } else if (diffVert > 0 && diffHori < 0 && this.flag === 1) {
      if (cellToMove[0] === this.cellsArray.length - 1) {
        this.move(1, 4);
        this.strafeRightByTop(-diffHori - 1);
        cellToMove = TaquinArray.findCoordinates(this.cellsArray, value);
        diffVert = cellToMove[0] - finalCoordinates[0];
        if (cellToMove[1] < this.cellsArray[cellToMove[0]].length - 1) {
          this.hookUp();
          this.upRight(diffVert);
        } else if (cellToMove[1] === this.cellsArray[cellToMove[0]].length - 1) {
          this.upLeft(diffVert);
        }
      } else if (cellToMove[0] < this.cellsArray.length - 1) {
        this.move(1, 4);
        this.strafeRightByDown(-diffHori - 1);
        cellToMove = TaquinArray.findCoordinates(this.cellsArray, value);
        diffVert = cellToMove[0] - finalCoordinates[0];
        if (cellToMove[1] < this.cellsArray[cellToMove[0]].length - 1) {
          this.hookDown();
          this.upRight(diffVert);
        } else if (cellToMove[1] === this.cellsArray[cellToMove[0]].length - 1) {
          this.upLeft(diffVert);
        }
      }
    } else if (diffVert > 0 && diffHori < 0 && this.flag === -1) {
      if (cellToMove[0] === this.cellsArray.length - 1) {
        this.strafeRightByTop(-diffHori);
        cellToMove = TaquinArray.findCoordinates(this.cellsArray, value);
        diffVert = cellToMove[0] - finalCoordinates[0];
        if (cellToMove[1] < this.cellsArray[cellToMove[0]].length - 1) {
          this.hookUp();
          this.upRight(diffVert - 1);
        } else if (cellToMove[1] === this.cellsArray[cellToMove[0]].length - 1) {
          this.upLeft(diffVert);
        }
      } else if (cellToMove[0] < this.cellsArray.length - 1) {
        this.strafeRightByDown(-diffHori);
        cellToMove = TaquinArray.findCoordinates(this.cellsArray, value);
        diffVert = cellToMove[0] - finalCoordinates[0];
        if (cellToMove[1] < this.cellsArray[cellToMove[0]].length - 1) {
          this.hookDown();
          this.upRight(diffVert);
        } else if (cellToMove[1] === this.cellsArray[cellToMove[0]].length - 1) {
          this.upLeft(diffVert);
        }
      }
    } else if (diffVert === 0 && diffHori < 0 && this.flag === 1) {
      if (cellToMove[0] === this.cellsArray.length - 1) {
        this.move(1, 4);
        this.strafeRightByTop(-diffHori - 1);
      } else if (cellToMove[0] < this.cellsArray.length - 1) {
        this.move(1, 4);
        this.strafeRightByDown(-diffHori - 1);
      }
    } else if (diffVert === 0 && diffHori < 0 && this.flag === -1) {
      if (cellToMove[0] === this.cellsArray.length - 1) {
        this.strafeRightByTop(-diffHori);
      } else if (cellToMove[0] < this.cellsArray.length - 1) {
        this.strafeRightByDown(-diffHori);
      }
    } else if (diffVert === 0 && diffHori > 0 && this.flag === 1) {
      if (cellToMove[0] === this.cellsArray.length - 1) {
        this.strafeLeftByTop(diffHori);
      } else if (cellToMove[0] < this.cellsArray.length - 1) {
        this.strafeLeftByDown(diffHori);
      }
    } else if (diffVert === 0 && diffHori > 0 && this.flag === -1) {
      if (cellToMove[0] === this.cellsArray.length - 1) {
        this.move(1, 3);
        this.strafeLeftByTop(diffHori - 1);
      } else if (cellToMove[0] < this.cellsArray.length - 1) {
        this.move(1, 3);
        this.strafeLeftByDown(diffHori - 1);
      }
    } else if (diffVert < 0 && diffHori > 0 && this.flag === 1) {
      this.downRight(-diffVert);
      cellToMove = TaquinArray.findCoordinates(this.cellsArray, value);
      diffHori = cellToMove[1] - finalCoordinates[1];
      if (cellToMove[0] < this.cellsArray.length - 1) {
        this.strafeLeftByDown(diffHori);
      } else if (cellToMove[0] === this.cellsArray.length - 1) {
        this.strafeLeftByTop(diffHori);
      }
    } else if (diffVert < 0 && diffHori > 0 && this.flag === -1) {
      this.downLeft(-diffVert);
      cellToMove = TaquinArray.findCoordinates(this.cellsArray, value);
      diffHori = cellToMove[1] - finalCoordinates[1];
      if (cellToMove[0] < this.cellsArray.length - 1) {
        this.move(1, 3);
        this.strafeLeftByDown(diffHori - 1);
      } else if (cellToMove[0] === this.cellsArray.length - 1) {
        this.move(1, 3);
        this.strafeLeftByTop(diffHori - 1);
      }
    } else if (diffVert < 0 && diffHori < 0 && this.flag === 1) {
      this.downRight(-diffVert);
      this.move(1, 4);
      this.strafeRightByTop(-diffHori - 1);
    } else if (diffVert < 0 && diffHori < 0 && this.flag === -1) {
      this.downLeft(-diffVert);
      this.strafeRightByTop(-diffHori);
    } else if (diffVert < 0 && diffHori === 0 && this.flag === 1) {
      this.downRight(-diffVert);
    } else if (diffVert < 0 && diffHori === 0 && this.flag === -1) {
      this.downLeft(-diffVert);
    }
  }

  // Position the voidCell at right or left of the cellToMove (prefer right except when ycellToMove = max y)
  // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  // Value is the cell to change value
  voidCellPositioning(value: number) {
    this.emptyCase = TaquinArray.findCoordinates(this.cellsArray, this.voidCellValue); // [x, y] voidCell
    const coordCell = TaquinArray.findCoordinates(this.cellsArray, value); // [x, y] cellToMove
    const diffVert = this.emptyCase[0] - coordCell[0]; // =0 same line >0 void under cell <0 upper
    const diffHori = this.emptyCase[1] - coordCell[1]; // =0 same column >0 at right <0 at left
    if (diffVert >= 0 && diffHori > 0) {
      this.move(diffVert, 1);
      this.move(diffHori - 1, 4);
      this.flag = 1;
    } else if (diffVert > 0 && diffHori === 0) {
      this.move(diffVert - 1, 1);
      if (coordCell[1] < this.cellsArray[coordCell[0]].length - 1) {
        this.move(1, 3);
        this.move(1, 1);
        this.flag = 1;
      } else if (coordCell[1] === this.cellsArray[coordCell[0]].length - 1) {
        this.move(1, 4);
        this.move(1, 1);
        this.flag = -1;
      }
    } else if (diffVert > 0 && diffHori < 0) {
      this.move(-diffHori, 3);
      this.move(diffVert - 1, 1);
      if (coordCell[1] < this.cellsArray[coordCell[0]].length - 1) {
        this.move(1, 3);
        this.move(1, 1);
        this.flag = 1;
      } else {
        this.move(1, 4);
        this.move(1, 1);
        this.flag = -1;
      }
    } else if (diffVert === 0 && diffHori > 0) {
      this.move(diffHori - 1, 4);
      this.flag = 1;
    } else if (diffVert === 0 && diffHori < 0) {
      this.move(-diffHori - 1, 3);
      this.flag = -1;
    } else if (diffVert < 0 && diffHori > 0) {
      this.move(-diffVert, 2);
      this.move(diffHori - 1, 4);
      this.flag = 1;
    } else if (diffVert < 0 && diffHori === 0) {
      this.move(-diffVert - 1, 2);
      if (coordCell[1] < this.cellsArray[coordCell[0]].length - 1) {
        this.move(1, 3);
        this.move(1, 2);
        this.flag = 1;
      } else if (coordCell[1] === this.cellsArray[coordCell[0]].length - 1) {
        this.move(1, 4);
        this.move(1, 2);
        this.flag = -1;
      }
    } else if (diffVert < 0 && diffHori < 0) {
      this.move(-diffHori - 1, 3);
      this.move(-diffVert, 2);
      this.flag = -1;
    }
  }

  // Move emptyCase with method swap
  move(diff: number, destination: number) {
    for (let i = 0; i < diff; i++) {
      this.emptyCase = TaquinArray.findCoordinates(this.cellsArray, this.voidCellValue);
      this.movements.push(destination);
      this.swap(this.cellsArray, this.emptyCase, destination);
    }
    this.emptyCase = TaquinArray.findCoordinates(this.cellsArray, this.voidCellValue);
  }

  // Hook
  hook() {
    this.move(1, 1);
    this.move(1, 4);
    this.move(1, 4);
    this.move(1, 2);
    this.move(1, 3);
    this.move(1, 1);
  }

  // Last hook of each line
  lastHook() {
    this.move(1, 1);
    this.move(1, 3);
    this.move(1, 2);
  }

  // Final cycle
  final() {
    let i = 0;
    this.move(1, 3);
    this.move(1, 2);
    while (i < 4) {
      const coord1 = [this.cellsArray.length - 2, this.cellsArray[0].length - 2];
      const coord2 = [this.cellsArray.length - 2, this.cellsArray[0].length - 1];
      const coord3 = [this.cellsArray.length - 1, this.cellsArray[0].length - 2];
      const val1 = this.cellsArray[coord1[0]][coord1[1]].value;
      const val2 = this.cellsArray[coord2[0]][coord2[1]].value;
      const val3 = this.cellsArray[coord3[0]][coord3[1]].value;
      const initVal1 = this.initial[coord1[0]][coord1[1]].value;
      const initVal2 = this.initial[coord2[0]][coord2[1]].value;
      const initVal3 = this.initial[coord3[0]][coord3[1]].value;
      if (val1 === initVal1 && val2 === initVal2 && val3 === initVal3) {
        this.failed = false;
        this.goMove();
        return;

      } else {
        this.move(1, 4);
        this.move(1, 1);
        this.move(1, 3);
        this.move(1, 2);
      }
      i++;
    }
    this.failed = true;
  }

  // CLIMB OR DOWN ONE CELL
  // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  // VoidCell at left of the cellToUp
  upLeft(x: number) {
    for (let i = 0; i < x; i++) {
      this.move(1, 1);
      this.move(1, 3);
      this.move(1, 2);
      this.move(1, 4);
      this.move(1, 1);
    }
  }

  downLeft(x: number) {
    for (let i = 0; i < x; i++) {
      this.move(1, 2);
      this.move(1, 3);
      this.move(1, 1);
      this.move(1, 4);
      this.move(1, 2);
    }
  }

  // VoidCell at right of the cellToUp
  upRight(x: number) {
    for (let i = 0; i < x; i++) {
      this.move(1, 1);
      this.move(1, 4);
      this.move(1, 2);
      this.move(1, 3);
      this.move(1, 1);
    }
  }

  downRight(x: number) {
    for (let i = 0; i < x; i++) {
      this.move(1, 2);
      this.move(1, 4);
      this.move(1, 1);
      this.move(1, 3);
      this.move(1, 2);
    }
  }

  // Strafe left or right by top or bottom
  // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  // Moving from top
  strafeLeftByTop(x: number) {
    for (let i = 0; i < x; i++) {
      this.move(1, 1);
      this.move(1, 4);
      this.move(1, 4);
      this.move(1, 2);
      this.move(1, 3);
    }
  }

  strafeRightByTop(x: number) {
    for (let i = 0; i < x; i++) {
      this.move(1, 1);
      this.move(1, 3);
      this.move(1, 3);
      this.move(1, 2);
      this.move(1, 4);
    }
  }

  // Moving from down
  strafeLeftByDown(x: number) {
    for (let i = 0; i < x; i++) {
      this.move(1, 2);
      this.move(1, 4);
      this.move(1, 4);
      this.move(1, 1);
      this.move(1, 3);
    }
  }

  strafeRightByDown(x: number) {
    for (let i = 0; i < x; i++) {
      this.move(1, 2);
      this.move(1, 3);
      this.move(1, 3);
      this.move(1, 1);
      this.move(1, 4);
    }
  }

  // Hook for move cellVoid around cell to move (up or down and right)
  hookUp() {
    this.move(1, 1);
    this.move(1, 3);
    this.move(1, 3);
    this.move(1, 2);
  }

  hookDown() {
    this.move(1, 2);
    this.move(1, 3);
    this.move(1, 3);
    this.move(1, 1);
  }

  goMove() {
    alert('en' + (this.movements.length - 1).toString() + ' coups');
    const self = this;
    const movementsLength = this.movements.length;
    (function theLoop(i) {
      setTimeout(function () {
        const voidCell = TaquinArray.findCoordinates(self.taquin, self.voidCellValue);
        self.swap(self.taquin, voidCell, self.movements[movementsLength - i]);
        if (--i) {          // If i > 0, keep going
          theLoop(i);       // Call the loop again, and pass it the current value of i
        }
      }, 100);
    })(movementsLength);
  }
}

