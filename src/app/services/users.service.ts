import { inject, Injectable } from '@angular/core';
import { Observable, pipe } from 'rxjs';
import { tapResponse } from '@ngrx/operators';
import {
  Firestore,
  CollectionReference,
  collection,
  collectionData,
  doc,
  updateDoc,
  addDoc,
} from '@angular/fire/firestore';
import { User, UserConfig } from '../model/users.interfaces';
import { UserStore } from '../store/user.store';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { GameList } from '../model/games.interfaces';
import { EntityMap } from '@ngrx/signals/entities';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection: CollectionReference;
  user = inject(UserStore).user;
  users$: Observable<any>;
  firestore: Firestore = inject(Firestore);
  // updateGameListsRx = rxMethod<EntityMap<GameList>>(
  //   pipe(
  //     tapResponse({
  //       next: () => this.updateUser(),
  //       error: console.error,
  //     })
  //   )
  // );

  constructor() {
    this.usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(this.usersCollection, { idField: 'id' });
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  updateUser(update: Partial<User>): void {
    if (this.user()) {
      const userDoc = doc(this.firestore, 'users', this.user()!.id);
      updateDoc(userDoc, update);
    }
  }

  private createDefaultGameLists(): GameList[] {
    const listNames = ['Playing', 'Backlog', 'Played'];

    return listNames.map((name) => ({
      name,
      id: name.toLowerCase(),
      type: 'default',
      ranked: false,
      games: [],
    }));
  }

  createNewUser(config: UserConfig): void {
    const { firstName, lastName, username } = config;

    const user = {
      id: '',
      firstName,
      lastName,
      username,
      games: [],
      gameLists: this.createDefaultGameLists(),
      friendIds: [],
    };

    addDoc(collection(this.firestore, 'users'), user);
  }
}
