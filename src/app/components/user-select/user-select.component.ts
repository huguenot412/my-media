import { Component, inject, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { UsersService } from '../../services/users.service';
import { AsyncPipe } from '@angular/common';
import { User } from '../../model/users.interfaces';
import { GameListsStore } from '../../store/game-lists.store';
import { GamesStore } from '../../store/games.store';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [MatSelectModule, AsyncPipe],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.scss',
})
export class UserSelectComponent {
  usersService = inject(UsersService);
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  users$ = this.usersService.getUsers();
  userSet = output<void>();

  setUser(user: User) {
    this.gameListsStore.setUser(user);
    this.gamesStore.setGames(user.games);
    this.gameListsStore.setLists(user.gameLists);
    this.userSet.emit();
  }
}
