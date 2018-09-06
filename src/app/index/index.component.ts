import {Component, OnInit} from '@angular/core';
import {PatternService} from './pattern.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  private patternService: PatternService;

  changePattern(pattern: string, event: Event): void {
    event.preventDefault();
    this.patternService.callChangePattern(pattern);
  }

  constructor(patternService: PatternService) {
    this.patternService = patternService;
  }

  ngOnInit() {
  }

}
