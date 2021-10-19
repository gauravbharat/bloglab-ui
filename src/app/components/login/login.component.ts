import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationUserLogin } from 'src/app/models/account/application-user-login.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private _accountService: AccountService,
    private _router: Router,
    private _fb: FormBuilder
  ) {
    if (_accountService.isLoggedIn) _router.navigate(['/dashboard']);
  }

  ngOnInit(): void {
    this.loginForm = this._fb.group({
      username: [
        null,
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(20),
        ],
      ],
      password: [
        null,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(50),
        ],
      ],
    });
  }

  isTouched(field: string): boolean {
    return this.loginForm?.get(field)?.touched ?? false;
  }

  hasErrors(field: string): any {
    return this.loginForm?.get(field)?.errors;
  }

  hasError(field: string, error: string): boolean {
    return !!this.loginForm?.get(field)?.hasError(error);
  }

  onSubmit(): void {
    let applicationUserLogin: ApplicationUserLogin = new ApplicationUserLogin(
      this.loginForm?.get('username')?.value,
      this.loginForm?.get('password')?.value
    );

    this._accountService.login(applicationUserLogin).subscribe(
      () => {
        this._router.navigate(['/dashboard']);
      },
      (error) => console.log('login API', { error })
    );
  }
}
