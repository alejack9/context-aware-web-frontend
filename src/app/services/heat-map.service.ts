import { Point, FeatureCollection } from 'geojson';
import { LatLng } from 'leaflet';
import { Injectable } from '@angular/core';
import { heatLayer } from '../utils/leaflet-heatmap-exporter';

@Injectable({
  providedIn: 'root',
})
export class HeatMapService {
  constructor() {}

  createHeatMapLayer(res: FeatureCollection<Point>) {
    const coordinates = res.features.map((n) => {
      return new LatLng(
        n.geometry.coordinates[1],
        n.geometry.coordinates[0],
        n.properties?.noise
      );
    });

    const maxNoise = coordinates
      .map((c) => c.alt || -Infinity)
      .reduce((a, b) => Math.max(a, b), -Infinity);

    return heatLayer(coordinates, {
      radius: 15,
      maxZoom: 7,
      minOpacity: 0.1,
      max: maxNoise,
    });
  }
}
