import { CommunicationService } from './services/communication.service';
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
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('.35s ease-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('.5s ease-in', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit, AfterViewInit {
  showSamplesDone = true;
  showKMeanDone = true;
  showHeatmapDone = true;
  setDummyDone = true;
  setPerturbatedDone = true;
  constructor(
    private cdr: ChangeDetectorRef,
    private userCoordinatesGetter: UserCoordinatesGetterService,
    private communicationService: CommunicationService
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

  async contactService() {
    this.startingService = true;
    await this.communicationService.sendPing();
    this.startingService = false;
  }

  async ngOnInit() {
    this.contactService();
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
  startingService: boolean;

  changeMapHeight(windowHeight: number) {
    this.mapHeight =
      windowHeight - this.topSectionElement.nativeElement.offsetHeight;
  }

  async showLayer(event: any) {
    switch (event.target.id) {
      case 'show_samples':
        this.showSamplesDone = false;
        await this.mapComponent.enableSamplesMarkers(event.target.checked);
        this.showSamplesDone = true;
        break;
      case 'show_kmean':
        this.showKMeanDone = false;
        await this.mapComponent.enableKmeansClustering(event.target.checked);
        this.showKMeanDone = true;
        break;
      case 'show_heatmap':
        this.showHeatmapDone = false;
        await this.mapComponent.enableHeatMap(event.target.checked);
        this.showHeatmapDone = true;
        break;
    }
  }

  async setDummy(e: any) {
    this.setDummyDone = false;
    await this.mapComponent.setDummy(e.target.checked);
    this.setDummyDone = true;
  }
  async setGpsPerturbated(e: any) {
    this.setPerturbatedDone = false;
    await this.mapComponent.setGpsPerturbated(e.target.checked);
    this.setPerturbatedDone = true;
  }
}
