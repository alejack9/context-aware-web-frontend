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
import { LatLng, Layer, map, Map as LeafletMap, tileLayer } from 'leaflet';
import { ClusteringService } from '../services/clustering.service';
import { CommunicationService } from '../services/communication.service';
import { MarkerService } from '../services/marker.service';

type LayersName = 'kmean' | 'samples' | 'heatmap';

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

  @ViewChild('map') mapElement: ElementRef;

  private k: number;
  private map: LeafletMap;

  private layers = new Map<LayersName, Layer>();

  private initMap(): void {
    this.map = map('map', {
      center: [0, 0],
      zoom: 9,
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

  private initLayers() {
    // add marker layer request listeners
    this.map.on('moveend', () => {
      if (this.layers.has('samples')) this.showLayer('samples');
      if (this.layers.has('kmean')) this.showLayer('kmean');
      if (this.layers.has('heatmap')) this.showLayer('heatmap');
    });
  }

  enableLayer(toEnable: boolean, layer: LayersName) {
    if (toEnable) this.showLayer(layer);
    else if (this.layers.has(layer)) {
      this.map.removeLayer(this.layers.get(layer) as Layer);
      this.layers.delete(layer);
    }
  }

  enableSamplesMarkers(toEnable: boolean) {
    this.enableLayer(toEnable, 'samples');
  }

  enableKmeansClustering(toEnable: boolean) {
    this.enableLayer(toEnable, 'kmean');
  }

  enableHeatMap(toEnable: boolean) {
    this.enableLayer(toEnable, 'heatmap');
  }

  private async showLayer(layerName: LayersName) {
    let res;

    try {
      res = await this.getRes(layerName);
    } catch (e: any) {
      console.warn(e.error.message);
    }

    if (!res) return;

    if (this.layers.has(layerName)) {
      this.map.removeLayer(this.layers.get(layerName) as Layer);
      this.layers.delete(layerName);
    }

    const layer = this.createLayer(res, layerName);
    this.layers.set(layerName, layer);

    this.map.addLayer(layer);
  }

  createLayer(res: FeatureCollection<Point>, layerName: LayersName): Layer {
    switch (layerName) {
      case 'heatmap':
        return this.heatMapService.createHeatMapLayer(res);
      case 'kmean':
        return this.kmeanService.createKmeansLayer(res, this.k);
      case 'samples':
        return this.markerService.createMarkerLayer(res);
    }
  }

  async getRes(layerName: LayersName): Promise<FeatureCollection<Point>> {
    switch (layerName) {
      case 'heatmap':
      case 'samples':
        return await this.communicationService.getSamplesInArea(
          this.map.getBounds().getSouthWest(),
          this.map.getBounds().getNorthEast()
        );
      case 'kmean':
        return await this.communicationService.getKmeansInArea(
          this.map.getBounds().getSouthWest(),
          this.map.getBounds().getNorthEast(),
          this.k
        );
    }
  }
}
