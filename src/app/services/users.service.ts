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
import {
  Friend,
  FriendRequest,
  User,
  UserConfig,
} from '../model/users.interfaces';
import { UserStore } from '../store/user.store';
import { GameList } from '../model/games.interfaces';
import { GameListsStore } from '../store/game-lists.store';
import { GamesStore } from '../store/games.store';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private usersCollection: CollectionReference;
  private friendRequestsCollection: CollectionReference;
  userStore = inject(UserStore);
  gameListsStore = inject(GameListsStore);
  gamesStore = inject(GamesStore);
  user = this.userStore.user;
  firestore: Firestore = inject(Firestore);
  users$: Observable<any>;
  friendRequestsSent$: Observable<FriendRequest[]> = of([]);
  friendRequestsReceived$: Observable<FriendRequest[]> = of([]);
  friendRequestsAccepted$: Observable<FriendRequest[]> = of([]);

  constructor() {
    this.usersCollection = collection(this.firestore, 'users');
    this.friendRequestsCollection = collection(
      this.firestore,
      'friendRequests'
    );
    // TODO: Remove for production
    this.users$ = collectionData(this.usersCollection, { idField: 'id' });
  }

  setUser(user: User): void {
    this.userStore.setUser(user);
    this.userStore.setFriends(user.friends);
    this.gamesStore.setGames(user.games);
    this.gameListsStore.setLists(user.gameLists);
    this.getAcceptedFriendRequests();
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  updateUser(update: Partial<User>, userId: string = this.user()?.id!): void {
    const userDoc = doc(this.firestore, 'users', userId);
    updateDoc(userDoc, update);
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

  addFriend(user: User, friendRequestId: string, friendId: string): void {
    const friend: Friend = {
      id: friendId,
      friendRequestId: friendRequestId,
    };
    const update: Partial<User> = {
      friends: [...user.friends, friend],
    };
    this.userStore.addFriend(friend);
    this.updateUser(update);
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
    // Subscribe to accepted requests on app init to add new friends
    const friendRequest = this.createFriendRequest(
      sentToId,
      sentToUsername
    ) as FriendRequest;

    addDoc(collection(this.firestore, 'friendRequests'), friendRequest);
  }

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

  getAcceptedFriendRequests(): Observable<FriendRequest[]> {
    if (this.user()) {
      const pendingRequestsQuery = query(
        this.friendRequestsCollection,
        where('sentToId', '==', this.user()!.id),
        where('status', '==', 'accepted')
      );

      this.friendRequestsReceived$ = collectionData(pendingRequestsQuery, {
        idField: 'id',
      }) as Observable<FriendRequest[]>;
    }

    return this.friendRequestsAccepted$;
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
