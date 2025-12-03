import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LeaderboardService {
  private api = 'http://localhost:5000/api/user';
  private refreshSubject = new Subject<void>();
  refresh$ = this.refreshSubject.asObservable();

  constructor(private http: HttpClient) {}

  getLeaderboard() {
    return this.http.get<any>(`${this.api}/leaderboard`);
  }

  refresh() {
    this.refreshSubject.next();
  }
}
