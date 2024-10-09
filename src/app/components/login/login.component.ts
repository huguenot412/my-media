import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User, UserConfig } from '../../model/users.interfaces';
import { MatSelectModule } from '@angular/material/select';
import { GameListsStore } from '../../store/game-lists.store';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
import { GamesStore } from '../../store/games.store';
import { UserSelectComponent } from '../user-select/user-select.component';
MatSelectModule;

interface LoginForm {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  newUsername: string;
  newPassword: string;
}

type LoginFormKey = keyof LoginForm;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    MatSelectModule,
    AsyncPipe,
    JsonPipe,
    UserSelectComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  usersService = inject(UsersService);
  router = inject(Router);

  loginForm = {
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    newUsername: '',
    newPassword: '',
  };
  errorMessage = signal('');
  users = signal<User[]>([]);

  setUser(user: User) {
    this.gameListsStore.setUser(user);
    this.gamesStore.setGames(user.games);
    this.gameListsStore.setLists(user.gameLists);
    this.navigateToLists();
  }

  setErrorMessage(message: string): void {
    this.errorMessage.set(message);
  }

  navigateToLists(): void {
    this.router.navigate(['/game-lists']);
  }

  resetLoginForm(): void {
    Object.keys(this.loginForm).forEach((key) => {
      const loginFormKey = key as LoginFormKey;
      this.loginForm[loginFormKey] = '';
    });
  }

  login(): void {
    const user = this.users().find(
      (user) => user.username === this.loginForm.username
    );

    if (user) {
      this.navigateToLists();
    }
  }

  createNewUser(): void {
    const { firstName, lastName, newUsername: username } = this.loginForm;
    const config: UserConfig = { firstName, lastName, username };
    this.usersService.createNewUser(config);
    this.resetLoginForm();
  }
}
