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
    layer.bindPopup(
      `<div> Longitude:  ${feat.geometry.coordinates[0]} </div>` +
        `<div> Latitude: ${feat.geometry.coordinates[1]} </div>` +
        `<div> Noise: ${feat.properties.noise} </div>`
    );
  }
}
