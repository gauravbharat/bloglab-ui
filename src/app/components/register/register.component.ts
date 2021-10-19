import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { ToastrService } from 'ngx-toastr';
import { ApplicationUserCreate } from 'src/app/models/account/application-user-create.model';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(
    private _accountService: AccountService,
    private _router: Router,
    private _fb: FormBuilder,
    private _toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.registerForm = this._fb.group(
      {
        fullname: [null, [Validators.minLength(10), Validators.maxLength(30)]],
        username: [
          null,
          [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(20),
          ],
        ],
        email: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
            ),
            Validators.maxLength(30),
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
        confirmPassword: [null, [Validators.required]],
      },
      { validators: this.matchValue }
    );
  }

  formHasError(error: string): boolean {
    return !!this.registerForm.hasError(error);
  }

  isTouched(field: string): boolean {
    return this.registerForm?.get(field)?.touched ?? false;
  }

  hasErrors(field: string): any {
    return this.registerForm?.get(field)?.errors;
  }

  hasError(field: string, error: string): boolean {
    return !!this.registerForm?.get(field)?.hasError(error);
  }

  public matchValue: ValidatorFn = (
    fg: AbstractControl
  ): ValidationErrors | null => {
    const passwordCtrl = fg.get('password');
    const confirmPasswordCtrl = fg.get('confirmPassword');

    if (!passwordCtrl || !confirmPasswordCtrl) return null;

    return passwordCtrl?.value === confirmPasswordCtrl?.value
      ? null
      : { nomatch: true };
  };

  onSubmit(): void {
    let applicationUserCreate: ApplicationUserCreate =
      new ApplicationUserCreate(
        this.registerForm?.get('username')?.value,
        this.registerForm?.get('password')?.value,
        this.registerForm?.get('email')?.value,
        this.registerForm?.get('fullname')?.value
      );

    this._accountService.register(applicationUserCreate).subscribe(
      () => {
        this._router.navigate(['/dashboard']);
        this._toastr.success(
          'You are now logged-in',
          'Registration successful!'
        );
      },
      (error) => console.log('register API', { error })
    );
  }
}
