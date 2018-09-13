import {Component, OnInit} from '@angular/core';
import {TaquinCell} from '../taquinCell';
import {TaquinArray} from '../taquinArray';

@Component({
  selector: 'app-taquin2',
  templateUrl: './taquin2.component.html',
  styleUrls: ['./taquin2.component.css']
})
export class Taquin2Component implements OnInit {

  private taquinObject: TaquinArray;
  public taquin;
  // Clone taquin before processing resolve
  public cellsArray: Array<Array<TaquinCell>>;
  public iterSwap;
  public solvency = null;
  private voidCellValue;
  private initial;
  private final = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  private finalMovements = [];
  private finalMoves: Map<Array<number>, TaquinCell[][]> = new Map<Array<number>, TaquinCell[][]>();
  private finalMoves2: Map<Array<number>, TaquinCell[][]> = new Map<Array<number>, TaquinCell[][]>();
  private movements = [];

  constructor() {
  }

  ngOnInit() {
    this.taquinObject = new TaquinArray(3);
    this.taquin = this.taquinObject.taquinArray;
    this.cellsArray = this.taquin.map(x => Object.assign([], x));
    this.voidCellValue = this.taquinObject.voidCellValue;
    this.initial = this.taquinObject.naturalTaquin;
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

  swap3(array: Array<Array<TaquinCell>>, coordinates: Array<number>, movement: number): void {
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

  // Movements // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  swap2(array: Array<Array<TaquinCell>>, coordinates: Array<number>, movement: number, forbidden: number): any {
    const tabMoves = [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]];
    const tabValues = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    const newTab = array.map(x => Object.assign([], x));
    const tempCell = newTab[coordinates[0]][coordinates[1]];
    switch (movement) {
      case 1:
        newTab[coordinates[0]][coordinates[1]] = newTab[coordinates[0] - 1][coordinates[1]];
        newTab[coordinates[0] - 1][coordinates[1]] = tempCell;
        break;
      case 2:
        newTab[coordinates[0]][coordinates[1]] = newTab[coordinates[0] + 1][coordinates[1]];
        newTab[coordinates[0] + 1][coordinates[1]] = tempCell;
        break;
      case 3:
        newTab[coordinates[0]][coordinates[1]] = newTab[coordinates[0]][coordinates[1] + 1];
        newTab[coordinates[0]][coordinates[1] + 1] = tempCell;
        break;
      case 4:
        newTab[coordinates[0]][coordinates[1]] = newTab[coordinates[0]][coordinates[1] - 1];
        newTab[coordinates[0]][coordinates[1] - 1] = tempCell;
        break;
    }
    for (let i = 0; i < forbidden; i++) {
      if (newTab[tabMoves[i][0]][tabMoves[i][1]].value !== tabValues[i]) {
        return false;
      }
    }
    return newTab;
  }

