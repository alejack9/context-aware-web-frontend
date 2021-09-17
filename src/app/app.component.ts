import { UserCoordinatesGetterService } from './services/user-coordinates-getter.service';
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

  constructor(
    private cdr: ChangeDetectorRef,
    private userCoordinatesGetter: UserCoordinatesGetterService
  ) {}

  async ngOnInit(): Promise<void> {
    const defaultCoordinates = new LatLng(43.090911, 13.428028);
    try {
      this.userCoordinates =
        await this.userCoordinatesGetter.getUserCoordinates();
    } catch (reason: any) {
      if (reason) console.warn(reason);
      this.userCoordinates = defaultCoordinates;
    }
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

  showSample(event: any): void {
    this.mapComponent.enableSamplesMarkers(event.target.checked);
  }

  showKmeans(event: any): void {
    this.mapComponent.enableKmeansClustering(event.target.checked);
  }

  showHeatMap(event: any): void {
    this.mapComponent.enableHeatMap(event.target.checked);
  }
}
