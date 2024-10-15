import { inject, Injectable } from '@angular/core';
import { combineLatest, map, Observable, of, switchMap, tap } from 'rxjs';
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
  FriendRequest,
  ProtoUser,
  User,
  UserConfig,
} from '../model/users.interfaces';
import { UserStore } from '../store/user.store';
import { GameList, GameListType } from '../model/games.interfaces';
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
  friends$: Observable<User[]> = of([]);
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
    this.getFriendIds()
      .pipe(
        tap((ids) => console.log('friend ids: ', ids)),
        switchMap((friendIds) => this.getFriends(friendIds)),
        tap((friends) => console.log('friends :', friends))
      )
      .subscribe((friends) => this.userStore.setFriends(friends));
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

  createNewUser(config: UserConfig): void {
    const { firstName, lastName, username } = config;

    const user: ProtoUser = {
      firstName,
      lastName,
      username,
      games: [],
      gameLists: this.createDefaultGameLists(),
    };

    addDoc(collection(this.firestore, 'users'), user);
  }

  sendFriendRequest(sentToId: string, sentToUsername: string): void {
    // TODO: Return if friend request already exists
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

  getFriends(friendIds: string[]): Observable<User[]> {
    if (this.user()) {
      const friendsQuery = query(
        this.usersCollection,
        where('__name__', 'in', friendIds)
      );

      this.friends$ = collectionData(friendsQuery, {
        idField: 'id',
      }) as Observable<User[]>;
    }

    return this.friends$;
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

  createGameList(name: string, type: GameListType): GameList {
    return {
      name,
      id: name.toLowerCase(),
      type,
      ranked: false,
      games: [],
      lastUpdated: JSON.stringify(new Date()),
      groups: [],
    };
  }

  private createDefaultGameLists(): GameList[] {
    const listNames = ['Playing', 'Backlog', 'Played'];

    return listNames.map((name) => this.createGameList(name, 'default'));
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
