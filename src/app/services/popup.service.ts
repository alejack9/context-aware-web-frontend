import { Injectable } from '@angular/core';
import { Sample } from '../intefaces/sample.interface';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor() {}

  makeSamplePopup(data: Sample): string {
    return (
      `<div> Longitude:  ${data.location.coordinates[0]} </div>` +
      `<div> Latitude: ${data.location.coordinates[1]} </div>` +
      `<div> Noise: ${data.noise} </div>`
    );
  }
}
