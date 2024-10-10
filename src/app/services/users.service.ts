import { inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  Firestore,
  CollectionReference,
  collection,
  collectionData,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { FriendRequest, User, UserConfig } from '../model/users.interfaces';
import { UserStore } from '../store/user.store';
import { GameList } from '../model/games.interfaces';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection: CollectionReference;
  private friendRequestsCollection: CollectionReference;
  user = inject(UserStore).user;
  firestore: Firestore = inject(Firestore);
  users$: Observable<any>;
  friendRequestsSent$: Observable<FriendRequest[]> = of([]);
  friendRequestsReceived$: Observable<FriendRequest[]> = of([]);

  constructor() {
    this.usersCollection = collection(this.firestore, 'users');
    this.friendRequestsCollection = collection(
      this.firestore,
      'friendRequests'
    );
    this.users$ = collectionData(this.usersCollection, { idField: 'id' });
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  updateUser(update: Partial<User>): void {
    if (this.user() && this.user()?.id) {
      const userDoc = doc(this.firestore, 'users', this.user()!.id!);
      updateDoc(userDoc, update);
    }
  }

  updateFriendRequest(
    friendRequestId: string,
    update: Partial<FriendRequest>
  ): void {
    const friendRequestDoc = doc(
      this.firestore,
      'friendRequests',
      friendRequestId
    );
    updateDoc(friendRequestDoc, update);
  }

  createNewUser(config: UserConfig): void {
    const { firstName, lastName, username } = config;

    const user: User = {
      firstName,
      lastName,
      username,
      games: [],
      gameLists: this.createDefaultGameLists(),
      friends: [],
    };

    addDoc(collection(this.firestore, 'users'), user);
  }

  sendFriendRequest(sentToId: string, sentToUsername: string): void {
    // TODO: Return if friend request already exists

    if (this.user()) {
      const friendRequest = this.createFriendRequest(
        sentToId,
        sentToUsername
      ) as FriendRequest;

      addDoc(collection(this.firestore, 'friendRequests'), friendRequest);
    }
  }

  acceptFriendRequest(): void {}

  denyFriendRequest(): void {}

  getPendingFriendRequestsSent(): Observable<FriendRequest[]> {
    if (this.user()) {
      const pendingRequestsQuery = query(
        this.friendRequestsCollection,
        where('sentById', '==', this.user()!.id),
        where('status', '==', 'pending')
      );

      this.friendRequestsSent$ = collectionData(pendingRequestsQuery, {
        idField: 'id',
      }) as Observable<FriendRequest[]>;
    }

    return this.friendRequestsSent$;
  }

  getPendingFriendRequestsReceived(): Observable<FriendRequest[]> {
    if (this.user()) {
      const pendingRequestsQuery = query(
        this.friendRequestsCollection,
        where('sentToId', '==', this.user()!.id),
        where('status', '==', 'pending')
      );

      this.friendRequestsReceived$ = collectionData(pendingRequestsQuery, {
        idField: 'id',
      }) as Observable<FriendRequest[]>;
    }

    return this.friendRequestsReceived$;
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

  private createFriendRequest(
    sentToId: string,
    sentToUsername: string
  ): FriendRequest | void {
    if (this.user() && this.user()?.id) {
      return {
        sentById: this.user()!.id!,
        sentByUsername: this.user()!.username,
        sentToId,
        sentToUsername,
        timeSent: JSON.stringify(new Date()),
        timeAcknowledged: null,
        status: 'pending',
      };
    }
  }
}
