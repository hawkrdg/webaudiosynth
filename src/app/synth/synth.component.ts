import { Component, NgZone, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

const oscillatorTypes = [
	'sine',
	'triangle',
	'sawtooth',
	'square'
];

@Component({
  selector: 'stereo-synth',
  templateUrl: './synth.component.html',
  styleUrls: ['./synth.component.scss']
})
export class SynthComponent implements OnInit {
	@Input() dest: any;							// Destination to connect to...
	@Input() ctx;			// AudioContext that this synth will run in...
	waveforms = oscillatorTypes;
	synthWaveform = 'sine';
	synthPower = 0;
	synthIsMuted = true;
	synthFrequency = 440;
	synthGain = 0.2;
	synthPan = 0;
	amIsEngaged = false;
	amWaveform = 'sine';
	amPercent = 80;
	amPeriod = 2;
	fmIsEngaged = false;
	fmWaveform = 'sine';
	fmPercent = 50;
	fmPeriod = 2;
	maxFreq = 20000;
	minFreq = 20;

	synthOscillator;
	synthPowerSwitch;
	synthLevel;
	synthPanner;
	synthSplitter;
	synthMerger;
	amLfoOscillator;
	amLfoGain;
	fmLfoOscillator;
	fmLfoGain;

  constructor(
		private zone: NgZone
	) { }

  ngOnInit(): void {
		this.synthOscillator = this.ctx.createOscillator();
		this.synthOscillator.channelCountMode = 'explicit';
		this.synthOscillator.channelCount = 2;
		this.synthOscillator.frequency.value = this.synthFrequency;

		this.synthPowerSwitch = this.ctx.createGain();
		this.synthPowerSwitch.gain.value = 0;

		this.synthSplitter = this.ctx.createChannelSplitter();
		this.synthMerger = this.ctx.createChannelMerger();

		this.synthLevel = this.ctx.createGain();
		this.synthLevel.gain.value = this.synthGain;

		this.synthPanner = this.ctx.createStereoPanner();
		this.synthPanner.pan.value = this.synthPan;

		// AM modulation chain
		//
		this.amLfoOscillator = this.ctx.createOscillator();
		this.amLfoOscillator.frequency.value = 1 / this.amPeriod;
		this.amLfoGain = this.ctx.createGain();
		this.amLfoGain.gain.value = this.synthLevel.gain.value * this.amPercent / 100;
		this.amLfoOscillator.connect(this.amLfoGain);
		this.amLfoOscillator.start();

		// FM modulation chain
		//
		this.fmLfoOscillator = this.ctx.createOscillator();
		this.fmLfoOscillator.frequency.value = 1 / this.fmPeriod;
		this.fmLfoGain = this.ctx.createGain();
		this.fmLfoGain.gain.value = this.synthOscillator.frequency.value * this.fmPercent / 100;
		this.fmLfoOscillator.connect(this.fmLfoGain);
		this.fmLfoOscillator.start();

		// build the audio graph
		//
		this.synthOscillator.connect(this.synthPowerSwitch).connect(this.synthLevel).connect(this.synthPanner).connect(this.dest);
		this.synthOscillator.start();
  }120

	togglePower(): void {
		setTimeout(() => {
			if (this.synthPower) {
				this.synthPowerSwitch.gain.value = 1;
			} else {
				this.synthPowerSwitch.gain.value = 0;
			}
		}, 10);
	}

	updateSynthWaveform(): void {
		console.log('updateSynthWaveform()... ', this.synthWaveform);
		this.synthOscillator.type = this.synthWaveform;
	}

	updateSynthLevel(): void {
			this.synthLevel.gain.value = this.synthGain;
			this.updateAmGain();
	}

	updateSynthFrequency(): void {
		if (this.synthFrequency < 20) {
			this.synthFrequency = 20;
		}
		if (this.synthFrequency > 20000) {
			this.synthFrequency = 20000;
		}
		this.synthOscillator.frequency.value = this.synthFrequency;
		this.updateFmGain();
	}

	// AM modulation
	//
	toggleAmPower(): void {
		if (this.amIsEngaged) {
			this.amIsEngaged = false;
			this.amLfoGain.disconnect();
		} else {
			this.amIsEngaged = true;
			this.amLfoGain.connect(this.synthLevel.gain);
		}
	}
	updateAmWaveform(): void {
		this.amLfoOscillator.type = this.amWaveform;
	}
	updateAmGain(): void {
		this.amLfoGain.gain.value = this.synthLevel.gain.value * this.amPercent / 100;
	}
	updateAmPeriod(): void {
		this.amLfoOscillator.frequency.value = 1 / this.amPeriod;
	}

	// FM modulation
	//
	toggleFmPower(): void {
		if (this.fmIsEngaged) {
			this.fmIsEngaged = false;
			this.fmLfoGain.disconnect();
		} else {
			this.fmIsEngaged = true;
			this.fmLfoGain.connect(this.synthOscillator.frequency)
		}
	}
	updateFmWaveform(): void {
		this.fmLfoOscillator.type = this.fmWaveform;
	}
	updateFmGain(): void {
		this.fmLfoGain.gain.value = this.synthOscillator.frequency.value * this.fmPercent / 100;
	}
	updateFmPeriod(): void {
		this.fmLfoOscillator.frequency.value = 1 / this.fmPeriod;
	}

}
