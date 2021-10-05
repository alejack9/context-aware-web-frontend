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
  constructor(
    private cdr: ChangeDetectorRef,
    private userCoordinatesGetter: UserCoordinatesGetterService
  ) {}

  @ViewChild('topSection') topSectionElement: ElementRef;
  @ViewChild('mapComponent') mapComponent: MapComponent;

  @HostListener('window:resize', ['$event']) sizeChange(event: any) {
    this.changeMapHeight(event.target.innerHeight);
  }

  ngAfterViewInit() {
    this.changeMapHeight(window.innerHeight);
    this.cdr.detectChanges();
  }

  async ngOnInit() {
    const defaultCoordinates = new LatLng(43.090911, 13.428028);
    try {
      this.userCoordinates =
        await this.userCoordinatesGetter.getUserCoordinates();
    } catch (reason: any) {
      if (reason) console.warn(reason);
      this.userCoordinates = defaultCoordinates;
    }
  }

  userCoordinates: LatLng;
  mapHeight: number;
  k = 4;
  dummyUpdates = true;
  gpsPerturbated = true;

  changeMapHeight(windowHeight: number) {
    this.mapHeight =
      windowHeight - this.topSectionElement.nativeElement.offsetHeight;
  }

  showLayer(event: any) {
    switch (event.target.id) {
      case 'show_samples':
        this.mapComponent.enableSamplesMarkers(event.target.checked);
        break;
      case 'show_kmean':
        this.mapComponent.enableKmeansClustering(event.target.checked);
        break;
      case 'show_heatmap':
        this.mapComponent.enableHeatMap(event.target.checked);
        break;
    }
  }

  setDummy(e: any) {
    this.mapComponent.setDummy(e.target.checked);
  }
  setGpsPerturbated(e: any) {
    this.mapComponent.setGpsPerturbated(e.target.checked);
  }
}
