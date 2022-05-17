import { Component, NgZone, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'WebAudio Synth';
  audioCtx1;
	audioCtx2;
	showHelp = false;
	// @ViewChild('synth1') synth1: ElementRef;
	// @ViewChild('synth2') synth2: ElementRef;

	constructor(
		private zone: NgZone
	) {}

	async ngOnInit() {
		console.log('ngOnInit()...');
    this.audioCtx1 = new (window as any).AudioContext();
		this.audioCtx2 = new (window as any).AudioContext();
	}

	async ngAfterViewInit() {
	}

	openHelp() {
		this.showHelp = true;
	}
	closeHelp() {
		this.showHelp = false;
	}
}
