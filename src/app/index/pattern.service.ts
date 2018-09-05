import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {TaquinComponent} from '../taquin/taquin.component';

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  private taquinComponent = new Subject<string>();
  changePattern$ = this.taquinComponent.asObservable();
  callChangePattern(pattern: string) {
    this.taquinComponent.next(pattern);
  }

  // changePattern(pattern: string): void {
  //   this.taquinComponent.pattern(pattern);
  // }

  constructor() {
  }
}
