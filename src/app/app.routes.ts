import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ZodiacDetailComponent } from './zodiac-detail/zodiac-detail.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'zodiac-detail/:zodiac', component: ZodiacDetailComponent },
  { path: '**', redirectTo: '' }
];
