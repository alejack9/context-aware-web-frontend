import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { CheckboxComponent } from './checkbox/checkbox.component';

@NgModule({
  declarations: [AppComponent, MapComponent, CheckboxComponent],
  imports: [BrowserModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
