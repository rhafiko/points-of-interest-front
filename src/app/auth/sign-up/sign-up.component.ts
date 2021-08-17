import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  public password: string;
  public formLogin: FormGroup;
  public errorMessage = [];
  public signUpDone = false;

  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) {
    this.formLogin = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  goToSignIn() {
    this.router.navigate(['signin']);
  }

  resetForm() {
    this.formLogin.controls['username'].reset();
    this.formLogin.controls['password'].reset();
  }

  signUp() {
    this.errorMessage = [];
    this.signUpDone = false;

    if (this.formLogin.valid) {
      this.auth.signUp(this.formLogin.controls['username'].value, this.formLogin.controls['password'].value).subscribe(
        () => {
          this.signUpDone = true;
          this.resetForm();
        },
        (error) => {
          let message = error.error.message;
          if (message === undefined) {
            message = 'General Error, verify if the server is up or cors is enabled';
          }
          Array.isArray(message) ? (this.errorMessage = message) : this.errorMessage.push(message);
        }
      );
    } else {
      this.showFormValidationErrors(this.formLogin);
    }
  }

  showFormValidationErrors(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((key) => {
      const controlErrors: ValidationErrors = formGroup.get(key).errors;
      if (controlErrors != null) {
        Object.keys(controlErrors).forEach((keyError) => {
          if (keyError === 'required') {
            this.errorMessage.push(`${key} is required.`);
          } else {
            this.errorMessage.push(`${key} has invalid value.`);
          }
        });
      }
    });
  }
}
