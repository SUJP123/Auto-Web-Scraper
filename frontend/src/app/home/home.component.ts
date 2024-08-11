import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ RouterOutlet, RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule, RouterOutlet, RouterModule],
  styleUrl: './home.component.css',
  templateUrl: `./home.component.html`,
})

export class HomeComponent {

  registerForm = this.formBuilder.group({
    email: '',
    password: '',
    confirmPassword: ''
  });


  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  onSubmit(): void {

    let registerData = this.registerForm.value

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    if (registerData.password != null && registerData.password === registerData.confirmPassword) {
      if (registerData.password.length < 6 ) {
        return alert("Password must be a minimum length of 6.")
      } else {
      this.http.post('https://auto-scraper-922505351a64.herokuapp.com/signup', {
        "email" : registerData.email,
        "password": registerData.password
      }, httpOptions).subscribe(
        (response) => {
          // Handle the successful response
          alert("Succesfully Registered");
          this.navigateToLogin();
        },
        (error) => {
          alert("Email already in use. Try Loggin in.");
        });
    } 
  }

    else {
      alert("Passwords Do Not Match.")
    }
  }
}
