import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap } from 'rxjs';
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
  friendIds$: Observable<string[]> = of([]); // List of user

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
    this.getFriendIds().subscribe((friendIds) =>
      this.userStore.setFriends(friendIds)
    );
    this.gamesStore.setGames(user.games);
    this.gameListsStore.setLists(user.gameLists);
  }

  getUsers(): Observable<User[]> {
    return this.users$;
  }

  getUsersById(userIds: string[]): Observable<User[]> {
    // Untested, not sure if works properly
    const usersQuery = query(this.usersCollection, where('id', 'in', userIds));

    return collectionData(usersQuery, {
      idField: 'id',
    }) as Observable<User[]>;
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

  // addFriend(user: User, friendRequestId: string, friendId: string): void {
  //   const friend: Friend = {
  //     id: friendId,
  //     friendRequestId: friendRequestId,
  //   };
  //   const update: Partial<User> = {
  //     friends: [...user.friends, friend],
  //   };
  //   this.userStore.addFriend(friend);
  //   this.updateUser(update);
  // }

  createNewUser(config: UserConfig): void {
    const { firstName, lastName, username } = config;

    const user: User = {
      firstName,
      lastName,
      username,
      games: [],
      gameLists: this.createDefaultGameLists(),
      friendIds: [],
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
      const pendingRequestsSentQuery = query(
        this.friendRequestsCollection,
        where('sentById', '==', this.user()!.id),
        where('status', '==', 'pending')
      );

      this.friendRequestsSent$ = collectionData(pendingRequestsSentQuery, {
        idField: 'id',
      }) as Observable<FriendRequest[]>;
    }

    return this.friendRequestsSent$;
  }

  getPendingFriendRequestsReceived(): Observable<FriendRequest[]> {
    if (this.user()) {
      const pendingRequestsReceivedQuery = query(
        this.friendRequestsCollection,
        where('sentToId', '==', this.user()!.id),
        where('status', '==', 'pending')
      );

      this.friendRequestsReceived$ = collectionData(
        pendingRequestsReceivedQuery,
        {
          idField: 'id',
        }
      ) as Observable<FriendRequest[]>;
    }

    return this.friendRequestsReceived$;
  }

  getFriendIds(): Observable<string[]> {
    if (this.user()) {
      const acceptedSentRequestsQuery = query(
        this.friendRequestsCollection,
        where('status', '==', 'accepted'),
        where('sentById', '==', this.user()!.id)
      );

      const acceptedReceivedRequestsQuery = query(
        this.friendRequestsCollection,
        where('status', '==', 'accepted'),
        where('sentToId', '==', this.user()!.id)
      );

      const acceptedSentRequests$ = collectionData(acceptedSentRequestsQuery, {
        idField: 'id',
      }) as Observable<FriendRequest[]>;

      const acceptedReceivedRequests$ = collectionData(
        acceptedReceivedRequestsQuery,
        {
          idField: 'id',
        }
      ) as Observable<FriendRequest[]>;

      this.friendIds$ = combineLatest([
        acceptedSentRequests$,
        acceptedReceivedRequests$,
      ]).pipe(
        map(([sentBy, sentTo]) => [
          ...sentBy.map((request) => request.sentToId),
          ...sentTo.map((request) => request.sentById),
        ])
      );
    }

    return this.friendIds$;
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
