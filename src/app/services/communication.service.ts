import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LatLng } from 'leaflet';
import { environment } from 'src/environments/environment';
import { Sample } from '../intefaces/sample.interface';

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  constructor(private http: HttpClient) {}

  async getSamplesInArea(
    southWest: LatLng,
    northEast: LatLng
  ): Promise<[Sample]> {
    let header = new HttpHeaders().set('Access-Control-Allow-Origin', '*');

    let params = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat);

    return await this.http
      .get<[Sample]>(environment.apiUrl + 'locations/samplesInArea', {
        headers: header,
        params: params,
      })
      .toPromise();
  }

  async getKmeansInArea(southWest: LatLng, northEast: LatLng): Promise<[any]> {
    let header = new HttpHeaders().set('Access-Control-Allow-Origin', '*');

    let params = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat)
      .set('k', 4);

    return await this.http
      .get<[any]>(environment.apiUrl + 'locations/kmeansInArea', {
        headers: header,
        params: params,
      })
      .toPromise();
  }
}
