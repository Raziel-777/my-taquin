import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { TaquinComponent } from './taquin/taquin.component';
import { HeaderComponent } from './header/header.component';
import { InlineComponent } from './inline/inline.component';

@NgModule({
  declarations: [
    AppComponent,
    TaquinComponent,
    HeaderComponent,
    InlineComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
