import {
  patchState,
  signalStore,
  withComputed,
  withMethods,
  withState,
} from '@ngrx/signals';
import { GamesStore } from './games.store';
import { computed, inject } from '@angular/core';
import { GameListsStore } from './game-lists.store';
import { Friend, User } from '../model/users.interfaces';
import { addEntities, addEntity, setAllEntities, withEntities } from '@ngrx/signals/entities';

type UserState = {
  userFromApi: User | null;
};

const initialState: UserState = {
  userFromApi: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withEntities<Friend>(),
  withComputed(({ userFromApi, entities }) => {
    const gamesStore = inject(GamesStore);
    const gameListsStore = inject(GameListsStore);

    return {
      user: computed<User | null>(() => {
        let localUser = userFromApi();

        if (localUser) {
          return {
            ...localUser,
            games: gamesStore.entities(),
            gameLists: gameListsStore.entities(),
            friends: entities(),
          };
        }

        return null;
      }),
    };
  }),
  withMethods((store) => ({
    setUser(user: User | null): void {
      patchState(store, () => ({
        userFromApi: user,
      }));
    },
    setFriends(friends: Friend[]): void {
      patchState(store, setAllEntities(friends))
    },
    addFriend(friend: Friend): void {
      patchState(store, addEntity(friend))
    },
  }))
);
