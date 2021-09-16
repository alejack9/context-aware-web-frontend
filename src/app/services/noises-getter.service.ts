import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LatLng } from 'leaflet';

@Injectable({
  providedIn: 'root',
})
export class NoisesGetterService {
  constructor(private httpClient: HttpClient) {}

  async getAllNoises(southWest: LatLng, northEast: LatLng): Promise<Object> {
    let httpHeaders = new HttpHeaders();
    httpHeaders = httpHeaders.append('Access-Control-Allow-Origin', '*');

    const httpParams = new HttpParams()
      .set('swLong', southWest.lng)
      .set('swLat', southWest.lat)
      .set('neLong', northEast.lng)
      .set('neLat', northEast.lat);

    return await this.httpClient
      .get('http://localhost:3000/locations/samplesInArea', {
        headers: httpHeaders,
        params: httpParams,
      })
      .toPromise();
  }
}
