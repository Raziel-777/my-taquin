import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaquinComponent } from './taquin.component';
import {TaquinArray} from '../taquinArray';

describe('TaquinComponent', () => {
  let component: TaquinComponent;
  let fixture: ComponentFixture<TaquinComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaquinComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaquinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
