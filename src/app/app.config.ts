import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { provideStorage, getStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCLwl1ZhUryFFYUopWRFcxGtBtmv3a0oco',
  authDomain: 'housing-location-d72f0.firebaseapp.com',
  projectId: 'housing-location-d72f0',
  storageBucket: 'housing-location-d72f0.firebasestorage.app',
  messagingSenderId: '735400116458',
  appId: '1:735400116458:web:655987fe746cd1962bd793',
  measurementId: 'G-8GMVZN5N1C',
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideStorage(() => getStorage()),
  ],
};
