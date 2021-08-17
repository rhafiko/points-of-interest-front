import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
})
export class AvatarComponent implements OnInit {
  public username;
  items: MenuItem[];

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.username = this.authService.userData;
    this.items = [
      {
        separator: true,
      },
      {
        label: 'Sign out',
        icon: 'pi pi-fw pi-power-off',
        command: () => this.signOut(),
      },
    ];
  }

  public signOut() {
    this.authService.signOut().then(() => {
      this.router.navigate(['signin'], { skipLocationChange: true });
    });
  }
}
