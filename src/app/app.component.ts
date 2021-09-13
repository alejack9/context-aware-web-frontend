import { LatLng } from 'leaflet';
import {
  OnInit,
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  userCoordinates: LatLng;
  mapHeight: number;
  @ViewChild('checkboxContainer') checkBoxContainerElement: ElementRef;

  @HostListener('window:resize', ['$event']) sizeChange(event: any) {
    this.changeMapHeight(event.target.innerHeight);
  }

  ngOnInit(): void {
    const defaultCoordinates = new LatLng(43.090911, 13.428028);

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

  ngAfterViewInit(): void {
    this.changeMapHeight(window.innerHeight);
  }

  changeMapHeight(windowHeight: number) {
    this.mapHeight =
      windowHeight - this.checkBoxContainerElement.nativeElement.offsetHeight;
  }
}
