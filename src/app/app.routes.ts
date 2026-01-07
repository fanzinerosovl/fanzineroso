import { Routes } from '@angular/router';
import { PdfReaderComponent } from './pdf-reader';
import { GalleryComponent } from './gallery';
import { SearchComponent } from './search';
import { LandingComponent } from './landing';
import { MainComponent } from './main';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'home', component: MainComponent },
  { path: 'fanzines', component: GalleryComponent },
  { path: 'buscar', component: SearchComponent },
  { path: 'lector/:volume', component: PdfReaderComponent }
];
