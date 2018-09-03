import { Component, OnInit } from '@angular/core';
import { Taquin } from '../taquin';

@Component({
  selector: 'app-taquin',
  templateUrl: './taquin.component.html',
  styleUrls: ['./taquin.component.css']
})
export class TaquinComponent implements OnInit {
  taquin: Taquin;
  constructor() { }

  ngOnInit() {
  }

}
