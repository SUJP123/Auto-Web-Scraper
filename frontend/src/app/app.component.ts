import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent, HttpClientModule],
  styleUrls: [`app.component.css`],
  template: `
  <main>
    <header class="brand-name">
    </header>
    <section class="content">
      <app-home></app-home>
    </section>
  </main>
`,
})
export class AppComponent {
  title = 'auto-scraper';
}
