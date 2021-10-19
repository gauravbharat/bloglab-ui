import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { ApplicationUserCreate } from '../models/account/application-user-create.model';
import { ApplicationUserLogin } from '../models/account/application-user-login.model';
import { ApplicationUser } from '../models/account/application-user.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly _currentUserKey = 'blogLab-currentUser';
  private currentUserSubject$!: BehaviorSubject<ApplicationUser | null>;
  // new BehaviorSubject<ApplicationUser>({})

  constructor(private _http: HttpClient) {
    const currentUserInfo = localStorage.getItem(this._currentUserKey);

    this.currentUserSubject$ = new BehaviorSubject<any>(
      currentUserInfo ? JSON.parse(currentUserInfo) : null
    );
  }

  get currentUserValue(): ApplicationUser | null {
    return this.currentUserSubject$.value;
  }

  get isLoggedIn(): boolean {
    // this.currentUserValue !== null && this.currentUserValue?.token !== null
    return !!this.currentUserValue && !!this.currentUserValue?.token;
  }

  private _setCurrentUser(user: ApplicationUser | null): void {
    user
      ? localStorage.setItem(this._currentUserKey, JSON.stringify(user))
      : localStorage.removeItem(this._currentUserKey);

    this.currentUserSubject$.next(user);
  }

  login(model: ApplicationUserLogin): Observable<ApplicationUser> {
    return this._http
      .post<ApplicationUser>(`${environment.webApi}/Account/login`, model)
      .pipe(tap((user: ApplicationUser) => this._setCurrentUser(user)));
  }

  register(model: ApplicationUserCreate): Observable<ApplicationUser> {
    return this._http
      .post<ApplicationUser>(`${environment.webApi}/Account/register`, model)
      .pipe(tap((user: ApplicationUser) => this._setCurrentUser(user)));
  }

  logout(): void {
    this._setCurrentUser(null);
  }
}
