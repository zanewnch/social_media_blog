import { Routes } from '@angular/router';
import { Home } from './home/home';
import { ZodiacDetail } from './zodiac-detail/zodiac-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'zodiac/:zodiac', component: ZodiacDetail },
  { path: '**', redirectTo: '' }
];
