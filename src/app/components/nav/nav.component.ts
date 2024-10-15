import { Component, computed, inject, signal } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from '@angular/router';
import { UserSelectComponent } from '../user-select/user-select.component';
import { GameListsStore } from '../../store/game-lists.store';
import { GamesStore } from '../../store/games.store';
import { UserStore } from '../../store/user.store';
import { User } from '../../model/users.interfaces';
import { UserService } from '../../services/users.service';

interface NavLink {
  displayName: string;
  path: string[];
}

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [MatListModule, RouterLink, UserSelectComponent],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.scss',
})
export class NavComponent {
  gameListsStore = inject(GameListsStore);
  userService = inject(UserService);
  userStore = inject(UserStore);
  links = computed<NavLink[]>(() => {
    return [
      {
        displayName: 'My Lists',
        path: ['my-lists', this.userStore.user()?.id || ''],
      },
      {
        displayName: 'Friends',
        path: ['friends', this.userStore.user()?.id || ''],
      },
      {
        displayName: 'Login',
        path: ['login'],
      },
    ];
  });

  setUser(user: User): void {
    this.userService.setUser(user);
  }
}
