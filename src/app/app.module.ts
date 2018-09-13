import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TaquinComponent } from './taquin/taquin.component';
import { InlineComponent } from './inline/inline.component';
import { IndexComponent } from './index/index.component';
import { Taquin2Component } from './taquin2/taquin2.component';
import {RouterModule, Routes} from '@angular/router';
import { SortComponent } from './sort/sort.component';


const appRoutes: Routes = [
  { path: '', component: TaquinComponent},
  { path: 'taquin', component: TaquinComponent },
  { path: 'taquin2', component: Taquin2Component },
  { path: 'sort', component: SortComponent }
];


@NgModule({
  declarations: [
    AppComponent,
    TaquinComponent,
    InlineComponent,
    IndexComponent,
    Taquin2Component,
    SortComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule.forRoot(
      appRoutes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
