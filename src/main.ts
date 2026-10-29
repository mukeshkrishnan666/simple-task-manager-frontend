import 'zone.js'; // <-- This explicitly loads the required Zone.js polyfill to fix NG0908
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));