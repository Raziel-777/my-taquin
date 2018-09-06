import {TaquinCell} from './taquinCell';
import {T} from '@angular/core/src/render3';

export class TaquinArray {
  public baseArray = [5, 7, 9, 2, 1, 4, 6, 3, 8];
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
  sort(): number {
    let compare = 0;
    let loop = 0;
    let sortLoop1;
    let sortLoop2;
    let sortFinal = true;
    while (sortFinal) {
      sortLoop1 = false;
      sortLoop2 = false;
      for (let entry of this.taquinArray) {
        let iter;
        let iter2;
        [entry, iter, iter2] = this.sortLine(entry);
        loop += iter;
        compare += iter2;
        if (iter > 0) {
          sortLoop1 = true;
        }
      }
      let iter3;
      [iter3, sortLoop2] = this.swapLine();
      compare += 2;
      loop += iter3;
      if (sortLoop1 === false && sortLoop2 === false) {
        sortFinal = false;
      }
    }
    return loop;
  }

  sortLine(array: Array<TaquinCell>): [Array<TaquinCell>, number, number] {
    let i = 0;
    let j;
    let iter = 0;
    let loop = 0;
    let sort = true;
    while (sort) {
      sort = false;
      while (i < array.length) {
        j = i + 1;
        while (j < array.length) {
          iter ++;
          if (array[i].value > array[j].value) {
            const tempCell = array[i];
            array[i] = array[j];
            array[j] = tempCell;
            loop += 1;
            sort = true;
          }
          j++;
        }
        i++;
      }
    }
    return [array, loop, iter];
  }

  swapLine(): [number, boolean] {
    let loop = 0;
    let bool = false;
    for (let i = 0; i < this.taquinArray.length - 1; i++) {
      loop ++;
      if (this.taquinArray[i][this.taquinArray.length - 1].value > this.taquinArray[i + 1][0].value) {
        const tempCell = this.taquinArray[i][this.taquinArray.length - 1];
        this.taquinArray[i][this.taquinArray.length - 1] = this.taquinArray[i + 1][0];
        this.taquinArray[i + 1][0] = tempCell;
        bool = true;
      }
    }
    return [loop, bool];
  }
  // sort(): number {
  //   let i = 0;
  //   let j = i + 1;
  //   let loop = 0;
  //   let sort = true;
  //   while (sort) {
  //     sort = false;
  //     while (i < this.taquinArray.length) {
  //       j = i + 1;
  //       while (j < this.taquinArray.length) {
  //         if (this.taquinArray[i].value > this.taquinArray[j].value) {
  //           const tempCell = this.taquinArray[i];
  //           this.taquinArray[i] = this.taquinArray[j];
  //           this.taquinArray[j] = tempCell;
  //           loop += 1;
  //           sort = true;
  //         }
  //         j++;
  //       }
  //       i++;
  //     }
  //   }
  //   return loop;
  // }
}
