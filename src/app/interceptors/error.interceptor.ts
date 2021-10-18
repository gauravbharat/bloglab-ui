import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AccountService } from '../services/account.service';
import { ToastrService } from 'ngx-toastr';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private _toastr: ToastrService,
    private _accountService: AccountService
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error) => {
        if (error) {
          switch (error?.status) {
            case 400:
              this.handle400Error(error);
              break;

            case 401:
              this.handle401Error(error);
              break;

            case 500:
              this.handle500Error(error);
              break;

            default:
              this.handleUnexpectedError(error);
              break;
          }
        }

        return throwError(error);
      })
    );
  }

  handle400Error(error: any) {
    if (!!error?.error && Array.isArray(error?.error)) {
      let errorMessage = '';
      for (const key in error.error) {
        if (error?.error[key]) {
          const errorElement = error.error[key];
          errorMessage = `${errorMessage}${errorElement?.code} - ${errorElement?.description}\n`;
        }
      }

      this._toastr.error(errorMessage, error?.statusText);
      console.log({ 'error?.error': error?.error });
    } else if (
      !!error?.error?.errors?.Content &&
      typeof error?.error?.errors?.Content === 'object'
    ) {
      let errorObject = error?.error?.errors?.Content;
      let errorMessage = '';

      for (const key in errorObject) {
        const errorElement = errorObject[key];
        if (errorObject[key]) {
          errorMessage = `${errorMessage}${errorElement}\n`;
        }
      }

      this._toastr.error(errorMessage, error?.statusCode);
      console.log({ 'error?.error': error?.error });
    } else if (!!error?.error) {
      let errorMessage =
        typeof error?.error === 'string'
          ? error?.error
          : 'There was a validation error!';

      this._toastr.error(errorMessage, error?.statusCode);
      console.log({ 'error?.error': error?.error });
    } else {
      this._toastr.error(error?.statusText, error?.status);
      console.log({ error });
    }
  }

  handle401Error(error: any) {
    let errorMessage = 'Please login to your account.';
    this._accountService.logout();
    this._toastr.error(errorMessage, error?.statusText);
    console.log({ error });
  }

  handle500Error(error: any) {
    this._toastr.error(
      'Please contact the administrator. An error happened in the server.'
    );
    console.log({ error });
  }

  handleUnexpectedError(error: any) {
    this._toastr.error('Something unexpected happened.');
    console.log({ error });
  }
}
