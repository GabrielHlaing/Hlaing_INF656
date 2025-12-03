import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class SlotService {
  private api = 'http://localhost:5000/api/spin';

  constructor(private http: HttpClient) {}

  spin(bet: number) {
    return this.http.post<any>(`${this.api}`, { bet });
  }
}
