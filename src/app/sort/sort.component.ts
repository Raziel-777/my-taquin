import {Component, OnInit} from '@angular/core';
import {TaquinInline} from '../taquinInline';

@Component({
  selector: 'app-sort',
  templateUrl: './sort.component.html',
  styleUrls: ['./sort.component.css']
})
export class SortComponent implements OnInit {
  private inline: TaquinInline;
  public taquin;
  public taq;
  public swapNumber = 1;
  public iterSwap;
  public solvency = null;
  public failed = null;
  public cellsNumber = 3;

  constructor() {
  }

  ngOnInit() {
    this.inline = new TaquinInline();
    this.taquin = this.inline.taquinArray;
    this.taq = this.inline.baseArray;
  }

  shuffle() {
    this.inline.shuffle();
    console.log(this.taquin);
  }

  //  TRI PAR INSERTION
  sortInsertion() {
    let toto = 0;
    for (let i = 0; i < this.taquin.length - 1; i++) {
      toto++;
      if (this.taquin[i].value > this.taquin[i + 1].value) {
        const temp = this.taquin[i];
        this.taquin[i] = this.taquin[i + 1];
        this.taquin[i + 1] = temp;

        for (let j = i; j > 0; j--) {
          if (this.taquin[j].value < this.taquin[j - 1].value) {
            const temp2 = this.taquin[j];
            this.taquin[j] = this.taquin[j - 1];
            this.taquin[j - 1] = temp2;
          }
        }
      }
    }
    console.log(toto);
  }


  //  TRI PAR SELECTION   //  résultat : 19 swap avec 40 comparaisons.
  sortSelection() {
    let compare2 = 0;
    let swap2 = 0;
    let save = 0;


    let pasSwap = 0;
    for (let i = 0; i < this.taquin.length - 1; i++) {
      compare2++;

      if (this.taquin[i].value > this.taquin[i + 1].value) {
        save = this.taquin[i + 1];

        this.taquin[i + 1] = this.taquin[i];
        this.taquin[i] = save;
        swap2++;
        pasSwap++;
      }
    }
    if (pasSwap !== 0) {
      return this.sortSelection();
    }
  }


  //  TRI A BULLE   //  résultat : 19 swap avec 35 comparaisons.

  sortBulle() {
    let save = 0;
    let compare3 = 0;
    let placed = 1;
    let swap3 = 0;

    while (placed !== (this.taquin.length - 1)) {
      for (let i = 0; i < this.taquin.length - placed; i++) {
        compare3++;

        if (this.taquin[i].value > this.taquin[i + 1].value) {
          swap3++;
          save = this.taquin[i];
          this.taquin[i] = this.taquin[i + 1];
          this.taquin[i + 1] = save;
        }
      }
      placed++;
    }
  }

  sortShell() {
    let gap = Math.floor(this.taquin.length / 2);
    let swap = 0;
    let compare = 0;
    while (gap > 0) {
      for (let i = 0; i <= this.taquin.length - 1 - gap; i++) {
        compare++;
        if (this.taquin[i].value > this.taquin[i + gap].value) {
          swap++;
          const temp = this.taquin[i];
          this.taquin[i] = this.taquin[i + gap];
          this.taquin[i + gap] = temp;
          let j = i;
          while (j - gap >= 0) {
            compare++;
            if (this.taquin[j].value < this.taquin[j - gap].value) {
              swap++;
              const temp2 = this.taquin[j];
              this.taquin[j] = this.taquin[j - gap];
              this.taquin[j - gap] = temp2;
            }
            j = j - gap;
          }
        }
      }
      gap = Math.floor(gap / 2);
    }
    console.log(compare, swap);
  }

  sortFusion(arr) {
    if (arr.length === 1) {
      // return once we hit an array with a single item
      return arr;
    }

    const middle = Math.floor(arr.length / 2); // get the middle item of the array rounded down
    const left = arr.slice(0, middle); // items on the left side
    const right = arr.slice(middle); // items on the right side

    return this.merge(
      this.sortFusion(left),
      this.sortFusion(right)
    );
  }

// compare the arrays item by item and return the concatenated result
  merge(left, right) {
    const result = [];
    let indexLeft = 0;
    let indexRight = 0;

    while (indexLeft < left.length && indexRight < right.length) {
      if (left[indexLeft] < right[indexRight]) {
        result.push(left[indexLeft]);
        indexLeft++;
      } else {
        result.push(right[indexRight]);
        indexRight++;
      }
    }

    console.log(result.concat(left.slice(indexLeft)).concat(right.slice(indexRight)));

  }
}
