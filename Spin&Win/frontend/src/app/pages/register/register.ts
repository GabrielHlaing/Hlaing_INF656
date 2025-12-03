import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  form!: FormGroup;
  showPassword = false;

  errorMsg = '';
  successMsg = '';

  constructor(private fb: FormBuilder, private auth: Auth, private router: Router) {
    // <-- OK: this runs AFTER fb is injected, so no TS error
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => {
        console.error(err);
        alert(err?.error?.message || 'Registration failed');
      },
    });
  }
}
