import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn = false;

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      this.isLoggedIn = true;
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem('token', 'dummy-token');
      }
      return true;
    }
    return false;
  }

  logout(): void {
    this.isLoggedIn = false;
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.removeItem('token');
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
      // SSR path: use in-memory boolean fallback
      return this.isLoggedIn;
    }
    return !!localStorage.getItem('token');
  }
}