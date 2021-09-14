import { UserCoordinatesGetterService } from './services/user-coordinates-getter/user-coordinates-getter.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  declarations: [AppComponent, MapComponent, CheckboxComponent],
  imports: [BrowserModule],
  providers: [UserCoordinatesGetterService],
  bootstrap: [AppComponent],
})
export class AppModule {}
