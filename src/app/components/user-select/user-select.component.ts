import { Component, inject, output } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { UserService } from '../../services/users.service';
import { AsyncPipe } from '@angular/common';
import { User } from '../../model/users.interfaces';
import { GameListsStore } from '../../store/game-lists.store';
import { GamesStore } from '../../store/games.store';
import { UserStore } from '../../store/user.store';

@Component({
  selector: 'app-user-select',
  standalone: true,
  imports: [MatSelectModule, AsyncPipe],
  templateUrl: './user-select.component.html',
  styleUrl: './user-select.component.scss',
})
export class UserSelectComponent {
  userService = inject(UserService);
  users$ = this.userService.getUsers();
  userSet = output<User>();

  setUser(user: User) {
    this.userSet.emit(user);
  }
}
