import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http'; // 1. Importe aqui

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    // on server forneça fetch e habilite interceptors via DI
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
