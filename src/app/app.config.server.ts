import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/ssr';
import { appConfig } from './app.config';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // on server forneça fetch e habilite interceptors via DI
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
