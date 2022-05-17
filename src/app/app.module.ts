import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from '@angular/forms';


// material imports...
//
import { MatButtonModule } from "@angular/material/button";
import { MatSliderModule } from '@angular/material/slider';
// import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
// import { MatInputModule } from '@angular/material/input';

import { SynthModule } from "./synth/synth.module";
// app components
//
import { AppComponent } from './app.component';
// import { SynthComponent } from './synth/synth.component';

@NgModule({
  declarations: [
    AppComponent,
    // SynthComponent
  ],
  imports: [
    BrowserModule,
		CommonModule,
		SynthModule,
		FormsModule,
    BrowserAnimationsModule,
		MatButtonModule,
		MatSlideToggleModule,
		MatSliderModule,
    MatIconModule,
		// MatSelectModule,
		// MatInputModule
  ],
  providers: [],
  bootstrap: [
		AppComponent
	]
})
export class AppModule { }
