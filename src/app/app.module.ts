import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { UserCoordinatesGetterService } from './services/user-coordinates-getter.service';

import { MarkerService } from './services/marker.service';
import { ClusteringService } from './services/clustering.service';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { PopupService } from './services/popup.service';
import { CommunicationService } from './services/communication.service';

@NgModule({
  declarations: [AppComponent, MapComponent, CheckboxComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    UserCoordinatesGetterService,
    MarkerService,
    PopupService,
    ClusteringService,
    CommunicationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
