import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../model/users.interfaces';
import { MatSelectModule } from '@angular/material/select';
import { GameListsStore } from '../../store/game-lists.store';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AsyncPipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { UsersService } from '../../services/users.service';
MatSelectModule;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatSelectModule, AsyncPipe, JsonPipe],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  gameListsStore = inject(GameListsStore);
  usersService = inject(UsersService);
  router = inject(Router);
  users$ = this.usersService.getUsers();

  setUser(user: any) {
    this.gameListsStore.setUser(user);
    this.router.navigate(['/game-lists']);
  }
  // loginForm = {
  //   username: '',
  //   password: '',
  //   firstname: '',
  //   lastName: '',
  //   newUsername: '',
  //   newPassword: '',
  // };
  // errorMessage = signal('');
  // users = signal<User[]>([]);
  // usersJson: string | null = null;
  // router = inject(Router);
  // ngOnInit(): void {
  //   if (typeof window !== 'undefined') {
  //     this.usersJson = localStorage.getItem('users');
  //   }
  //   if (this.usersJson) {
  //     this.users.set(JSON.parse(this.usersJson));
  //   }
  // }
  // setErrorMessage(message: string): void {
  //   this.errorMessage.set(message);
  // }
  // navigateToLists(user: User): void {
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('activeUser', JSON.stringify(user));
  //     this.router.navigate(['/game-lists']);
  //   }
  // }
  // login(): void {
  //   const user = this.users().find(
  //     (user) => user.username === this.loginForm.username
  //   );
  //   if (user && user.password === this.loginForm.password) {
  //     this.navigateToLists(user);
  //   }
  // }
  // createNewUser(): void {
  //   if (
  //     this.users().find((user) => user.username === this.loginForm.newUsername)
  //   ) {
  //     this.setErrorMessage(
  //       'Username already exists. Please try logging in or selecting a new username'
  //     );
  //     return;
  //   }
  //   const user: User = {
  //     firstName: this.loginForm.firstname,
  //     lastName: this.loginForm.lastName,
  //     username: this.loginForm.newUsername,
  //     password: this.loginForm.newPassword,
  //     id: Math.random(),
  //     games: [],
  //     gameLists: [],
  //     friendIds: [],
  //   };
  //   this.users.set([...this.users(), user]);
  //   if (typeof window !== 'undefined') {
  //     localStorage.setItem('users', JSON.stringify(this.users()));
  //     localStorage.setItem('activeUser', JSON.stringify(user));
  //     this.navigateToLists(user);
  //   }
  // }
}
