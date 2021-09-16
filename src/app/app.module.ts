import { UserCoordinatesGetterService } from './services/user-coordinates-getter.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  declarations: [AppComponent, MapComponent, CheckboxComponent],
  imports: [BrowserModule, HttpClientModule],
  providers: [UserCoordinatesGetterService],
  bootstrap: [AppComponent],
})
export class AppModule {}
