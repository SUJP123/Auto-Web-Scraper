import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
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
      private http: HttpClient
    ) {}

    onSubmit() {
      let loginData = this.loginForm.value;

      const httpOptions = {
        headers: new HttpHeaders({
          'Content-Type':  'application/json',
        })
      };

      this.http.post('http://localhost:5001/login', {
        "email": loginData.email,
        "password": loginData.password
      }, httpOptions).subscribe();

    }
}
