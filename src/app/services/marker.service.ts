import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

import { environment } from 'src/environments/environment';

import { CircleMarker, circleMarker, LayerGroup } from 'leaflet';
import { PopupService } from './popup.service';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor(private popupService: PopupService) {}

  createMarkerLayer(elements: [any]): LayerGroup {
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
