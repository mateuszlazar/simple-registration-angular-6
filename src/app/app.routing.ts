import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './core/auth';
import { ProfileComponent } from './components/profile';
import { LoginComponent } from './components/login';
import { RegisterComponent } from './components/register';

const appRoutes: Routes = [
    { path: '', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: '**', redirectTo: '' },
];

export const routing = RouterModule.forRoot(appRoutes);