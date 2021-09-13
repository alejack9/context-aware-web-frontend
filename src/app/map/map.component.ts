import { Component, AfterViewInit, Input } from '@angular/core';
import { LatLng, map, Map, tileLayer } from 'leaflet';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
})
export class MapComponent implements AfterViewInit {
  @Input('starting-coordinates') startingCoordinates: LatLng = new LatLng(0, 0);
  private map: Map;

  private initMap(): void {
    this.map = map('map', {
      center: this.startingCoordinates,
      zoom: 9,
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

  constructor() {}

  ngAfterViewInit(): void {
    this.initMap();
  }
}
