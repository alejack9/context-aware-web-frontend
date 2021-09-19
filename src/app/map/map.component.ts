import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { LatLng, Layer, LayerGroup, map, Map, tileLayer } from 'leaflet';
import { ClusteringService } from '../services/clustering.service';
import { CommunicationService } from '../services/communication.service';
import { MarkerService } from '../services/marker.service';
import { heatLayer } from '../utils/leaflet-heatmap-exporter';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent {
  @Input('starting-coordinates') set startingCoordinates(value: LatLng) {
    if (this.map) {
      this.map.setView(value, 9);
    }
  }
  private map: Map;

  private samplesMarkerLayer: LayerGroup;
  private activeSamples: boolean;
  private kmeansLayer: LayerGroup;
  private activeKmeans: boolean;
  private activeHeatMap: boolean;
  private heatMapLayer: Layer;

  @ViewChild('map') mapElement: ElementRef;

  @Input('map-height') set mapHeight(value: number) {
    if (!this.mapElement) return;

    this.renderer.setStyle(
      this.mapElement.nativeElement,
      'height',
      `${value}px`
    );

    this.map.invalidateSize();
  }

  initMap(): void {
    this.map = map('map', {
      center: [0, 0],
      zoom: 9,
    });

    const tiles = tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    this.initLayers();
  }

  constructor(
    private renderer: Renderer2,
    private communicationService: CommunicationService,
    private markerService: MarkerService,
    private clusteringService: ClusteringService
  ) {}

  enableSamplesMarkers(toEnable = true): void {
    this.activeSamples = toEnable;

    if (toEnable) this.getSampleArea();
    else this.map.removeLayer(this.samplesMarkerLayer);
  }

  enableKmeansClustering(toEnable = true): void {
    this.activeKmeans = toEnable;
    if (toEnable) this.getKmeansArea();
    else this.map.removeLayer(this.kmeansLayer);
  }

  enableHeatMap(toEnable = true) {
    this.activeHeatMap = toEnable;
    if (toEnable) this.showHeatMap();
    else this.map.removeLayer(this.heatMapLayer);
  }

  async getSampleArea() {
    let bounds = this.map.getBounds();

    const res = await this.communicationService.getSamplesInArea(
      bounds.getSouthWest(),
      bounds.getNorthEast()
    );

    if (this.samplesMarkerLayer) this.map.removeLayer(this.samplesMarkerLayer); // to avoid the adding of layer on layer

    this.samplesMarkerLayer = this.markerService.createMarkerLayer(res);
    this.map.addLayer(this.samplesMarkerLayer);
  }

  async getKmeansArea() {
    let bounds = this.map.getBounds();

    let res;

    try {
      res = await this.communicationService.getKmeansInArea(
        bounds.getSouthWest(),
        bounds.getNorthEast()
      );
    } catch (e: any) {
      console.warn(e.error.message);
    }

    if (!res) return;

    if (this.kmeansLayer) this.map.removeLayer(this.kmeansLayer); // to avoid the adding of layer on layer

    this.kmeansLayer = this.clusteringService.createKmeansLayer(res);

    this.map.addLayer(this.kmeansLayer);
  }

  initLayers() {
    // add marker layer request listeners
    this.map.on('moveend', () => {
      if (this.activeSamples) this.getSampleArea();
      if (this.activeKmeans) this.getKmeansArea();
      if (this.activeHeatMap) this.showHeatMap();
    });
  }

  async showHeatMap() {
    const coordinates = (
      await this.communicationService.getSamplesInArea(
        this.map.getBounds().getSouthWest(),
        this.map.getBounds().getNorthEast()
      )
    ).features.map((n) => {
      return new LatLng(
        n.geometry.coordinates[1],
        n.geometry.coordinates[0],
        n.properties?.noise
      );
    });

    const maxNoise = coordinates
      .map((c) => c.alt || -Infinity)
      .reduce((a, b) => Math.max(a, b), -Infinity);

    if (this.heatMapLayer) this.map.removeLayer(this.heatMapLayer);

    this.heatMapLayer = heatLayer(coordinates, {
      radius: 15,
      maxZoom: 7,
      minOpacity: 0.1,
      max: maxNoise,
    });
    this.heatMapLayer.addTo(this.map);
  }
}
