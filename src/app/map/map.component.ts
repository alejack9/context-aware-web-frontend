import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { LatLng, LayerGroup, map, Map, tileLayer } from 'leaflet';
import { ClusteringService } from '../services/clustering.service';
import { CommunicationService } from '../services/communication.service';
import { MarkerService } from '../services/marker.service';
import { heatLayer } from '../utils/leaflet-heatmap-exporter';
import { NoisesGetterService } from '../services/noises-getter.service';
import { Sample } from '../utils/sample';

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
  private activeMarker: boolean;
  private kmeansLayer: LayerGroup;
  private activeKmeans: boolean;

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
    private readonly noisesService: NoisesGetterService,
    private clusteringService: ClusteringService
  ) {}

  enableSamplesMarkers(toEnable = true): void {
    this.activeMarker = toEnable;

    toEnable
      ? this.getSampleArea()
      : this.map.removeLayer(this.samplesMarkerLayer);
  }

  enableKmeansClustering(toEnable = true): void {
    this.activeKmeans = toEnable;

    toEnable ? this.getKmeansArea() : this.map.removeLayer(this.kmeansLayer);
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
      if (this.activeMarker) this.getSampleArea();
      if (this.activeKmeans) this.getKmeansArea();
      this.showHeatMap();
    });
  }

  async showHeatMap() {
    let allNoises = (await this.noisesService.getAllNoises(
      this.map.getBounds().getSouthWest(),
      this.map.getBounds().getNorthEast()
    )) as Sample[];

    let coordinates = allNoises.map((n) => {
      return new LatLng(
        n.location.coordinates[1],
        n.location.coordinates[0],
        n.noise
      );
    });

    const heat = heatLayer(coordinates, { radius: 50, maxZoom: 7 });
    heat.setOptions({ minOpacity: 0.1 });
    heat.addTo(this.map);
  }
}
