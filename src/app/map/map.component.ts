import { HeatMapService } from './../services/heat-map.service';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';
import { LatLng, Layer, LayerGroup, map, Map, tileLayer } from 'leaflet';
import { ClusteringService } from '../services/clustering.service';
import { CommunicationService } from '../services/communication.service';
import { MarkerService } from '../services/marker.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  @Input('starting-coordinates') set startingCoordinates(value: LatLng) {
    if (this.map) {
      this.map.setView(value, 9);
    }
  }
  private k: number;
  @Input('k') set kss(value: number) {
    this.k = value;
    if (this.kmeansLayer) this.enableKmeansClustering(true);
  }
  private map: Map;

  private samplesMarkerLayer: Layer | null;
  private kmeansLayer: Layer | null;
  private heatMapLayer: Layer | null;

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

  private initMap(): void {
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

  ngAfterViewInit() {
    this.initMap();
    this.cdr.detectChanges();
  }

  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private communicationService: CommunicationService,
    private markerService: MarkerService,
    private clusteringService: ClusteringService,
    private heatMapService: HeatMapService
  ) {}

  enableSamplesMarkers(toEnable = true): void {
    if (toEnable) this.getSampleArea();
    else if (this.samplesMarkerLayer) {
      this.map.removeLayer(this.samplesMarkerLayer);
      this.samplesMarkerLayer = null;
    }
  }

  enableKmeansClustering(toEnable = true): void {
    if (toEnable) this.getKmeansArea();
    else if (this.kmeansLayer) {
      this.map.removeLayer(this.kmeansLayer);
      this.kmeansLayer = null;
    }
  }

  enableHeatMap(toEnable = true) {
    if (toEnable) this.showHeatMap();
    else if (this.heatMapLayer) {
      this.map.removeLayer(this.heatMapLayer);
      this.heatMapLayer = null;
    }
  }

  async getSampleArea() {
    let bounds = this.map.getBounds();

    const res = await this.communicationService.getSamplesInArea(
      bounds.getSouthWest(),
      bounds.getNorthEast()
    );

    if (this.samplesMarkerLayer) {
      this.map.removeLayer(this.samplesMarkerLayer); // to avoid the adding of layer on layer
      this.samplesMarkerLayer = null;
    }
    this.samplesMarkerLayer = this.markerService.createMarkerLayer(res);
    this.map.addLayer(this.samplesMarkerLayer);
  }

  async getKmeansArea() {
    let bounds = this.map.getBounds();

    let res;

    try {
      res = await this.communicationService.getKmeansInArea(
        bounds.getSouthWest(),
        bounds.getNorthEast(),
        this.k
      );
    } catch (e: any) {
      console.warn(e.error.message);
    }

    if (!res) return;

    if (this.kmeansLayer) {
      this.map.removeLayer(this.kmeansLayer); // to avoid the adding of layer on layer
      this.kmeansLayer = null;
    }

    this.kmeansLayer = this.clusteringService.createKmeansLayer(res, this.k);

    this.map.addLayer(this.kmeansLayer);
  }

  initLayers() {
    // add marker layer request listeners
    this.map.on('moveend', () => {
      if (this.samplesMarkerLayer) this.getSampleArea();
      if (this.kmeansLayer) this.getKmeansArea();
      if (this.heatMapLayer) this.showHeatMap();
    });
  }

  async showHeatMap() {
    let bounds = this.map.getBounds();

    let res;

    try {
      res = await this.communicationService.getSamplesInArea(
        bounds.getSouthWest(),
        bounds.getNorthEast()
      );
    } catch (e: any) {
      console.warn(e.error.message);
    }

    if (!res) return;

    if (this.heatMapLayer) {
      this.map.removeLayer(this.heatMapLayer); // to avoid the adding of layer on layer
      this.heatMapLayer = null;
    }
    this.heatMapLayer = this.heatMapService.createHeatMapLayer(res);

    this.map.addLayer(this.heatMapLayer);
  }
}
