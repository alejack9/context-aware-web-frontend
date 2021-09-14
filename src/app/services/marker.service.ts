import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { circleMarker, Map } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private http: HttpClient) {}

  makeSamplesMarkers(map: Map): void {
    this.http
      .get(environment.apiUrl + 'locations/all')
      .subscribe((response: any) => {
        for (let el of response) {
          if (el.location.coordinates) {
            let lon = el.location.coordinates[0];
            let lat = el.location.coordinates[1];

            let mark = circleMarker([lat, lon]);
            mark.addTo(map);
          }
        }
      });
  }
}
