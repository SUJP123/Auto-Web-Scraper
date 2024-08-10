import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.css'
})
export class DemoComponent {
  navigateToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  constructor( private router: Router) {}
}
