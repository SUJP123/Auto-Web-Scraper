import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './services/authGuard/auth-guard.service';
import { DemoComponent } from './demo/demo.component';



export const routes: Routes = [

    { path: 'home', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'dashboard', component: DashboardComponent, 
        canActivate: [AuthGuard]
    },
    {
        path: 'demo', component: DemoComponent,
        canActivate: [AuthGuard]
    }
    ,
    { path: '', redirectTo: '/home', pathMatch: 'full' },

    
];
