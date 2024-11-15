import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterModule,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  routerActive = 'dashboard';

  constructor(private route: Router) {
    route.events.forEach((event) => {
      if (event instanceof NavigationEnd) {
        const url = event.url;

        if (url.includes('dashboard')) {
          this.routerActive = 'dashboard';
        } else if (url.includes('apartment-management')) {
          this.routerActive = 'apartment-management';
        } else if (url.includes('user')) {
          this.routerActive = 'user';
        } else if (url.includes('account')) {
          this.routerActive = 'account';
        }
      }
    });
  }

  ngOnInit(): void {}
}
