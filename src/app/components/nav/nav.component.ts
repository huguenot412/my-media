import { Component, inject, signal } from '@angular/core';
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
  path: string;
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
  links = signal<NavLink[]>([
    {
      displayName: 'Login',
      path: 'login',
    },
    {
      displayName: 'Games',
      path: 'game-lists',
    },
    {
      displayName: 'Books',
      path: 'book-lists',
    },
    {
      displayName: 'Film/TV',
      path: 'show-lists',
    },
    {
      displayName: 'Friends',
      path: 'friends',
    },
    {
      displayName: 'Recommendations',
      path: 'recommendations',
    },
  ]);

  setUser(user: User): void {
    this.userService.setUser(user);
  }
}
