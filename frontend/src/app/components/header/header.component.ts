import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserServicesService } from '../../services/user.services.service';
import { User } from '../../shared/models/User';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, NgIf],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  user!: User;
  constructor(private userService: UserServicesService) {
    userService.userObservable.subscribe((newUser) => {
      this.user = newUser;
    });
  }

  ngOnInit(): void {}

  logOut() {
    this.userService.logOut();
    confirm('Are You sure you want to logout ?');
  }

  get isAuth() {
    return this.user.token;
  }
}
