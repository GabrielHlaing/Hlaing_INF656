import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user';
import { Auth } from '../../services/auth';
import { Subscription } from 'rxjs';
import { Recharge } from '../../services/recharge';

@Component({
  standalone: true,
  selector: 'app-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class Profile implements OnInit, OnDestroy {
  user: any = null;
  loadingUser = true;

  oldPassword = '';
  newPassword = '';
  passMsg = '';
  passError = '';

  rechargeAmount = 0;
  rechargeMsg = '';
  rechargeError = '';

  transactions: any[] = [];
  loadingTrx = true;

  private sub!: Subscription;

  constructor(
    private userService: UserService,
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private rechargeService: Recharge
  ) {}

  ngOnInit() {
    // 1) If auth already has a user (BehaviorSubject.value) load immediately
    const current = this.auth.user;
    if (current && current.token) {
      // sync load
      this.loadProfile();
      this.loadTransactions();
    }

    // 2) Subscribe for future auth changes. Force view update when data arrives.
    this.sub = this.auth.user$.subscribe((user) => {
      if (user && user.token) {
        // If we haven't loaded yet, load now. If already loaded, you can refresh if desired.
        this.loadProfile();
        this.loadTransactions();
      } else {
        // if user logged out, clear UI
        this.user = null;
        this.transactions = [];
        this.loadingUser = false;
        this.loadingTrx = false;
        // force view update
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  loadProfile() {
    this.loadingUser = true;
    this.userService.getProfile().subscribe({
      next: (res) => {
        // update model then force change detection to ensure UI updates immediately
        this.user = res;
        this.loadingUser = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.log('PROFILE ERROR:', err);
        this.loadingUser = false;
        this.cdr.detectChanges();
      },
    });
  }

  loadTransactions() {
    this.loadingTrx = true;
    this.userService.getTransactions().subscribe({
      next: (res) => {
        this.transactions = res;
        this.loadingTrx = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loadingTrx = false;
        this.cdr.detectChanges();
      },
    });
  }

  changePassword() {
    this.passMsg = '';
    this.passError = '';

    this.userService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: (res) => {
        this.passMsg = res.message;
        this.oldPassword = '';
        this.newPassword = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.passError = err?.error?.message || 'Could not update password.';
        this.cdr.detectChanges();
      },
    });
  }

  deleteTransaction(id: string) {
    const ok = confirm('Delete this transaction?');
    if (!ok) return;

    this.userService.deleteTransaction(id).subscribe({
      next: () => {
        this.transactions = this.transactions.filter((t) => t._id !== id);
        // refresh list after delete
        this.cdr.detectChanges();
        this.loadTransactions();
      },
      error: () => {
        alert('Delete failed.');
      },
    });
  }

  recharge() {
    this.rechargeMsg = '';
    this.rechargeError = '';

    console.log('recharge: ', this.rechargeAmount);

    if (this.rechargeAmount <= 0) {
      this.rechargeError = 'Enter a valid amount.';
      return;
    }

    this.rechargeService.recharge(this.rechargeAmount).subscribe({
      next: (res) => {
        this.rechargeMsg = 'Balance successfully recharged!';
        this.user.balance += this.rechargeAmount; // update UI
        this.cdr.detectChanges();
        this.loadProfile();
        this.rechargeAmount = 0;
      },
      error: (err) => {
        this.rechargeError = err.error?.message || 'Recharge failed.';
      },
    });
  }

  setTrxClass(t: any) {
    if (!t) return '';

    // Normalize values
    const type = t.type?.toLowerCase();
    const result = t.result?.toLowerCase();

    // Recharge → Blue
    if (type === 'recharge') return 'trx-blue';

    // Win → Green (any win / jackpot / big win)
    if (result && (result.includes('win') || result.includes('jackpot'))) {
      return 'trx-green';
    }

    // Lose → Red
    if (result && result.includes('lose')) {
      return 'trx-red';
    }

    return '';
  }
}
