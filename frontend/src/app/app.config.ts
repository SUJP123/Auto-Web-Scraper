import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { JwtModule, JwtHelperService, JWT_OPTIONS } from '@auth0/angular-jwt';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient(), JwtModule, 
    JwtHelperService, { provide: JWT_OPTIONS, useValue: JWT_OPTIONS }, 
    {provide: LocationStrategy, useClass: HashLocationStrategy}]
};
