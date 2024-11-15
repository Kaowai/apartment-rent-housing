import { Injectable } from '@angular/core';
import { HousingLocation } from './housinglocation';
import { Cities } from './cities';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FormRegister } from '../form-register';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HousingService {
  private dataUpdated = new BehaviorSubject<boolean>(false);
  dataUpdated$ = this.dataUpdated.asObservable();

  baseURL = 'http://localhost:3000';
  urlLocation = 'http://localhost:3000/locations';
  urlCity = 'http://localhost:3000/cities';
  urlRegister = 'http://localhost:3000/formRegister';

  constructor(private http: HttpClient) {}

  notifyDataUpdate(status: boolean) {
    this.dataUpdated.next(status);
  }

  getAllHousingLocations(): Observable<HousingLocation[]> {
    return this.http.get<HousingLocation[]>(this.urlLocation);
  }
  getHousingLocationId(id: string): Observable<HousingLocation | undefined> {
    return this.http.get<HousingLocation>(`${this.urlLocation}/${id}`);
  }

  getAllCities(): Observable<Cities[]> {
    return this.http.get<Cities[]>(this.urlCity);
  }

  getAllRegisterForm(): Observable<FormRegister[]> {
    return this.http.get<FormRegister[]>(`${this.baseURL}/formRegister`);
  }

  getAllFormRegisterById(id: string): Observable<FormRegister[]> {
    return this.http.get<FormRegister[]>(`${this.baseURL}/formRegister/${id}`);
  }

  updateLocation(
    id: string,
    updatedLocation: HousingLocation
  ): Observable<any> {
    return this.http.put(`${this.urlLocation}/${id}`, updatedLocation);
  }

  updateLocationPartical(id: string, particalData: any): Observable<any> {
    return this.http.patch(`${this.urlLocation}/${id}`, particalData);
  }

  addLocation(newLocation: HousingLocation): Observable<any> {
    return this.http.post(this.urlLocation, newLocation);
  }
  addRegisterForm(newFormRegister: FormRegister): Observable<any> {
    return this.http.post(this.urlRegister, newFormRegister);
  }

  deleteLocation(id: string): Observable<any> {
    return this.http.delete(`${this.urlLocation}/${id}`);
  }

  deleteFormRegister(id: string): Observable<any> {
    return this.http.delete(`${this.urlRegister}/${id}`);
  }
}
