import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { LatLng, map, Map, tileLayer } from 'leaflet';
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

  initLayers() {
    // add marker layer request listeners
    this.map.on('movestart', () => {});

    this.map.on('moveend', () => {
      this.showHeatMap();
    });
  }

  constructor(
    private renderer: Renderer2,
    private readonly noisesService: NoisesGetterService
  ) {}

  async showHeatMap() {
    let allNoises = (await this.noisesService.getAllNoises(
      this.map.getBounds().getSouthWest(),
      this.map.getBounds().getNorthEast()
    )) as Sample[];

    let coordinates: [LatLng] = [new LatLng(0, 0, 0)];
    allNoises.map((n) => {
      coordinates.pop();
      coordinates.push(
        new LatLng(
          n.location.coordinates[1],
          n.location.coordinates[0],
          n.noise
        )
      );
    });

    const heat = heatLayer(coordinates, { radius: 50, maxZoom: 7 });
    heat.setOptions({ minOpacity: 0.1 });
    heat.addTo(this.map);
  }
}
