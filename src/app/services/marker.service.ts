import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { CircleMarker, circleMarker, LatLng, LayerGroup, Map } from 'leaflet';
import { PopupService } from './popup.service';
import { Sample } from '../intefaces/sample.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private http: HttpClient, private popupService: PopupService) {}

  getSamplesInArea(southWest: LatLng, northEast: LatLng): Observable<[Sample]> {
    let params = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat);

    return this.http.get<[Sample]>(
      environment.apiUrl + 'locations/samplesInArea',
      {
        params: params,
      }
    );
  }

  createMarkerLayer(map: Map, elements: [any]) {
    let allMarkers = new Array<CircleMarker>();
    let markersLayer = new LayerGroup();

    for (let el of elements) {
      if (el.location.coordinates) {
        let lon = el.location.coordinates[0];
        let lat = el.location.coordinates[1];

        let mark = circleMarker([lat, lon], {
          radius: 5,
          // color: '#006600',
        });

        mark.bindPopup(this.popupService.makeSamplePopup(el));

        allMarkers.push(mark);
      }
    }

    markersLayer = new LayerGroup(allMarkers);

    return markersLayer;
  }
}
