import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ReactiveFormsModule],
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
    private http: HttpClient
  ) {}



  onSubmit(): void {
    let registerData = this.registerForm.value

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
      })
    };

    if (registerData.password === registerData.confirmPassword) {
      this.http.post('http://localhost:5001/signup', {
        "email" : registerData.email,
        "password": registerData.password
      }, httpOptions).subscribe() 
      alert("Succesfully Registered")
      }
    else {
      alert("Passwords do not match")
    }
  }
}
