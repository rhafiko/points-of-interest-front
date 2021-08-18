import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { JwtModule, JWT_OPTIONS } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

import { MapModule } from './map/map.module';
import { SignInComponent } from './auth/sign-in/sign-in.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { DialogModule } from 'primeng/dialog';

import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

import { NgxSpinnerModule } from 'ngx-spinner';

export function jwtOptionsFactory(storage) {
  return {
    allowedDomains: environment.allowedDomains,
    tokenGetter: () => {
      return localStorage.getItem('point_jwt_token');
    },
  };
}

@NgModule({
  declarations: [AppComponent, SignInComponent, SignUpComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CardModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    PasswordModule,
    MapModule,
    LeafletModule,
    NgxSpinnerModule,

    JwtModule.forRoot({
      jwtOptionsProvider: {
        provide: JWT_OPTIONS,
        useFactory: jwtOptionsFactory,
      },
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [MessageService, ConfirmationService],
  bootstrap: [AppComponent],
})
export class AppModule {}
