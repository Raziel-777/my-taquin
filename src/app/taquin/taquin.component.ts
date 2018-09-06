import {Component, OnInit, ɵangular_packages_core_core_r} from '@angular/core';
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
  private taquinArray = new TaquinArray();
  public cellsArray = this.taquinArray.taquinArray;
  public swapNumber = 1;
  public iterSwap;
  public solvency = null;
  private movements = [];
  private emptyCase = [];
  private flag;
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
    const destination = this;
    // SWAP with delay
    (function theLoop(i) {
      setTimeout(function () {
        const x = Math.floor(Math.random() * destination.cellsArray.length);
        const y = Math.floor(Math.random() * destination.cellsArray.length);
        const move = moves[Math.floor(Math.random() * moves.length)];
        const cell = [x, y];
        if ((move === 1 && x === 0) || (move === 2 && x === 2) || (move === 3 && y === 2) || (move === 4 && y === 0)) {
          console.log('CAN\'T MOVE');
        } else {
          destination.taquinArray.swap(cell, move);
        }
        if (--i) {          // If i > 0, keep going
          theLoop(i);       // Call the loop again, and pass it the current value of i
        }
      }, 10);
    })(destination.swapNumber);
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
    const voidCoordinates = this.findCoordinates(9);
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

  changePattern(pattern: string): void {
    for (const entries of this.cellsArray) {
      for (const entry of entries) {
        entry.changePattern(pattern);
      }
    }
  }

  solvencyTaquin(): void {
    // Find void Cell coordinates and calculate number of moves to set at initial position
    const voidCell = this.findCoordinates(9);
    const initVoidCell = [2, 2];
    const xVoidMove = initVoidCell[0] - voidCell[0];
    const yVoidMove = initVoidCell[1] - voidCell[1];
    const voidMove = xVoidMove + yVoidMove;
    let moves = 0;
    // Calculate number of transposition of cells adjacent or not, including voidCell, to solve the taquin
    // Array of initial position in natural order [value, index]
    const initArray = {'0': 1, '1': 2, '2': 3, '3': 4, '4': 5, '5': 6, '6': 7, '7': 8, '8': 9};
    // Build one dimensional array with initial cellsArray
    const cellsFinal = [];
    for (const entries of this.cellsArray) {
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
  async resolve() {
    this.goMove();
    let coordinates = [];
    let value;
    for (let i = 0; i < this.cellsArray.length - 2; i++) {
      for (let j = 0; j < this.cellsArray[i].length - 2; j++) {
        value = i * this.cellsArray.length + j * this.cellsArray[i].length + 1;
        coordinates = this.findCoordinates(value);
        if (coordinates !== this.initial[value]) {
          await this.voidCellPositioning(value);
          await this.movement(value, this.initial[value]);
        }
      }
      debugger;
      // Coordinates of two last cells of 2 lines
      const coord1 = [i, this.cellsArray[i].length - 1];
      const coord2 = [i + 1, this.cellsArray[i + 1].length - 1];
      // Value of two last cells in the taquin
      const val1 = this.cellsArray[coord1[0]][coord1[1]].value;
      const val2 = this.cellsArray[coord2[0]][coord2[1]].value;
      // Value of two last cells of 2 lines // WARNING natural value start at 0, but in my taquin value start at 1, so we add 1
      const initVal1 = i * this.cellsArray.length + this.cellsArray[i].length;
      const initVal2 = (i + 1) * this.cellsArray.length + this.cellsArray[i].length;
      if (val1 === initVal1 && val2 === initVal2) {
        await this.move(1, 3);
        await this.move(1, 2);
      } else {
        // Value of the last cell and his coordinates, this cell must not be at three bad position
        // This is initVal2
        // Value of three bad position
        // This is val1, val2 and val3
        const val3 = this.cellsArray[coord2[0]][coord2[1] - 1].value;
        if (initVal2 === val1 || initVal2 === val2 || initVal2 === val3) {
          await this.voidCellPositioning(initVal2);
          await this.movement(initVal2, [coord2[0], coord2[1] - 1]);
        }
        if (this.cellsArray[coord1[0]][coord1[1]].value !== initVal1) {
          await this.voidCellPositioning(initVal1);
          await this.movement(initVal1, [coord1[0], coord1[1]]);
        }
        if (this.cellsArray[coord2[0]][coord2[1]].value !== initVal2) {
          await this.voidCellPositioning(initVal2);
          await this.movement(initVal2, [coord2[0], coord2[1]]);
        }
        await this.lastHook();
      }
    }
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //            MOVEMENTS        //////////////////////////////////////////////////////////////////////////////////////////////

  // Method to move cell at his initial position with this.initial when voidCell is positioning
  // N hori [1]; poscv/N monx: vertical;
  async movement(value: number, finalCoordinates: Array<number>) {
    let coordinates = this.findCoordinates(value);
    let diffVert = coordinates[0] - finalCoordinates[0];
    let diffHori = coordinates[1] - finalCoordinates[1];
    if (diffVert > 0 && diffHori > 0 && this.flag === 1) {
      await this.upRight(diffVert);
      await this.movingLeftByDown(diffHori);
    } else if (diffVert > 0 && diffHori === 0 && this.flag === 1) {
      await this.upRight(diffVert);
    } else if (diffVert > 0 && diffHori > 0 && this.flag === -1) {
      await this.upLeft(diffVert);
      await this.move(1, 3);
      await this.movingLeftByDown(diffHori - 1);
    } else if (diffVert > 0 && diffHori === 0 && this.flag === -1) {
      if (coordinates[1] === this.cellsArray[coordinates[0]].length - 1) {
        await this.upLeft(diffVert);
      } else if (coordinates[1] < this.cellsArray[coordinates[0]].length - 1) {
        if (coordinates[0] === this.cellsArray.length - 1) {
          await this.hookUp();
          await this.upRight(diffVert);
        } else if (coordinates[0] < this.cellsArray.length - 1) {
          await this.hookDown();
          await this.upRight(diffVert);
        }
      }
    } else if (diffVert > 0 && diffHori < 0 && this.flag === 1) {
      if (coordinates[0] === this.cellsArray.length - 1) {
        await this.move(1, 4);
        await this.movingRightByTop(-diffHori - 1);
        coordinates = this.findCoordinates(value);
        diffVert = coordinates[0] - finalCoordinates[0];
        if (coordinates[1] < this.cellsArray[coordinates[0]].length - 1) {
          await this.hookUp();
          await this.upRight(diffVert);
        } else if (coordinates[1] === this.cellsArray[coordinates[0]].length - 1) {
          await this.upLeft(diffVert);
        }
      } else if (coordinates[0] < this.cellsArray.length - 1) {
        await this.move(1, 4);
        await this.movingRightByDown(-diffHori - 1);
        coordinates = this.findCoordinates(value);
        diffVert = coordinates[0] - finalCoordinates[0];
        if (coordinates[1] < this.cellsArray[coordinates[0]].length - 1) {
          await this.hookDown();
          await this.upLeft(diffVert);
        } else if (coordinates[1] === this.cellsArray[coordinates[0]].length - 1) {
          await this.upLeft(diffVert);
        }
      } else if (diffVert > 0 && diffHori < 0 && this.flag === -1) {
        if (coordinates[0] === this.cellsArray.length - 1) {
          await this.movingRightByTop(-diffHori);
          coordinates = this.findCoordinates(value);
          diffVert = coordinates[0] - finalCoordinates[0];
          if (coordinates[1] < this.cellsArray[coordinates[0]].length - 1) {
            await this.hookUp();
            await this.upRight(diffVert - 1);
          } else if (coordinates[1] === this.cellsArray[coordinates[0]].length - 1) {
            await this.upLeft(diffVert);
          }
        } else if (coordinates[0] < this.cellsArray.length - 1) {
          await this.movingRightByDown(-diffHori);
          coordinates = this.findCoordinates(value);
          diffVert = coordinates[0] - finalCoordinates[0];
          if (coordinates[1] < this.cellsArray[coordinates[0]].length - 1) {
            await this.hookDown();
            await this.upRight(diffVert);
          } else if (coordinates[1] === this.cellsArray[coordinates[0]].length - 1) {
            await this.upLeft(diffVert);
          }
        }
      } else if (diffVert === 0 && diffHori < 0 && this.flag === 1) {
        if (coordinates[1] === this.cellsArray.length - 1) {
          await this.move(1, 4);
          await this.movingRightByTop(-diffHori - 1);
        } else if (coordinates[1] < this.cellsArray.length - 1) {
          await this.move(1, 4);
          await this.movingRightByDown(-diffHori - 1);
        }
      } else if (diffVert === 0 && diffHori < 0 && this.flag === -1) {
        if (coordinates[1] === this.cellsArray.length - 1) {
          await this.movingRightByTop(-diffHori);
        } else if (coordinates[1] === this.cellsArray.length - 1) {
          await this.movingRightByDown(-diffHori);
        }
      } else if (diffVert === 0 && diffHori > 0 && this.flag === 1) {
        if (coordinates[1] === this.cellsArray.length - 1) {
          await this.movingLeftByTop(diffHori);
        } else if (coordinates[1] < this.cellsArray.length - 1) {
          await this.movingLeftByDown(diffHori);
        }
      } else if (diffVert === 0 && diffHori > 0 && this.flag === -1) {
        if (coordinates[1] === this.cellsArray.length - 1) {
          await this.move(1, 3);
          await this.movingLeftByTop(diffHori - 1);
        } else if (coordinates[1] < this.cellsArray.length - 1) {
          await this.move(1, 3);
          await this.movingLeftByDown(diffHori - 1);
        }
      } else if (diffVert < 0 && diffHori > 0 && this.flag === 1) {
        await this.downRight(-diffVert);
        coordinates = this.findCoordinates(value);
        diffHori = coordinates[1] - finalCoordinates[1];
        if (coordinates[1] < this.cellsArray.length - 1) {
          await this.movingLeftByDown(diffHori);
        } else if (coordinates[1] === this.cellsArray.length - 1) {
          await this.movingLeftByTop(diffHori);
        }
      } else if (diffVert < 0 && diffHori > 0 && this.flag === -1) {
        await this.downLeft(-diffVert);
        coordinates = this.findCoordinates(value);
        diffHori = coordinates[1] - finalCoordinates[1];
        if (coordinates[1] < this.cellsArray.length - 1) {
          await this.move(1, 3);
          await this.movingLeftByDown(diffHori - 1);
        } else if (coordinates[1] < this.cellsArray.length - 1) {
          await this.move(1, 3);
          await this.movingLeftByTop(diffHori - 1);
        }
      } else if (diffVert < 0 && diffHori < 0 && this.flag === 1) {
        await this.downRight(-diffVert);
        await this.move(1, 4);
        await this.movingRightByTop(-diffHori - 1);
      } else if (diffVert < 0 && diffHori < 0 && this.flag === -1) {
        await this.downLeft(-diffVert);
        await this.movingRightByTop(-diffHori);
      } else if (diffVert < 0 && diffHori === 0 && this.flag === 1) {
        await this.downRight(-diffVert);
      } else if (diffVert < 0 && diffHori === 0 && this.flag === -1) {
        await this.downLeft(-diffVert);
      }
    }
  }

  // Last hook of each line
  async lastHook() {
    await this.move(1, 1);
    await this.move(1, 3);
    await this.move(1, 2);
  }

  // Position the voidCell at right or left of the cellToMove (prefer right except when ycellToMove = max y)
  // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  async voidCellPositioning(x: number) {
    this.emptyCase = this.findCoordinates(9); // [x, y] voidCell
    const coordCell = this.findCoordinates(x); // [x, y] cellToMove
    const diffVert = this.emptyCase[0] - coordCell[0]; // =0 same line >0 void under cell <0 upper
    const diffHori = this.emptyCase[1] - coordCell[1]; // =0 same column >0 at right <0 at left
    if (diffVert >= 0 && diffHori > 0) {
      await this.move(diffVert, 1);
      await this.move(diffHori - 1, 4);
      this.flag = 1;
    } else if (diffVert > 0 && diffHori === 0) {
      await this.move(diffVert - 1, 1);
      if (this.emptyCase[1] < this.cellsArray[this.emptyCase[0]].length - 1) {
        await this.move(1, 3);
        await this.move(1, 1);
        this.flag = 1;
      } else if (this.emptyCase[1] === this.cellsArray[this.emptyCase[0]].length - 1) {
        await this.move(1, 4);
        await this.move(1, 1);
        this.flag = -1;
      }
    } else if (diffVert > 0 && diffHori < 0) {
      await this.move(-diffHori, 3);
      await this.move(diffVert - 1, 1);
      if (this.emptyCase[1] < this.cellsArray[this.emptyCase[0]].length - 1) {
        await this.move(1, 3);
        await this.move(1, 1);
        this.flag = 1;
      } else if (this.emptyCase[1] === this.cellsArray[this.emptyCase[0]].length - 1) {
        await this.move(1, 4);
        await this.move(1, 1);
        this.flag = -1;
      }
    } else if (diffVert === 0 && diffHori > 0) {
      await this.move(diffHori - 1, 4);
      this.flag = 1;
    } else if (diffVert === 0 && diffHori < 0) {
      await this.move(-diffHori - 1, 3);
      this.flag = -1;
    } else if (diffVert < 0 && diffHori > 0) {
      await this.move(-diffVert, 2);
      await this.move(diffHori - 1, 4);
      this.flag = 1;
    } else if (diffVert < 0 && diffHori === 0) {
      await this.move(-diffVert - 1, 2);
      if (this.emptyCase[1] < this.cellsArray[this.emptyCase[0]].length - 1) {
        await this.move(1, 3);
        await this.move(1, 2);
        this.flag = 1;
      } else if (this.emptyCase[1] === this.cellsArray[this.emptyCase[0]].length - 1) {
        await this.move(1, 4);
        await this.move(1, 2);
        this.flag = -1;
      }
    } else if (diffVert < 0 && diffHori < 0) {
      await this.move(-diffHori - 1, 3);
      await this.move(-diffVert, 2);
      this.flag = -1;
    }
  }

  // CLIMB OR DOWN ONE CELL
  // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  // VoidCell at left of the cellToUp
  async upLeft(x: number) {
    for (let i = 0; i < x; i++) {
      await this.move(1, 1);
      await this.move(1, 3);
      await this.move(1, 2);
      await this.move(1, 4);
      await this.move(1, 1);
    }
  }

  async downLeft(x: number) {
    for (let i = 0; i < x; i++) {
      await this.move(1, 2);
      await this.move(1, 3);
      await this.move(1, 1);
      await this.move(1, 4);
      await this.move(1, 2);
    }
  }

  // VoidCell at right of the cellToUp
  async upRight(x: number) {
    for (let i = 0; i < x; i++) {
      await this.move(1, 1);
      await this.move(1, 4);
      await this.move(1, 2);
      await this.move(1, 3);
      await this.move(1, 1);
    }
  }

  async downRight(x: number) {
    for (let i = 0; i < x; i++) {
      await this.move(1, 2);
      await this.move(1, 4);
      await this.move(1, 1);
      await this.move(1, 3);
      await this.move(1, 2);
    }
  }

  // MOVING LEFT OR RIGHT ONE CELL
  // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  // Moving from top
  async movingLeftByTop(x: number) {
    for (let i = 0; i < x; i++) {
      await this.move(1, 1);
      await this.move(1, 4);
      await this.move(1, 4);
      await this.move(1, 2);
      await this.move(1, 3);
    }
  }

  async movingRightByTop(x: number) {
    for (let i = 0; i < x; i++) {
      await this.move(1, 1);
      await this.move(1, 3);
      await this.move(1, 3);
      await this.move(1, 2);
      await this.move(1, 4);
    }
  }

  // Moving from down
  async movingLeftByDown(x: number) {
    for (let i = 0; i < x; i++) {
      await this.move(1, 2);
      await this.move(1, 4);
      await this.move(1, 4);
      await this.move(1, 1);
      await this.move(1, 3);
    }
  }

  async movingRightByDown(x: number) {
    for (let i = 0; i < x; i++) {
      await this.move(1, 2);
      await this.move(1, 3);
      await this.move(1, 3);
      await this.move(1, 1);
      await this.move(1, 4);
    }
  }

  // Hook for move cellVoid around cell to move (up or down and right)
  async hookUp() {
    await this.move(1, 1);
    await this.move(1, 3);
    await this.move(1, 3);
    await this.move(1, 2);
  }

  async hookDown() {
    await this.move(1, 2);
    await this.move(1, 3);
    await this.move(1, 3);
    await this.move(1, 1);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  //            UTILITIES        //////////////////////////////////////////////////////////////////////////////////////////////
  // Find coordinates of cell with his value
  findCoordinates(x: number): Array<number> {
    for (let i = 0; i < this.cellsArray.length; i++) {
      for (let j = 0; j < this.cellsArray[i].length; j++) {
        if (this.cellsArray[i][j].value === x) {
          return [i, j];
        }
      }
    }
  }

  move(diff, destination) {
    const self = this;
    return new Promise(function (resolve, reject) {
      for (let i = 0; i < diff; i++) {
        const coordinates = self.emptyCase.slice(0);
        self.movements.push({
          'coordinates': coordinates,
          'destination': destination
        });
        switch (destination) {
          case 1:
            self.emptyCase[0] = self.emptyCase[0] - 1;
            break;
          case 2:
            self.emptyCase[0]++;
            break;
          case 3:
            self.emptyCase[1]++;
            break;
          case 4:
            self.emptyCase[1]--;
            break;
        }
      }
      resolve('Success!');
    });
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
    }, 1000);
  }
}

