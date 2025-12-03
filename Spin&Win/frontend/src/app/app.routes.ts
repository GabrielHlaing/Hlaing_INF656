import { Routes } from '@angular/router';
import Home from './pages/home/home';
import { Login } from './pages/login/login';
import { Profile } from './pages/profile/profile';
import { Slot } from './pages/slot/slot';
import { Register } from './pages/register/register';
import { Leaderboard } from './pages/leaderboard/leaderboard';
import { AuthGuard } from './auth-guard';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'profile', component: Profile, canActivate: [AuthGuard] },
  { path: 'slot', component: Slot, canActivate: [AuthGuard] },
  { path: 'leaderboard', component: Leaderboard, canActivate: [AuthGuard] },
];
