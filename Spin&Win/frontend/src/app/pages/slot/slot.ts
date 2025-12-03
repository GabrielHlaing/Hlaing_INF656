import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SlotService } from '../../services/slot-service';
import { Auth } from '../../services/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LeaderboardService } from '../../services/leaderboard-service';

@Component({
  standalone: true,
  selector: 'app-slot',
  imports: [CommonModule],
  templateUrl: './slot.html',
  styleUrls: ['./slot.css'],
})
export class Slot {
  balance = signal(0);
  bet = signal(20);

  // available symbols (backend uses the same set)
  symbols = ['🍋', '🍒', '🍇', '⭐', '🍉'];

  // what we show on the reels (signal so template updates)
  displayReels = signal<string[]>(['❔', '❔', '❔', '❔', '❔']);

  // spinning state (signal)
  spinning = signal(false);
  private spinInterval: any | null = null;
  winMessage = signal<string | null>(null);

  constructor(
    private slotService: SlotService,
    private auth: Auth,
    private lbService: LeaderboardService
  ) {
    // Keep balance in sync with auth user. Use takeUntilDestroyed to auto-unsubscribe.
    this.auth.user$.pipe(takeUntilDestroyed()).subscribe((u) => {
      if (u?.balance !== undefined) {
        this.balance.set(u.balance);
      }
    });
  }

  private randomSymbol() {
    const s = this.symbols;
    return s[Math.floor(Math.random() * s.length)];
  }

  increaseBet() {
    this.bet.update((v) => v + 10);
  }

  decreaseBet() {
    this.bet.update((v) => Math.max(10, v - 10));
  }

  computeWinMessage(result: string, bet: number) {
    let msg = '';

    if (result === 'jackpot') {
      msg = `Super Lucky! 5 in a row — Jackpot!\nYou win $${bet * 10}!`;
    } else if (result === 'big win') {
      msg = `Amazing! 4 of a kind — Big Win!\nYou win $${bet * 5}!`;
    } else if (result === 'small win') {
      msg = `Nice! 3 of a kind — Small Win!\nYou win $${bet * 2}!`;
    } else {
      msg = 'Spin again.';
    }

    this.winMessage.set(msg);
  }

  spin() {
    this.winMessage.set(null);
    // call as function to read signal value
    if (this.spinning()) return;

    this.spinning.set(true);

    // start the fake spinning animation
    this.spinInterval = setInterval(() => {
      this.displayReels.set([
        this.randomSymbol(),
        this.randomSymbol(),
        this.randomSymbol(),
        this.randomSymbol(),
        this.randomSymbol(),
      ]);
    }, 80);

    // call backend (adjust URL in service if needed)
    this.slotService.spin(this.bet()).subscribe({
      next: (res) => {
        // keep spinning a bit for realism
        setTimeout(() => {
          if (this.spinInterval) {
            clearInterval(this.spinInterval);
            this.spinInterval = null;
          }

          // show backend result
          this.displayReels.set(res.reels ?? this.displayReels());
          this.balance.set(res.balance ?? this.balance());

          this.computeWinMessage(res.result, this.bet());

          // update auth stored user so other components see new balance
          const u = this.auth.user;
          if (u) {
            setTimeout(() => {
              this.auth.updateUser({ ...u, balance: res.balance ?? u.balance });
            });
          }

          // ALSO call to refresh leaderboard
          this.lbService.refresh();

          this.spinning.set(false);
        }, 800);
      },
      error: (err) => {
        if (this.spinInterval) {
          clearInterval(this.spinInterval);
          this.spinInterval = null;
        }
        this.spinning.set(false);
        console.error('Spin failed', err);
        alert('Spin failed. Check console for details.');
      },
    });
  }
}
