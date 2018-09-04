import {TaquinCell} from './taquinCell';

export class TaquinArray {
  public baseArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  public taquinArray: TaquinCell[][];
  constructor() {
    this.taquinArray = [];
    let x = 0;
    for (let i = 0; i < 3; i++) {
      this.taquinArray[i] = [];
      for (let j = 0; j < 3; j++) {
        this.taquinArray[i][j] = new TaquinCell(this.baseArray[x]);
        x++;
      }
    }
  }
  // shuffle array
  shuffle(): void {
    let ctr = this.baseArray.length, temp, index;
    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = this.baseArray[ctr];
      this.baseArray[ctr] = this.baseArray[index];
      this.baseArray[index] = temp;
    }
  }
  // Movements // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
  swap(coordinates: Array<number>, movement: number): void {
    const tempCell = this.taquinArray[coordinates[0]][coordinates[1]];
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
