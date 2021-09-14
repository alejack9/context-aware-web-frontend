import { MapComponent } from './map/map.component';
import { LatLng } from 'leaflet';
import {
  OnInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  ChangeDetectorRef,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  userCoordinates: LatLng;
  mapHeight: number;
  @ViewChild('topSection') topSectionElement: ElementRef;
  @ViewChild('mapComponent') mapComponent: MapComponent;

  @HostListener('window:resize', ['$event']) sizeChange(event: any) {
    this.changeMapHeight(event.target.innerHeight);
  }

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    const defaultCoordinates = new LatLng(43.090911, 13.428028);
    this.userCoordinates = defaultCoordinates;
    if (!navigator.geolocation) {
      console.warn('Geolocalization not supported in current browser.');
      this.userCoordinates = defaultCoordinates;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        this.userCoordinates = new LatLng(
          pos.coords.latitude,
          pos.coords.longitude
        );
      },
      (_) => {
        this.userCoordinates = defaultCoordinates;
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      }
    );
  }

  ngAfterViewInit() {
    this.mapComponent.initMap();
    this.cdr.detectChanges();
    this.changeMapHeight(window.innerHeight);
    this.cdr.detectChanges();
  }

  changeMapHeight(windowHeight: number) {
    this.mapHeight =
      windowHeight - this.topSectionElement.nativeElement.offsetHeight;
  }
}
