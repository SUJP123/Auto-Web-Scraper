import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http'
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, HomeComponent, LoginComponent, HttpClientModule],
  styleUrls: [`app.component.css`],
  //templateUrl: './app.component.html' ,
  template: `<router-outlet />`
})
export class AppComponent {
  title = 'auto-scraper';

  constructor(private router: Router) {}

  hasRoute(route: string) {
    return this.router.url.includes(route);
  }
}
