import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { circleMarker, Map } from 'leaflet';
import { PopupService } from './popup.service';
import { Sample } from '../intefaces/sample.interface';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private http: HttpClient, private popupService: PopupService) {}

  makeSamplesMarkers(map: Map): void {
    // and unify the markers into a unique layer
    this.http
      .get<[Sample]>(environment.apiUrl + 'locations/all')
      .subscribe((response: any) => {
        for (let el of response) {
          if (el.location.coordinates) {
            let lon = el.location.coordinates[0];
            let lat = el.location.coordinates[1];

            let mark = circleMarker([lat, lon], {
              radius: 5,
              // color: '#006600',
            });

            mark.bindPopup(this.popupService.makeSamplePopup(el));
            mark.addTo(map);
          }
        }
      });
  }

  removeMarkers(map: Map) {}
}
