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

    layer.bindPopup(
      `<div> <b> Longitude </b>:  ${feat.geometry.coordinates[0]} </div>` +
        `<div> <b> Latitude </b>: ${feat.geometry.coordinates[1]} </div>` +
        `<div> <b> Noise </b>: ${feat.properties.noise} </div>` +
        `<div> <b> Timestamp </b>:  ${date.toLocaleDateString(undefined, {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        })} </div>`
    );
  }
}
