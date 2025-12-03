import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { LeaderboardService } from '../../services/leaderboard-service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.html',
  imports: [CommonModule],
  styleUrls: ['./leaderboard.css'],
})
export class Leaderboard implements OnInit, OnDestroy {
  leaderboard: any[] = [];
  loading = true;

  private refreshSub!: Subscription;
  private loadSub!: Subscription;

  constructor(private lb: LeaderboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // initial load
    this.loadLeaderboard();

    // subscribe to refresh events
    this.refreshSub = this.lb.refresh$.subscribe(() => {
      this.loadLeaderboard();
    });
  }

  loadLeaderboard() {
    this.loading = true;

    this.loadSub = this.lb.getLeaderboard().subscribe({
      next: (res) => {
        this.leaderboard = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  ngOnDestroy() {
    if (this.refreshSub) this.refreshSub.unsubscribe();
    if (this.loadSub) this.loadSub.unsubscribe();
  }
}
