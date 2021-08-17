import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit {
  public password: string;
  public formLogin: FormGroup;
  public errorMessage = [];
  public redirectURL;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formLogin = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    let params = this.route.snapshot.queryParams;
    if (params['redirectURL']) {
      this.redirectURL = params['redirectURL'];
    }
  }

  goToSignUp() {
    this.router.navigate(['signup']);
  }

  signIn() {
    this.errorMessage = [];

    if (this.formLogin.valid) {
      this.auth.signIn(this.formLogin.controls['username'].value, this.formLogin.controls['password'].value).subscribe(
        (data) => {
          if (this.redirectURL) {
            this.router.navigateByUrl(this.redirectURL).catch(() => this.router.navigate(['map']));
          } else {
            this.router.navigate(['map']);
          }
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
