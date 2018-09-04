import {TaquinCell} from './taquinCell';
import {ShuffleArray} from './shuffleArray';

export class TaquinArray {
  public numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  public taquinArray: TaquinCell[][];
  constructor() {
    this.taquinArray = [];
    const randomValue = ShuffleArray.shuffle(this.numberArray);
    let x = 0;
    for (let i = 0; i < 3; i++) {
      this.taquinArray[i] = [];
      for (let j = 0; j < 3; j++) {
        if (randomValue[x] === 9) {
          this.taquinArray[i][j] = new TaquinCell(randomValue[x], false);
        } else {
          this.taquinArray[i][j] = new TaquinCell(randomValue[x], true);
        }
        x++;
      }
    }
  }
  // Movements // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  swap(coordinates: Array<number>, movement: number): void {
    const tempCell = this.taquinArray[coordinates[0]][coordinates[1]];
    console.log(movement);
    switch (movement) {
      case 1:
        this.taquinArray[coordinates[0]][coordinates[1]] = this.taquinArray[coordinates[0] - 1][coordinates[1]];
        this.taquinArray[coordinates[0] - 1][coordinates[1]] = tempCell;
        break;
      case 2:
        this.taquinArray[coordinates[0]][coordinates[1]] = this.taquinArray[coordinates[0] + 1][coordinates[1]];
        this.taquinArray[coordinates[0] + 1][coordinates[1]] = tempCell;
        break;
      case 3:
        this.taquinArray[coordinates[0]][coordinates[1]] = this.taquinArray[coordinates[0]][coordinates[1] + 1];
        this.taquinArray[coordinates[0]][coordinates[1] + 1] = tempCell;
        break;
      case 4:
        this.taquinArray[coordinates[0]][coordinates[1]] = this.taquinArray[coordinates[0]][coordinates[1] - 1];
        this.taquinArray[coordinates[0]][coordinates[1] - 1] = tempCell;
        break;
    }
  }
}
