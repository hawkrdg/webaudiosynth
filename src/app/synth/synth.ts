import { Component, signal, input, inject, ChangeDetectorRef, DOCUMENT, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from "@angular/forms";

import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle'; 
import { MatInputModule } from '@angular/material/input'; 
import { MatSelectModule } from '@angular/material/select'; 
import { MatTooltipModule } from '@angular/material/tooltip'; 

@Component({
  selector: 'app-synth',
  imports: [
    FormsModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './synth.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './synth.scss',
})
export class Synth {
	dest = input<AudioDestinationNode>();		// Destination to connect to...
	ctx = input<AudioContext>();			      // AudioContext that this synth will run in...

  cdr = inject(ChangeDetectorRef);
  synthPower = signal(false);
  synthFrequency = 600;
	synthWaveforms = ['sine', 'triangle', 'sawtooth', 'square'];
	synthCurrentWaveform = 'sine';
  // synthIsMuted = true;
	synthGain = 0.2;
	synthPan = 0;
	synthMaxFreq = 20000;
	synthMinFreq = 20;

  amPower = signal(false);
	amCurrentWaveform = 'sine';
	amGainPercent = 80;
	amPeriod = 2;

  fmPower = signal(false);
	fmCurrentWaveform = 'sine';
	fmGainPercent = 50;
	fmPeriod = 2;

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

  ngOnInit() {
    // Main Oscillator...
    //
 		this.synthOscillator = this.ctx().createOscillator();
		this.synthOscillator.channelCountMode = 'explicit';
		this.synthOscillator.channelCount = 2;
		this.synthOscillator.frequency.value = this.synthFrequency;

		this.synthPowerSwitch = this.ctx().createGain();
		this.synthPowerSwitch.gain.value = 0;

		this.synthSplitter = this.ctx().createChannelSplitter();
		this.synthMerger = this.ctx().createChannelMerger();

		this.synthLevel = this.ctx().createGain();
		this.synthLevel.gain.value = this.synthGain;

		this.synthPanner = this.ctx().createStereoPanner();
		this.synthPanner.pan.value = this.synthPan;

		// AM modulation chain...
		//
		this.amLfoOscillator = this.ctx().createOscillator();
		this.amLfoOscillator.frequency.value = 1 / this.amPeriod;
		this.amLfoGain = this.ctx().createGain();
		this.amLfoGain.gain.value = this.synthLevel.gain.value * this.amGainPercent / 100;
		this.amLfoOscillator.connect(this.amLfoGain);
		this.amLfoOscillator.start();

		// FM modulation chain...
		//
		this.fmLfoOscillator = this.ctx().createOscillator();
		this.fmLfoOscillator.frequency.value = 1 / this.fmPeriod;
		this.fmLfoGain = this.ctx().createGain();
		this.fmLfoGain.gain.value = this.synthOscillator.frequency.value * this.fmGainPercent / 100;
		this.fmLfoOscillator.connect(this.fmLfoGain);
		this.fmLfoOscillator.start();

		// build the audio graph
		//
		this.synthOscillator.connect(this.synthPowerSwitch).connect(this.synthLevel).connect(this.synthPanner).connect(this.dest());
		this.synthOscillator.start();

  }

  //-- main synth controls...
  //
  togglePower = () => {
    if (this.synthPower()) {
      this.synthPower.set(false);
      this.synthPowerSwitch.gain.value = 0;
    } else {
      this.synthPower.set(true);
      this.synthPowerSwitch.gain.value = 1;
    }
  }

	updateSynthWaveform(): void {
		console.log('updateSynthWaveform()... ', this.synthCurrentWaveform);
		this.synthOscillator.type = this.synthCurrentWaveform;
	}

	updateSynthLevel(): void {
		console.log('updateSynthLevel()... ', this.synthGain);
			this.synthLevel.gain.value = this.synthGain;
			// this.updateAmGain();
	}

	updateSynthFrequency(): void {
    if (this.synthFrequency < 20) {
      this.synthFrequency = 20;
		}
		if (this.synthFrequency > 20000) {
      this.synthFrequency = 20000;
		}
    console.log('updateSynthFrequency()... ', this.synthFrequency);
		this.synthOscillator.frequency.value = this.synthFrequency;
		// this.updateFmGain();
	}

	updateSynthPanner(): void {
		console.log('updateSynthPanner()... ', this.synthPan);
    this.synthPanner.pan.value = this.synthPan;
	}

  //-- AM Modulation controls...
  //
  toggleAMPower = () => {
    if (this.amPower()) {
      this.amPower.set(false);
      this.amLfoGain.disconnect();
    } else {
      this.amPower.set(true);
      this.amLfoGain.connect(this.synthLevel.gain);
    }
  }
  updateAMWaveform(): void {
		this.amLfoOscillator.type = this.amCurrentWaveform;
	}
	updateAMGain(): void {
		this.amLfoGain.gain.value = this.synthLevel.gain.value * this.amGainPercent / 100;
	}
	updateAMPeriod(): void {
		this.amLfoOscillator.frequency.value = this.amPeriod;
	}



  //-- FM modulation controls...
  //
  toggleFMPower = () => {
    if (this.fmPower()) {
      this.fmPower.set(false);
      this.fmLfoGain.disconnect();
    } else {
      this.fmPower.set(true);
      this.fmLfoGain.connect(this.synthOscillator.frequency)
    }
  }
  updateFMWaveform(): void {
		this.fmLfoOscillator.type = this.fmCurrentWaveform;
	}
	updateFMGain(): void {
		this.fmLfoGain.gain.value = this.synthOscillator.frequency.value * this.fmGainPercent / 100;
	}
	updateFMPeriod(): void {
		this.fmLfoOscillator.frequency.value = this.fmPeriod;
	}



  //-- util methods...
  //
  formatSliderLabelGain(value: number): string {
    return value.toFixed(1);
  }
  formatSliderLabelPan(value: number): string {
    return value.toFixed(1) + (value < 0 ? 'L' : 'R');
  }
  formatSliderLabelPercent(value: number): string {
    return value.toFixed(0) + '%';
  }
  formatSliderLabelFrequency(value: number): string {
    return value.toFixed(1) + 'Hz';
  }
}
