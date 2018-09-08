import {TaquinCell} from './taquinCell';

//  Class TaquinArray, 2 dimensional array build with unique taquinCell
export class TaquinArray {
  public naturalArray = [];
  public baseArray = [];
  public naturalTaquin: TaquinCell[][];
  public taquinArray: TaquinCell[][];
  public voidCellValue;

  // Find coordinates of cell with his value
  static findCoordinates(array: Array<Array<TaquinCell>>, x: number): Array<number> {
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < array[i].length; j++) {
        if (array[i][j].value === x) {
          return [i, j];
        }
      }
    }
  }
  // Build one array with x *x value (number of cells) and shuffle ie before build the 2 dimensional array for the taquin.
  constructor(x: number) {
    for (let i = 0; i < x * x; i++) {
      this.naturalArray.push(i);
      this.baseArray.push(i);
    }
    this.shuffle();
    this.taquinArray = [];
    this.naturalTaquin = [];
    let value = 0;
    for (let i = 0; i < x; i++) {
      this.taquinArray[i] = [];
      this.naturalTaquin[i] = [];
      for (let j = 0; j < x; j++) {
        this.taquinArray[i][j] = new TaquinCell(this.baseArray[value]);
        this.naturalTaquin[i][j] = new TaquinCell(this.naturalArray[value]);
        value ++;
      }
    }
    this.voidCellValue = x * x - 1;
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
}
