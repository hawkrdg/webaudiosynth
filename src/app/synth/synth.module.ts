import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FormsModule } from '@angular/forms';

// material imports...
//
import { MatButtonModule } from "@angular/material/button";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { SynthComponent } from './synth.component';


@NgModule({
  declarations: [
		SynthComponent
	],
  imports: [
    CommonModule,
		BrowserAnimationsModule,
		FormsModule,
		MatButtonModule,
		MatSlideToggleModule,
		MatSliderModule,
		MatSelectModule,
    MatIconModule,
		MatInputModule
	],
	exports: [
		SynthComponent
	]
})
export class SynthModule { }
