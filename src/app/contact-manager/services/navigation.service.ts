import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  constructor(private router: Router) {}

  get events() {
    return this.router.events;
  }

  goToUser(userId: number): Promise<boolean> {
    return this.router.navigate(['/contactmanager', userId]);
  }
}
