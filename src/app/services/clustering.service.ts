import { Injectable } from '@angular/core';
import { circleMarker, geoJSON, LayerGroup } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class ClusteringService {
  constructor() {}

  createKmeansLayer(featureCollect: any): LayerGroup {
    let kmeansLayer = geoJSON(featureCollect, {
      pointToLayer: function (feature, latlng) {
        let step = 295 / 4;

        return circleMarker(latlng, {
          radius: 5,
          color: `hsl(${step * feature.properties.cid}, 100%, 50%)`,
          fillColor: `hsl(${step * feature.properties.cid}, 60%, 75%)`,
          opacity: 1,
          fillOpacity: 1,
        });
      },
    });

    return kmeansLayer;
  }
}
