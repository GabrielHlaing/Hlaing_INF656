import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class Recharge {
  private api = 'http://localhost:5000/api/user';

  constructor(private http: HttpClient) {}

  recharge(amount: number) {
    return this.http.post<any>(`${this.api}/recharge`, { amount: amount });
  }
}