  // Movements // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  swap(array: Array<Array<TaquinCell>>, coordinates: Array<number>, movement: number): Array<Array<TaquinCell>> {
    const newTab = array.map(x => Object.assign([], x));
    const tempCell = newTab[coordinates[0]][coordinates[1]];
    switch (movement) {
      case 1:
        newTab[coordinates[0]][coordinates[1]] = newTab[coordinates[0] - 1][coordinates[1]];
        newTab[coordinates[0] - 1][coordinates[1]] = tempCell;
        break;
      case 2:
        newTab[coordinates[0]][coordinates[1]] = newTab[coordinates[0] + 1][coordinates[1]];
        newTab[coordinates[0] + 1][coordinates[1]] = tempCell;
        break;
      case 3:
        newTab[coordinates[0]][coordinates[1]] = newTab[coordinates[0]][coordinates[1] + 1];
        newTab[coordinates[0]][coordinates[1] + 1] = tempCell;
        break;
      case 4:
        newTab[coordinates[0]][coordinates[1]] = newTab[coordinates[0]][coordinates[1] - 1];
        newTab[coordinates[0]][coordinates[1] - 1] = tempCell;
        break;
    }
    return newTab;
  }

  // Auto sort 2D taquin
  sort(): void {
    this.solvency = null;
    this.iterSwap = this.taquinObject.sort();
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

  goMove() {
    const self = this;
    const movementsLength = this.movements.length;
    (function theLoop(i) {
      setTimeout(function () {
        const voidCell = TaquinArray.findCoordinates(self.taquin, self.voidCellValue);
        self.swap3(self.taquin, voidCell, self.movements[movementsLength - i]);
        if (--i) {          // If i > 0, keep going
          theLoop(i);       // Call the loop again, and pass it the current value of i
        }
      }, 100);
    })(movementsLength);
  }

  verif(taquin: Array<Array<TaquinCell>>) {
    const verif = [];
    for (const entries of taquin) {
      for (const entry of entries) {
        verif.push(entry.value);
      }
    }
    return verif.toString() === '0,1,2,3,4,5,6,7,8';
  }

  dfs(taquin: Array<Array<TaquinCell>>, lastMove = 0, deep = 0) {
    const maxDepht = 80;
    const voidCell = TaquinArray.findCoordinates(taquin, 8);
    const possibleMoves = this.possibleMoves(voidCell, lastMove);
    if (this.verif(taquin)) {
      console.log('GAGNE');
      console.log(this.movements);
      return true;
    }
    if (deep > maxDepht) {
      return false;
    }
    for (const move of possibleMoves) {
      taquin = this.swap(taquin, voidCell, move);
      this.movements.push(move);
      if (this.dfs(taquin, move, deep + 1)) {
        return true;
      }
      if (move === 1) {
        taquin = this.swap(taquin, TaquinArray.findCoordinates(taquin, 8), 2);
        this.movements.splice(deep, 1);
      } else if (move === 2) {
        taquin = this.swap(taquin, TaquinArray.findCoordinates(taquin, 8), 1);
        this.movements.splice(deep, 1);
      } else if (move === 3) {
        taquin = this.swap(taquin, TaquinArray.findCoordinates(taquin, 8), 4);
        this.movements.splice(deep, 1);
      } else if (move === 4) {
        taquin = this.swap(taquin, TaquinArray.findCoordinates(taquin, 8), 3);
        this.movements.splice(deep, 1);
      }
    }
    return false;
  }

  solveTaquin() {
    const self = this;
    this.finalMoves.set([], this.cellsArray);
    while (true) {
      console.log('solve1');
      this.finalMoves2 = new Map(this.finalMoves);
      this.finalMoves.clear();
      for (const [key, value] of Array.from(this.finalMoves2)) {
        const voidCoord = TaquinArray.findCoordinates(value, self.voidCellValue);
        const possible = self.possibleMoves(voidCoord);
        for (const poss of possible) {
          let newKey = Object.assign([], key);
          const test = self.swap2(value, voidCoord, poss, 0);
          if (test !== false) {
            const tab = self.toArray(test);
            if (tab[0] === self.final[0]) {
              console.log('Trouvé !!! 1');
              key.push(poss);
              for (const u of key) {
                self.finalMovements.push(u);
              }
              self.cellsArray = test;
              return self.solveTaquin2();
            } else {
              newKey.push(poss);
              self.finalMoves.set(newKey, test);
              newKey = [];
            }
          }
        }
      }
      this.finalMoves2.clear();
    }
  }

  solveTaquin2() {
    const self = this;
    this.finalMoves.set([], this.cellsArray);
    while (true) {
      console.log('solve2');
      this.finalMoves2 = new Map(this.finalMoves);
      this.finalMoves.clear();
      for (const [key, value] of Array.from(this.finalMoves2)) {
        const voidCoord = TaquinArray.findCoordinates(value, self.voidCellValue);
        const possible = self.possibleMoves(voidCoord);
        for (const poss of possible) {
          let newKey = Object.assign([], key);
          const test = self.swap2(value, voidCoord, poss, 1);
          if (test !== false) {
            const tab = self.toArray(test);
            if (tab[1] === self.final[1] && tab[2] === self.final[2]) {
              console.log('Trouvé !!! 2 et 3');
              key.push(poss);
              for (const u of key) {
                self.finalMovements.push(u);
              }
              self.cellsArray = test;
              return self.solveTaquin3();
            } else {
              newKey.push(poss);
              self.finalMoves.set(newKey, test);
              newKey = [];
            }
          }
        }
      }
      this.finalMoves2.clear();
    }
  }

  solveTaquin3() {
    const self = this;
    this.finalMoves.set([], this.cellsArray);
    while (true) {
      console.log('solve3');
      this.finalMoves2 = new Map(this.finalMoves);
      this.finalMoves.clear();
      for (const [key, value] of Array.from(this.finalMoves2)) {
        const voidCoord = TaquinArray.findCoordinates(value, self.voidCellValue);
        const possible = self.possibleMoves(voidCoord);
        for (const poss of possible) {
          let newKey = Object.assign([], key);
          const test = self.swap2(value, voidCoord, poss, 3);
          if (test !== false) {
            const tab = self.toArray(test);
            if (tab[3] === self.final[3] && tab[6] === self.final[6]) {
              console.log('Trouvé !!! 2 et 3');
              key.push(poss);
              for (const u of key) {
                self.finalMovements.push(u);
              }
              self.cellsArray = test;
              return self.solveTaquinFinal();
            } else {
              newKey.push(poss);
              self.finalMoves.set(newKey, test);
              newKey = [];
            }
          }
        }
      }
      this.finalMoves2.clear();
    }
  }

  solveTaquinFinal() {
    const self = this;
    this.finalMoves.set([], this.cellsArray);
    while (true) {
      console.log('solve4');
      this.finalMoves2 = new Map(this.finalMoves);
      this.finalMoves.clear();
      for (const [key, value] of Array.from(this.finalMoves2)) {
        const voidCoord = TaquinArray.findCoordinates(value, self.voidCellValue);
        const possible = self.possibleMoves(voidCoord);
        for (const poss of possible) {
          let newKey = Object.assign([], key);
          const test = self.swap2(value, voidCoord, poss, 4);
          if (test !== false) {
            const tab = self.toArray(test);
            if (tab[4] === self.final[4] && tab[5] === self.final[5]) {
              console.log('GAGNE');
              key.push(poss);
              for (const u of key) {
                self.finalMovements.push(u);
              }
              self.cellsArray = test;
              console.log(self.cellsArray);
              return;
            } else {
              newKey.push(poss);
              self.finalMoves.set(newKey, test);
              newKey = [];
            }
          }
        }
      }
      this.finalMoves2.clear();
    }
  }

  possibleMoves(coord: Array<number>, z: number = 0): Array<number> {
    const x = coord[0];
    const y = coord[1];
    let tabToSend = [];
    if (z === 1) {
      z = 2;
    } else if (z === 2) {
      z = 1;
    } else if (z === 3) {
      z = 4;
    } else if (z === 4) {
      z = 3;
    }
    if (x === 0) {
      if (y === 0) {
        tabToSend = [2, 3];
      } else if (y === 2) {
        tabToSend = [2, 4];
      } else {
        tabToSend = [2, 3, 4];
      }
    } else if (x === 2) {
      if (y === 0) {
        tabToSend = [1, 3];
      } else if (y === 2) {
        tabToSend = [1, 4];
      } else {
        tabToSend = [1, 4, 3];
      }
    } else {
      if (y === 0) {
        tabToSend = [1, 3, 2];
      } else if (y === 2) {
        tabToSend = [2, 4, 1];
      } else {
        tabToSend = [1, 2, 3, 4];
      }
    }
    const index = tabToSend.indexOf(z);
    if (index > -1) {
      tabToSend.splice(index, 1);
    }
    return tabToSend;
  }

  toArray(array: Array<Array<TaquinCell>>): Array<number> {
    const tab = [];
    for (const entries of array) {
      for (const entry of entries) {
        tab.push(entry.value);
      }
    }
    return tab;
  }

  filter(array: Array<Array<Array<TaquinCell>>>): Array<Array<Array<TaquinCell>>> {
    array.filter((value, index) => array.indexOf(value) === index);
    return array;
  }

}
