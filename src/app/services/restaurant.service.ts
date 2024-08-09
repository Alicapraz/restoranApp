import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Geolocation} from '@capacitor/geolocation'

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private apiUrl = 'https://smarty.kerzz.com:4004/api/mock';
  private apiKey = 'bW9jay04ODc3NTU2NjExMjEyNGZmZmZmZmJ2';
  private headers = new HttpHeaders({
    'apiKey': this.apiKey
  });

  constructor(private http: HttpClient) {}


  // getRestaurants(skip: number, limit: number, latitude: number, longitude: number): Observable<any> {
  //   const body = { "skip":skip, "limit":limit, "latitude":latitude, "longitude":longitude };
  //   console.log('getRestaurants - Sending payload:', body);
  //   return this.http.post<any>(`${this.apiUrl}/getFeed`, body, { headers: this.headers })
  //   .pipe(
  //     tap(response => console.log('getRestaurants - Response:', response))
  //   );;
  // }

  getRestaurants(latitude: number, longitude: number, skip: number, limit: number): Observable<any> {
    const headers = new HttpHeaders({
      'apiKey': this.apiKey
    });
  
    return this.http.post<any>(
      `${this.apiUrl}/getFeed`,  
      {
        skip: skip,
        limit: limit,
        latitude: latitude,
        longitude: longitude
      },
      { headers: headers }
    );
  }
  

  getRestaurantDetails(id: string): Observable<any> {
    const body = {"id": id };
    console.log('getRestaurantDetails - Sending payload:', body);
    return this.http.post<any>(`${this.apiUrl}/storeInfo`, body, { headers: this.headers })
    .pipe(
      tap(response => console.log('getRestaurantDetails - Response:', response))
    );;
  }

  getCurrentLocation(): Promise<{latitude: number, longitude: number}> {
    return Geolocation.getCurrentPosition().then((position) => {
      return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      };
    });
  }

  // getRestaurantById(id: string): Observable<any> {
  //   const body = { id: id };
  //   return this.http.post<any>(`${this.apiUrl}/getFeed`, body, { headers: this.headers });
  // }
  
}
