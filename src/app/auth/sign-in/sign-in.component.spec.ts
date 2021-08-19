import { async } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { SignInComponent } from './sign-in.component';

const routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl', 'navigate']);
const routeSpy = jasmine.createSpyObj('Route', ['snapshot']);
const authServiceSpy = jasmine.createSpyObj('AuthService', ['login']);

const validUser = {
  username: 'rhafiko',
  password: 'SuperPass123',
};

const blankUser = {
  username: '',
  password: '',
};

describe('SignIn', () => {
  let component: SignInComponent;

  beforeEach(async(() => {
    component = new SignInComponent(new FormBuilder(), authServiceSpy, routerSpy, routeSpy);
  }));

  function updateForm(username, passowrd) {
    component.formLogin.controls['username'].setValue(username);
    component.formLogin.controls['password'].setValue(passowrd);
  }

  it('Component successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('component initial state', () => {
    expect(component.errorMessage).toHaveSize(0);
    expect(component.formLogin).toBeDefined();
    expect(component.formLogin.invalid).toBeTruthy();
  });

  it('form value should update from when u change the input', () => {
    updateForm(validUser.username, validUser.password);
    expect(component.formLogin.value).toEqual(validUser);
  });

  it('Form invalid should be true when form is invalid', () => {
    updateForm(blankUser.username, blankUser.password);
    expect(component.formLogin.invalid).toBeTruthy();
  });
});
