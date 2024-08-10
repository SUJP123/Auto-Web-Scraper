import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {

    loginForm = this.formBuilder.group({
      email: '',
      password: ''
    });


    constructor(
      private formBuilder: FormBuilder,
      private http: HttpClient,
      private router: Router
    ) {}

    onSubmit() {
      let loginData = this.loginForm.value;
      console.log(loginData);
      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };

      this.http.post('http://localhost:5001/login', {
        "email": loginData.email,
        "password": loginData.password
      }, httpOptions).subscribe(
        (response: any) => {
          alert("Successfully Logged In");
          localStorage.setItem('token', response.token);
          localStorage.setItem('id', response.user);
          console.log(localStorage)
          this.navigateDashboard();
        },
        (error) => {
          alert("Login Failed");
          console.error(error);
        }
      );

    }

    navigateDashboard() {
      this.router.navigate(['/dashboard']);
    }
}
