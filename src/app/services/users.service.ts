import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
import { GameList } from '../model/games.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private usersCollection: CollectionReference;
  users$: Observable<any>;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.usersCollection = collection(this.firestore, 'users');
    this.users$ = collectionData(this.usersCollection, { idField: 'id' });
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  updateUser(id: string, data: Partial<User>): void {
    const userDoc = doc(this.firestore, 'users', id);
    updateDoc(userDoc, data);
  }

  private createDefaultGameLists(): GameList[] {
    const listNames = ['Played', 'Playing', 'Backlog'];

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
