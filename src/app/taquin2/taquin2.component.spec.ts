import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Taquin2Component } from './taquin2.component';

describe('Taquin2Component', () => {
  let component: Taquin2Component;
  let fixture: ComponentFixture<Taquin2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Taquin2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Taquin2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
