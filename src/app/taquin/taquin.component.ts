import {Component, OnInit} from '@angular/core';
import {TaquinArray} from '../taquinArray';

@Component({
  selector: 'app-taquin',
  templateUrl: './taquin.component.html',
  styleUrls: ['./taquin.component.css']
})
export class TaquinComponent implements OnInit {
  public CELLS = new TaquinArray().taquinArray;

  change(): void {
    console.log(this.CELLS);
    const x = Math.floor(Math.random() * this.CELLS.length);
    const y = Math.floor(Math.random() * this.CELLS.length);
    const cell = [x, y];
    // array of moves
    const moves = [1, 2, 3, 4]; // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
    const move = moves[Math.floor(Math.random() * moves.length)];
    if ((move === 1 && x === 0) || (move === 2 && x === 2) || (move === 3 && y === 2) || (move === 4 && y === 0)) {
      alert('MOUVEMENT IMPOSSIBLE');
    } else {
      this.CELLS = TaquinArray.swap(this.CELLS, cell, move);
      console.log(this.CELLS);
    }
  }

  constructor() {
  }

  ngOnInit() {
  }
}

