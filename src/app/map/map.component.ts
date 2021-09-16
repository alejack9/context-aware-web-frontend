import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { LatLng, LayerGroup, map, Map, tileLayer } from 'leaflet';
import { MarkerService } from '../services/marker.service';

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
  }

  constructor(
    private renderer: Renderer2,
    private markerService: MarkerService
  ) {}

  enableSamplesMarkers(toEnable = true): void {
    if (toEnable)
      this.map.on('moveend', () => {
        let bounds = this.map.getBounds();
        this.markerService
          //                       min                       max
          .getSamplesInArea(bounds.getSouthWest(), bounds.getNorthEast())
          .subscribe((res) => {
            this.samplesMarkerLayer = this.markerService.createMarkerLayer(
              this.map,
              res
            );
            this.map.addLayer(this.samplesMarkerLayer);
          });
      });
    else
      this.map.off(
        'moveend' // name of the fun
      );

    // if (toEnable) {
    //   if (this.samplesMarkerLayer == undefined) {
    //     this.markerService.getSamples().subscribe((res) => {
    //       this.samplesMarkerLayer = this.markerService.createMarkerLayer(
    //         this.map,
    //         res
    //       );
    //       this.map.addLayer(this.samplesMarkerLayer);
    //     });
    //   } else this.map.addLayer(this.samplesMarkerLayer);
    // } else this.map.removeLayer(this.samplesMarkerLayer);
  }
}
