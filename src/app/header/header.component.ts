import {Component, HostListener, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  // @Input() pattern: TaquinComponent;
  //
  // @HostListener('click')
  // click() {
  //   this.pattern.pattern()
  // }

  constructor() { }

  ngOnInit() {
  }

}
