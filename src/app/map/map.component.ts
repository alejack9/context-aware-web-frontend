import { FeatureCollection, GeoJsonProperties, Point } from 'geojson';
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
import {
  LatLng,
  Layer,
  map,
  Map as LeafletMap,
  tileLayer,
  LatLngBounds,
} from 'leaflet';
import { ClusteringService } from '../services/clustering.service';
import { CommunicationService } from '../services/communication.service';
import { MarkerService } from '../services/marker.service';

type LayerName = 'kmean' | 'samples' | 'heatmap';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private communicationService: CommunicationService,
    private markerService: MarkerService,
    private kmeanService: ClusteringService,
    private heatMapService: HeatMapService
  ) {}

  ngAfterViewInit() {
    this.initMap();
    this.cdr.detectChanges();
  }

  @Input('starting-coordinates') set startingCoordinates(value: LatLng) {
    this.map?.setView(value, 9);
    this.maxArea = this.map?.getBounds() || new LatLngBounds([0, 0], [0, 0]);
  }

  @Input('k') set setKAndRefresh(value: number) {
    this.k = value;
    if (this.layers.has('kmean')) this.enableKmeansClustering(true);
  }

  @Input('map-height') set mapHeight(value: number) {
    if (!this.mapElement) return;

    this.renderer.setStyle(
      this.mapElement.nativeElement,
      'height',
      `${value}px`
    );

    this.map.invalidateSize();
  }

  @Input('dummyUpdates') dummyUpdates: boolean = true;
  @Input('gpsPerturbated') gpsPerturbated: boolean = true;

  @Input('dummyUpdatesMinRadius') dummyUpdatesMinRadius: number;
  @Input('dummyUpdatesMaxRadius') dummyUpdatesMaxRadius: number;
  @Input('gpsPerturbatedDecimals') gpsPerturbatedDecimals: number;

  @ViewChild('map') mapElement: ElementRef;

  private k: number;
  private map: LeafletMap;
  private minZoom = 9;
  private maxArea: LatLngBounds = new LatLngBounds([0, 0], [0, 0]);

  private layers = new Map<LayerName, Layer>();

  doneLoadingMoveEnd = true;

  private initMap(): void {
    this.map = map('map', {
      center: [0, 0],
      zoom: this.minZoom,
      preferCanvas: true,
    });

    const tiles = tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        minZoom: 6,
        attribution:
          '&copy; <a target="_blank" href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);

    this.initLayers();
  }

  private async refreshKMean() {
    if (this.layers.has('kmean')) this.showLayer('kmean');
  }

  private async refreshLayers(refreshKMean = true) {
    let samples;

    if (this.layers.has('samples')) {
      samples = await this.getRes('samples');
      this.showLayer('samples', samples);
    }
    if (refreshKMean) this.refreshKMean();

    if (this.layers.has('heatmap')) {
      this.showLayer('heatmap', samples);
    }
  }

  private initLayers() {
    // add marker layer request listeners
    this.map.on('moveend', async (event) => {
      this.doneLoadingMoveEnd = false;

      await Promise.all([
        this.refreshKMean(),
        (async () => {
          if (!this.maxArea.contains(event.target.getBounds())) {
            this.maxArea = event.target.getBounds();
            await this.refreshLayers(false);
          }
        })(),
      ]);

      this.doneLoadingMoveEnd = true;
    });
  }

  async enableLayer(toEnable: boolean, layer: LayerName) {
    if (toEnable) await this.showLayer(layer);
    else if (this.layers.has(layer)) {
      this.map.removeLayer(this.layers.get(layer) as Layer);
      this.layers.delete(layer);
    }
  }

  async enableSamplesMarkers(toEnable: boolean) {
    await this.enableLayer(toEnable, 'samples');
  }

  async enableKmeansClustering(toEnable: boolean) {
    await this.enableLayer(toEnable, 'kmean');
  }

  async enableHeatMap(toEnable: boolean) {
    await this.enableLayer(toEnable, 'heatmap');
  }

  async setGpsOrDummy() {
    await this.refreshLayers();
  }

  private async showLayer(
    layerName: LayerName,
    samples?: FeatureCollection<Point, GeoJsonProperties>
  ) {
    let res;

    if (samples !== undefined) res = samples;
    else {
      try {
        res = await this.getRes(layerName);
      } catch (e: any) {
        console.warn(e.error.message);
      }
    }

    if (!res) return;

    if (this.layers.has(layerName)) {
      this.map.removeLayer(this.layers.get(layerName) as Layer);
      this.layers.delete(layerName);
    }

    const layer = this.createLayer(res, layerName);
    this.layers.set(layerName, layer);

    this.map.addLayer(layer);

    return res;
  }

  createLayer(res: FeatureCollection<Point>, layerName: LayerName): Layer {
    switch (layerName) {
      case 'heatmap':
        return this.heatMapService.createHeatMapLayer(res);
      case 'kmean':
        return this.kmeanService.createKmeansLayer(res, this.k);
      case 'samples':
        return this.markerService.createMarkerLayer(res);
    }
  }

  async getRes(layerName: LayerName): Promise<FeatureCollection<Point>> {
    switch (layerName) {
      case 'heatmap':
      case 'samples':
        return await this.communicationService.getSamplesInArea(
          this.map.getBounds().getSouthWest(),
          this.map.getBounds().getNorthEast(),
          this.dummyUpdates,
          this.gpsPerturbated,
          this.dummyUpdatesMinRadius,
          this.dummyUpdatesMaxRadius,
          this.gpsPerturbatedDecimals
        );
      case 'kmean':
        return await this.communicationService.getKmeansInArea(
          this.map.getBounds().getSouthWest(),
          this.map.getBounds().getNorthEast(),
          this.dummyUpdates,
          this.gpsPerturbated,
          // this.dummyUpdatesMinRadius,
          // this.dummyUpdatesMaxRadius,
          // this.gpsPerturbatedDecimals
          this.k
        );
    }
  }
}
