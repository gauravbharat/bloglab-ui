import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Photo } from '../models/photo/photo.model';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  constructor(private _http: HttpClient) {}

  create(model: FormData): Observable<Photo> {
    return this._http.post<Photo>(`${environment.webApi}/Photo`, model);
  }

  getByApplicationUserId(): Observable<Photo[]> {
    return this._http.get<Photo[]>(`${environment.webApi}/Photo`);
  }

  get(photoId: number): Observable<Photo> {
    return this._http.get<Photo>(`${environment.webApi}/Photo/${photoId}`);
  }

  delete(photoId: number): Observable<number> {
    return this._http.delete<number>(`${environment.webApi}/Photo`);
  }
}
