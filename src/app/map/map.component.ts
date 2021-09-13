import {
  Component,
  AfterViewInit,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';
import { map, Map, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  private map: Map;
  @ViewChild('map') mapElement: ElementRef;
  @Input('map-height') set mapHeight(value: number) {
    if (!this.mapElement) {
      console.log('undefined map element');
      return;
    }

    console.log('defined map element');

    this.renderer.setStyle(
      this.mapElement.nativeElement,
      'height',
      value + 'px'
    );
    console.log(this.mapElement.nativeElement);

    this.map.invalidateSize();
  }

  private initMap(): void {
    this.map = map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });

    const tiles = tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
