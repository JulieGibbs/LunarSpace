import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: any = {
    firstName: null,
    lastName: null,
    email: null,
    entityID: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit(): void {
    const { firstName, lastName, email, entityID } = this.form;
    const storedObjectString = window.localStorage.getItem('account-info');
    const storedObject = storedObjectString
      ? JSON.parse(storedObjectString)
      : null;

    if (!storedObject) return;

    this.authService
      .register(
        firstName,
        lastName,
        email,
        entityID,
        storedObject.address,
        storedObject.hash
      )
      .subscribe({
        next: (data) => {
          console.log('success', data);
          this.router.navigate(['/mint']);
        },
        error: (err) => {
          console.log('fail', err);
        },
      });
  }
}
