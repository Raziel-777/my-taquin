import {Component, OnInit} from '@angular/core';
import {TaquinInline} from '../taquinInline';

@Component({
  selector: 'app-inline',
  templateUrl: './inline.component.html',
  styleUrls: ['./inline.component.css']
})
export class InlineComponent implements OnInit {
  private taquinInline = new TaquinInline();
  public cellsInline = this.taquinInline.taquinArray;
  public iterSwap = null;

  shuffle(): void {
    this.taquinInline.shuffle();
  }

  sort(): void {
    this.iterSwap = this.taquinInline.sort();
  }

  constructor() {
  }

  ngOnInit() {
  }

}
