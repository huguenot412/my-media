import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Firestore,
  CollectionReference,
  collection,
  collectionData,
  doc,
  updateDoc,
} from '@angular/fire/firestore';
import { User } from '../model/users.interfaces';

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
}
