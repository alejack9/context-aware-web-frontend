import { Injectable } from '@angular/core';

import { circleMarker, geoJSON, Layer, LayerGroup } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class MarkerService {
  constructor() {}

  createMarkerLayer(featureCollect: any): LayerGroup {
    let markersLayer = geoJSON(featureCollect, {
      pointToLayer: function (feat, latlng) {
        return circleMarker(latlng, {
          radius: 5,
        });
      },
      onEachFeature: this.addPopup,
    });

    return markersLayer;
  }

  private addPopup(feat: any, layer: Layer) {
    let date = new Date(feat.properties.timestamp);
    let minutes = date.getMinutes();

    layer.bindPopup(
      `<div> <b> Longitude </b>:  ${feat.geometry.coordinates[0]} </div>` +
        `<div> <b> Latitude </b>: ${feat.geometry.coordinates[1]} </div>` +
        `<div> <b> Noise </b>: ${feat.properties.noise} </div>` +
        `<div> <b> Timestamp </b>:  ${date.toDateString()} ${
          date.getHours() - date.getTimezoneOffset() / 60
        }:${minutes < 10 ? '0' + minutes : minutes} </div>`
    );
  }
}
