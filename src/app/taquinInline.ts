import {TaquinCell} from './taquinCell';

export class TaquinInline {
  public baseArray = [5, 7, 9, 6, 2, 4, 1, 3, 8];
  public taquinArray: TaquinCell[];

  constructor() {
    this.taquinArray = [];
    let x = 0;
    for (let i = 0; i < 9; i++) {
      this.taquinArray[i] = new TaquinCell(this.baseArray[x]);
      x++;
    }
  }

  // shuffle
  shuffle(): void {
    let ctr = this.taquinArray.length, temp, index;
    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = this.taquinArray[ctr];
      this.taquinArray[ctr] = this.taquinArray[index];
      this.taquinArray[index] = temp;
    }
  }

  sort(): number {
    let i = 0;
    let j = i + 1;
    let loop = 0;
    let sort = true;
    while (sort) {
      sort = false;
      while (i < this.taquinArray.length) {
        j = i + 1;
        while (j < this.taquinArray.length) {
          if (this.taquinArray[i].value > this.taquinArray[j].value) {
            const tempCell = this.taquinArray[i];
            this.taquinArray[i] = this.taquinArray[j];
            this.taquinArray[j] = tempCell;
            loop += 1;
            sort = true;
          }
          j++;
        }
        i++;
      }
    }
    return loop;
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
