import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Auth } from './auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private api = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient, private auth: Auth) {}

  // GET /profile
  getProfile() {
    return this.http.get<any>(`${this.api}/profile`);
  }

  // PUT /change-password
  changePassword(oldPassword: string, newPassword: string) {
    return this.http.put<any>(`${this.api}/change-password`, {
      oldPassword,
      newPassword,
    });
  }

  // GET /transactions
  getTransactions() {
    return this.http.get<any[]>(`${this.api}/transactions`);
  }

  // DELETE /transactions/:id
  deleteTransaction(id: string) {
    return this.http.delete(`${this.api}/transaction/${id}`);
  }
}
