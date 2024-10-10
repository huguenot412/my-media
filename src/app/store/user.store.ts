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
import { User } from '../model/users.interfaces';

type UserState = {
  userFromApi: User | null;
};

const initialState: UserState = {
  userFromApi: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed(({ userFromApi }) => {
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
  }))
);
