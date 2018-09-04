import {Component, OnInit} from '@angular/core';
import {TaquinArray} from '../taquinArray';

@Component({
  selector: 'app-taquin',
  templateUrl: './taquin.component.html',
  styleUrls: ['./taquin.component.css']
})
export class TaquinComponent implements OnInit {
  public cells = new TaquinArray();

  change(): void {
    const x = Math.floor(Math.random() * this.cells.taquinArray.length);
    const y = Math.floor(Math.random() * this.cells.taquinArray.length);
    const cell = [x, y];
    console.log(cell);
    // array of moves
    const moves = [1, 2, 3, 4]; // 1: UP, 2: DOWN, 3: RIGHT, 4: LEFT
    const move = moves[Math.floor(Math.random() * moves.length)];
    if ((move === 1 && x === 0) || (move === 2 && x === 2) || (move === 3 && y === 2) || (move === 4 && y === 0)) {
      console.log('MOUVEMENT IMPOSSIBLE');
    } else {
      this.cells.swap(cell, move);
    }
  }

  constructor() {
  }

  ngOnInit() {
  }
}

