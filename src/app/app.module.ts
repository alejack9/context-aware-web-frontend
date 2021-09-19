import { HttpHeaderAdderService } from './services/http-header-adder.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { UserCoordinatesGetterService } from './services/user-coordinates-getter.service';

import { MarkerService } from './services/marker.service';
import { ClusteringService } from './services/clustering.service';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CommunicationService } from './services/communication.service';

@NgModule({
  declarations: [AppComponent, MapComponent, CheckboxComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [
    UserCoordinatesGetterService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderAdderService,
      multi: true,
    },
    MarkerService,
    ClusteringService,
    CommunicationService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
