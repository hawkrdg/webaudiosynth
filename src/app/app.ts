import { Component, signal, inject, DOCUMENT, ChangeDetectionStrategy } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav'; 
import { MatButtonModule } from '@angular/material/button'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 

// import { GlobalData } from "./services/global-data";
import { ThemeSwitcherComponent } from "./theme-switcher/theme-switcher.component";
import { Help } from "./help/help";
import { Synth } from "./synth/synth";

@Component({
  selector: 'app-root',
  imports: [
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatTooltipModule,
    ThemeSwitcherComponent,
    Help,
    Synth
  ],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Web Audio Synth Demo');
  document = inject(DOCUMENT);
  window = document.defaultView;
  audioCtx1;
  audioCtx2;

  showHelpFlag = signal(false);

	async ngOnInit() {
		console.log('ngOnInit()...');
    this.audioCtx1 = new window.AudioContext();
		this.audioCtx2 = new window.AudioContext();
	}

  showHelp = () => {
    this.showHelpFlag.set(true);
  }
}
