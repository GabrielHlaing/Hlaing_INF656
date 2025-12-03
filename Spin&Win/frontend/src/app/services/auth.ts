// src/app/services/auth.ts
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

export interface User {
  _id?: string;
  username?: string;
  email?: string;
  balance?: number;
  token?: string;
}

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private api = 'http://localhost:5000/api/auth';
  private platformId = inject(PLATFORM_ID);
  private storageKey = 'spinwin_user';

  // start null and populate synchronously in constructor (only in browser)
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // ONLY read localStorage when we're in a browser environment
    if (isPlatformBrowser(this.platformId)) {
      try {
        const raw = localStorage.getItem(this.storageKey);
        if (raw) {
          const parsed: User = JSON.parse(raw);
          // populate BehaviorSubject early so interceptors/components can read token
          this.userSubject.next(parsed);
        }
      } catch (err) {
        console.warn('Auth: failed to read localStorage on startup', err);
      }
    }
  }

  /** Synchronous current user */
  get user(): User | null {
    return this.userSubject.value;
  }

  updateUser(user: any) {
    this.persistUser(user);
  }

  /** Token used by interceptor — reads from the BehaviorSubject synchronously (no race) */
  getToken(): string | null {
    return this.userSubject.value?.token ?? null;
  }

  /** Save user to localStorage (if available) and update BehaviorSubject */
  private persistUser(user: User | null): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        if (user) {
          localStorage.setItem(this.storageKey, JSON.stringify(user));
        } else {
          localStorage.removeItem(this.storageKey);
        }
      } catch (err) {
        console.warn('Auth: failed to write to localStorage', err);
      }
    }
    // Always update subject (keeps in-memory state correct)
    this.userSubject.next(user);
  }

  /** Register endpoint — stores returned user+token if provided */
  register(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/register`, payload).pipe(
      tap((res) => {
        if (res?.token && res?.user) {
          this.persistUser({ ...res.user, token: res.token });
        }
      })
    );
  }

  /** Login endpoint — stores returned user+token if provided */
  login(payload: any): Observable<any> {
    return this.http.post<any>(`${this.api}/login`, payload).pipe(
      tap((res) => {
        if (res?.token && res?.user) {
          localStorage.setItem('token', res.token);
          this.persistUser({ ...res.user, token: res.token });
        }
      })
    );
  }

  /** Clear auth (logout) */
  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
    this.persistUser(null);
  }

  /** Optional helper: update only the user (preserve token if provided) */
  updateUserPartial(partial: Partial<User>) {
    const current = this.userSubject.value ?? {};
    const updated = { ...current, ...partial } as User;
    this.persistUser(updated);
  }
}
